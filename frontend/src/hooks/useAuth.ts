import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '@/store'
import { fetchMe, login, logout, register, clearError } from '@/store/authSlice'
import { authService } from '@/services/auth.service'

interface RegisterData { email: string; password: string; full_name: string; university?: string; major?: string }
export function useAuth() {
  const dispatch = useDispatch<AppDispatch>()
  const { user, loading, error } = useSelector((s: RootState) => s.auth)
  useEffect(() => { if (!user && authService.isAuthenticated()) dispatch(fetchMe()) }, [dispatch])
  return {
    user, loading, error,
    isAuthenticated: !!user || authService.isAuthenticated(),
    login: (email: string, password: string) => dispatch(login({ email, password })),
    register: (data: RegisterData) => dispatch(register(data)),
    logout: () => dispatch(logout()),
    clearError: () => dispatch(clearError()),
  }
}
