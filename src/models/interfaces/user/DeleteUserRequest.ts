export interface DeleteUserRequest {
  id: string;
  username: string | undefined;
  firstname: string | undefined;
  lastname: string | undefined;
  email: string | undefined;
  cpf: string | undefined;
  password: string | undefined;
  dt_birth: Date | undefined;
}
