import { useNotes } from '../../hooks/useNotes'
import { useTasks } from '../../hooks/useTasks'
import {
  NotebookPen, CheckSquare, Timer, CalendarDays,
  TrendingUp, Flame, BookOpen, Target
} from 'lucide-react'

const quotes = [
  "Success is the sum of small efforts, repeated day in and day out.",
  "The secret of getting ahead is getting started.",
  "Study hard, for the well is deep and our brains are shallow.",
  "Education is not the filling of a pail, but the lighting of a fire.",
  "The more that you read, the more things you will know.",
  "Don't watch the clock; do what it does. Keep going.",
]

export default function Dashboard({ setActiveView, VIEWS }) {
  const { notes } = useNotes()
  const { tasks } = useTasks()

  const completedTasks = tasks.filter(t => t.done).length
  const pendingTasks   = tasks.filter(t => !t.done).length
  const progressPct    = tasks.length ? Math.round((completedTasks / tasks.length) * 100) : 0
  const todayQuote     = quotes[new Date().getDay() % quotes.length]

  const recentNotes = notes.slice(0, 3)

  const stats = [
    {
      label: 'Total Notes',
      value: notes.length,
      icon: NotebookPen,
      color: 'text-primary-400',
      bg: 'bg-primary-500/10',
      view: VIEWS.NOTES,
    },
    {
      label: 'Tasks Done',
      value: completedTasks,
      icon: CheckSquare,
      color: 'text-green-400',
      bg: 'bg-green-500/10',
      view: VIEWS.TASKS,
    },
    {
      label: 'Pending Tasks',
      value: pendingTasks,
      icon: Target,
      color: 'text-yellow-400',
      bg: 'bg-yellow-500/10',
      view: VIEWS.TASKS,
    },
    {
      label: 'Focus Sessions',
      value: parseInt(localStorage.getItem('pomodoroSessions') || '0'),
      icon: Flame,
      color: 'text-orange-400',
      bg: 'bg-orange-500/10',
      view: VIEWS.POMODORO,
    },
  ]

  return (
    <div className="space-y-6 max-w-6xl animate-slide-up">
      {/* Welcome Banner */}
      <div className="glass-card p-6 bg-gradient-to-r from-primary-600/20 to-accent-500/10 border border-primary-500/20 glow-purple">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <BookOpen size={18} className="text-primary-400" />
              <span className="text-primary-400 text-sm font-medium">Good day, Student! 👋</span>
            </div>
            <h2 className="text-2xl font-bold text-white">Welcome to <span className="gradient-text">StudyNest</span></h2>
            <p className="text-slate-400 text-sm mt-1 max-w-lg italic">"{todayQuote}"</p>
          </div>
          <div className="text-right hidden md:block">
            <p className="text-slate-500 text-xs mb-1">Task Progress</p>
            <p className="text-3xl font-bold gradient-text">{progressPct}%</p>
            <div className="w-24 h-1.5 bg-dark-500 rounded-full mt-1.5 ml-auto">
              <div
                className="h-full bg-gradient-to-r from-primary-600 to-primary-400 rounded-full transition-all duration-700"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color, bg, view }) => (
          <button
            key={label}
            onClick={() => setActiveView(view)}
            className="stat-card hover:border-white/10 transition-all duration-200 hover:-translate-y-0.5 text-left"
          >
            <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
              <Icon size={20} className={color} />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{value}</p>
              <p className="text-slate-500 text-xs">{label}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Recent Notes + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Notes */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <NotebookPen size={16} className="text-primary-400" />
              Recent Notes
            </h3>
            <button onClick={() => setActiveView(VIEWS.NOTES)} className="text-primary-400 text-xs hover:text-primary-300 transition-colors">
              See all →
            </button>
          </div>
          {recentNotes.length === 0 ? (
            <div className="text-center py-8 text-slate-600">
              <NotebookPen size={32} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">No notes yet. Start writing!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentNotes.map(note => (
                <div key={note.id} className="flex items-start gap-3 p-3 rounded-lg bg-dark-600/50 hover:bg-dark-600 transition-colors">
                  <div
                    className="w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0"
                    style={{ backgroundColor: note.color || '#7c3aed' }}
                  />
                  <div className="min-w-0">
                    <p className="text-slate-200 text-sm font-medium truncate">{note.title}</p>
                    <p className="text-slate-500 text-xs truncate mt-0.5">{note.content?.substring(0, 60)}...</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="glass-card p-5">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <TrendingUp size={16} className="text-accent-400" />
            Quick Start
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'New Note',      icon: NotebookPen, view: VIEWS.NOTES,    color: 'from-primary-600/20 to-primary-500/10 border-primary-500/20 hover:border-primary-500/40' },
              { label: 'Add Task',      icon: CheckSquare, view: VIEWS.TASKS,    color: 'from-green-600/20 to-green-500/10 border-green-500/20 hover:border-green-500/40' },
              { label: 'Start Focus',   icon: Timer,       view: VIEWS.POMODORO, color: 'from-orange-600/20 to-orange-500/10 border-orange-500/20 hover:border-orange-500/40' },
              { label: 'Plan Study',    icon: CalendarDays,view: VIEWS.PLANNER,  color: 'from-blue-600/20 to-blue-500/10 border-blue-500/20 hover:border-blue-500/40' },
            ].map(({ label, icon: Icon, view, color }) => (
              <button
                key={label}
                onClick={() => setActiveView(view)}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl bg-gradient-to-br ${color} border transition-all duration-200 hover:-translate-y-0.5`}
              >
                <Icon size={22} className="text-white/80" />
                <span className="text-white/80 text-xs font-medium">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
