import { useEffect } from 'react'
import { useTheme } from '../../context/ThemeContext'

function ArticleDetail({ article, onBack }) {
  const { theme } = useTheme()

  useEffect(() => {
    if (article) {
      document.title = `${article.title} | Savyre Blog`
    } else {
      document.title = 'Savyre Blog'
    }
  }, [article])

  if (!article) return null

  return (
    <div className={`article-detail ${theme}`}>
      <div className="article-detail-header">
        <button className="back-btn" onClick={onBack}>
          ← Back to Articles
        </button>
        <span className="article-category">{article.category}</span>
      </div>

      <h1 className="article-detail-title">{article.title}</h1>

      <div className="article-detail-meta">
        <span className="article-author">By {article.author}</span>
        <span className="meta-separator">•</span>
        <span className="article-date">{article.date}</span>
        <span className="meta-separator">•</span>
        <span className="article-views">{article.views} views</span>
        <span className="meta-separator">•</span>
        <span className="article-read-time">{article.readTime}</span>
      </div>

      <div className="article-detail-content">
        <p>{article.content}</p>
        <p>
          This is a simulated article body. In a real application this would
          contain the full Markdown-rendered content of the blog post, including
          code snippets, images, and interactive examples.
        </p>
      </div>
    </div>
  )
}

export default ArticleDetail
