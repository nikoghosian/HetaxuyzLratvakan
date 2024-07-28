require('dotenv').config();
const express = require('express');
const Sequelize = require('./db');
const { NewsRouter, CountryRouter, CategorieRouter, LiveRouter, AdminRouter } = require('./router');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const PORT = process.env.PORT || 4000;
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const swaggerDocument = require('./swagger.json');
const fs = require('fs');
app.use(cors());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(fileUpload({}));
app.use(express.static(path.resolve(__dirname, 'static')));

app.use('/news', NewsRouter);
app.use('/countries', CountryRouter);
app.use('/categories', CategorieRouter);
app.use('/live', LiveRouter);
app.use('/admin', AdminRouter);

const start = async () => {
  try {
    await Sequelize.authenticate();
    await Sequelize.sync({ alter: true });
    app.listen(process.env.PORT || 8080, () => console.log('Server OK'));
  } catch (e) {
    console.log(e);
  }
};

start();

///////////////////////////////////////////FOR REMOVE DATA OF THE TABLES\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

// async function clearDatabase() {
//   try {
//     await Sequelize.sync({ force: true });

//     console.log('Database cleared successfully.');
//   } catch (error) {
//     console.error('Error clearing the database:', error);
//   } finally {
//     await Sequelize.close();
//   }
// }

// clearDatabase();
