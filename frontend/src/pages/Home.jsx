import { Link } from 'react-router-dom'
import useAuthStore from '../store/authStore'

const features = [
  { icon: '📱', title: 'QR Code Ordering', desc: 'Scan your table QR code and order instantly from your phone' },
  { icon: '⏳', title: 'Virtual Queue', desc: 'Join the queue from anywhere and get notified when your table is ready' },
  { icon: '🔴', title: 'Live Order Tracking', desc: 'Track your order in real-time from placed to served' },
  { icon: '⭐', title: 'Rate & Review', desc: 'Share your experience and help us improve our service' },
  { icon: '🍽️', title: 'Pre-Order Food', desc: 'Order your food before you arrive to save time' },
  { icon: '💳', title: 'Easy Payment', desc: 'Pay online quickly and securely without waiting for the bill' },
]

const Home = () => {
  const { token, user } = useAuthStore()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white py-24 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 text-9xl flex items-center justify-center select-none">
          🍽️
        </div>
        <div className="relative z-10">
          <div className="inline-block bg-white bg-opacity-20 text-orange-100 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 tracking-widest uppercase">
            Smart Restaurant System
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Fresh Food,<br />Fast Service 🍽️
          </h1>
          <p className="text-orange-100 text-lg mb-10 max-w-xl mx-auto">
            Browse our menu, pre-order your food, and skip the wait with our smart queue system.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              to="/menu"
              className="bg-white text-orange-500 font-bold px-8 py-3 rounded-full hover:bg-orange-50 transition shadow-lg"
            >
              Browse Menu
            </Link>
            <Link
              to="/queue"
              className="border-2 border-white text-white font-bold px-8 py-3 rounded-full hover:bg-orange-600 transition"
            >
              Join Queue
            </Link>
          </div>
        </div>
      </div>

      {/* Welcome back if logged in */}
      {token && (
        <div className="bg-orange-50 border-b border-orange-100 px-4 py-3 text-center">
          <p className="text-orange-600 text-sm font-medium">
            👋 Welcome back, {user?.name}! Ready to order?{' '}
            <Link to="/menu" className="underline font-bold">Browse Menu</Link>
          </p>
        </div>
      )}

      {/* Features */}
      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Why SmartResto?</h2>
          <p className="text-gray-400 text-sm max-w-md mx-auto">
            Everything you need for a seamless dining experience
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition text-center">
              <div className="text-4xl mb-3">{f.icon}</div>
              <h3 className="font-semibold text-gray-800 mb-2">{f.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div className="bg-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-3">How it works</h2>
            <p className="text-gray-400 text-sm">Simple steps to enjoy your meal</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: '01', icon: '📱', title: 'Scan QR Code', desc: 'Scan the QR code on your table' },
              { step: '02', icon: '🍽️', title: 'Browse & Order', desc: 'Choose from our delicious menu' },
              { step: '03', icon: '👨‍🍳', title: 'We Prepare', desc: 'Kitchen gets your order instantly' },
              { step: '04', icon: '🔔', title: 'Get Notified', desc: 'We notify you when food is ready' },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl mb-2">{s.icon}</div>
                <div className="text-xs font-bold text-orange-500 mb-1">STEP {s.step}</div>
                <h3 className="font-semibold text-gray-800 mb-1 text-sm">{s.title}</h3>
                <p className="text-gray-400 text-xs leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      {!token && (
        <div className="bg-gray-900 text-white py-16 px-4 text-center">
          <h2 className="text-2xl font-bold mb-3">Ready to order?</h2>
          <p className="text-gray-400 mb-8 text-sm">
            Create an account and enjoy a seamless dining experience
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              to="/register"
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-3 rounded-full transition"
            >
              Create Account
            </Link>
            <Link
              to="/menu"
              className="border border-gray-600 text-gray-300 hover:border-gray-400 font-bold px-8 py-3 rounded-full transition"
            >
              Browse Menu
            </Link>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-950 text-gray-500 py-8 px-4 text-center text-xs">
        <p className="text-xl font-bold text-orange-500 mb-2">🍽️ SmartResto</p>
        <p>Smart Restaurant Pre-Order & Queue Management System</p>
        <p className="mt-1">© 2026 SmartResto. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default Home