const PageHeader = ({ title, subtitle, action, className = '' }) => (
  <div className={`mb-8 flex flex-wrap items-end justify-between gap-4 ${className}`}>
    <div>
      <h1 className="section-title">{title}</h1>
      {subtitle && <p className="section-subtitle">{subtitle}</p>}
    </div>
    {action && <div className="flex-shrink-0">{action}</div>}
  </div>
)

export default PageHeader
