function WidgetPanel({ component: Component, widgetData }) {
  if (!Component || typeof Component === 'string') {
    return (
      <div className="widget-panel">
        <p style={{ color: '#6b7280' }}>Widget not available</p>
      </div>
    )
  }

  return (
    <div className="widget-panel">
      <Component {...widgetData} />
    </div>
  )
}

export default WidgetPanel
