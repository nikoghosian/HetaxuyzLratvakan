require('dotenv').config();
const express = require('express');
const Sequelize = require('./db');
const { NewsRouter, CountryRouter, CategorieRouter, LiveRouter } = require('./router');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const path = require('path');
const swaggerUi = require('swagger-ui-express');

const PORT = process.env.PORT || 5005;
const app = express();

const swaggerDocument = require('./swagger.json');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(express.json());
app.use(bodyParser.json());
app.use(fileUpload({}));
app.use(express.static(path.resolve(__dirname, 'static')));

app.use('/api/v1/news', NewsRouter);
app.use('/api/v1/countries', CountryRouter);
app.use('/api/v1/categories', CategorieRouter);
app.use('/api/v1/live', LiveRouter);

const start = async () => {
  try {
    await Sequelize.authenticate();
    await Sequelize.sync();
    app.listen(PORT, () => console.log(`Server Started On Port ${PORT}`));
  } catch (e) {
    console.log(e);
  }
};

start();

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
