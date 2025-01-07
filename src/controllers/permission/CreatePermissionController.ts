import { Request, Response } from "express";
import { CreatePermissionRequest } from "../../models/interfaces/permission/CreatePermissionRequest";
import { CreatePermissionService } from "../../services/permission/CreatePermissionService";

class CreatePermissionController {
  async handle(request: Request, response: Response) {
    const { name, description }: CreatePermissionRequest = request.body
    const createPermissionService = new CreatePermissionService()
    const permission = await createPermissionService.execute({ name, description })
    return response.json(permission)
  }
}

export { CreatePermissionController }