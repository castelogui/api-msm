import { CreatePermissionRequest } from "../../models/interfaces/permission/CreatePermissionRequest";
import prismaClient from "../../prisma";

class CreatePermissionService {
  async execute(permissionData: CreatePermissionRequest) {
    // Verificando se os campos obrigatórios estão preenchidos
    await checkRequiridField("name", permissionData.name)
    await checkRequiridField("description", permissionData.description)
    // Verificando se ja existe uma permissão cadastrada com este nome
    await checkAlreadyExists("name", permissionData.name)

    const permission = prismaClient.permission.create({
      data: {
        name: permissionData.name,
        description: permissionData.description
      }
    })

    return permission
  }
}

async function checkRequiridField(field: string, value: string) {
  if (!value) {
    throw new Error(`Invalid field, ${field} cannot be null`);
  }
}

async function checkAlreadyExists(field: string, value: string) {
  const permissionAlreadyFieldExists = await prismaClient.permission.findFirst({
    where: {
      [field]: value,
    },
  });

  if (permissionAlreadyFieldExists) {
    throw new Error(`This ${field} already exists`);
  }
}

export { CreatePermissionService}