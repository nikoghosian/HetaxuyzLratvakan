const swaggerAutogen = require('swagger-autogen')();

const outputFile = './swagger.json';
const endpointsFiles = ['./router/*.js'];

const config = {
  info: {
    title: 'Blog API Documentation',
    description: '',
  },
  tags: [],
  host: 'localhost:5000/api/v1',
  schemes: ['http'],
};

swaggerAutogen(outputFile, endpointsFiles, config);
