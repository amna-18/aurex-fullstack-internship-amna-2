// Empty state: the request worked, but there is nothing to show.
function EmptyState({ icon = '🔍', title, message, children }) {
  return (
    <div className="state">
      <p className="state__icon" aria-hidden="true">{icon}</p>
      <h2 className="state__title">{title}</h2>
      <p className="state__text">{message}</p>
      {children && <div className="state__actions">{children}</div>}
    </div>
  )
}

export default EmptyState
