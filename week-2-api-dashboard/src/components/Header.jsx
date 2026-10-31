function Header({ path, theme, onToggleTheme }) {
  const onAdd = path === '/new'
  const onProducts = !onAdd

  return (
    <header className="topbar">
      <div className="topbar__inner">
        <a className="brand" href="#/">
          Stockly
        </a>
        <nav className="nav" aria-label="Main">
          <a
            className={`nav__link${onProducts ? ' nav__link--active' : ''}`}
            href="#/"
            aria-current={onProducts ? 'page' : undefined}
          >
            Products
          </a>
          <a
            className={`nav__link${onAdd ? ' nav__link--active' : ''}`}
            href="#/new"
            aria-current={onAdd ? 'page' : undefined}
          >
            Add product
          </a>
        </nav>
        <button className="theme-btn" onClick={onToggleTheme}>
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
      </div>
    </header>
  )
}

export default Header
