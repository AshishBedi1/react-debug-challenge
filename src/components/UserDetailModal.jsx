/**
 * Heavy modal component that displays detailed user information.
 * This is only shown when a user card is clicked.
 *
 * BUG 6 (in UserDirectory.jsx):
 *   This component is statically imported at the top of UserDirectory
 *   instead of using React.lazy + Suspense for dynamic import.
 *   It adds to the initial bundle even though it is rarely opened.
 */
function UserDetailModal({ user, onClose }) {
  if (!user) return null

  return (
    <div className="user-detail-overlay" onClick={onClose}>
      <div className="user-detail-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>✕</button>
        <div className="modal-header">
          <img
            src={`https://i.pravatar.cc/120?u=${user.id}`}
            alt={user.name}
            className="modal-avatar"
          />
          <h2>{user.name}</h2>
          <p className="modal-email">{user.email}</p>
          <span className="modal-role-badge">{user.role}</span>
        </div>
        <div className="modal-body">
          <div className="modal-section">
            <h3>Bio</h3>
            <p>{user.bio || 'This user has not added a bio yet.'}</p>
          </div>
          <div className="modal-stats-grid">
            <div className="modal-stat">
              <span className="modal-stat-value">{user.projects}</span>
              <span className="modal-stat-label">Projects</span>
            </div>
            <div className="modal-stat">
              <span className="modal-stat-value">{user.tasks}</span>
              <span className="modal-stat-label">Tasks</span>
            </div>
            <div className="modal-stat">
              <span className="modal-stat-value">{user.completedTasks || 0}</span>
              <span className="modal-stat-label">Completed</span>
            </div>
          </div>
          <div className="modal-section">
            <h3>Department</h3>
            <p>{user.department}</p>
          </div>
          <div className="modal-section">
            <h3>Location</h3>
            <p>{user.location || 'Remote'}</p>
          </div>
          {/* Simulated heavy content to justify lazy loading */}
          <div className="modal-section">
            <h3>Activity Log</h3>
            {Array.from({ length: 20 }, (_, i) => (
              <div key={i} className="activity-log-entry">
                <span className="log-dot" />
                <span>Activity entry #{i + 1} — {user.name} performed an action</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserDetailModal
