import { useState, useEffect, useCallback, useMemo } from 'react'
import { useTheme } from '../context/ThemeContext'
import { ComparisonProvider, useComparison } from '../context/ComparisonContext'
import { useLocalStorage } from '../hooks/useLocalStorage'
import ComparisonTable from './comparison/ComparisonTable'
import PriceChart from './comparison/PriceChart'
import ImageGallery from './comparison/ImageGallery'
import SpecScore from './comparison/SpecScore'
import ErrorBoundary from './error-boundary/ErrorBoundary'
import FallbackUI from './error-boundary/FallbackUI'
import './ProductComparison.css'

const allProducts = [
  {
    id: 1, name: 'ProBook Laptop', price: 1299, rating: 4.5, category: 'Laptop',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400',
    specs: { performance: 8, battery: 7, display: 9, build: 8, value: 7 },
    images: Array.from({ length: 8 }, (_, i) =>
      `https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=200&h=200&fit=crop&q=${(i + 1) * 10}`
    ),
  },
  {
    id: 2, name: 'UltraPhone X', price: 999, rating: 4.7, category: 'Phone',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',
    specs: { performance: 9, battery: 6, display: 10, build: 9, value: 6 },
    images: Array.from({ length: 8 }, (_, i) =>
      `https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200&h=200&fit=crop&q=${(i + 1) * 10}`
    ),
  },
  {
    id: 3, name: 'TabletPro 12', price: 799, rating: 4.3, category: 'Tablet',
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400',
    specs: { performance: 7, battery: 8, display: 8, build: 7, value: 8 },
    images: Array.from({ length: 8 }, (_, i) =>
      `https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=200&h=200&fit=crop&q=${(i + 1) * 10}`
    ),
  },
  {
    id: 4, name: 'SmartWatch Elite', price: 399, rating: 4.1, category: 'Watch',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
    specs: { performance: 5, battery: 9, display: 6, build: 8, value: 9 },
    images: Array.from({ length: 8 }, (_, i) =>
      `https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop&q=${(i + 1) * 10}`
    ),
  },
  {
    id: 5, name: 'DesktopPro Tower', price: 1899, rating: 4.6, category: 'Desktop',
    image: 'https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=400',
    specs: { performance: 10, battery: 0, display: 7, build: 9, value: 7 },
    images: Array.from({ length: 8 }, (_, i) =>
      `https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=200&h=200&fit=crop&q=${(i + 1) * 10}`
    ),
  },
  {
    id: 6, name: 'BudgetBook Air', price: 599, rating: 3.9, category: 'Laptop',
    image: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=400',
    specs: { performance: 5, battery: 8, display: 6, build: 5, value: 9 },
    images: Array.from({ length: 8 }, (_, i) =>
      `https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=200&h=200&fit=crop&q=${(i + 1) * 10}`
    ),
  },
]

const specDefinitions = [
  { key: 'performance', label: 'Performance', type: 'score' },
  { key: 'battery', label: 'Battery Life', type: 'score' },
  { key: 'display', label: 'Display Quality', type: 'score' },
  { key: 'build', label: 'Build Quality', type: 'score' },
  { key: 'value', label: 'Value for Money', type: 'score' },
]

function computeCompatibilityMatrix(products) {
  const matrix = []
  for (let i = 0; i < products.length; i++) {
    matrix[i] = []
    for (let j = 0; j < products.length; j++) {
      const specsA = Object.values(products[i].specs)
      const specsB = Object.values(products[j].specs)
      const score = specsA.reduce((sum, v, idx) => sum + Math.abs(v - (specsB[idx] || 0)), 0)
      matrix[i][j] = score
    }
  }
  return matrix
}

