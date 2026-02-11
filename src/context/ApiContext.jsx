import { createContext, useContext } from 'react'

const defaultApi = { baseUrl: 'https://jsonplaceholder.typicode.com' }
const ApiContext = createContext(defaultApi)

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
