import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'
const BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api/v1'
export const api = axios.create({ baseURL: BASE, headers: { 'Content-Type': 'application/json' }, timeout: 15000 })
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('access_token')
  if (token && config.headers) config.headers.Authorization = `Bearer ${token}`
  return config
})
let isRefreshing = false
let queue: Array<{ resolve: (v: string) => void; reject: (e: unknown) => void }> = []
function processQueue(err: unknown, token: string | null) { queue.forEach(p => token ? p.resolve(token) : p.reject(err)); queue = [] }
api.interceptors.response.use(r => r, async (error: AxiosError) => {
  const orig = error.config as InternalAxiosRequestConfig & { _retry?: boolean }
  if (error.response?.status !== 401 || orig._retry) return Promise.reject(error)
  if (isRefreshing) return new Promise((res, rej) => { queue.push({ resolve: res, reject: rej }) }).then(t => { orig.headers.Authorization = `Bearer ${t}`; return api(orig) })
  orig._retry = true; isRefreshing = true
  const rt = localStorage.getItem('refresh_token')
  if (!rt) { localStorage.clear(); window.location.href = '/login'; return Promise.reject(error) }
  try {
    const { data } = await axios.post(`${BASE}/auth/refresh`, { refresh_token: rt })
    localStorage.setItem('access_token', data.access_token)
    processQueue(null, data.access_token)
    orig.headers.Authorization = `Bearer ${data.access_token}`
    return api(orig)
  } catch (e) { processQueue(e, null); localStorage.clear(); window.location.href = '/login'; return Promise.reject(e) }
  finally { isRefreshing = false }
})
export default api
