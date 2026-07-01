import api from './api'
import type { IGroupCreateRequest, IGroupMember, IStudyGroup } from '@/types'
export const groupsService = {
  async list(search?: string): Promise<IStudyGroup[]> { return (await api.get('/groups', { params: search ? { search } : {} })).data },
  async get(id: string): Promise<IStudyGroup> { return (await api.get(`/groups/${id}`)).data },
  async create(data: IGroupCreateRequest): Promise<IStudyGroup> { return (await api.post('/groups', data)).data },
  async join(id: string): Promise<IGroupMember> { return (await api.post(`/groups/${id}/join`)).data },
  async leave(id: string): Promise<void> { await api.delete(`/groups/${id}/leave`) },
  async getMembers(id: string): Promise<IGroupMember[]> { return (await api.get(`/groups/${id}/members`)).data },
}
