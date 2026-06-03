const Spinner = ({ label = 'Loading...' }) => (
  <div className="flex flex-col items-center justify-center gap-4 py-16" role="status" aria-live="polite">
    <div className="relative h-10 w-10">
      <div className="absolute inset-0 rounded-full border-2 border-stone-200" />
      <div className="absolute inset-0 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
    </div>
    <p className="text-sm font-medium text-stone-500">{label}</p>
  </div>
)

export default Spinner
