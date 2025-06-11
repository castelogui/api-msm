import request from 'supertest'
import { server } from '../../src/server';
import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';
import prismaClient from '../../src/prisma';
import { CreateUserRequest } from '../../src/models/interfaces/user/CreateUserRequest';
import { hash } from 'bcryptjs';
import { DeleteUserRequest } from '../../src/models/interfaces/user/DeleteUserRequest';

// Função para realizar login e obter o token JWT
const login = async (email: string, password: string) => {
  const response = await request(server)
    .post("/auth")
    .send({ email, password });

  return response.body.token // Considerando que o token esteja em `response.body.token`
};


describe('User deletion', () => {
  let token: string;
  let userDelete: DeleteUserRequest = {} as DeleteUserRequest
  let userToken: any = {}

  beforeAll(async () => {
    // Limpa o banco de dados antes dos testes
    await prismaClient.user.deleteMany({});

    // Cria um usuário para usar no login
    const pass = await hash('admin', 8)
    const userData: CreateUserRequest = {
      username: 'admin',
      firstname: 'Administrador',
      lastname: 'Sistema',
      email: 'admin@admin.com',
      cpf: '00000000000',
      password: pass,
      dt_birth: new Date('1990-01-01'),
      role_id: '1'
    };

    // Cria um usuário para usar no delete
    const passDelete = await hash('userdelete', 8)
    const userDataDelete = {
      username: 'userdelete',
      firstname: 'User',
      lastname: 'Delete',
      email: 'userdelete@email.com',
      cpf: '12345678910',
      password: passDelete,
      dt_birth: new Date('1990-01-01'),
    };

    userToken = await prismaClient.user.create({ data: userData })
    userDelete = await prismaClient.user.create({ data: userDataDelete });
    // Realiza o login e obtém o token
    token = await login('admin@admin.com', 'admin');

  })


  afterAll(async () => {
    // Remove todos os registros da tabela `user`
    await prismaClient.user.deleteMany({});
    await prismaClient.$disconnect();
    server.close();
  });

  it("should delete a user successfully", async () => {
    const responseDelete = await request(server)
      .delete(`/user/${userDelete.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ user_id: userToken.id })

    expect(responseDelete.status).toBe(200);

    const response = await request(server)
      .get(`/user/${userDelete.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ user_id: userToken.id })

    expect(response.status).toBe(404);
  });

  it("should return 404 if user not found", async () => {
    const responseDelete = await request(server)
      .delete(`/user/123`)
      .set('Authorization', `Bearer ${token}`)
      .send({ user_id: userToken.id })

    expect(responseDelete.status).toBe(400);
    expect(responseDelete.body).toEqual({ error: 'User not found' });
  });

  // não pode permitir que o mesmo usuário seja deletado por ele mesmo
  it("should return 401 if user try to delete himself", async () => {
    const responseDelete = await request(server)
      .delete(`/user/${userToken.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ user_id: userToken.id })

    expect(responseDelete.status).toBe(400);
    expect(responseDelete.body).toEqual({ error: 'You cannot delete yourself' });
  });
})

