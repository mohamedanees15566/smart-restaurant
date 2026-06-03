import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'
import useAuthStore from '../store/authStore'
import useCartStore from '../store/cartStore'
import NotificationBell from './NotificationBell'
import api from '../services/api'
import Button from './ui/Button'

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/menu', label: 'Menu' },
  { to: '/queue', label: 'Queue' },
  { to: '/reservation', label: 'Reserve' },
]

const Navbar = () => {
  const { user, token, logout } = useAuthStore()
  const { getCount } = useCartStore()
  const navigate = useNavigate()
  const location = useLocation()
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

  const isActive = (path) =>
    location.pathname === path ? 'nav-link-active' : 'nav-link'

  const closeMobile = () => setMenuOpen(false)

  return (
    <header className="glass-nav">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6">
        <Link
          to="/"
          className="group flex items-center gap-2 text-lg font-bold tracking-tight text-stone-900 transition hover:text-orange-600"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 text-sm text-white shadow-md shadow-orange-500/25 transition group-hover:scale-105">
            🍽
          </span>
          <span>SmartResto</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {navItems.map((item) => (
            <Link key={item.to} to={item.to} className={`rounded-lg px-3 py-2 ${isActive(item.to)}`}>
              {item.label}
            </Link>
          ))}

          {token ? (
            <div className="ml-2 flex items-center gap-1 border-l border-stone-200 pl-4">
              {user?.role === 'admin' && (
                <Link to="/admin" className="rounded-lg px-3 py-2 text-sm font-medium text-violet-600 hover:bg-violet-50">
                  Admin
                </Link>
              )}
              {(user?.role === 'staff' || user?.role === 'admin') && (
                <>
                  <Link to="/staff" className="rounded-lg px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50">
                    Staff
                  </Link>
                  <Link to="/kitchen" className="rounded-lg px-3 py-2 text-sm font-medium text-emerald-600 hover:bg-emerald-50">
                    Kitchen
                  </Link>
                </>
              )}
              <Link to="/orders" className={`rounded-lg px-3 py-2 ${isActive('/orders')}`}>
                Orders
              </Link>
              <Link
                to="/cart"
                className={`relative rounded-lg px-3 py-2 ${isActive('/cart')}`}
                aria-label={`Cart, ${getCount()} items`}
              >
                Cart
                {getCount() > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1 text-[10px] font-bold text-white">
                    {getCount()}
                  </span>
                )}
              </Link>
              <NotificationBell />
              <Link to="/profile" className={`rounded-lg px-3 py-2 ${isActive('/profile')}`}>
                {user?.name?.split(' ')[0]}
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="text-red-600 hover:bg-red-50">
                Logout
              </Button>
            </div>
          ) : (
            <div className="ml-2 flex items-center gap-2 border-l border-stone-200 pl-4">
              <Link to="/login" className={isActive('/login')}>
                Login
              </Link>
              <Link to="/register">
                <Button size="sm">Get started</Button>
              </Link>
            </div>
          )}
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          {token && <NotificationBell />}
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-stone-200 bg-white text-stone-700 transition hover:bg-stone-50"
            aria-expanded={menuOpen}
            aria-label="Menu"
          >
            {menuOpen ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="animate-fade-in border-t border-stone-200/80 bg-white/95 px-4 py-4 backdrop-blur-xl md:hidden">
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <Link key={item.to} to={item.to} onClick={closeMobile} className="rounded-xl px-4 py-3 text-sm font-medium text-stone-700 hover:bg-stone-50">
                {item.label}
              </Link>
            ))}
            {token ? (
              <>
                <Link to="/orders" onClick={closeMobile} className="rounded-xl px-4 py-3 text-sm font-medium text-stone-700 hover:bg-stone-50">Orders</Link>
                <Link to="/cart" onClick={closeMobile} className="rounded-xl px-4 py-3 text-sm font-medium text-stone-700 hover:bg-stone-50">
                  Cart {getCount() > 0 && `(${getCount()})`}
                </Link>
                <Link to="/profile" onClick={closeMobile} className="rounded-xl px-4 py-3 text-sm font-medium text-stone-700 hover:bg-stone-50">Profile</Link>
                {user?.role === 'admin' && (
                  <Link to="/admin" onClick={closeMobile} className="rounded-xl px-4 py-3 text-sm font-medium text-violet-600 hover:bg-violet-50">Admin</Link>
                )}
                {(user?.role === 'staff' || user?.role === 'admin') && (
                  <>
                    <Link to="/staff" onClick={closeMobile} className="rounded-xl px-4 py-3 text-sm font-medium text-blue-600 hover:bg-blue-50">Staff</Link>
                    <Link to="/kitchen" onClick={closeMobile} className="rounded-xl px-4 py-3 text-sm font-medium text-emerald-600 hover:bg-emerald-50">Kitchen</Link>
                  </>
                )}
                <button type="button" onClick={() => { handleLogout(); closeMobile() }} className="rounded-xl px-4 py-3 text-left text-sm font-medium text-red-600 hover:bg-red-50">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={closeMobile} className="rounded-xl px-4 py-3 text-sm font-medium text-stone-700 hover:bg-stone-50">Login</Link>
                <Link to="/register" onClick={closeMobile} className="mt-2 block">
                  <Button className="w-full">Get started</Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}

export default Navbar
