import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/services/api'
import type { IProfile, IProfileUpdateRequest } from '@/types'
export function useMyProfile() {
  return useQuery({ queryKey: ['profile','me'], queryFn: async () => (await api.get<IProfile>('/profiles/me')).data })
}
export function useProfile(userId: string|null) {
  return useQuery({ queryKey: ['profile', userId], queryFn: async () => (await api.get<IProfile>(`/profiles/${userId}`)).data, enabled: !!userId })
}
export function useUpdateProfile() {
  const qc = useQueryClient()
  return useMutation({ mutationFn: (data: IProfileUpdateRequest) => api.put<IProfile>('/profiles/me', data).then(r => r.data), onSuccess: () => qc.invalidateQueries({ queryKey: ['profile','me'] }) })
}
