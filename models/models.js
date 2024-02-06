const e = require('cors');
const sequelize = require('../db');
const { DataTypes } = require('sequelize');

const NewsContent = sequelize.define('NewsContent', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  author: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  imageId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  videoId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
});

const NewsDto = sequelize.define('NewsDto', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  img: {
    type: DataTypes.STRING,
  },
  views: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  countryId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  categorieId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  newsContentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

const Image = sequelize.define('Image', {
  url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  author: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

const Video = sequelize.define('Video', {
  url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  author: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

const Categorie = sequelize.define('Categorie', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});
const Country = sequelize.define('Country', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

const Live = sequelize.define('live', {
  url: {
    type: DataTypes.STRING,
  },
});

NewsContent.hasOne(NewsDto, { foreignKey: 'newsContentId' });
NewsDto.belongsTo(NewsContent, { as: 'newsContent' });

Video.hasOne(NewsContent, { foreignKey: 'videoId' });
NewsContent.belongsTo(Video, { as: 'video' });

Image.hasOne(NewsContent, { foreignKey: 'imageId' });
NewsContent.belongsTo(Image, { as: 'image' });

Country.hasMany(NewsDto, { foreignKey: 'countryId' });
NewsDto.belongsTo(Country, { as: 'country' });

Categorie.hasMany(NewsDto, { foreignKey: 'categorieId' });
NewsDto.belongsTo(Categorie, { as: 'categorie' });

module.exports = {
  NewsContent,
  NewsDto,
  Country,
  Image,
  Video,
  Categorie,
  Live,
};
