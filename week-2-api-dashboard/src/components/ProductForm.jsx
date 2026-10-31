import { useState } from 'react'
import { toPayload, validateProduct } from '../utils/validation'
import { titleCase } from '../utils/format'

const EMPTY_VALUES = {
  title: '',
  brand: '',
  category: '',
  price: '',
  stock: '',
  description: '',
  thumbnail: '',
}

function toFormValues(product) {
  if (!product) return EMPTY_VALUES
  return {
    title: product.title ?? '',
    brand: product.brand ?? '',
    category: product.category ?? '',
    price: String(product.price ?? ''),
    stock: String(product.stock ?? ''),
    description: product.description ?? '',
    thumbnail: product.thumbnail ?? '',
  }
}

// A small wrapper so every field shows its label and its own error message the same way.
function Field({ id, label, error, hint, children }) {
  return (
    <div className="formfield">
      <label className="formfield__label" htmlFor={id}>
        {label}
      </label>
      {children}
      {hint && !error && <p className="formfield__hint">{hint}</p>}
      {error && (
        <p className="form__error" id={`${id}-error`} role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

// Controlled form: every input's value lives in React state (`values`).
// `initial` is the product being edited, or null when adding a new one.
function ProductForm({ initial, categories, submitLabel, onSubmit }) {
  const [values, setValues] = useState(() => toFormValues(initial))
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const handleChange = (event) => {
    const { name, value } = event.target
    setValues((previous) => ({ ...previous, [name]: value }))
    setErrors((previous) => ({ ...previous, [name]: undefined })) // clear this field's error while typing
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const found = validateProduct(values)
    setErrors(found)
    if (Object.keys(found).length > 0) return

    setSubmitting(true)
    setSubmitError('')
    try {
      await onSubmit(toPayload(values))
    } catch (err) {
      setSubmitError(err.message || 'Could not save the product. Please try again.')
      setSubmitting(false)
    }
  }

  const inputClass = (name) => `field${errors[name] ? ' field--invalid' : ''}`

  return (
    <form className="form form--product" onSubmit={handleSubmit} noValidate>
      <div className="form__grid">
        <Field id="title" label="Title" error={errors.title}>
          <input
            id="title" name="title" className={inputClass('title')} type="text"
            value={values.title} onChange={handleChange} aria-invalid={Boolean(errors.title)}
            aria-describedby={errors.title ? 'title-error' : undefined}
          />
        </Field>

        <Field id="brand" label="Brand (optional)">
          <input id="brand" name="brand" className="field" type="text" value={values.brand} onChange={handleChange} />
        </Field>

        <Field id="category" label="Category" error={errors.category} hint="Pick a suggestion or type your own.">
          <input
            id="category" name="category" className={inputClass('category')} type="text" list="category-list"
            value={values.category} onChange={handleChange} aria-invalid={Boolean(errors.category)}
            aria-describedby={errors.category ? 'category-error' : undefined}
          />
          <datalist id="category-list">
            {categories.map((category) => (
              <option key={category.slug} value={category.slug}>
                {titleCase(category.name)}
              </option>
            ))}
          </datalist>
        </Field>

        <Field id="price" label="Price (USD)" error={errors.price}>
          <input
            id="price" name="price" className={inputClass('price')} type="number" step="0.01" min="0"
            value={values.price} onChange={handleChange} aria-invalid={Boolean(errors.price)}
            aria-describedby={errors.price ? 'price-error' : undefined}
          />
        </Field>

        <Field id="stock" label="Stock" error={errors.stock}>
          <input
            id="stock" name="stock" className={inputClass('stock')} type="number" step="1" min="0"
            value={values.stock} onChange={handleChange} aria-invalid={Boolean(errors.stock)}
            aria-describedby={errors.stock ? 'stock-error' : undefined}
          />
        </Field>

        <Field id="thumbnail" label="Image link (optional)" error={errors.thumbnail}>
          <input
            id="thumbnail" name="thumbnail" className={inputClass('thumbnail')} type="url"
            placeholder="https://…" value={values.thumbnail} onChange={handleChange}
            aria-invalid={Boolean(errors.thumbnail)}
            aria-describedby={errors.thumbnail ? 'thumbnail-error' : undefined}
          />
        </Field>
      </div>

      <Field id="description" label="Description" error={errors.description}>
        <textarea
          id="description" name="description" className={inputClass('description')} rows="4"
          value={values.description} onChange={handleChange} aria-invalid={Boolean(errors.description)}
          aria-describedby={errors.description ? 'description-error' : undefined}
        />
      </Field>

      {submitError && (
        <p className="form__error form__error--box" role="alert">
          {submitError}
        </p>
      )}

      <div className="form__actions">
        <button className="btn btn--primary" type="submit" disabled={submitting}>
          {submitting ? 'Saving…' : submitLabel}
        </button>
        <a className="btn btn--ghost btn--link" href="#/">
          Cancel
        </a>
      </div>
    </form>
  )
}

export default ProductForm
