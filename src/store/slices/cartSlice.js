import { createSlice } from '@reduxjs/toolkit'

const loadCartFromStorage = () => {
  try {
    const savedCart = localStorage.getItem('cartItems')
    return savedCart ? JSON.parse(savedCart) : []
  } catch (error) {
    console.error('Error loading cart from localStorage:', error)
    return []
  }
}

const initialState = {
  items: loadCartFromStorage(),
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { id, name, price, quantity, image, category } = action.payload
      const existingItem = state.items.find(item => item.id === id)
      if (existingItem) {
        existingItem.quantity += quantity || 1
      } else {
        state.items.push({
          id: id || Date.now(),
          name,
          price,
          quantity: quantity || 1,
          image: image || '',
          category: category || '',
        })
      }
      localStorage.setItem('cartItems', JSON.stringify(state.items))
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload
      const item = state.items.find(item => item.id === id)
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter(item => item.id !== id)
        } else {
          item.quantity = quantity
        }
        localStorage.setItem('cartItems', JSON.stringify(state.items))
      }
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload)
      localStorage.setItem('cartItems', JSON.stringify(state.items))
    },
    clearCart: (state) => {
      state.items = []
      localStorage.setItem('cartItems', JSON.stringify(state.items))
    },
  },
})

export const {
  addToCart,
  updateQuantity,
  removeFromCart,
  clearCart,
} = cartSlice.actions

export default cartSlice.reducer
