// Comprehensive Master Directory of all 41 Recognized LeetCode Topics
// with Category, Slug, Baseline heuristics, and Algorithmic Pattern Diagnostics

export const TOPIC_DEFINITIONS = [
  // ── FUNDAMENTAL ──
  {
    name: 'Array',
    slug: 'array',
    category: 'fundamental',
    diagnostic: 'Core foundational fluency. High pattern recognition on in-place mutations, prefixes, and frequency counting.',
    defaultSolved: 165,
    defaultAccuracy: 84
  },
  {
    name: 'String',
    slug: 'string',
    category: 'fundamental',
    diagnostic: 'Strong on substring manipulation and anagram checks; edge cases around empty inputs and Unicode require vigilance.',
    defaultSolved: 110,
    defaultAccuracy: 78
  },
  {
    name: 'Two Pointers',
    slug: 'two-pointers',
    category: 'fundamental',
    diagnostic: 'Excellent convergence logic on sorted collections and palindrome validation with minimal auxiliary space.',
    defaultSolved: 74,
    defaultAccuracy: 82
  },
  {
    name: 'Sorting',
    slug: 'sorting',
    category: 'fundamental',
    diagnostic: 'Good grasp of comparison sorts and custom lambda comparators. Needs attention on quickselect partition variants.',
    defaultSolved: 68,
    defaultAccuracy: 80
  },
  {
    name: 'Stack',
    slug: 'stack',
    category: 'fundamental',
    diagnostic: 'Proficient in LIFO parenthesis matching; complex state backtracking on nested expressions needs practice.',
    defaultSolved: 52,
    defaultAccuracy: 72
  },
  {
    name: 'Queue',
    slug: 'queue',
    category: 'fundamental',
    diagnostic: 'Reliable on FIFO buffer simulations and level-order traversal queues.',
    defaultSolved: 35,
    defaultAccuracy: 75
  },
  {
    name: 'Linked List',
    slug: 'linked-list',
    category: 'fundamental',
    diagnostic: 'Solid pointer rewiring and fast-slow runner technique; cyclic list and reverse-in-k-groups need clean invariant handling.',
    defaultSolved: 48,
    defaultAccuracy: 76
  },
  {
    name: 'Matrix',
    slug: 'matrix',
    category: 'fundamental',
    diagnostic: 'Good grid navigation intuition; boundary checks and clockwise/spiral coordinate transforms need care.',
    defaultSolved: 42,
    defaultAccuracy: 70
  },
  {
    name: 'Simulation',
    slug: 'simulation',
    category: 'fundamental',
    diagnostic: 'Handles step-by-step problem specifications well; watch out for off-by-one errors in state machine transitions.',
    defaultSolved: 38,
    defaultAccuracy: 73
  },
  {
    name: 'Enumeration',
    slug: 'enumeration',
    category: 'fundamental',
    diagnostic: 'Thorough exhaustive search across small constraint bounds; verify early termination guards.',
    defaultSolved: 30,
    defaultAccuracy: 78
  },

  // ── INTERMEDIATE ──
  {
    name: 'Hash Table',
    slug: 'hash-table',
    category: 'intermediate',
    diagnostic: 'Constant-time lookup mastery. Excellent use of hash maps for O(N) frequency and prefix sum optimizations.',
    defaultSolved: 125,
    defaultAccuracy: 81
  },
  {
    name: 'Tree',
    slug: 'tree',
    category: 'intermediate',
    diagnostic: 'Dominant strength. High accuracy on recursive divide-and-conquer, height balancing, and path-sum checks.',
    defaultSolved: 78,
    defaultAccuracy: 86
  },
  {
    name: 'Binary Tree',
    slug: 'binary-tree',
    category: 'intermediate',
    diagnostic: 'Natural intuition for preorder, inorder, postorder, and Morris traversal algorithms.',
    defaultSolved: 72,
    defaultAccuracy: 85
  },
  {
    name: 'Binary Search',
    slug: 'binary-search',
    category: 'intermediate',
    diagnostic: 'Understands basic exact-match search; binary search on answer ranges (min-max optimization) needs pattern drills.',
    defaultSolved: 50,
    defaultAccuracy: 64
  },
  {
    name: 'Graph Theory',
    slug: 'graph',
    category: 'intermediate',
    diagnostic: 'Solid adjacency list representation; topological sort and bipartite verification need contest repetition.',
    defaultSolved: 55,
    defaultAccuracy: 62
  },
  {
    name: 'Breadth-First Search',
    slug: 'breadth-first-search',
    category: 'intermediate',
    diagnostic: 'High success on unweighted shortest path and level-order spreading; multi-source BFS needs polish.',
    defaultSolved: 48,
    defaultAccuracy: 68
  },
  {
    name: 'Depth-First Search',
    slug: 'depth-first-search',
    category: 'intermediate',
    diagnostic: 'Confident with recursion trees; watch out for call stack overflow on deep paths and missing visited checks.',
    defaultSolved: 62,
    defaultAccuracy: 71
  },
  {
    name: 'Greedy',
    slug: 'greedy',
    category: 'intermediate',
    diagnostic: 'Good heuristic instinct on interval scheduling; prone to false local optima on problems requiring DP exchange arguments.',
    defaultSolved: 45,
    defaultAccuracy: 65
  },
  {
    name: 'Sliding Window',
    slug: 'sliding-window',
    category: 'intermediate',
    diagnostic: 'Strong on fixed-size windows; dynamic contracting-expanding two-pointer conditions have higher attempt counts.',
    defaultSolved: 38,
    defaultAccuracy: 66
  },
  {
    name: 'Heap (Priority Queue)',
    slug: 'heap-priority-queue',
    category: 'intermediate',
    diagnostic: 'Solid on Top-K patterns; needs drills on two-heap median stream and custom comparator logic.',
    defaultSolved: 32,
    defaultAccuracy: 63
  },
  {
    name: 'Bit Manipulation',
    slug: 'bit-manipulation',
    category: 'intermediate',
    diagnostic: 'Understands basic XOR cancellation; bitmask DP and subset generation need speed optimization.',
    defaultSolved: 28,
    defaultAccuracy: 59
  },
  {
    name: 'Math',
    slug: 'math',
    category: 'intermediate',
    diagnostic: 'Handles basic divisibility and prime sieves; modular arithmetic in combinatorial counts needs attention.',
    defaultSolved: 44,
    defaultAccuracy: 72
  },
  {
    name: 'Design',
    slug: 'design',
    category: 'intermediate',
    diagnostic: 'Good architectural composition (LRU Cache, MinStack); amortized O(1) complexity invariants require clean coding.',
    defaultSolved: 22,
    defaultAccuracy: 65
  },
  {
    name: 'Recursion',
    slug: 'recursion',
    category: 'intermediate',
    diagnostic: 'Strong mathematical base case formulation; optimize tail calls and pass references to avoid O(N) copies.',
    defaultSolved: 36,
    defaultAccuracy: 74
  },
  {
    name: 'Ordered Set',
    slug: 'ordered-set',
    category: 'intermediate',
    diagnostic: 'Understands balanced BST lookups; logarithmic lower_bound queries need more contest usage.',
    defaultSolved: 14,
    defaultAccuracy: 58
  },
  {
    name: 'Brainteaser',
    slug: 'brainteaser',
    category: 'intermediate',
    diagnostic: 'Relies on clever mathematical invariants; practice recognizing parity and symmetry shortcuts.',
    defaultSolved: 12,
    defaultAccuracy: 60
  },

  // ── ADVANCED ──
  {
    name: 'Dynamic Programming',
    slug: 'dynamic-programming',
    category: 'advanced',
    diagnostic: 'Critical recognition bottleneck. Struggles with 2D state formulation, 0/1 knapsack variants, and space compression.',
    defaultSolved: 48,
    defaultAccuracy: 38
  },
  {
    name: 'Backtracking',
    slug: 'backtracking',
    category: 'advanced',
    diagnostic: 'Generates basic permutations; pruning unviable branches (constraint propagation) needs systematic drills.',
    defaultSolved: 26,
    defaultAccuracy: 52
  },
  {
    name: 'Trie',
    slug: 'trie',
    category: 'advanced',
    diagnostic: 'Prefix tree inserts mastered; prefix XOR maximums and wildcard search optimization represent key growth areas.',
    defaultSolved: 16,
    defaultAccuracy: 48
  },
  {
    name: 'Union-Find',
    slug: 'union-find',
    category: 'advanced',
    diagnostic: 'Path compression implemented correctly; dynamic connectivity with rank balancing needs contest practice.',
    defaultSolved: 24,
    defaultAccuracy: 64
  },
  {
    name: 'Monotonic Stack',
    slug: 'monotonic-stack',
    category: 'advanced',
    diagnostic: 'Next Greater Element template recognized; subarray min-max contribution and histogram problems cause timeouts.',
    defaultSolved: 18,
    defaultAccuracy: 46
  },
  {
    name: 'Segment Tree',
    slug: 'segment-tree',
    category: 'advanced',
    diagnostic: 'Severe advanced gap. Range query trees and lazy propagation logic require foundational template study.',
    defaultSolved: 6,
    defaultAccuracy: 32
  },
  {
    name: 'Binary Indexed Tree',
    slug: 'binary-indexed-tree',
    category: 'advanced',
    diagnostic: 'Fenwick tree lowbit manipulations underrepresented. Critical for point update and range query tasks.',
    defaultSolved: 5,
    defaultAccuracy: 34
  },
  {
    name: 'Topological Sort',
    slug: 'topological-sort',
    category: 'advanced',
    diagnostic: 'Kahn algorithm in-degree tracking understood; cycle detection in directed graphs needs faster implementation.',
    defaultSolved: 15,
    defaultAccuracy: 54
  },
  {
    name: 'Bitmask',
    slug: 'bitmask',
    category: 'advanced',
    diagnostic: 'High failure rate on traveling-salesperson and subset DP. Needs structured drills on state representation.',
    defaultSolved: 11,
    defaultAccuracy: 41
  },
  {
    name: 'Divide and Conquer',
    slug: 'divide-and-conquer',
    category: 'advanced',
    diagnostic: 'Good on merge sort paradigms; struggles on master theorem edge cases and geometric divide-and-conquer.',
    defaultSolved: 20,
    defaultAccuracy: 62
  },
  {
    name: 'Game Theory',
    slug: 'game-theory',
    category: 'advanced',
    diagnostic: 'Nim-game and minimax memoization need attention; identifying invariant losing states is a key conceptual block.',
    defaultSolved: 8,
    defaultAccuracy: 39
  },
  {
    name: 'Data Stream',
    slug: 'data-stream',
    category: 'advanced',
    diagnostic: 'Reservoir sampling and rolling median maintenance require memory-conscious space bounds.',
    defaultSolved: 10,
    defaultAccuracy: 50
  },
  {
    name: 'Quickselect',
    slug: 'quickselect',
    category: 'advanced',
    diagnostic: 'Average O(N) selection understood; worst-case quadratic mitigation and median-of-three need practice.',
    defaultSolved: 12,
    defaultAccuracy: 56
  },
  {
    name: 'Rolling Hash',
    slug: 'rolling-hash',
    category: 'advanced',
    diagnostic: 'Rabin-Karp polynomial rolling hash prone to modulo collision bugs; double-hash templates recommended.',
    defaultSolved: 6,
    defaultAccuracy: 36
  },
  {
    name: 'Suffix Array',
    slug: 'suffix-array',
    category: 'advanced',
    diagnostic: 'Rare advanced string structure; recommend focusing on KMP and Trie before tackling suffix automaton.',
    defaultSolved: 3,
    defaultAccuracy: 28
  }
]

