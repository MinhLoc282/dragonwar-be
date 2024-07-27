import swaggerJSDoc from 'swagger-jsdoc';
import { API_DOCS_HOST } from '../../config';

const swaggerDefinition = {
  info: {
    title: 'KAI SAMPLE API Docs V1',
    version: '1.0.0',
    description: 'KAI SAMPLE API Docs V1',
  },
  host: API_DOCS_HOST,
  basePath: '/v1',
  produces: ['application/json'],
  consumes: ['application/json'],
  securityDefinitions: {
    jwt: {
      type: 'apiKey',
      name: 'wallet',
      in: 'header',
    },
    Authorization: {
      type: 'apiKey',
      name: 'Authorization',
      description: '(Bearer token)',
      in: 'header',
    }
  },
  security: [{ jwt: [] }, { Authorization: [] }],
};

const options = {
  swaggerDefinition,
  apis: [
    'server/components/**/*.route.js',
    'server/components/**/*.docs.js',
    'server/components/**/*.model.js',
    'server/api/validatorErrorHandler.js',
    'server/components/ftx/routes/ftx.routes.js',
    'server/components/vndirect/routes/vndirect.routes.js',
  ],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;

