import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { authService } from '@/services/auth.service'
import type { IUser } from '@/types'

interface RegisterData { email: string; password: string; full_name: string; university?: string; major?: string }
interface AuthState { user: IUser|null; loading: boolean; error: string|null }

export const fetchMe = createAsyncThunk('auth/fetchMe', () => authService.getMe())
export const login = createAsyncThunk('auth/login', async ({ email, password }: { email: string; password: string }) => { await authService.login(email, password); return authService.getMe() })
export const register = createAsyncThunk('auth/register', async (data: RegisterData) => { await authService.register(data); return authService.getMe() })
export const logout = createAsyncThunk('auth/logout', async () => { await authService.logout() })

const authSlice = createSlice({
  name: 'auth', initialState: { user: null, loading: false, error: null } as AuthState,
  reducers: { clearError: s => { s.error = null } },
  extraReducers: b => {
    const p = (s: AuthState) => { s.loading = true; s.error = null }
    const r = (s: AuthState, a: { error: { message?: string } }) => { s.loading = false; s.error = a.error.message ?? 'Lỗi' }
    b.addCase(fetchMe.fulfilled, (s,a) => { s.user = a.payload; s.loading = false })
    b.addCase(fetchMe.rejected, s => { s.loading = false })
    b.addCase(login.pending, p).addCase(login.fulfilled, (s,a) => { s.user = a.payload; s.loading = false }).addCase(login.rejected, r)
    b.addCase(register.pending, p).addCase(register.fulfilled, (s,a) => { s.user = a.payload; s.loading = false }).addCase(register.rejected, r)
    b.addCase(logout.fulfilled, s => { s.user = null; s.loading = false })
  },
})
export const { clearError } = authSlice.actions
export default authSlice.reducer
