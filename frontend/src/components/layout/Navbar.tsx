import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store'

const NAV_LINKS = [
  { path: '/discover', label: 'Khám phá' },
  { path: '/groups', label: 'Nhóm học' },
  { path: '/messages', label: 'Tin nhắn' },
]

export default function Navbar() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const unread = useSelector((s: RootState) => s.notif.unreadCount)
  const handleLogout = async () => { await logout(); navigate('/login') }
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-app-border flex items-center px-6 h-14 gap-2">
      <Link to={user ? '/discover' : '/'} className="flex items-center gap-2 font-extrabold text-xl text-green-dark mr-4">
        <span className="w-8 h-8 bg-green-dark rounded-[10px] flex items-center justify-center text-base">🐸</span>
        CócStudy
      </Link>
      {user && (
        <nav className="hidden md:flex gap-1">
          {NAV_LINKS.map(l => (
            <Link key={l.path} to={l.path}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${pathname.startsWith(l.path) ? 'bg-green-pale text-green-dark font-semibold' : 'text-text-secondary hover:bg-green-pale hover:text-green-dark'}`}>
              {l.label}
            </Link>
          ))}
        </nav>
      )}
      <div className="flex-1" />
      {user ? (
        <div className="flex items-center gap-2">
          <Link to="/notifications" className="relative p-2 rounded-full hover:bg-green-pale transition-colors">
            <span className="text-lg">🔔</span>
            {unread > 0 && (
              <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
                className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unread > 9 ? '9+' : unread}
              </motion.span>
            )}
          </Link>
          <Link to="/profile" className="w-8 h-8 bg-green-pale text-green-dark rounded-full flex items-center justify-center text-sm font-bold hover:bg-green-light transition-colors">
            {user.full_name.split(' ').slice(-1)[0][0]}
          </Link>
          <button onClick={handleLogout} className="hidden md:block text-sm text-text-secondary hover:text-green-dark ml-1 transition-colors">
            Đăng xuất
          </button>
        </div>
      ) : (
        <div className="flex gap-2">
          <Link to="/login" className="px-4 py-1.5 text-sm font-medium border-[1.5px] border-green-dark text-green-dark rounded-full hover:bg-green-pale transition-colors">Đăng nhập</Link>
          <Link to="/register" className="px-4 py-1.5 text-sm font-medium bg-green-dark text-white rounded-full hover:bg-green-mid transition-colors">Đăng ký</Link>
        </div>
      )}
    </header>
  )
}
