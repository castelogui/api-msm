import { Request, Response } from "express";
import { CreateUserService } from "../../services/user/CreateUserService";
import { CreateUserRequest } from "../../models/interfaces/user/CreateUserRequest";

class CreateUserController {
  async handle(request: Request, response: Response) {
    const { cpf, dt_birth, firstname, lastname, username, email, password, role_id }: CreateUserRequest = request.body;
    const createUserService = new CreateUserService();
    const user = await createUserService.execute({ cpf, dt_birth, firstname, lastname, username, email, password, role_id });
    return response.json(user);
  }
}

export { CreateUserController };
