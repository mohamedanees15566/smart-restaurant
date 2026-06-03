const variants = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  ghost: 'btn-ghost',
  danger: 'btn-danger',
}

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  type = 'button',
  ...props
}) => (
  <button
    type={type}
    className={`${variants[variant] || variants.primary} ${size === 'sm' ? 'btn-sm' : ''} ${className}`}
    {...props}
  >
    {children}
  </button>
)

export default Button
