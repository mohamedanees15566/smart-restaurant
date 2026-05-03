import { Link, useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import useCartStore from '../store/cartStore'
import NotificationBell from './NotificationBell'
import api from '../services/api'

const Navbar = () => {
  const { user, token, logout } = useAuthStore()
  const { getCount } = useCartStore()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await api.post('/logout')
    } catch (err) {
      console.error(err)
    } finally {
      logout()
      navigate('/')
    }
  }

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-orange-500">
          🍽️ SmartResto
        </Link>

        <div className="flex items-center gap-5">
          <Link to="/" className="text-sm text-gray-600 hover:text-orange-500 transition">Home</Link>
          <Link to="/menu" className="text-sm text-gray-600 hover:text-orange-500 transition">Menu</Link>
          <Link to="/queue" className="text-sm text-gray-600 hover:text-orange-500 transition">Queue</Link>

          {token ? (
            <div className="flex items-center gap-4">
              {user?.role === 'admin' && (
                <Link to="/admin" className="text-sm text-purple-600 font-medium hover:underline">Admin</Link>
              )}
              {(user?.role === 'staff' || user?.role === 'admin') && (
                <Link to="/staff" className="text-sm text-blue-600 font-medium hover:underline">Staff</Link>
              )}
              <Link to="/orders" className="text-sm text-gray-600 hover:text-orange-500 transition">Orders</Link>
              <Link to="/cart" className="text-sm text-gray-600 hover:text-orange-500 relative">
                🛒
                {getCount() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                    {getCount()}
                  </span>
                )}
              </Link>
              <NotificationBell />
              <Link to="/profile" className="text-sm text-gray-600 hover:text-orange-500 transition">
                👤 {user?.name?.split(' ')[0]}
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm bg-red-50 text-red-500 px-4 py-1.5 rounded-lg hover:bg-red-100 transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-sm text-gray-600 hover:text-orange-500 transition">Login</Link>
              <Link to="/register" className="text-sm bg-orange-500 text-white px-4 py-1.5 rounded-lg hover:bg-orange-600 transition">Register</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar