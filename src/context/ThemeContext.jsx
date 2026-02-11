import { createContext, useContext, useState, useCallback } from 'react'

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('appTheme') || 'light'
    } catch {
      return 'light'
    }
  })

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === 'light' ? 'dark' : 'light'
      try {
        localStorage.setItem('appTheme', next)
      } catch (e) {
        console.warn('Could not persist theme', e)
      }
      return next
    })
  }, [])

  const themeLabel = useCallback(() => (theme === 'dark' ? 'Dark' : 'Light'), [])
  const value = { theme, toggleTheme, isDark: theme === 'dark', themeLabel }
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return ctx
}
