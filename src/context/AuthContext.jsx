import { createContext, useContext, useState, useEffect } from 'react'

const defaultAuth = { user: null, loading: false, login: () => {}, logout: () => {}, isAuthenticated: false, userDisplayName: 'Guest' }
const AuthContext = createContext(defaultAuth)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const devUser = import.meta.env.DEV ? { id: 1, email: 'dev@test.com', name: 'Dev User' } : null
    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : {}))
      .then((data) => setUser(data.user ?? devUser))
      .catch(() => setUser(devUser))
      .finally(() => setLoading(false))
  }, [])

  const login = (email) => {
    setLoading(true)
    setUser({ id: 1, email, name: email.split('@')[0] })
    setLoading(false)
  }

  const logout = () => setUser(null)

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
    userDisplayName: user?.name ?? 'Guest',
  }
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  return ctx
}
