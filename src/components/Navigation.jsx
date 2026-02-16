import { Link, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import {
  FaHome, FaShoppingBag, FaTasks, FaEnvelope, FaShoppingCart,
  FaSun, FaMoon, FaChartBar, FaUsers, FaBlog, FaNewspaper,
  FaCog, FaDatabase, FaClipboardList, FaColumns, FaBalanceScale
} from 'react-icons/fa'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'
import { useTranslation } from '../hooks/useTranslation'
import './Navigation.css'

const navLinks = [
  { path: '/', labelKey: 'nav_home', icon: FaHome },
  { path: '/dashboard', labelKey: 'nav_dashboard', icon: FaChartBar },
  { path: '/products', labelKey: 'nav_shop', icon: FaShoppingBag },
  { path: '/users', labelKey: 'nav_users', icon: FaUsers },
  { path: '/todos', labelKey: 'nav_tasks', icon: FaTasks },
  { path: '/task-board', labelKey: 'nav_taskBoard', icon: FaColumns },
  { path: '/blog', labelKey: 'nav_blog', icon: FaBlog },
  { path: '/news', labelKey: 'nav_news', icon: FaNewspaper },
  { path: '/data-explorer', labelKey: 'nav_explorer', icon: FaDatabase },
  { path: '/compare', labelKey: 'nav_compare', icon: FaBalanceScale },
  { path: '/register', labelKey: 'nav_register', icon: FaClipboardList },
  { path: '/settings', labelKey: 'nav_settings', icon: FaCog },
  { path: '/contact', labelKey: 'nav_contact', icon: FaEnvelope },
]

function Navigation() {
  const location = useLocation()
  const { toggleTheme, isDark, themeLabel } = useTheme()
  const { userDisplayName } = useAuth()
  const { t } = useTranslation()
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
            <span>{t('nav_cart')}</span>
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
                <span>{t(link.labelKey)}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}

export default Navigation
