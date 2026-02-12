import { useState, useEffect, useRef, useCallback } from 'react'
import { useTheme } from '../context/ThemeContext'
import { dataCache } from '../utils/dataCache'
import { usePrevious } from '../hooks/usePrevious'
import NewsCard from './news/NewsCard'
import NewsFilters from './news/NewsFilters'
import ErrorBoundary from './error-boundary/ErrorBoundary'
import './NewsFeed.css'

const categoryMap = {
  All: '',
  Technology: 'technology',
  Science: 'science',
  Business: 'business',
  Health: 'health',
  Sports: 'sports',
}

function NewsFeed() {
  const { theme } = useTheme()
  const [articles, setArticles] = useState([])
  const [category, setCategory] = useState('All')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const abortRef = useRef(null)

  // Track previous article count to show "N new articles"
  const prevArticleCount = usePrevious(articles.length)

  const fetchArticles = useCallback(async (cat) => {
    // Cancel any in-flight request
    if (abortRef.current) {
      abortRef.current.abort()
    }
    const controller = new AbortController()
    abortRef.current = controller

    setLoading(true)
    setError(null)

    const baseUrl = 'https://jsonplaceholder.typicode.com/posts'
    const url = cat === 'All'
      ? `${baseUrl}?_limit=12`
      : `${baseUrl}?_limit=12&category=${categoryMap[cat]}`

    const cached = dataCache.get(url)
    if (cached) {
      setArticles(cached)
      setLoading(false)
      return
    }

    try {
      const res = await fetch(url, { signal: controller.signal })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()

      const mapped = data.map((post, index) => ({
        ...post,
        category: cat === 'All'
          ? ['Technology', 'Science', 'Business', 'Health', 'Sports'][index % 5]
          : cat,
        time: `${index + 1}h ago`,
        views: Math.floor(Math.random() * 500) + 100,
      }))

      dataCache.set(url, mapped)
      setArticles(mapped)
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message)
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchArticles(category)
    return () => {
      if (abortRef.current) abortRef.current.abort()
    }
  }, [category, fetchArticles])

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory)
  }

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    dateStyle: 'full',
  }).format(new Date())

  const newArticlesDiff = prevArticleCount !== undefined && articles.length > 0 && prevArticleCount !== articles.length
    ? articles.length - prevArticleCount
    : null

  return (
    <div className={`news-feed ${theme}`}>
      <div className="news-header">
        <h1>News Feed</h1>
        <p className="news-subtitle">Latest updates from around the world</p>
        <span className="news-date">{formattedDate}</span>
        {newArticlesDiff !== null && newArticlesDiff > 0 && (
          <span className="new-articles-badge">{newArticlesDiff} new articles loaded</span>
        )}
      </div>

      <NewsFilters
        selectedCategory={category}
        onCategoryChange={handleCategoryChange}
      />

      {error && (
        <div className="news-error">
          <p>Failed to load news: {error}</p>
        </div>
      )}

      {loading ? (
        <div className="news-loading">
          <div className="loading-spinner" />
          <p>Loading news...</p>
        </div>
      ) : (
        <div className="news-grid">
          {articles.map((article) => (
            <ErrorBoundary key={article.id}>
              <NewsCard article={article} />
            </ErrorBoundary>
          ))}
        </div>
      )}
    </div>
  )
}

export default NewsFeed
