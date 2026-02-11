import { createSlice } from '@reduxjs/toolkit'

const loadTodosFromStorage = () => {
  try {
    const savedTodos = localStorage.getItem('todos')
    return savedTodos ? JSON.parse(savedTodos) : []
  } catch (error) {
    console.error('Error loading todos from localStorage:', error)
    return []
  }
}

const initialState = {
  items: loadTodosFromStorage(),
  filter: 'all',
  editingId: null,
}

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: (state, action) => {
      const newTodo = {
        id: Date.now(),
        text: action.payload,
        completed: false,
        createdAt: new Date().toISOString(),
      }
      state.items.push(newTodo)
      localStorage.setItem('todos', JSON.stringify(state.items))
    },
    toggleComplete: (state, action) => {
      const todo = state.items.find(todo => todo.id === action.payload)
      if (todo) {
        todo.completed = !todo.completed
        localStorage.setItem('todos', JSON.stringify(state.items))
      }
    },
    deleteTodo: (state, action) => {
      state.items = state.items.filter(todo => todo.id !== action.payload)
      localStorage.setItem('todos', JSON.stringify(state.items))
    },
    updateTodo: (state, action) => {
      const { id, text } = action.payload
      const todo = state.items.find(todo => todo.id === id)
      if (todo) {
        todo.text = text
        localStorage.setItem('todos', JSON.stringify(state.items))
      }
    },
    setFilter: (state, action) => {
      state.filter = action.payload
    },
    setEditingId: (state, action) => {
      state.editingId = action.payload
    },
    clearCompleted: (state) => {
      state.items = state.items.filter(todo => !todo.completed)
      localStorage.setItem('todos', JSON.stringify(state.items))
    },
  },
})

export const {
  addTodo,
  toggleComplete,
  deleteTodo,
  updateTodo,
  setFilter,
  setEditingId,
  clearCompleted,
} = todosSlice.actions

export default todosSlice.reducer
