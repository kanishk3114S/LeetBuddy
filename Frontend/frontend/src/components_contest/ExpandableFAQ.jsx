import { useState } from 'react'
import { ChevronDown, HelpCircle } from 'lucide-react'

const FAQ_ITEMS = [
  {
    id: 'faq-ratings-timing',
    question: 'When do LeetCode contest ratings and ranks update?',
    answer:
      'LeetCode official contest ratings are typically finalized and published 3 to 4 days after a contest finishes (usually Wednesday night or Thursday UTC). LeetBuddy automatically checks for your new rating and leaderboard ranking as soon as LeetCode finishes its anti-cheat review and publishes the results.'
  },
  {
    id: 'faq-panic-tax',
    question: 'What is the +5 Minute Penalty (Panic Tax)?',
    answer:
      'In LeetCode rated contests, each wrong submission (Wrong Answer, Time Limit Exceeded, or Runtime Error) adds a strict +5 minute penalty to that problem’s final completion time. LeetBuddy calculates your cumulative penalty time across contests to show you exactly how many leaderboard positions you lose to rushed or unverified submissions.'
  },
  {
    id: 'faq-mastery-score',
    question: 'How is Topic Mastery calculated?',
    answer:
      'Topic Mastery scores (0 to 100%) measure both breadth and depth. We evaluate your total solved count in that algorithmic category, your ratio of Medium and Hard solutions, and how reliably you solve questions with those tags under live contest pressure.'
  },
  {
    id: 'faq-circadian-split',
    question: 'What is the Saturday vs. Sunday contest comparison?',
    answer:
      'This feature compares your performance between Saturday evening Biweekly Contests and Sunday morning Weekly Contests. It helps you identify whether fatigue, sleep schedule, or time of day impacts your problem-solving accuracy and rating delta.'
  },
  {
    id: 'faq-ai-recommendations',
    question: 'How does LeetBuddy AI coaching create practice recommendations?',
    answer:
      'Rather than giving generic boilerplate tips, the AI mentor examines your actual submission history, penalty trends, and problem-solving choke slots. It identifies specific pattern deficits (such as 2D DP transitions, graph cycle detection, or two-pointer boundary cases) and suggests targeted practice questions to fix those gaps.'
  }
]

export default function ExpandableFAQ() {
  const [openIds, setOpenIds] = useState(new Set(['faq-ratings-timing']))

  const toggleItem = (id) => {
    setOpenIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 transition-colors">
      <div className="flex items-center gap-2.5 pb-4 mb-4 border-b border-neutral-100 dark:border-neutral-800">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-800/80 text-neutral-600 dark:text-neutral-300">
          <HelpCircle className="h-4 w-4" />
        </div>
        <div>
          <h2 className="text-[14px] font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            Frequently Asked Questions
          </h2>
          <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
            Everything you need to know about contest ratings, penalties, and insights
          </p>
        </div>
      </div>

      <div className="divide-y divide-neutral-100 dark:divide-neutral-800/80">
        {FAQ_ITEMS.map((item) => {
          const isOpen = openIds.has(item.id)
          return (
            <div key={item.id} className="py-3.5 first:pt-1 last:pb-1">
              <button
                type="button"
                onClick={() => toggleItem(item.id)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between text-left group cursor-pointer"
              >
                <span className="text-[13px] font-semibold text-neutral-800 group-hover:text-neutral-950 dark:text-neutral-200 dark:group-hover:text-white transition-colors pr-4">
                  {item.question}
                </span>
                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-neutral-400 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-neutral-700 dark:text-neutral-200' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="mt-2.5 pr-6 text-[12px] leading-relaxed text-neutral-600 dark:text-neutral-400">
                  {item.answer}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
