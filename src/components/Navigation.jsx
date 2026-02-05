import { Link, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import './Navigation.css'

function Navigation() {
  const location = useLocation()
  const cartItems = useSelector((state) => state.cart.items)
  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0)

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <h2>Savyre Shop</h2>
        </Link>
        <div className="navbar-links">
          <Link
            to="/"
            className={`navbar-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            <span className="navbar-icon">🏠</span>
            <span>Home</span>
          </Link>
          <Link
            to="/products"
            className={`navbar-link ${location.pathname === '/products' ? 'active' : ''}`}
          >
            <span className="navbar-icon">🛍️</span>
            <span>Shop</span>
          </Link>
          <Link
            to="/todos"
            className={`navbar-link ${location.pathname === '/todos' ? 'active' : ''}`}
          >
            <span className="navbar-icon">📝</span>
            <span>Tasks</span>
          </Link>
          <Link
            to="/cart"
            className={`navbar-link cart-link ${location.pathname === '/cart' ? 'active' : ''}`}
          >
            <span className="navbar-icon">🛒</span>
            <span>Cart</span>
            {cartItemCount > 0 && (
              <span className="cart-badge">{cartItemCount}</span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navigation