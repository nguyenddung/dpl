import api from './api'
import type { IMatchResult, IMatchStatusResponse, IRecommendationsResponse } from '@/types'
export const matchingService = {
  async getRecommendations(limit=20, offset=0): Promise<IRecommendationsResponse> { return (await api.get('/matching/recommendations', { params: { limit, offset } })).data },
  async getCompatibilityScore(id: string): Promise<IMatchResult> { return (await api.get(`/matching/score/${id}`)).data },
  async connect(id: string): Promise<IMatchStatusResponse> { return (await api.post(`/matching/connect/${id}`)).data },
  async getConnections(): Promise<IMatchStatusResponse[]> { return (await api.get('/matching/connections')).data },
}
