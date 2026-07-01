const DAYS = ['T2','T3','T4','T5','T6','T7','CN']
const SLOTS = ['7-9h','9-11h','13-15h','15-17h','19-21h','21-23h']
function key(day: number, slot: string) { return `${day}:${slot}` }
export default function ScheduleGrid({ selected, onChange }: { selected: string[]; onChange: (s: string[]) => void }) {
  const toggle = (k: string) => onChange(selected.includes(k) ? selected.filter(x=>x!==k) : [...selected, k])
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs border-collapse">
        <thead><tr><th className="p-1.5" />{DAYS.map(d => <th key={d} className="p-1.5 text-text-secondary font-semibold text-center w-12">{d}</th>)}</tr></thead>
        <tbody>
          {SLOTS.map(slot => (
            <tr key={slot}>
              <td className="p-1.5 text-text-muted pr-3 whitespace-nowrap font-medium">{slot}</td>
              {DAYS.map((_, di) => {
                const k = key(di, slot); const active = selected.includes(k)
                return <td key={di} className="p-1"><button onClick={() => toggle(k)} className={`w-full h-7 rounded transition-colors border ${active?'bg-green-dark border-green-dark':'bg-app-bg border-app-border hover:bg-green-pale hover:border-green-light'}`} /></td>
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-xs text-text-muted mt-2 text-center">Nhấn để chọn khung giờ bạn rảnh</p>
    </div>
  )
}
