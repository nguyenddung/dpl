import { motion } from 'framer-motion'
import type { IFactorBreakdown } from '@/types'

const FACTORS: { key: keyof IFactorBreakdown; label: string; icon: string }[] = [
  { key: 'subject_score', label: 'Môn học tương đồng', icon: '📚' },
  { key: 'schedule_score', label: 'Lịch học trùng', icon: '📅' },
  { key: 'style_score', label: 'Phong cách học', icon: '🎯' },
  { key: 'goal_score', label: 'Mục tiêu học tập', icon: '🏆' },
  { key: 'gpa_score', label: 'Trình độ GPA', icon: '📊' },
]

export default function CompatChart({ factors }: { factors: IFactorBreakdown }) {
  return (
    <div className="space-y-3">
      {FACTORS.map(({ key, label, icon }) => {
        const val = Math.round(factors[key])
        const color = val >= 85 ? 'bg-green-dark' : val >= 65 ? 'bg-amber-400' : 'bg-text-muted'
        return (
          <div key={key} className="flex items-center gap-3">
            <span className="text-base w-6">{icon}</span>
            <span className="text-sm font-medium text-text-primary w-40 flex-shrink-0">{label}</span>
            <div className="flex-1 h-2 bg-app-border rounded-full overflow-hidden">
              <motion.div className={`h-full rounded-full ${color}`} initial={{ width: 0 }} animate={{ width: `${val}%` }} transition={{ duration: 0.9, delay: 0.15 }} />
            </div>
            <span className="text-sm font-bold text-green-dark w-10 text-right">{val}%</span>
          </div>
        )
      })}
    </div>
  )
}
