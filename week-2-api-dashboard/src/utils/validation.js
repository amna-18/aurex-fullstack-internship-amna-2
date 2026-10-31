// Form rules for the add / edit product form. Kept separate from the component
// so the rules are easy to read (and to test) on their own.

export function validateProduct(values) {
  const errors = {}
  const title = values.title.trim()

  if (title.length < 3) errors.title = 'Title must be at least 3 characters.'
  else if (title.length > 80) errors.title = 'Title must be 80 characters or fewer.'

  if (!values.category.trim()) errors.category = 'Choose or type a category.'

  if (values.price.trim() === '') errors.price = 'Price is required.'
  else if (!(Number(values.price) > 0)) errors.price = 'Price must be a number greater than 0.'

  if (values.stock.trim() === '') errors.stock = 'Stock is required.'
  else if (!Number.isInteger(Number(values.stock)) || Number(values.stock) < 0) {
    errors.stock = 'Stock must be a whole number (0 or more).'
  }

  if (values.description.trim().length < 10) {
    errors.description = 'Description must be at least 10 characters.'
  }

  const thumbnail = values.thumbnail.trim()
  if (thumbnail) {
    try {
      const url = new URL(thumbnail)
      if (url.protocol !== 'http:' && url.protocol !== 'https:') throw new Error('bad protocol')
    } catch {
      errors.thumbnail = 'Enter a valid image link starting with http:// or https://'
    }
  }

  return errors
}

// Turns the form's text values into the JSON the API expects.
export function toPayload(values) {
  return {
    title: values.title.trim(),
    brand: values.brand.trim(),
    category: values.category.trim(),
    price: Number(values.price),
    stock: Number(values.stock),
    description: values.description.trim(),
    thumbnail: values.thumbnail.trim(),
  }
}
