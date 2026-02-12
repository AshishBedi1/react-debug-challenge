import { createContext, useContext, useState, useMemo, useCallback } from 'react'

const ComparisonContext = createContext(null)

export function ComparisonProvider({ children }) {
  const [selectedProducts, setSelectedProducts] = useState([])
  const [viewMode, setViewMode] = useState('table')

  const addProduct = useCallback((product) => {
    setSelectedProducts((prev) => {
      if (prev.find((p) => p.id === product.id)) return prev
      if (prev.length >= 4) return prev
      return [...prev, product]
    })
  }, [])

  const removeProduct = useCallback((id) => {
    setSelectedProducts((prev) => prev.filter((p) => p.id !== id))
  }, [])

  const value = useMemo(() => ({
    selectedProducts,
    addProduct,
    removeProduct,
    viewMode,
    setViewMode,
  }), [selectedProducts, addProduct, removeProduct, viewMode])

  return (
    <ComparisonContext.Provider value={value}>
      {children}
    </ComparisonContext.Provider>
  )
}

export function useComparison() {
  const ctx = useContext(ComparisonContext)
  if (!ctx) {
    throw new Error('useComparison must be used within ComparisonProvider')
  }
  return ctx
}
