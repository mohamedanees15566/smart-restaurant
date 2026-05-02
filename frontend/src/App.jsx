import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Menu from './pages/Menu'
import Cart from './pages/Cart'
import Orders from './pages/Orders'
import OrderDetail from './pages/OrderDetail'
import QrScan from './pages/QrScan'
import QueuePage from './pages/QueuePage'
import StaffPanel from './pages/StaffPanel'
import AdminPanel from './pages/AdminPanel'

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/table/:tableNumber" element={<QrScan />} />

        <Route path="/cart" element={
          <ProtectedRoute roles={['customer', 'staff', 'admin']}>
            <Cart />
          </ProtectedRoute>
        } />
        <Route path="/orders" element={
          <ProtectedRoute roles={['customer', 'staff', 'admin']}>
            <Orders />
          </ProtectedRoute>
        } />
        <Route path="/orders/:id" element={
          <ProtectedRoute roles={['customer', 'staff', 'admin']}>
            <OrderDetail />
          </ProtectedRoute>
        } />
        <Route path="/queue" element={
          <ProtectedRoute roles={['customer', 'staff', 'admin']}>
            <QueuePage />
          </ProtectedRoute>
        } />
        <Route path="/staff" element={
          <ProtectedRoute roles={['staff', 'admin']}>
            <StaffPanel />
          </ProtectedRoute>
        } />
        <Route path="/admin" element={
          <ProtectedRoute roles={['admin']}>
            <AdminPanel />
          </ProtectedRoute>
        } />

        <Route path="*" element={
          <div className="min-h-screen flex items-center justify-center text-gray-500">
            <div className="text-center">
              <div className="text-6xl mb-4">404</div>
              <p>Page not found</p>
            </div>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App