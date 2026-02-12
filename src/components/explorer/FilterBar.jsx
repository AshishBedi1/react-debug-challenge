import { useState, useEffect } from 'react'

function FilterBar({ filters, onFiltersChange, filterOptions }) {
  return (
    <div className="filter-bar">
      <div className="filter-group">
        <label>Search</label>
        <input
          type="text"
          placeholder="Search by title..."
          value={filters.search || ''}
          onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
          className="filter-input"
        />
      </div>
      <div className="filter-group">
        <label>User ID</label>
        <select
          value={filters.userId || ''}
          onChange={(e) => onFiltersChange({ ...filters, userId: e.target.value })}
          className="filter-select"
        >
          <option value="">All Users</option>
          {(filterOptions || []).map((id) => (
            <option key={id} value={id}>User {id}</option>
          ))}
        </select>
      </div>
      <div className="filter-group">
        <label>Per Page</label>
        <select
          value={filters.perPage || 10}
          onChange={(e) => onFiltersChange({ ...filters, perPage: Number(e.target.value) })}
          className="filter-select"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
        </select>
      </div>
    </div>
  )
}

export default FilterBar
