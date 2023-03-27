import { api } from './api'
import { useQuery } from '@tanstack/react-query'
import { parseISO } from 'date-fns'

const baseKey = 'availability'

const convertAvailabilityToDates = (data) => ({
  ...data,
  startDate: parseISO(data.startDate),
  endDate: parseISO(data.endDate),
  excluded: data.excluded.map((x) => parseISO(x)),
})

export const useAvailabilityBySlug = (slug) =>
  useQuery({
    queryKey: [baseKey, 'slug', slug],
    queryFn: () =>
      api
        .get(`/availability/by-slug/${slug}`)
        .then(({ data }) => convertAvailabilityToDates(data)),
    enabled: !!slug,
  })

export const useAvailabilityById = (id) =>
  useQuery({
    queryKey: [baseKey, 'id', id],
    queryFn: () =>
      api
        .get(`/availability/${id}`)
        .then(({ data }) => convertAvailabilityToDates(data)),
    enabled: !!id,
  })

export const useAvailabilityQuery = () =>
  useQuery({
    queryKey: [baseKey],
    queryFn: () => api.get('/availability/').then(({ data }) => data),
  })
