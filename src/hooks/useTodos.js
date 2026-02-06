import { useDispatch, useSelector } from 'react-redux'
import {
  addTodo,
  toggleComplete,
  deleteTodo,
  updateTodo,
  setFilter,
  setEditingId,
  clearCompleted,
} from '../store/slices/todosSlice'

export function useTodos() {
  const dispatch = useDispatch()
  const { items: todos, filter, editingId } = useSelector((state) => state.todos)

  return {
    todos,
    filter,
    editingId,
    addTodo: (text) => dispatch(addTodo(text)),
    toggleComplete: (id) => dispatch(toggleComplete(id)),
    deleteTodo: (id) => dispatch(deleteTodo(id)),
    updateTodo: (payload) => dispatch(updateTodo(payload)),
    setFilter: (value) => dispatch(setFilter(value)),
    setEditingId: (id) => dispatch(setEditingId(id)),
    clearCompleted: () => dispatch(clearCompleted()),
  }
}
