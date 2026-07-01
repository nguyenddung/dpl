import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Avatar, Tag, OnlineDot } from '@/components/ui'
import { useConnect } from '@/hooks/useMatches'
import type { IMatchResult } from '@/types'
import { useState } from 'react'

export default function MatchCard({ match, index=0 }: { match: IMatchResult; index?: number }) {
  const navigate = useNavigate()
  const { mutate: connect, isPending } = useConnect()
  const [sent, setSent] = useState(match.status !== 'suggested')
  const handleConnect = (e: React.MouseEvent) => { e.stopPropagation(); connect(match.user_id, { onSuccess: () => setSent(true) }) }
  const scoreColor = match.score >= 90 ? 'text-green-dark' : match.score >= 75 ? 'text-amber-600' : 'text-text-secondary'
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: index*0.05 }}
      whileHover={{ y: -2, boxShadow: '0 6px 28px rgba(30,90,68,0.14)' }}
      onClick={() => navigate(`/compatibility/${match.user_id}`)}
      className="bg-app-surface border border-app-border rounded-card p-5 cursor-pointer transition-shadow">
      <div className="flex items-start gap-3 mb-3">
        <Avatar name={match.full_name} src={match.avatar_url} size="lg" index={index} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="font-bold text-base truncate">{match.full_name}</span>
            {index % 3 !== 2 && <OnlineDot />}
          </div>
          <p className="text-sm text-text-secondary truncate">{match.major}</p>
          <p className="text-xs text-text-muted truncate">{match.university}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className={`text-xl font-extrabold ${scoreColor}`}>{match.score}%</p>
          <p className="text-xs text-text-muted">phù hợp</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5 mb-3">{match.tags.slice(0,4).map(t => <Tag key={t} label={t} />)}</div>
      <div className="flex gap-2">
        <button onClick={handleConnect} disabled={sent||isPending}
          className={`flex-1 py-2 text-sm font-semibold rounded-full transition-all ${sent ? 'bg-green-pale text-green-dark cursor-default' : 'bg-green-dark text-white hover:bg-green-mid'}`}>
          {sent ? '✓ Đã gửi' : isPending ? 'Đang gửi...' : 'Kết nối'}
        </button>
        <button onClick={e => { e.stopPropagation(); navigate(`/compatibility/${match.user_id}`) }}
          className="px-4 py-2 text-sm font-semibold border-[1.5px] border-app-border text-text-secondary rounded-full hover:border-green-mid hover:text-green-dark transition-colors">
          Chi tiết
        </button>
      </div>
    </motion.div>
  )
}
