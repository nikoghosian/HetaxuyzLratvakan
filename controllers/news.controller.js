const { NewsDto, Country, Categorie, NewsContent, File } = require('../models/models');
const uuid = require('uuid');
const path = require('path');
const { Op } = require('sequelize');

class NewsController {
  async create(req, res) {
    try {
      const {
        title,
        description,
        contentTitle,
        contentDescription,
        countryId,
        categoryId,
        author,
        fileAuthor,
        fileTitle,
      } = req.body;
      const { img, fileContent, middleImage } = req.files;

      const middleImageType = middleImage.mimetype.split('/')[1];
      const middleImageName = uuid.v4() + '.' + middleImageType;
      middleImage.mv(path.resolve(__dirname, '..', 'static', middleImageName));

      const smallImageType = img.mimetype.split('/')[1];
      const smallFileName = uuid.v4() + '.' + smallImageType;
      img.mv(path.resolve(__dirname, '..', 'static', smallFileName));

      const fileContentMimeType = fileContent.mimetype.split('/')[1];
      const fileName = uuid.v4() + '.' + fileContentMimeType;
      fileContent.mv(path.resolve(__dirname, '..', 'static', fileName));

      const file = await File.create({
        url: fileName,
        title: fileTitle,
        author: fileAuthor,
        isImage:
          'video/mp4'.includes(fileContentMimeType) ||
          'video/quicktime'.includes(fileContentMimeType)
            ? false
            : true,
      });

      const content = await NewsContent.create({
        title: contentTitle,
        description: contentDescription,
        author,
        fileId: file.id,
      });

      const news = await NewsDto.create({
        title,
        description,
        countryId,
        categoryId,
        img: smallFileName,
        file: fileName,
        middleImage: middleImageName,
        newsContentId: content.id,
      });

      res.send(news);
    } catch (e) {
      res.status(400).json({ success: false });
      console.log(e);
    }
  }

  async getAll(req, res) {
    try {
      let { page, limit } = req.query;

      page = page || 1;
      limit = limit || 6;
      const offset = (page - 1) * limit;

      const countries = await NewsDto.findAll({
        include: [
          { model: NewsContent, as: 'newsContent' },
          { model: Country, as: 'country' },
          { model: Categorie, as: 'category' },
        ],
        limit,
        offset: offset,
      });

      return res.send(countries);
    } catch (e) {
      console.error(e);
      res.status(400).json({ success: false });
    }
  }

  async getTodaysNews(req, res) {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);

