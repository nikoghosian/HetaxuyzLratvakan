const { NewsDto, Country, Categorie, NewsContent, File, Live } = require('../models/models');
const uuid = require('uuid');
const path = require('path');
const { Op } = require('sequelize');
const moment = require('moment');

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
        url,
      } = req.body;
      if (url) {
        const { img, middleImage } = req.files;
        const middleImageType = middleImage.mimetype.split('/')[1];
        const middleImageName = uuid.v4() + '.' + middleImageType;
        middleImage.mv(path.resolve(__dirname, '..', 'static', middleImageName));

        const smallImageType = img.mimetype.split('/')[1];
        const smallFileName = uuid.v4() + '.' + smallImageType;
        img.mv(path.resolve(__dirname, '..', 'static', smallFileName));

        const file = await File.create({
          url: url,
          title: fileTitle,
          author: fileAuthor,
          isImage: false,
        });

        const content = await NewsContent.create({
          title: contentTitle,
          description: contentDescription,
          author,
          fileId: file.id,
        });
        const news = await NewsDto.create({
          title,
          countryId,
          categoryId,
          img: smallFileName,
          middleImage: middleImageName,
          newsContentId: content.id,
        });
        return res.send(news);
      }

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

      return res.send(news);
    } catch (e) {
      res.status(400).json({ success: false });
      console.log(e);
    }
  }

  async getAll(req, res) {
    try {
      const news = await NewsDto.findAll({
        order: [['createdAt', 'Desc']],
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

      return res.send(news);
    } catch (e) {
      console.error(e);
      res.status(400).json({ success: false });
    }
  }
  async getTodaysNews(req, res) {
    try {
      // const today = new Date();
      // today.setHours(0, 0, 0, 0);

      // const tomorrow = new Date(today);
      // tomorrow.setDate(today.getDate() + 1);

      // const todayNews = await NewsDto.findAll({
      //   limit: 7,
      //   where: {
      //     createdAt: {
      //
      //       [Op.between]: [today, tomorrow],
      //     },
      //   },
      //   include: [
      //     {
      //       model: NewsContent,
      //       as: 'newsContent',
      //       include: [{ model: File, as: 'file', where: { isImage: true } }],
      //       required: true,
      //     },
      //     { model: Country, as: 'country' },
      //   ],
      // });
      // return res.send(todayNews);
      const news = await NewsDto.findAll({
        limit: 4,
        order: [['createdAt', 'DESC']],
        include: [
          { model: Country, as: 'country' },
          { model: Categorie, as: 'category' },
          {
            model: NewsContent,
            as: 'newsContent',
            include: [{ model: File, as: 'file', where: { isImage: true } }],
            required: true,
          },
        ],
      });

      return res.send(news);
    } catch (e) {
      console.log(e);
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
        include: [
          { model: Country, as: 'country' },
          { model: Categorie, as: 'category' },
          {
            model: NewsContent,
            as: 'newsContent',
            include: [{ model: File, as: 'file', where: { isImage: true } }],
            required: true,
          },
        ],
      });

      return res.send(news);
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
        include: [
          { model: NewsContent, as: 'newsContent', include: [{ model: File, as: 'file' }] },
        ],
      });
      return res.send(news);
    } catch (e) {
      res.status(400).json({ success: false });
    }
  }

  async filters(req, res) {
    try {
      const { countryId, categoryId } = req.query;
      if (categoryId && countryId) {
        const news = await NewsDto.findAll({
          order: [['createdAt', 'DESC']],
          where: {
            countryId,
            categoryId,
          },

          include: [
            { model: Country, as: 'country' },
            { model: Categorie, as: 'category' },

            {
              model: NewsContent,
              as: 'newsContent',
              include: [{ model: File, as: 'file' }],
            },
          ],
        });
        return res.send(news);
      } else if (categoryId) {
        const newsNoCountry = await NewsDto.findAll({
          order: [['createdAt', 'DESC']],
          where: {
            categoryId,
          },
          include: [
            { model: Country, as: 'country' },
            { model: Categorie, as: 'category' },
            {
              model: NewsContent,
              as: 'newsContent',
              include: [{ model: File, as: 'file' }],
            },
          ],
        });
        return res.send(newsNoCountry);
      } else if (countryId) {
        const newsNoCategorie = await NewsDto.findAll({
          order: [['createdAt', 'DESC']],
          where: {
            countryId,
          },
          include: [
            { model: Country, as: 'country' },
            { model: Categorie, as: 'category' },
            {
              model: NewsContent,
              as: 'newsContent',
              include: [{ model: File, as: 'file' }],
            },
          ],
        });
        return res.send(newsNoCategorie);
      }
      return res.send(news);
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
      return res.send(news);
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
        url,
      } = req.body;

      const { middleImage, fileContent, img } = req.files ?? {};
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
            ? false
            : true;

        fileName = uuid.v4() + '.' + fileContentMimeType;
        fileContent.mv(path.resolve(__dirname, '..', 'static', fileName));
        file = await File.update(
          {
            url: fileName,
            title: fileTitle,
            author: fileAuthor,
            isImage: fileType,
          },
          { where: { id: newsDto.newsContent.fileId } },
        );
      } else {
        await File.update(
          {
            url: url,
            title: fileTitle,
            author: fileAuthor,
          },
          { where: { id: newsDto.newsContent.fileId } },
        );
      }
      // }

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
        countryId,
        description,
        categoryId,
        img: smallFileName ? smallFileName : newsDto.img,
        file: fileName ? fileName : newsDto.file,
        middleImage: middleImageName ? middleImageName : newsDto.middleImage,
        newsContentId: content.id,
      });

      return res.send(news);
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
        include: [
          {
            model: NewsContent,
            as: 'newsContent',
            include: [{ model: File, as: 'file', where: { isImage: true } }],
            required: true,
          },
        ],
      });
      return res.send(news);
    } catch (e) {
      console.log(e);
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
        include: [
          { model: NewsContent, as: 'newsContent', include: [{ model: File, as: 'file' }] },
          { model: Country, as: 'country' },
          { model: Categorie, as: 'category' },
        ],
      });

      const mostViewedNews = await NewsDto.findAll({
        limit: 3,
        order: [['views', 'DESC']],
        include: [
          { model: Country, as: 'country' },
          { model: Categorie, as: 'category' },
          { model: NewsContent, as: 'newsContent', include: [{ model: File, as: 'file' }] },
        ],
      });

      return res.json({ relatesNews, mostViewedNews });
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

      return res.json({ success: true });
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

      return res.send(news);
    } catch (e) {
      console.log(e);
      res.status(500).json({ success: false, message: 'Server Interval Error' });
    }
  }
  async getMostViewedVideo(req, res) {
    try {
      const videoNews = await NewsDto.findAll({
        limit: 3,
        order: [['views', 'DESC']],
        include: [
          {
            model: NewsContent,
            as: 'newsContent',
            include: [{ model: File, as: 'file', where: { isImage: false } }],
            required: true,
          },
        ],
      });
      return res.send(videoNews);
    } catch (e) {
      console.log(e);
      res.status(500).json({ success: false });
    }
  }
  async getNewsByCalendar(req, res) {
    try {
      const { date: datee } = req.query;
      const date = new Date(datee);
      const startDate = new Date(
        Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 0, 0, 0, 0),
      );
      const endDate = new Date(
        Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 23, 59, 59, 999),
      );

      console.log(startDate, endDate);
      const news = await NewsDto.findAll({
        where: {
          createdAt: {
            [Op.between]: [startDate, endDate],
          },
        },
      });

      return res.send(news);
    } catch (error) {
      console.error(error);

      return res.status(500).json({ message: 'Something went wrong' });
    }
  }
  async tesadaran(req, res) {
    try {
      const { page = 1, limit = 8 } = req.query;

      const offset = (page - 1) * limit;

      const news = await NewsDto.findAll({
        limit,
        offset,
      });
      return res.status(200).send(news);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Something Went Wrong.' });
    }
  }
}

module.exports = new NewsController();
