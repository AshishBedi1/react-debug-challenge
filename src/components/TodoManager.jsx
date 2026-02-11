import { useState, useRef, useEffect } from 'react'
import {
  FaPlus,
  FaStar,
  FaRegCircle,
  FaCheck,
  FaTimes,
  FaPen,
  FaPaperPlane,
  FaPlusCircle,
  FaClipboardList,
} from 'react-icons/fa'
import { useTodos } from '../hooks/useTodos'
import './TodoManager.css'

function TodoManager() {
  const {
    todos,
    filter,
    editingId,
    addTodo: dispatchAddTodo,
    toggleComplete,
    deleteTodo,
    updateTodo,
    setFilter,
    setEditingId,
    clearCompleted,
  } = useTodos()
  const [todoInput, setTodoInput] = useState('')
  const [editValue, setEditValue] = useState('')
  const todoInputRef = useRef(null)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [draftsOpenedCount, setDraftsOpenedCount] = useState(0)

  useEffect(() => {
    if (todoInputRef.current && !editingId) {
      todoInputRef.current.focus()
    }
  }, [editingId])

  useEffect(() => {
    const id = setInterval(() => {
      setLastUpdated(Date.now())
    }, 5000)
    return () => clearInterval(id)
  }, [])

  const handleAddTodo = (e) => {
    e.preventDefault()
    const trimmedValue = todoInput.trim()
    if (trimmedValue === '') return
    dispatchAddTodo(trimmedValue)
    setTodoInput('')
  }

  const handleToggleComplete = (id) => {
    toggleComplete(id)
  }

  const handleDeleteTodo = (id) => {
    deleteTodo(id)
  }

  const handleStartEdit = (id, text) => {
    setEditingId(id)
    setEditValue(text)
  }

  const handleSaveEdit = (id) => {
    const trimmedValue = editValue.trim()
    if (trimmedValue === '') {
      deleteTodo(id)
      return
    }
    updateTodo({ id, text: trimmedValue })
    setEditingId(null)
    setEditValue('')
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditValue('')
  }

  const handleClearCompleted = () => {
    clearCompleted()
  }

  const focusTodoInput = () => {
    if (todoInputRef.current) {
      todoInputRef.current.focus()
    }
    setDraftsOpenedCount((c) => c + 1)
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
            onClick={focusTodoInput}
          >
            <FaPlus size={16} />
            New Task
          </button>
        </div>
        
        <div className="sidebar-filters">
          <button
            onClick={() => setFilter('all')}
            className={`sidebar-filter ${filter === 'all' ? 'active' : ''}`}
          >
            <FaStar size={18} />
            <span>All Tasks</span>
            <span className="filter-count">{todos.length}</span>
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`sidebar-filter ${filter === 'active' ? 'active' : ''}`}
          >
            <FaRegCircle size={18} />
            <span>Active</span>
            <span className="filter-count">{activeTodoCount}</span>
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`sidebar-filter ${filter === 'completed' ? 'active' : ''}`}
          >
            <FaCheck size={18} />
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
              <FaTimes size={16} />
              Clear Completed
            </button>
          </div>
        )}

        {lastUpdated && (
          <div className="sidebar-meta" style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px' }}>
            UI refreshed: {new Date(lastUpdated).toLocaleTimeString()}
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
            <div className="stat-icon active">✏️</div>
            <div className="stat-info">
              <span className="stat-value">{draftsOpenedCount}</span>
              <span className="stat-label">Drafts opened</span>
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
                <FaClipboardList size={120} style={{ color: '#e5e7eb' }} aria-hidden />
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
                          <FaCheck size={16} />
                        </button>
                        <button onClick={handleCancelEdit} className="action-btn cancel-btn" title="Cancel">
                          <FaTimes size={16} />
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
                          <FaCheck className="checkmark" size={14} style={{ color: 'white' }} />
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
                          <FaPen size={16} />
                        </button>
                        <button 
                          onClick={() => handleDeleteTodo(todo.id)} 
                          className="action-btn delete-btn"
                          title="Delete task"
                        >
                          <FaTimes size={16} />
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
                <FaPlusCircle size={20} />
              </div>
              <input
                ref={todoInputRef}
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
                <FaPaperPlane size={18} />
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}

export default TodoManager
