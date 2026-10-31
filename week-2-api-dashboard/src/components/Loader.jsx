import { PAGE_SIZE } from '../api/products'

// Loading state for a whole page (detail / edit).
export function Spinner({ label = 'Loading…' }) {
  return (
    <div className="spinner-wrap" role="status">
      <div className="spinner" aria-hidden="true" />
      <span>{label}</span>
    </div>
  )
}

// Loading state for the product grid: grey placeholder cards in the same layout.
export function ProductGridSkeleton() {
  return (
    <div role="status" aria-label="Loading products">
      <ul className="grid" aria-hidden="true">
        {Array.from({ length: PAGE_SIZE }, (_, index) => (
          <li className="card card--skeleton" key={index}>
            <div className="skeleton skeleton--image" />
            <div className="card__body">
              <div className="skeleton skeleton--line skeleton--short" />
              <div className="skeleton skeleton--line" />
              <div className="skeleton skeleton--line skeleton--short" />
            </div>
          </li>
        ))}
      </ul>
      <span className="sr-only">Loading products…</span>
    </div>
  )
}
