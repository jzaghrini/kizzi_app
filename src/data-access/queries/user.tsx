import { api } from '../api'
import { UserResponse } from '../types'
import { useQuery, UseQueryOptions } from '@tanstack/react-query'

const userBase = 'user'
export const useUserQuery = (options: UseQueryOptions<UserResponse>) =>
  useQuery({
    ...options,
    queryFn: () => api.get<UserResponse>('/user/me').then(({ data }) => data),
    queryKey: [userBase, 'me'],
  })

export const useUsersQuery = () =>
  useQuery({
    queryFn: () =>
      api.get<Array<UserResponse>>('/user/').then(({ data }) => data),
    queryKey: [userBase, 'users'],
  })
export const useUserById = (userId?: string) =>
  useQuery({
    queryKey: [userBase, userId],
    queryFn: () => api.get(`/user/${userId}`).then(({ data }) => data),
    enabled: !!userId,
  })
