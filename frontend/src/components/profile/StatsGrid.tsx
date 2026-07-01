export default function StatsGrid({ stats }: { stats: { value: string|number; label: string }[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {stats.map(s => (
        <div key={s.label} className="bg-app-surface border border-app-border rounded-input p-4 text-center">
          <p className="text-2xl font-extrabold text-green-dark">{s.value}</p>
          <p className="text-xs text-text-muted mt-1">{s.label}</p>
        </div>
      ))}
    </div>
  )
}
