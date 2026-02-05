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
  const completionRate = todos.length > 0 ? Math.round((completedTodoCount / todos.length) * 100) : 0

  return (
    <div className="todo-manager">
      {/* Left Sidebar */}
      <aside className="todo-sidebar">
        <div className="sidebar-header">
          <div className="logo-section">
            <div className="logo-icon">✓</div>
            <h2>Tasks</h2>
          </div>
          <button 
            className="new-task-btn"
            onClick={() => {
              const input = document.querySelector('.todo-input')
              if (input) input.focus()
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 3V13M3 8H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            New Task
          </button>
        </div>
        
        <div className="sidebar-filters">
          <button
            onClick={() => dispatch(setFilter('all'))}
            className={`sidebar-filter ${filter === 'all' ? 'active' : ''}`}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M9 1L11.5 6.5L17 8L11.5 9.5L9 15L6.5 9.5L1 8L6.5 6.5L9 1Z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
            </svg>
            <span>All Tasks</span>
            <span className="filter-count">{todos.length}</span>
          </button>
          <button
            onClick={() => dispatch(setFilter('active'))}
            className={`sidebar-filter ${filter === 'active' ? 'active' : ''}`}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.5" fill="none"/>
            </svg>
            <span>Active</span>
            <span className="filter-count">{activeTodoCount}</span>
          </button>
          <button
            onClick={() => dispatch(setFilter('completed'))}
            className={`sidebar-filter ${filter === 'completed' ? 'active' : ''}`}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M5 9L8 12L13 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Completed</span>
            <span className="filter-count">{completedTodoCount}</span>
          </button>
        </div>

        {/* Progress Section */}
        <div className="progress-section">
          <div className="progress-header">
            <span className="progress-label">Progress</span>
            <span className="progress-percentage">{completionRate}%</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${completionRate}%` }}
            ></div>
          </div>
        </div>

        {completedTodoCount > 0 && (
          <div className="sidebar-actions">
            <button onClick={handleClearCompleted} className="clear-completed-btn">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M4 4L12 12M4 12L12 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Clear Completed
            </button>
          </div>
        )}

        <div className="sidebar-stats">
          <div className="stat-card">
            <div className="stat-icon total">📋</div>
            <div className="stat-info">
              <span className="stat-value">{todos.length}</span>
              <span className="stat-label">Total Tasks</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon active">⚡</div>
            <div className="stat-info">
              <span className="stat-value">{activeTodoCount}</span>
              <span className="stat-label">Active</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon completed">✅</div>
            <div className="stat-info">
              <span className="stat-value">{completedTodoCount}</span>
              <span className="stat-label">Completed</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="todo-main">
        <div className="todo-header">
          <div>
            <h1>
              {filter === 'all' && 'All Tasks'}
              {filter === 'active' && 'Active Tasks'}
              {filter === 'completed' && 'Completed Tasks'}
            </h1>
            <p className="todo-subtitle">
              {filter === 'all' && `${todos.length} tasks in total`}
              {filter === 'active' && `${activeTodoCount} tasks to complete`}
              {filter === 'completed' && `${completedTodoCount} tasks completed`}
            </p>
          </div>
        </div>

        <div className="todo-list-container">
          {filteredTodos.length === 0 ? (
            <div className="empty-state">
              <div className="empty-illustration">
                <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
                  <circle cx="60" cy="60" r="50" stroke="#e5e7eb" strokeWidth="2" strokeDasharray="4 4"/>
                  <path d="M40 60L55 75L80 45" stroke="#600EE4" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" opacity="0.3"/>
                </svg>
              </div>
              <h2>No tasks found</h2>
              <p>{todos.length === 0 
                ? 'Create your first task to get started'
                : `No ${filter} tasks available.`
              }</p>
            </div>
          ) : (
            <div className="todo-list">
              {filteredTodos.map((todo, index) => (
                <div 
                  key={todo.id} 
                  className={`todo-item ${todo.completed ? 'completed' : ''}`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
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
                      <div className="edit-actions">
                        <button onClick={() => handleSaveEdit(todo.id)} className="action-btn save-btn" title="Save">
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M13 4L6 11L3 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                        <button onClick={handleCancelEdit} className="action-btn cancel-btn" title="Cancel">
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M4 4L12 12M4 12L12 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="todo-checkbox-wrapper">
                        <input
                          type="checkbox"
                          checked={todo.completed}
                          onChange={() => handleToggleComplete(todo.id)}
                          className="todo-checkbox"
                          id={`todo-${todo.id}`}
                        />
                        <label htmlFor={`todo-${todo.id}`} className="checkbox-label">
                          <svg className="checkmark" width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M3 7L6 10L11 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </label>
                      </div>
                      <div className="todo-content">
                        <span 
                          className="todo-text" 
                          onDoubleClick={() => handleStartEdit(todo.id, todo.text)}
                        >
                          {todo.text}
                        </span>
                        <div className="todo-meta">
                          <span className="todo-date">
                            {new Date(todo.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                      </div>
                      <div className="todo-actions">
                        <button 
                          onClick={() => handleStartEdit(todo.id, todo.text)} 
                          className="action-btn edit-btn"
                          title="Edit task"
                        >
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M11.5 2.5L13.5 4.5M2 14L10.5 5.5L12.5 7.5L4 16H2V14Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                        <button 
                          onClick={() => handleDeleteTodo(todo.id)} 
                          className="action-btn delete-btn"
                          title="Delete task"
                        >
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M4 4L12 12M4 12L12 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                          </svg>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="todo-input-container">
          <form onSubmit={handleAddTodo} className="todo-input-form">
            <div className="input-wrapper">
              <div className="input-icon">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                  <path d="M10 6V14M6 10H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <input
                type="text"
                value={todoInput}
                onChange={(e) => setTodoInput(e.target.value)}
                placeholder="Add a new task..."
                className="todo-input"
              />
              <button 
                type="submit" 
                className="send-button"
                disabled={!todoInput.trim()}
                title="Add task"
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M16 2L9 9M16 2L10 16L9 9M16 2L2 7L9 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}

export default TodoManager
