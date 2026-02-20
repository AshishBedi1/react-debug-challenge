import React, { useCallback } from 'react'
import TaskCard from './TaskCard'

const Column = React.memo(function Column({ title, tasks, status, onTaskMove, onTaskEdit }) {
  const statusColors = {
    todo: '#6b7280',
    'in-progress': '#600EE4',
    done: '#22c55e',
  }

  const handleMove = useCallback((taskId) => {
    onTaskMove({ taskId, fromStatus: status })
  }, [onTaskMove, status])

  const handleEdit = useCallback((task) => {
    onTaskEdit(task.id)
  }, [onTaskEdit])

  return (
    <div className="board-column">
      <div className="column-header" style={{ borderTopColor: statusColors[status] }}>
        <h3>{title}</h3>
        <span className="column-count">{tasks.length}</span>
      </div>
      <div className="column-body">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onMove={handleMove}
            onEdit={handleEdit}
          />
        ))}
        {tasks.length === 0 && (
          <div className="column-empty">No tasks</div>
        )}
      </div>
    </div>
  )
})

export default Column
