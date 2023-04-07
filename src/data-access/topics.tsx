import { api } from './api'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export interface TopicResponse {
  id: string
  name: string
  keyword: string
  topicText: string | null
  disabled: boolean
}

export interface CreateTopicRequest {
  name: string
  keyword: string
  text: string
}
export interface UpdateTopicRequest extends Partial<CreateTopicRequest> {}

const baseKey = 'topics'
export const useTopicsQuery = () =>
  useQuery({
    queryKey: [baseKey, 'all'],
    queryFn: () =>
      api.get<Array<TopicResponse>>('/topics/').then(({ data }) => data),
  })

export const useTopicById = (topicId?: string) =>
  useQuery({
    queryKey: [baseKey, topicId],
    queryFn: () =>
      api.get<TopicResponse>(`/topics/${topicId}`).then(({ data }) => data),
    enabled: !!topicId,
  })
export const useCreateTopicMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateTopicRequest) => api.post('/topics/', data),
    onSuccess: (data) =>
      queryClient.invalidateQueries(['topics']).then(() => data),
  })
}
export const useUpdateTopicMutation = (topicId?: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: UpdateTopicRequest) =>
      api.post(`/topics/${topicId}`, data),
    onSuccess: (data) =>
      queryClient.invalidateQueries(['topics']).then(() => data),
  })
}
export const useDeleteTopicMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.delete(`/topics/${id}`),
    onSuccess: (data) =>
      queryClient.invalidateQueries(['topics']).then(() => data),
  })
}
