import { Link, useLocation } from 'react-router-dom'
import './Navigation.css'

function Navigation() {
  const location = useLocation()

  return (
    <nav className="navigation">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <h2>Task & Shop</h2>
        </Link>
        <div className="nav-links">
          <Link
            to="/"
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            Home
          </Link>
          <Link
            to="/todos"
            className={`nav-link ${location.pathname === '/todos' ? 'active' : ''}`}
          >
            📝 Tasks
          </Link>
          <Link
            to="/cart"
            className={`nav-link ${location.pathname === '/cart' ? 'active' : ''}`}
          >
            🛒 Cart
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navigation