import { NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store'

const TABS = [
  { path: '/discover', icon: '🔍', label: 'Khám phá' },
  { path: '/groups', icon: '👥', label: 'Nhóm' },
  { path: '/messages', icon: '💬', label: 'Tin nhắn' },
  { path: '/notifications', icon: '🔔', label: 'Thông báo' },
  { path: '/profile', icon: '👤', label: 'Hồ sơ' },
]

export default function MobileNav() {
  const unread = useSelector((s: RootState) => s.notif.unreadCount)
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-app-border flex">
      {TABS.map(tab => (
        <NavLink key={tab.path} to={tab.path}
          className={({ isActive }) => `flex-1 flex flex-col items-center justify-center py-2 gap-0.5 text-[10px] font-medium transition-colors relative ${isActive ? 'text-green-dark' : 'text-text-muted'}`}>
          <span className="text-xl leading-none">{tab.icon}</span>
          <span>{tab.label}</span>
          {tab.path === '/notifications' && unread > 0 && (
            <span className="absolute top-1.5 right-[calc(50%-14px)] w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
              {unread > 9 ? '9+' : unread}
            </span>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
