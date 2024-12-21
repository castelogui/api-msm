import { EditUserRequest } from "../../models/interfaces/user/EditUserRequest";
import prismaClient from "../../prisma";
import { hash } from "bcryptjs";

class EditUserService {
  async execute(id: string, userData: EditUserRequest) {
    // Verifica se o usuário existe
    const existingUser = await prismaClient.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new Error("User not found");
    }
    if (userData.email) {
      await checkAlreadyExists("email", userData.email);
    }
    if (userData.username) {
      await checkAlreadyExists("username", userData.username);
    }
    if (userData.cpf) {
      await checkAlreadyExists("cpf", userData.cpf);
    }
    // Caso o usuário esteja atualizando a senha, ela é encriptada
    if (userData.password) {
      userData.password = await hash(userData.password, 8);
    }
    // Atualiza os dados do usuário
    const updatedData = { ...userData };


    const userEdit = await prismaClient.user.update({
      where: { id },
      data: updatedData,
    });

    return userEdit;
  }
}

export { EditUserService };

async function checkAlreadyExists(field: string, value: string) {
  await prismaClient.user.findFirst({
    where: {
      [field]: value,
    },
  }).then(() => {
    throw new Error(`This ${field} already exists`);
  });
}
