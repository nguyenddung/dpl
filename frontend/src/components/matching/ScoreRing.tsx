import { motion } from 'framer-motion'
export default function ScoreRing({ score, size=140 }: { score: number; size?: number }) {
  const r = (size - 16) / 2
  const circ = 2 * Math.PI * r
  const dash = (score / 100) * circ
  const color = score >= 90 ? '#1E5A44' : score >= 75 ? '#d97706' : '#7A9B88'
  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#E0EDE5" strokeWidth={10} />
        <motion.circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={10} strokeLinecap="round"
          strokeDasharray={circ} initial={{ strokeDashoffset: circ }} animate={{ strokeDashoffset: circ - dash }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
          transform={`rotate(-90, ${size/2}, ${size/2})`} />
        <text x={size/2} y={size/2} textAnchor="middle" dominantBaseline="central" fontSize={size*0.22} fontWeight={800} fill={color}>{score}%</text>
      </svg>
      <p className="text-sm font-semibold text-green-dark">
        {score >= 90 ? '🎉 Rất phù hợp!' : score >= 75 ? '👍 Phù hợp' : '🔍 Khá phù hợp'}
      </p>
    </div>
  )
}
