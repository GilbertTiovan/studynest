import { useState } from 'react'
import { useNotes } from '../../hooks/useNotes'
import {
  Plus, Search, Trash2, Edit3, X, Save,
  NotebookPen, Tag, Loader2
} from 'lucide-react'

const NOTE_COLORS = [
  '#7c3aed', '#2563eb', '#059669', '#d97706', '#dc2626', '#db2777'
]

const CATEGORIES = ['All', 'Kuliah', 'Personal', 'Ide', 'Riset', 'Lainnya']

const EMPTY_FORM = { title: '', content: '', category: 'Kuliah', color: NOTE_COLORS[0] }

export default function Notes() {
  const { notes, loading, addNote, updateNote, deleteNote } = useNotes()
  const [search, setSearch]       = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [showModal, setShowModal] = useState(false)
  const [editNote, setEditNote]   = useState(null)
  const [form, setForm]           = useState(EMPTY_FORM)
  const [saving, setSaving]       = useState(false)

  const filtered = notes.filter(n => {
    const matchCat  = activeCategory === 'All' || n.category === activeCategory
    const matchSearch = n.title?.toLowerCase().includes(search.toLowerCase()) ||
                        n.content?.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  const openAdd = () => { setForm(EMPTY_FORM); setEditNote(null); setShowModal(true) }
  const openEdit = (note) => {
    setForm({ title: note.title, content: note.content, category: note.category, color: note.color })
    setEditNote(note)
    setShowModal(true)
  }
  const closeModal = () => { setShowModal(false); setEditNote(null); setForm(EMPTY_FORM) }

  const handleSave = async () => {
    if (!form.title.trim()) return
    setSaving(true)
    try {
      if (editNote) {
        await updateNote(editNote.id, form)
      } else {
        await addNote(form)
      }
      closeModal()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-5 max-w-6xl animate-slide-up">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <NotebookPen size={20} className="text-primary-400" /> My Notes
          </h2>
          <p className="text-slate-500 text-sm">{notes.length} catatan tersimpan</p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> New Note
        </button>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Cari catatan..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-field pl-9"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeCategory === cat
                  ? 'bg-primary-600 text-white'
                  : 'bg-dark-600 text-slate-400 hover:bg-dark-500'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Notes Grid */}
      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 size={32} className="animate-spin text-primary-400" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-600">
          <NotebookPen size={48} className="mx-auto mb-3 opacity-20" />
          <p className="font-medium">Belum ada catatan</p>
          <p className="text-sm mt-1">Klik "New Note" untuk mulai menulis</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(note => (
            <div
              key={note.id}
              className="glass-card p-4 flex flex-col gap-3 hover:border-white/10 transition-all duration-200 hover:-translate-y-0.5 group"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: note.color }} />
                  <h3 className="text-white font-semibold text-sm truncate">{note.title}</h3>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(note)} className="p-1 hover:text-primary-400 text-slate-500 transition-colors">
                    <Edit3 size={14} />
                  </button>
                  <button onClick={() => deleteNote(note.id)} className="p-1 hover:text-red-400 text-slate-500 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed flex-1 line-clamp-4">{note.content}</p>
              <div className="flex items-center justify-between">
                <span className="tag bg-dark-500 text-slate-400 flex items-center gap-1">
                  <Tag size={10} /> {note.category}
                </span>
                <span className="text-slate-600 text-xs">
                  {note.updatedAt?.toDate
                    ? note.updatedAt.toDate().toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
                    : '—'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="glass-card w-full max-w-md p-6 space-y-4 border border-white/10 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-semibold">{editNote ? 'Edit Note' : 'New Note'}</h3>
              <button onClick={closeModal} className="text-slate-500 hover:text-slate-300 transition-colors">
                <X size={20} />
              </button>
            </div>

            <input
              autoFocus
              type="text"
              placeholder="Judul catatan..."
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              className="input-field text-sm font-medium"
            />

            <textarea
              placeholder="Tulis catatanmu di sini..."
              value={form.content}
              onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
              rows={5}
              className="input-field text-sm resize-none"
            />

            <div className="flex gap-4 items-center">
              <div className="flex-1">
                <label className="text-slate-500 text-xs mb-1 block">Kategori</label>
                <select
                  value={form.category}
                  onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                  className="input-field text-sm"
                >
                  {CATEGORIES.filter(c => c !== 'All').map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-slate-500 text-xs mb-1 block">Warna</label>
                <div className="flex gap-1.5">
                  {NOTE_COLORS.map(color => (
                    <button
                      key={color}
                      onClick={() => setForm(f => ({ ...f, color }))}
                      className={`w-6 h-6 rounded-full transition-all ${form.color === color ? 'ring-2 ring-white ring-offset-1 ring-offset-dark-700 scale-110' : ''}`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <button onClick={closeModal} className="btn-secondary text-sm">Batal</button>
              <button onClick={handleSave} disabled={saving || !form.title.trim()} className="btn-primary text-sm flex items-center gap-2">
                {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                {editNote ? 'Update' : 'Simpan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
