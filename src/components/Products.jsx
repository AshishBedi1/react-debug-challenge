import { useState, useMemo, useCallback } from 'react'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { toast } from 'react-toastify'
import { useCart } from '../hooks/useCart'
import ProductCard from './ProductCard'
import './Products.css'

const products = [
  {
    id: 1,
    name: 'Classic White T-Shirt',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
    category: 'Clothing',
    description: 'Comfortable cotton t-shirt, perfect for everyday wear'
  },
  {
    id: 2,
    name: 'Smartphone Pro Max',
    price: 899.99,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop',
    category: 'Electronics',
    description: 'Latest smartphone with advanced features and camera'
  },
  {
    id: 3,
    name: 'Denim Jacket',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop',
    category: 'Clothing',
    description: 'Stylish denim jacket for all seasons'
  },
  {
    id: 4,
    name: 'Wireless Headphones',
    price: 149.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
    category: 'Electronics',
    description: 'Premium noise-cancelling wireless headphones'
  },
  {
    id: 5,
    name: 'Sneakers Sport',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
    category: 'Footwear',
    description: 'Comfortable running shoes with modern design'
  },
  {
    id: 6,
    name: 'Laptop Ultra',
    price: 1299.99,
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop',
    category: 'Electronics',
    description: 'High-performance laptop for work and gaming'
  },
  {
    id: 7,
    name: 'Leather Watch',
    price: 199.99,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
    category: 'Accessories',
    description: 'Elegant leather strap watch with classic design'
  },
  {
    id: 8,
    name: 'Backpack Travel',
    price: 59.99,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
    category: 'Accessories',
    description: 'Durable travel backpack with multiple compartments'
  },
  {
    id: 9,
    name: 'Running Shorts',
    price: 34.99,
    image: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=400&h=400&fit=crop',
    category: 'Clothing',
    description: 'Lightweight and breathable running shorts'
  },
  {
    id: 10,
    name: 'Gaming Mouse',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=400&h=400&fit=crop',
    category: 'Electronics',
    description: 'Precision gaming mouse with RGB lighting'
  },
  {
    id: 11,
    name: 'Hoodie Classic',
    price: 64.99,
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a4?w=400&h=400&fit=crop',
    category: 'Clothing',
    description: 'Warm and cozy hoodie for casual wear'
  },
  {
    id: 12,
    name: 'Smart Watch',
    price: 249.99,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
    category: 'Electronics',
    description: 'Feature-rich smartwatch with fitness tracking'
  },
  {
    id: 13,
    name: 'Canvas Shoes',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
    category: 'Footwear',
    description: 'Classic canvas shoes for everyday comfort'
  },
  {
    id: 14,
    name: 'Tablet Pro',
    price: 599.99,
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop',
    category: 'Electronics',
    description: 'High-resolution tablet for work and entertainment'
  },
  {
    id: 15,
    name: 'Sunglasses Aviator',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f008b?w=400&h=400&fit=crop',
    category: 'Accessories',
    description: 'Stylish aviator sunglasses with UV protection'
  },
  {
    id: 16,
    name: 'Yoga Mat',
    price: 39.99,
    image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400&h=400&fit=crop',
    category: 'Accessories',
    description: 'Non-slip yoga mat for your fitness routine'
  },
  {
    id: 17,
    name: 'Bluetooth Speaker',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop',
    category: 'Electronics',
    description: 'Portable Bluetooth speaker with rich bass'
  },
  {
    id: 18,
    name: 'Jeans Classic',
    price: 69.99,
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop',
    category: 'Clothing',
    description: 'Classic fit jeans for any occasion'
  },
  {
    id: 19,
    name: 'Dress Shoes',
    price: 119.99,
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop',
    category: 'Footwear',
    description: 'Elegant dress shoes for formal events'
  },
  {
    id: 20,
    name: 'Camera DSLR',
    price: 799.99,
    image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=400&fit=crop',
    category: 'Electronics',
    description: 'Professional DSLR camera for photography'
  },
  {
    id: 21,
    name: 'Winter Coat',
    price: 149.99,
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop',
    category: 'Clothing',
    description: 'Warm winter coat with water-resistant material'
  },
  {
    id: 22,
    name: 'Fitness Tracker',
    price: 99.99,
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400&h=400&fit=crop',
    category: 'Electronics',
    description: 'Advanced fitness tracker with heart rate monitor'
  },
  {
    id: 23,
    name: 'Baseball Cap',
    price: 24.99,
    image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400&h=400&fit=crop',
    category: 'Accessories',
    description: 'Classic baseball cap with adjustable strap'
  },
  {
    id: 24,
    name: 'Hiking Boots',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=400&fit=crop',
    category: 'Footwear',
    description: 'Durable hiking boots for outdoor adventures'
  },
  {
    id: 25,
    name: 'Wireless Earbuds',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf1219a42cc?w=400&h=400&fit=crop',
    category: 'Electronics',
    description: 'True wireless earbuds with noise cancellation'
  },
  {
    id: 26,
    name: 'Polo Shirt',
    price: 44.99,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
    category: 'Clothing',
    description: 'Classic polo shirt for casual and semi-formal wear'
  },
  {
    id: 27,
    name: 'Mechanical Keyboard',
    price: 149.99,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=400&fit=crop',
    category: 'Electronics',
    description: 'RGB mechanical keyboard for gaming and typing'
  },
  {
    id: 28,
    name: 'Leather Belt',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1624222247344-550fb60583fd?w=400&h=400&fit=crop',
    category: 'Accessories',
    description: 'Genuine leather belt with classic buckle'
  },
  {
    id: 29,
    name: 'Sandals Summer',
    price: 39.99,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
    category: 'Footwear',
    description: 'Comfortable summer sandals for beach and casual wear'
  },
  {
    id: 30,
    name: 'Windbreaker Jacket',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop',
    category: 'Clothing',
    description: 'Lightweight windbreaker for outdoor activities'
  },
  {
    id: 31,
    name: 'Monitor 4K',
    price: 399.99,
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop',
    category: 'Electronics',
    description: '27-inch 4K monitor for work and gaming'
  },
  {
    id: 32,
    name: 'Wallet Leather',
    price: 59.99,
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&h=400&fit=crop',
    category: 'Accessories',
    description: 'Slim leather wallet with RFID blocking'
  }
]

