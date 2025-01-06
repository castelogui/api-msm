import prismaClient from "../../prisma";

class DeleteUserService {
  async execute(id: string, user_id: string) {
    if(id == user_id){
      throw new Error("You cannot delete yourself");
    }
    // Verifica se o usuário existe
    const existingUser = await prismaClient.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new Error("User not found");
    }

    // deleta o usuário existente de acordo com o id
    const userDelete = await prismaClient.user.delete({
      where: { id },
    });

    return userDelete;
  }
}

export { DeleteUserService };