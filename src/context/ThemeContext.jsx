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
    setTheme((prevTheme) => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light'
      try {
        localStorage.setItem('appTheme', newTheme)
      } catch (e) {
        console.error('Failed to save theme to localStorage', e)
      }
      return newTheme
    })
  }, [])

  const themeLabel = useCallback(() => (theme === 'dark' ? 'Dark' : 'Light'), [theme])
  const config = { primaryColor: theme === 'dark' ? '#1a1a1a' : '#ffffff', label: theme }
  const value = {
    theme,
    toggleTheme,
    isDark: theme === 'dark',
    themeLabel,
    config,
  }
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
