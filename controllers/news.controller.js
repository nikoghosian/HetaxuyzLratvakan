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
        categorieId,
        author,
        ImageAuthor,
        ImageTitle,
        videoAuthor,
        videoTitle,
      } = req.body;
      const { img, bigImage, videoFile } = req.files;

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
          title: ImageTitle,
          author: ImageAuthor,
        });
      } else {
        const videoType = videoFile.mimetype.split('/')[1];
        console.log('====================================');
        console.log(videoType);
        console.log('====================================');
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
        categorieId,
        img: fileName,
        newsContentId: content.id,
      });

      res.send(news);
    } catch (e) {
      throw e;
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
      throw e;
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
      throw e;
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

      return res.send(news);
    } catch (e) {
      throw e;
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
      throw e;
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
      throw e;
    }
  }

  async filters(req, res) {
    try {
      const { countryId, categorieId } = req.query;
      if (categorieId && countryId) {
        const news = await NewsDto.findAll({
          where: {
            countryId,
            categorieId,
          },
        });
        return res.send(news);
      } else if (categorieId) {
        const newsNoCountry = await NewsDto.findAll({
          where: {
            categorieId,
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
      throw e;
    }
  }

  async relatesNews(req, res) {
    try {
      const { categorieId } = req.query;

      const news = await NewsDto.findAll({
        where: {
          categorieId,
        },
      });
      res.send(news);
    } catch (e) {
      throw e;
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
        categorieId,
        author,
        ImageAuthor,
        ImageTitle,
        videoAuthor,
        videoTitle,
      } = req.body;
      const { img, bigImage, videoFile } = req.files;

      const newsDto = await NewsDto.findByPk(id, {
        include: [{ model: NewsContent, as: 'newsContent' }],
      });
      console.log(newsDto.newsContent);

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
            title: ImageTitle,
            Author: ImageAuthor,
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

      const content = await NewsContent.update(
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

      const news = await NewsDto.update(
        {
          title,
          description,
          countryId,
          categorieId,

          img: fileName,
        },
        { where: { id } },
      );

      res.send({ success: true });
    } catch (e) {
      throw e;
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
      throw e;
    }
  }

  async getMostViewedAndRelatesNews(req, res) {
    try {
      const { id } = req.params;
      const relatesNews = await NewsDto.findAll({
        where: {
          categorieId: id,
        },
        limit: 3,
      });

      const mostViewedNews = await NewsDto.findAll({
        limit: 3,
        order: [['views', 'DESC']],
      });

      res.json({ relatesNews, mostViewedNews });
    } catch (e) {
      throw e;
    }
  }
}

module.exports = new NewsController();
