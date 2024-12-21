import { afterAll, beforeAll, describe, expect, it } from "@jest/globals";
import request from "supertest";
import { server } from "../../src/server";
import { compare, hash } from "bcryptjs";
import prismaClient from "../../src/prisma";
import { CreateUserRequest } from "../../src/models/interfaces/user/CreateUserRequest";


const userData = {
  username: "johndoe07",
  firstname: "John07",
  lastname: "Doe07",
  email: "john07.doeEdit@example.com",
  cpf: "12345678907",
  password: "password123",
  dt_birth: new Date("1990-01-01"),
}

const userData2 = {
  username: "aliceteste",
  firstname: "Alice",
  lastname: "Teste",
  email: "aliceteste@example.com",
  cpf: "12345678908",
  password: "password123",
  dt_birth: new Date("1999-01-01"),
}

// Função para realizar login e obter o token JWT
const login = async (email: string, password: string) => {
  const response = await request(server)
    .post("/auth")
    .send({ email, password });

  return response.body.token // Considerando que o token esteja em `response.body.token`
};

let userDataCreate: any;
let userDataCreate2: any;

describe('User editing', () => {
  let token: string;
  beforeAll(async () => {
    // Limpa o banco de dados antes dos testes
    await prismaClient.user.deleteMany({});
    // Cria um usuário válido no banco para autenticação

    // Cria um usuário para usar no login
    const pass = await hash('admin', 8)
    const userAdmin: CreateUserRequest = {
      username: 'admin',
      firstname: 'Administrador',
      lastname: 'Sistema',
      email: 'admin@admin.com',
      cpf: '00000000000',
      password: pass,
      dt_birth: new Date('1990-01-01'),
    };

    await prismaClient.user.create({ data: userAdmin })

    // Realiza o login e obtém o token
    token = await login('admin@admin.com', 'admin');

    userDataCreate = await request(server)
      .post("/user")
      .set("Authorization", `Bearer ${token}`)
      .send(userData)

    userDataCreate2 = await request(server)
      .post("/user")
      .set("Authorization", `Bearer ${token}`)
      .send(userData2)
  });

  afterAll(async () => {
    // Remove todos os registros da tabela `user`
    await prismaClient.user.deleteMany({});
    await prismaClient.$disconnect();
    server.close();
  });

  it('should edit a user successfully', async () => {
    const userDataEdit = {
      firstname: "John07 Editado",
      password: await hash("password4321", 8),
      dt_birth: new Date("1990-01-01"),
    };

    const response = await request(server)
      .put(`/user/${userDataCreate.body.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send(userDataEdit)

    // Verificar se o usuário foi editado corretamente
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
  });

  it("should fail when editing a user that doesn't exist", async () => {
    const userDataEdit = {
      firstname: "John07 Editado",
      password: await hash("password4321", 8),
      dt_birth: new Date("1990-01-01"),
    };

    const response = await request(server)
      .put(`/user/123`)
      .set("Authorization", `Bearer ${token}`)
      .send(userDataEdit)

    // Verificar se o usuário não foi encontrado
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(response.body).toStrictEqual({ "error": "User not found" });
  });

  it('should fail when editing a user with repeated email', async () => {
    const userDataEdit = {
      email: userDataCreate2.body?.email,
    };
    const response = await request(server)
      .put(`/user/${userDataCreate.body.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send(userDataEdit)
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(response.body).toStrictEqual({ "error": "This email already exists" });
  });
  it('should fail when editing a user with repeated cpf', async () => {
    const userDataEdit = {
      cpf: userDataCreate2.body?.cpf,
    };

    const response = await request(server)
      .put(`/user/${userDataCreate.body.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send(userDataEdit)
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(response.body).toStrictEqual({ "error": "This cpf already exists" });
  });
  it('should fail when editing a user with repeated username', async () => {
    const userDataEdit = {
      username: userDataCreate2.body?.username,
    };

    const response = await request(server)
      .put(`/user/${userDataCreate.body.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send(userDataEdit)
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(response.body).toStrictEqual({ "error": "This username already exists" });
  });

  it('should fail when editing a user with repeated username', async () => {
    const userDataEdit = {
      username: userDataCreate2.body?.username,
    };

    const response = await request(server)
      .put(`/user/${userDataCreate.body.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send(userDataEdit)
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(response.body).toStrictEqual({ "error": "This username already exists" });
  });

  it('should editing a user successful editing password', async () => {
    const userDataEdit = {
      password: 'senhaeditadacomsucesso123456789',
    };

    const response = await request(server)
      .put(`/user/${userDataCreate.body.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send(userDataEdit)

    const senhaAlterada = await compare(userDataEdit.password, response.body?.password);
    expect(response.status).toBe(200);
    expect(senhaAlterada).toBe(true);
  });
});