const COLORS = ['bg-emerald-200 text-emerald-800','bg-blue-200 text-blue-800','bg-pink-200 text-pink-800','bg-amber-200 text-amber-800']
export default function MemberAvatars({ count, max=4 }: { count: number; max?: number }) {
  const shown = Math.min(count, max)
  return (
    <div className="flex">
      {Array.from({ length: shown }).map((_, i) => (
        <div key={i} className={`w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold ${COLORS[i%COLORS.length]} ${i>0?'-ml-2':''}`}>
          {String.fromCharCode(65+i)}
        </div>
      ))}
      {count > max && <div className="-ml-2 w-7 h-7 rounded-full border-2 border-white bg-app-border text-text-muted flex items-center justify-center text-[9px] font-bold">+{count-max}</div>}
    </div>
  )
}
