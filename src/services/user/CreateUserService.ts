import prismaClient from "../../prisma";
import { hash } from "bcryptjs";
import { CreateUserRequest } from "../../models/interfaces/user/CreateUserRequest";

class CreateUserService {
  async execute(userData: CreateUserRequest) {
    // Verificando se os campos obrigatórios estão preenchidos
    await checkRequiridField("email", userData.email);
    await checkRequiridField("username", userData.username);
    await checkRequiridField("password", userData.password);
    await checkRequiridField("firstname", userData.firstname);
    await checkRequiridField("lastname", userData.lastname);

    // Verificando se já existe um usuário com o email, cpf ou username informado
    await checkAlreadyExists("email", userData.email);
    await checkAlreadyExists("cpf", userData.cpf);
    await checkAlreadyExists("username", userData.username);


    // Encriptando a nossa senha do usuário
    const passwordHash = await hash(userData.password, 8);

    // Criando nosso usuário
    const user = prismaClient.user.create({
      data: {
        cpf: userData.cpf,
        dt_birth: userData.dt_birth,
        firstname: userData.firstname,
        lastname: userData.lastname,
        username: userData.username,
        email: userData.email,
        password: passwordHash,
      },
      select: {
        id: true,
        username: true,
        email: true,
        cpf: true,
        firstname: true,
        lastname: true,
        dt_birth: true,
        created_at: true,
        updated_at: true,
      },
    });

    return user;
  }
}

export { CreateUserService };

async function checkRequiridField(field: string, value: string) {
  if (!value) {
    throw new Error(`Invalid field, ${field} cannot be null`);
  }
}

async function checkAlreadyExists(field: string, value: string) {
  const userAlreadyFieldExists = await prismaClient.user.findFirst({
    where: {
      [field]: value,
    },
  });

  if (userAlreadyFieldExists) {
    throw new Error(`This ${field} already exists`);
  }
}
