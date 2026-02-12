import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { useTheme } from '../context/ThemeContext'
import { fetchCache } from '../utils/fetchCache'
import { useDebounce } from '../hooks/useDebounce'
import { useEventListener } from '../hooks/useEventListener'
import FilterBar from './explorer/FilterBar'
import DetailDrawer from './explorer/DetailDrawer'
import ErrorBoundary from './error-boundary/ErrorBoundary'
import './DataExplorer.css'

const BASE_URL = 'https://jsonplaceholder.typicode.com/posts'

function DataExplorer() {
  const { theme } = useTheme()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState({ search: '', userId: '', perPage: 10 })
  const [selectedItem, setSelectedItem] = useState(null)
  const [datasetId, setDatasetId] = useState('posts')
  const [filterOptions, setFilterOptions] = useState([])
  const abortRef = useRef(null)

  // Debounce the search filter to avoid excessive re-filtering
  const debouncedSearch = useDebounce(filters.search, 250)

  // Keyboard shortcut: Escape closes the detail drawer
  useEventListener('keydown', (e) => {
    if (e.key === 'Escape' && selectedItem) {
      setSelectedItem(null)
    }
  })

  // Fetch data when page, perPage, or datasetId changes
  useEffect(() => {
    if (abortRef.current) abortRef.current.abort()
    const controller = new AbortController()
    abortRef.current = controller

    setLoading(true)
    setError(null)

    const url = `${BASE_URL}?_page=${page}&_limit=${filters.perPage}`
    const cached = fetchCache.get(url)
    if (cached) {
      setData(cached)
      setLoading(false)
      return
    }

    fetch(url, { signal: controller.signal })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
      })
      .then((json) => {
        fetchCache.set(url, json)
        setData(json)
        setLoading(false)
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          setError(err.message)
          setLoading(false)
        }
      })

    return () => controller.abort()
  }, [page, filters.perPage, datasetId])

  // Fetch filter options once
  useEffect(() => {
    fetch(`${BASE_URL}?_limit=100`)
      .then((r) => r.json())
      .then((data) => {
        const uniqueUserIds = [...new Set(data.map((d) => d.userId))]
        setFilterOptions(uniqueUserIds)
      })
      .catch(() => {})
  }, [])

  // Use debounced search for filtering
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchSearch = !debouncedSearch ||
        item.title.toLowerCase().includes(debouncedSearch.toLowerCase())
      const matchUser = !filters.userId || String(item.userId) === filters.userId
      return matchSearch && matchUser
    })
  }, [data, debouncedSearch, filters.userId])

  const handlePageChange = useCallback((newPage) => {
    if (newPage < 1) return
    setPage(newPage)
  }, [])

  const handleSelectItem = useCallback((item) => {
    setSelectedItem(item)
  }, [])

  return (
    <div className={`data-explorer ${theme}`}>
      <div className="explorer-header">
        <h1>Data Explorer</h1>
        <p className="explorer-subtitle">Query, filter, and explore datasets</p>
        <div className="dataset-selector">
          <label>Dataset: </label>
          <select
            value={datasetId}
            onChange={(e) => setDatasetId(e.target.value)}
          >
            <option value="posts">Posts</option>
            <option value="comments">Comments</option>
            <option value="users">Users</option>
          </select>
        </div>
      </div>

      <FilterBar
        filters={filters}
        onFiltersChange={setFilters}
        filterOptions={filterOptions}
      />

      {error && (
        <div className="explorer-error">
          <p>Error: {error}</p>
        </div>
      )}

      {loading ? (
        <div className="explorer-loading">
          <div className="loading-spinner" />
          <p>Loading data...</p>
        </div>
      ) : (
        <>
          <div className="data-table">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>User</th>
                  <th>Title</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>User {item.userId}</td>
                    <td className="title-cell">{item.title}</td>
                    <td>
                      <button
                        className="view-btn"
                        onClick={() => handleSelectItem(item)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pagination">
            <button
              className="page-btn"
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
            >
              Previous
            </button>
            <span className="page-info">Page {page}</span>
            <button
              className="page-btn"
              onClick={() => handlePageChange(page + 1)}
              disabled={filteredData.length < filters.perPage}
            >
              Next
            </button>
          </div>
        </>
      )}

      <ErrorBoundary>
        <DetailDrawer
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      </ErrorBoundary>
    </div>
  )
}

export default DataExplorer
