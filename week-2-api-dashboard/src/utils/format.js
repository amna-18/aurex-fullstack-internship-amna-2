const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

export function formatPrice(value) {
  return currency.format(Number(value) || 0)
}

// The API stores the list price and a discount percentage separately.
export function finalPrice(product) {
  const discount = Number(product.discountPercentage) || 0
  return Number(product.price) * (1 - discount / 100)
}

export function hasDiscount(product) {
  return Number(product.discountPercentage) > 0.5
}

export function stockInfo(product) {
  const stock = Number(product.stock)
  if (!Number.isFinite(stock) || stock <= 0) return { label: 'Out of stock', tone: 'out' }
  if (stock < 10) return { label: `Only ${stock} left`, tone: 'low' }
  return { label: 'In stock', tone: 'in' }
}

export function titleCase(text) {
  return String(text ?? '')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}

export function formatDate(isoString) {
  const date = new Date(isoString)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}
