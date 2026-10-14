import { useTheme } from '../hooks/useTheme.js'

function ThemeToggle() {
  const { isDarkMode, toggleTheme } = useTheme()

  return (
    <button
      className="theme-toggle flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-700 shadow-xs transition hover:border-neutral-300 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
      type="button"
      onClick={toggleTheme}
      aria-label={isDarkMode ? 'Use light mode' : 'Use dark mode'}
      title={isDarkMode ? 'Use light mode' : 'Use dark mode'}
    >
      {isDarkMode ? '☀' : '☾'}
    </button>
  )
}

export default ThemeToggle
