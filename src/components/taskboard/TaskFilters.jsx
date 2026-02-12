import React from 'react'

function AssigneeAvatar({ name }) {
  return (
    <img
      src={`https://i.pravatar.cc/20?u=${name}`}
      alt={name}
      className="filter-avatar"
    />
  )
}

function TaskFilters({ filters, onChange, assignees }) {
  return (
    <div className="task-filters">
      <div className="filter-group">
        <label>Search</label>
        <input
          type="text"
          value={filters.search}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
          placeholder="Search tasks..."
          className="filter-input"
        />
      </div>
      <div className="filter-group">
        <label>Priority</label>
        <select
          value={filters.priority}
          onChange={(e) => onChange({ ...filters, priority: e.target.value })}
          className="filter-select"
        >
          <option value="all">All</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>
      <div className="filter-group">
        <label>Assignee</label>
        <div className="assignee-chips">
          {assignees.map((name) => (
            <button
              key={name}
              className={`assignee-chip ${filters.assignee === name ? 'active' : ''}`}
              onClick={() =>
                onChange({
                  ...filters,
                  assignee: filters.assignee === name ? '' : name,
                })
              }
            >
              <AssigneeAvatar name={name} />
              <span>{name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TaskFilters
