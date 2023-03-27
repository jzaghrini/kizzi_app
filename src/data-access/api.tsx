import { localStorageKey } from './types'
import axios from 'axios'
import { camelizeKeys, decamelizeKeys } from 'humps'

// @ts-ignore
const baseUrl = import.meta.env.VITE_API_URL
export const api = axios.create({
  baseURL: baseUrl ?? 'https://api.kizziatx.com',
})

const decamelizeRequest = (old) => {
  const config = { ...old }
  if (config.params) config.params = decamelizeKeys(config.params)
  if (config.data) config.data = decamelizeKeys(config.data)
  config.headers = config.headers || {}
  config.headers.accept = 'application/json'
  const token = localStorage.getItem(localStorageKey)
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
}

api.interceptors.request.use(
  (config) => decamelizeRequest(config),
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (resp) => {
    resp.data = camelizeKeys(resp.data)
    return resp
  },
  (error) => {
    if (error.response && error.response.status === 422) {
      return error
    } else if (error.response && error.response.status === 401) {
      localStorage.removeItem(localStorageKey)
    }
    return Promise.reject(error)
  }
)
