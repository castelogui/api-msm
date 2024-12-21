import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import prismaClient from "../../prisma";
import { AuthUserRequest } from "../../models/interfaces/user/AuthUserRequest";

class AuthUserService {
  async execute({ email, password }: AuthUserRequest) {
    await checkRequiridField("email", email);
    await checkRequiridField("password", password);
    

    const user = await prismaClient.user.findFirst({
      where: {
        email: email,
      },
    });

    if (!user) {
      throw new Error("Wrong username or password!");
    }

    const passwordMatch = await compare(password, user?.password);

    if (!passwordMatch) {
      throw new Error("Wrong password");
    }

    const token = sign(
      {
        name: user?.username,
        email: user?.email,
      },
      process.env.JWT_SECRET as string,
      {
        subject: user?.id,
        expiresIn: "30d",
      }
    );

    return {
      id: user?.id,
      name: user?.username,
      email: user?.email,
      token: token,
    };
  }
}

export { AuthUserService };

async function checkRequiridField(field: string, value: string) {
  if (!value) {
    throw new Error(`Invalid field, ${field} cannot be null`);
  }
}