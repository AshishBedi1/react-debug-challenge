import { PureComponent } from 'react'

class UserStatsPanel extends PureComponent {
  render() {
    const { totalUsers, onlineUsers, roles } = this.props

    return (
      <div className="user-stats-panel">
        <div className="user-stats-panel-item">
          <span className="panel-stat-value">{totalUsers}</span>
          <span className="panel-stat-label">Total Users</span>
        </div>
        <div className="user-stats-panel-item">
          <span className="panel-stat-value">{onlineUsers}</span>
          <span className="panel-stat-label">Online</span>
        </div>
        <div className="user-stats-panel-item">
          <span className="panel-stat-value">{roles?.length || 0}</span>
          <span className="panel-stat-label">Roles</span>
        </div>
      </div>
    )
  }
}

export default UserStatsPanel
