import { useWidgetConfig } from './WidgetContext'

function StatCard({ value, label, color, config }) {
  const { widgetConfig } = useWidgetConfig()

  return (
    <div className={`stat-card-widget ${widgetConfig.theme}`}>
      <div className="stat-value" style={{ color }}>
        {value}
      </div>
      <div className="stat-label">{label}</div>
      {config && <span className="stat-config-badge">{config.layout}</span>}
    </div>
  )
}

export default StatCard
