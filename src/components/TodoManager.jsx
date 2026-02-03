import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  addTodo,
  toggleComplete,
  deleteTodo,
  updateTodo,
  setFilter,
  setEditingId,
  clearCompleted,
} from '../store/slices/todosSlice'
import './TodoManager.css'

function TodoManager() {
  const dispatch = useDispatch()
  const { items: todos, filter, editingId } = useSelector((state) => state.todos)
  const [todoInput, setTodoInput] = useState('')
  const [editValue, setEditValue] = useState('')

  const handleAddTodo = (e) => {
    e.preventDefault()
    const trimmedValue = todoInput.trim()
    if (trimmedValue === '') return

    dispatch(addTodo(trimmedValue))
    setTodoInput('')
  }

  const handleToggleComplete = (id) => {
    dispatch(toggleComplete(id))
  }

  const handleDeleteTodo = (id) => {
    dispatch(deleteTodo(id))
  }

  const handleStartEdit = (id, text) => {
    dispatch(setEditingId(id))
    setEditValue(text)
  }

  const handleSaveEdit = (id) => {
    const trimmedValue = editValue.trim()
    if (trimmedValue === '') {
      dispatch(deleteTodo(id))
      return
    }

    dispatch(updateTodo({ id, text: trimmedValue }))
    dispatch(setEditingId(null))
    setEditValue('')
  }

  const handleCancelEdit = () => {
    dispatch(setEditingId(null))
    setEditValue('')
  }

  const handleClearCompleted = () => {
    dispatch(clearCompleted())
  }

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed
    if (filter === 'completed') return todo.completed
    return true
  })

  const activeTodoCount = todos.filter(todo => !todo.completed).length
  const completedTodoCount = todos.filter(todo => todo.completed).length

  return (
    <div className="todo-manager">
      <div className="todo-container">
        <h1>📝 Task Manager</h1>
        
        <form onSubmit={handleAddTodo} className="todo-form">
          <input
            type="text"
            value={todoInput}
            onChange={(e) => setTodoInput(e.target.value)}
            placeholder="Add a new task..."
            className="todo-input"
          />
          <button type="submit" className="btn btn-primary">
            Add Task
          </button>
        </form>

        {todos.length > 0 && (
          <div className="filters">
            <button
              onClick={() => dispatch(setFilter('all'))}
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            >
              All ({todos.length})
            </button>
            <button
              onClick={() => dispatch(setFilter('active'))}
              className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
            >
              Active ({activeTodoCount})
            </button>
            <button
              onClick={() => dispatch(setFilter('completed'))}
              className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
            >
              Completed ({completedTodoCount})
            </button>
            {completedTodoCount > 0 && (
              <button onClick={handleClearCompleted} className="btn btn-clear">
                Clear Completed
              </button>
            )}
          </div>
        )}

        <div className="todo-list">
          {filteredTodos.length === 0 ? (
            <div className="empty-state">
              {todos.length === 0 
                ? 'No tasks yet. Add one above!'
                : `No ${filter} tasks.`
              }
            </div>
          ) : (
            filteredTodos.map(todo => (
              <div key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                {editingId === todo.id ? (
                  <div className="edit-mode">
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveEdit(todo.id)
                        if (e.key === 'Escape') handleCancelEdit()
                      }}
                      className="edit-input"
                      autoFocus
                    />
                    <button onClick={() => handleSaveEdit(todo.id)} className="btn btn-save">
                      Save
                    </button>
                    <button onClick={handleCancelEdit} className="btn btn-cancel">
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => handleToggleComplete(todo.id)}
                      className="todo-checkbox"
                    />
                    <span className="todo-text" onDoubleClick={() => handleStartEdit(todo.id, todo.text)}>
                      {todo.text}
                    </span>
                    <div className="todo-actions">
                      <button onClick={() => handleStartEdit(todo.id, todo.text)} className="btn btn-edit">
                        Edit
                      </button>
                      <button onClick={() => handleDeleteTodo(todo.id)} className="btn btn-delete">
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default TodoManager