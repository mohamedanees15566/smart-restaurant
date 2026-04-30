import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import Spinner from '../components/Spinner'

const statusColors = {
  placed:     'bg-blue-100 text-blue-600',
  confirmed:  'bg-yellow-100 text-yellow-600',
  preparing:  'bg-orange-100 text-orange-600',
  ready:      'bg-green-100 text-green-600',
  served:     'bg-gray-100 text-gray-600',
  cancelled:  'bg-red-100 text-red-600',
}

const statusIcons = {
  placed:     '📝',
  confirmed:  '✅',
  preparing:  '👨‍🍳',
  ready:      '🔔',
  served:     '🍽️',
  cancelled:  '❌',
}

const Orders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders')
      setOrders(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <Spinner />

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">My Orders 📋</h1>

        {orders.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">📋</div>
            <p className="text-gray-500 font-medium">No orders yet</p>
            <Link to="/menu" className="mt-4 inline-block bg-orange-500 text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-orange-600 transition">
              Browse Menu
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Link to={`/orders/${order.id}`} key={order.id}>
                <div className="bg-white rounded-2xl shadow-sm p-5 hover:shadow-md transition">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-gray-700">Order #{order.id}</span>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColors[order.status]}`}>
                      {statusIcons[order.status]} {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400 mb-3">
                    {new Date(order.created_at).toLocaleString()}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {order.items?.length} item(s)
                    </span>
                    <span className="text-orange-500 font-bold">${parseFloat(order.total_amount).toFixed(2)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Orders