import { createContext, useContext, useState } from 'react'

const defaultAuth = { user: null, loading: false, login: () => {}, logout: () => {}, isAuthenticated: false, userDisplayName: 'Guest' }
const AuthContext = createContext(defaultAuth)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)

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
