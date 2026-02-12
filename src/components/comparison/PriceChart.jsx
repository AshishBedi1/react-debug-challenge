import { useState, useMemo } from 'react'

function PriceChart({ products }) {
  const [hovered, setHovered] = useState(null)

  const maxPrice = useMemo(() => {
    return Math.max(...products.map((p) => p.price))
  }, [products])

  return (
    <div className="price-chart">
      <h4>Price Comparison</h4>
      <div className="price-bars">
        {products.map((product) => (
          <div
            key={product.id}
            className={`price-bar-item${hovered === product.id ? ' hovered' : ''}`}
            onMouseEnter={() => setHovered(product.id)}
            onMouseLeave={() => setHovered(null)}
          >
            <div className="price-bar-label">{product.name}</div>
            <div className="price-bar-track">
              <div
                className="price-bar-fill"
                style={{ width: `${(product.price / maxPrice) * 100}%` }}
              />
            </div>
            <div className="price-bar-value">${product.price}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PriceChart
