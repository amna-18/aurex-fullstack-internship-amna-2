// All communication with the public DummyJSON REST API lives in this one file.
// Components never call fetch() directly, so the API can be changed in one place.

const BASE_URL = 'https://dummyjson.com'

export const PAGE_SIZE = 12

export const SORT_OPTIONS = [
  { id: 'default', label: 'Featured', sortBy: null, order: null },
  { id: 'price-asc', label: 'Price: low to high', sortBy: 'price', order: 'asc' },
  { id: 'price-desc', label: 'Price: high to low', sortBy: 'price', order: 'desc' },
  { id: 'rating-desc', label: 'Top rated', sortBy: 'rating', order: 'desc' },
  { id: 'title-asc', label: 'Name: A to Z', sortBy: 'title', order: 'asc' },
]

// One helper wraps fetch(): it adds JSON headers (only when there is a body),
// turns HTTP errors (404, 500...) into thrown Errors, and parses the JSON.
async function request(path, { method = 'GET', body, signal } = {}) {
  const options = { method, signal }
  if (body !== undefined) {
    options.headers = { 'Content-Type': 'application/json' }
    options.body = JSON.stringify(body)
  }

  const response = await fetch(`${BASE_URL}${path}`, options)

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`
    try {
      const data = await response.json()
      if (data.message) message = data.message
    } catch {
      // the error response had no JSON body - keep the default message
    }
    const error = new Error(message)
    error.status = response.status
    throw error
  }

  return response.json()
}

// GET /products | /products/search?q= | /products/category/:slug  (with paging + sorting)
export function fetchProducts({ query, category, sortId, page }, signal) {
  const sort = SORT_OPTIONS.find((option) => option.id === sortId) ?? SORT_OPTIONS[0]
  const params = new URLSearchParams({
    limit: String(PAGE_SIZE),
    skip: String((page - 1) * PAGE_SIZE),
  })
  if (sort.sortBy) {
    params.set('sortBy', sort.sortBy)
    params.set('order', sort.order)
  }

  let path = '/products'
  if (query) {
    path = '/products/search'
    params.set('q', query)
  } else if (category) {
    path = `/products/category/${encodeURIComponent(category)}`
  }

  return request(`${path}?${params.toString()}`, { signal })
}

// GET /products/categories  (newer API returns objects, older versions returned strings)
export async function fetchCategories(signal) {
  const data = await request('/products/categories', { signal })
  return data.map((item) =>
    typeof item === 'string'
      ? { slug: item, name: item.replace(/-/g, ' ') }
      : { slug: item.slug, name: item.name }
  )
}

// GET /products/:id
export function fetchProduct(id, signal) {
  return request(`/products/${encodeURIComponent(id)}`, { signal })
}

// POST /products/add      (the API simulates this - nothing is really saved)
export function createProduct(data) {
  return request('/products/add', { method: 'POST', body: data })
}

// PUT /products/:id       (simulated)
export function updateProduct(id, data) {
  return request(`/products/${encodeURIComponent(id)}`, { method: 'PUT', body: data })
}

// DELETE /products/:id    (simulated)
export function deleteProduct(id) {
  return request(`/products/${encodeURIComponent(id)}`, { method: 'DELETE' })
}
