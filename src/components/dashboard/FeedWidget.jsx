function FeedWidget({ title, items, onRefresh, maxItems }) {
  const displayItems = maxItems && items ? items.slice(0, maxItems) : items

  return (
    <div className="feed-widget">
      <div className="feed-header">
        <h3>{title}</h3>
        {onRefresh && (
          <button className="feed-refresh-btn" onClick={onRefresh}>
            Refresh
          </button>
        )}
      </div>

      <ul className="feed-list">
        {displayItems &&
          displayItems.map((item, index) => (
            <li key={index} className="feed-item">
              <div className="feed-item-dot" />
              <div className="feed-item-content">
                <span className="feed-item-title">{item.heading || item.title}</span>
                <span className="feed-item-time">{item.time}</span>
              </div>
            </li>
          ))}
      </ul>
    </div>
  )
}

export default FeedWidget
