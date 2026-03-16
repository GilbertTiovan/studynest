import { useState } from 'react'
import { useTasks } from '../../hooks/useTasks'
import {
  Plus, Trash2, CheckSquare, Square, X, Save,
  CheckCheck, Circle, Loader2, Filter
} from 'lucide-react'

const PRIORITIES = ['High', 'Medium', 'Low']
const FILTERS    = ['All', 'Active', 'Completed']

const EMPTY_FORM = { title: '', priority: 'Medium', deadline: '' }

export default function Tasks() {
  const { tasks, loading, addTask, toggleTask, deleteTask } = useTasks()
  const [filter, setFilter]     = useState('All')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm]         = useState(EMPTY_FORM)
  const [saving, setSaving]     = useState(false)

  const filtered = tasks.filter(t => {
    if (filter === 'Active')    return !t.done
    if (filter === 'Completed') return t.done
    return true
  })

  const completedCount = tasks.filter(t => t.done).length
  const progress       = tasks.length ? Math.round((completedCount / tasks.length) * 100) : 0

  const handleSave = async () => {
    if (!form.title.trim()) return
    setSaving(true)
    try { await addTask(form); setShowModal(false); setForm(EMPTY_FORM) }
    finally { setSaving(false) }
  }

  const priorityClass = (p) => {
    if (p === 'High')   return 'priority-high'
    if (p === 'Low')    return 'priority-low'
    return 'priority-medium'
  }

  return (
    <div className="space-y-5 max-w-3xl animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <CheckSquare size={20} className="text-green-400" /> My Tasks
          </h2>
          <p className="text-slate-500 text-sm">{completedCount}/{tasks.length} selesai</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Add Task
        </button>
      </div>

      {/* Progress Bar */}
      {tasks.length > 0 && (
        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-sm font-medium">Progress Keseluruhan</span>
            <span className="text-white font-bold">{progress}%</span>
          </div>
          <div className="w-full h-2 bg-dark-500 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-600 to-green-400 rounded-full transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Filter */}
      <div className="flex gap-2">
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              filter === f ? 'bg-green-600 text-white' : 'bg-dark-600 text-slate-400 hover:bg-dark-500'
            }`}
          >
            <Filter size={12} /> {f}
            <span className="ml-1 text-xs opacity-70">
              ({f === 'All' ? tasks.length : f === 'Active' ? tasks.filter(t=>!t.done).length : completedCount})
            </span>
          </button>
        ))}
      </div>

      {/* Task List */}
      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 size={32} className="animate-spin text-green-400" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-600">
          <CheckCheck size={48} className="mx-auto mb-3 opacity-20" />
          <p className="font-medium">Tidak ada tugas {filter !== 'All' ? filter.toLowerCase() : ''}</p>
          <p className="text-sm mt-1">Klik "Add Task" untuk menambahkan tugas baru</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(task => (
            <div
              key={task.id}
              className={`glass-card p-4 flex items-center gap-3 group hover:border-white/10 transition-all duration-200 ${task.done ? 'opacity-60' : ''}`}
            >
              <button onClick={() => toggleTask(task.id, task.done)} className="flex-shrink-0">
                {task.done
                  ? <CheckSquare size={20} className="text-green-400" />
                  : <Square size={20} className="text-slate-500 hover:text-green-400 transition-colors" />
                }
              </button>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${task.done ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                  {task.title}
                </p>
                {task.deadline && (
                  <p className="text-xs text-slate-600 mt-0.5">
                    📅 {new Date(task.deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                )}
              </div>
              <span className={`tag text-xs ${priorityClass(task.priority)}`}>{task.priority}</span>
              <button
                onClick={() => deleteTask(task.id)}
                className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-red-400 transition-all"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="glass-card w-full max-w-md p-6 space-y-4 border border-white/10 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-semibold">New Task</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-500 hover:text-slate-300">
                <X size={20} />
              </button>
            </div>
            <input
              autoFocus
              type="text"
              placeholder="Nama tugas..."
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              className="input-field"
            />
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-500 text-xs mb-1 block">Prioritas</label>
                <select
                  value={form.priority}
                  onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}
                  className="input-field text-sm"
                >
                  {PRIORITIES.map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="text-slate-500 text-xs mb-1 block">Deadline (opsional)</label>
                <input
                  type="date"
                  value={form.deadline}
                  onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))}
                  className="input-field text-sm"
                />
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setShowModal(false)} className="btn-secondary text-sm">Batal</button>
              <button onClick={handleSave} disabled={saving || !form.title.trim()} className="btn-primary text-sm flex items-center gap-2">
                {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                Tambah
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
