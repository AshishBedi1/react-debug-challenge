import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import './HomePage.css'

function HomePage() {
  const todos = useSelector((state) => state.todos.items)
  const cartItems = useSelector((state) => state.cart.items)

  const activeTodos = todos.filter(todo => !todo.completed).length
  const completedTodos = todos.filter(todo => todo.completed).length
  const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)

  return (
    <div className="homepage">
      <div className="homepage-hero">
        <h1>Welcome to Task & Shop</h1>
        <p className="hero-subtitle">Manage your tasks and shopping in one place</p>
      </div>

      <div className="homepage-cards">
        <Link to="/todos" className="homepage-card todo-card">
          <div className="card-icon">📝</div>
          <h2>Task Manager</h2>
          <p>Organize and track your tasks efficiently</p>
          <div className="card-stats">
            <div className="stat">
              <span className="stat-label">Total Tasks</span>
              <span className="stat-value">{todos.length}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Active</span>
              <span className="stat-value">{activeTodos}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Completed</span>
              <span className="stat-value">{completedTodos}</span>
            </div>
          </div>
          <button className="card-button">Go to Tasks →</button>
        </Link>

        <Link to="/cart" className="homepage-card cart-card">
          <div className="card-icon">🛒</div>
          <h2>Shopping Cart</h2>
          <p>Manage your shopping items and calculate totals</p>
          <div className="card-stats">
            <div className="stat">
              <span className="stat-label">Items in Cart</span>
              <span className="stat-value">{cartItems.length}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Total Value</span>
              <span className="stat-value">${cartTotal.toFixed(2)}</span>
            </div>
          </div>
          <button className="card-button">Go to Cart →</button>
        </Link>
      </div>

      <div className="homepage-features">
        <h2>Features</h2>
        <div className="features-grid">
          <div className="feature">
            <div className="feature-icon">✅</div>
            <h3>Task Management</h3>
            <p>Add, edit, delete, and organize your tasks with filters</p>
          </div>
          <div className="feature">
            <div className="feature-icon">🛍️</div>
            <h3>Shopping Cart</h3>
            <p>Add items, manage quantities, and calculate totals with tax</p>
          </div>
          <div className="feature">
            <div className="feature-icon">💾</div>
            <h3>Auto Save</h3>
            <p>All your data is automatically saved to localStorage</p>
          </div>
          <div className="feature">
            <div className="feature-icon">📱</div>
            <h3>Responsive Design</h3>
            <p>Works seamlessly on desktop, tablet, and mobile devices</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage