import { api } from '../api'
import { FormDataRequest, localStorageKey, TokenResponse } from '../types'
import { useMutation } from '@tanstack/react-query'

export const useTokenMutation = () => {
  return useMutation({
    mutationFn: (data: FormDataRequest) =>
      api
        .post<TokenResponse>('/token', data, {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        })
        .then(({ data }) => {
          const accessToken = data.accessToken
          if (accessToken) {
            localStorage.setItem(localStorageKey, accessToken)
            return accessToken
          }
          return null
        }),
  })
}
