import { useState, useMemo, useCallback, lazy, Suspense } from 'react'
import { useTheme } from '../context/ThemeContext'
import UserCard from './UserCard'
import UserStatsPanel from './UserStatsPanel'
import { useDebounce } from '../hooks/useDebounce'
import { useWindowSize } from '../hooks/useWindowSize'
import './UserDirectory.css'

const UserDetailModal = lazy(() => import('./UserDetailModal'))

const roles = ['developer', 'designer', 'manager', 'analyst', 'devops', 'qa']
const departments = ['Engineering', 'Design', 'Product', 'Analytics', 'Operations', 'Quality']
const firstNames = [
  'James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda',
  'David', 'Elizabeth', 'William', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica',
  'Thomas', 'Sarah', 'Charles', 'Karen', 'Daniel', 'Lisa', 'Matthew', 'Nancy',
  'Anthony', 'Betty', 'Mark', 'Margaret', 'Steven', 'Sandra',
]
const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson',
  'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson',
  'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson',
]

function generateUsers(count) {
  const users = []
  for (let i = 1; i <= count; i++) {
    const first = firstNames[i % firstNames.length]
    const last = lastNames[i % lastNames.length]
    users.push({
      id: i,
      name: `${first} ${last}`,
      email: `${first.toLowerCase()}.${last.toLowerCase()}${i}@example.com`,
      role: roles[i % roles.length],
      department: departments[i % departments.length],
      projects: Math.floor(Math.random() * 20) + 1,
      tasks: Math.floor(Math.random() * 50) + 5,
      completedTasks: Math.floor(Math.random() * 40),
      isOnline: Math.random() > 0.5,
      location: i % 3 === 0 ? 'Remote' : i % 3 === 1 ? 'New York' : 'San Francisco',
      bio: i % 4 === 0 ? `Experienced ${roles[i % roles.length]} with a passion for technology.` : '',
    })
  }
  return users
}

const allUsers = generateUsers(500)

function UserDirectory() {
  const { theme } = useTheme()
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [sortBy, setSortBy] = useState('name')
  const [selectedUser, setSelectedUser] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  // Debounce search to avoid filtering 500 users on every keystroke
  const debouncedSearch = useDebounce(searchTerm, 300)

  // Responsive layout info
  const { width } = useWindowSize()
  const gridColumns = width > 1200 ? 4 : width > 900 ? 3 : width > 600 ? 2 : 1

  const filteredUsers = useMemo(() => {
    return allUsers
      .filter((user) => {
        const matchesSearch =
          user.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          user.email.toLowerCase().includes(debouncedSearch.toLowerCase())
        const matchesRole = roleFilter === 'all' || user.role === roleFilter
        return matchesSearch && matchesRole
      })
      .sort((a, b) => {
        if (sortBy === 'name') return a.name.localeCompare(b.name)
        if (sortBy === 'projects') return b.projects - a.projects
        if (sortBy === 'tasks') return b.tasks - a.tasks
        return 0
      })
  }, [debouncedSearch, roleFilter, sortBy])

  const onlineCount = useMemo(() => allUsers.filter((u) => u.isOnline).length, [])

  const handleSelect = useCallback((userId) => {
    setSelectedUser(allUsers.find((u) => u.id === userId) || null)
  }, [])

  const handleClose = useCallback(() => setSelectedUser(null), [])

  return (
    <div className={`user-directory ${theme}`}>
      {/* Header */}
      <div className="user-dir-header">
        <div>
          <h1>User Directory</h1>
          <p className="user-dir-subtitle">Manage and browse your team members</p>
        </div>
        <UserStatsPanel
          totalUsers={allUsers.length}
          onlineUsers={onlineCount}
          roles={roles}
        />
      </div>

      {/* Controls */}
      <div className="user-dir-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Roles</option>
          {roles.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="filter-select"
        >
          <option value="name">Sort by Name</option>
          <option value="projects">Sort by Projects</option>
          <option value="tasks">Sort by Tasks</option>
        </select>
        <button
          className="sidebar-toggle-btn"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? 'Hide Stats' : 'Show Stats'}
        </button>
      </div>

      <p className="results-count">
        {filteredUsers.length} users found
        {debouncedSearch !== searchTerm && ' (searching...)'}
      </p>

      {/* User Grid */}
      <div className="user-dir-body">
        <div className="user-grid" style={{ gridTemplateColumns: `repeat(${gridColumns}, 1fr)` }}>
          {filteredUsers.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              onClick={() => handleSelect(user.id)}
            />
          ))}
        </div>
      </div>

      <Suspense fallback={<div className="loading-spinner" />}>
        <UserDetailModal
          user={selectedUser}
          onClose={handleClose}
        />
      </Suspense>
    </div>
  )
}

export default UserDirectory
