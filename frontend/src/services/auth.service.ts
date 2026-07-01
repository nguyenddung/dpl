import api from './api'
import type { ITokenResponse, IUser, IUserUpdateRequest } from '@/types'
export const authService = {
  async register(data: { email: string; password: string; full_name: string; university?: string; major?: string }): Promise<ITokenResponse> {
    const res = await api.post<ITokenResponse>('/auth/register', data)
    _store(res.data); return res.data
  },
  async login(email: string, password: string): Promise<ITokenResponse> {
    const res = await api.post<ITokenResponse>('/auth/login', { email, password })
    _store(res.data); return res.data
  },
  async logout(): Promise<void> {
    try { await api.post('/auth/logout') } catch {}
    localStorage.removeItem('access_token'); localStorage.removeItem('refresh_token')
  },
  async getMe(): Promise<IUser> { return (await api.get<IUser>('/auth/me')).data },
  async updateMe(data: IUserUpdateRequest): Promise<IUser> { return (await api.patch<IUser>('/users/me', data)).data },
  isAuthenticated(): boolean { return !!localStorage.getItem('access_token') },
}
function _store(t: ITokenResponse) { localStorage.setItem('access_token', t.access_token); localStorage.setItem('refresh_token', t.refresh_token) }
