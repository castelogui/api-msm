import request from 'supertest'
import { server } from "../../src/server";
import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';
import prismaClient from '../../src/prisma';
import { CreateUserRequest } from '../../src/models/interfaces/user/CreateUserRequest';
import { hash } from 'bcryptjs';
import { CreatePermissionRequest } from '../../src/models/interfaces/permission/CreatePermissionRequest';

// Função para realizar login e obter o token JWT
const login = async (email: string, password: string) => {
  const response = await request(server)
    .post("/auth")
    .send({ email, password });

  return response.body.token // Considerando que o token esteja em `response.body.token`
};

describe('Permission creation', () => {
  let token: string

  beforeAll(async () => {
    // Limpa o banco de dados antes dos testes
    await prismaClient.permission.deleteMany({});
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
  })

  afterAll(async () => {
    // Remove todos os registros da tabela `user`
    await prismaClient.user.deleteMany({});
    // Remove todos os registros da tabela `permission`
    await prismaClient.permission.deleteMany({});
    await prismaClient.$disconnect();
    server.close();
  });

  it('should create a permission successfully', async () => {
    const permissionData: CreatePermissionRequest = {
      name: 'USER_CREATE',
      description: 'Permissão para criar usuário'
    }

    const response = await request(server)
      .post("/permission")
      .set("Authorization", `Bearer ${token}`)
      .send(permissionData)

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('id')
    expect(response.body).toHaveProperty('name')
    expect(response.body).toHaveProperty('description')
  })

  it('should fail when creating a permission with invalid token', async () => {
    const permissionData: CreatePermissionRequest = {
      name: 'USER_CREATE',
      description: 'Permissão para criar usuário'
    }

    const response = await request(server)
      .post("/permission")
      .set("Authorization", `Bearer $123456`)
      .send(permissionData)

    expect(response.status).toBe(401)
  })
  it('should fail when creating a permission with null token', async () => {
    const permissionData: CreatePermissionRequest = {
      name: 'USER_CREATE',
      description: 'Permissão para criar usuário'
    }

    const response = await request(server)
      .post("/permission")
      .set("Authorization", ``)
      .send(permissionData)

    expect(response.status).toBe(401)
  })
  it('should fail when creating a permission with repeated name', async () => {
    const permissionData: CreatePermissionRequest = {
      name: 'USER_CREATE',
      description: 'Permissão para criar usuário'
    }

    const response = await request(server)
      .post("/permission")
      .set("Authorization", `Bearer ${token}`)
      .send(permissionData)

    expect(response.status).toBe(400)
    expect(response.body).toStrictEqual({ "error": "This name already exists" })
  })
  it('should fail when creating a permission with field undefined', async () => {
    const permissionDataName: CreatePermissionRequest = {
      name: '',
      description: 'Permissão para criar usuario'
    }

    const responseName = await request(server)
      .post("/permission")
      .set("Authorization", `Bearer ${token}`)
      .send(permissionDataName)

    expect(responseName.status).toBe(400)
    expect(responseName.body).toStrictEqual({ "error": "Invalid field, name cannot be null" })

    const permissionDataDescription: CreatePermissionRequest = {
      name: 'USER_CREATE',
      description: ''
    }

    const responseDescription = await request(server)
      .post("/permission")
      .set("Authorization", `Bearer ${token}`)
      .send(permissionDataDescription)

    expect(responseDescription.status).toBe(400)
    expect(responseDescription.body).toStrictEqual({ "error": "Invalid field, description cannot be null" })
  })
})