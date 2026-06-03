import { useEffect, useState, useRef } from 'react'
import api from '../services/api'
import useAuthStore from '../store/authStore'

const NotificationBell = () => {
  const { token } = useAuthStore()
  const [notifications, setNotifications] = useState([])
  const [unread, setUnread] = useState(0)
  const [open, setOpen] = useState(false)
  const ref = useRef()

  useEffect(() => {
    if (!token) return
    fetchNotifications()
    fetchUnread()

    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [token])

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications')
      setNotifications(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  const fetchUnread = async () => {
    try {
      const res = await api.get('/notifications/unread')
      setUnread(res.data.count)
    } catch (err) {
      console.error(err)
    }
  }

  const handleMarkAllRead = async () => {
    try {
      await api.post('/notifications/read-all')
      setUnread(0)
      fetchNotifications()
    } catch (err) {
      console.error(err)
    }
  }

  if (!token) return null

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="relative flex h-9 w-9 items-center justify-center rounded-xl text-stone-600 transition hover:bg-stone-100 hover:text-stone-900"
        aria-label={`Notifications${unread ? `, ${unread} unread` : ''}`}
      >
        🔔
        {unread > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
            {unread}
          </span>
        )}
      </button>

      {open && (
        <div className="animate-scale-in absolute right-0 top-11 z-50 w-80 overflow-hidden rounded-2xl border border-stone-200/80 bg-white/95 shadow-xl backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-stone-100 px-4 py-3">
            <span className="text-sm font-semibold text-stone-800">Notifications</span>
            {unread > 0 && (
              <button type="button" onClick={handleMarkAllRead} className="text-xs font-semibold text-orange-600 hover:underline">
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="py-10 text-center text-sm text-stone-400">No notifications yet</p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`border-b border-stone-50 px-4 py-3 last:border-0 ${!n.read_at ? 'bg-orange-50/60' : ''}`}
                >
                  <p className="text-sm font-medium text-stone-800">{n.title}</p>
                  <p className="mt-0.5 text-xs text-stone-500">{n.message}</p>
                  <p className="mt-1 text-[10px] text-stone-400">{new Date(n.created_at).toLocaleString()}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default NotificationBell
