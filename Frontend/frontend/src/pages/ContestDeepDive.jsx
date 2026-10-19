import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import { RotateCw, ArrowLeft, Trophy, AlertCircle } from 'lucide-react'
import Sidebar from '../components_dashboard/Sidebar.jsx'
import DashHeader from '../components_dashboard/DashHeader.jsx'
import BackToTop from '../components_dashboard/BackToTop.jsx'
import ScrollProgress from '../components_dashboard/ScrollProgress.jsx'
import DeepDiveStepperHeader, { DEEP_DIVE_SECTIONS } from '../components_contest/DeepDiveStepperHeader.jsx'
import PanicTaxSection from '../components_contest/PanicTaxSection.jsx'
import SplitTimeAutopsySection from '../components_contest/SplitTimeAutopsySection.jsx'
import RootCauseMistakeSection from '../components_contest/RootCauseMistakeSection.jsx'
import BleedingRemediationSection from '../components_contest/BleedingRemediationSection.jsx'
import CircadianSplitSection from '../components_contest/CircadianSplitSection.jsx'
import CareerContestLedgerSection from '../components_contest/CareerContestLedgerSection.jsx'
import {
  computePanicTaxTelemetry,
  computeSplitTimeMatrix,
  computeRootCauseTelemetry,
  computeCircadianSplitTelemetry,
  computeCareerLedgerTelemetry
} from '../utils/contestDeepDiveUtils.js'



