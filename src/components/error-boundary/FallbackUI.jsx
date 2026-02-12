function FallbackUI({ error, onReset }) {
  const errorMessage = error instanceof Error
    ? error.message
    : typeof error === 'string'
    ? error
    : 'An unexpected error occurred'

  return (
    <div className="custom-fallback">
      <div className="fallback-icon">!!!</div>
      <h3>Oops! Something broke</h3>
      <p className="fallback-message">{errorMessage}</p>
      <button onClick={onReset} className="retry-btn">
        Retry
      </button>
    </div>
  )
}

export default FallbackUI
