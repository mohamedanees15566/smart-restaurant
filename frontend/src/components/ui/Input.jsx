const Input = ({ label, error, className = '', id, ...props }) => {
  const inputId = id || props.name
  return (
    <div className={className}>
      {label && (
        <label htmlFor={inputId} className="input-label">
          {label}
        </label>
      )}
      <input id={inputId} className={`input-field ${error ? 'border-red-300 focus:border-red-400 focus:ring-red-500/15' : ''}`} {...props} />
      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
    </div>
  )
}

export default Input
