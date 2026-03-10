import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function PrivateRoute() {
  const { isAuthenticated, loading } = useAuth()

  if (loading) return null
  if (!isAuthenticated) return <Navigate to="/" replace />

  return <Outlet />
}

export default PrivateRoute
