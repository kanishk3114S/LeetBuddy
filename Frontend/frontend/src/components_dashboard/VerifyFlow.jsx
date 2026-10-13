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
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-dashed border-[#d1d5d1] bg-[#f4f6f2] dark:border-[#3a453d] dark:bg-[#1a211d]">
        <span className="text-2xl">⚡</span>
      </div>
      <div>
        <h3 className="text-[22px] font-extrabold tracking-[-0.8px] text-[#171a1d] dark:text-[#edf2ed]">
          Connect your LeetCode profile
        </h3>
        <p className="mt-2 max-w-[340px] text-[13px] leading-6 text-[#71787f] dark:text-[#8d988e]">
          Verify your profile and unlock your live LeetCode stats, streaks, and weakness analytics.
        </p>
      </div>
      <button
        type="button"
        onClick={onBegin}
        className="
          flex items-center gap-2 rounded-[7px] bg-[#171a1d] px-6 py-3 text-[13px]
          font-extrabold text-white transition hover:-translate-y-0.5 hover:bg-black
          dark:bg-[#c5ef75] dark:text-[#172011] dark:hover:bg-[#d4f88e]
          dark:shadow-[0_4px_16px_rgba(197,239,117,0.18)]
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
      <div className="w-full max-w-[400px] rounded-[10px] border border-[#dce0dc] bg-white p-7 shadow-[0_12px_40px_rgba(24,31,29,0.08)] dark:border-[#38443b] dark:bg-[#1e2621] dark:shadow-[0_12px_40px_rgba(0,0,0,0.4)]">
        <h3 className="text-[18px] font-extrabold tracking-[-0.6px] text-[#171a1d] dark:text-[#edf2ed]">
          Enter your LeetCode username
        </h3>
        <p className="mt-1.5 text-[12px] text-[#71787f] dark:text-[#8d988e]">
          We will generate a safe verification token for you to paste into your LeetCode bio.
        </p>
        <form onSubmit={handleSubmit} className="mt-5">
          <input
            className="
              w-full rounded-[6px] border border-[#e3e5e1] bg-[#fbfcfa] px-3.5 py-3
              text-[13px] text-[#171a1d] placeholder:text-[#a3aaa6] outline-none transition
              focus:border-[#8db94d] focus:ring-2 focus:ring-[#dceec1]
              dark:border-[#3d493f] dark:bg-[#1a211d] dark:text-[#f8faf8]
              dark:placeholder:text-[#778178] dark:focus:border-[#a8de4e] dark:focus:ring-[#a8de4e]/20
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
              mt-4 w-full rounded-[6px] bg-[#171a1d] py-3 text-[12px] font-extrabold
              text-white transition hover:-translate-y-0.5 disabled:opacity-50
              dark:bg-[#c5ef75] dark:text-[#172011] dark:hover:bg-[#d4f88e]
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
      <div className="w-full max-w-[440px] rounded-[10px] border border-[#dce0dc] bg-white p-7 shadow-[0_12px_40px_rgba(24,31,29,0.08)] dark:border-[#38443b] dark:bg-[#1e2621] dark:shadow-[0_12px_40px_rgba(0,0,0,0.4)]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#a8de4e]" />
            <span className="font-mono text-[12px] uppercase tracking-widest text-[#71787f] dark:text-[#8d988e]">
              Token for @{username}
            </span>
          </div>
          <button
            type="button"
            onClick={onBack}
            className="text-[12px] text-[#71787f] hover:text-[#171a1d] dark:text-[#8d988e] dark:hover:text-white"
          >
            Change
          </button>
        </div>

        <h3 className="text-[17px] font-extrabold tracking-[-0.5px] text-[#171a1d] dark:text-[#edf2ed]">
          Paste this in your LeetCode "About Me"
        </h3>
        <p className="mt-1 text-[12px] text-[#71787f] dark:text-[#8d988e]">
          Go to your LeetCode profile → Edit Profile → About Me → paste the code below → Save.
        </p>

        {/* Token display */}
        <div className="mt-4 flex items-center justify-between rounded-[7px] border border-[#e3e5e1] bg-[#f4f6f2] px-4 py-3 dark:border-[#3d493f] dark:bg-[#1a211d]">
          <code className="font-mono text-[14px] font-bold text-[#171a1d] dark:text-[#c5ef75] select-all">
            {token}
          </code>
          <button
            type="button"
            onClick={copy}
            className="ml-3 shrink-0 rounded-[5px] bg-[#eef0ec] px-3 py-1.5 font-mono text-[12px] font-bold text-[#4f5955] transition hover:bg-[#e0e4de] dark:bg-[#2d3730] dark:text-[#9fb8a8] dark:hover:bg-[#38443b]"
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
            <li key={i} className="flex items-start gap-2.5 text-[12px] text-[#71787f] dark:text-[#8d988e]">
              <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#eef0ec] font-mono text-[11px] text-[#171a1d] dark:bg-[#2d3730] dark:text-[#edf2ed]">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>

        {error && (
          <div className="mt-4 rounded-[6px] border border-red-200 bg-red-50 p-3 text-[12px] text-red-600 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-400">
            {error}
          </div>
        )}

        <button
          type="button"
          onClick={onVerify}
          className="
            mt-6 w-full rounded-[6px] bg-[#171a1d] py-3 text-[12px] font-extrabold
            text-white transition hover:-translate-y-0.5
            dark:bg-[#c5ef75] dark:text-[#172011] dark:hover:bg-[#d4f88e]
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
        <div className="absolute inset-0 rounded-full border-4 border-[#e3e5e1] dark:border-[#2d3730]" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#a8de4e] animate-spin" />
      </div>
      <div>
        <h3 className="text-[18px] font-extrabold tracking-[-0.6px] text-[#171a1d] dark:text-[#edf2ed]">
          Verifying LeetCode Profile…
        </h3>
        <p className="mt-1.5 text-[13px] text-[#71787f] dark:text-[#8d988e]">
          {statusText || 'Checking bio handshake and fetching comprehensive profile stats...'}
        </p>
      </div>
      <div className="flex items-center gap-1.5">
        {['Checking bio', 'Ingesting stats', 'Mapping topics', 'Calculating score'].map((label, i) => (
          <span
            key={label}
            className="rounded-full bg-[#eef0ec] px-2.5 py-1 font-mono text-[11px] text-[#4f5955] dark:bg-[#1e2621] dark:text-[#9fb8a8]"
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

// Helper to normalize and structure raw GraphQL response into our profile shape
function formatGraphQLResponse(userData, allQuestionsList) {
  const acList = userData?.submitStatsGlobal?.acSubmissionNum || [];
  const totalSolved = acList.find(x => x.difficulty === "All")?.count || 0;
  const easySolved = acList.find(x => x.difficulty === "Easy")?.count || 0;
  const mediumSolved = acList.find(x => x.difficulty === "Medium")?.count || 0;
  const hardSolved = acList.find(x => x.difficulty === "Hard")?.count || 0;

  const totalSubList = userData?.submitStatsGlobal?.totalSubmissionNum || [];
  const acceptedSubmissions = acList.find(x => x.difficulty === "All")?.submissions || 0;
  const totalSubmissions = totalSubList.find(x => x.difficulty === "All")?.submissions || 0;
  const acceptanceRate = totalSubmissions > 0 ? Number(((acceptedSubmissions / totalSubmissions) * 100).toFixed(1)) : 0;

  const allQuestionsCount = {
    all: allQuestionsList.find(x => x.difficulty === "All")?.count || 4082,
    easy: allQuestionsList.find(x => x.difficulty === "Easy")?.count || 971,
    medium: allQuestionsList.find(x => x.difficulty === "Medium")?.count || 2128,
    hard: allQuestionsList.find(x => x.difficulty === "Hard")?.count || 983
  };

  const beatsList = userData?.problemsSolvedBeatsStats || [];
  const beatsStats = {
    easy: beatsList.find(x => x.difficulty === "Easy")?.percentage || 0,
    medium: beatsList.find(x => x.difficulty === "Medium")?.percentage || 0,
    hard: beatsList.find(x => x.difficulty === "Hard")?.percentage || 0
  };

  const leetBuddyPoints = (easySolved * 1) + (mediumSolved * 3) + (hardSolved * 5);

  const parsedCalendar = JSON.parse(userData?.userCalendar?.submissionCalendar || "{}");
  let bestPerformingDay = null;
  let maxSubmissionsOnDay = 0;

  for (const [timestamp, count] of Object.entries(parsedCalendar)) {
    if (count > maxSubmissionsOnDay) {
      maxSubmissionsOnDay = count;
      bestPerformingDay = {
        date: new Date(Number(timestamp) * 1000).toISOString(),
        submissionCount: count
      };
    }
  }

  const badges = (userData?.badges || []).map(b => ({
    id: b.id,
    name: b.displayName || b.shortName || b.name,
    icon: b.icon?.startsWith("http") ? b.icon : (b.icon ? `https://leetcode.com${b.icon}` : ""),
    category: b.category || "",
    creationDate: b.creationDate || null
  }));

  const activeBadge = userData?.activeBadge ? {
    id: userData.activeBadge.id,
    name: userData.activeBadge.displayName || userData.activeBadge.name,
    icon: userData.activeBadge.icon?.startsWith("http") ? userData.activeBadge.icon : (userData.activeBadge.icon ? `https://leetcode.com${userData.activeBadge.icon}` : "")
  } : (badges.length > 0 ? badges[0] : null);

  const topics = [];
  const addTags = (list, category) => {
    (list || []).forEach(t => {
      topics.push({ tagName: t.tagName, problemsSolved: t.problemsSolved, category });
    });
  };
  addTags(userData?.tagProblemCounts?.fundamental, 'fundamental');
  addTags(userData?.tagProblemCounts?.intermediate, 'intermediate');
  addTags(userData?.tagProblemCounts?.advanced, 'advanced');

  return {
    stats: {
      totalSolved,
      easySolved,
      mediumSolved,
      hardSolved,
      totalSubmissions,
      acceptedSubmissions,
      acceptanceRate,
      leetBuddyPoints
    },
    allQuestionsCount,
    beatsStats,
    profile: {
      ranking: userData?.profile?.ranking || 0,
      userAvatar: userData?.profile?.userAvatar || "",
      realName: userData?.profile?.realName || "",
      aboutMe: userData?.profile?.aboutMe || ""
    },
    activeBadge,
    topics,
    badges,
    activity: {
      currentStreak: userData?.userCalendar?.streak || 0,
      totalActiveDays: userData?.userCalendar?.totalActiveDays || 0,
      activeYears: userData?.userCalendar?.activeYears || [new Date().getFullYear()],
      bestPerformingDay
    },
    submissionCalendar: parsedCalendar
  };
}

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

    const generated = generateRandomToken()
    setToken(generated)

    // Attempt to register pending token on backend if available
    try {
      const authToken = localStorage.getItem('accessToken') || localStorage.getItem('lb_token')
      await fetch('/api/leetcode/generate-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {})
        },
        body: JSON.stringify({ leetcodeUsername: uname })
      })
    } catch {
      // Offline fallback: locally generated token is ready
    } finally {
      setIsGenerating(false)
      setStep('token')
    }
  }

  const handleVerify = async () => {
    setStep('loading')
    setError('')
    setLoadingText('Connecting to LeetCode...')

    try {
      // 1. Try backend verification endpoint
      const authToken = localStorage.getItem('accessToken') || localStorage.getItem('lb_token')
      let backendSuccess = false

      try {
        const res = await fetch('/api/leetcode/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {})
          }
        })

        if (res.ok) {
          const data = await res.json()
          if (data?.profile) {
            backendSuccess = true
            onVerified({ username: data.username || username, profile: data.profile })
            return
          }
        } else if (res.status === 400) {
          const errData = await res.json()
          setError(errData.error || 'Token not found in LeetCode bio. Please make sure you saved it and try again.')
          setStep('token')
          return
        }
      } catch {
        // Fall back to direct proxy verification
      }

      // 2. Direct GraphQL query via Vite Proxy if backend is in local frontend-only mode
      if (!backendSuccess) {
        setLoadingText('Checking About Me bio on LeetCode...')

        const proxyRes = await fetch('/leetcode-proxy', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: DIRECT_STATS_QUERY,
            variables: { username }
          })
        })

        if (!proxyRes.ok) {
          const errText = await proxyRes.text()
          throw new Error(`LeetCode connection error (${proxyRes.status}): ${errText.slice(0, 100) || 'Check server connection'}`)
        }

        const gqlData = await proxyRes.json()
        const user = gqlData?.data?.matchedUser

        if (!user) {
          setError(`LeetCode user "@${username}" was not found. Please check spelling.`)
          setStep('token')
          return
        }

        const bio = user?.profile?.aboutMe || ''

        // Bio Match check (case-sensitive token match, ignoring extraneous whitespace)
        const cleanBio = bio.replace(/\s+/g, ' ')
        const cleanToken = token.trim()

        if (!cleanBio.includes(cleanToken)) {
          setError(`Token "${token}" was not found in your LeetCode "About Me" bio. Please paste it, click Save on LeetCode, and try again.`)
          setStep('token')
          return
        }

        // Bio matches! Format real data
        const formattedProfile = formatGraphQLResponse(user, gqlData?.data?.allQuestionsCount || [])
        onVerified({ username, profile: formattedProfile })
      }

    } catch (err) {
      console.error('Verification error:', err)
      setError(err?.message || 'Connection error while communicating with LeetCode. Please try again.')
      setStep('token')
    }
  }

  if (step === 'start') return <StartScreen onBegin={() => setStep('username')} />
  if (step === 'username') return <UsernameStep onGenerate={handleGenerate} isGenerating={isGenerating} />
  if (step === 'token') return <TokenStep username={username} token={token} onVerify={handleVerify} error={error} onBack={() => setStep('username')} />
  if (step === 'loading') return <LoadingStep statusText={loadingText} />
  return null
}
