function ChartWidget({ data, title }) {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="chart-widget">
        <h3 className="chart-title">{title}</h3>
        <p style={{ color: '#6b7280', textAlign: 'center', padding: '2rem 0' }}>
          No chart data available
        </p>
      </div>
    )
  }

  const maxValue = Math.max(...data.map((d) => d.value))

  return (
    <div className="chart-widget">
      <h3 className="chart-title">{title}</h3>
      <div className="chart-container">
        {data.map((item, index) => (
          <div key={item.label || index} className="chart-bar-wrapper">
            <div
              className="chart-bar"
              style={{
                height: `${(item.value / maxValue) * 100}%`,
                backgroundColor: item.color || '#600EE4',
              }}
            />
            <span className="chart-bar-label">{item.label}</span>
            <span className="chart-bar-value">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ChartWidget
