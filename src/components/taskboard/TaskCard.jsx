import React from 'react'

const TaskCard = React.memo(function TaskCard({ task, onMove, onEdit }) {
  const priorityColors = {
    high: '#ef4444',
    medium: '#f59e0b',
    low: '#22c55e',
  }

  return (
    <div className={`task-card priority-${task.priority}`}>
      <div className="task-card-header">
        <span
          className="task-priority-dot"
          style={{ backgroundColor: priorityColors[task.priority] }}
        />
        <span className="task-id">#{task.id}</span>
      </div>
      <h4 className="task-title">{task.title}</h4>
      <p className="task-description">{task.description}</p>
      <div className="task-card-footer">
        <div className="task-assignee">
          <img
            src={`https://i.pravatar.cc/24?u=${task.assignee}`}
            alt={task.assignee}
            className="assignee-avatar-small"
          />
          <span>{task.assignee}</span>
        </div>
        <div className="task-actions">
          <button className="task-action-btn" onClick={() => onEdit(task)}>
            Edit
          </button>
          <button className="task-action-btn" onClick={() => onMove(task.id)}>
            Move
          </button>
        </div>
      </div>
    </div>
  )
}, (prevProps, nextProps) => {
  return (
    prevProps.task.id === nextProps.task.id &&
    prevProps.task.title === nextProps.task.title &&
    prevProps.task.status === nextProps.task.status &&
    prevProps.task.priority === nextProps.task.priority &&
    prevProps.task.assignee === nextProps.task.assignee &&
    prevProps.onMove === nextProps.onMove &&
    prevProps.onEdit === nextProps.onEdit
  )
})

export default TaskCard
