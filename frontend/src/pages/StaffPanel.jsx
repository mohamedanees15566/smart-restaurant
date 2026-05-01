import { useEffect, useState } from 'react'
import api from '../services/api'
import echo from '../services/echo'
import Toast from '../components/Toast'
import Spinner from '../components/Spinner'

const statusColors = {
  placed:    'bg-blue-100 text-blue-600',
  confirmed: 'bg-yellow-100 text-yellow-600',
  preparing: 'bg-orange-100 text-orange-600',
  ready:     'bg-green-100 text-green-600',
  served:    'bg-gray-100 text-gray-600',
  cancelled: 'bg-red-100 text-red-600',
}

const nextStatus = {
  placed:    'confirmed',
  confirmed: 'preparing',
  preparing: 'ready',
  ready:     'served',
}

const tableStatusColors = {
  available: 'bg-green-100 text-green-600 border-green-200',
  occupied:  'bg-red-100 text-red-600 border-red-200',
  reserved:  'bg-yellow-100 text-yellow-600 border-yellow-200',
}

const StaffPanel = () => {
  const [orders, setOrders] = useState([])
  const [tables, setTables] = useState([])
  const [queue, setQueue] = useState([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)
  const [activeTab, setActiveTab] = useState('orders')

  useEffect(() => {
    fetchAll()

    // Real-time order updates
    const orderChannel = echo.channel('orders')
    orderChannel.listen('.order.updated', () => fetchOrders())

    // Real-time queue updates
    const queueChannel = echo.channel('queue')
    queueChannel.listen('.queue.updated', (data) => setQueue(data))

    return () => {
      echo.leaveChannel('orders')
      echo.leaveChannel('queue')
    }
  }, [])

  const fetchAll = async () => {
    await Promise.all([fetchOrders(), fetchTables(), fetchQueue()])
    setLoading(false)
  }

  const fetchOrders = async () => {
    try {
      const res = await api.get('/staff/orders')
      setOrders(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  const fetchTables = async () => {
    try {
      const res = await api.get('/staff/tables')
      setTables(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  const fetchQueue = async () => {
    try {
      const res = await api.get('/queue')
      setQueue(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  const handleUpdateOrderStatus = async (id, status) => {
    try {
      await api.patch(`/staff/orders/${id}/status`, { status })
      setToast({ message: `Order marked as ${status}!`, type: 'success' })
      fetchOrders()
    } catch (err) {
      setToast({ message: 'Failed to update order.', type: 'error' })
    }
  }

  const handleUpdateTableStatus = async (id, status) => {
    try {
      await api.patch(`/staff/tables/${id}/status`, { status })
      setToast({ message: `Table marked as ${status}!`, type: 'success' })
      fetchTables()
    } catch (err) {
      setToast({ message: 'Failed to update table.', type: 'error' })
    }
  }

  const handleCallNext = async () => {
    try {
      await api.post('/queue/call-next')
      setToast({ message: 'Next customer called! 🔔', type: 'success' })
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Queue is empty.', type: 'error' })
    }
  }

  const handleSeated = async (id) => {
    try {
      await api.patch(`/queue/${id}/seated`)
      setToast({ message: 'Customer seated! ✅', type: 'success' })
    } catch (err) {
      setToast({ message: 'Failed to update.', type: 'error' })
    }
  }

  const handleRemove = async (id) => {
    try {
      await api.delete(`/queue/${id}`)
      setToast({ message: 'Customer removed from queue.', type: 'info' })
    } catch (err) {
      setToast({ message: 'Failed to remove.', type: 'error' })
    }
  }

  if (loading) return <Spinner />

  return (
    <div className="min-h-screen bg-gray-50">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header */}
      <div className="bg-white shadow-sm py-4 px-6">
        <h1 className="text-xl font-bold text-gray-800">Staff Panel 👨‍🍳</h1>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-100 px-6">
        <div className="flex gap-6">
          {['orders', 'tables', 'queue'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 text-sm font-medium capitalize border-b-2 transition ${
                activeTab === tab
                  ? 'border-orange-500 text-orange-500'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab === 'orders' && `📋 Orders (${orders.length})`}
              {tab === 'tables' && `🪑 Tables (${tables.length})`}
              {tab === 'queue' && `⏳ Queue (${queue.length})`}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">

        {/* ORDERS TAB */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <div className="text-5xl mb-3">🎉</div>
                <p>No active orders right now</p>
              </div>
            ) : orders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl shadow-sm p-5">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="font-bold text-gray-800">Order #{order.id}</span>
                    <span className="text-gray-400 text-sm ml-2">— {order.user?.name}</span>
                    {order.table && (
                      <span className="text-gray-400 text-sm ml-2">— Table {order.table?.table_number}</span>
                    )}
                  </div>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColors[order.status]}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>

                {/* Items */}
                <div className="mb-4 space-y-1">
                  {order.items?.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm text-gray-600">
                      <span>{item.menu_item?.name} x{item.quantity}</span>
                      <span>${(item.unit_price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-bold text-orange-500">${parseFloat(order.total_amount).toFixed(2)}</span>
                  {nextStatus[order.status] && (
                    <button
                      onClick={() => handleUpdateOrderStatus(order.id, nextStatus[order.status])}
                      className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-4 py-2 rounded-xl transition"
                    >
                      Mark as {nextStatus[order.status].charAt(0).toUpperCase() + nextStatus[order.status].slice(1)}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TABLES TAB */}
        {activeTab === 'tables' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {tables.map((table) => (
              <div
                key={table.id}
                className={`border-2 rounded-2xl p-4 text-center ${tableStatusColors[table.status]}`}
              >
                <div className="text-2xl font-bold mb-1">{table.table_number}</div>
                <div className="text-xs mb-1">👥 {table.capacity} seats</div>
                <div className="text-xs mb-3">📍 {table.location}</div>
                <select
                  value={table.status}
                  onChange={(e) => handleUpdateTableStatus(table.id, e.target.value)}
                  className="w-full text-xs border border-current rounded-lg px-2 py-1 bg-transparent font-medium"
                >
                  <option value="available">Available</option>
                  <option value="occupied">Occupied</option>
                  <option value="reserved">Reserved</option>
                </select>
              </div>
            ))}
          </div>
        )}

        {/* QUEUE TAB */}
        {activeTab === 'queue' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-700">
                Waiting Queue ({queue.length})
              </h2>
              <button
                onClick={handleCallNext}
                className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-4 py-2 rounded-xl transition"
              >
                Call Next 🔔
              </button>
            </div>

            {queue.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <div className="text-5xl mb-3">🎉</div>
                <p>Queue is empty!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {queue.map((entry) => (
                  <div
                    key={entry.id}
                    className={`bg-white rounded-2xl shadow-sm p-4 flex items-center justify-between ${
                      entry.status === 'called' ? 'border-2 border-green-400' : ''
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                        entry.status === 'called' ? 'bg-green-500 text-white' : 'bg-orange-100 text-orange-600'
                      }`}>
                        {entry.position}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">Queue #{entry.queue_number}</p>
                        <p className="text-xs text-gray-400">{entry.user_name} — 👥 {entry.party_size} people</p>
                        <p className="text-xs text-gray-400">~{entry.estimated_wait} mins wait</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {entry.status === 'called' && (
                        <button
                          onClick={() => handleSeated(entry.id)}
                          className="bg-green-500 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-green-600 transition"
                        >
                          Seated ✅
                        </button>
                      )}
                      <button
                        onClick={() => handleRemove(entry.id)}
                        className="bg-red-50 text-red-500 text-xs px-3 py-1.5 rounded-lg hover:bg-red-100 transition"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  )
}

export default StaffPanel