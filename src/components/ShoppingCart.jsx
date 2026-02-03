import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  addToCart,
  updateQuantity,
  removeFromCart,
  clearCart,
} from '../store/slices/cartSlice'
import './ShoppingCart.css'

function ShoppingCart() {
  const dispatch = useDispatch()
  const cartItems = useSelector((state) => state.cart.items)
  const [itemName, setItemName] = useState('')
  const [itemPrice, setItemPrice] = useState('')
  const [itemQuantity, setItemQuantity] = useState('1')

  const handleAddToCart = (e) => {
    e.preventDefault()
    const trimmedName = itemName.trim()
    const price = parseFloat(itemPrice)
    const quantity = parseInt(itemQuantity) || 1

    if (trimmedName === '' || isNaN(price) || price <= 0) return

    dispatch(addToCart({ name: trimmedName, price, quantity }))
    setItemName('')
    setItemPrice('')
    setItemQuantity('1')
  }

  const handleUpdateQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) {
      dispatch(removeFromCart(id))
      return
    }
    dispatch(updateQuantity({ id, quantity: newQuantity }))
  }

  const handleRemoveFromCart = (id) => {
    dispatch(removeFromCart(id))
  }

  const handleClearCart = () => {
    dispatch(clearCart())
  }

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const calculateTotal = () => {
    const subtotal = calculateSubtotal()
    const tax = subtotal * 0.1 // 10% tax
    return subtotal + tax
  }

  return (
    <div className="shopping-cart">
      <div className="cart-container">
        <h1>🛒 Shopping Cart</h1>
        
        <form onSubmit={handleAddToCart} className="cart-form">
          <input
            type="text"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            placeholder="Item name"
            className="cart-input"
          />
          <input
            type="number"
            value={itemPrice}
            onChange={(e) => setItemPrice(e.target.value)}
            placeholder="Price"
            step="0.01"
            min="0"
            className="cart-input"
          />
          <input
            type="number"
            value={itemQuantity}
            onChange={(e) => setItemQuantity(e.target.value)}
            placeholder="Quantity"
            min="1"
            className="cart-input quantity-input"
          />
          <button type="submit" className="btn btn-primary">
            Add to Cart
          </button>
        </form>

        {cartItems.length > 0 && (
          <button onClick={handleClearCart} className="btn btn-clear cart-clear">
            Clear Cart
          </button>
        )}

        <div className="cart-list">
          {cartItems.length === 0 ? (
            <div className="empty-state">
              Your cart is empty. Add items above!
            </div>
          ) : (
            <>
              {cartItems.map(item => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-info">
                    <span className="cart-item-name">{item.name}</span>
                    <span className="cart-item-price">${item.price.toFixed(2)} each</span>
                  </div>
                  <div className="cart-item-controls">
                    <button
                      onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                      className="btn btn-quantity"
                    >
                      -
                    </button>
                    <span className="cart-item-quantity">{item.quantity}</span>
                    <button
                      onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                      className="btn btn-quantity"
                    >
                      +
                    </button>
                    <span className="cart-item-total">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                    <button
                      onClick={() => handleRemoveFromCart(item.id)}
                      className="btn btn-delete"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
              <div className="cart-summary">
                <div className="summary-row">
                  <span>Subtotal:</span>
                  <span>${calculateSubtotal().toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Tax (10%):</span>
                  <span>${(calculateSubtotal() * 0.1).toFixed(2)}</span>
                </div>
                <div className="summary-row total-row">
                  <span>Total:</span>
                  <span>${calculateTotal().toFixed(2)}</span>
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