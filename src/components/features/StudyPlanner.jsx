import { useState } from 'react'
import { usePlanner } from '../../hooks/usePlanner'
import {
  CalendarDays, Plus, Trash2, X, Save,
  Clock, BookOpen, Loader2
} from 'lucide-react'

const DAYS = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu']

const COLORS = [
  { value: '#7c3aed', label: 'Ungu' },
  { value: '#2563eb', label: 'Biru' },
  { value: '#059669', label: 'Hijau' },
  { value: '#d97706', label: 'Kuning' },
  { value: '#dc2626', label: 'Merah' },
  { value: '#db2777', label: 'Pink' },
]

const EMPTY_FORM = { day: 'Senin', subject: '', startTime: '08:00', endTime: '10:00', color: '#7c3aed', note: '' }

export default function StudyPlanner() {
  const { entries, loading, addEntry, deleteEntry } = usePlanner()
  const [showModal, setShowModal] = useState(false)
  const [form, setForm]           = useState(EMPTY_FORM)
  const [saving, setSaving]       = useState(false)
  const [activeDay, setActiveDay]  = useState('All')

  const filtered = activeDay === 'All'
    ? entries
    : entries.filter(e => e.day === activeDay)

  const byDay = DAYS.reduce((acc, d) => {
    acc[d] = entries.filter(e => e.day === d)
    return acc
  }, {})

  const handleSave = async () => {
    if (!form.subject.trim()) return
    setSaving(true)
    try { await addEntry(form); setShowModal(false); setForm(EMPTY_FORM) }
    finally { setSaving(false) }
  }

  return (
    <div className="space-y-5 max-w-5xl animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <CalendarDays size={20} className="text-blue-400" /> Study Planner
          </h2>
          <p className="text-slate-500 text-sm">{entries.length} sesi terjadwal minggu ini</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Add Schedule
        </button>
      </div>

      {/* Day Filter */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setActiveDay('All')}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
            activeDay === 'All' ? 'bg-blue-600 text-white' : 'bg-dark-600 text-slate-400 hover:bg-dark-500'
          }`}
        >
          All
        </button>
        {DAYS.map(d => (
          <button
            key={d}
            onClick={() => setActiveDay(d)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              activeDay === d ? 'bg-blue-600 text-white' : 'bg-dark-600 text-slate-400 hover:bg-dark-500'
            }`}
          >
            {d}
            {byDay[d].length > 0 && (
              <span className="ml-1.5 text-xs bg-white/10 px-1.5 rounded-full">{byDay[d].length}</span>
            )}
          </button>
        ))}
      </div>

      {/* Weekly Grid View (when All selected) */}
      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 size={32} className="animate-spin text-blue-400" />
        </div>
      ) : activeDay === 'All' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {DAYS.map(day => (
            <div key={day} className="glass-card p-4 space-y-3">
              <h3 className="text-white font-semibold text-sm border-b border-white/5 pb-2 flex items-center justify-between">
                {day}
                <span className="text-xs text-slate-500">{byDay[day].length} sesi</span>
              </h3>
              {byDay[day].length === 0 ? (
                <p className="text-slate-600 text-xs text-center py-4">Belum ada jadwal</p>
              ) : (
                byDay[day]
                  .sort((a, b) => a.startTime?.localeCompare(b.startTime))
                  .map(entry => (
                    <div
                      key={entry.id}
                      className="flex items-start gap-2 p-2 rounded-lg group"
                      style={{ backgroundColor: entry.color + '15', borderLeft: `3px solid ${entry.color}` }}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-xs font-semibold truncate">{entry.subject}</p>
                        <p className="text-slate-400 text-xs flex items-center gap-1 mt-0.5">
                          <Clock size={10} /> {entry.startTime} – {entry.endTime}
                        </p>
                        {entry.note && <p className="text-slate-500 text-xs mt-0.5 truncate">{entry.note}</p>}
                      </div>
                      <button
                        onClick={() => deleteEntry(entry.id)}
                        className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 transition-all flex-shrink-0 mt-0.5"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))
              )}
            </div>
          ))}
        </div>
      ) : (
        /* Single Day View */
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-slate-600">
              <CalendarDays size={48} className="mx-auto mb-3 opacity-20" />
              <p className="font-medium">Tidak ada jadwal untuk hari {activeDay}</p>
              <p className="text-sm mt-1">Klik "Add Schedule" untuk menambahkan</p>
            </div>
          ) : (
            filtered
              .sort((a, b) => a.startTime?.localeCompare(b.startTime))
              .map(entry => (
                <div
                  key={entry.id}
                  className="glass-card p-4 flex items-center gap-4 group hover:border-white/10 transition-all"
                  style={{ borderLeft: `4px solid ${entry.color}` }}
                >
                  <div
                    className="w-2 h-10 rounded-full flex-shrink-0"
                    style={{ backgroundColor: entry.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold">{entry.subject}</p>
                    <p className="text-slate-400 text-sm flex items-center gap-1">
                      <Clock size={13} /> {entry.startTime} – {entry.endTime}
                    </p>
                    {entry.note && <p className="text-slate-500 text-xs mt-1">{entry.note}</p>}
                  </div>
                  <button onClick={() => deleteEntry(entry.id)} className="opacity-0 group-hover:opacity-100 btn-ghost p-2 text-red-400">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
          )}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="glass-card w-full max-w-md p-6 space-y-4 border border-white/10 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <BookOpen size={16} className="text-blue-400" /> Add Study Schedule
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-500 hover:text-slate-300">
                <X size={20} />
              </button>
            </div>

            <div>
              <label className="text-slate-500 text-xs mb-1 block">Hari</label>
              <select value={form.day} onChange={e => setForm(f => ({ ...f, day: e.target.value }))} className="input-field text-sm">
                {DAYS.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>

            <div>
              <label className="text-slate-500 text-xs mb-1 block">Mata Kuliah / Topik</label>
              <input
                autoFocus
                type="text"
                placeholder="e.g. Kalkulus, Pemrograman Web..."
                value={form.subject}
                onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                className="input-field text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-500 text-xs mb-1 block">Mulai</label>
                <input type="time" value={form.startTime} onChange={e => setForm(f => ({ ...f, startTime: e.target.value }))} className="input-field text-sm" />
              </div>
              <div>
                <label className="text-slate-500 text-xs mb-1 block">Selesai</label>
                <input type="time" value={form.endTime} onChange={e => setForm(f => ({ ...f, endTime: e.target.value }))} className="input-field text-sm" />
              </div>
            </div>

            <div>
              <label className="text-slate-500 text-xs mb-1 block">Catatan (opsional)</label>
              <input type="text" placeholder="e.g. Chapter 3, Tugas kelompok..." value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))} className="input-field text-sm" />
            </div>

            <div>
              <label className="text-slate-500 text-xs mb-1 block">Warna</label>
              <div className="flex gap-2">
                {COLORS.map(({ value }) => (
                  <button
                    key={value}
                    onClick={() => setForm(f => ({ ...f, color: value }))}
                    className={`w-7 h-7 rounded-full transition-all ${form.color === value ? 'ring-2 ring-white ring-offset-2 ring-offset-dark-700 scale-110' : ''}`}
                    style={{ backgroundColor: value }}
                  />
                ))}
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <button onClick={() => setShowModal(false)} className="btn-secondary text-sm">Batal</button>
              <button onClick={handleSave} disabled={saving || !form.subject.trim()} className="btn-primary text-sm flex items-center gap-2">
                {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
