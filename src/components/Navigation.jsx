import { Link, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { FaHome, FaShoppingBag, FaTasks, FaEnvelope, FaShoppingCart, FaSun, FaMoon } from 'react-icons/fa'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'
import './Navigation.css'

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
        <div className="navbar-links">
          <Link
            to="/"
            className={`navbar-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            <span className="navbar-icon"><FaHome size={18} /></span>
            <span>Home</span>
          </Link>
          <Link
            to="/products"
            className={`navbar-link ${location.pathname === '/products' ? 'active' : ''}`}
          >
            <span className="navbar-icon"><FaShoppingBag size={18} /></span>
            <span>Shop</span>
          </Link>
          <Link
            to="/todos"
            className={`navbar-link ${location.pathname === '/todos' ? 'active' : ''}`}
          >
            <span className="navbar-icon"><FaTasks size={18} /></span>
            <span>Tasks</span>
          </Link>
          <Link
            to="/contact"
            className={`navbar-link ${location.pathname === '/contact' ? 'active' : ''}`}
          >
            <span className="navbar-icon"><FaEnvelope size={18} /></span>
            <span>Contact</span>
          </Link>
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
    </nav>
  )
}

export default Navigation