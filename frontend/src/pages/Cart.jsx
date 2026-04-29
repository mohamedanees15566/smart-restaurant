import { useNavigate } from 'react-router-dom'
import useCartStore from '../store/cartStore'
import useAuthStore from '../store/authStore'
import api from '../services/api'
import { useState } from 'react'
import Toast from '../components/Toast'

const Cart = () => {
  const navigate = useNavigate()
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCartStore()
  const { token } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)
  const [notes, setNotes] = useState('')

  const handleOrder = async () => {
    if (!token) {
      navigate('/login', { state: { from: '/cart' } })
      return
    }
    setLoading(true)
    try {
      await api.post('/orders', {
        items: items.map((i) => ({
          menu_item_id: i.id,
          quantity: i.quantity,
          unit_price: i.price,
        })),
        total_amount: getTotal(),
        notes,
      })
      clearCart()
      setToast({ message: 'Order placed successfully! 🎉', type: 'success' })
      setTimeout(() => navigate('/orders'), 1500)
    } catch (err) {
      setToast({ message: 'Failed to place order. Try again.', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-xl font-bold text-gray-700 mb-2">Your cart is empty</h2>
          <p className="text-gray-400 mb-6">Add some items from the menu</p>
          <button
            onClick={() => navigate('/menu')}
            className="bg-orange-500 text-white px-6 py-2.5 rounded-full font-semibold hover:bg-orange-600 transition"
          >
            Browse Menu
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Your Cart 🛒</h1>

        <div className="bg-white rounded-2xl shadow-sm p-6 mb-4">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-4 py-4 border-b border-gray-100 last:border-0">
              <div className="bg-orange-50 w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                🍽️
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-800 text-sm">{item.name}</h3>
                <p className="text-orange-500 text-sm font-semibold">${item.price}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="w-7 h-7 rounded-full bg-gray-100 text-gray-600 font-bold hover:bg-gray-200 transition text-sm"
                >
                  −
                </button>
                <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="w-7 h-7 rounded-full bg-orange-100 text-orange-600 font-bold hover:bg-orange-200 transition text-sm"
                >
                  +
                </button>
              </div>
              <button
                onClick={() => removeItem(item.id)}
                className="text-red-400 hover:text-red-600 text-sm ml-2"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* Notes */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-4">
          <label className="text-sm font-medium text-gray-700 block mb-2">Special Notes (optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any special requests..."
            rows={3}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>

        {/* Total & Order */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-600 font-medium">Total</span>
            <span className="text-2xl font-bold text-orange-500">${getTotal().toFixed(2)}</span>
          </div>
          <button
            onClick={handleOrder}
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl transition text-sm"
          >
            {loading ? 'Placing Order...' : 'Place Order 🎉'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Cart