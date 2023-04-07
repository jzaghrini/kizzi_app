import { api } from '../api'
import { useQuery } from '@tanstack/react-query'

interface InvitationResponse {
  id: string
  userIds: Array<string>
  communityIds: Array<string>
  fromDate: string
  toDate: string
  options: Array<{
    fromDate: string
    toDate: string
    locationName: string | null
  }>
}
export const useInvitationQuery = () =>
  useQuery<Array<InvitationResponse>>({
    queryKey: ['invitation'],
    queryFn: () => api.get('/invitation/').then(({ data }) => data),
  })
export const useInvitationByIdQuery = (id?: string) =>
  useQuery<InvitationResponse>({
    queryKey: ['invitation', id],
    queryFn: () => api.get(`/invitation/${id}`).then(({ data }) => data),
    enabled: !!id,
  })
