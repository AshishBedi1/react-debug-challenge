import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { addToCart } from '../store/slices/cartSlice'
import './HomePage.css'

const featuredProducts = [
  {
    id: 1,
    name: 'Classic White T-Shirt',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
    category: 'Clothing',
    description: 'Comfortable cotton t-shirt, perfect for everyday wear'
  },
  {
    id: 2,
    name: 'Smartphone Pro Max',
    price: 899.99,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop',
    category: 'Electronics',
    description: 'Latest smartphone with advanced features and camera'
  },
  {
    id: 3,
    name: 'Denim Jacket',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop',
    category: 'Clothing',
    description: 'Stylish denim jacket for all seasons'
  },
  {
    id: 4,
    name: 'Wireless Headphones',
    price: 149.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
    category: 'Electronics',
    description: 'Premium noise-cancelling wireless headphones'
  }
]

function HomePage() {
  const dispatch = useDispatch()
  const cartItems = useSelector((state) => state.cart.items)

  const handleAddToCart = (product) => {
    const existingItem = cartItems.find(item => item.id === product.id)
    
    dispatch(addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
      category: product.category
    }))

    if (existingItem) {
      toast.success(`Added another ${product.name} to cart!`, {
        position: "top-right",
        autoClose: 2000,
      })
    } else {
      toast.success(`${product.name} added to cart! 🛒`, {
        position: "top-right",
        autoClose: 2000,
      })
    }
  }

  return (
    <div className="homepage">
      {/* Hero Banner */}
      <div className="hero-banner">
        <div className="hero-content">
          <h1 className="hero-title">Welcome to Savyre Shop</h1>
          <p className="hero-subtitle">Discover amazing products at unbeatable prices</p>
          <Link to="/products" className="hero-cta-button">
            Shop Now
          </Link>
        </div>
      </div>

      {/* Featured Products Section */}
      <div className="featured-section">
        <div className="section-header">
          <h2>Featured Products</h2>
          <Link to="/products" className="view-all-link">View All Products →</Link>
        </div>
        <div className="products-grid">
          {featuredProducts.map(product => (
            <div key={product.id} className="product-card">
              <div className="product-image-container">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="product-image"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x400?text=Product+Image'
                  }}
                />
                <div className="product-category">{product.category}</div>
                <button 
                  className="quick-add-btn"
                  onClick={() => handleAddToCart(product)}
                  title="Add to cart"
                >
                  🛒
                </button>
              </div>
              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-description">{product.description}</p>
                <div className="product-footer">
                  <span className="product-price">${product.price.toFixed(2)}</span>
                  <button 
                    className="btn-add-to-cart"
                    onClick={() => handleAddToCart(product)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cart Summary Banner */}
      {cartItems.length > 0 && (
        <div className="cart-summary-banner">
          <div className="cart-summary-content">
            <div className="cart-summary-info">
              <span className="cart-icon">🛒</span>
              <div>
                <p className="cart-items-count">{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart</p>
                <p className="cart-total">Total: ${cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)}</p>
              </div>
            </div>
            <Link to="/cart" className="view-cart-button">
              View Cart
            </Link>
          </div>
        </div>
      )}

    </div>
  )
}

export default HomePage