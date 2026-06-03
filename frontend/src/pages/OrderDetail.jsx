import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import api from '../services/api'
import echo from '../services/echo'
import Spinner from '../components/Spinner'
import ReviewForm from '../components/ReviewForm'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import StatusBadge from '../components/ui/StatusBadge'
import { statusIcons } from '../utils/orderStatus'

const steps = ['placed', 'confirmed', 'preparing', 'ready', 'served']

const OrderDetail = () => {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
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

  if (loading) return <div className="page-shell"><Spinner /></div>

  if (!order) {
    return (
      <div className="page-shell flex min-h-[50vh] items-center justify-center text-center">
        <div>
          <p className="text-5xl">❌</p>
          <p className="mt-4 font-medium text-stone-600">Order not found</p>
          <Link to="/orders" className="mt-4 inline-block text-sm font-semibold text-orange-600 hover:underline">Back to Orders</Link>
        </div>
      </div>
    )
  }

  const currentStep = steps.indexOf(order.status)

  return (
    <div className="page-shell">
      <div className="page-container-narrow">
        <div className="mb-8 flex flex-wrap items-center gap-4">
          <Link to="/orders" className="text-sm font-medium text-stone-500 transition hover:text-stone-900">← Back</Link>
          <div className="flex flex-1 flex-wrap items-center justify-between gap-3">
            <h1 className="section-title text-xl sm:text-2xl">Order #{order.id}</h1>
            <StatusBadge status={order.status} icon={statusIcons[order.status]} />
          </div>
        </div>

        <p className="mb-6 text-sm text-stone-400">{new Date(order.created_at).toLocaleString()}</p>

        <Card className="mb-6 p-6">
          <h2 className="mb-6 text-sm font-semibold uppercase tracking-wider text-stone-500">Live status</h2>
          <div className="relative flex items-center justify-between">
            <div className="absolute left-0 right-0 top-4 z-0 h-1 rounded-full bg-stone-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-orange-500 to-orange-600 transition-all duration-700"
                style={{ width: `${Math.max(0, (currentStep / (steps.length - 1)) * 100)}%` }}
              />
            </div>
            {steps.map((step, index) => (
              <div key={step} className="relative z-10 flex flex-col items-center">
                <div className={`flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm transition-all duration-300 ${
                  index <= currentStep
                    ? 'border-orange-500 bg-orange-500 text-white shadow-md shadow-orange-500/30'
                    : 'border-stone-200 bg-white text-stone-300'
                }`}>
                  {statusIcons[step]}
                </div>
                <span className={`mt-2 text-[10px] font-semibold capitalize sm:text-xs ${index <= currentStep ? 'text-orange-600' : 'text-stone-300'}`}>
                  {step}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="mb-6 p-6">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-stone-500">Items</h2>
          {order.items?.map((item) => (
            <div key={item.id} className="flex items-center justify-between border-b border-stone-50 py-3 last:border-0">
              <div>
                <p className="text-sm font-medium text-stone-800">{item.menu_item?.name}</p>
                <p className="text-xs text-stone-400">Qty: {item.quantity}</p>
              </div>
              <span className="text-sm font-bold text-orange-600">${(item.unit_price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </Card>

        <Card className="mb-6 p-6">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-stone-700">Total</span>
            <span className="text-2xl font-bold tracking-tight text-stone-900">${parseFloat(order.total_amount).toFixed(2)}</span>
          </div>
          {order.notes && <p className="mt-3 text-xs text-stone-400">Note: {order.notes}</p>}
        </Card>

        {!order.paid_at && order.status !== 'cancelled' && (
          <Button className="mb-6 w-full !bg-emerald-600 !from-emerald-500 !to-emerald-600 hover:!from-emerald-600 hover:!to-emerald-700" onClick={() => navigate(`/payment/${order.id}`)}>
            Pay ${parseFloat(order.total_amount).toFixed(2)}
          </Button>
        )}

        {order.paid_at && (
          <Card className="mb-6 border-emerald-200 bg-emerald-50/80 p-4 text-center">
            <p className="text-sm font-semibold text-emerald-700">Paid on {new Date(order.paid_at).toLocaleString()}</p>
          </Card>
        )}

        {order.status === 'served' && !reviewed && (
          <ReviewForm orderId={order.id} onSubmitted={() => setReviewed(true)} />
        )}

        {reviewed && (
          <Card className="border-emerald-200 bg-emerald-50/80 p-8 text-center">
            <div className="text-4xl mb-2">🌟</div>
            <p className="font-semibold text-emerald-700">Thank you for your review!</p>
          </Card>
        )}
      </div>
    </div>
  )
}

export default OrderDetail
