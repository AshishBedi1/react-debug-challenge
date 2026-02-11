import { createContext, useContext, useState } from 'react'

const PreferencesContext = createContext(null)

export function PreferencesProvider({ children }) {
  const [currency, setCurrency] = useState('USD')
  const [notifications, setNotifications] = useState(true)

  return (
    <PreferencesContext.Provider
      value={{
        currency,
        setCurrency,
        notifications,
        setNotifications,
      }}
    >
      {children}
    </PreferencesContext.Provider>
  )
}

export function usePreferences() {
  const ctx = useContext(PreferencesContext)
  if (!ctx) return { currency: 'USD', notifications: true }
  return ctx
}
