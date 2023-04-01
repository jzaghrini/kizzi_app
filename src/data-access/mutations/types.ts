export interface CreateUserRequest {
  name: string
  email?: string
  phoneNumber?: string
}
export interface UpdateUserRequest extends Partial<CreateUserRequest> {
  id?: string
}
