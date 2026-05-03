import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../services/api'
import echo from '../services/echo'
import Spinner from '../components/Spinner'
import ReviewForm from '../components/ReviewForm'

const steps = ['placed', 'confirmed', 'preparing', 'ready', 'served']

const statusIcons = {
  placed:    '📝',
  confirmed: '✅',
  preparing: '👨‍🍳',
  ready:     '🔔',
  served:    '🍽️',
}

const OrderDetail = () => {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [reviewed, setReviewed] = useState(false)

  useEffect(() => {
    fetchOrder()

    const channel = echo.channel(`orders.${id}`)
    channel.listen('.order.updated', (data) => {
      setOrder((prev) => ({ ...prev, status: data.status }))
    })

    return () => echo.leaveChannel(`orders.${id}`)
  }, [id])

  const fetchOrder = async () => {
    try {
      const res = await api.get(`/orders/${id}`)
      setOrder(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <Spinner />
  if (!order) return (
    <div className="text-center py-16 text-gray-400">
      <div className="text-5xl mb-4">❌</div>
      <p>Order not found</p>
      <Link to="/orders" className="text-orange-500 text-sm mt-2 block">Back to Orders</Link>
    </div>
  )

  const currentStep = steps.indexOf(order.status)

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Link to="/orders" className="text-gray-400 hover:text-gray-600 text-sm">← Back</Link>
          <h1 className="text-2xl font-bold text-gray-800">Order #{order.id}</h1>
        </div>

        <p className="text-gray-400 text-sm mb-8">{new Date(order.created_at).toLocaleString()}</p>

        {/* Status Tracker */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-sm font-semibold text-gray-600 mb-6">Live Order Status</h2>
          <div className="flex items-center justify-between relative">
            <div className="absolute top-4 left-0 right-0 h-1 bg-gray-100 z-0">
              <div
                className="h-full bg-orange-500 transition-all duration-500"
                style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
              />
            </div>
            {steps.map((step, index) => (
              <div key={step} className="flex flex-col items-center z-10">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm border-2 transition-all ${
                  index <= currentStep
                    ? 'bg-orange-500 border-orange-500 text-white'
                    : 'bg-white border-gray-200 text-gray-300'
                }`}>
                  {statusIcons[step]}
                </div>
                <span className={`text-xs mt-2 font-medium capitalize ${
                  index <= currentStep ? 'text-orange-500' : 'text-gray-300'
                }`}>
                  {step}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-sm font-semibold text-gray-600 mb-4">Items Ordered</h2>
          {order.items?.map((item) => (
            <div key={item.id} className="flex justify-between items-center py-3 border-b border-gray-50 last:border-0">
              <div>
                <p className="text-sm font-medium text-gray-700">{item.menu_item?.name}</p>
                <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
              </div>
              <span className="text-sm font-semibold text-orange-500">
                ${(item.unit_price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-700">Total</span>
            <span className="text-2xl font-bold text-orange-500">
              ${parseFloat(order.total_amount).toFixed(2)}
            </span>
          </div>
          {order.notes && (
            <p className="text-xs text-gray-400 mt-2">Note: {order.notes}</p>
          )}
        </div>

        {/* Review Form - only show if served */}
        {order.status === 'served' && !reviewed && (
          <ReviewForm orderId={order.id} onSubmitted={() => setReviewed(true)} />
        )}

        {reviewed && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
            <div className="text-4xl mb-2">🌟</div>
            <p className="text-green-600 font-semibold">Thank you for your review!</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default OrderDetail