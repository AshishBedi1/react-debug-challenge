import { Link, useLocation } from 'react-router-dom'
import './Navigation.css'

function Navigation() {
  const location = useLocation()

  return (
    <aside className="sidebar">
      <div className="sidebar-content">
        <Link to="/" className="sidebar-logo">
          <h2>Savyre Task</h2>
        </Link>
        <nav className="sidebar-nav">
          <Link
            to="/"
            className={`sidebar-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            <span className="sidebar-icon">🏠</span>
            <span>Home</span>
          </Link>
          <Link
            to="/todos"
            className={`sidebar-link ${location.pathname === '/todos' ? 'active' : ''}`}
          >
            <span className="sidebar-icon">📝</span>
            <span>Tasks</span>
          </Link>
          <Link
            to="/cart"
            className={`sidebar-link ${location.pathname === '/cart' ? 'active' : ''}`}
          >
            <span className="sidebar-icon">🛒</span>
            <span>Cart</span>
          </Link>
        </nav>
      </div>
    </aside>
  )
}

export default Navigation