import { useState } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import Sidebar from './components/layout/Sidebar'
import Header from './components/layout/Header'
import Dashboard from './components/features/Dashboard'
import Notes from './components/features/Notes'
import Tasks from './components/features/Tasks'
import Pomodoro from './components/features/Pomodoro'
import StudyPlanner from './components/features/StudyPlanner'
import AIChat from './components/features/AIChat'
import LoginPage from './components/auth/LoginPage'
import RegisterPage from './components/auth/RegisterPage'

const VIEWS = {
  DASHBOARD: 'dashboard',
  NOTES: 'notes',
  TASKS: 'tasks',
  POMODORO: 'pomodoro',
  PLANNER: 'planner',
}

function AppContent() {
  const { user, loading } = useAuth()
  const [activeView, setActiveView] = useState(VIEWS.DASHBOARD)
  const [authView, setAuthView] = useState('login') // 'login' | 'register'

  // Splash loading saat Firebase Auth sedang menentukan sesi
  if (loading) {
    return (
      <div className="min-h-screen bg-dark-800 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-600 to-primary-400 flex items-center justify-center animate-pulse-slow shadow-lg shadow-primary-600/30">
            <span className="text-white text-xl">📚</span>
          </div>
          <p className="text-slate-500 text-sm animate-pulse">Memuat StudyNest...</p>
        </div>
      </div>
    )
  }

  // Belum login → halaman auth
  if (!user) {
    return authView === 'login'
      ? <LoginPage onSwitchToRegister={() => setAuthView('register')} />
      : <RegisterPage onSwitchToLogin={() => setAuthView('login')} />
  }

  const renderView = () => {
    switch (activeView) {
      case VIEWS.DASHBOARD: return <Dashboard setActiveView={setActiveView} VIEWS={VIEWS} />
      case VIEWS.NOTES:     return <Notes />
      case VIEWS.TASKS:     return <Tasks />
      case VIEWS.POMODORO:  return <Pomodoro />
      case VIEWS.PLANNER:   return <StudyPlanner />
      default:              return <Dashboard setActiveView={setActiveView} VIEWS={VIEWS} />
    }
  }

  const viewTitles = {
    [VIEWS.DASHBOARD]: 'Dashboard',
    [VIEWS.NOTES]:     'Notes',
    [VIEWS.TASKS]:     'Tasks',
    [VIEWS.POMODORO]:  'Focus Timer',
    [VIEWS.PLANNER]:   'Study Planner',
  }

  return (
    <div className="flex h-screen bg-dark-800 overflow-hidden">
      <Sidebar activeView={activeView} setActiveView={setActiveView} VIEWS={VIEWS} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header title={viewTitles[activeView]} />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="animate-fade-in">
            {renderView()}
          </div>
        </main>
      </div>
      <AIChat />
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

