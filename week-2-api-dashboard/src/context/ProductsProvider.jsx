import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ProductsContext } from './productsContext'
import {
  createProduct,
  deleteProduct,
  fetchCategories,
  fetchProducts,
  updateProduct,
} from '../api/products'

const INITIAL_FILTERS = { query: '', category: '', sortId: 'default', page: 1 }
const EMPTY_LOCAL = { added: [], edited: {}, deleted: [] }
const SEARCH_DELAY_MS = 400

function matchesFilters(product, { query, category }) {
  if (category && product.category !== category) return false
  if (query) {
    const text = query.toLowerCase()
    return (
      product.title.toLowerCase().includes(text) ||
      (product.description ?? '').toLowerCase().includes(text)
    )
  }
  return true
}

// ProductsProvider owns the "application-level" data of the dashboard:
//   - what the user is looking for (filters)
//   - what the API returned (data / status / error)
//   - the changes the user made (local) - DummyJSON only *simulates* POST/PUT/DELETE,
//     so we remember those changes here to keep the UI honest during the session.
export function ProductsProvider({ children }) {
  const [filters, setFilters] = useState(INITIAL_FILTERS)
  const [searchText, setSearchTextState] = useState('') // what is typed in the box (instant)
  const [data, setData] = useState({ products: [], total: 0 })
  const [status, setStatus] = useState('loading') // 'loading' | 'success' | 'error'
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)
  const [categories, setCategories] = useState([])
  const [local, setLocal] = useState(EMPTY_LOCAL)
  const searchTimer = useRef(null)

  // Fetch products whenever the filters change (or the user presses "Try again").
  // The cleanup function aborts the previous request so an old, slow response
  // can never overwrite a newer one.
  useEffect(() => {
    const controller = new AbortController()

    fetchProducts(filters, controller.signal)
      .then((result) => {
        setData({ products: result.products, total: result.total })
        setError('')
        setStatus('success')
      })
      .catch((err) => {
        if (err.name === 'AbortError') return
        setError(err.message || 'Something went wrong while loading products.')
        setStatus('error')
      })

    return () => controller.abort()
  }, [filters, reloadKey])

  // Categories are fetched once, when the app starts.
  useEffect(() => {
    const controller = new AbortController()
    fetchCategories(controller.signal)
      .then(setCategories)
      .catch(() => {
        // The category filter is optional - if this request fails the rest of the app still works.
      })
    return () => controller.abort()
  }, [])

  // Stop a pending debounce timer when the provider unmounts.
  useEffect(() => () => clearTimeout(searchTimer.current), [])

  const updateFilters = useCallback((patch) => {
    setFilters((previous) => ({ ...previous, ...patch }))
    setStatus('loading')
  }, [])

  // Debounce: wait until the user stops typing before asking the API.
  const setSearchText = useCallback(
    (value) => {
      setSearchTextState(value)
      clearTimeout(searchTimer.current)
      searchTimer.current = setTimeout(() => {
        const query = value.trim()
        // The API cannot combine search + category, so a new search leaves category mode.
        updateFilters(query ? { query, category: '', page: 1 } : { query: '', page: 1 })
      }, SEARCH_DELAY_MS)
    },
    [updateFilters]
  )

  const setCategory = useCallback(
    (slug) => {
      clearTimeout(searchTimer.current)
      setSearchTextState('')
      updateFilters({ category: slug, query: '', page: 1 })
    },
    [updateFilters]
  )

  const setSort = useCallback((sortId) => updateFilters({ sortId, page: 1 }), [updateFilters])
  const setPage = useCallback((page) => updateFilters({ page }), [updateFilters])

  const resetFilters = useCallback(() => {
    clearTimeout(searchTimer.current)
    setSearchTextState('')
    updateFilters(INITIAL_FILTERS)
  }, [updateFilters])

  const reload = useCallback(() => {
    setStatus('loading')
    setReloadKey((key) => key + 1)
  }, [])

  // Products shown on screen = API results + the user's local changes.
  const products = useMemo(() => {
    const fromApi = data.products
      .filter((product) => !local.deleted.includes(String(product.id)))
      .map((product) => local.edited[product.id] ?? product)
    const added =
      filters.page === 1 ? local.added.filter((product) => matchesFilters(product, filters)) : []
    return [...added, ...fromApi]
  }, [data.products, local, filters])

  const findProduct = useCallback(
    (id) => {
      const key = String(id)
      return (
        local.added.find((product) => String(product.id) === key) ??
        local.edited[key] ??
        data.products.find((product) => String(product.id) === key) ??
        null
      )
    },
    [local, data.products]
  )

  const isDeleted = useCallback((id) => local.deleted.includes(String(id)), [local.deleted])

  // ----- write operations: call the API first, then record the change locally -----

  const addProduct = useCallback(async (values) => {
    const created = await createProduct(values) // POST /products/add
    const product = {
      rating: 0,
      reviews: [],
      tags: [],
      images: values.thumbnail ? [values.thumbnail] : [],
      ...created,
      id: `local-${Date.now()}`, // the API returns the same id every time, so we make our own
      _local: true,
    }
    setLocal((previous) => ({ ...previous, added: [product, ...previous.added] }))
    return product
  }, [])

  const editProduct = useCallback(async (current, values) => {
    if (!current._local) {
      await updateProduct(current.id, values) // PUT /products/:id
    }
    const updated = {
      ...current,
      ...values,
      ...(current._local ? { images: values.thumbnail ? [values.thumbnail] : [] } : {}),
    }
    setLocal((previous) =>
      current._local
        ? { ...previous, added: previous.added.map((p) => (p.id === current.id ? updated : p)) }
        : { ...previous, edited: { ...previous.edited, [current.id]: updated } }
    )
    return updated
  }, [])

  const removeProduct = useCallback(async (product) => {
    if (!product._local) {
      await deleteProduct(product.id) // DELETE /products/:id
    }
    setLocal((previous) => ({
      ...previous,
      added: previous.added.filter((p) => p.id !== product.id),
      deleted: [...previous.deleted, String(product.id)],
    }))
  }, [])

  const value = useMemo(
    () => ({
      filters,
      searchText,
      status,
      error,
      total: data.total,
      products,
      categories,
      setSearchText,
      setCategory,
      setSort,
      setPage,
      resetFilters,
      reload,
      findProduct,
      isDeleted,
      addProduct,
      editProduct,
      removeProduct,
    }),
    [
      filters, searchText, status, error, data.total, products, categories,
      setSearchText, setCategory, setSort, setPage, resetFilters, reload,
      findProduct, isDeleted, addProduct, editProduct, removeProduct,
    ]
  )

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>
}
