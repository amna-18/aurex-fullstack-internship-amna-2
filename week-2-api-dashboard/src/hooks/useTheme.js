import { useState } from 'react'

const STORAGE_KEY = 'stockly-theme'

function readStoredTheme() {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'dark' ? 'dark' : 'light'
  } catch {
    return 'light'
  }
}

export function useTheme() {
  const [theme, setTheme] = useState(readStoredTheme)

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light'
    setTheme(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // storage can be blocked (private mode) - the theme just won't persist
    }
  }

  return [theme, toggleTheme]
}
