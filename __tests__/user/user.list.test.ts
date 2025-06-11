import { ListUserResponse } from './../../src/models/interfaces/user/ListUserResponse';
import { afterAll, beforeAll, describe, expect, it } from "@jest/globals";
import request from "supertest";
import { server } from "../../src/server";
import prismaClient from '../../src/prisma';
import { hash } from 'bcryptjs';
import { CreateUserRequest } from '../../src/models/interfaces/user/CreateUserRequest';

// Função para realizar login e obter o token JWT
const login = async (email: string, password: string) => {
  const response = await request(server)
    .post("/auth")
    .send({ email, password });

  return response.body.token // Considerando que o token esteja em `response.body.token`
};

describe("User listing", () => {
  let token: string;
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

    await prismaClient.user.create({ data: userData })
    // Realiza o login e obtém o token
    token = await login('admin@admin.com', 'admin');
  });

  afterAll(async () => {
    // Remove todos os registros da tabela `user`
    await prismaClient.user.deleteMany({});
    await prismaClient.$disconnect();
    server.close();
  });

  it("should list all users successfully", async () => {
    // Lista todos os usuários
    const response = await request(server)
      .get("/user")
      .set("Authorization", `Bearer ${token}`)
    const responseBody: ListUserResponse[] = response.body;

    expect(response.status).toBe(200);
    expect(response.status).toBe(200);
    expect(responseBody).toBeDefined();
  });

  it("should fail list all users with invalid token", async () => {
    // Lista todos os usuários
    const response = await request(server)
      .get("/user")
      .set("Authorization", `Bearer 123456`)
    const responseBody: ListUserResponse[] = response.body;

    expect(response.status).toBe(401);
  });
})