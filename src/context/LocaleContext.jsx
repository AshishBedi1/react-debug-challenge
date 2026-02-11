import { createContext, useContext, useState } from 'react'

const defaultLocale = { locale: 'en', setLocale: () => {} }
const LocaleContext = createContext(defaultLocale)

export function LocaleProvider({ children }) {
  const [locale, setLocale] = useState('en')
  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale() {
  const ctx = useContext(LocaleContext)
  return ctx
}
