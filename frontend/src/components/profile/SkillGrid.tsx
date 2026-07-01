const LEVEL_COLOR: Record<string,string> = { beginner:'text-blue-500', intermediate:'text-amber-500', advanced:'text-green-dark', expert:'text-purple-600' }
export default function SkillGrid({ skills }: { skills: { name: string; level: string }[] }) {
  if (!skills.length) return <p className="text-sm text-text-muted">Chưa có kỹ năng nào.</p>
  return (
    <div className="grid grid-cols-2 gap-2">
      {skills.map(s => (
        <div key={s.name} className="flex items-center gap-2 border border-app-border rounded-input px-3 py-2">
          <div className="w-2 h-2 rounded-full bg-green-dark flex-shrink-0" />
          <span className="text-sm font-medium flex-1 truncate">{s.name}</span>
          <span className={`text-xs ${LEVEL_COLOR[s.level] ?? 'text-text-muted'}`}>{s.level}</span>
        </div>
      ))}
    </div>
  )
}
