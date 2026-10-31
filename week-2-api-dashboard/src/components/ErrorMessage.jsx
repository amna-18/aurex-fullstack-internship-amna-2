// Error state: says what went wrong and (optionally) lets the user try again.
function ErrorMessage({ title = 'Something went wrong', message, onRetry, children }) {
  return (
    <div className="state state--error" role="alert">
      <p className="state__icon" aria-hidden="true">⚠️</p>
      <h2 className="state__title">{title}</h2>
      <p className="state__text">{message}</p>
      <div className="state__actions">
        {onRetry && (
          <button className="btn btn--primary" onClick={onRetry}>
            Try again
          </button>
        )}
        {children}
      </div>
    </div>
  )
}

export default ErrorMessage
