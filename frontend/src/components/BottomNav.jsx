import { Link, useLocation } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import useCartStore from '../store/cartStore'

const tabs = [
  { to: '/', label: 'Home', icon: '🏠' },
  { to: '/menu', label: 'Menu', icon: '🍽' },
  { to: '/cart', label: 'Cart', icon: '🛒', badge: true },
  { to: '/queue', label: 'Queue', icon: '⏳' },
  { to: '/orders', label: 'Orders', icon: '📋' },
  { to: '/profile', label: 'Profile', icon: '👤' },
]

const BottomNav = () => {
  const { token } = useAuthStore()
  const { getCount } = useCartStore()
  const location = useLocation()

  if (!token) return null

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-stone-200/80 bg-white/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden"
      aria-label="Mobile navigation"
    >
      <div className="flex items-stretch justify-around px-1 py-2">
        {tabs.map((tab) => {
          const active = location.pathname === tab.to
          return (
            <Link
              key={tab.to}
              to={tab.to}
              className={`relative flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-xl px-1 py-1.5 transition-all duration-200 ${active ? 'text-orange-600' : 'text-stone-500'}`}
            >
              <span className={`relative text-xl transition-transform ${active ? 'scale-110' : ''}`}>
                {tab.icon}
                {tab.badge && getCount() > 0 && (
                  <span className="absolute -right-2 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-orange-500 px-1 text-[9px] font-bold text-white shadow-sm">
                    {getCount()}
                  </span>
                )}
              </span>
              <span className={`text-[10px] font-semibold ${active ? 'text-orange-600' : ''}`}>{tab.label}</span>
              {active && <span className="absolute bottom-0 h-0.5 w-6 rounded-full bg-orange-500" />}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

export default BottomNav
