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
  phoneNumber: string
  email: string
  messageState: {
    type: string
    endAt: string | null
    outgoingBody
  }
}