function Products() {
  const { cartItems, addToCart } = useCart()
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const productsPerPage = 8

  const totalPages = Math.ceil(products.length / productsPerPage)
  const startIndex = (currentPage - 1) * productsPerPage
  const endIndex = startIndex + productsPerPage
  const pageProducts = products.slice(startIndex, endIndex)

  const currentProducts = useMemo(() => {
    if (!searchTerm.trim()) return pageProducts
    const term = searchTerm.toLowerCase()
    return pageProducts.filter(p => p.name.toLowerCase().includes(term) || p.category.toLowerCase().includes(term))
  }, [pageProducts, searchTerm])

  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Stale closure: callback uses currentPage but deps are [] - always sees initial value
  const handleNextPage = useCallback(() => {
    setCurrentPage(currentPage + 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const handleAddToCart = (product) => {
    const existingItem = cartItems.find(item => item.id === product.id)
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
      category: product.category
    })
    if (existingItem) {
      toast.success(`Added another ${product.name} to cart!`, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
    } else {
      toast.success(`${product.name} added to cart! 🛒`, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        icon: "🛒",
      })
    }
  }

  const getPageNumbers = () => {
    const pages = []
    const maxVisible = 5
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1)
        pages.push('...')
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        pages.push(1)
        pages.push('...')
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(totalPages)
      }
    }
    
    return pages
  }

  return (
    <div className="products-page">
      <div className="products-container">
        <div className="products-header">
          <h1>🛍️ Our Products</h1>
          <p>Discover amazing products at great prices</p>
          <input
            type="text"
            placeholder="Search on this page..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="products-search"
            style={{ marginBottom: '12px', padding: '8px 12px', width: '260px', borderRadius: '8px', border: '1px solid #ddd' }}
          />
          <div className="products-count">
            Showing {startIndex + 1}-{Math.min(endIndex, products.length)} of {products.length} products
          </div>
        </div>

        <div className="products-grid">
          {currentProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <button
              className="pagination-btn"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <FaChevronLeft size={16} />
              Previous
            </button>
            
            <div className="pagination-numbers">
              {getPageNumbers().map((page, index) => (
                page === '...' ? (
                  <span key={`ellipsis-${index}`} className="pagination-ellipsis">...</span>
                ) : (
                  <button
                    key={page}
                    className={`pagination-number ${currentPage === page ? 'active' : ''}`}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                )
              ))}
            </div>
            
            <button
              className="pagination-btn"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              Next
              <FaChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Products
