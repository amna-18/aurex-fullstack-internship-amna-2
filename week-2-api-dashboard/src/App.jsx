import Header from './components/Header'
import EmptyState from './components/EmptyState'
import { ProductsProvider } from './context/ProductsProvider'
import { matchRoute, useHashRoute } from './hooks/useHashRoute'
import { useTheme } from './hooks/useTheme'
import ProductsPage from './pages/ProductsPage'
import ProductDetailsPage from './pages/ProductDetailsPage'
import ProductFormPage from './pages/ProductFormPage'

function App() {
  const { path, navigate } = useHashRoute()
  const [theme, toggleTheme] = useTheme()
  const route = matchRoute(path)

  let page
  switch (route.name) {
    case 'list':
      page = <ProductsPage />
      break
    case 'detail':
      page = <ProductDetailsPage key={route.id} id={route.id} onNavigate={navigate} />
      break
    case 'new':
      page = <ProductFormPage onNavigate={navigate} />
      break
    case 'edit':
      page = <ProductFormPage key={route.id} id={route.id} onNavigate={navigate} />
      break
    default:
      page = (
        <EmptyState icon="🧭" title="Page not found" message="That address does not exist in Stockly.">
          <a className="btn btn--primary btn--link" href="#/">
            Go to products
          </a>
        </EmptyState>
      )
  }

  return (
    // The provider sits above the pages, so list, detail and form all share one set of data.
    <ProductsProvider>
      <div className="page" data-theme={theme}>
        <Header path={path} theme={theme} onToggleTheme={toggleTheme} />
        <main className="container">{page}</main>
        <footer className="footer">
          Data from the public <a href="https://dummyjson.com" target="_blank" rel="noreferrer">DummyJSON</a> API ·
          AUREX Full-Stack Internship · Month 2 · Week 2
        </footer>
      </div>
    </ProductsProvider>
  )
}

export default App