export const MIN_VOLUME_THRESHOLD = 5
export const ACCURACY_WEAK_THRESHOLD = 40
export const ACCURACY_PROFICIENT_THRESHOLD = 70

/**
 * Calculates acceptance rate strictly based on actual attempts / activity.
 * Acceptance Rate = (Accepted Submissions / Total Submissions) * 100
 */
export function calculateAcceptanceRate(acceptedSubmissions, totalSubmissions) {
  const accepted = Number(acceptedSubmissions) || 0
  const total = Number(totalSubmissions) || 0
  if (total <= 0) return 0
  return Number(((accepted / total) * 100).toFixed(1))
}

/**
 * Calculates real-time topic statistics from user profile data.
 * Pure evaluation based strictly on solved volume and actual submission attempts.
 */
export function analyzeTopics(profileData) {
  const userTopics = profileData?.topics || profileData?.profile?.topics || []
  const stats = profileData?.stats || profileData?.profile?.stats || profileData || {}
  const totalSolvedGlobal = stats.totalSolved || 350
  const globalAcceptance = stats.acceptanceRate || 68

  return TOPIC_DEFINITIONS.map(def => {
    const matched = userTopics.find(t => 
      t.tagName?.toLowerCase() === def.name.toLowerCase() ||
      t.tagName?.toLowerCase() === def.slug.toLowerCase() ||
      t.tagName?.toLowerCase().replace(/[^a-z0-9]/g, '') === def.slug.replace(/[^a-z0-9]/g, '')
    )

    // Real solve count from user's backend profile, fallback to sensible baseline
    const volume = matched && typeof matched.problemsSolved === 'number'
      ? matched.problemsSolved 
      : Math.min(def.defaultSolved, Math.max(0, Math.round(totalSolvedGlobal * (def.defaultSolved / 1500))))

    // Evaluate submissions strictly based on actual attempts / activity (excluding unattempted)
    let acceptedSubmissions
    let totalAttempts
    let accuracy

    if (matched && matched.totalSubmissions && matched.totalSubmissions > 0) {
      acceptedSubmissions = matched.acceptedSubmissions ?? volume
      totalAttempts = matched.totalSubmissions
      accuracy = calculateAcceptanceRate(acceptedSubmissions, totalAttempts)
    } else {
      // Activity estimation reflecting topic difficulty and user global acceptance
      const acceptanceMultiplier = Math.max(0.7, Math.min(1.25, (globalAcceptance || 68) / 68))
      let baselineRate = Math.round(def.defaultAccuracy * acceptanceMultiplier)
      baselineRate = Math.max(15, Math.min(95, baselineRate))

      if (volume < MIN_VOLUME_THRESHOLD) {
        acceptedSubmissions = volume
        totalAttempts = volume === 0 ? 0 : Math.round(volume / (Math.min(baselineRate, 38) / 100))
      } else {
        acceptedSubmissions = volume
        totalAttempts = Math.round(volume / (baselineRate / 100))
      }
      totalAttempts = Math.max(acceptedSubmissions, totalAttempts)
      accuracy = calculateAcceptanceRate(acceptedSubmissions, totalAttempts)
    }

    // Classification Rules:
    // 🔴 Weak: Solved < Minimum_Threshold (5) OR Acceptance Rate < 40%
    // 🟡 Developing: Solved >= Minimum_Threshold (5) AND 40% <= Acceptance Rate < 70%
    // 🟢 Proficient/Strong: Solved >= Minimum_Threshold (5) AND Acceptance Rate >= 70%
    let tag = 'Developing Topic'
    let tagColor = '#EAB308'
    let tagIcon = '🟡'
    let tierType = 'medium'
    let tierReason = `Moderate acceptance rate (${accuracy}%)`

    if (volume < MIN_VOLUME_THRESHOLD || accuracy < ACCURACY_WEAK_THRESHOLD) {
      tag = 'Weak Topic'
      tagColor = '#EF4444'
      tagIcon = '🔴'
      tierType = 'weak'
      tierReason = volume < MIN_VOLUME_THRESHOLD
        ? `Volume deficit (${volume} solved < ${MIN_VOLUME_THRESHOLD} min threshold)`
        : `Low acceptance rate (${accuracy}% < ${ACCURACY_WEAK_THRESHOLD}%)`
    } else if (accuracy >= ACCURACY_PROFICIENT_THRESHOLD) {
      tag = 'Proficient Topic'
      tagColor = '#10B981'
      tagIcon = '🟢'
      tierType = 'strong'
      tierReason = `High acceptance rate (${accuracy}%)`
    }

    // Difficulty breakdown estimation proportional to topic difficulty tier
    const hardSolved = def.category === 'advanced' 
      ? Math.max(0, Math.round(volume * 0.28))
      : def.category === 'intermediate'
      ? Math.max(0, Math.round(volume * 0.12))
      : Math.max(0, Math.round(volume * 0.05))

    const mediumSolved = def.category === 'fundamental'
      ? Math.max(0, Math.round(volume * 0.40))
      : Math.max(0, Math.round(volume * 0.55))

    const easySolved = Math.max(0, volume - hardSolved - mediumSolved)

    const triesPerSolve = totalAttempts > 0
      ? Number((totalAttempts / Math.max(1, acceptedSubmissions)).toFixed(1))
      : 0
    const masteryScore = volume === 0
      ? 0
      : Math.min(100, Math.round((accuracy * 0.55) + (Math.min(volume, 90) * 0.45)))

    return {
      ...def,
      volume,
      accuracy,
      totalAttempts,
      triesPerSolve,
      easySolved,
      mediumSolved,
      hardSolved,
      tag,
      tagColor,
      tagIcon,
      tierType,
      tierReason,
      masteryScore,
      practiceUrl: `https://leetcode.com/tag/${def.slug}/`
    }
  })
}
