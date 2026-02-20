import { useState, useMemo } from 'react'
import { useTheme } from '../context/ThemeContext'
import { useDataFetch } from '../hooks/useDataFetch'
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

const initialSections = [
  { id: 'metrics', title: 'Key Metrics' },
  { id: 'analytics', title: 'Analytics' },
  { id: 'activity', title: 'Recent Activity' },
  { id: 'custom', title: 'Custom Widgets' },
]

function DashboardBuilder() {
  const [selectedView, setSelectedView] = useState('grid')
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [showAdvancedCharts, setShowAdvancedCharts] = useState(false)
  const { theme } = useTheme()

  const [sections, setSections] = useState(initialSections)

  const [dragIndex, setDragIndex] = useState(null)

  const { data: usersData, loading: usersLoading, error: usersError } = useDataFetch(
    'https://jsonplaceholder.typicode.com/users'
  )
  const { data: postsData, loading: postsLoading, error: postsError } = useDataFetch(
    'https://jsonplaceholder.typicode.com/posts?_limit=10'
  )

  const dataLoading = usersLoading || postsLoading
  const dataError = usersError || postsError

  const dashboardStats = useMemo(() => {
    if (!usersData || !postsData) return []
    return [
      { id: 1, value: usersData.length.toLocaleString(), label: 'Total Users', color: '#600EE4' },
      { id: 2, value: `$${(usersData.length * 3450).toLocaleString()}`, label: 'Revenue', color: '#4CAF50' },
      { id: 3, value: postsData.length.toLocaleString(), label: 'Posts', color: '#FF9800' },
      { id: 4, value: '98.5%', label: 'Satisfaction', color: '#2196F3' },
    ]
  }, [usersData, postsData])

  const apiFeedItems = useMemo(() => {
    if (!postsData) return []
    return postsData.slice(0, 5).map((post) => ({
      heading: post.title,
      time: 'recently',
    }))
  }, [postsData])

  const { messages: liveUpdates } = useSubscription('dashboard-activity')

  useEventListener('keydown', (e) => {
    if (e.key === 'Escape' && settingsOpen) {
      setSettingsOpen(false)
    }
  })

  const gridConfig = useMemo(() => ({ layout: selectedView }), [selectedView])

  const feedItems = useMemo(() => {
    const liveItems = liveUpdates.map((msg) => ({
      heading: msg.text,
      time: 'just now',
    }))
    return [...liveItems, ...apiFeedItems].slice(0, 8)
  }, [liveUpdates, apiFeedItems])

  const handleDragStart = (e, index) => {
    setDragIndex(index)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', index.toString())
  }

  const handleDragOver = (e) => {
  }

  const handleDrop = (e, dropIndex) => {
    e.preventDefault()
    if (dragIndex === null || dragIndex === dropIndex) return

    const reordered = sections
    const [draggedItem] = reordered.splice(dragIndex, 1)
    reordered.splice(dropIndex, 0, draggedItem)
    setSections(reordered)
    setDragIndex(null)
  }

  const handleDragEnd = () => {
    setDragIndex(null)
  }

  const renderSectionContent = (sectionId) => {
    switch (sectionId) {
      case 'metrics':
        return (
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
        )
      case 'analytics':
        return (
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
        )
      case 'activity':
        return (
          <FeedWidget
            title="Activity Feed"
            items={feedItems}
            onRefresh={() => console.log('refresh feed')}
            maxItems={8}
          />
        )
      case 'custom':
        return (
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
        )
      default:
        return null
    }
  }

  return (
    <WidgetProvider>
      <div className={`dashboard-builder ${theme}`}>
        {/* Header */}
        <div className="dashboard-header">
          <div className="dashboard-header-text">
            <h1>Dashboard</h1>
            <p className="dashboard-subtitle">
              Monitor your key metrics and recent activity — drag sections to reorder
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

        {/* Loading State */}
        {dataLoading && (
          <div className="dashboard-loading">
            <div className="dashboard-spinner" />
            <p>Loading dashboard data...</p>
          </div>
        )}

        {/* Error State */}
        {dataError && !dataLoading && (
          <div className="dashboard-error">
            <p>Failed to load dashboard data: {dataError}</p>
          </div>
        )}

        {/* Drag-and-drop reorderable dashboard sections */}
        {!dataLoading && !dataError && (
          <div className="dashboard-sections">
            {sections.map((section, index) => (
              <div
                key={section.id}
                className={`dashboard-section draggable-section ${
                  dragIndex === index ? 'dragging' : ''
                }`}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={handleDragEnd}
              >
                <div className="section-drag-header">
                  <span className="drag-handle">⠿</span>
                  <h2 className="section-title">{section.title}</h2>
                </div>
                {renderSectionContent(section.id)}
              </div>
            ))}
          </div>
        )}

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
