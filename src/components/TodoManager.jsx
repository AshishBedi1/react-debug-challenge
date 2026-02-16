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
import { useTranslation } from '../hooks/useTranslation'
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
  const { t } = useTranslation()
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
      <aside className="todo-sidebar">
        <div className="sidebar-header">
          <div className="logo-section">
            <div className="logo-icon">✓</div>
            <h2>{t('todos_title')}</h2>
          </div>
          <button 
            className="new-task-btn"
            onClick={focusTodoInput}
          >
            <FaPlus size={16} />
            {t('todos_newTask')}
          </button>
        </div>
        
        <div className="sidebar-filters">
          <button
            onClick={() => setFilter('all')}
            className={`sidebar-filter ${filter === 'all' ? 'active' : ''}`}
          >
            <FaStar size={18} />
            <span>{t('todos_allTasks')}</span>
            <span className="filter-count">{todos.length}</span>
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`sidebar-filter ${filter === 'active' ? 'active' : ''}`}
          >
            <FaRegCircle size={18} />
            <span>{t('todos_active')}</span>
            <span className="filter-count">{activeTodoCount}</span>
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`sidebar-filter ${filter === 'completed' ? 'active' : ''}`}
          >
            <FaCheck size={18} />
            <span>{t('todos_completed')}</span>
            <span className="filter-count">{completedTodoCount}</span>
          </button>
        </div>

        <div className="progress-section">
          <div className="progress-header">
            <span className="progress-label">{t('todos_progress')}</span>
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
              {t('todos_clearCompleted')}
            </button>
          </div>
        )}

        {lastUpdated && (
          <div className="sidebar-meta" style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px' }}>
            {t('todos_uiRefreshed')}: {new Date(lastUpdated).toLocaleTimeString()}
          </div>
        )}
        <div className="sidebar-stats">
          <div className="stat-card">
            <div className="stat-icon total">📋</div>
            <div className="stat-info">
              <span className="stat-value">{todos.length}</span>
              <span className="stat-label">{t('todos_totalTasks')}</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon active">✏️</div>
            <div className="stat-info">
              <span className="stat-value">{draftsOpenedCount}</span>
              <span className="stat-label">{t('todos_draftsOpened')}</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon active">⚡</div>
            <div className="stat-info">
              <span className="stat-value">{activeTodoCount}</span>
              <span className="stat-label">{t('todos_activeTasks')}</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon completed">✅</div>
            <div className="stat-info">
              <span className="stat-value">{completedTodoCount}</span>
              <span className="stat-label">{t('todos_completedTasks')}</span>
            </div>
          </div>
        </div>
      </aside>

      <main className="todo-main">
        <div className="todo-header">
          <div>
            <h1>
              {filter === 'all' && t('todos_allTasks')}
              {filter === 'active' && `${t('todos_active')} ${t('todos_title')}`}
              {filter === 'completed' && `${t('todos_completed')} ${t('todos_title')}`}
            </h1>
            <p className="todo-subtitle">
              {filter === 'all' && t('todos_tasksInTotal', { count: todos.length })}
              {filter === 'active' && t('todos_tasksToComplete', { count: activeTodoCount })}
              {filter === 'completed' && t('todos_tasksCompleted', { count: completedTodoCount })}
            </p>
          </div>
        </div>

        <div className="todo-list-container">
          {filteredTodos.length === 0 ? (
            <div className="empty-state">
              <div className="empty-illustration">
                <FaClipboardList size={120} style={{ color: '#e5e7eb' }} aria-hidden />
              </div>
              <h2>{t('todos_noTasksFound')}</h2>
              <p>{todos.length === 0 
                ? t('todos_createFirst')
                : t('todos_noFilter', { filter })
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
                        <button onClick={() => handleSaveEdit(todo.id)} className="action-btn save-btn" title={t('todos_save')}>
                          <FaCheck size={16} />
                        </button>
                        <button onClick={handleCancelEdit} className="action-btn cancel-btn" title={t('todos_cancel')}>
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
                          title={t('todos_editTask')}
                        >
                          <FaPen size={16} />
                        </button>
                        <button 
                          onClick={() => handleDeleteTodo(todo.id)} 
                          className="action-btn delete-btn"
                          title={t('todos_deleteTask')}
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
                placeholder={t('todos_addPlaceholder')}
                className="todo-input"
              />
              <button 
                type="submit" 
                className="send-button"
                disabled={!todoInput.trim()}
                title={t('todos_newTask')}
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
