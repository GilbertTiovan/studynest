import { useState } from 'react'
import {
  LayoutDashboard,
  NotebookPen,
  CheckSquare,
  Timer,
  CalendarDays,
  BookOpen,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

const navItems = [
  { id: 'dashboard', label: 'Dashboard',    icon: LayoutDashboard },
  { id: 'notes',     label: 'Notes',        icon: NotebookPen },
  { id: 'tasks',     label: 'Tasks',        icon: CheckSquare },
  { id: 'pomodoro',  label: 'Focus Timer',  icon: Timer },
  { id: 'planner',   label: 'Study Planner',icon: CalendarDays },
]

export default function Sidebar({ activeView, setActiveView }) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={`flex-shrink-0 bg-dark-900/90 border-r border-white/5 flex flex-col h-full transition-all duration-300 ease-in-out relative ${
        collapsed ? 'w-16' : 'w-60'
      }`}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setCollapsed(c => !c)}
        className="absolute -right-3 top-7 z-10 w-6 h-6 bg-dark-600 border border-white/10 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-primary-600 hover:border-primary-500 transition-all duration-200 shadow-lg"
      >
        {collapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
      </button>

      {/* Logo */}
      <div className={`border-b border-white/5 flex items-center gap-3 transition-all duration-300 ${collapsed ? 'px-3.5 py-6 justify-center' : 'px-5 py-6'}`}>
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-600 to-primary-400 flex items-center justify-center shadow-lg shadow-primary-600/30 flex-shrink-0">
          <BookOpen size={18} className="text-white" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="text-white font-bold text-lg leading-none whitespace-nowrap">StudyNest</h1>
            <p className="text-slate-500 text-xs mt-0.5 whitespace-nowrap">Productivity Hub</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className={`flex-1 overflow-y-auto space-y-1 transition-all duration-300 ${collapsed ? 'p-2' : 'p-3'}`}>
        {!collapsed && (
          <p className="text-slate-600 text-xs font-semibold uppercase tracking-wider px-3 mb-2 mt-1">Menu</p>
        )}
        {navItems.map(({ id, label, icon: Icon }) => (
          <div key={id} className="relative group/tooltip">
            <button
              onClick={() => setActiveView(id)}
              className={`nav-item w-full transition-all duration-300 ${activeView === id ? 'active' : ''} ${collapsed ? 'justify-center px-0 py-2.5' : ''}`}
            >
              <Icon size={18} className={activeView === id ? 'text-primary-400' : ''} />
              {!collapsed && label}
            </button>
            {/* Tooltip saat collapsed */}
            {collapsed && (
              <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2.5 py-1.5 bg-dark-600 border border-white/10 rounded-lg text-white text-xs whitespace-nowrap opacity-0 group-hover/tooltip:opacity-100 pointer-events-none transition-opacity duration-200 shadow-xl z-50">
                {label}
                <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-dark-600" />
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className={`border-t border-white/5 transition-all duration-300 ${collapsed ? 'p-2' : 'p-4'}`}>
        {collapsed ? (
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-600/20 to-accent-500/10 border border-primary-500/20 mx-auto flex items-center justify-center">
            <span className="text-xs">🚀</span>
          </div>
        ) : (
          <div className="glass-card p-3 text-center">
            <p className="text-xs text-slate-500">WDC 2026</p>
            <p className="text-xs font-semibold gradient-text mt-0.5">Empowering Students 🚀</p>
          </div>
        )}
      </div>
    </aside>
  )
}
