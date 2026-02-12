import { useMemo, useCallback } from 'react'
import SpecScore from './SpecScore'

function ComparisonTable({ products, specs, onCellClick, sortBy }) {
  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) => {
      if (sortBy === 'price') return a.price - b.price
      if (sortBy === 'rating') return b.rating - a.rating
      return a.name.localeCompare(b.name)
    })
  }, [products, sortBy])

  const handleCellClick = useCallback((specKey, productId) => {
    onCellClick(specKey, productId)
  }, [onCellClick])

  if (sortedProducts.length === 0) {
    return <p className="no-products">Select products to compare</p>
  }

  return (
    <div className="comparison-table-wrapper">
      <table className="comparison-table">
        <thead>
          <tr>
            <th>Specification</th>
            {sortedProducts.map((product) => (
              <th key={product.id}>{product.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {specs.map((spec) => (
            <tr key={spec.key}>
              <td className="spec-name">{spec.label}</td>
              {sortedProducts.map((product) => (
                <td
                  key={product.id}
                  onClick={() => handleCellClick(spec.key, product.id)}
                  className="spec-cell"
                >
                  {spec.type === 'score' ? (
                    <SpecScore
                      value={product.specs[spec.key] || 0}
                      label={spec.label}
                    />
                  ) : (
                    <span>{product.specs[spec.key] || 'N/A'}</span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ComparisonTable
