import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import useAuthStore from '../store/authStore'
import useCartStore from '../store/cartStore'
import NotificationBell from './NotificationBell'
import api from '../services/api'

const Navbar = () => {
  const { user, token, logout } = useAuthStore()
  const { getCount } = useCartStore()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

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
        
        {/* Logo */}
        <Link to="/" className="text-xl font-bold text-orange-500">
          🍽️ SmartResto
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-5">
          <Link to="/" className="text-sm text-gray-600 hover:text-orange-500 transition">
            Home
          </Link>

          <Link to="/menu" className="text-sm text-gray-600 hover:text-orange-500 transition">
            Menu
          </Link>

          <Link to="/queue" className="text-sm text-gray-600 hover:text-orange-500 transition">
            Queue
          </Link>

          <Link to="/reservation" className="text-sm text-gray-600 hover:text-orange-500 transition">
            Reserve
          </Link>

          {token ? (
            <div className="flex items-center gap-4">
              
              {user?.role === 'admin' && (
                <Link
                  to="/admin"
                  className="text-sm text-purple-600 font-medium hover:underline"
                >
                  Admin
                </Link>
              )}

              {(user?.role === 'staff' || user?.role === 'admin') && (
                <>
                  <Link
                    to="/staff"
                    className="text-sm text-blue-600 font-medium hover:underline"
                  >
                    Staff
                  </Link>

                  <Link
                    to="/kitchen"
                    className="text-sm text-green-600 font-medium hover:underline"
                  >
                    Kitchen
                  </Link>
                </>
              )}

              <Link
                to="/orders"
                className="text-sm text-gray-600 hover:text-orange-500 transition"
              >
                Orders
              </Link>

              <Link
                to="/cart"
                className="text-sm text-gray-600 hover:text-orange-500 relative"
              >
                🛒
                {getCount() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                    {getCount()}
                  </span>
                )}
              </Link>

              <NotificationBell />

              <Link
                to="/profile"
                className="text-sm text-gray-600 hover:text-orange-500 transition"
              >
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
              <Link
                to="/login"
                className="text-sm text-gray-600 hover:text-orange-500 transition"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="text-sm bg-orange-500 text-white px-4 py-1.5 rounded-lg hover:bg-orange-600 transition"
              >
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Right Side */}
        <div className="flex md:hidden items-center gap-3">
          {token && <NotificationBell />}
          
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-gray-600 text-2xl"
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-3">
          <Link to="/" onClick={() => setMenuOpen(false)} className="block text-sm text-gray-600 py-2">
            🏠 Home
          </Link>

          <Link to="/menu" onClick={() => setMenuOpen(false)} className="block text-sm text-gray-600 py-2">
            🍽️ Menu
          </Link>

          <Link to="/queue" onClick={() => setMenuOpen(false)} className="block text-sm text-gray-600 py-2">
            ⏳ Queue
          </Link>

          <Link to="/reservation" onClick={() => setMenuOpen(false)} className="block text-sm text-gray-600 py-2">
            📅 Reserve
          </Link>

          {token ? (
            <>
              <Link to="/orders" onClick={() => setMenuOpen(false)} className="block text-sm text-gray-600 py-2">
                📋 Orders
              </Link>

              <Link to="/profile" onClick={() => setMenuOpen(false)} className="block text-sm text-gray-600 py-2">
                👤 Profile
              </Link>

              {user?.role === 'admin' && (
                <Link to="/admin" onClick={() => setMenuOpen(false)} className="block text-sm text-purple-600 py-2">
                  🛠️ Admin
                </Link>
              )}

              {(user?.role === 'staff' || user?.role === 'admin') && (
                <>
                  <Link
                    to="/staff"
                    onClick={() => setMenuOpen(false)}
                    className="block text-sm text-blue-600 py-2"
                  >
                    👨‍🍳 Staff
                  </Link>

                  <Link
                    to="/kitchen"
                    onClick={() => setMenuOpen(false)}
                    className="block text-sm text-green-600 py-2"
                  >
                    🍳 Kitchen
                  </Link>
                </>
              )}

              <button
                onClick={() => {
                  handleLogout()
                  setMenuOpen(false)
                }}
                className="block w-full text-left text-sm text-red-500 py-2"
              >
                🚪 Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="block text-sm text-gray-600 py-2"
              >
                Login
              </Link>

              <Link
                to="/register"
                onClick={() => setMenuOpen(false)}
                className="block text-sm bg-orange-500 text-white px-4 py-2 rounded-lg text-center"
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}

export default Navbar