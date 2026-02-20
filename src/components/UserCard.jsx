import React from 'react'
import './UserCard.css'

const UserCard = React.memo(function UserCard({ user, onClick }) {
  return (
    <div className="user-card" onClick={onClick}>
      <div className="user-avatar">
        <img
          src={`https://i.pravatar.cc/80?u=${user.id}`}
          alt={user.name}
          className="user-avatar-img"
        />
        <span className={`user-status-dot ${user.isOnline ? 'online' : 'offline'}`} />
      </div>
      <div className="user-info">
        <h3 className="user-name">{user.name}</h3>
        <p className="user-email">{user.email}</p>
        <span className="user-role-badge">{user.role}</span>
      </div>
      <div className="user-stats">
        <div className="user-stat">
          <span className="user-stat-value">{user.projects}</span>
          <span className="user-stat-label">Projects</span>
        </div>
        <div className="user-stat">
          <span className="user-stat-value">{user.tasks}</span>
          <span className="user-stat-label">Tasks</span>
        </div>
      </div>
    </div>
  )
}, (prevProps, nextProps) => {
  return (
    prevProps.user.id === nextProps.user.id &&
    prevProps.user.name === nextProps.user.name &&
    prevProps.user.email === nextProps.user.email &&
    prevProps.user.role === nextProps.user.role
  )
})

export default UserCard
