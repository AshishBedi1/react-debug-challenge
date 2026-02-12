import { createContext, useContext, useState, useMemo } from 'react'

const SettingsContext = createContext(null)

export function SettingsProvider({ children }) {
  const [settings, setSettingsState] = useState({
    language: 'en',
    emailNotifications: true,
    pushNotifications: false,
    theme: 'system',
    privacy: 'public',
    autoSave: true,
  })

  const setSettings = (newSettings) => {
    setSettingsState((prev) => ({ ...prev, ...newSettings }))
  }

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
