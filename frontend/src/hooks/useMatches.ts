import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { matchingService } from '@/services/matching.service'
export function useRecommendations(limit=20) {
  return useQuery({ queryKey: ['recommendations', limit], queryFn: () => matchingService.getRecommendations(limit), staleTime: 5*60*1000 })
}
export function useCompatibility(targetId: string|null) {
  return useQuery({ queryKey: ['compatibility', targetId], queryFn: () => matchingService.getCompatibilityScore(targetId!), enabled: !!targetId })
}
export function useConnect() {
  const qc = useQueryClient()
  return useMutation({ mutationFn: (id: string) => matchingService.connect(id), onSuccess: () => { qc.invalidateQueries({ queryKey: ['recommendations'] }); qc.invalidateQueries({ queryKey: ['compatibility'] }) } })
}
