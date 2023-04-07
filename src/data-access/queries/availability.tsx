import { api } from '../api'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { parseISO } from 'date-fns'

const baseKey = 'availability'

const convertAvailabilityToDates = (data: AvailabilityResponse) => ({
  ...data,
  options: data.options.map((row) => ({
    ...row,
    fromDate: parseISO(row.fromDate),
    toDate: parseISO(row.toDate),
  })),
})
export interface RawRowResponse {
  slug: string
  fromDate: string
  toDate: string
  locationName?: string
  available: boolean
}
interface RawResponse {
  id: string
  slug: string
  inviteId: string
  status: string
  options: Array<RawRowResponse>
}
export interface AvailabilityOptionResponse
  extends Omit<RawRowResponse, 'fromDate' | 'toDate'> {
  fromDate: Date
  toDate: Date
}
export interface AvailabilityResponse extends Omit<RawResponse, 'options'> {
  options: Array<AvailabilityOptionResponse>
}
export const useAvailabilityByIdMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, slugs }: { id: string; slugs: Array<string> }) =>
      api.post(`/availability/${id}`, { slugs }),
    onSuccess: (data) =>
      queryClient.invalidateQueries([baseKey]).then(() => data),
  })
}
export const useAvailabilityBySlug = (slug) => {
  return useQuery({
    queryKey: [baseKey, 'slug', slug],
    queryFn: () =>
      api
        .get<AvailabilityResponse>(`/availability/by-slug/${slug}`)
        .then(({ data }) => convertAvailabilityToDates(data)),
    enabled: !!slug,
    onError: (error) => console.log(error),
  })
}

export const useAvailabilityById = (id) =>
  useQuery({
    queryKey: [baseKey, 'id', id],
    queryFn: () =>
      api
        .get<AvailabilityResponse>(`/availability/${id}`)
        .then(({ data }) => convertAvailabilityToDates(data)),
    enabled: !!id,
    onError: (error) => console.log(error),
  })

export const useAvailabilityQuery = () => {
  return useQuery({
    queryKey: [baseKey],
    queryFn: () => api.get('/availability/').then(({ data }) => data),
    useErrorBoundary: true,
  })
}
