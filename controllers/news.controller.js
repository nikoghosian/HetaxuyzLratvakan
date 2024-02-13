const { NewsDto, Country, Categorie, NewsContent, Image, Video } = require('../models/models');
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
        imageAuthor,
        imageTitle,
        videoAuthor,
        videoTitle,
      } = req.body;
      const { img, bigImage, videoFile } = req.files;

      console.log(title, description, contentTitle, imageTitle, categoryId);

      const smallImageType = img.mimetype.split('/')[1];
      const fileName = uuid.v4() + '.' + smallImageType;
      img.mv(path.resolve(__dirname, '..', 'static', fileName));

      let image, video;
      if (bigImage) {
        const bigImageType = bigImage.mimetype.split('/')[1];

        const bigFileNamee = uuid.v4() + '.' + bigImageType;
        bigImage.mv(path.resolve(__dirname, '..', 'static', bigFileNamee));
        image = await Image.create({
          url: bigFileNamee,
          title: imageTitle,
          author: imageAuthor,
        });
      } else {
        const videoType = videoFile.mimetype.split('/')[1];
        const videoFileName = uuid.v4() + '.' + videoType;
        videoFile.mv(path.resolve(__dirname, '..', 'static', videoFileName));

        video = await Video.create({
          url: videoFileName,
          title: videoTitle,
          author: videoAuthor,
        });
      }

      const content = await NewsContent.create({
        title: contentTitle,
        description: contentDescription,
        author,
        imageId: bigImage ? image.id : null,
        videoId: videoFile ? video.id : null,
      });

      const news = await NewsDto.create({
        title,
        description,
        countryId,
        categoryId,
        img: fileName,
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
          { model: Categorie, as: 'categorie' },
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
          { model: Categorie, as: 'categorie' },
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
                model: Video,
                as: 'video',
              },
              {
                model: Image,
                as: 'image',
              },
            ],
          },
          { model: Country, as: 'country' },
          { model: Categorie, as: 'categorie' },
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
      return res.status(400).json({ success: false, message: 'Bad Request' });
    } catch (e) {
      res.status(400).json({ success: false });
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
        imageAuthor,
        imageTitle,
        videoAuthor,
        videoTitle,
      } = req.body;
      const { img, bigImage, videoFile } = req.files;

      const newsDto = await NewsDto.findByPk(id, {
        include: [{ model: NewsContent, as: 'newsContent' }],
      });

      const smallImageType = img.mimetype.split('/')[1];
      const fileName = uuid.v4() + '.' + smallImageType;
      img.mv(path.resolve(__dirname, '..', 'static', fileName));

      let image, video;
      if (bigImage) {
        const bigImageType = bigImage.mimetype.split('/')[1];

        const bigFileNamee = uuid.v4() + '.' + bigImageType;
        bigImage.mv(path.resolve(__dirname, '..', 'static', bigFileNamee));
        image = await Image.update(
          {
            url: bigFileNamee,
            title: imageTitle,
            Author: imageAuthor,
          },
          {
            where: {
              id: newsDto.newsContent.imageId,
            },
          },
        );
      } else {
        const videoType = videoFile.mimetype.split('/')[1];

        const videoFileName = uuid.v4() + '.' + videoType;
        videoFile.mv(path.resolve(__dirname, '..', 'static', videoFileName));

        video = await Video.update(
          {
            url: videoFileName,
            title: videoTitle,
            author: videoAuthor,
          },
          {
            where: {
              id: newsDto.newsContent.videoId,
            },
          },
        );
      }

      await NewsContent.update(
        {
          title: contentTitle,
          description: contentDescription,
          author,
          imageId: bigImage ? newsDto.dataValues.newsContent.dataValues.imageId : null,
          videoId: videoFile ? newsDto.dataValues.newsContent.dataValues.videoId : null,
        },
        {
          where: { id: newsDto.newsContentId },
        },
      );

      await NewsDto.update(
        {
          title,
          description,
          countryId,
          categoryId,

          img: fileName,
        },
        { where: { id } },
      );

      res.send({ success: true });
    } catch (e) {
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
