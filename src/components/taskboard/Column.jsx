import React from 'react'
import TaskCard from './TaskCard'

const Column = React.memo(function Column({ title, tasks, status, onTaskMove, onTaskEdit }) {
  const statusColors = {
    todo: '#6b7280',
    'in-progress': '#600EE4',
    done: '#22c55e',
  }

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
            onMove={onTaskMove}
            onEdit={onTaskEdit}
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