function ProductComparisonInner() {
  const { theme } = useTheme()
  const { selectedProducts, addProduct, removeProduct, viewMode, setViewMode } = useComparison()

  // Persist selected product IDs to localStorage
  const [savedSelections, setSavedSelections] = useLocalStorage('comparisonSelections', [])

  const [sortBy, setSortBy] = useState('name')
  const [highlightedSpec, setHighlightedSpec] = useState(null)

  // Restore selections from localStorage on mount
  useEffect(() => {
    if (savedSelections.length > 0 && selectedProducts.length === 0) {
      savedSelections.forEach((id) => {
        const product = allProducts.find((p) => p.id === id)
        if (product) addProduct(product)
      })
    }
  }, []) // intentionally run once on mount

  // Sync selections to localStorage when they change
  useEffect(() => {
    const ids = selectedProducts.map((p) => p.id)
    setSavedSelections(ids)
  }, [selectedProducts, setSavedSelections])

  const scores = useMemo(() => {
    const result = {}
    selectedProducts.forEach((p) => {
      result[p.id] = Object.values(p.specs).reduce((s, v) => s + v, 0)
    })
    return result
  }, [selectedProducts])

  const handleSelectProduct = useCallback((product) => {
    addProduct(product)
  }, [addProduct])

  const handleRemoveProduct = useCallback((id) => {
    removeProduct(id)
  }, [removeProduct])

  const totalScore = useMemo(() => {
    return selectedProducts.reduce((acc, p) => {
      return acc + Object.values(p.specs).reduce((s, v) => s + v, 0)
    }, 0)
  }, [selectedProducts])

  const compatMatrix = useMemo(() => {
    return selectedProducts.length > 0
      ? computeCompatibilityMatrix(selectedProducts)
      : []
  }, [selectedProducts])

  const handleCellClick = useCallback((specKey, productId) => {
    setHighlightedSpec(specKey)
  }, [])

  return (
    <div className={`product-comparison ${theme}`}>
      <div className="pc-header">
        <h1>Product Comparison</h1>
        <p className="pc-subtitle">Compare up to 4 products side by side</p>
        {totalScore > 0 && (
          <span className="total-score">Combined Score: {totalScore.toFixed(1)}</span>
        )}
      </div>

      <div className="product-selector">
        <h2>Select Products</h2>
        <div className="product-selector-grid">
          {allProducts.map((product) => {
            const isSelected = selectedProducts.some((p) => p.id === product.id)
            return (
              <div
                key={product.id}
                className={`selector-card${isSelected ? ' selected' : ''}`}
                onClick={() => isSelected ? handleRemoveProduct(product.id) : handleSelectProduct(product)}
              >
                <img src={product.image} alt={product.name} className="selector-img" loading="lazy" />
                <div className="selector-info">
                  <h4>{product.name}</h4>
                  <p>${product.price}</p>
                  <span className="selector-rating">Rating: {product.rating}</span>
                </div>
                {isSelected && <span className="selected-badge">Selected</span>}
              </div>
            )
          })}
        </div>
      </div>

      {selectedProducts.length > 0 && (
        <>
          <div className="view-toggle">
            <button
              className={`view-toggle-btn${viewMode === 'table' ? ' active' : ''}`}
              onClick={() => setViewMode('table')}
            >
              Table View
            </button>
            <button
              className={`view-toggle-btn${viewMode === 'card' ? ' active' : ''}`}
              onClick={() => setViewMode('card')}
            >
              Card View
            </button>
          </div>

          <ErrorBoundary fallback={(props) => <FallbackUI {...props} />}>
            {viewMode === 'table' ? (
              <ComparisonTable
                products={selectedProducts}
                specs={specDefinitions}
                onCellClick={handleCellClick}
                sortBy={sortBy}
              />
            ) : (
              <div className="card-view">
                {selectedProducts.map((product) => (
                  <div key={product.id} className="comparison-card">
                    <img src={product.image} alt={product.name} className="card-img" loading="lazy" />
                    <h3>{product.name}</h3>
                    <p className="card-price">${product.price}</p>
                    {specDefinitions.map((spec) => (
                      <SpecScore
                        key={spec.key}
                        value={product.specs[spec.key] || 0}
                        label={spec.label}
                      />
                    ))}
                  </div>
                ))}
              </div>
            )}
          </ErrorBoundary>

          <ErrorBoundary fallback={(props) => <FallbackUI {...props} />}>
            <PriceChart products={selectedProducts} />
          </ErrorBoundary>

          <ErrorBoundary>
            <div className="galleries-section">
              <h2>Product Galleries</h2>
              {selectedProducts.map((product) => (
                <ImageGallery
                  key={product.id}
                  images={product.images}
                  productName={product.name}
                />
              ))}
            </div>
          </ErrorBoundary>

          {compatMatrix.length > 0 && (
            <div className="compat-section">
              <h2>Compatibility Matrix</h2>
              <table className="compat-table">
                <thead>
                  <tr>
                    <th></th>
                    {selectedProducts.map((p) => (
                      <th key={p.id}>{p.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {selectedProducts.map((p, i) => (
                    <tr key={p.id}>
                      <td className="compat-label">{p.name}</td>
                      {compatMatrix[i] && compatMatrix[i].map((score, j) => (
                        <td key={selectedProducts[j]?.id || j} className="compat-cell">{score}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="sort-controls">
            <label>Sort comparison by: </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="name">Name</option>
              <option value="price">Price</option>
              <option value="rating">Rating</option>
            </select>
          </div>
        </>
      )}
    </div>
  )
}

function ProductComparison() {
  return (
    <ComparisonProvider>
      <ProductComparisonInner />
    </ComparisonProvider>
  )
}

export default ProductComparison