export default function ContestDeepDive() {
  const [activeNav, setActiveNav] = useState('contest-deep-dive')
  const [activeSectionId, setActiveSectionId] = useState('section-panic-tax')
  const scrollContainerRef = useRef(null)

  // User info
  const user = useMemo(() => ({
    email: localStorage.getItem('lb_email') || '',
    name: localStorage.getItem('lb_name') || ''
  }), [])

  // Profile stats state
  const [stats, setStats] = useState(() => {
    try {
      const saved = localStorage.getItem('lb_stats')
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })

  // Contest document state
  const [contestDoc, setContestDoc] = useState(() => {
    try {
      const saved = localStorage.getItem('lb_contest')
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })

  const [isSyncing, setIsSyncing] = useState(false)
  const [syncNotice, setSyncNotice] = useState(null)

  // Username resolution
  const username = useMemo(() => {
    return (
      contestDoc?.leetcodeUsername ||
      stats?.username ||
      stats?.profile?.username ||
      localStorage.getItem('lb_username') ||
      ''
    )
  }, [contestDoc, stats])

  // Fetch or sync contest data from backend API
  const loadContestData = useCallback(async (forced = false) => {
    if (!username || username === 'user') return

    try {
      if (forced) setIsSyncing(true)
      const authToken = localStorage.getItem('accessToken') || localStorage.getItem('lb_token')

      const endpoint = forced
        ? '/api/v1/contests/sync'
        : `/api/v1/contests/${encodeURIComponent(username)}`

      const res = await fetch(endpoint, {
        method: forced ? 'POST' : 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {})
        },
        ...(forced ? { body: JSON.stringify({ username }) } : {})
      })

      if (res.ok) {
        const payload = await res.json()
        const targetContest = payload.contest || payload
        setContestDoc(targetContest)
        try {
          localStorage.setItem('lb_contest', JSON.stringify(targetContest))
          window.dispatchEvent(new CustomEvent('lb_contest_updated', { detail: targetContest }))
        } catch (e) {
          console.warn('Failed to cache contest data', e)
        }
        if (forced) {
          setSyncNotice({ type: 'success', text: 'Contest data updated' })
          setTimeout(() => setSyncNotice(null), 3000)
        }
      }
    } catch (err) {
      console.error('Failed to load contest data:', err)
      if (forced) {
        setSyncNotice({ type: 'error', text: 'Sync failed' })
        setTimeout(() => setSyncNotice(null), 3000)
      }
    } finally {
      if (forced) setIsSyncing(false)
    }
  }, [username])

  // Always fetch fresh telemetry on mount (SWR pattern) and auto-sync if cached data lacks fails/timestamps
  useEffect(() => {
    if (username) {
      const lacksTelemetry = !contestDoc?.recentFiveContestsDeepDive?.some(
        (c) => c.questions?.some((q) => q.failCount > 0 || q.submittedAt)
      );
      loadContestData(lacksTelemetry);
    }
  }, [username, loadContestData]);

  // Listen for real-time stats and contest updates
  useEffect(() => {
    const handleContestUpdated = (e) => {
      if (e.detail) setContestDoc(e.detail)
    }
    const handleStatsUpdated = (e) => {
      if (e.detail) {
        setStats(e.detail)
        if (e.detail.contest) setContestDoc(e.detail.contest)
      }
    }

    window.addEventListener('lb_contest_updated', handleContestUpdated)
    window.addEventListener('lb_stats_updated', handleStatsUpdated)

    return () => {
      window.removeEventListener('lb_contest_updated', handleContestUpdated)
      window.removeEventListener('lb_stats_updated', handleStatsUpdated)
    }
  }, [])

  // ── Compute Telemetry Data ───────────────────────────────────────
  const recentFiveContests = useMemo(
    () => contestDoc?.recentFiveContestsDeepDive || [],
    [contestDoc]
  )
  const contestHistory = useMemo(
    () => contestDoc?.contestHistory || [],
    [contestDoc]
  )

  const panicData = useMemo(
    () => computePanicTaxTelemetry(recentFiveContests, contestHistory),
    [recentFiveContests, contestHistory]
  )

  const matrixData = useMemo(
    () => computeSplitTimeMatrix(recentFiveContests),
    [recentFiveContests]
  )

  const rootCauseData = useMemo(
    () => computeRootCauseTelemetry(recentFiveContests),
    [recentFiveContests]
  )

  const circadianData = useMemo(
    () => computeCircadianSplitTelemetry(contestHistory),
    [contestHistory]
  )

  const careerData = useMemo(
    () => computeCareerLedgerTelemetry(contestDoc),
    [contestDoc]
  )

  const attendedCount = contestDoc?.summary?.attendedContestsCount ?? contestHistory.length



  // ── Intersection Observer to dynamically update active stepper node ─
  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const sectionElements = DEEP_DIVE_SECTIONS.map((s) => document.getElementById(s.id)).filter(Boolean)

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the visible section with highest intersection ratio or top closest to viewport
        const visibleEntries = entries.filter((e) => e.isIntersecting)
        if (visibleEntries.length > 0) {
          // Sort by top distance to header
          visibleEntries.sort((a, b) => Math.abs(a.boundingClientRect.top) - Math.abs(b.boundingClientRect.top))
          setActiveSectionId(visibleEntries[0].target.id)
        }
      },
      {
        root: container,
        rootMargin: '-100px 0px -50% 0px',
        threshold: [0, 0.2, 0.5]
      }
    )

    sectionElements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [recentFiveContests])

  const handleSelectSection = (sectionId) => {
    setActiveSectionId(sectionId)
    const el = document.getElementById(sectionId)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className="flex h-screen overflow-hidden bg-neutral-50 font-sans dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors duration-300">
      {/* Navigation Sidebar */}
      <Sidebar active={activeNav} setActive={setActiveNav} />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <DashHeader user={user} stats={stats} />

        {/* Connected Interactive Stepper Header */}
        <DeepDiveStepperHeader
          activeSectionId={activeSectionId}
          onSelectSection={handleSelectSection}
        />
        <ScrollProgress containerId="main-content" />

        {/* Scrollable Workspace Container */}
        <div ref={scrollContainerRef} id="main-content" tabIndex="-1" className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Top Breadcrumb & Quick Actions Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-neutral-200/60 dark:border-neutral-800/60">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Link
                  to="/contest-analysis"
                  className="flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-mono font-bold text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/60 dark:text-neutral-400 dark:hover:text-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Contest Overview</span>
                </Link>
                <span className="text-neutral-300 dark:text-neutral-700">/</span>
                <span className="font-mono text-xs font-extrabold text-neutral-900 dark:text-white uppercase tracking-wider">
                  Contest Deep Dive
                </span>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 pl-2">
                See where you lost time or points in your last 5 contests, and what to practice next.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {syncNotice && (
                <span
                  className={`text-[11px] font-mono ${
                    syncNotice.type === 'error' ? 'text-rose-500' : 'text-emerald-500'
                  }`}
                >
                  {syncNotice.text}
                </span>
              )}
              <button
                type="button"
                disabled={isSyncing}
                onClick={() => loadContestData(true)}
                className="flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-2.5 py-1.5 font-mono text-[11px] font-bold text-neutral-700 shadow-2xs transition hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700 disabled:opacity-50"
              >
                <RotateCw className={`h-3 w-3 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'Syncing...' : 'Sync Contests'}</span>
              </button>
            </div>
          </div>

          {/* Zero Contests Guardrail */}
          {attendedCount === 0 ? (
            <div className="rounded-xl border border-dashed border-neutral-300 bg-white p-12 text-center dark:border-neutral-800 dark:bg-neutral-900">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500 mb-4">
                <Trophy className="h-7 w-7" />
              </div>
              <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                No Rated Contests Detected
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 max-w-md mx-auto">
                Participate in your first LeetCode Weekly or Biweekly contest to see question breakdowns,
                penalty time stats, and personalized practice drills.
              </p>
              <button
                type="button"
                onClick={() => loadContestData(true)}
                className="mt-5 rounded-lg bg-neutral-900 px-4 py-2 font-mono text-xs font-bold text-white shadow-sm hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200 transition-colors"
              >
                Sync LeetCode Account
              </button>
            </div>
          ) : (
            <>
              {/* ── SECTION 01: Penalty Analysis ──────────────── */}
              <PanicTaxSection panicData={panicData} />

              {/* ── SECTION 02: 90-Minute Split-Time Autopsy ─────── */}
              <SplitTimeAutopsySection matrixData={matrixData} />

              {/* ── SECTION 03: Root-Cause Mistake Categorizer ───── */}
              <RootCauseMistakeSection telemetry={rootCauseData} />

              {/* ── SECTION 04: Bleeding Remediation Pipeline ─────── */}
              <BleedingRemediationSection
                username={username}
                initialRemediation={contestDoc?.aiDeepDiveRemediation}
              />

              {/* ── SECTION 05: The Biological Clock Split ──────── */}
              <CircadianSplitSection data={circadianData} />

              {/* ── SECTION 06: Volatility, Horizon & Career Ledger ─ */}
              <CareerContestLedgerSection data={careerData} />

            </>
          )}
        </div>

        {/* Floating Back to Top Button */}
        <BackToTop scrollContainerId="main-content" />
      </div>
    </div>
  )
}
