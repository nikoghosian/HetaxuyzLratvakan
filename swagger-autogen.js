const swaggerAutogen = require('swagger-autogen')();

const outputFile = './swagger.json';
const endpointsFiles = ['./router/*.js'];

const config = {
  info: {
    title: 'Blog API Documentation',
    description: '',
  },
  tags: [],
  host: 'https://hetakhuyz.am/server/',
  schemes: ['https'],
};

swaggerAutogen(outputFile, endpointsFiles, config);
