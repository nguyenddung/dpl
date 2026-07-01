import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'
import { Input, Button } from '@/components/ui'

const UNIVERSITIES = ['ĐH Bách Khoa HN','ĐH Kinh tế QD','ĐH Ngoại thương','ĐH Quốc gia HN','ĐH KHXH & NV','RMIT Vietnam','FPT University','Khác']

export default function Register() {
  const navigate = useNavigate()
  const { register: doRegister, loading, error } = useAuth()
  const [form, setForm] = useState({ email:'', password:'', full_name:'', university:'', major:'' })
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement|HTMLSelectElement>) => setForm(f => ({ ...f, [k]: e.target.value }))
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res: any = await doRegister(form)
    if (res.meta?.requestStatus === 'fulfilled') navigate('/onboarding')
  }
  return (
    <div className="min-h-screen bg-app-bg flex items-center justify-center px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-[460px] bg-app-surface border border-app-border rounded-card p-10 shadow-card">
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">🐸</div>
          <h1 className="text-2xl font-extrabold text-green-dark">Tạo tài khoản</h1>
          <p className="text-text-secondary text-sm mt-1">Bắt đầu hành trình học tập thông minh</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Họ và tên" placeholder="Nguyễn Văn An" value={form.full_name} onChange={set('full_name')} required />
          <Input label="Email trường" type="email" placeholder="email@university.edu.vn" value={form.email} onChange={set('email')} required />
          <div>
            <label className="block text-sm font-semibold mb-1.5">Trường đại học</label>
            <select value={form.university} onChange={set('university')} className="w-full px-3.5 py-2.5 border-[1.5px] border-app-border rounded-input text-sm bg-app-bg outline-none focus:border-green-dark transition-colors">
              <option value="">-- Chọn trường --</option>
              {UNIVERSITIES.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
          <Input label="Ngành học" placeholder="VD: Công nghệ thông tin" value={form.major} onChange={set('major')} />
          <Input label="Mật khẩu" type="password" placeholder="Ít nhất 8 ký tự" value={form.password} onChange={set('password')} required />
          {error && <p className="text-sm text-red-500 text-center">{error}</p>}
          <Button type="submit" className="w-full mt-2" loading={loading}>Tạo tài khoản →</Button>
        </form>
        <p className="text-center text-sm text-text-secondary mt-4">Đã có tài khoản? <Link to="/login" className="text-green-dark font-semibold hover:underline">Đăng nhập</Link></p>
      </motion.div>
    </div>
  )
}
