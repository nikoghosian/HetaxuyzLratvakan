const { NewsDto, Country, Categorie, NewsContent, File } = require('../models/models');
const uuid = require('uuid');
const path = require('path');
const { Op } = require('sequelize');
const { error } = require('console');

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
      const { img, fileContent } = req.files;
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
          fileContentMimeType === 'video/mp4' || fileContent.mimetype === 'video/quicktime'
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
      const countries = await NewsDto.findAll({
        include: [
          { model: NewsContent, as: 'newsContent' },
          { model: Country, as: 'country' },
          { model: Categorie, as: 'category' },
        ],
      });

      return res.send(countries);
    } catch (e) {
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
        limit: 2,
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
      res.send(error);
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
      const { img, fileContent } = req.files;

      const newsDto = await NewsDto.findByPk(id, {
        include: [{ model: NewsContent, as: 'newsContent' }],
      });

      let smallFileName, fileName;

      if (img) {
        const smallImageType = img.mimetype.split('/')[1];
        smallFileName = uuid.v4() + '.' + smallImageType;
        img.mv(path.resolve(__dirname, '..', 'static', smallFileName));
      }

      let file;
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
}

module.exports = new NewsController();
