import { createContext, useContext, useState } from 'react'

const WidgetContext = createContext(null)

export function WidgetProvider({ children }) {
  const [layout, setLayout] = useState('grid')
  const [widgetConfig, setWidgetConfig] = useState({
    refreshInterval: 30,
    showHeaders: true,
    maxItems: 5,
    theme: 'default',
  })

  return (
    <WidgetContext.Provider value={{ layout, setLayout, widgetConfig, setWidgetConfig }}>
      {children}
    </WidgetContext.Provider>
  )
}

export function useWidgetConfig() {
  const ctx = useContext(WidgetContext)
  if (!ctx) {
    throw new Error('useWidgetConfig must be used within WidgetProvider')
  }
  return ctx
}
