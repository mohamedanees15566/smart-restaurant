import { Link, useLocation } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import useCartStore from '../store/cartStore'

const BottomNav = () => {
  const { token, user } = useAuthStore()
  const { getCount } = useCartStore()
  const location = useLocation()

  if (!token) return null

  const isActive = (path) => location.pathname === path
    ? 'text-orange-500'
    : 'text-gray-400'

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50 md:hidden">
      <div className="flex items-center justify-around py-2">
        <Link to="/" className={`flex flex-col items-center gap-0.5 ${isActive('/')}`}>
          <span className="text-xl">🏠</span>
          <span className="text-xs font-medium">Home</span>
        </Link>

        <Link to="/menu" className={`flex flex-col items-center gap-0.5 ${isActive('/menu')}`}>
          <span className="text-xl">🍽️</span>
          <span className="text-xs font-medium">Menu</span>
        </Link>

        <Link to="/cart" className={`flex flex-col items-center gap-0.5 relative ${isActive('/cart')}`}>
          <span className="text-xl">🛒</span>
          {getCount() > 0 && (
            <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
              {getCount()}
            </span>
          )}
          <span className="text-xs font-medium">Cart</span>
        </Link>

        <Link to="/queue" className={`flex flex-col items-center gap-0.5 ${isActive('/queue')}`}>
          <span className="text-xl">⏳</span>
          <span className="text-xs font-medium">Queue</span>
        </Link>

        <Link to="/orders" className={`flex flex-col items-center gap-0.5 ${isActive('/orders')}`}>
          <span className="text-xl">📋</span>
          <span className="text-xs font-medium">Orders</span>
        </Link>

        <Link to="/profile" className={`flex flex-col items-center gap-0.5 ${isActive('/profile')}`}>
          <span className="text-xl">👤</span>
          <span className="text-xs font-medium">Profile</span>
        </Link>
      </div>
    </div>
  )
}

export default BottomNav