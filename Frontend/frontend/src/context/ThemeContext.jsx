import { useEffect, useState } from 'react'
import { ThemeContext } from './theme.js'

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') ?? localStorage.getItem('leetbuddy-theme') ?? 'light')

  useEffect(() => {
    localStorage.setItem('theme', theme)
    document.documentElement.dataset.theme = theme
    document.body.dataset.theme = theme
    const pageColor = theme === 'dark' ? '#131815' : '#f8f8f5'
    document.documentElement.style.backgroundColor = pageColor
    document.body.style.backgroundColor = pageColor
  }, [theme])

  const toggleTheme = () => setTheme((currentTheme) => currentTheme === 'dark' ? 'light' : 'dark')

  return <ThemeContext.Provider value={{ theme, isDarkMode: theme === 'dark', toggleTheme }}>{children}</ThemeContext.Provider>
}
