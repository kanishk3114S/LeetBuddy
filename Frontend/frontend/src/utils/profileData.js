// Comprehensive Profile Data Normalizer and GraphQL Formatter for LeetBuddy
// Ensures 100% uniform data contracts across Dashboard, Profile Insights, and Topic Mastery.

/**
 * Normalizes user stats from backend responses, MongoDB documents, localStorage, or GraphQL proxies.
 * Handles both nested structure ({ username, profile: { stats, topics, ... } })
 * and flat structure ({ stats, topics, activity, profile: { ranking, ... } }).
 */
export function normalizeProfileData(rawStats) {
  if (!rawStats) return null

  // Check if profile is nested under rawStats.profile
  const hasNestedProfile = rawStats.profile && (
    rawStats.profile.stats ||
    rawStats.profile.topics ||
    rawStats.profile.activity ||
    rawStats.profile.submissionCalendar
  )

  const profileDoc = hasNestedProfile ? rawStats.profile : rawStats

  // Extract core stats
  const stats = profileDoc.stats || {}
  const totalSolved = Number(stats.totalSolved ?? 0)
  const easySolved = Number(stats.easySolved ?? 0)
  const mediumSolved = Number(stats.mediumSolved ?? 0)
  const hardSolved = Number(stats.hardSolved ?? 0)
  const totalSubmissions = Number(stats.totalSubmissions ?? 0)
  const acceptedSubmissions = Number(stats.acceptedSubmissions ?? 0)
  const acceptanceRate = typeof stats.acceptanceRate === 'number'
    ? stats.acceptanceRate
    : totalSubmissions > 0
    ? Number(((acceptedSubmissions / totalSubmissions) * 100).toFixed(1))
    : 0
  const leetBuddyPoints = typeof stats.leetBuddyPoints === 'number' && stats.leetBuddyPoints > 0
    ? stats.leetBuddyPoints
    : (easySolved * 1) + (mediumSolved * 3) + (hardSolved * 5)

  // Total questions count pool
  const allQ = profileDoc.allQuestionsCount || {}
  const allQuestionsCount = {
    all: Number(allQ.all ?? 4082),
    easy: Number(allQ.easy ?? 971),
    medium: Number(allQ.medium ?? 2128),
    hard: Number(allQ.hard ?? 983)
  }

  // Beats percentages
  const beats = profileDoc.beatsStats || {}
  const beatsStats = {
    easy: Number(beats.easy ?? 0),
    medium: Number(beats.medium ?? 0),
    hard: Number(beats.hard ?? 0)
  }

  // LeetCode profile subdocument (ranking, userAvatar, realName, aboutMe)
  const meta = profileDoc.profile || {}
  const ranking = Number(meta.ranking ?? (typeof profileDoc.ranking === 'number' ? profileDoc.ranking : 0))
  const userAvatar = meta.userAvatar || profileDoc.userAvatar || ''
  const realName = meta.realName || profileDoc.realName || ''
  const aboutMe = meta.aboutMe || profileDoc.aboutMe || ''

  // Activity & streaks
  const act = profileDoc.activity || {}
  const currentStreak = Number(act.currentStreak ?? 0)
  const totalActiveDays = Number(act.totalActiveDays ?? 0)
  const activeYears = Array.isArray(act.activeYears) && act.activeYears.length > 0
    ? act.activeYears
    : [new Date().getFullYear()]
  const bestPerformingDay = act.bestPerformingDay || null

  // Topics
  const topics = Array.isArray(profileDoc.topics) ? profileDoc.topics : []

  // Badges
  const badges = Array.isArray(profileDoc.badges) ? profileDoc.badges : []
  const activeBadge = profileDoc.activeBadge || (badges.length > 0 ? badges[0] : null)

  // Safely normalize submission calendar (supports JSON string, Mongoose Map, or plain Object)
  let calendar = profileDoc.submissionCalendar
  if (typeof calendar === 'string') {
    try {
      calendar = JSON.parse(calendar)
    } catch {
      calendar = {}
    }
  } else if (calendar instanceof Map) {
    calendar = Object.fromEntries(calendar.entries())
  } else if (!calendar || typeof calendar !== 'object') {
    calendar = {}
  }

  const username = rawStats.username || profileDoc.username || ''
  const heroCard = rawStats.heroCard || profileDoc.heroCard || null

  return {
    username,
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
      ranking,
      userAvatar,
      realName,
      aboutMe
    },
    activity: {
      currentStreak,
      totalActiveDays,
      activeYears,
      bestPerformingDay
    },
    topics,
    badges,
    activeBadge,
    submissionCalendar: calendar,
    heroCard,
    raw: rawStats
  }
}

