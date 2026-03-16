import { useState, useEffect, useRef, useCallback } from 'react'
import { Timer, Play, Pause, RotateCcw, Coffee, Brain, Flame } from 'lucide-react'

const MODES = {
  FOCUS: { label: 'Focus', duration: 25 * 60, color: 'text-primary-400', bg: 'from-primary-600/30 to-primary-500/10', border: 'border-primary-500/30' },
  SHORT: { label: 'Short Break', duration: 5 * 60, color: 'text-green-400', bg: 'from-green-600/30 to-green-500/10', border: 'border-green-500/30' },
  LONG:  { label: 'Long Break',  duration: 15 * 60, color: 'text-blue-400', bg: 'from-blue-600/30 to-blue-500/10', border: 'border-blue-500/30' },
}

function pad(n) { return String(n).padStart(2, '0') }

export default function Pomodoro() {
  const [mode, setMode]           = useState('FOCUS')
  const [timeLeft, setTimeLeft]   = useState(MODES.FOCUS.duration)
  const [running, setRunning]     = useState(false)
  const [sessions, setSessions]   = useState(() => parseInt(localStorage.getItem('pomodoroSessions') || '0'))
  const [totalFocus, setTotalFocus] = useState(() => parseInt(localStorage.getItem('pomodoroTotal') || '0'))
  const intervalRef               = useRef(null)
  const audioCtxRef               = useRef(null)

  const current = MODES[mode]
  const percent = 1 - timeLeft / current.duration
  const circumference = 2 * Math.PI * 90

  const playBell = useCallback(() => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)()
      audioCtxRef.current = ctx
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.type = 'sine'
      osc.frequency.setValueAtTime(880, ctx.currentTime)
      gain.gain.setValueAtTime(0.4, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5)
      osc.start()
      osc.stop(ctx.currentTime + 1.5)
    } catch (_) {}
  }, [])

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current)
            setRunning(false)
            playBell()
            if (mode === 'FOCUS') {
              const newSessions = sessions + 1
              const newTotal    = totalFocus + MODES.FOCUS.duration
              setSessions(newSessions)
              setTotalFocus(newTotal)
              localStorage.setItem('pomodoroSessions', newSessions)
              localStorage.setItem('pomodoroTotal', newTotal)
            }
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(intervalRef.current)
  }, [running, mode, sessions, totalFocus, playBell])

  const switchMode = (m) => {
    clearInterval(intervalRef.current)
    setRunning(false)
    setMode(m)
    setTimeLeft(MODES[m].duration)
  }

  const reset = () => {
    clearInterval(intervalRef.current)
    setRunning(false)
    setTimeLeft(current.duration)
  }

  const totalFocusHours = Math.floor(totalFocus / 3600)
  const totalFocusMins  = Math.floor((totalFocus % 3600) / 60)

  return (
    <div className="flex flex-col items-center space-y-8 py-4 max-w-2xl mx-auto animate-slide-up">
      <div>
        <h2 className="text-xl font-bold text-white text-center flex items-center gap-2 justify-center">
          <Timer size={20} className="text-orange-400" /> Focus Timer
        </h2>
        <p className="text-slate-500 text-sm text-center">Teknik Pomodoro — fokus 25 menit, istirahat 5 menit</p>
      </div>

      {/* Mode Selector */}
      <div className="flex gap-2">
        {Object.entries(MODES).map(([key, m]) => (
          <button
            key={key}
            onClick={() => switchMode(key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              mode === key
                ? `bg-gradient-to-r ${m.bg} border ${m.border} ${m.color}`
                : 'bg-dark-600 text-slate-400 hover:bg-dark-500'
            }`}
          >
            {key === 'FOCUS' ? <Brain size={14} className="inline mr-1.5" /> : <Coffee size={14} className="inline mr-1.5" />}
            {m.label}
          </button>
        ))}
      </div>

      {/* Circular Timer */}
      <div className="relative flex items-center justify-center">
        <svg width="220" height="220" className="-rotate-90">
          <circle
            cx="110" cy="110" r="90"
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="10"
          />
          <circle
            cx="110" cy="110" r="90"
            fill="none"
            stroke="url(#timerGradient)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - percent)}
            className="transition-all duration-1000"
          />
          <defs>
            <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={mode === 'FOCUS' ? '#7c3aed' : mode === 'SHORT' ? '#16a34a' : '#2563eb'} />
              <stop offset="100%" stopColor={mode === 'FOCUS' ? '#a855f7' : mode === 'SHORT' ? '#4ade80' : '#60a5fa'} />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute text-center">
          <p className={`text-5xl font-bold font-mono ${current.color}`}>
            {pad(Math.floor(timeLeft / 60))}:{pad(timeLeft % 60)}
          </p>
          <p className="text-slate-500 text-sm mt-1">{current.label}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-4 items-center">
        <button
          onClick={reset}
          className="btn-secondary p-3 rounded-full"
          title="Reset"
        >
          <RotateCcw size={20} />
        </button>
        <button
          onClick={() => setRunning(r => !r)}
          className="btn-primary w-16 h-16 rounded-full flex items-center justify-center shadow-xl shadow-primary-600/30 text-xl"
        >
          {running ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
        </button>
        <div className="w-10 h-10" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
        <div className="glass-card p-4 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Flame size={16} className="text-orange-400" />
            <span className="text-orange-400 font-bold text-xl">{sessions}</span>
          </div>
          <p className="text-slate-500 text-xs">Sesi Selesai</p>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Timer size={16} className="text-primary-400" />
            <span className="text-primary-400 font-bold text-xl">
              {totalFocusHours > 0 ? `${totalFocusHours}j ${totalFocusMins}m` : `${totalFocusMins}m`}
            </span>
          </div>
          <p className="text-slate-500 text-xs">Total Fokus</p>
        </div>
      </div>

      {/* Tips */}
      <div className={`w-full max-w-sm glass-card p-4 bg-gradient-to-r ${current.bg} border ${current.border}`}>
        <p className="text-slate-300 text-sm text-center">
          {mode === 'FOCUS'
            ? '🧠 Singkirkan distraksi. Fokus penuh selama 25 menit!'
            : mode === 'SHORT'
            ? '☕ Istirahat sebentar, regangkan badan, minum air!'
            : '🌿 Istirahat panjang. Kamu sudah bekerja keras!'}
        </p>
      </div>
    </div>
  )
}
