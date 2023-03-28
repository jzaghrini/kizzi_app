import { api } from '../api'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'

interface CreateInvitationRequest {
  userIds: Array<string>
  options: Array<{
    fromDate: dayjs.Dayjs
    toDate: dayjs.Dayjs
    location?: string | null
  }>
}
const invitationKey = 'invitation'
export const useCreateInvitationMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateInvitationRequest) =>
      api.post('/invitation/', {
        ...data,
        options: data.options.map((x) => ({
          ...x,
          fromDate: x.fromDate.toISOString(),
          toDate: x.toDate.toISOString(),
        })),
      }),
    onSuccess: (data) =>
      queryClient.invalidateQueries([invitationKey]).then(() => data),
  })
}
export const useDeleteInvitation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.delete(`/invitation/${id}`),
    onSuccess: (data) =>
      queryClient.invalidateQueries([invitationKey]).then(() => data),
  })
}
