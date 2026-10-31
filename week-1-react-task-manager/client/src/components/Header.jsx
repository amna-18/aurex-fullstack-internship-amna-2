function Header({ total, active, completed, theme, onToggleTheme }) {
  return (
    <header className="header">
      <div className="header__top">
        <div>
          <h1>Taskly</h1>
          <p className="header__tagline">
            Your day, sorted — nothing fancy, just done.
          </p>
        </div>
        <button className="theme-btn" onClick={onToggleTheme}>
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
      </div>

      <div className="stats">
        <div className="stat">
          <span className="stat__num">{total}</span>
          <span className="stat__label">Total tasks</span>
        </div>
        <div className="stat">
          <span className="stat__num stat__num--progress">{active}</span>
          <span className="stat__label">In progress</span>
        </div>
        <div className="stat">
          <span className="stat__num stat__num--done">{completed}</span>
          <span className="stat__label">Completed</span>
        </div>
      </div>
    </header>
  )
}

export default Header