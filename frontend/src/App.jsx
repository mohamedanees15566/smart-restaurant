import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Menu from './pages/Menu'
import Cart from './pages/Cart'

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/menu" element={<Menu />} />

        {/* Cart - needs login */}
        <Route
          path="/cart"
          element={
            <ProtectedRoute roles={['customer', 'staff', 'admin']}>
              <Cart />
            </ProtectedRoute>
          }
        />

        {/* Orders */}
        <Route
          path="/orders"
          element={
            <ProtectedRoute roles={['customer', 'staff', 'admin']}>
              <div className="p-8 text-center text-gray-500">Orders page coming in Week 4...</div>
            </ProtectedRoute>
          }
        />

        {/* Staff Protected Routes */}
        <Route
          path="/staff"
          element={
            <ProtectedRoute roles={['staff', 'admin']}>
              <div className="p-8 text-center text-gray-500">Staff panel coming soon...</div>
            </ProtectedRoute>
          }
        />

        {/* Admin Protected Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={['admin']}>
              <div className="p-8 text-center text-gray-500">Admin panel coming soon...</div>
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route
          path="*"
          element={
            <div className="min-h-screen flex items-center justify-center text-gray-500">
              <div className="text-center">
                <div className="text-6xl mb-4">404</div>
                <p>Page not found</p>
              </div>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App