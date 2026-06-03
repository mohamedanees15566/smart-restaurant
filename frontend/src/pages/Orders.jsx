import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../services/api'
import Spinner from '../components/Spinner'
import Card from '../components/ui/Card'
import PageHeader from '../components/ui/PageHeader'
import EmptyState from '../components/ui/EmptyState'
import StatusBadge from '../components/ui/StatusBadge'
import { statusIcons } from '../utils/orderStatus'

const Orders = () => {
  const navigate = useNavigate()
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

  if (loading) return <div className="page-shell"><Spinner label="Loading orders..." /></div>

  return (
    <div className="page-shell">
      <div className="page-container-narrow">
        <PageHeader title="My Orders" subtitle="Track and manage your orders" />

        {orders.length === 0 ? (
          <EmptyState
            icon="📋"
            title="No orders yet"
            description="Your order history will appear here"
            actionLabel="Browse Menu"
            onAction={() => navigate('/menu')}
          />
        ) : (
          <div className="space-y-4">
            {orders.map((order, i) => (
              <Link key={order.id} to={`/orders/${order.id}`} className="block">
                <Card hover className={`animate-slide-up p-5 stagger-${(i % 4) + 1}`}>
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <span className="font-semibold text-stone-900">Order #{order.id}</span>
                    <StatusBadge status={order.status} icon={statusIcons[order.status]} />
                  </div>
                  <p className="text-xs text-stone-400">{new Date(order.created_at).toLocaleString()}</p>
                  <div className="mt-4 flex items-center justify-between border-t border-stone-100 pt-4">
                    <span className="text-sm text-stone-500">{order.items?.length} item(s)</span>
                    <span className="text-lg font-bold text-orange-600">${parseFloat(order.total_amount).toFixed(2)}</span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Orders
