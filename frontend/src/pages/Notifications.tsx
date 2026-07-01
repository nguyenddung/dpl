import { useEffect } from 'react'
import { motion } from 'framer-motion'
import Navbar from '@/components/layout/Navbar'
import Sidebar from '@/components/layout/Sidebar'
import MobileNav from '@/components/layout/MobileNav'
import { Spinner } from '@/components/ui'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '@/store'
import { fetchNotifications, markAllRead } from '@/store/notifSlice'
import { staggerContainer, fadeIn } from '@/animations/variants'

const TYPE_ICON: Record<string,string> = { match_request:'🤝', message:'💬', group_invite:'👥', group_join:'👋', achievement:'🏆', system:'📢' }
function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff/60000)
  if (m<1) return 'vừa xong'; if (m<60) return `${m} phút trước`
  const h = Math.floor(m/60); if (h<24) return `${h} giờ trước`
  return `${Math.floor(h/24)} ngày trước`
}

export default function Notifications() {
  const dispatch = useDispatch<AppDispatch>()
  const { items, loading } = useSelector((s: RootState) => s.notif)
  useEffect(() => { dispatch(fetchNotifications()) }, [dispatch])
  return (
    <div className="min-h-screen bg-app-bg">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 pb-20 md:pb-6 max-w-2xl">
          <div className="flex items-center justify-between mb-1">
            <h1 className="text-2xl font-bold">Thông báo 🔔</h1>
            {items.some(n=>!n.is_read) && <button onClick={()=>dispatch(markAllRead())} className="text-sm text-green-dark hover:underline font-medium">Đánh dấu tất cả đã đọc</button>}
          </div>
          <p className="text-text-secondary text-sm mb-6">Cập nhật mới nhất từ bạn học và nhóm của bạn</p>
          {loading ? <div className="flex justify-center py-16"><Spinner size="lg" /></div>
            : items.length===0 ? <div className="text-center py-16 text-text-muted"><p className="text-4xl mb-3">🔔</p><p className="font-medium">Chưa có thông báo nào</p></div>
            : (
              <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-2">
                {items.map(n => (
                  <motion.div key={n.id} variants={fadeIn} className={`flex items-start gap-4 p-4 rounded-card border cursor-pointer transition-colors hover:bg-green-pale ${n.is_read?'bg-app-surface border-app-border':'bg-green-pale/60 border-green-light'}`}>
                    <span className="text-xl flex-shrink-0 mt-0.5">{TYPE_ICON[n.type] ?? '📢'}</span>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm leading-relaxed ${n.is_read?'font-normal':'font-semibold'}`}>{n.title}</p>
                      {n.body && <p className="text-xs text-text-muted mt-0.5">{n.body}</p>}
                    </div>
                    {!n.is_read && <div className="w-2 h-2 rounded-full bg-green-dark flex-shrink-0 mt-2" />}
                  </motion.div>
                ))}
              </motion.div>
            )}
        </main>
      </div>
      <MobileNav />
    </div>
  )
}
