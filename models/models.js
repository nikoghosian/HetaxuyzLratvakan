const sequelize = require('../db');
const { DataTypes } = require('sequelize');

const NewsContent = sequelize.define('NewsContent', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT('long'),
    allowNull: false,
  },
  author: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fileId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

const NewsDto = sequelize.define('NewsDto', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT('long'),
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
  middleImage: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

const File = sequelize.define('file', {
  url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  title: {
    type: DataTypes.TEXT('long'),
    allowNull: false,
  },
  author: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isImage: {
    type: DataTypes.BOOLEAN,
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
