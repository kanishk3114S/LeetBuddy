import { useState, useEffect, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles,
  Send,
  RotateCw,
  Code2,
  Copy,
  Check,
  Plus,
  Terminal,
  ShieldCheck,
  X,
  FileCode,
  Zap
} from 'lucide-react'
import Sidebar from '../components_dashboard/Sidebar.jsx'
import DashHeader from '../components_dashboard/DashHeader.jsx'

// Tactical one-click quick prompts
const QUICK_PROMPTS = [
  {
    icon: '🎯',
    label: 'Rating Autopsy',
    prompt: 'Why did I lose rating in my recent contests, and which problems caused the drop?'
  },
  {
    icon: '⏱️',
    label: 'Panic Tax & Choke Slot',
    prompt: 'Analyze my contest finish times, penalty submissions (Panic Tax), and identify my choke slot.'
  },
  {
    icon: '🧠',
    label: 'Algorithmic Deficits',
    prompt: 'What are my weakest algorithmic topics based on my solved counts and contest failure patterns?'
  },
  {
    icon: '🌅',
    label: 'Circadian Split',
    prompt: 'Do I perform worse in Sunday morning Weekly Contests compared to Saturday night Biweeklies?'
  },
  {
    icon: '🛡️',
    label: 'Next Milestone Ladder',
    prompt: 'Prescribe a 3-week practice ladder to break into 2000+ rating and push toward Guardian.'
  }
]

// Markdown and Code Block Formatter
function FormattedMessageContent({ text }) {
  const parts = useMemo(() => {
    if (!text) return []
    // Split by code blocks ```lang ... ```
    const codeBlockRegex = /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g
    const segments = []
    let lastIndex = 0
    let match

    while ((match = codeBlockRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        segments.push({
          type: 'text',
          content: text.slice(lastIndex, match.index)
        })
      }
      segments.push({
        type: 'code',
        language: match[1] || 'plaintext',
        code: match[2].trimEnd()
      })
      lastIndex = match.index + match[0].length
    }

    if (lastIndex < text.length) {
      segments.push({
        type: 'text',
        content: text.slice(lastIndex)
      })
    }
    return segments
  }, [text])

  return (
    <div className="space-y-3 leading-relaxed text-[13.5px]">
      {parts.map((part, idx) => {
        if (part.type === 'code') {
          return <CodeSnippetBlock key={idx} language={part.language} code={part.code} />
        }
        return <ProseBlock key={idx} content={part.content} />
      })}
    </div>
  )
}

function CodeSnippetBlock({ language, code }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="my-3 overflow-hidden rounded-lg border border-neutral-800 bg-[#0c100e] text-neutral-200 shadow-md">
      <div className="flex items-center justify-between border-b border-neutral-800/80 bg-neutral-900/90 px-3.5 py-1.5 text-[11px] font-mono text-neutral-400">
        <span className="flex items-center gap-1.5 uppercase tracking-wider text-emerald-400 font-semibold">
          <Terminal className="h-3 w-3" />
          {language || 'code'}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1 rounded px-2 py-0.5 text-neutral-400 hover:bg-neutral-800 hover:text-white transition"
        >
          {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>
      <pre className="overflow-x-auto p-3.5 text-[12.5px] font-mono leading-relaxed text-emerald-100/90 scrollbar-thin">
        <code>{code}</code>
      </pre>
    </div>
  )
}

