import { Request, Response } from 'express';
import { EditUserService } from '../../services/user/EditUserService';
import { EditUserRequest } from './../../models/interfaces/user/EditUserRequest';

class EditUserController {
  async handle(request: Request, response: Response) {
    const { cpf, dt_birth, firstname, lastname, username, email, password }: EditUserRequest = request.body;
    const { id } = request.params;
    const editUserService = new EditUserService();
    const user = await editUserService.execute(id, {cpf, dt_birth, firstname, lastname, username, email, password });
    return response.json(user);
  }
}

export { EditUserController };