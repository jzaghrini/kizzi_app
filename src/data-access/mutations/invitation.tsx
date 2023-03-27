import { api } from '../api'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'

interface CreateInvitationRequest {
  userIds: Array<string>
  availabilityOptions: Array<{
    fromDate: dayjs.Dayjs
    toDate: dayjs.Dayjs
    location?: string | null
  }>
}
export const useCreateInvitationMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateInvitationRequest) =>
      api.post('/availability/invitation/', {
        ...data,
        availabilityOptions: data.availabilityOptions.map((x) => ({
          ...x,
          fromDate: x.fromDate.toISOString(),
          toDate: x.toDate.toISOString(),
        })),
      }),
    onSuccess: (data) =>
      queryClient.invalidateQueries(['availability']).then(() => data),
  })
}
