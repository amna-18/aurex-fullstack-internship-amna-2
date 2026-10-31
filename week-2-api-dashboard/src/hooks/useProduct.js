import { useEffect, useState } from 'react'
import { fetchProduct } from '../api/products'
import { useProducts } from '../context/productsContext'

// Finds ONE product for the detail and edit pages.
// 1. Look in the dashboard's memory first (instant, and includes the user's own changes).
// 2. If it is not there (for example the page was opened from a bookmark), ask the API.
// Pass id = null on the "add product" page - there is nothing to look up.
export function useProduct(id) {
  const { findProduct, isDeleted } = useProducts()
  const skip = id === null
  const known = skip ? null : findProduct(id)
  const hasKnown = known !== null
  const deleted = skip ? false : isDeleted(id)
  const [remote, setRemote] = useState({ id: null, product: null, error: '' })

  useEffect(() => {
    if (skip || hasKnown || deleted) return undefined
    const controller = new AbortController()

    fetchProduct(id, controller.signal)
      .then((product) => setRemote({ id, product, error: '' }))
      .catch((err) => {
        if (err.name === 'AbortError') return
        setRemote({
          id,
          product: null,
          error: err.status === 404 ? 'This product could not be found.' : err.message,
        })
      })

    return () => controller.abort() // cancel the request if the page is left early
  }, [id, skip, hasKnown, deleted])

  if (skip) return { product: null, status: 'idle', error: '' }
  if (deleted) return { product: null, status: 'error', error: 'This product has been deleted.' }
  if (known) return { product: known, status: 'success', error: '' }
  if (remote.id === id) {
    return remote.error
      ? { product: null, status: 'error', error: remote.error }
      : { product: remote.product, status: 'success', error: '' }
  }
  return { product: null, status: 'loading', error: '' }
}
