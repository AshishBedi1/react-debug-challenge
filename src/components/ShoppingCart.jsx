import { Link } from 'react-router-dom'
import { useState, useReducer } from 'react'
import { toast } from 'react-toastify'
import { useCart } from '../hooks/useCart'
import './ShoppingCart.css'

function couponReducer(state, action) {
  if (action.type === 'APPLY') {
    return { ...state, discount: 10, code: action.code }
  }
  if (action.type === 'CLEAR') {
    return { discount: 0, code: '' }
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

  const [couponState, dispatchCoupon] = useReducer(couponReducer, { discount: 0, code: '' })
  const [couponInput, setCouponInput] = useState('')

  const handleUpdateQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) {
      const item = cartItems.find(item => item.id === id)
      removeFromCart(id)
      if (item) {
        toast.info(`${item.name} removed from cart`, {
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
      toast.info(`${item.name} removed from cart`, {
        position: "top-right",
        autoClose: 2000,
      })
    }
  }

  const handleClearCart = () => {
    clearCart()
    toast.warning('Cart cleared', {
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
          <h1>🛒 Shopping Cart</h1>
          {cartItems.length > 0 && (
            <span className="cart-count">{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}</span>
          )}
        </div>

        <div className="cart-content">
          {cartItems.length === 0 ? (
            <div className="empty-cart">
              <div className="empty-cart-icon">🛒</div>
              <h2>Your cart is empty</h2>
              <p>Start shopping to add items to your cart</p>
              <Link to="/products" className="btn btn-primary btn-shop-now">
                Shop Now
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
                        <span className="cart-item-unit-price">${item.price.toFixed(2)} each</span>
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
                    ← Continue Shopping
                  </Link>
                  <button onClick={handleClearCart} className="btn-clear-cart">
                    Clear Cart
                  </button>
                </div>
                
                <div className="cart-summary">
                  <div className="coupon-row" style={{ marginBottom: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <input
                      type="text"
                      placeholder="Coupon code"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      style={{ padding: '8px', flex: 1, minWidth: '120px' }}
                    />
                    <button
                      type="button"
                      className="btn-continue-shopping"
                      onClick={() => dispatchCoupon({ type: 'APPLY', code: couponInput })}
                    >
                      Apply
                    </button>
                    {couponState.code && (
                      <span style={{ alignSelf: 'center', fontSize: '14px' }}>
                        {couponState.code} (−${couponState.discount})
                      </span>
                    )}
                  </div>
                  <div className="summary-row">
                    <span>Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items):</span>
                    <span>${calculateSubtotal().toFixed(2)}</span>
                  </div>
                  <div className="summary-row">
                    <span>Shipping:</span>
                    <span>Free</span>
                  </div>
                  <div className="summary-row">
                    <span>Tax (10%):</span>
                    <span>${(calculateSubtotal() * 0.1).toFixed(2)}</span>
                  </div>
                  {couponState.discount > 0 && (
                    <div className="summary-row">
                      <span>Discount:</span>
                      <span>−${couponState.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="summary-row total-row">
                    <span>Total:</span>
                    <span>${calculateTotal().toFixed(2)}</span>
                  </div>
                  <button className="btn-checkout">
                    Proceed to Checkout
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
