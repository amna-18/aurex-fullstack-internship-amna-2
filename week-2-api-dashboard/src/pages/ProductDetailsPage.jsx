import { useState } from 'react'
import { useProduct } from '../hooks/useProduct'
import { useProducts } from '../context/productsContext'
import { Spinner } from '../components/Loader'
import ErrorMessage from '../components/ErrorMessage'
import { finalPrice, formatDate, formatPrice, hasDiscount, stockInfo, titleCase } from '../utils/format'

function ProductDetailsPage({ id, onNavigate }) {
  const { product, status, error } = useProduct(id)
  const { removeProduct } = useProducts()
  const [activeImage, setActiveImage] = useState(0)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState('')

  if (status === 'loading') return <Spinner label="Loading product…" />
  if (status === 'error') {
    return (
      <ErrorMessage title="Product unavailable" message={error}>
        <a className="btn btn--primary btn--link" href="#/">
          Back to products
        </a>
      </ErrorMessage>
    )
  }

  const images = product.images?.length ? product.images : product.thumbnail ? [product.thumbnail] : []
  const mainImage = images[activeImage] ?? images[0]
  const stock = stockInfo(product)
  const onSale = hasDiscount(product)
  const facts = [
    ['SKU', product.sku],
    ['Warranty', product.warrantyInformation],
    ['Shipping', product.shippingInformation],
    ['Returns', product.returnPolicy],
  ].filter(([, value]) => value)

  const handleDelete = async () => {
    if (!window.confirm(`Delete “${product.title}”? This cannot be undone.`)) return
    setDeleting(true)
    setDeleteError('')
    try {
      await removeProduct(product) // DELETE request
      onNavigate('/', { replace: true })
    } catch (err) {
      setDeleteError(err.message || 'Could not delete the product.')
      setDeleting(false)
    }
  }

  return (
    <article className="detail">
      <a className="backlink" href="#/">← Back to products</a>

      <div className="detail__layout">
        <div className="detail__gallery">
          <div className="detail__main">
            {mainImage ? <img src={mainImage} alt={product.title} /> : <span className="card__noimage">No image</span>}
          </div>
          {images.length > 1 && (
            <div className="detail__thumbs">
              {images.map((src, index) => (
                <button
                  key={src}
                  className={`thumb${index === activeImage ? ' thumb--active' : ''}`}
                  onClick={() => setActiveImage(index)}
                  aria-label={`Show image ${index + 1}`}
                  aria-pressed={index === activeImage}
                >
                  <img src={src} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="detail__info">
          <span className="tag">{titleCase(product.category)}</span>
          <h1 className="detail__title">{product.title}</h1>
          {product.brand && <p className="detail__brand">by {product.brand}</p>}

          <div className="card__row">
            <span className="rating">★ {Number(product.rating || 0).toFixed(1)}</span>
            {product.reviews?.length > 0 && (
              <span className="muted">({product.reviews.length} reviews)</span>
            )}
            <span className={`stock stock--${stock.tone}`}>{stock.label}</span>
          </div>

          <div className="detail__price">
            <span className="price price--big">{formatPrice(finalPrice(product))}</span>
            {onSale && (
              <>
                <span className="price price--old">{formatPrice(product.price)}</span>
                <span className="card__sale card__sale--inline">-{Math.round(product.discountPercentage)}%</span>
              </>
            )}
          </div>

          <p className="detail__description">{product.description}</p>

          {product.tags?.length > 0 && (
            <ul className="taglist">
              {product.tags.map((tag) => (
                <li key={tag} className="tag tag--soft">#{tag}</li>
              ))}
            </ul>
          )}

          {facts.length > 0 && (
            <dl className="facts">
              {facts.map(([label, value]) => (
                <div key={label} className="facts__row">
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          )}

          {product._local && (
            <p className="notice">This product was created in this session and is stored only in your browser’s memory.</p>
          )}

          {deleteError && <p className="form__error form__error--box" role="alert">{deleteError}</p>}

          <div className="form__actions">
            <a className="btn btn--primary btn--link" href={`#/edit/${encodeURIComponent(product.id)}`}>
              Edit product
            </a>
            <button className="btn btn--danger" onClick={handleDelete} disabled={deleting}>
              {deleting ? 'Deleting…' : 'Delete'}
            </button>
          </div>
        </div>
      </div>

      {product.reviews?.length > 0 && (
        <section className="reviews">
          <h2>Customer reviews</h2>
          <ul className="reviews__list">
            {product.reviews.map((review, index) => (
              <li className="review" key={`${review.reviewerEmail ?? review.reviewerName}-${index}`}>
                <div className="review__head">
                  <strong>{review.reviewerName}</strong>
                  <span className="rating">{'★'.repeat(review.rating)}{'☆'.repeat(Math.max(0, 5 - review.rating))}</span>
                </div>
                <p>{review.comment}</p>
                {review.date && <span className="muted">{formatDate(review.date)}</span>}
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  )
}

export default ProductDetailsPage
