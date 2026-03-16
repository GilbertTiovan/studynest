import { Bell, LogOut } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function Header({ title }) {
  const { user, logout } = useAuth()
  const now = new Date()
  const timeString = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
  const dateString = now.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  const initials = user?.displayName
    ? user.displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.[0]?.toUpperCase() ?? '?'

  return (
    <header className="h-16 border-b border-white/5 bg-dark-900/50 backdrop-blur-sm flex items-center justify-between px-6 flex-shrink-0">
      <div>
        <h2 className="text-white font-semibold text-lg">{title}</h2>
        <p className="text-slate-500 text-xs">{dateString}</p>
      </div>

      <div className="flex items-center gap-3">
        {/* Time */}
        <div className="hidden sm:flex items-center gap-2 glass-card px-3 py-1.5">
          <span className="text-primary-400 text-sm font-mono font-medium">{timeString}</span>
        </div>

        {/* Notification pill */}
        <button className="btn-ghost p-2 relative">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary-500 rounded-full"></span>
        </button>

        {/* Avatar + nama user */}
        <div className="flex items-center gap-2">
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt={user.displayName || 'User'}
              className="w-8 h-8 rounded-full object-cover border border-white/10"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-400 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">{initials}</span>
            </div>
          )}
          <span className="hidden md:block text-slate-300 text-sm font-medium max-w-[120px] truncate">
            {user?.displayName || user?.email?.split('@')[0] || 'User'}
          </span>
        </div>

        {/* Logout */}
        <button
          onClick={logout}
          title="Logout"
          className="btn-ghost p-2 text-slate-500 hover:text-red-400"
        >
          <LogOut size={17} />
        </button>
      </div>
    </header>
  )
}

