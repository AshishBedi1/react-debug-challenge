import { createContext, useContext, useState, useMemo, useEffect, useCallback } from 'react'

const defaults = {
  language: 'en',
  emailNotifications: true,
  pushNotifications: false,
  theme: 'system',
  privacy: 'public',
  autoSave: true,
}

const SettingsContext = createContext(null)

export function SettingsProvider({ children }) {
  const [settings, setSettingsState] = useState(() => {
    try {
      const saved = localStorage.getItem('userSettings')
      return saved ? { ...defaults, ...JSON.parse(saved) } : defaults
    } catch {
      return defaults
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem('userSettings', JSON.stringify(settings))
    } catch {
      // ignore write errors
    }
  }, [settings])

  const setSettings = useCallback((newSettings) => {
    setSettingsState((prev) => {
      const updated = typeof newSettings === 'function' ? newSettings(prev) : { ...prev, ...newSettings }
      return updated
    })
  }, [])

  const value = useMemo(() => ({ settings, setSettings }), [settings])

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const ctx = useContext(SettingsContext)
  if (!ctx) {
    throw new Error('useSettings must be used within SettingsProvider')
  }
  return ctx
}
