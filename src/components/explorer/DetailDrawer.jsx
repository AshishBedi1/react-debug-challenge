function DetailDrawer({ item, onClose }) {
  if (!item) return null

  return (
    <div className="detail-drawer-overlay" onClick={onClose}>
      <div className="detail-drawer" onClick={(e) => e.stopPropagation()}>
        <button className="drawer-close-btn" onClick={onClose}>✕</button>
        <h2>Item Details</h2>
        <div className="drawer-content">
          <div className="drawer-field">
            <label>ID</label>
            <span>{item.id}</span>
          </div>
          <div className="drawer-field">
            <label>User ID</label>
            <span>{item.userId}</span>
          </div>
          <div className="drawer-field">
            <label>Title</label>
            <p>{item.title}</p>
          </div>
          <div className="drawer-field">
            <label>Body</label>
            <p>{item.body}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DetailDrawer
