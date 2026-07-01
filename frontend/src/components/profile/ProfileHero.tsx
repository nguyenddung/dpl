import type { IUser } from '@/types'
export default function ProfileHero({ user, xp=0, streak=0, tags=[] }: { user: IUser; xp?: number; streak?: number; tags?: string[] }) {
  const initials = user.full_name.split(' ').slice(-2).map(w=>w[0]).join('').toUpperCase()
  return (
    <div className="bg-gradient-to-br from-green-dark to-green-mid rounded-card p-7 text-white flex flex-col sm:flex-row items-start sm:items-center gap-5">
      <div className="w-20 h-20 rounded-full bg-white/20 border-[3px] border-white/50 flex items-center justify-center text-3xl font-bold flex-shrink-0">{initials}</div>
      <div className="flex-1">
        <h2 className="text-2xl font-extrabold">{user.full_name}</h2>
        <p className="text-white/80 text-sm mt-0.5">{user.major} • {user.university}</p>
        <p className="text-white/70 text-xs mt-1">{user.gpa?`GPA ${user.gpa}`:''}{user.gpa&&user.year_of_study?' • ':''}{user.year_of_study?`Năm ${user.year_of_study}`:''}</p>
        {tags.length>0 && <div className="flex flex-wrap gap-1.5 mt-3">{tags.map(t => <span key={t} className="text-xs px-2.5 py-0.5 rounded-full bg-white/20 font-medium">{t}</span>)}</div>}
      </div>
      <div className="flex gap-4 flex-shrink-0">
        <div className="text-center"><p className="text-xl font-extrabold">{xp}</p><p className="text-xs text-white/70">XP</p></div>
        <div className="text-center"><p className="text-xl font-extrabold">{streak}🔥</p><p className="text-xs text-white/70">Chuỗi ngày</p></div>
      </div>
    </div>
  )
}
