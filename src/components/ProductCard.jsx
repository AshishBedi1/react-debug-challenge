import './ProductCard.css'

function ProductCard({ product, onAddToCart }) {
  const handleAdd = () => onAddToCart(product)

  return (
    <div className="product-card">
      <div className="product-image-container">
        <img
          src={product.image}
          alt={product.name}
          className="product-image"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x400?text=Product+Image'
          }}
        />
        <div className="product-category">{product.category}</div>
        <button
          className="quick-add-btn"
          onClick={handleAdd}
          title="Add to cart"
        >
          🛒
        </button>
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-description">{product.description}</p>
        <div className="product-footer">
          <span className="product-price">${product.price.toFixed(2)}</span>
          <button className="btn-add-to-cart" onClick={handleAdd}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
