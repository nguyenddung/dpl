import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'
import { Input, Button } from '@/components/ui'

export default function Login() {
  const navigate = useNavigate()
  const { login, loading, error } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res: any = await login(email, password)
    if (res.meta?.requestStatus === 'fulfilled') navigate('/discover')
  }
  return (
    <div className="min-h-screen bg-app-bg flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md bg-app-surface border border-app-border rounded-card p-10 shadow-card">
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">🐸</div>
          <h1 className="text-2xl font-extrabold text-green-dark">Chào mừng trở lại!</h1>
          <p className="text-text-secondary text-sm mt-1">Đăng nhập để tiếp tục hành trình học tập</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Email" type="email" placeholder="email@university.edu.vn" value={email} onChange={e=>setEmail(e.target.value)} required />
          <Input label="Mật khẩu" type="password" placeholder="••••••••" value={password} onChange={e=>setPassword(e.target.value)} required />
          {error && <p className="text-sm text-red-500 text-center">{error}</p>}
          <Button type="submit" className="w-full mt-2" loading={loading}>Đăng nhập</Button>
        </form>
        <div className="mt-4 p-3 bg-green-pale rounded-input text-xs text-text-secondary text-center">
          Demo: <strong>demo@cocstudy.vn</strong> / <strong>demo1234</strong>
        </div>
        <p className="text-center text-sm text-text-secondary mt-4">Chưa có tài khoản? <Link to="/register" className="text-green-dark font-semibold hover:underline">Đăng ký ngay</Link></p>
      </motion.div>
    </div>
  )
}
