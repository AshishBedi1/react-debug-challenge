import { Link, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import {
  FaHome, FaShoppingBag, FaTasks, FaEnvelope, FaShoppingCart,
  FaSun, FaMoon, FaChartBar, FaUsers, FaBlog, FaNewspaper,
  FaCog, FaDatabase, FaClipboardList, FaColumns, FaBalanceScale
} from 'react-icons/fa'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'
import './Navigation.css'

const navLinks = [
  { path: '/', label: 'Home', icon: FaHome },
  { path: '/dashboard', label: 'Dashboard', icon: FaChartBar },
  { path: '/products', label: 'Shop', icon: FaShoppingBag },
  { path: '/users', label: 'Users', icon: FaUsers },
  { path: '/todos', label: 'Tasks', icon: FaTasks },
  { path: '/task-board', label: 'Task Board', icon: FaColumns },
  { path: '/blog', label: 'Blog', icon: FaBlog },
  { path: '/news', label: 'News', icon: FaNewspaper },
  { path: '/data-explorer', label: 'Explorer', icon: FaDatabase },
  { path: '/compare', label: 'Compare', icon: FaBalanceScale },
  { path: '/register', label: 'Register', icon: FaClipboardList },
  { path: '/settings', label: 'Settings', icon: FaCog },
  { path: '/contact', label: 'Contact', icon: FaEnvelope },
]

function Navigation() {
  const location = useLocation()
  const { toggleTheme, isDark, themeLabel } = useTheme()
  const { userDisplayName } = useAuth()
  const cartItems = useSelector((state) => state.cart.items)
  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0)

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <h2>Savyre</h2>
        </Link>

        <div className="navbar-actions">
          <Link
            to="/cart"
            className={`navbar-link cart-link ${location.pathname === '/cart' ? 'active' : ''}`}
          >
            <span className="navbar-icon"><FaShoppingCart size={18} /></span>
            <span>Cart</span>
            {cartItemCount > 0 && (
              <span className="cart-badge">{cartItemCount}</span>
            )}
          </Link>
          <button
            type="button"
            className="theme-toggle"
            onClick={toggleTheme}
            title={themeLabel()}
            aria-label={themeLabel()}
          >
            {isDark ? <FaSun size={20} /> : <FaMoon size={20} />}
          </button>
        </div>
      </div>

      <div className="navbar-links-row">
        <div className="navbar-links">
          {navLinks.map((link) => {
            const Icon = link.icon
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`navbar-link ${location.pathname === link.path ? 'active' : ''}`}
              >
                <Icon size={14} />
                <span>{link.label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}

export default Navigation
