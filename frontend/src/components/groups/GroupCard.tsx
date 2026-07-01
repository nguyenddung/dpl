import { motion } from 'framer-motion'
import { groupsService } from '@/services/groups.service'
import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import type { IStudyGroup } from '@/types'
import MemberAvatars from './MemberAvatars'

const BG_COLORS = ['bg-emerald-50','bg-blue-50','bg-amber-50','bg-pink-50','bg-purple-50','bg-teal-50']

export default function GroupCard({ group, index=0, isMember=false }: { group: IStudyGroup; index?: number; isMember?: boolean }) {
  const qc = useQueryClient()
  const [loading, setLoading] = useState(false)
  const [member, setMember] = useState(isMember)
  const bg = BG_COLORS[index % BG_COLORS.length]
  const toggle = async () => {
    setLoading(true)
    try {
      if (member) { await groupsService.leave(group.id); setMember(false) }
      else { await groupsService.join(group.id); setMember(true) }
      qc.invalidateQueries({ queryKey: ['groups'] })
    } catch {}
    setLoading(false)
  }
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index*0.05 }}
      className="bg-app-surface border border-app-border rounded-card p-5 hover:shadow-card-hover transition-shadow">
      <div className={`w-12 h-12 ${bg} rounded-[14px] flex items-center justify-center text-2xl mb-3`}>{group.icon ?? '📚'}</div>
      <h3 className="font-bold text-base mb-1 truncate">{group.name}</h3>
      <p className="text-sm text-text-secondary mb-3 line-clamp-2 min-h-[2.5rem]">{group.description}</p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MemberAvatars count={group.member_count} />
          <span className="text-xs text-text-muted">{group.member_count}/{group.max_members}</span>
        </div>
        <button onClick={toggle} disabled={loading}
          className={`text-sm font-semibold px-4 py-1.5 rounded-full transition-all ${member ? 'border-[1.5px] border-app-border text-text-secondary hover:border-green-mid hover:text-green-dark' : 'bg-green-dark text-white hover:bg-green-mid'}`}>
          {loading ? '...' : member ? 'Đã tham gia' : 'Tham gia'}
        </button>
      </div>
    </motion.div>
  )
}
