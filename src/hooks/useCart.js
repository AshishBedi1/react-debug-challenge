import { useDispatch, useSelector } from 'react-redux'
import {
  addToCart as addToCartAction,
  updateQuantity,
  removeFromCart,
  clearCart,
} from '../store/slices/cartSlice'

export function useCart() {
  const dispatch = useDispatch()
  const items = useSelector((state) => state.cart.items)
  const count = items.reduce((total, item) => total + item.quantity, 0)
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return {
    cartItems: items,
    cartCount: count,
    cartTotal: total,
    addToCart: (payload) => dispatch(addToCartAction(payload)),
    updateQuantity: (payload) => dispatch(updateQuantity(payload)),
    removeFromCart: (id) => dispatch(removeFromCart(id)),
  }
}
