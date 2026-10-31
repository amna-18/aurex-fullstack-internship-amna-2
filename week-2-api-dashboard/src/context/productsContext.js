import { createContext, useContext } from 'react'

// The context object and the hook that reads it live here (not in the provider
// file) so that every file exports either components or plain functions.
export const ProductsContext = createContext(null)

export function useProducts() {
  const value = useContext(ProductsContext)
  if (!value) {
    throw new Error('useProducts must be used inside <ProductsProvider>')
  }
  return value
}
