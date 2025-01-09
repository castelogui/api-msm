import { Request, Response } from "express";
import { EditPermissionService } from "../../services/permission/EditPermissionService";

class EditPermissionController {
  async handle(request: Request, response: Response) {
    const { name, description } = request.body
    const { id } = request.params
    const editPermissionService = new EditPermissionService()
    const permission = await editPermissionService.execute({ id, name, description })
    return response.json(permission)
  }
}

export { EditPermissionController }