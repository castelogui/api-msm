import request from "supertest";
import { server } from '../../src/server';
import { CreateUserRequest } from '../../src/models/interfaces/user/CreateUserRequest';
import { describe, expect, it, afterAll, beforeAll } from '@jest/globals';
import prismaClient from "../../src/prisma";
import { hash } from "bcryptjs";


// Função para realizar login e obter o token JWT
const login = async (email: string, password: string) => {
  const response = await request(server)
    .post("/auth")
    .send({ email, password });

  return response.body.token // Considerando que o token esteja em `response.body.token`
};

describe('User creation', () => {
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

  it('should create a user successfully', async () => {
    // Tipar o objeto `data` explicitamente como `CreateUserRequest`
    const userData: CreateUserRequest = {
      username: 'johndoe',
      firstname: 'John',
      lastname: 'Doe',
      email: 'john.doe@example.com',
      cpf: '12345678901',
      password: 'password123',
      dt_birth: new Date('1990-01-01'),
    };

    const response = await request(server).post("/user")
      .set("Authorization", `Bearer ${token}`).send(userData);

    // Verificar se o usuário foi criado corretamente
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
  });

  it('should fail when creating a user with invalid token', async () => {
    // Tipar o objeto `data` explicitamente como `CreateUserRequest`
    const userData: CreateUserRequest = {
      username: 'johndoeinvalidtoken',
      firstname: 'John',
      lastname: 'Doe',
      email: 'john.doe.invalidtoken@example.com',
      cpf: '12345678901-invalidtoken',
      password: 'password123',
      dt_birth: new Date('1990-01-01'),
    };

    const response = await request(server).post("/user").set("Authorization", `Bearer 123456`).send(userData);

    // Verificar se houve retorno "Não autorizado"
    expect(response.status).toBe(401);
  });

  it('should fail when creating a user with null token', async () => {
    // Tipar o objeto `data` explicitamente como `CreateUserRequest`
    const userData: CreateUserRequest = {
      username: 'johndoeinvalidtoken',
      firstname: 'John',
      lastname: 'Doe',
      email: 'john.doe.invalidtoken@example.com',
      cpf: '12345678901-invalidtoken',
      password: 'password123',
      dt_birth: new Date('1990-01-01'),
    };

    const response = await request(server).post("/user").set("Authorization", ``).send(userData);

    // Verificar se houve retorno "Não autorizado"
    expect(response.status).toBe(401);
  });

  it('should fail when creating a user with repeated email', async () => {
    // Tipar o objeto `data` explicitamente como `CreateUserRequest`
    const userData: CreateUserRequest = {
      username: 'johndoe2',
      firstname: 'John 2',
      lastname: 'Doe 2',
      email: 'john.doe@example.com',
      cpf: '12345678902',
      password: 'password123',
      dt_birth: new Date('1990-01-01'),
    };

    // Tenta criar o usuário e valida o erro: email repetido
    const response = await request(server).post("/user").set("Authorization", `Bearer ${token}`).send(userData)

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(response.body).toStrictEqual({ "error": "This email already exists" });

  });

  it('should fail when creating a user with repeated username', async () => {
    // Tipar o objeto `data` explicitamente como `CreateUserRequest`
    const userData: CreateUserRequest = {
      username: 'johndoe',
      firstname: 'John 3',
      lastname: 'Doe 3',
      email: 'john3.doe3@example.com',
      cpf: '12345678903',
      password: 'password123',
      dt_birth: new Date('1990-01-01'),
    };

    // Tenta criar o usuário e valida o erro: username repetido
    const response = await request(server).post("/user").set("Authorization", `Bearer ${token}`).send(userData)
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(response.body).toStrictEqual({ "error": "This username already exists" });

  });

  it('should fail when creating a user with repeated cpf', async () => {
    // Tipar o objeto `data` explicitamente como `CreateUserRequest`
    const userData: CreateUserRequest = {
      username: 'johndoe4',
      firstname: 'John 4',
      lastname: 'Doe 4',
      email: 'john4.doe4@example.com',
      cpf: '12345678901',
      password: 'password123',
      dt_birth: new Date('1990-01-01'),
    };

    // Tenta criar o usuário e valida o erro: cpf repetido
    const response = await request(server).post("/user").set("Authorization", `Bearer ${token}`).send(userData)
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(response.body).toStrictEqual({ "error": "This cpf already exists" });

  });


  it('should fail when creating a user with field undefined', async () => {
    // Tipar o objeto `data` explicitamente como `CreateUserRequest`
    const userData: CreateUserRequest = {
      email: '',
      cpf: '12345678904',
      username: 'johnDoe4',
      password: 'password123',
      firstname: 'John 4',
      lastname: 'Doe 4',
      dt_birth: new Date('1990-01-01'),
    };

    // Tenta criar o usuário e valida o erro: cpf e email indefinido
    const response = await request(server).post("/user").set("Authorization", `Bearer ${token}`).send(userData)
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
    Object.keys(userData).forEach((key) => {
      if (!userData[key]) {
        expect(response.body).toStrictEqual({ "error": `Invalid field, ${key} cannot be null` });
      }
    });

  });
});
