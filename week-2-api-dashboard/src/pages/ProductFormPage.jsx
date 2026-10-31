import { useProduct } from '../hooks/useProduct'
import { useProducts } from '../context/productsContext'
import ProductForm from '../components/ProductForm'
import { Spinner } from '../components/Loader'
import ErrorMessage from '../components/ErrorMessage'

// One page for both "Add product" (id is undefined) and "Edit product" (id given).
function ProductFormPage({ id, onNavigate }) {
  const isEdit = id !== undefined
  const { categories, addProduct, editProduct } = useProducts()
  const { product, status, error } = useProduct(isEdit ? id : null)

  if (isEdit && status === 'loading') return <Spinner label="Loading product…" />
  if (isEdit && status === 'error') {
    return (
      <ErrorMessage title="Product unavailable" message={error}>
        <a className="btn btn--primary btn--link" href="#/">
          Back to products
        </a>
      </ErrorMessage>
    )
  }

  const handleSubmit = async (payload) => {
    if (isEdit) {
      await editProduct(product, payload) // PUT request
      onNavigate(`/product/${encodeURIComponent(product.id)}`)
    } else {
      const created = await addProduct(payload) // POST request
      onNavigate(`/product/${encodeURIComponent(created.id)}`)
    }
  }

  return (
    <section>
      <a className="backlink" href="#/">← Back to products</a>
      <div className="pagehead">
        <h1>{isEdit ? 'Edit product' : 'Add a product'}</h1>
        <p className="pagehead__sub">
          {isEdit ? 'Change the details below and save.' : 'Fill in the details to add a product to the catalogue.'}
        </p>
      </div>
      <p className="notice">
        The demo API only <em>simulates</em> saving. Your change shows up in the dashboard during this
        visit, but the server does not store it.
      </p>
      <ProductForm
        key={isEdit ? String(product.id) : 'new'}
        initial={product}
        categories={categories}
        submitLabel={isEdit ? 'Save changes' : 'Add product'}
        onSubmit={handleSubmit}
      />
    </section>
  )
}

export default ProductFormPage
