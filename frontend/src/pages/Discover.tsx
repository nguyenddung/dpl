import { useState } from 'react'
import { motion } from 'framer-motion'
import Navbar from '@/components/layout/Navbar'
import Sidebar from '@/components/layout/Sidebar'
import MobileNav from '@/components/layout/MobileNav'
import MatchCard from '@/components/matching/MatchCard'
import { Spinner } from '@/components/ui'
import { useRecommendations } from '@/hooks/useMatches'

export default function Discover() {
  const [query, setQuery] = useState('')
  const { data, isLoading, refetch } = useRecommendations(20)
  const results = data?.results.filter(r => !query || r.full_name.toLowerCase().includes(query.toLowerCase()) || r.major?.toLowerCase().includes(query.toLowerCase()) || r.tags.some(t=>t.toLowerCase().includes(query.toLowerCase()))) ?? []
  return (
    <div className="min-h-screen bg-app-bg">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 pb-20 md:pb-6 max-w-5xl">
          <h1 className="text-2xl font-bold mb-1">Khám phá bạn học 🔍</h1>
          <p className="text-text-secondary text-sm mb-5">AI đề xuất dựa trên phong cách và lịch học của bạn</p>
          <div className="flex gap-3 mb-6 flex-wrap">
            <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="🔍 Tìm kiếm tên, ngành, môn học..."
              className="flex-1 min-w-48 px-4 py-2.5 border-[1.5px] border-app-border rounded-input text-sm bg-app-surface focus:border-green-dark outline-none transition-colors" />
            <button onClick={()=>refetch()} className="px-5 py-2.5 bg-green-dark text-white text-sm font-semibold rounded-input hover:bg-green-mid transition-colors">✨ AI Match</button>
          </div>
          {isLoading ? <div className="flex justify-center py-20"><Spinner size="lg" /></div>
            : results.length===0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16 text-text-muted">
                <p className="text-4xl mb-3">🔍</p><p className="font-medium">Không tìm thấy kết quả phù hợp</p><p className="text-sm mt-1">Thử thay đổi từ khóa hoặc nhấn AI Match</p>
              </motion.div>
            ) : <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{results.map((m,i)=><MatchCard key={m.user_id} match={m} index={i} />)}</div>}
        </main>
      </div>
      <MobileNav />
    </div>
  )
}
