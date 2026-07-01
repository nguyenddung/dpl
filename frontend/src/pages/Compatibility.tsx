import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from '@/components/layout/Navbar'
import Sidebar from '@/components/layout/Sidebar'
import MobileNav from '@/components/layout/MobileNav'
import ScoreRing from '@/components/matching/ScoreRing'
import CompatChart from '@/components/matching/CompatChart'
import { Avatar, Tag, Button, Spinner } from '@/components/ui'
import { useCompatibility, useConnect } from '@/hooks/useMatches'
import { useState } from 'react'

export default function Compatibility() {
  const { userId } = useParams<{ userId: string }>()
  const navigate = useNavigate()
  const { data: match, isLoading } = useCompatibility(userId ?? null)
  const { mutate: connect, isPending } = useConnect()
  const [sent, setSent] = useState(false)
  return (
    <div className="min-h-screen bg-app-bg">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 pb-20 md:pb-6 max-w-2xl">
          <button onClick={()=>navigate(-1)} className="text-sm text-text-secondary hover:text-green-dark mb-4 flex items-center gap-1">← Quay lại</button>
          {isLoading ? <div className="flex justify-center py-20"><Spinner size="lg" /></div>
            : !match ? <p className="text-text-muted text-center py-20">Không tìm thấy thông tin.</p>
            : (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <div className="bg-app-surface border border-app-border rounded-card p-6 flex flex-col sm:flex-row gap-6 items-center">
                  <ScoreRing score={Math.round(match.score)} />
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <Avatar name={match.full_name} src={match.avatar_url} size="lg" />
                      <div><h2 className="text-xl font-bold">{match.full_name}</h2><p className="text-text-secondary text-sm">{match.major}</p><p className="text-text-muted text-xs">{match.university}</p></div>
                    </div>
                    <div className="flex flex-wrap gap-1.5">{match.tags.map(t=><Tag key={t} label={t} />)}</div>
                  </div>
                </div>
                <div className="bg-app-surface border border-app-border rounded-card p-6">
                  <h3 className="font-bold mb-4">Phân tích AI chi tiết</h3>
                  <CompatChart factors={match.factors} />
                </div>
                <div className="flex gap-3">
                  <Button className="flex-1" onClick={()=>connect(match.user_id,{onSuccess:()=>setSent(true)})} disabled={sent||match.status==='connected'||isPending}>
                    {sent||match.status==='connected' ? '✓ Đã kết nối' : '🤝 Bắt đầu kết nối'}
                  </Button>
                  <Button variant="secondary" onClick={()=>navigate('/messages')}>💬 Nhắn tin</Button>
                </div>
              </motion.div>
            )}
        </main>
      </div>
      <MobileNav />
    </div>
  )
}
