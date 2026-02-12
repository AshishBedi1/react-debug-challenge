import { useState, useMemo } from 'react'
import { useTheme } from '../context/ThemeContext'
import StatCard from './dashboard/StatCard'
import ChartWidget from './dashboard/ChartWidget'
import FeedWidget from './dashboard/FeedWidget'
import WidgetPanel from './dashboard/WidgetPanel'
import { WidgetProvider } from './dashboard/WidgetContext'
import withWidgetAuth from './dashboard/withWidgetAuth'
import ErrorBoundary from './error-boundary/ErrorBoundary'
import { useEventListener } from '../hooks/useEventListener'
import { useSubscription } from '../hooks/useSubscription'
import './DashboardBuilder.css'

const AuthStatCard = withWidgetAuth(StatCard)

const dashboardStats = [
  { id: 1, value: '2,847', label: 'Total Users', color: '#600EE4' },
  { id: 2, value: '$34,500', label: 'Revenue', color: '#4CAF50' },
  { id: 3, value: '1,234', label: 'Orders', color: '#FF9800' },
  { id: 4, value: '98.5%', label: 'Satisfaction', color: '#2196F3' },
]

const chartData = [
  { label: 'Mon', value: 120, color: '#600EE4' },
  { label: 'Tue', value: 200, color: '#7c3aed' },
  { label: 'Wed', value: 150, color: '#8b5cf6' },
  { label: 'Thu', value: 280, color: '#a78bfa' },
  { label: 'Fri', value: 220, color: '#c4b5fd' },
]

const monthlyChartData = [
  { label: 'Jan', value: 800, color: '#600EE4' },
  { label: 'Feb', value: 1200, color: '#7c3aed' },
  { label: 'Mar', value: 950, color: '#8b5cf6' },
  { label: 'Apr', value: 1400, color: '#a78bfa' },
  { label: 'May', value: 1100, color: '#c4b5fd' },
]

const staticFeedItems = [
  { heading: 'New user registration spike', time: '2 hours ago' },
  { heading: 'Server maintenance completed', time: '5 hours ago' },
  { heading: 'Payment gateway updated', time: '1 day ago' },
  { heading: 'New feature: Dark mode', time: '2 days ago' },
  { heading: 'Bug fix: Cart total', time: '3 days ago' },
]

function DashboardBuilder() {
  const [selectedView, setSelectedView] = useState('grid')
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [showAdvancedCharts, setShowAdvancedCharts] = useState(false)
  const { theme } = useTheme()

  // Live activity updates via subscription
  const { messages: liveUpdates } = useSubscription('dashboard-activity')

  // Keyboard shortcut: Escape closes settings modal
  useEventListener('keydown', (e) => {
    if (e.key === 'Escape' && settingsOpen) {
      setSettingsOpen(false)
    }
  })

  const gridConfig = useMemo(() => ({ layout: selectedView }), [selectedView])

  // Merge static feed items with live updates
  const feedItems = useMemo(() => {
    const liveItems = liveUpdates.map((msg) => ({
      heading: msg.text,
      time: 'just now',
    }))
    return [...liveItems, ...staticFeedItems].slice(0, 8)
  }, [liveUpdates])

  return (
    <WidgetProvider>
      <div className={`dashboard-builder ${theme}`}>
        {/* Header */}
        <div className="dashboard-header">
          <div className="dashboard-header-text">
            <h1>Dashboard</h1>
            <p className="dashboard-subtitle">
              Monitor your key metrics and recent activity
            </p>
          </div>

          <div className="dashboard-controls">
            <button
              className={`view-btn ${selectedView === 'grid' ? 'active' : ''}`}
              onClick={() => setSelectedView('grid')}
            >
              Grid View
            </button>
            <button
              className={`view-btn ${selectedView === 'list' ? 'active' : ''}`}
              onClick={() => setSelectedView('list')}
            >
              List View
            </button>
            <button
              className="settings-btn"
              onClick={() => setSettingsOpen(!settingsOpen)}
            >
              <span>Settings</span>
              <span className="settings-icon">⚙️</span>
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="dashboard-section">
          <h2 className="section-title">Key Metrics</h2>
          <div className={`stats-grid ${selectedView}`}>
            {dashboardStats.map((stat) => (
              <AuthStatCard
                key={stat.id}
                value={stat.value}
                label={stat.label}
                color={stat.color}
                config={gridConfig}
              />
            ))}
          </div>
        </div>

        {/* Charts - wrapped with error boundary */}
        <div className="dashboard-section">
          <h2 className="section-title">Analytics</h2>
          <ErrorBoundary>
            <div className="charts-grid">
              <ChartWidget title="Weekly Sales" data={chartData} />

              <div className="advanced-chart-toggle">
                <button
                  className="toggle-btn"
                  onClick={() => setShowAdvancedCharts(!showAdvancedCharts)}
                >
                  {showAdvancedCharts ? 'Hide' : 'Show'} Monthly Trends
                </button>

                {showAdvancedCharts && (
                  <ChartWidget title="Monthly Trends" data={monthlyChartData} />
                )}
              </div>
            </div>
          </ErrorBoundary>
        </div>

        {/* Activity Feed - uses live subscription data */}
        <div className="dashboard-section">
          <h2 className="section-title">Recent Activity</h2>
          <FeedWidget
            title="Activity Feed"
            items={feedItems}
            onRefresh={() => console.log('refresh feed')}
            maxItems={8}
          />
        </div>

        {/* Custom Widgets */}
        <div className="dashboard-section">
          <h2 className="section-title">Custom Widgets</h2>
          <div className="custom-widgets-grid">
            <ErrorBoundary>
              <WidgetPanel
                component={StatCard}
                widgetData={{ value: '500', label: 'Active Sessions', color: '#600EE4' }}
              />
            </ErrorBoundary>
            <ErrorBoundary>
              <WidgetPanel
                component={FeedWidget}
                widgetData={{
                  title: 'Alerts',
                  items: [
                    { heading: 'CPU usage high', time: '10 min ago' },
                    { heading: 'Disk space low', time: '30 min ago' },
                  ],
                }}
              />
            </ErrorBoundary>
          </div>
        </div>

        {/* Settings Modal */}
        {settingsOpen && (
          <div className="settings-overlay" onClick={() => setSettingsOpen(false)}>
            <div className="settings-modal" onClick={(e) => e.stopPropagation()}>
              <h2>Dashboard Settings</h2>
              <form onSubmit={(e) => e.preventDefault()}>
                <div className="settings-field">
                  <label>Layout</label>
                  <select
                    value={selectedView}
                    onChange={(e) => setSelectedView(e.target.value)}
                  >
                    <option value="grid">Grid</option>
                    <option value="list">List</option>
                  </select>
                </div>
                <div className="settings-field">
                  <label>Refresh Interval (seconds)</label>
                  <input type="number" defaultValue={30} min={5} />
                </div>
                <div className="settings-field">
                  <label>Max Feed Items</label>
                  <input type="number" defaultValue={5} min={1} max={20} />
                </div>
                <div className="settings-actions">
                  <button type="button" className="save-btn">
                    Save Changes
                  </button>
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => setSettingsOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </WidgetProvider>
  )
}

export default DashboardBuilder
