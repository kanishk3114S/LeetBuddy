import { useState } from 'react'

// Pure alphanumeric token generator
function generateRandomToken() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let token = ''
  for (let i = 0; i < 12; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return token
}

// ── Step 1: Prompt to begin ────────────────────────────────────────────────
function StartScreen({ onBegin }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-dashed border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900">
        <span className="text-2xl">⚡</span>
      </div>
      <div>
        <h3 className="text-[22px] font-extrabold tracking-[-0.8px] text-neutral-900 dark:text-neutral-100">
          Connect your LeetCode profile
        </h3>
        <p className="mt-2 max-w-[340px] text-[13px] leading-6 text-neutral-500 dark:text-neutral-400">
          Verify your profile and unlock your live LeetCode stats, streaks, and weakness analytics.
        </p>
      </div>
      <button
        type="button"
        onClick={onBegin}
        className="
          flex items-center gap-2 rounded-lg bg-neutral-900 px-6 py-3 text-[13px]
          font-extrabold text-white transition hover:-translate-y-0.5 hover:bg-neutral-800
          dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-white
          shadow-sm
        "
      >
        Verify LeetCode Profile <span className="text-base">↗</span>
      </button>
    </div>
  )
}

// ── Step 2: Enter username ─────────────────────────────────────────────────
function UsernameStep({ onGenerate, isGenerating }) {
  const [username, setUsername] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (username.trim()) onGenerate(username.trim())
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4">
      <div className="w-full max-w-[400px] rounded-xl border border-neutral-200 bg-white p-7 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <h3 className="text-[18px] font-extrabold tracking-[-0.6px] text-neutral-900 dark:text-neutral-100">
          Enter your LeetCode username
        </h3>
        <p className="mt-1.5 text-[12px] text-neutral-500 dark:text-neutral-400">
          We will generate a safe verification token for you to paste into your LeetCode bio.
        </p>
        <form onSubmit={handleSubmit} className="mt-5">
          <input
            className="
              w-full rounded-lg border border-neutral-200 bg-neutral-50/60 px-3.5 py-3
              text-[13px] text-neutral-900 placeholder:text-neutral-400 outline-none transition
              focus:border-neutral-900 focus:bg-white focus:ring-2 focus:ring-neutral-900/10
              dark:border-neutral-700 dark:bg-neutral-800/60 dark:text-neutral-100
              dark:placeholder:text-neutral-500 dark:focus:border-neutral-400 dark:focus:ring-neutral-400/20
            "
            type="text"
            placeholder="e.g. your_leetcode_handle"
            value={username}
            onChange={e => setUsername(e.target.value)}
            autoFocus
            required
            disabled={isGenerating}
          />
          <button
            type="submit"
            disabled={isGenerating}
            className="
              mt-4 w-full rounded-lg bg-neutral-900 py-3 text-[12px] font-extrabold
              text-white transition hover:-translate-y-0.5 disabled:opacity-50
              dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-white
            "
          >
            {isGenerating ? 'Generating...' : 'Generate Verification Code ↗'}
          </button>
        </form>
      </div>
    </div>
  )
}

