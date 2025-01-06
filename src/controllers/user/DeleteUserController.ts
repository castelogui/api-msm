import { Request, Response } from "express";
import { DeleteUserService } from "../../services/user/DeleteUserService";

class DeleteUserController {
  async handle(request: Request, response: Response){
    const {id} = request.params;
    const {user_id} = request.body
    const deleteUserService = new DeleteUserService();
    const user = await deleteUserService.execute(id, user_id);
    return response.json(user);
  }
}

export { DeleteUserController };