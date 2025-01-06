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
    await checkAlreadyExists("email", userData.email);
    await checkAlreadyExists("username", userData.username);
    await checkAlreadyExists("cpf", userData.cpf);
    // Caso o usuário esteja atualizando a senha, ela é encriptada
    userData.password = userData.password ? await hash(userData.password, 8) : undefined;
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
  if (!value) {
    return;
  }
  await prismaClient.user.findFirst({
    where: {
      [field]: value,
    },
  }).then(() => {
    throw new Error(`This ${field} already exists`);
  });
}