// ── Step 3: Show token & verify ────────────────────────────────────────────
function TokenStep({ username, token, onVerify, error, onBack }) {
  const [copied, setCopied] = useState(false)

  const copy = () => {
    navigator.clipboard.writeText(token)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4">
      <div className="w-full max-w-[440px] rounded-xl border border-neutral-200 bg-white p-7 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="font-mono text-[12px] uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
              Token for @{username}
            </span>
          </div>
          <button
            type="button"
            onClick={onBack}
            className="text-[12px] text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition"
          >
            Change
          </button>
        </div>

        <h3 className="text-[17px] font-extrabold tracking-[-0.5px] text-neutral-900 dark:text-neutral-100">
          Paste this in your LeetCode "About Me"
        </h3>
        <p className="mt-1 text-[12px] text-neutral-500 dark:text-neutral-400">
          Go to your LeetCode profile → Edit Profile → About Me → paste the code below → Save.
        </p>

        {/* Token display */}
        <div className="mt-4 flex items-center justify-between rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-950">
          <code className="font-mono text-[14px] font-bold text-neutral-900 dark:text-neutral-100 select-all">
            {token}
          </code>
          <button
            type="button"
            onClick={copy}
            className="ml-3 shrink-0 rounded px-3 py-1.5 font-mono text-[12px] font-bold border border-neutral-200 bg-white text-neutral-800 shadow-xs transition hover:bg-neutral-50 hover:border-neutral-300 dark:border-transparent dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
          >
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        </div>

        {/* Steps */}
        <ol className="mt-4 space-y-2">
          {[
            'Open leetcode.com/profile and click "Edit Profile"',
            'Paste this token into the "About Me" bio field and click Save',
            'Return here and click "Verify Profile" below',
          ].map((step, i) => (
            <li key={i} className="flex items-start gap-2.5 text-[12px] text-neutral-500 dark:text-neutral-400">
              <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-neutral-100 font-mono text-[11px] text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100 font-bold">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>

        {error && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-[12px] text-red-600 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-400">
            {error}
          </div>
        )}

        <button
          type="button"
          onClick={onVerify}
          className="
            mt-6 w-full rounded-lg bg-neutral-900 py-3 text-[12px] font-extrabold
            text-white transition hover:-translate-y-0.5
            dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-white
          "
        >
          Verify Profile ↗
        </button>
      </div>
    </div>
  )
}

// ── Step 4: Loading ────────────────────────────────────────────────────────
function LoadingStep({ statusText }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-5 text-center">
      <div className="relative h-14 w-14">
        <div className="absolute inset-0 rounded-full border-4 border-neutral-200 dark:border-neutral-800" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-neutral-900 dark:border-t-neutral-100 animate-spin" />
      </div>
      <div>
        <h3 className="text-[18px] font-extrabold tracking-[-0.6px] text-neutral-900 dark:text-neutral-100">
          Verifying LeetCode Profile…
        </h3>
        <p className="mt-1.5 text-[13px] text-neutral-500 dark:text-neutral-400">
          {statusText || 'Checking bio handshake and fetching comprehensive profile stats...'}
        </p>
      </div>
      <div className="flex items-center gap-1.5">
        {['Checking bio', 'Ingesting stats', 'Mapping topics', 'Calculating score'].map((label) => (
          <span
            key={label}
            className="rounded-full bg-neutral-100 px-2.5 py-1 font-mono text-[11px] text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300"
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  )
}

// ── GraphQL Query String for Direct/Fallback Ingestion ─────────────────────
const DIRECT_STATS_QUERY = `
query getUserFullStats($username: String!) {
  allQuestionsCount {
    difficulty
    count
  }
  matchedUser(username: $username) {
    profile {
      ranking
      userAvatar
      realName
      aboutMe
    }
    problemsSolvedBeatsStats {
      difficulty
      percentage
    }
    submitStatsGlobal {
      acSubmissionNum { difficulty count submissions }
      totalSubmissionNum { difficulty count submissions }
    }
    userCalendar {
      activeYears
      streak
      totalActiveDays
      submissionCalendar
    }
    activeBadge {
      id
      name
      displayName
      icon
    }
    badges {
      id
      name
      shortName
      displayName
      icon
      hoverText
      creationDate
      category
    }
    tagProblemCounts {
      fundamental { tagName problemsSolved }
      intermediate { tagName problemsSolved }
      advanced { tagName problemsSolved }
    }
  }
}
`;

// formatGraphQLResponse is imported from ../utils/profileData.js


// ── Main Export ────────────────────────────────────────────────────────────
export default function VerifyFlow({ onVerified }) {
  const [step, setStep] = useState('start')
  const [username, setUsername] = useState('')
  const [token, setToken] = useState('')
  const [error, setError] = useState('')
  const [loadingText, setLoadingText] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = async (uname) => {
    setUsername(uname)
    setIsGenerating(true)
    setError('')

    try {
      const authToken = localStorage.getItem('accessToken') || localStorage.getItem('lb_token')
      const res = await fetch('/api/leetcode/generate-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {})
        },
        credentials: 'include',
        body: JSON.stringify({ leetcodeUsername: uname })
      })

      if (res.ok) {
        const data = await res.json()
        setToken(data.token || generateRandomToken())
      } else {
        const err = await res.json().catch(() => ({}))
        if (res.status === 401) {
          setError('Authentication required. Please log in first.')
          return
        }
        setError(err.error || 'Failed to generate token on backend.')
        setToken(generateRandomToken())
      }
    } catch {
      setToken(generateRandomToken())
    } finally {
      setIsGenerating(false)
      setStep('token')
    }
  }

  const handleVerify = async () => {
    setStep('loading')
    setError('')
    setLoadingText('Connecting to LeetCode & syncing database...')

    try {
      const authToken = localStorage.getItem('accessToken') || localStorage.getItem('lb_token')

      const res = await fetch('/api/leetcode/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {})
        },
        credentials: 'include',
        body: JSON.stringify({ username, token })
      })

      const data = await res.json().catch(() => ({}))

      if (res.ok && data?.profile) {
        if (data?.heroCard) {
          try {
            localStorage.setItem('lb_hero_card', JSON.stringify(data.heroCard))
            window.dispatchEvent(new CustomEvent('lb_hero_card_updated', { detail: data.heroCard }))
          } catch (e) {
            console.warn('LocalStorage save error', e)
          }
        }
        if (data?.contest) {
          try {
            localStorage.setItem('lb_contest', JSON.stringify(data.contest))
            window.dispatchEvent(new CustomEvent('lb_contest_updated', { detail: data.contest }))
          } catch (e) {
            console.warn('LocalStorage contest save error', e)
          }
        }
        localStorage.setItem('lb_username', data.username || username)
        onVerified({ username: data.username || username, profile: data.profile })
        return
      }

      setError(data.error || data.message || 'Verification failed. Please make sure your token is saved in your LeetCode bio.')
      setStep('token')
    } catch (err) {
      console.error('[VerifyFlow] Verification error:', err)
      setError('Network error contacting backend. Please verify your connection.')
      setStep('token')
    }
  }

  if (step === 'start') return <StartScreen onBegin={() => setStep('username')} />
  if (step === 'username') return <UsernameStep onGenerate={handleGenerate} isGenerating={isGenerating} />
  if (step === 'token') return <TokenStep username={username} token={token} onVerify={handleVerify} error={error} onBack={() => setStep('username')} />
  if (step === 'loading') return <LoadingStep statusText={loadingText} />
  return null
}