      const todayNews = await NewsDto.findAll({
        limit: 4,
        where: {
          createdAt: {
            [Op.between]: [today, tomorrow],
          },
        },
        include: [
          { model: NewsContent, as: 'newsContent' },
          { model: Country, as: 'country' },
          { model: Categorie, as: 'category' },
        ],
      });
      return res.send(todayNews);
    } catch (e) {
      res.status(400).json({ success: false });
    }
  }

  async getOne(req, res) {
    try {
      const { id } = req.params;

      await NewsDto.increment('views', { by: 1, where: { id } });

      const news = await NewsDto.findByPk(id, {
        include: [
          {
            model: NewsContent,
            as: 'newsContent',
            include: [
              {
                model: File,
                as: 'file',
              },
            ],
          },
          { model: Country, as: 'country' },
          { model: Categorie, as: 'category' },
        ],
      });
      if (!news) {
        return res.status(404).json({ success: true });
      }

      return res.send(news);
    } catch (e) {
      console.log(e);
      res.status(400).json({ success: false });
    }
  }

  async getMostViewed(req, res) {
    try {
      const news = await NewsDto.findAll({
        limit: 3,
        order: [['views', 'DESC']],
      });

      res.json(news);
    } catch (e) {
      res.status(400).json({ success: false });
    }
  }

  async search(req, res) {
    try {
      const { search } = req.query;
      const news = await NewsDto.findAll({
        where: {
          title: { [Op.iLike]: `%${search}%` },
        },
      });
      res.send(news);
    } catch (e) {
      res.status(400).json({ success: false });
    }
  }

  async filters(req, res) {
    try {
      const { countryId, categoryId } = req.query;
      if (categoryId && countryId) {
        const news = await NewsDto.findAll({
          where: {
            countryId,
            categoryId,
          },
        });
        return res.send(news);
      } else if (categoryId) {
        const newsNoCountry = await NewsDto.findAll({
          where: {
            categoryId,
          },
        });
        return res.send(newsNoCountry);
      } else if (countryId) {
        const newsNoCategorie = await NewsDto.findAll({
          where: {
            countryId,
          },
        });
        return res.send(newsNoCategorie);
      }
      res.send(news);
    } catch (e) {
      console.log(e);
      return res.status(400).json({ success: false, message: 'Bad Request' });
    }
  }

  async relatesNews(req, res) {
    try {
      const { categoryId } = req.query;

      const news = await NewsDto.findAll({
        where: {
          categoryId,
        },
      });
      res.send(news);
    } catch (e) {
      res.status(400).json({ success: false });
    }
  }

  async editNews(req, res) {
    try {
      const { id } = req.params;
      const {
        title,
        description,
        contentTitle,
        contentDescription,
        countryId,
        categoryId,
        author,
        fileAuthor,
        fileTitle,
      } = req.body;
      const { img, fileContent, middleImage } = req.files;

      const newsDto = await NewsDto.findByPk(id, {
        include: [{ model: NewsContent, as: 'newsContent' }],
      });

      let smallFileName, fileName, middleImageName;

      if (img) {
        const smallImageType = img.mimetype.split('/')[1];
        smallFileName = uuid.v4() + '.' + smallImageType;
        img.mv(path.resolve(__dirname, '..', 'static', smallFileName));
      }

      let file;

      if (middleImage) {
        const middleImageType = middleImage.mimetype.split('/')[1];
        middleImageName = uuid.v4() + '.' + middleImageType;
        middleImage.mv(path.resolve(__dirname, '..', 'static', middleImageName));
      }

      if (fileContent) {
        const fileContentMimeType = fileContent.mimetype.split('/')[1];
        const fileType =
          fileContentMimeType === 'video/mp4' || fileContentMimeType === 'video/quicktime'
            ? 'video'
            : 'image';

        fileName = uuid.v4() + '.' + fileContentMimeType;
        fileContent.mv(path.resolve(__dirname, '..', 'static', fileName));
        file = await File.update(
          {
            url: fileName,
            title: fileTitle,
            author: fileAuthor,
            isImage: fileType === 'image' ? true : false,
          },
          { where: { id: newsDto.newsContent.fileId } },
        );
      }

      const content = await NewsContent.update(
        {
          title: contentTitle,
          description: contentDescription,
          author,
          fileId: file ? file.id : newsDto.newsContent.fileId,
        },
        { where: { id: newsDto.newsContent.id } },
      );

      const news = await newsDto.update({
        title,
        description,
        countryId,
        categoryId,
        img: img ? smallFileName : newsDto.img,
        file: fileContent ? fileName : newsDto.file,
        middleImage: middleImage ? middleImageName : newsDto.middleImage,
        newsContentId: content.id,
      });

      res.send(news);
    } catch (e) {
      console.log(e);
      res.status(400).json({ success: false });
    }
  }

  async getMostViewedByCountryId(req, res) {
    try {
      const { id } = req.params;

      const news = await NewsDto.findAll({
        where: {
          countryId: id,
        },
        limit: 3,
        order: [['views', 'DESC']],
      });
      res.send(news);
    } catch (e) {
      res.status(400).json({ success: false });
    }
  }

  async getMostViewedAndRelatesNews(req, res) {
    try {
      const { id } = req.params;
      const relatesNews = await NewsDto.findAll({
        where: {
          categoryId: id,
        },
        limit: 3,
      });

      const mostViewedNews = await NewsDto.findAll({
        limit: 3,
        order: [['views', 'DESC']],
      });

      res.json({ relatesNews, mostViewedNews });
    } catch (e) {
      res.status(400).json({ success: false });
    }
  }
  async deleteNews(req, res) {
    try {
      const { id } = req.params;
      await NewsDto.destroy({
        where: {
          id,
        },
      });

      res.json({ success: true });
    } catch (e) {
      console.log(e);
      res.status(404).json({ success: false });
    }
  }

  async getLatestNews(req, res) {
    try {
      const { limit } = req.query;

      const latestNews = await NewsDto.findAll({
        limit: parseInt(limit),
        order: [['createdAt', 'DESC']],
        include: [{ model: Country, as: 'country' }],
      });
      return res.send(latestNews);
    } catch (e) {
      console.error(e);
      res.status(500).json({ success: false });
    }
  }

  async getCategoriesAndNews(req, res) {
    try {
      const { id } = req.params;
      let news = await Categorie.findAll({
        include: [
          {
            model: NewsDto,
            limit: 3,
            attributes: ['title', 'description', 'img', 'createdAt'],
            where: { countryId: id },
          },
        ],
        attributes: ['id', 'title'],
      });

      res.send(news);
    } catch (e) {
      console.log(e);
      res.status(500).json({ success: false, message: 'Server Interval Error' });
    }
  }
}

module.exports = new NewsController();
