import { Link } from 'react-router-dom'
import { useState, useReducer } from 'react'
import { toast } from 'react-toastify'
import { useCart } from '../hooks/useCart'
import { useTranslation } from '../hooks/useTranslation'
import './ShoppingCart.css'

function couponReducer(state, action) {
  if (action.type === 'APPLY') {
    if (action.code.trim().toLowerCase() === 'test') {
      return { discount: 10, code: action.code.trim(), error: '' }
    }
    return { ...state, error: 'invalid' }
  }
  if (action.type === 'CLEAR') {
    return { discount: 0, code: '', error: '' }
  }
  return state
}

function ShoppingCart() {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart()
  const { t } = useTranslation()

  const [couponState, dispatchCoupon] = useReducer(couponReducer, { discount: 0, code: '', error: '' })
  const [couponInput, setCouponInput] = useState('')

  const handleUpdateQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) {
      const item = cartItems.find(item => item.id === id)
      removeFromCart(id)
      if (item) {
        toast.info(t('cart_removed', { name: item.name }), {
          position: "top-right",
          autoClose: 2000,
        })
      }
      return
    }
    updateQuantity({ id, quantity: newQuantity })
  }

  const handleRemoveFromCart = (id) => {
    const item = cartItems.find(item => item.id === id)
    removeFromCart(id)
    if (item) {
      toast.info(t('cart_removed', { name: item.name }), {
        position: "top-right",
        autoClose: 2000,
      })
    }
  }

  const handleClearCart = () => {
    clearCart()
    toast.warning(t('cart_cleared'), {
      position: "top-right",
      autoClose: 2000,
    })
  }

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const calculateTotal = () => {
    const subtotal = calculateSubtotal()
    const tax = subtotal * 0.1
    const afterDiscount = subtotal - couponState.discount
    return afterDiscount + tax
  }

  return (
    <div className="shopping-cart">
      <div className="cart-container">
        <div className="cart-header">
          <h1>🛒 {t('cart_title')}</h1>
          {cartItems.length > 0 && (
            <span className="cart-count">{cartItems.length} {cartItems.length === 1 ? t('cart_item') : t('cart_items')}</span>
          )}
        </div>

        <div className="cart-content">
          {cartItems.length === 0 ? (
            <div className="empty-cart">
              <div className="empty-cart-icon">🛒</div>
              <h2>{t('cart_empty')}</h2>
              <p>{t('cart_emptyDesc')}</p>
              <Link to="/products" className="btn btn-primary btn-shop-now">
                {t('cart_shopNow')}
              </Link>
            </div>
          ) : (
            <>
              <div className="cart-items-list">
                {cartItems.map(item => (
                  <div key={item.id} className="cart-item">
                    <div className="cart-item-image-container">
                      {item.image ? (
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="cart-item-image"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/150x150?text=Product'
                          }}
                        />
                      ) : (
                        <div className="cart-item-placeholder">📦</div>
                      )}
                    </div>
                    <div className="cart-item-details">
                      <h3 className="cart-item-name">{item.name}</h3>
                      {item.category && (
                        <span className="cart-item-category">{item.category}</span>
                      )}
                      <div className="cart-item-price-row">
                        <span className="cart-item-unit-price">${item.price.toFixed(2)} {t('cart_each')}</span>
                      </div>
                    </div>
                    <div className="cart-item-actions">
                      <div className="quantity-controls">
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          className="btn-quantity"
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="quantity-display">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          className="btn-quantity"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                      <div className="cart-item-total-price">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                      <button
                        onClick={() => handleRemoveFromCart(item.id)}
                        className="btn-remove"
                        aria-label="Remove item"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="cart-summary-section">
                <div className="cart-actions-top">
                  <Link to="/products" className="btn-continue-shopping">
                    {t('cart_continueShopping')}
                  </Link>
                  <button onClick={handleClearCart} className="btn-clear-cart">
                    {t('cart_clearCart')}
                  </button>
                </div>
                
                <div className="cart-summary">
                  <p style={{ fontSize: '13px', color: '#666', marginBottom: '8px' }}>
                    {t('cart_couponHint', { code: 'test', amount: '10' })}
                  </p>
                  <div className="coupon-row" style={{ marginBottom: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <input
                      type="text"
                      placeholder={t('cart_couponPlaceholder')}
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      style={{ padding: '8px', flex: 1, minWidth: '120px' }}
                    />
                    <button
                      type="button"
                      className="btn-continue-shopping"
                      onClick={() => {
                        dispatchCoupon({ type: 'APPLY', code: couponInput })
                        if (couponInput.trim().toLowerCase() === 'test') setCouponInput('')
                      }}
                    >
                      {t('cart_apply')}
                    </button>
                    {couponState.code && (
                      <span style={{ alignSelf: 'center', fontSize: '14px', color: '#16a34a' }}>
                        {t('cart_applied', { code: couponState.code, amount: couponState.discount })}
                      </span>
                    )}
                    {couponState.error && (
                      <span style={{ alignSelf: 'center', fontSize: '14px', color: '#dc2626' }}>
                        {t('cart_invalidCoupon')}
                      </span>
                    )}
                  </div>
                  <div className="summary-row">
                    <span>{t('cart_subtotal')} ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} {t('cart_items')}):</span>
                    <span>${calculateSubtotal().toFixed(2)}</span>
                  </div>
                  <div className="summary-row">
                    <span>{t('cart_shipping')}:</span>
                    <span>{t('cart_free')}</span>
                  </div>
                  <div className="summary-row">
                    <span>{t('cart_tax')}:</span>
                    <span>${(calculateSubtotal() * 0.1).toFixed(2)}</span>
                  </div>
                  {couponState.discount > 0 && (
                    <div className="summary-row">
                      <span>{t('cart_discount')}:</span>
                      <span>−${couponState.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="summary-row total-row">
                    <span>{t('cart_total')}:</span>
                    <span>${calculateTotal().toFixed(2)}</span>
                  </div>
                  <button className="btn-checkout">
                    {t('cart_checkout')}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ShoppingCart
