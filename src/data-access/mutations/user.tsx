import { api } from '../api'
import { CreateUserRequest, UpdateUserRequest } from './types'
import { useMutation, useQueryClient } from '@tanstack/react-query'

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
export const useDeleteUserMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (userId: string) => api.delete(`/user/${userId}`),
    onSuccess: (data) =>
      queryClient.invalidateQueries(['user']).then(() => data),
  })
}
