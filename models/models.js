const sequelize = require('../db');
const { DataTypes, BOOLEAN } = require('sequelize');

const NewsContent = sequelize.define('NewsContent', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT('long'),
  },
  author: {
    type: DataTypes.STRING,
  },
  fileId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
});

const NewsDto = sequelize.define('NewsDto', {
  title: {
    type: DataTypes.STRING,
  },
  description: {
    type: DataTypes.STRING,
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
  },
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  newsContentId: {
    type: DataTypes.INTEGER,
  },
  middleImage: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  order: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  onSlider: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
});

const File = sequelize.define('file', {
  url: {
    type: DataTypes.STRING,
  },
  title: {
    type: DataTypes.TEXT('long'),
  },
  author: {
    type: DataTypes.STRING,
  },
  isImage: {
    type: DataTypes.BOOLEAN,
  },
});

const Categorie = sequelize.define('Categorie', {
  title: {
    type: DataTypes.STRING,
  },
});
const Country = sequelize.define('Country', {
  title: {
    type: DataTypes.STRING,
  },
});

const Live = sequelize.define('live', {
  url: {
    type: DataTypes.STRING,
  },
  title: {
    type: DataTypes.STRING,
  },
});

const Admin = sequelize.define('Admin', {
  email: {
    type: DataTypes.STRING,
    unique: true,
    validate: {
      isEmail: {
        msg: 'Invalid email format',
      },
    },
  },
  password: {
    type: DataTypes.STRING,
    validate: {
      len: {
        args: [[4, 32]],
        msg: 'Wrong Password Format',
      },
    },
  },
});

NewsContent.hasOne(NewsDto, { foreignKey: 'newsContentId' });
NewsDto.belongsTo(NewsContent, { as: 'newsContent' });

File.hasOne(NewsContent, { foreignKey: 'fileId' });
NewsContent.belongsTo(File, { as: 'file' });

Country.hasMany(NewsDto, { foreignKey: 'countryId' });
NewsDto.belongsTo(Country, { as: 'country' });

Categorie.hasMany(NewsDto, { foreignKey: 'categoryId' });
NewsDto.belongsTo(Categorie, { as: 'category' });

module.exports = {
  NewsContent,
  NewsDto,
  Country,
  File,
  Categorie,
  Live,
  Admin,
};
