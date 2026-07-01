import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store'

const ITEMS = [
  { path: '/discover', icon: '🔍', label: 'Khám phá' },
  { path: '/groups', icon: '👥', label: 'Nhóm học' },
  { path: '/messages', icon: '💬', label: 'Tin nhắn' },
  { path: '/notifications', icon: '🔔', label: 'Thông báo' },
  { path: '/profile', icon: '👤', label: 'Hồ sơ' },
  { path: '/settings', icon: '⚙️', label: 'Cài đặt' },
]

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const unread = useSelector((s: RootState) => s.notif.unreadCount)
  return (
    <aside className="hidden md:flex flex-col w-56 border-r border-app-border bg-app-surface px-4 py-6 min-h-[calc(100vh-56px)]">
      {user && (
        <div className="flex items-center gap-2.5 bg-green-pale rounded-input px-3 py-2.5 mb-6">
          <div className="w-9 h-9 rounded-full bg-green-light text-green-dark flex items-center justify-center text-sm font-bold flex-shrink-0">
            {user.full_name.split(' ').slice(-1)[0][0]}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-semibold truncate">{user.full_name}</p>
            <p className="text-xs text-text-muted truncate">{user.university ?? 'Sinh viên'}</p>
          </div>
        </div>
      )}
      <nav className="flex flex-col gap-1 flex-1">
        {ITEMS.map(item => (
          <NavLink key={item.path} to={item.path}
            className={({ isActive }) => `flex items-center gap-2.5 px-3 py-2.5 rounded-input text-sm font-medium transition-colors ${isActive ? 'bg-green-dark text-white' : 'text-text-secondary hover:bg-green-pale hover:text-green-dark'}`}>
            <span>{item.icon}</span>
            <span className="flex-1">{item.label}</span>
            {item.path === '/notifications' && unread > 0 && (
              <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{unread}</span>
            )}
          </NavLink>
        ))}
      </nav>
      <button onClick={async () => { await logout(); navigate('/login') }}
        className="flex items-center gap-2 px-3 py-2 text-sm text-text-muted hover:text-red-500 rounded-input transition-colors mt-4">
        <span>🚪</span> Đăng xuất
      </button>
    </aside>
  )
}
