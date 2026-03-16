import { Sparkles, Bell } from 'lucide-react'

export default function Header({ title }) {
  const now = new Date()
  const timeString = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
  const dateString = now.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

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

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-400 flex items-center justify-center">
          <Sparkles size={14} className="text-white" />
        </div>
      </div>
    </header>
  )
}
