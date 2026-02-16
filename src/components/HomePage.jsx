import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useCart } from '../hooks/useCart'
import { useAuth } from '../context/AuthContext'
import { useApi } from '../context/ApiContext'
import { useTranslation } from '../hooks/useTranslation'
import ProductCard from './ProductCard'
import './HomePage.css'

function UserGreeting() {
  const { user } = useAuth()
  const { t } = useTranslation()
  if (!user) return null
  return (
    <p className="hero-promo" style={{ marginTop: '8px', fontSize: '14px', opacity: 0.9 }}>
      {t('home_welcomeBack', { name: user.name })}
    </p>
  )
}

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
  const { baseUrl } = useApi()
  const { t } = useTranslation()
  const [promoMessage, setPromoMessage] = useState(null)

  useEffect(() => {
    let cancelled = false
    async function loadPromo() {
      try {
        const res = await fetch(`${baseUrl}/posts/1`)
        const data = await res.json()
        if (!cancelled) setPromoMessage(data.title)
      } catch {
        if (!cancelled) setPromoMessage(null)
      }
    }
    loadPromo()
    return () => { cancelled = true }
  }, [baseUrl])

  useEffect(() => {
    let cancelled = false
    async function loadUser() {
      try {
        const res = await fetch(`${baseUrl}/users/1`)
        const user = await res.json()
        if (!cancelled) setPromoMessage((prev) => (prev ? `${prev} • Hi ${user.name}` : `Hi ${user.name}`))
      } catch {
        if (!cancelled) setPromoMessage((prev) => prev || null)
      }
    }
    loadUser()
    return () => { cancelled = true }
  }, [baseUrl])

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
      toast.success(t('products_addedAnother', { name: product.name }), {
        position: "top-right",
        autoClose: 2000,
      })
    } else {
      toast.success(`${t('products_addedToCart', { name: product.name })} 🛒`, {
        position: "top-right",
        autoClose: 2000,
      })
    }
  }

  const cartCount = cartItems.length
  const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)

  return (
    <div className="homepage">
      <div className="hero-banner">
        <div className="hero-content">
          <h1 className="hero-title">{t('home_heroTitle')}</h1>
          <p className="hero-subtitle">{t('home_heroSubtitle')}</p>
          <UserGreeting />
          <Link to="/products" className="hero-cta-button">
            {t('home_shopNow')}
          </Link>
        </div>
      </div>

      <div className="featured-section">
        <div className="section-header">
          <h2>{t('home_featuredProducts')}</h2>
          <Link to="/products" className="view-all-link">{t('home_viewAll')}</Link>
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

      {cartItems.length > 0 && (
        <div className="cart-summary-banner">
          <div className="cart-summary-content">
            <div className="cart-summary-info">
              <span className="cart-icon">🛒</span>
              <div>
                <p className="cart-items-count">
                  {cartCount} {cartCount === 1 ? t('cart_item') : t('cart_items')} in your cart
                </p>
                <p className="cart-total">{t('home_total')}: ${cartTotal}</p>
              </div>
            </div>
            <Link to="/cart" className="view-cart-button">
              {t('home_viewCart')}
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

export default HomePage
