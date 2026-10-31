import { useCallback, useEffect, useState } from 'react'

// A tiny router built on the URL hash (#/product/5). It gives the app real
// navigation - the back button, bookmarks and shareable links all work - without
// adding a library. Hash routes also need no special server settings on Vercel.

function readPath() {
  const raw = window.location.hash.replace(/^#/, '')
  if (raw === '') return '/'
  return raw.startsWith('/') ? raw : `/${raw}`
}

export function useHashRoute() {
  const [path, setPath] = useState(readPath)

  useEffect(() => {
    const handleChange = () => setPath(readPath())
    window.addEventListener('hashchange', handleChange)
    return () => window.removeEventListener('hashchange', handleChange) // cleanup
  }, [])

  const navigate = useCallback((to, { replace = false } = {}) => {
    if (replace) {
      window.location.replace(`#${to}`)
    } else {
      window.location.hash = to
    }
  }, [])

  return { path, navigate }
}

// '/product/5' -> { name: 'detail', id: '5' }
export function matchRoute(path) {
  const parts = path.split('/').filter(Boolean)
  if (parts.length === 0) return { name: 'list' }
  if (parts[0] === 'product' && parts[1]) return { name: 'detail', id: decodeURIComponent(parts[1]) }
  if (parts[0] === 'new' && parts.length === 1) return { name: 'new' }
  if (parts[0] === 'edit' && parts[1]) return { name: 'edit', id: decodeURIComponent(parts[1]) }
  return { name: 'notfound' }
}
