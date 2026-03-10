import { useWidgetConfig } from './WidgetContext'

function StatCard({ value, label, color, config, isAuthorized }) {
  const { widgetConfig } = useWidgetConfig()

  return (
    <div className={`stat-card-widget ${widgetConfig.theme}`}>
      {isAuthorized && (
        <span className="widget-authorized-badge" data-testid="widget-authorized">Authorized</span>
      )}
      <div className="stat-value" style={{ color }}>
        {value}
      </div>
      <div className="stat-label">{label}</div>
      {config && <span className="stat-config-badge">{config.layout}</span>}
    </div>
  )
}

export default StatCard
