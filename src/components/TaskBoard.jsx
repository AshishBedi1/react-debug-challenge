import { useState, useMemo, useCallback } from 'react'
import { useTheme } from '../context/ThemeContext'
import { usePrevious } from '../hooks/usePrevious'
import { useLocalStorage } from '../hooks/useLocalStorage'
import Column from './taskboard/Column'
import TaskFilters from './taskboard/TaskFilters'
import ErrorBoundary from './error-boundary/ErrorBoundary'
import './TaskBoard.css'

const assignees = ['Alice', 'Bob', 'Carol', 'Dave', 'Eve']

function generateTasks() {
  const titles = [
    'Set up CI/CD pipeline', 'Design landing page', 'Implement auth flow',
    'Write unit tests', 'Optimize database queries', 'Create API docs',
    'Fix mobile layout', 'Add dark mode', 'Review pull requests',
    'Set up monitoring', 'Migrate to TypeScript', 'Update dependencies',
    'Add error tracking', 'Implement caching', 'Create onboarding flow',
    'Build notification system', 'Add search functionality', 'Performance audit',
    'Security review', 'Add i18n support', 'Create design system',
    'Write e2e tests', 'Set up staging env', 'Add analytics',
  ]
  return titles.map((title, i) => ({
    id: i + 1,
    title,
    description: 'Task description for: ' + title,
    status: ['todo', 'in-progress', 'done'][i % 3],
    priority: ['high', 'medium', 'low'][i % 3],
    assignee: assignees[i % assignees.length],
  }))
}

function TaskBoard() {
  const { theme } = useTheme()
  const [tasks, setTasks] = useState(generateTasks)

  // Persist filter preferences in localStorage
  const [savedFilters, setSavedFilters] = useLocalStorage('taskBoardFilters', {
    search: '', priority: 'all', assignee: '',
  })
  const [filters, setFilters] = useState(savedFilters)
  const [sortKey, setSortKey] = useState('priority')

  // Track previous completed count to show delta
  const completedCount = useMemo(() => tasks.filter((t) => t.status === 'done').length, [tasks])
  const prevCompletedCount = usePrevious(completedCount)

  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      const matchSearch = !filters.search ||
        t.title.toLowerCase().includes(filters.search.toLowerCase())
      const matchPriority = filters.priority === 'all' || t.priority === filters.priority
      const matchAssignee = !filters.assignee || t.assignee === filters.assignee
      return matchSearch && matchPriority && matchAssignee
    })
  }, [tasks, filters])

  const sortedTasks = useMemo(() => {
    return [...filteredTasks].sort((a, b) => {
      if (sortKey === 'priority') {
        const order = { high: 0, medium: 1, low: 2 }
        return order[a.priority] - order[b.priority]
      }
      return a.title.localeCompare(b.title)
    })
  }, [filteredTasks, sortKey])

  const todoTasks = useMemo(() => sortedTasks.filter((t) => t.status === 'todo'), [sortedTasks])
  const inProgressTasks = useMemo(() => sortedTasks.filter((t) => t.status === 'in-progress'), [sortedTasks])
  const doneTasks = useMemo(() => sortedTasks.filter((t) => t.status === 'done'), [sortedTasks])

  const handleTaskMove = useCallback((taskId) => {
    setTasks((prev) => {
      const task = prev.find((t) => t.id === taskId)
      if (!task) return prev
      const statusOrder = ['todo', 'in-progress', 'done']
      const currentIdx = statusOrder.indexOf(task.status)
      const nextStatus = statusOrder[(currentIdx + 1) % statusOrder.length]
      return prev.map((t) =>
        t.id === taskId ? { ...t, status: nextStatus } : t
      )
    })
  }, [])

  const handleTaskEdit = useCallback((task) => {
    const newTitle = prompt('Edit task title:', task.title)
    if (newTitle) {
      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, title: newTitle } : t))
      )
    }
  }, [])

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters)
    setSavedFilters(newFilters) // persist to localStorage
  }, [setSavedFilters])

  const taskStats = useMemo(() => {
    return {
      total: tasks.length,
      completed: completedCount,
      highPriority: tasks.filter((t) => t.priority === 'high').length,
    }
  }, [tasks, completedCount])

  const completedDelta = prevCompletedCount !== undefined && completedCount !== prevCompletedCount
    ? completedCount - prevCompletedCount
    : null

  return (
    <div className={`task-board ${theme}`}>
      <div className="board-header">
        <div>
          <h1>Task Board</h1>
          <p className="board-subtitle">Manage your team tasks</p>
        </div>
        <div className="board-stats">
          <span className="board-stat">{taskStats.total} total</span>
          <span className="board-stat">
            {taskStats.completed} done
            {completedDelta !== null && completedDelta !== 0 && (
              <span className={`delta ${completedDelta > 0 ? 'positive' : 'negative'}`}>
                {completedDelta > 0 ? ` (+${completedDelta})` : ` (${completedDelta})`}
              </span>
            )}
          </span>
          <span className="board-stat">{taskStats.highPriority} high priority</span>
        </div>
      </div>

      <TaskFilters
        filters={filters}
        onChange={handleFilterChange}
        assignees={assignees}
      />

      <div className="board-controls">
        <label>Sort by: </label>
        <select
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value)}
          className="sort-select"
        >
          <option value="priority">Priority</option>
          <option value="title">Title</option>
        </select>
      </div>

      <div className="board-columns">
        <ErrorBoundary>
          <Column
            title="To Do"
            tasks={todoTasks}
            status="todo"
            onTaskMove={handleTaskMove}
            onTaskEdit={handleTaskEdit}
          />
        </ErrorBoundary>
        <ErrorBoundary>
          <Column
            title="In Progress"
            tasks={inProgressTasks}
            status="in-progress"
            onTaskMove={handleTaskMove}
            onTaskEdit={handleTaskEdit}
          />
        </ErrorBoundary>
        <ErrorBoundary>
          <Column
            title="Done"
            tasks={doneTasks}
            status="done"
            onTaskMove={handleTaskMove}
            onTaskEdit={handleTaskEdit}
          />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default TaskBoard
