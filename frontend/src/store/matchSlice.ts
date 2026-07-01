import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { matchingService } from '@/services/matching.service'
import type { IMatchResult } from '@/types'

export const fetchRecommendations = createAsyncThunk('match/fetch', (p?: { limit?: number; offset?: number }) => matchingService.getRecommendations(p?.limit, p?.offset))
export const connectUser = createAsyncThunk('match/connect', (id: string) => matchingService.connect(id))

const matchSlice = createSlice({
  name: 'match', initialState: { results: [] as IMatchResult[], total: 0, loading: false, error: null as string|null },
  reducers: { clearMatches: s => { s.results = []; s.total = 0 } },
  extraReducers: b => {
    b.addCase(fetchRecommendations.pending, s => { s.loading = true; s.error = null })
    b.addCase(fetchRecommendations.fulfilled, (s,a) => { s.results = a.payload.results; s.total = a.payload.total; s.loading = false })
    b.addCase(fetchRecommendations.rejected, (s,a) => { s.loading = false; s.error = a.error.message ?? 'Lỗi' })
    b.addCase(connectUser.fulfilled, (s,a) => { const i = s.results.findIndex(r => r.user_id === a.meta.arg); if (i >= 0) s.results[i].status = a.payload.status })
  },
})
export const { clearMatches } = matchSlice.actions
export default matchSlice.reducer
