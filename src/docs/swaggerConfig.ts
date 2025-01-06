import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

// Configuração do Swagger
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API Music School Manager',
    version: '1.0.0',
    description: `
        Documentação gerada pelo Swagger da API Music School Manager, baseada 
        no projeto STOCK-API de https://github.com/marcosJuniorPassarella/stock-api
        `,
  },
  servers: [
    {
      url: 'http://localhost:3333', // Substitua pelo URL do seu servidor
    },
  ],
};

// Opções do Swagger
const options = {
  swaggerDefinition,
  apis: ['src/docs/documentation/userDocumentation.ts'], // Caminho para os arquivos de rotas com a documentação
};

// Gera a documentação Swagger com base nas opções
const swaggerSpec = swaggerJSDoc(options);

// Função que retorna o middleware do Swagger
export const setupSwagger = (app: any) => {
  app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
