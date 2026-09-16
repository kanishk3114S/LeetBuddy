import { useTheme } from '../hooks/useTheme.js'

function ThemeToggle() {
  const { isDarkMode, toggleTheme } = useTheme()

  return <button className="theme-toggle" type="button" onClick={toggleTheme} aria-label={isDarkMode ? 'Use light mode' : 'Use dark mode'} title={isDarkMode ? 'Use light mode' : 'Use dark mode'}>{isDarkMode ? '☀' : '☾'}</button>
}

export default ThemeToggle
