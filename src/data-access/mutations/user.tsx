import { api } from '../api'
import { useMutation, useQueries, useQueryClient } from '@tanstack/react-query'

interface CreateUserRequest {
  name: string
  email?: string
  phoneNumber?: string
}
interface UpdateUserRequest extends Partial<CreateUserRequest> {
  id?: string
}
export const useCreateUserMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateUserRequest) => api.post('/user/', data),
    onSuccess: (data) =>
      queryClient.invalidateQueries(['user']).then(() => data),
  })
}
export const useUpdateUserMutation = (userId?: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: UpdateUserRequest) => api.put(`/user/${userId}`, data),
    onSuccess: (data) =>
      queryClient.invalidateQueries(['user']).then(() => data),
  })
}