function ProseBlock({ content }) {
  // Simple markdown processor for headers, lists, and bold text
  const lines = content.split('\n')

  return (
    <div className="space-y-1.5">
      {lines.map((line, lIdx) => {
        const trimmed = line.trim()
        if (!trimmed) return <div key={lIdx} className="h-1.5" />

        // Headers
        if (trimmed.startsWith('### ')) {
          return (
            <h4 key={lIdx} className="mt-3 mb-1 font-heading text-[15px] font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              {renderInlineStyles(trimmed.slice(4))}
            </h4>
          )
        }
        if (trimmed.startsWith('## ')) {
          return (
            <h3 key={lIdx} className="mt-4 mb-1.5 font-heading text-[16px] font-extrabold text-neutral-900 dark:text-white">
              {renderInlineStyles(trimmed.slice(3))}
            </h3>
          )
        }
        if (trimmed.startsWith('# ')) {
          return (
            <h2 key={lIdx} className="mt-4 mb-2 font-heading text-[18px] font-black text-neutral-900 dark:text-white">
              {renderInlineStyles(trimmed.slice(2))}
            </h2>
          )
        }

        // Horizontal rule
        if (trimmed === '---') {
          return <hr key={lIdx} className="my-3 border-neutral-200 dark:border-neutral-800" />
        }

        // Bullet point
        if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
          return (
            <div key={lIdx} className="flex items-start gap-2 pl-2 text-neutral-800 dark:text-neutral-200">
              <span className="text-emerald-500 mt-1 text-[10px]">•</span>
              <span>{renderInlineStyles(trimmed.slice(2))}</span>
            </div>
          )
        }

        // Numbered list
        const numMatch = trimmed.match(/^(\d+)\.\s+(.*)$/)
        if (numMatch) {
          return (
            <div key={lIdx} className="flex items-start gap-2 pl-2 text-neutral-800 dark:text-neutral-200">
              <span className="font-mono text-xs font-bold text-emerald-500 shrink-0 mt-0.5">{numMatch[1]}.</span>
              <span>{renderInlineStyles(numMatch[2])}</span>
            </div>
          )
        }

        // Default paragraph
        return (
          <p key={lIdx} className="text-neutral-700 dark:text-neutral-300">
            {renderInlineStyles(line)}
          </p>
        )
      })}
    </div>
  )
}

function renderInlineStyles(text) {
  // Simple regex for **bold** and `code`
  const tokens = []
  let remaining = text

  // Match **bold** or `code`
  const regex = /(\*\*([^*]+)\*\*|`([^`]+)`)/
  let keyIdx = 0

  while (remaining.length > 0) {
    const match = remaining.match(regex)
    if (!match) {
      tokens.push(remaining)
      break
    }

    const matchStart = match.index
    if (matchStart > 0) {
      tokens.push(remaining.slice(0, matchStart))
    }

    if (match[2]) {
      // Bold
      tokens.push(
        <strong key={keyIdx++} className="font-bold text-neutral-900 dark:text-white">
          {match[2]}
        </strong>
      )
    } else if (match[3]) {
      // Inline code
      tokens.push(
        <code
          key={keyIdx++}
          className="rounded bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 font-mono text-[12px] text-emerald-600 dark:text-emerald-400 font-medium"
        >
          {match[3]}
        </code>
      )
    }

    remaining = remaining.slice(matchStart + match[0].length)
  }

  return tokens
}

export default function WeaknessAI() {
  const [activeNav, setActiveNav] = useState('weakness')

  // LeetCode handle (strictly separate from LeetBuddy app username)
  const [username, setUsername] = useState(() => {
    try {
      const savedStats = JSON.parse(localStorage.getItem('lb_stats') || '{}')
      if (savedStats?.username && savedStats.username !== 'user') return savedStats.username
      if (savedStats?.profile?.username && savedStats.profile.username !== 'user') return savedStats.profile.username
    } catch {}
    const stored = localStorage.getItem('lb_username')
    return (stored && stored !== 'user') ? stored : ''
  })

  // Messages state
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      text: `### Welcome to Weakness AI Tactical Advisor
I am your personal competitive programming coach, directly grounded in your verified **LeetCode profile stats**, **contest telemetry**, and **personal code submissions**.

Unlike generic cheat sheets, every diagnostic is calculated from your real numbers:
- **Panic Tax Analysis**: How many rating points were leaked to $+5\\text{m}$ wrong answer penalties.
- **Choke Slot Diagnostic**: Where momentum stalled (Q3 vs Q4 wall).
- **Circadian Telemetry**: Sunday morning 8 AM Weeklies vs Saturday night 8 PM Biweeklies.
- **Algorithmic Deficits**: 41 CP topic mastery scores and DP/Graph bottlenecks.

