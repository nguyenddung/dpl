import { useState } from 'react'
import { motion } from 'framer-motion'
import Navbar from '@/components/layout/Navbar'
import Sidebar from '@/components/layout/Sidebar'
import MobileNav from '@/components/layout/MobileNav'
import { Input, Button, Spinner } from '@/components/ui'
import { useAuth } from '@/hooks/useAuth'
import { useMyProfile, useUpdateProfile } from '@/hooks/useProfile'
import { authService } from '@/services/auth.service'
import type { LearningStyle, AcademicGoal } from '@/types'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return <div className="bg-app-surface border border-app-border rounded-card p-5"><h3 className="font-bold mb-4">{title}</h3>{children}</div>
}

export default function Settings() {
  const { user } = useAuth()
  const { data: profile, isLoading } = useMyProfile()
  const { mutate: updateProfile, isPending: saving } = useUpdateProfile()
  const [fullName, setFullName] = useState(user?.full_name ?? '')
  const [university, setUniversity] = useState(user?.university ?? '')
  const [major, setMajor] = useState(user?.major ?? '')
  const [gpa, setGpa] = useState(user?.gpa?.toString() ?? '')
  const [bio, setBio] = useState(profile?.bio ?? '')
  const [learningStyle, setLearningStyle] = useState<LearningStyle|''>(profile?.learning_style ?? '')
  const [goal, setGoal] = useState<AcademicGoal|''>(profile?.academic_goal ?? '')
  const [isPublic, setIsPublic] = useState(profile?.is_public ?? true)
  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    await authService.updateMe({ full_name: fullName, university, major, gpa: gpa?parseFloat(gpa):undefined })
    updateProfile({ bio, learning_style: learningStyle||undefined, academic_goal: goal||undefined, is_public: isPublic },
      { onSuccess: () => { setSaved(true); setTimeout(()=>setSaved(false), 2500) } })
  }

  if (isLoading) return <div className="min-h-screen bg-app-bg flex items-center justify-center"><Spinner size="lg" /></div>

  return (
    <div className="min-h-screen bg-app-bg">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 pb-20 md:pb-6 max-w-xl">
          <h1 className="text-2xl font-bold mb-1">Cài đặt ⚙️</h1>
          <p className="text-text-secondary text-sm mb-6">Quản lý tài khoản và tuỳ chỉnh hồ sơ</p>
          <div className="space-y-5">
            <Section title="Thông tin cá nhân">
              <div className="space-y-3">
                <Input label="Họ và tên" value={fullName} onChange={e=>setFullName(e.target.value)} />
                <Input label="Email" value={user?.email??''} disabled className="opacity-60 cursor-not-allowed" />
                <Input label="Trường đại học" value={university} onChange={e=>setUniversity(e.target.value)} />
                <Input label="Ngành học" value={major} onChange={e=>setMajor(e.target.value)} />
                <Input label="GPA (0.0–4.0)" type="number" min="0" max="4" step="0.1" value={gpa} onChange={e=>setGpa(e.target.value)} />
              </div>
            </Section>
            <Section title="Hồ sơ học tập">
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-semibold mb-1.5">Giới thiệu bản thân</label>
                  <textarea value={bio} onChange={e=>setBio(e.target.value)} rows={3} placeholder="Chia sẻ về bản thân, mục tiêu học tập..."
                    className="w-full px-3.5 py-2.5 border-[1.5px] border-app-border rounded-input text-sm bg-app-bg focus:border-green-dark outline-none resize-none transition-colors font-sans" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5">Phong cách học</label>
                  <select value={learningStyle} onChange={e=>setLearningStyle(e.target.value as LearningStyle)} className="w-full px-3.5 py-2.5 border-[1.5px] border-app-border rounded-input text-sm bg-app-bg focus:border-green-dark outline-none transition-colors">
                    <option value="">-- Chọn phong cách --</option>
                    {['visual','auditory','reading','kinesthetic','social','solitary'].map(s=><option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5">Mục tiêu học tập</label>
                  <select value={goal} onChange={e=>setGoal(e.target.value as AcademicGoal)} className="w-full px-3.5 py-2.5 border-[1.5px] border-app-border rounded-input text-sm bg-app-bg focus:border-green-dark outline-none transition-colors">
                    <option value="">-- Chọn mục tiêu --</option>
                    {['exam_prep','certification','job_prep','research','study_abroad','startup'].map(g=><option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
              </div>
            </Section>
            <Section title="Quyền riêng tư">
              <label className="flex items-center justify-between cursor-pointer">
                <div><p className="text-sm font-medium">Hiển thị hồ sơ công khai</p><p className="text-xs text-text-muted">Cho phép sinh viên khác xem hồ sơ của bạn</p></div>
                <div onClick={()=>setIsPublic(v=>!v)} className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${isPublic?'bg-green-dark':'bg-app-border'}`}>
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${isPublic?'left-7':'left-1'}`} />
                </div>
              </label>
            </Section>
            <Section title="Thông báo">
              {[['Lời mời kết nối mới',true],['Tin nhắn mới',true],['Cập nhật nhóm học',true],['Gợi ý bạn học từ AI',false]].map(([label,d]) => (
                <label key={label as string} className="flex items-center justify-between py-2 border-b border-app-border last:border-0 cursor-pointer">
                  <span className="text-sm">{label as string}</span>
                  <input type="checkbox" defaultChecked={d as boolean} className="w-4 h-4 accent-green-dark cursor-pointer" />
                </label>
              ))}
            </Section>
            <motion.div animate={saved?{scale:[1,1.02,1]}:{}}>
              <Button onClick={handleSave} loading={saving} className="w-full">{saved?'✓ Đã lưu thay đổi':'Lưu thay đổi'}</Button>
            </motion.div>
          </div>
        </main>
      </div>
      <MobileNav />
    </div>
  )
}
