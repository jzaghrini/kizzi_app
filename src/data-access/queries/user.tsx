import { api } from '../api'
import { UserDate, UserResponse } from '../types'
import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { parseISO } from 'date-fns'

const userBase = 'user'

const convertToDate = (data: UserResponse): UserDate => {
  const dateKeys: Array<keyof UserResponse> = [
    'updatedAt',
    'deletedAt',
    'createdAt',
  ]
  return Object.entries(data).reduce(
    (acc, [key, value]) => ({
      ...acc,
      [key]:
        dateKeys.includes(key as keyof UserResponse) && value
          ? parseISO(value)
          : value,
    }),
    {} as UserDate
  )
}

export const useUserQuery = (options: UseQueryOptions) =>
  useQuery({
    ...options,
    queryFn: () => api.get('/user/me').then(({ data }) => convertToDate(data)),
    queryKey: [userBase, 'me'],
  })

export const useUsersQuery = () =>
  useQuery({
    queryFn: () =>
      api
        .get<Array<UserResponse>>('/user/')
        .then(({ data }) => data.map(convertToDate)),
    queryKey: [userBase, 'users'],
  })
export const useUserById = (userId?: string) =>
  useQuery({
    queryKey: [userBase, userId],
    queryFn: () =>
      api.get(`/user/${userId}`).then(({ data }) => convertToDate(data)),
    enabled: !!userId,
  })
