import { PAGE_SIZE } from '../api/products'
import { useProducts } from '../context/productsContext'
import Toolbar from '../components/Toolbar'
import ProductGrid from '../components/ProductGrid'
import Pagination from '../components/Pagination'
import { ProductGridSkeleton } from '../components/Loader'
import ErrorMessage from '../components/ErrorMessage'
import EmptyState from '../components/EmptyState'
import { titleCase } from '../utils/format'

function ProductsPage() {
  const {
    filters, searchText, status, error, total, products, categories,
    setSearchText, setCategory, setSort, setPage, resetFilters, reload,
  } = useProducts()

  const canReset = Boolean(searchText || filters.query || filters.category || filters.sortId !== 'default')

  const handlePageChange = (page) => {
    setPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // The four states of an API-driven screen: loading, error, empty, success.
  let content
  if (status === 'loading') {
    content = <ProductGridSkeleton />
  } else if (status === 'error') {
    content = <ErrorMessage title="We couldn’t load the products" message={error} onRetry={reload} />
  } else if (products.length === 0) {
    content = (
      <EmptyState
        title="No products found"
        message={
          filters.query
            ? `Nothing matched “${filters.query}”. Check the spelling or try a different word.`
            : 'There are no products in this category.'
        }
      >
        <button className="btn btn--primary" onClick={resetFilters}>
          Clear filters
        </button>
      </EmptyState>
    )
  } else {
    content = (
      <>
        <ProductGrid products={products} />
        <Pagination page={filters.page} total={total} pageSize={PAGE_SIZE} onChange={handlePageChange} />
      </>
    )
  }

  let summary = ''
  if (status === 'success') {
    summary = `${total} product${total === 1 ? '' : 's'}`
    if (filters.query) summary += ` matching “${filters.query}”`
    else if (filters.category) summary += ` in ${titleCase(filters.category)}`
  }

  return (
    <section>
      <div className="pagehead">
        <h1>Products</h1>
        <p className="pagehead__sub">Browse, search and manage the catalogue.</p>
      </div>
      <Toolbar
        searchText={searchText}
        filters={filters}
        categories={categories}
        canReset={canReset}
        onSearch={setSearchText}
        onCategory={setCategory}
        onSort={setSort}
        onReset={resetFilters}
      />
      <p className="resultinfo" aria-live="polite">
        {summary}
      </p>
      {content}
    </section>
  )
}

export default ProductsPage
