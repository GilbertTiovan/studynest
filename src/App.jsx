import { useState } from 'react'
import Sidebar from './components/layout/Sidebar'
import Header from './components/layout/Header'
import Dashboard from './components/features/Dashboard'
import Notes from './components/features/Notes'
import Tasks from './components/features/Tasks'
import Pomodoro from './components/features/Pomodoro'
import StudyPlanner from './components/features/StudyPlanner'
import AIChat from './components/features/AIChat'

const VIEWS = {
  DASHBOARD: 'dashboard',
  NOTES: 'notes',
  TASKS: 'tasks',
  POMODORO: 'pomodoro',
  PLANNER: 'planner',
}

export default function App() {
  const [activeView, setActiveView] = useState(VIEWS.DASHBOARD)

  const renderView = () => {
    switch (activeView) {
      case VIEWS.DASHBOARD: return <Dashboard setActiveView={setActiveView} VIEWS={VIEWS} />
      case VIEWS.NOTES:     return <Notes />
      case VIEWS.TASKS:     return <Tasks />
      case VIEWS.POMODORO:  return <Pomodoro />
      case VIEWS.PLANNER:   return <StudyPlanner />
      default:              return <Dashboard />
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
      {/* Sidebar */}
      <Sidebar activeView={activeView} setActiveView={setActiveView} VIEWS={VIEWS} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header title={viewTitles[activeView]} />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="animate-fade-in">
            {renderView()}
          </div>
        </main>
      </div>

      {/* AI Chat Floating Button — always visible */}
      <AIChat />
    </div>
  )
}
