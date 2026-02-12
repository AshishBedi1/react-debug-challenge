function ArticleList({ articles, onSelectArticle }) {
  if (!articles || articles.length === 0) {
    return <p className="no-articles">No articles found.</p>
  }

  return (
    <div className="article-list">
      {articles.map((article) => (
        <div
          key={article.id}
          className="article-preview"
          onClick={() => onSelectArticle(article)}
        >
          <div className="article-preview-header">
            <span className="article-category">{article.category}</span>
            <span className="article-read-time">{article.readTime}</span>
          </div>
          <h3 className="article-preview-title">{article.title}</h3>
          <p className="article-preview-excerpt">{article.excerpt}</p>
          <div className="article-meta-inline">
            <span>By {article.author}</span>
            <span> • </span>
            <span>{article.views} views</span>
          </div>
          <div className="article-preview-footer">
            <span className="article-author">{article.author}</span>
            <span className="article-date">{article.date}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ArticleList
