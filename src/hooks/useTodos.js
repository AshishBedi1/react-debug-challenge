import { useMemo, useCallback } from 'react'
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
  const { items: allTodos, filter, editingId } = useSelector((state) => state.todos)

  const todos = useMemo(() => {
    if (filter === 'active') return allTodos.filter(t => !t.completed)
    if (filter === 'completed') return allTodos.filter(t => t.completed)
    return allTodos
  }, [allTodos, filter])

  return {
    todos,
    filter,
    editingId,
    addTodo: useCallback((text) => dispatch(addTodo(text)), [dispatch]),
    toggleComplete: useCallback((id) => dispatch(toggleComplete(id)), [dispatch]),
    deleteTodo: useCallback((id) => dispatch(deleteTodo(id)), [dispatch]),
    updateTodo: useCallback((payload) => dispatch(updateTodo(payload)), [dispatch]),
    setFilter: useCallback((value) => dispatch(setFilter(value)), [dispatch]),
    setEditingId: useCallback((id) => dispatch(setEditingId(id)), [dispatch]),
    clearCompleted: useCallback(() => dispatch(clearCompleted()), [dispatch]),
  }
}
