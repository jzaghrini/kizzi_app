export const localStorageKey = 'token'
export interface FormDataRequest {
  username: string
  password: string
}
export interface TokenResponse {
  type: 'Bearer'
  accessToken: string
}

export interface UserResponse {
  id: string
  name: string | null
  type: 'admin' | 'user'
  phoneNumber: string | null
  email: string | null
  communityIds: Array<string>
  updatedAt: string
  createdAt: string
  deleted: boolean
  deletedAt?: string
  messageState: {
    type: string
    endAt: string | null
    outgoingBody
  }
}
export interface UserDate
  extends Omit<UserResponse, 'updatedAt' | 'createdAt' | 'deletedAt'> {
  updatedAt: Date
  createdAt: Date
  deletedAt: Date
}
