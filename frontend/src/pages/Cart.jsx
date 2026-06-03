import { useNavigate } from 'react-router-dom'
import useCartStore from '../store/cartStore'
import useAuthStore from '../store/authStore'
import api from '../services/api'
import { useState } from 'react'
import Toast from '../components/Toast'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import EmptyState from '../components/ui/EmptyState'
import PageHeader from '../components/ui/PageHeader'

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
      setToast({ message: 'Order placed successfully!', type: 'success' })
      setTimeout(() => navigate('/orders'), 1500)
    } catch (err) {
      setToast({ message: 'Failed to place order. Try again.', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="page-shell flex min-h-[60vh] items-center">
        <div className="page-container-narrow w-full">
          <EmptyState
            icon="🛒"
            title="Your cart is empty"
            description="Add some delicious items from our menu"
            actionLabel="Browse Menu"
            onAction={() => navigate('/menu')}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="page-shell">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="page-container-narrow">
        <PageHeader title="Your Cart" subtitle={`${items.length} item(s)`} />

        <Card className="mb-4 divide-y divide-stone-100 p-2">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-4 px-4 py-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-orange-50 text-xl">
                🍽
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-sm font-semibold text-stone-900">{item.name}</h3>
                <p className="text-sm font-bold text-orange-600">${item.price}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-100 text-stone-600 transition hover:bg-stone-200"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
                <button
                  type="button"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 text-orange-700 transition hover:bg-orange-200"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
              <button
                type="button"
                onClick={() => removeItem(item.id)}
                className="rounded-lg p-2 text-stone-400 transition hover:bg-red-50 hover:text-red-600"
                aria-label="Remove item"
              >
                ✕
              </button>
            </div>
          ))}
        </Card>

        <Card className="mb-4 p-6">
          <label className="input-label">Special notes (optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any special requests..."
            rows={3}
            className="textarea-field"
          />
        </Card>

        <Card className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <span className="font-medium text-stone-600">Total</span>
            <span className="text-3xl font-bold tracking-tight text-stone-900">${getTotal().toFixed(2)}</span>
          </div>
          <Button onClick={handleOrder} disabled={loading} className="w-full">
            {loading ? 'Placing order...' : 'Place Order'}
          </Button>
          <p className="mt-3 text-center text-xs text-stone-400">Pay online after placing your order</p>
        </Card>
      </div>
    </div>
  )
}

export default Cart
