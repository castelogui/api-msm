import prismaClient from "../../prisma";

class ListUserService {
  async execute() {
    // Lista todos os usuários
    const users = await prismaClient.user.findMany();
    return users;
  }
}

export { ListUserService };