Ask me anything below or choose a tactical prompt from the ribbon.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ])

  // Input states
  const [inputMessage, setInputMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isAttachingCode, setIsAttachingCode] = useState(false)
  const [codeSnippet, setCodeSnippet] = useState('')

  // Memory status
  const [memoryStatus, setMemoryStatus] = useState({
    isIndexed: false,
    vectorCount: 0,
    namespace: '',
    dimension: 768,
    metric: 'cosine',
    codeSnippetsIndexed: 0
  })
  const [isSyncingMemory, setIsSyncingMemory] = useState(false)
  const [syncFeedback, setSyncFeedback] = useState(null)

  // Add Code Modal state
  const [showCodeModal, setShowCodeModal] = useState(false)
  const [modalForm, setModalForm] = useState({
    problemTitle: '',
    difficulty: 'Medium',
    status: 'Wrong Answer',
    language: 'cpp',
    code: '',
    notes: '',
    contestTitle: ''
  })
  const [isSavingCode, setIsSavingCode] = useState(false)

  const chatEndRef = useRef(null)

  // Scroll to bottom on new message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isSubmitting])

  // Fetch memory status on mount
  const fetchMemoryStatus = async () => {
    try {
      const authToken = localStorage.getItem('accessToken') || localStorage.getItem('lb_token')
      const res = await fetch(`/api/v1/weakness/status?username=${encodeURIComponent(username || '')}`, {
        headers: {
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {})
        }
      })
      if (res.ok) {
        const data = await res.json()
        if (data.status) {
          setMemoryStatus(data.status)
        }
      }
    } catch (e) {
      console.warn('Could not fetch memory status:', e)
    }
  }

  useEffect(() => {
    fetchMemoryStatus()
  }, [username])

  // Trigger Profile & Telemetry Sync
  const handleReindexMemory = async () => {
    if (isSyncingMemory) return
    setIsSyncingMemory(true)
    setSyncFeedback(null)
    try {
      const authToken = localStorage.getItem('accessToken') || localStorage.getItem('lb_token')
      const res = await fetch('/api/v1/weakness/index', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {})
        },
        body: JSON.stringify({ username })
      })
      const data = await res.json()
      if (data.success) {
        setSyncFeedback({ type: 'success', text: 'Contest and profile telemetry synced successfully!' })
        fetchMemoryStatus()
      } else {
        setSyncFeedback({ type: 'error', text: data.message || 'Synchronization failed' })
      }
    } catch (e) {
      setSyncFeedback({ type: 'error', text: e.message || 'Synchronization error' })
    } finally {
      setIsSyncingMemory(false)
      setTimeout(() => setSyncFeedback(null), 5000)
    }
  }

  // Send message
  const handleSendMessage = async (customText = null) => {
    const textToSend = customText || inputMessage
    if (!textToSend.trim() || isSubmitting) return

    const userMsgId = `user_${Date.now()}`
    const userMsg = {
      id: userMsgId,
      role: 'user',
      text: textToSend.trim(),
      codeSnippet: codeSnippet.trim() || null,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    setMessages(prev => [...prev, userMsg])
    setInputMessage('')
    setCodeSnippet('')
    setIsAttachingCode(false)
    setIsSubmitting(true)

    // Build history for backend
    const apiHistory = messages.map(m => ({
      role: m.role,
      text: m.text
    }))

    try {
      const authToken = localStorage.getItem('accessToken') || localStorage.getItem('lb_token')
      const res = await fetch('/api/v1/weakness/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {})
        },
        body: JSON.stringify({
          message: userMsg.text,
          history: apiHistory,
          username,
          codeSnippet: userMsg.codeSnippet
        })
      })

      const data = await res.json()
      if (data.success) {
        const assistantMsg = {
          id: `asst_${Date.now()}`,
          role: 'assistant',
          text: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
        setMessages(prev => [...prev, assistantMsg])
      } else {
        setMessages(prev => [
          ...prev,
          {
            id: `err_${Date.now()}`,
            role: 'assistant',
            text: `⚠️ **Diagnostic Error**: ${data.message || 'Could not generate tactical diagnostic. Please try again.'}`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ])
      }
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          role: 'assistant',
          text: `⚠️ **Network / Server Error**: ${err.message || 'Request failed.'}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ])
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle Save Code Modal
  const handleSaveCodeToMemory = async (e) => {
    e.preventDefault()
    if (!modalForm.problemTitle.trim() || !modalForm.code.trim()) return

    setIsSavingCode(true)
    try {
      const authToken = localStorage.getItem('accessToken') || localStorage.getItem('lb_token')
      const res = await fetch('/api/v1/weakness/code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {})
        },
        body: JSON.stringify({
          ...modalForm,
          username
        })
      })
      const data = await res.json()
      if (data.success) {
        setShowCodeModal(false)
        setModalForm({
          problemTitle: '',
          difficulty: 'Medium',
          status: 'Wrong Answer',
          language: 'cpp',
          code: '',
          notes: '',
          contestTitle: ''
        })
        setSyncFeedback({ type: 'success', text: 'Solution and notes saved to your knowledge base!' })
        fetchMemoryStatus()
      } else {
        alert(data.message || 'Failed to save code')
      }
    } catch (err) {
      alert(err.message || 'Error saving code')
    } finally {
      setIsSavingCode(false)
      setTimeout(() => setSyncFeedback(null), 5000)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="flex h-screen bg-neutral-50 dark:bg-[#131815] text-neutral-900 dark:text-neutral-100 overflow-hidden font-sans">
      {/* Sidebar */}
      <Sidebar active={activeNav} setActive={setActiveNav} />

      {/* Main Container */}
      <div className="flex flex-1 flex-col h-full overflow-hidden">
        {/* DashHeader */}
        <DashHeader
          title="Weakness AI"
          subtitle="Tactical DSA & Contest Autopsy Copilot"
        />

        {/* Content Shell */}
        <div className="flex flex-1 flex-col overflow-hidden max-w-6xl w-full mx-auto px-4 sm:px-6 py-3">
          {/* ── Top Status Banner ─────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-3 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 p-3 backdrop-blur-md shadow-xs"
          >
            {/* Status Pills */}
            <div className="flex flex-wrap items-center gap-2.5 text-xs">
              <span className="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 font-mono text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                AI MENTOR ONLINE
              </span>

              <span className="hidden sm:inline-flex items-center gap-1.5 rounded-md bg-neutral-100 dark:bg-neutral-800 px-2.5 py-1 font-mono text-[11px] text-neutral-600 dark:text-neutral-300">
                <ShieldCheck className="h-3 w-3 text-emerald-500" />
                <span>Verified Contest Telemetry Active</span>
              </span>

              {syncFeedback && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`px-2.5 py-1 rounded text-xs font-semibold ${
                    syncFeedback.type === 'success'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                      : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                  }`}
                >
                  {syncFeedback.text}
                </motion.span>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => setShowCodeModal(true)}
                className="flex items-center gap-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-1.5 text-xs font-semibold text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-700/60 transition shadow-2xs"
              >
                <Plus className="h-3.5 w-3.5 text-emerald-500" />
                <span>Save Solution / Note</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                disabled={isSyncingMemory}
                onClick={handleReindexMemory}
                title="Sync latest contest history and profile data"
                className="flex items-center gap-1.5 rounded-lg bg-neutral-900 dark:bg-neutral-100 px-3 py-1.5 text-xs font-semibold text-white dark:text-neutral-900 hover:opacity-90 transition disabled:opacity-50 shadow-2xs"
              >
                <RotateCw className={`h-3 w-3 ${isSyncingMemory ? 'animate-spin text-emerald-400' : ''}`} />
                <span>{isSyncingMemory ? 'Syncing...' : 'Sync Telemetry'}</span>
              </motion.button>
            </div>
          </motion.div>

          {/* ── Quick Tactical Prompts Ribbon ─────────────────────────────── */}
          <div className="mb-3 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="flex items-center gap-1 text-[11px] font-mono uppercase tracking-wider text-neutral-400 shrink-0">
              <Zap className="h-3 w-3 text-amber-500" />
              Tactical Probes:
            </span>
            {QUICK_PROMPTS.map((qp, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.97 }}
                type="button"
                disabled={isSubmitting}
                onClick={() => handleSendMessage(qp.prompt)}
                className="flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/90 px-3 py-1 text-xs text-neutral-700 dark:text-neutral-300 hover:border-emerald-500/50 hover:text-emerald-600 dark:hover:text-emerald-400 transition shrink-0 shadow-2xs"
              >
                <span>{qp.icon}</span>
                <span className="font-medium">{qp.label}</span>
              </motion.button>
            ))}
          </div>

          {/* ── Messages Chat Stream ──────────────────────────────────────── */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin">
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 12, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-4 transition-all ${
                      msg.role === 'user'
                        ? 'border border-emerald-500/40 bg-neutral-900 text-white dark:bg-emerald-950/40 dark:border-emerald-500/50 shadow-md'
                        : 'border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 shadow-sm'
                    }`}
                  >
                    {/* Header bar of message */}
                    <div className="mb-2 flex items-center justify-between border-b border-neutral-200/40 dark:border-neutral-800/60 pb-2 text-[11px] font-mono text-neutral-400">
                      <div className="flex items-center gap-2">
                        {msg.role === 'user' ? (
                          <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                            <span>You</span>
                            <span>({username || 'Competitor'})</span>
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5 font-bold text-neutral-900 dark:text-emerald-400">
                            <Sparkles className="h-3.5 w-3.5 text-emerald-500" />
                            <span>LeetBuddy AI Mentor</span>
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] opacity-75">{msg.timestamp}</span>
                    </div>

                    {/* Attached code preview in user message */}
                    {msg.codeSnippet && (
                      <div className="mb-3 rounded-md border border-emerald-500/30 bg-black/40 p-2.5 font-mono text-xs">
                        <div className="flex items-center justify-between text-[10px] text-emerald-400 pb-1 mb-1 border-b border-emerald-500/20">
                          <span className="flex items-center gap-1">
                            <FileCode className="h-3 w-3" /> Attached Problem Code
                          </span>
                        </div>
                        <pre className="overflow-x-auto max-h-36 text-neutral-300 scrollbar-thin">
                          <code>{msg.codeSnippet}</code>
                        </pre>
                      </div>
                    )}

                    {/* Main content body */}
                    <FormattedMessageContent text={msg.text} />
                  </div>
                </motion.div>
              ))}

              {isSubmitting && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 shadow-sm flex items-center gap-3">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
                    </span>
                    <span className="text-xs font-mono text-neutral-500 animate-pulse">
                      Analyzing your contest stats & problem patterns...
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={chatEndRef} />
          </div>

          {/* ── Input Terminal Box ────────────────────────────────────────── */}
          <div className="mt-3 pt-2 border-t border-neutral-200 dark:border-neutral-800">
            {/* Optional Embedded Code Snippet Drawer */}
            <AnimatePresence>
              {isAttachingCode && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-2 overflow-hidden rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-900 p-3 text-neutral-200 shadow-md"
                >
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-neutral-800 text-xs font-mono">
                    <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                      <Code2 className="h-3.5 w-3.5" />
                      Attach Solution / Failed Code for Diagnosis
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsAttachingCode(false)}
                      className="text-neutral-400 hover:text-white"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <textarea
                    rows={4}
                    value={codeSnippet}
                    onChange={(e) => setCodeSnippet(e.target.value)}
                    placeholder="// Paste your C++, Python, or Java solution / contest code here..."
                    className="w-full rounded bg-black/60 p-2.5 font-mono text-xs text-emerald-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input Bar */}
            <div className="relative flex items-end gap-2 rounded-2xl border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-2.5 shadow-sm focus-within:border-emerald-500 transition-all">
              <button
                type="button"
                onClick={() => setIsAttachingCode(!isAttachingCode)}
                title="Attach Code to Query"
                className={`p-2 rounded-xl transition ${
                  isAttachingCode || codeSnippet.length > 0
                    ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/30'
                    : 'text-neutral-400 hover:text-neutral-700 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
              >
                <Code2 className="h-4 w-4" />
              </button>

              <textarea
                rows={1}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask your tactical DSA advisor (e.g. Why did my rating drop in Weekly 520?)..."
                className="flex-1 max-h-32 min-h-[38px] resize-none bg-transparent py-2 text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none scrollbar-thin"
              />

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                disabled={!inputMessage.trim() || isSubmitting}
                onClick={() => handleSendMessage()}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 hover:opacity-90 disabled:opacity-40 transition shadow-xs"
              >
                <Send className="h-4 w-4" />
              </motion.button>
            </div>

            <div className="mt-1.5 flex items-center justify-between text-[10px] font-mono text-neutral-400 px-1">
              <span>Press <kbd className="rounded bg-neutral-200 dark:bg-neutral-800 px-1 py-0.5">Enter</kbd> to send, <kbd className="rounded bg-neutral-200 dark:bg-neutral-800 px-1 py-0.5">Shift+Enter</kbd> for newline</span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="h-3 w-3 text-emerald-500" />
                End-to-End Secure Telemetry
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Slide-over / Modal: Save Solution / Mistake Note ─────────────── */}
      <AnimatePresence>
        {showCodeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-xl rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
                    <FileCode className="h-4 w-4" />
                  </span>
                  <div>
                    <h3 className="font-heading text-base font-bold text-neutral-900 dark:text-white">
                      Save Solution / Mistake Note
                    </h3>
                    <p className="text-xs text-neutral-500">
                      Save problem solutions and error patterns to enhance your coaching diagnostics
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCodeModal(false)}
                  className="rounded-lg p-1 text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleSaveCodeToMemory} className="space-y-3.5">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono text-neutral-500 mb-1 uppercase">
                      Problem Title *
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Subarray Sum Equals K"
                      value={modalForm.problemTitle}
                      onChange={(e) => setModalForm({ ...modalForm, problemTitle: e.target.value })}
                      className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 px-3 py-1.5 text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-neutral-500 mb-1 uppercase">
                      Contest / Context
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Weekly Contest 410"
                      value={modalForm.contestTitle}
                      onChange={(e) => setModalForm({ ...modalForm, contestTitle: e.target.value })}
                      className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 px-3 py-1.5 text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono text-neutral-500 mb-1 uppercase">
                      Difficulty
                    </label>
                    <select
                      value={modalForm.difficulty}
                      onChange={(e) => setModalForm({ ...modalForm, difficulty: e.target.value })}
                      className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 px-3 py-1.5 text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    >
                      <option>Easy</option>
                      <option>Medium</option>
                      <option>Hard</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-neutral-500 mb-1 uppercase">
                      Verdict / Status
                    </label>
                    <select
                      value={modalForm.status}
                      onChange={(e) => setModalForm({ ...modalForm, status: e.target.value })}
                      className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 px-3 py-1.5 text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    >
                      <option>Accepted</option>
                      <option>Time Limit Exceeded</option>
                      <option>Wrong Answer</option>
                      <option>Runtime Error</option>
                      <option>Memory Limit Exceeded</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-neutral-500 mb-1 uppercase">
                      Language
                    </label>
                    <select
                      value={modalForm.language}
                      onChange={(e) => setModalForm({ ...modalForm, language: e.target.value })}
                      className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 px-3 py-1.5 text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    >
                      <option value="cpp">C++</option>
                      <option value="python">Python</option>
                      <option value="java">Java</option>
                      <option value="typescript">TypeScript</option>
                      <option value="go">Go</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-neutral-500 mb-1 uppercase">
                    Code Implementation *
                  </label>
                  <textarea
                    required
                    rows={6}
                    placeholder="// Paste your complete solution or contest code..."
                    value={modalForm.code}
                    onChange={(e) => setModalForm({ ...modalForm, code: e.target.value })}
                    className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-900 p-2.5 font-mono text-xs text-emerald-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-neutral-500 mb-1 uppercase">
                    Notes / Mistake Autopsy (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Forgot memoization on state transition; O(2^N) blew up into TLE"
                    value={modalForm.notes}
                    onChange={(e) => setModalForm({ ...modalForm, notes: e.target.value })}
                    className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 px-3 py-1.5 text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-neutral-200 dark:border-neutral-800">
                  <button
                    type="button"
                    onClick={() => setShowCodeModal(false)}
                    className="rounded-lg px-4 py-2 text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isSavingCode}
                    className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-500 transition disabled:opacity-50"
                  >
                    {isSavingCode ? (
                      <>
                        <RotateCw className="h-3 w-3 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="h-3.5 w-3.5" />
                        <span>Save Solution</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
