import { useState, useMemo } from 'react'
import { useTheme } from '../context/ThemeContext'
import { useFetchHook } from '../hooks/useFetchHook'
import ArticleList from './blog/ArticleList'
import ArticleDetail from './blog/ArticleDetail'
import SEOHead from './blog/SEOHead'
import ErrorBoundary from './error-boundary/ErrorBoundary'
import './BlogPage.css'

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function BlogPage() {
  const { theme } = useTheme()
  const [selectedArticle, setSelectedArticle] = useState(null)

  // Use custom fetch hook instead of raw useEffect+fetch
  const { data: rawPosts, loading, error } = useFetchHook(
    'https://jsonplaceholder.typicode.com/posts?_limit=4'
  )

  // Map API data into article format
  const articles = useMemo(() => {
    // Prefer SSR data if available
    const ssrData = window.__SSR_DATA__
    if (ssrData?.articles?.length) return ssrData.articles

    if (!rawPosts) return []

    return rawPosts.map((post, index) => ({
      id: post.id,
      slug: post.title.toLowerCase().replace(/\s+/g, '-').slice(0, 30),
      title: post.title,
      excerpt: post.body.slice(0, 120) + '...',
      author: ['Jane Smith', 'John Doe', 'Alice Johnson', 'Bob Williams'][index % 4],
      date: formatDate('2026-02-' + String(12 - index).padStart(2, '0')),
      readTime: `${5 + index * 2} min read`,
      category: ['Tutorial', 'Advanced', 'Guide', 'Testing'][index % 4],
      views: 1000 + Math.floor(Math.random() * 500),
      content: post.body,
    }))
  }, [rawPosts])

  const handleSelectArticle = (article) => {
    setSelectedArticle(article)
  }

  const handleBack = () => {
    setSelectedArticle(null)
  }

  return (
    <div className={`blog-page ${theme}`}>
      <SEOHead
        title={selectedArticle ? `${selectedArticle.title} | Savyre Blog` : 'Blog | Savyre'}
        description="Read the latest articles on React development, patterns, and best practices."
        article={selectedArticle}
      />

      {!selectedArticle ? (
        <div className="blog-list-view">
          <div className="blog-header">
            <h1>Blog</h1>
            <p className="blog-subtitle">
              Latest articles on React development and best practices
            </p>
          </div>

          {error && (
            <div className="blog-error">
              <p>Failed to load articles: {error}</p>
            </div>
          )}

          {loading ? (
            <div className="blog-loading">
              <div className="loading-spinner" />
              <p>Loading articles...</p>
            </div>
          ) : (
            <ArticleList
              articles={articles}
              onSelectArticle={handleSelectArticle}
            />
          )}
        </div>
      ) : (
        <ErrorBoundary>
          <ArticleDetail
            article={selectedArticle}
            onBack={handleBack}
          />
        </ErrorBoundary>
      )}
    </div>
  )
}

export default BlogPage
