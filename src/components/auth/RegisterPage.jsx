import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { BookOpen, Mail, Lock, User, UserPlus, Eye, EyeOff } from 'lucide-react'

export default function RegisterPage({ onSwitchToLogin }) {
  const { registerWithEmail, loginWithGoogle } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    if (password !== confirm) {
      setError('Password dan konfirmasi tidak cocok.')
      return
    }
    if (password.length < 6) {
      setError('Password minimal 6 karakter.')
      return
    }
    setLoading(true)
    try {
      await registerWithEmail(name.trim(), email, password)
    } catch (err) {
      setError(getFriendlyError(err.code))
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setError('')
    setLoading(true)
    try {
      await loginWithGoogle()
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setError(getFriendlyError(err.code))
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-dark-800 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent-400/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-700/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md animate-slide-up relative z-10">
        {/* Logo */}
        <div className="flex items-center gap-3 justify-center mb-8">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-600 to-primary-400 flex items-center justify-center shadow-lg shadow-primary-600/30">
            <BookOpen size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-white font-bold text-2xl leading-none">StudyNest</h1>
            <p className="text-slate-500 text-xs mt-0.5">Productivity Hub</p>
          </div>
        </div>

        {/* Card */}
        <div className="glass-card p-8">
          <h2 className="text-white font-bold text-xl mb-1">Buat akun baru 🚀</h2>
          <p className="text-slate-500 text-sm mb-6">Mulai perjalanan belajar produktifmu</p>

          {/* Error */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-red-400 text-sm mb-4 animate-fade-in">
              {error}
            </div>
          )}

          {/* Google Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-dark-600 hover:bg-dark-500 border border-white/10 hover:border-white/20 text-slate-200 font-medium py-2.5 px-4 rounded-lg transition-all duration-200 mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Daftar dengan Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-white/5" />
            <span className="text-slate-600 text-xs">atau dengan email</span>
            <div className="flex-1 h-px bg-white/5" />
          </div>

          {/* Form */}
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-slate-400 text-sm mb-1.5 font-medium">Nama Lengkap</label>
              <div className="relative">
                <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Nama kamu"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  className="input-field pl-9"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 text-sm mb-1.5 font-medium">Email</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  placeholder="nama@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="input-field pl-9"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 text-sm mb-1.5 font-medium">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="Min. 6 karakter"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="input-field pl-9 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-slate-400 text-sm mb-1.5 font-medium">Konfirmasi Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="Ulangi password"
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  required
                  className="input-field pl-9"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <UserPlus size={16} />
              {loading ? 'Memproses...' : 'Buat Akun'}
            </button>
          </form>

          {/* Switch to login */}
          <p className="text-center text-slate-500 text-sm mt-5">
            Sudah punya akun?{' '}
            <button
              onClick={onSwitchToLogin}
              className="text-primary-400 hover:text-primary-300 font-medium transition-colors"
            >
              Masuk sekarang
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

function getFriendlyError(code) {
  const map = {
    'auth/email-already-in-use': 'Email sudah digunakan akun lain.',
    'auth/invalid-email': 'Format email tidak valid.',
    'auth/weak-password': 'Password terlalu lemah.',
    'auth/network-request-failed': 'Gagal terhubung ke internet.',
  }
  return map[code] || 'Terjadi kesalahan. Coba lagi.'
}
