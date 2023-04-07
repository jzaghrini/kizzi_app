import { api } from './api'
import { useQuery } from '@tanstack/react-query'

export interface CommunityResponse {
  id: string
  name: string
}
export const useCommunityQuery = () =>
  useQuery({
    queryKey: ['community'],
    queryFn: () =>
      api.get<Array<CommunityResponse>>('/community/').then(({ data }) => data),
  })