/**
 * Normalizes raw LeetCode GraphQL response data into the canonical profile shape.
 */
export function formatGraphQLResponse(userData, allQuestionsList) {
  const acList = userData?.submitStatsGlobal?.acSubmissionNum || userData?.submitStats?.acSubmissionNum || []
  const totalSolved = acList.find(x => x.difficulty === "All")?.count || 0
  const easySolved = acList.find(x => x.difficulty === "Easy")?.count || 0
  const mediumSolved = acList.find(x => x.difficulty === "Medium")?.count || 0
  const hardSolved = acList.find(x => x.difficulty === "Hard")?.count || 0

  const totalSubList = userData?.submitStatsGlobal?.totalSubmissionNum || userData?.submitStats?.totalSubmissionNum || []
  const acceptedSubmissions = acList.find(x => x.difficulty === "All")?.submissions || 0
  const totalSubmissions = totalSubList.find(x => x.difficulty === "All")?.submissions || 0
  const acceptanceRate = totalSubmissions > 0 ? Number(((acceptedSubmissions / totalSubmissions) * 100).toFixed(1)) : 0

  const allQuestionsCount = {
    all: allQuestionsList?.find(x => x.difficulty === "All")?.count || 4082,
    easy: allQuestionsList?.find(x => x.difficulty === "Easy")?.count || 971,
    medium: allQuestionsList?.find(x => x.difficulty === "Medium")?.count || 2128,
    hard: allQuestionsList?.find(x => x.difficulty === "Hard")?.count || 983
  }

  const beatsList = userData?.problemsSolvedBeatsStats || []
  const beatsStats = {
    easy: beatsList.find(x => x.difficulty === "Easy")?.percentage || 0,
    medium: beatsList.find(x => x.difficulty === "Medium")?.percentage || 0,
    hard: beatsList.find(x => x.difficulty === "Hard")?.percentage || 0
  }

  const leetBuddyPoints = (easySolved * 1) + (mediumSolved * 3) + (hardSolved * 5)

  const parsedCalendar = typeof userData?.userCalendar?.submissionCalendar === 'string'
    ? JSON.parse(userData?.userCalendar?.submissionCalendar || "{}")
    : (userData?.userCalendar?.submissionCalendar || {})

  let bestPerformingDay = null
  let maxSubmissionsOnDay = 0

  for (const [timestamp, count] of Object.entries(parsedCalendar)) {
    const c = Number(count)
    if (c > maxSubmissionsOnDay) {
      maxSubmissionsOnDay = c
      bestPerformingDay = {
        date: new Date(Number(timestamp) * 1000).toISOString(),
        submissionCount: c
      }
    }
  }

  const badges = (userData?.badges || []).map(b => ({
    id: b.id,
    name: b.displayName || b.shortName || b.name,
    icon: b.icon?.startsWith("http") ? b.icon : (b.icon ? `https://leetcode.com${b.icon}` : ""),
    category: b.category || "",
    creationDate: b.creationDate || null
  }))

  const activeBadge = userData?.activeBadge ? {
    id: userData.activeBadge.id,
    name: userData.activeBadge.displayName || userData.activeBadge.name,
    icon: userData.activeBadge.icon?.startsWith("http") ? userData.activeBadge.icon : (userData.activeBadge.icon ? `https://leetcode.com${userData.activeBadge.icon}` : "")
  } : (badges.length > 0 ? badges[0] : null)

  const topics = []
  const addTags = (list, category) => {
    (list || []).forEach(t => {
      topics.push({ tagName: t.tagName, problemsSolved: t.problemsSolved, category })
    })
  }
  addTags(userData?.tagProblemCounts?.fundamental, 'fundamental')
  addTags(userData?.tagProblemCounts?.intermediate, 'intermediate')
  addTags(userData?.tagProblemCounts?.advanced, 'advanced')

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
  }
}
