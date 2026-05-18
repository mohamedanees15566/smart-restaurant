import { useEffect, useState } from 'react'
import api from '../services/api'
import echo from '../services/echo'

const statusColors = {
  placed:    { bg: 'bg-blue-500', text: 'NEW ORDER' },
  confirmed: { bg: 'bg-yellow-500', text: 'CONFIRMED' },
  preparing: { bg: 'bg-orange-500', text: 'PREPARING' },
  ready:     { bg: 'bg-green-500', text: 'READY!' },
}

const nextStatus = {
  placed:    'confirmed',
  confirmed: 'preparing',
  preparing: 'ready',
}

const KitchenDisplay = () => {
  const [orders, setOrders] = useState([])
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    fetchOrders()

    // Real-time updates
    const channel = echo.channel('orders')
    channel.listen('.order.updated', () => fetchOrders())

    // Update clock every second
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)

    return () => {
      echo.leaveChannel('orders')
      clearInterval(timer)
    }
  }, [])

  const fetchOrders = async () => {
    try {
      const res = await api.get('/staff/orders')
      setOrders(res.data.filter(o => o.status !== 'served' && o.status !== 'cancelled'))
    } catch (err) {
      console.error(err)
    }
  }

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.patch(`/staff/orders/${id}/status`, { status })
      fetchOrders()
    } catch (err) {
      console.error(err)
    }
  }

  const getElapsedTime = (createdAt) => {
    const diff = Math.floor((new Date() - new Date(createdAt)) / 1000 / 60)
    return diff
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">
          🍽️ Kitchen Display
        </h1>
        <div className="text-right">
          <p className="text-orange-400 font-bold text-xl">
            {currentTime.toLocaleTimeString()}
          </p>
          <p className="text-gray-400 text-sm">
            {currentTime.toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { label: 'New', status: 'placed', color: 'bg-blue-500' },
          { label: 'Confirmed', status: 'confirmed', color: 'bg-yellow-500' },
          { label: 'Preparing', status: 'preparing', color: 'bg-orange-500' },
          { label: 'Ready', status: 'ready', color: 'bg-green-500' },
        ].map((s) => (
          <div key={s.status} className={`${s.color} rounded-xl p-3 text-center`}>
            <div className="text-2xl font-bold text-white">
              {orders.filter(o => o.status === s.status).length}
            </div>
            <div className="text-xs text-white opacity-80">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Orders Grid */}
      {orders.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🎉</div>
          <p className="text-gray-400 text-xl">No active orders!</p>
          <p className="text-gray-600 text-sm mt-2">All caught up</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {orders.map((order) => {
            const elapsed = getElapsedTime(order.created_at)
            const isUrgent = elapsed > 20
            const statusInfo = statusColors[order.status]

            return (
              <div
                key={order.id}
                className={`bg-gray-800 rounded-2xl overflow-hidden border-2 ${
                  isUrgent ? 'border-red-500 animate-pulse' : 'border-gray-700'
                }`}
              >
                {/* Order Header */}
                <div className={`${statusInfo?.bg} px-4 py-3 flex items-center justify-between`}>
                  <div>
                    <span className="text-white font-bold text-lg">#{order.id}</span>
                    {order.table && (
                      <span className="text-white text-sm ml-2 opacity-80">
                        Table {order.table?.table_number}
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-white text-xs font-bold">{statusInfo?.text}</div>
                    <div className={`text-xs font-bold ${isUrgent ? 'text-red-200' : 'text-white opacity-80'}`}>
                      {elapsed}m ago {isUrgent && '⚠️'}
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-4">
                  <p className="text-gray-400 text-xs mb-2">{order.user?.name}</p>
                  <div className="space-y-2 mb-4">
                    {order.items?.map((item) => (
                      <div key={item.id} className="flex items-center justify-between">
                        <span className="text-white text-sm">{item.menu_item?.name}</span>
                        <span className="text-orange-400 font-bold text-sm">x{item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  {order.notes && (
                    <div className="bg-yellow-500 bg-opacity-20 rounded-lg px-3 py-2 mb-3">
                      <p className="text-yellow-400 text-xs">📝 {order.notes}</p>
                    </div>
                  )}

                  {/* Action Button */}
                  {nextStatus[order.status] && (
                    <button
                      onClick={() => handleUpdateStatus(order.id, nextStatus[order.status])}
                      className="w-full bg-white text-gray-900 font-bold py-2.5 rounded-xl hover:bg-gray-100 transition text-sm"
                    >
                      {order.status === 'placed' && '✅ Confirm Order'}
                      {order.status === 'confirmed' && '👨‍🍳 Start Preparing'}
                      {order.status === 'preparing' && '🔔 Mark Ready'}
                    </button>
                  )}

                  {order.status === 'ready' && (
                    <div className="w-full bg-green-500 text-white font-bold py-2.5 rounded-xl text-center text-sm">
                      🔔 Ready for pickup!
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default KitchenDisplay