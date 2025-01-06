import { app } from "./app";

const server = app.listen(3333, () => {
  console.log('Servidor rodando em http://localhost:3333/');
  console.log('Acesse a documentação do Swagger em http://localhost:3333/api-docs');
});

export { server };