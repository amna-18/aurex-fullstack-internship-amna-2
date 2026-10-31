function Pagination({ page, total, pageSize, onChange }) {
  const pages = Math.max(1, Math.ceil(total / pageSize))
  if (pages <= 1) return null

  return (
    <nav className="pagination" aria-label="Pagination">
      <button className="btn btn--ghost" disabled={page <= 1} onClick={() => onChange(page - 1)}>
        ← Previous
      </button>
      <span className="pagination__info">
        Page {page} of {pages}
      </span>
      <button className="btn btn--ghost" disabled={page >= pages} onClick={() => onChange(page + 1)}>
        Next →
      </button>
    </nav>
  )
}

export default Pagination
