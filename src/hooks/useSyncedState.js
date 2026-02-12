import { useState, useEffect, useCallback } from 'react'

export function useSyncedState(key, initialValue) {
  const [state, setState] = useState(() => {
    try {
      const saved = localStorage.getItem(key)
      return saved ? JSON.parse(saved) : initialValue
    } catch {
      return initialValue
    }
  })

  // Defer localStorage writes to useEffect
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state))
    } catch (e) {
      console.warn('localStorage write failed', e)
    }
  }, [key, state])

  // Listen for cross-tab changes
  useEffect(() => {
    const handler = (e) => {
      if (e.key === key && e.newValue) {
        try {
          setState(JSON.parse(e.newValue))
        } catch {
          // ignore parse errors
        }
      }
    }
    window.addEventListener('storage', handler)
    return () => window.removeEventListener('storage', handler)
  }, [key])

  const setSyncedState = useCallback((value) => {
    setState((prev) => {
      const newValue = typeof value === 'function' ? value(prev) : value
      return newValue
    })
  }, [])

  return [state, setSyncedState]
}
