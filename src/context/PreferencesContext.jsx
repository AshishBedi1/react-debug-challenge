import { createContext, useContext, useState } from 'react'

const defaultPreferences = { currency: 'USD', notifications: true, setCurrency: () => {}, setNotifications: () => {} }
const PreferencesContext = createContext(defaultPreferences)

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
  return ctx
}
