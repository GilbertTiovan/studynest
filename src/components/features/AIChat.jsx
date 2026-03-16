import { useState, useRef, useEffect } from 'react'
import { Bot, X, Send, Loader2, Sparkles, Trash2, ChevronDown } from 'lucide-react'

const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent`

const SYSTEM_PROMPT = `You are StudyNest AI, a friendly and helpful study assistant integrated into StudyNest — a student productivity app. 
Help students with:
- Study tips and learning strategies
- Explaining academic concepts clearly
- Summarizing topics
- Creating study plans or schedules
- Motivating students
- Helping manage tasks and time

Keep responses concise, friendly, and encouraging. Use emojis occasionally to stay engaging. 
Always respond in the same language the user writes in (if they write in Indonesian, respond in Indonesian; if English, respond in English).`

function Message({ msg }) {
  const isUser = msg.role === 'user'
  return (
    <div className={`flex gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-600 to-accent-500 flex items-center justify-center flex-shrink-0 mt-1">
          <Sparkles size={13} className="text-white" />
        </div>
      )}
      <div
        className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
          isUser
            ? 'bg-gradient-to-br from-primary-600 to-primary-500 text-white rounded-tr-sm'
            : 'bg-dark-600 text-slate-200 rounded-tl-sm border border-white/5'
        }`}
      >
        <p className="whitespace-pre-wrap">{msg.content}</p>
      </div>
    </div>
  )
}

export default function AIChat() {
  const [open, setOpen]         = useState(false)
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Halo! 👋 Saya StudyNest AI, asisten belajarmu. Ada yang bisa saya bantu hari ini?' }
  ])
  const [input, setInput]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState(null)
  const bottomRef               = useRef(null)
  const inputRef                = useRef(null)
  const apiKey                  = import.meta.env.VITE_GEMINI_API_KEY

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100)
  }, [open])

  const sendMessage = async () => {
    const text = input.trim()
    if (!text || loading) return

    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      setError('⚠️ Gemini API key belum diisi di file .env (VITE_GEMINI_API_KEY)')
      return
    }

    setError(null)
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: text }])
    setLoading(true)

    try {
      // Build conversation history for context
      const history = messages.slice(-8).map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }))

      const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: [
            ...history,
            { role: 'user', parts: [{ text }] }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1024,
          }
        })
      })

      if (!response.ok) {
        const errData = await response.json()
        throw new Error(errData?.error?.message || 'Gagal menghubungi Gemini API')
      }

      const data = await response.json()
      const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Maaf, saya tidak bisa merespons saat ini.'
      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
    } catch (err) {
      setError(`❌ ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
  }

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(o => !o)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-primary-600 to-accent-500 shadow-xl shadow-primary-600/40 flex items-center justify-center text-white transition-all duration-300 hover:scale-110 active:scale-95 ${
          open ? 'rotate-0' : 'hover:rotate-12'
        }`}
        title="StudyNest AI Assistant"
      >
        {open ? <ChevronDown size={22} /> : <Bot size={22} />}
      </button>

      {/* Chat Panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[360px] h-[500px] flex flex-col glass-card border border-white/10 shadow-2xl shadow-black/50 rounded-2xl overflow-hidden animate-slide-up">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-gradient-to-r from-primary-600/20 to-accent-500/10 flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-400 flex items-center justify-center shadow-lg">
                <Sparkles size={15} className="text-white" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">StudyNest AI</p>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  <p className="text-green-400 text-xs">Online · Powered by Gemini</p>
                </div>
              </div>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => setMessages([{ role: 'assistant', content: 'Chat dibersihkan! Ada yang bisa saya bantu? 😊' }])}
                className="p-1.5 text-slate-500 hover:text-slate-300 transition-colors rounded-lg hover:bg-white/5"
                title="Clear chat"
              >
                <Trash2 size={15} />
              </button>
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 text-slate-500 hover:text-slate-300 transition-colors rounded-lg hover:bg-white/5"
              >
                <X size={15} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
            {messages.map((msg, i) => <Message key={i} msg={msg} />)}
            {loading && (
              <div className="flex gap-2.5">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-600 to-accent-500 flex items-center justify-center flex-shrink-0">
                  <Sparkles size={13} className="text-white animate-pulse" />
                </div>
                <div className="bg-dark-600 border border-white/5 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0ms]" />
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:150ms]" />
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            )}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-red-400 text-xs">
                {error}
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-white/5 flex-shrink-0">
            <div className="flex gap-2 items-end">
              <textarea
                ref={inputRef}
                rows={1}
                placeholder="Tanya apa saja..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                className="input-field text-sm resize-none flex-1 py-2.5 max-h-24 leading-relaxed"
                style={{ height: 'auto', minHeight: '40px' }}
                onInput={e => {
                  e.target.style.height = 'auto'
                  e.target.style.height = Math.min(e.target.scrollHeight, 96) + 'px'
                }}
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || loading}
                className="btn-primary p-2.5 rounded-xl flex-shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
              </button>
            </div>
            <p className="text-slate-600 text-xs mt-1.5 text-center">Enter untuk kirim · Shift+Enter untuk baris baru</p>
          </div>
        </div>
      )}
    </>
  )
}
