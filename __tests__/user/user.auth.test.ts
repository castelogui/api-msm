import request from "supertest";
import { server } from "../../src/server";
import { hash } from "bcryptjs";
import { describe, beforeAll, afterAll, it, expect } from "@jest/globals";
import prismaClient from "../../src/prisma";


describe("Authentication Route (/auth)", () => {
  beforeAll(async () => {
    // Limpa a tabela `user` antes de iniciar os testes
    await prismaClient.user.deleteMany({});

    // Cria um usuário válido no banco para autenticação
    const passwordHash = await hash("password123", 8);
    await prismaClient.user.create({
      data: {
        username: "johndoe",
        firstname: "John",
        lastname: "Doe",
        email: "john.doe@example.com",
        cpf: "12345678901",
        password: passwordHash,
        dt_birth: new Date("1990-01-01"),
      },
    });
  });

  afterAll(async () => {
    // Limpa a tabela após os testes e desconecta do banco
    await prismaClient.user.deleteMany({});
    await prismaClient.$disconnect();
    server.close();
  });

  it("should authenticate a user successfully", async () => {
    const response = await request(server)
      .post("/auth")
      .send({
        email: "john.doe@example.com",
        password: "password123",
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
    expect(response.body.email).toBe("john.doe@example.com");
  });

  it("should fail when email is not provided", async () => {
    const response = await request(server)
      .post("/auth")
      .send({
        password: "password123",
      });

    expect(response.status).toBe(400); // Ou o código que você definir para validação
    expect(response.body).toStrictEqual({ "error": "Invalid field, email cannot be null" });
  });

  it("should fail when password is not provided", async () => {
    const response = await request(server)
      .post("/auth")
      .send({
        email: "john.doe@example.com",
      });

    expect(response.status).toBe(400); // Ou o código que você definir para validação
    expect(response.body).toStrictEqual({ "error": "Invalid field, password cannot be null" });
  });

  it("should fail when email does not exist", async () => {
    const response = await request(server)
      .post("/auth")
      .send({
        email: "nonexistent@example.com",
        password: "password123",
      });

    expect(response.status).toBe(400); // Ou o código que você definir
    expect(response.body).toStrictEqual({ "error": "Wrong username or password!" });
  });

  it("should fail when password is incorrect", async () => {
    const response = await request(server)
      .post("/auth")
      .send({
        email: "john.doe@example.com",
        password: "wrongpassword",
      });

    expect(response.status).toBe(400); // Ou o código que você definir
    expect(response.body).toStrictEqual({ "error": "Wrong password" });
  });
});
