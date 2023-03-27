import { api } from './api'
import { localStorageKey, UserResponse } from './types'
import { useQuery } from '@tanstack/react-query'

const userBase = 'user'
export const useUserQuery = () =>
  useQuery({
    queryFn: () => api.get<UserResponse>('/user/me').then(({ data }) => data),
    queryKey: [userBase, 'me'],
    enabled: !!localStorage.getItem(localStorageKey),
  })

export const useUsersQuery = () =>
  useQuery({
    queryFn: () =>
      api.get<Array<UserResponse>>('/user/').then(({ data }) => data),
    queryKey: [userBase, 'users'],
  })
export const useUserById = (userId) =>
  useQuery({
    queryKey: [userBase, userId],
    queryFn: () => api.get(`/user/${userId}`).then(({ data }) => data),
    enabled: !!userId,
  })
