import { useEffect } from 'react'

const styles = {
  success: 'bg-emerald-600 shadow-emerald-600/20',
  error: 'bg-red-600 shadow-red-600/20',
  info: 'bg-stone-800 shadow-stone-900/20',
}

const icons = { success: '✓', error: '✕', info: 'ℹ' }

const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3500)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div
      role="alert"
      className={`animate-slide-up fixed top-4 right-4 z-[110] flex max-w-sm items-center gap-3 rounded-2xl px-5 py-3.5 text-sm font-medium text-white shadow-xl ${styles[type]}`}
    >
      <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-white/20 text-xs">
        {icons[type]}
      </span>
      <span className="flex-1">{message}</span>
      <button
        type="button"
        onClick={onClose}
        className="rounded-lg p-1 text-white/80 transition hover:bg-white/10 hover:text-white"
        aria-label="Dismiss"
      >
        ✕
      </button>
    </div>
  )
}

export default Toast
