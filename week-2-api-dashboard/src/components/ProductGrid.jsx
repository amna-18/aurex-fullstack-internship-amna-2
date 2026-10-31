import ProductCard from './ProductCard'

function ProductGrid({ products }) {
  return (
    <ul className="grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </ul>
  )
}

export default ProductGrid
