const Card = ({ children, className = '', hover = false, glass = false, ...props }) => (
  <div
    className={`${glass ? 'card-glass' : 'card'} ${hover ? 'card-hover' : ''} ${className}`}
    {...props}
  >
    {children}
  </div>
)

export default Card
