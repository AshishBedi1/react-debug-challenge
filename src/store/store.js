import { configureStore } from '@reduxjs/toolkit'
import todosReducer from './slices/todosSlice'
import cartReducer from './slices/cartSlice'

export const store = configureStore({
  reducer: {
    todos: todosReducer,
    cart: cartReducer,
  },
})