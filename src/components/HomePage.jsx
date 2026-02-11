import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useCart } from '../hooks/useCart'
import ProductCard from './ProductCard'
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
  const { cartItems, addToCart } = useCart()
  const [promoMessage, setPromoMessage] = useState(null)

  useEffect(() => {
    let cancelled = false
    async function loadPromo() {
      const res = await fetch('https://jsonplaceholder.typicode.com/posts/1')
      const data = await res.json()
      if (!cancelled) setPromoMessage(data.title)
    }
    loadPromo()
  }, [])

  useEffect(() => {
    async function loadUser() {
      const res = await fetch('https://jsonplaceholder.typicode.com/users/1')
      const user = await res.json()
      setPromoMessage((prev) => (prev ? `${prev} • Hi ${user.name}` : `Hi ${user.name}`))
    }
    loadUser()
  }, [])

  const handleAddToCart = (product) => {
    const existingItem = cartItems.find(item => item.id === product.id)
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
      category: product.category
    })
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
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
            />
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