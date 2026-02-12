import { useState, useEffect } from 'react'

function NewsCard({ article }) {
  const [author, setAuthor] = useState(null)

  useEffect(() => {
    const controller = new AbortController()

    fetch(`https://jsonplaceholder.typicode.com/users/${article.userId}`, {
      signal: controller.signal,
    })
      .then((r) => r.json())
      .then(setAuthor)
      .catch((err) => {
        if (err.name !== 'AbortError') {
          console.warn('Failed to fetch author:', err)
        }
      })

    return () => controller.abort()
  }, [article.userId])

  return (
    <div className="news-card">
      <div className="news-card-header">
        <span className="news-category-badge">{article.category}</span>
        <span className="news-time">{article.time}</span>
      </div>
      <h3 className="news-card-title">{article.title}</h3>
      <p className="news-card-body">{article.body}</p>
      <div className="news-card-footer">
        <span className="news-author">By {author?.name || 'Loading...'}</span>
        <span className="news-views">{article.views} views</span>
      </div>
    </div>
  )
}

export default NewsCard
