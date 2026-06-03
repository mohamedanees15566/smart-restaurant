import Button from './Button'

const EmptyState = ({ icon = '📭', title, description, actionLabel, onAction }) => (
  <div className="animate-slide-up flex flex-col items-center justify-center py-16 text-center">
    <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-stone-100 text-4xl">
      {icon}
    </div>
    <h3 className="text-lg font-semibold text-stone-800">{title}</h3>
    {description && <p className="mt-1 max-w-sm text-sm text-stone-500">{description}</p>}
    {actionLabel && onAction && (
      <Button className="mt-6" onClick={onAction}>
        {actionLabel}
      </Button>
    )}
  </div>
)

export default EmptyState
