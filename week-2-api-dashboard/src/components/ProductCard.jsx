import { finalPrice, formatPrice, hasDiscount, stockInfo, titleCase } from '../utils/format'

function ProductCard({ product }) {
  const stock = stockInfo(product)
  const onSale = hasDiscount(product)

  return (
    <li className="card">
      <a className="card__link" href={`#/product/${encodeURIComponent(product.id)}`}>
        <div className="card__media">
          {product.thumbnail ? (
            <img src={product.thumbnail} alt={product.title} loading="lazy" />
          ) : (
            <span className="card__noimage">No image</span>
          )}
          {onSale && <span className="card__sale">-{Math.round(product.discountPercentage)}%</span>}
        </div>
        <div className="card__body">
          <span className="tag">{titleCase(product.category)}</span>
          <h3 className="card__title">{product.title}</h3>
          <div className="card__row">
            <span className="price">{formatPrice(finalPrice(product))}</span>
            {onSale && <span className="price price--old">{formatPrice(product.price)}</span>}
          </div>
          <div className="card__row card__row--meta">
            <span className="rating">★ {Number(product.rating || 0).toFixed(1)}</span>
            <span className={`stock stock--${stock.tone}`}>{stock.label}</span>
          </div>
        </div>
      </a>
    </li>
  )
}

export default ProductCard
