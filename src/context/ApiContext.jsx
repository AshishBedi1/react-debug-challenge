import { createContext, useContext } from 'react'

const ApiContext = createContext(null)

export function ApiProvider({ children }) {
  const value = {
    baseUrl: 'https://jsonplaceholder.typicode.com',
  }
  return (
    <ApiContext.Provider value={value}>
      {children}
    </ApiContext.Provider>
  )
}

export function useApi() {
  const ctx = useContext(ApiContext)
  return ctx
}
