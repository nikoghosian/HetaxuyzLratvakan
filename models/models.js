const cors = require('cors');
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
  categoryId: {
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

const Admin = sequelize.define('Admin', {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: {
        msg: 'Invalid email format',
      },
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: {
        args: [[4, 32]],
        msg: 'Wrong Password Format',
      },
    },
  },
});

const Token = sequelize.define('Token', {
  adminId: {
    type: DataTypes.INTEGER,
  },
  refreshToken: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

Admin.hasOne(Token, { foreignKey: 'adminId' });
Token.belongsTo(Admin, { as: 'admin' });

NewsContent.hasOne(NewsDto, { foreignKey: 'newsContentId' });
NewsDto.belongsTo(NewsContent, { as: 'newsContent' });

Video.hasOne(NewsContent, { foreignKey: 'videoId' });
NewsContent.belongsTo(Video, { as: 'video' });

Image.hasOne(NewsContent, { foreignKey: 'imageId' });
NewsContent.belongsTo(Image, { as: 'image' });

Country.hasMany(NewsDto, { foreignKey: 'countryId' });
NewsDto.belongsTo(Country, { as: 'country' });

Categorie.hasMany(NewsDto, { foreignKey: 'categoryId' });
NewsDto.belongsTo(Categorie, { as: 'category' });

module.exports = {
  NewsContent,
  NewsDto,
  Country,
  Image,
  Video,
  Categorie,
  Live,
  Admin,
  Token,
};
