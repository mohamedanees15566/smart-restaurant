import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import api from '../services/api'
import Spinner from '../components/Spinner'
import Toast from '../components/Toast'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import PageHeader from '../components/ui/PageHeader'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY)

const CheckoutForm = ({ orderId, amount, onSuccess }) => {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [toast, setToast] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!stripe || !elements) return

    setLoading(true)
    setError('')

    try {
      const res = await api.post('/payment/intent', { order_id: orderId })
      const { client_secret } = res.data

      const result = await stripe.confirmCardPayment(client_secret, {
        payment_method: { card: elements.getElement(CardElement) },
      })

      if (result.error) {
        setError(result.error.message)
      } else if (result.paymentIntent.status === 'succeeded') {
        await api.post('/payment/confirm', {
          order_id: orderId,
          payment_intent_id: result.paymentIntent.id,
        })
        setToast({ message: 'Payment successful!', type: 'success' })
        setTimeout(() => onSuccess(), 1500)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Payment failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <form onSubmit={handleSubmit}>
        <div className="mb-4 rounded-xl border border-stone-200 bg-stone-50/80 px-4 py-4 transition focus-within:border-orange-300 focus-within:ring-4 focus-within:ring-orange-500/10">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#1c1917',
                  fontFamily: '"Plus Jakarta Sans", sans-serif',
                  '::placeholder': { color: '#a8a29e' },
                },
                invalid: { color: '#dc2626' },
              },
            }}
          />
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
            {error}
          </div>
        )}

        <div className="mb-4 rounded-xl border border-blue-200/80 bg-blue-50/80 px-4 py-3 text-xs text-blue-800">
          Test card: <strong>4242 4242 4242 4242</strong> — any future date — any CVC
        </div>

        <Button type="submit" disabled={loading || !stripe} className="w-full">
          {loading ? 'Processing...' : `Pay $${parseFloat(amount).toFixed(2)}`}
        </Button>
      </form>
    </div>
  )
}

const Payment = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrder()
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

  if (order?.paid_at) {
    return (
      <div className="page-shell flex min-h-[60vh] items-center justify-center">
        <Card className="animate-scale-in max-w-sm p-10 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-3xl">✓</div>
          <h2 className="text-xl font-bold text-stone-900">Already paid</h2>
          <p className="mt-2 text-sm text-stone-500">This order has already been paid.</p>
          <Button className="mt-6" onClick={() => navigate(`/orders/${id}`)}>View Order</Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="page-shell">
      <div className="page-container-narrow max-w-md">
        <PageHeader title="Payment" subtitle="Secure checkout powered by Stripe" />

        <Card className="mb-6 p-6">
          <h2 className="mb-4 font-semibold text-stone-800">Order summary</h2>
          {order?.items?.map((item) => (
            <div key={item.id} className="flex justify-between border-b border-stone-50 py-2.5 text-sm last:border-0">
              <span className="text-stone-600">{item.menu_item?.name} × {item.quantity}</span>
              <span className="font-medium text-stone-800">${(item.unit_price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="mt-4 flex justify-between border-t border-stone-100 pt-4">
            <span className="font-bold text-stone-800">Total</span>
            <span className="text-xl font-bold text-orange-600">${parseFloat(order?.total_amount).toFixed(2)}</span>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="mb-4 font-semibold text-stone-800">Card details</h2>
          <Elements stripe={stripePromise}>
            <CheckoutForm
              orderId={parseInt(id)}
              amount={order?.total_amount}
              onSuccess={() => navigate(`/orders/${id}`)}
            />
          </Elements>
        </Card>
      </div>
    </div>
  )
}

export default Payment
