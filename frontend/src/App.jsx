import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import BottomNav from './components/BottomNav'
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
import Profile from './pages/Profile'
import Payment from './pages/Payment'
import Reservation from './pages/Reservation'
import KitchenDisplay from './pages/KitchenDisplay'
import CustomerHelp from './components/CustomerHelp'

function App() {
  return (
    <BrowserRouter>
      <CustomerHelp />
      <Navbar />
      <div className="pb-[calc(4.5rem+env(safe-area-inset-bottom))] md:pb-0">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/table/:tableNumber" element={<QrScan />} />
          <Route path="/reservation" element={<Reservation />} />

          {/* Customer Routes */}
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
          <Route path="/profile" element={
            <ProtectedRoute roles={['customer', 'staff', 'admin']}>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/payment/:id" element={
            <ProtectedRoute roles={['customer', 'staff', 'admin']}>
              <Payment />
            </ProtectedRoute>
          } />

          {/* Staff Routes */}
          <Route path="/staff" element={
            <ProtectedRoute roles={['staff', 'admin']}>
              <StaffPanel />
            </ProtectedRoute>
          } />
          <Route path="/kitchen" element={
            <ProtectedRoute roles={['staff', 'admin']}>
              <KitchenDisplay />
            </ProtectedRoute>
          } />

          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute roles={['admin']}>
              <AdminPanel />
            </ProtectedRoute>
          } />

          {/* 404 */}
          <Route path="*" element={
            <div className="page-shell flex min-h-[60vh] items-center justify-center">
              <div className="animate-scale-in text-center">
                <p className="text-8xl font-bold tracking-tighter text-stone-200">404</p>
                <h1 className="mt-4 text-xl font-semibold text-stone-800">Page not found</h1>
                <p className="mt-2 text-sm text-stone-500">The page you&apos;re looking for doesn&apos;t exist.</p>
                <a href="/" className="btn-primary mt-8 inline-flex">Back to Home</a>
              </div>
            </div>
          } />
        </Routes>
      </div>
      <BottomNav />
    </BrowserRouter>
  )
}

export default App