export interface CreateUserRequest {
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  cpf: string;
  password: string;
  dt_birth: Date;
  role_id: string
}
