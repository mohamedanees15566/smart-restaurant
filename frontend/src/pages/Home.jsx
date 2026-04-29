import { Link } from 'react-router-dom'
import useAuthStore from '../store/authStore'

const Home = () => {
  const { user, token } = useAuthStore()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-orange-500 text-white py-20 px-4 text-center">
        <h1 className="text-4xl font-bold mb-4">
          Fresh Food, Fast Service 🍽️
        </h1>
        <p className="text-orange-100 text-lg mb-8 max-w-xl mx-auto">
          Browse our menu, pre-order your food, and skip the wait with our smart queue system.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            to="/menu"
            className="bg-white text-orange-500 font-semibold px-8 py-3 rounded-full hover:bg-orange-50 transition"
          >
            Browse Menu
          </Link>
          {!token && (
            <Link
              to="/register"
              className="border-2 border-white text-white font-semibold px-8 py-3 rounded-full hover:bg-orange-600 transition"
            >
              Get Started
            </Link>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-12">
          Why SmartResto?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
            <div className="text-4xl mb-4">📱</div>
            <h3 className="font-semibold text-gray-800 mb-2">QR Code Ordering</h3>
            <p className="text-gray-500 text-sm">Scan your table QR code and order instantly from your phone</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
            <div className="text-4xl mb-4">⏳</div>
            <h3 className="font-semibold text-gray-800 mb-2">Virtual Queue</h3>
            <p className="text-gray-500 text-sm">Join the queue from anywhere and get notified when your table is ready</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
            <div className="text-4xl mb-4">🔴</div>
            <h3 className="font-semibold text-gray-800 mb-2">Live Order Tracking</h3>
            <p className="text-gray-500 text-sm">Track your order in real-time from placed to served</p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      {!token && (
        <div className="bg-gray-800 text-white py-14 px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to order?</h2>
          <p className="text-gray-400 mb-6">Create an account and enjoy a seamless dining experience</p>
          <Link
            to="/register"
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3 rounded-full transition"
          >
            Create Account
          </Link>
        </div>
      )}
    </div>
  )
}

export default Home