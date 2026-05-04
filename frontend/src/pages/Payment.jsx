import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { loadStripe } from '@stripe/stripe-js'
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js'
import api from '../services/api'
import Spinner from '../components/Spinner'
import Toast from '../components/Toast'

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
      // Create payment intent
      const res = await api.post('/payment/intent', { order_id: orderId })
      const { client_secret } = res.data

      // Confirm payment
      const result = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      })

      if (result.error) {
        setError(result.error.message)
      } else if (result.paymentIntent.status === 'succeeded') {
        // Confirm on backend
        await api.post('/payment/confirm', {
          order_id: orderId,
          payment_intent_id: result.paymentIntent.id,
        })
        setToast({ message: 'Payment successful! 🎉', type: 'success' })
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
        <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 mb-4">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#1a1a1a',
                  '::placeholder': { color: '#aaa' },
                },
                invalid: { color: '#ef4444' },
              },
            }}
          />
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 text-sm px-4 py-3 rounded-xl mb-4">
            {error}
          </div>
        )}

        {/* Test card hint */}
        <div className="bg-blue-50 text-blue-600 text-xs px-4 py-3 rounded-xl mb-4">
          🧪 Test card: <strong>4242 4242 4242 4242</strong> — Any future date — Any CVC
        </div>

        <button
          type="submit"
          disabled={loading || !stripe}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl transition text-sm disabled:opacity-50"
        >
          {loading ? 'Processing...' : `Pay $${parseFloat(amount).toFixed(2)}`}
        </button>
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

  if (loading) return <Spinner />

  if (order?.paid_at) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-sm p-8 text-center max-w-sm w-full">
          <div className="text-5xl mb-4">✅</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Already Paid!</h2>
          <p className="text-gray-400 text-sm mb-6">This order has already been paid.</p>
          <button
            onClick={() => navigate(`/orders/${id}`)}
            className="bg-orange-500 text-white px-6 py-2.5 rounded-full font-semibold hover:bg-orange-600 transition text-sm"
          >
            View Order
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Payment 💳</h1>

        {/* Order Summary */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="font-semibold text-gray-700 mb-4">Order Summary</h2>
          {order?.items?.map((item) => (
            <div key={item.id} className="flex justify-between text-sm py-2 border-b border-gray-50 last:border-0">
              <span className="text-gray-600">{item.menu_item?.name} x{item.quantity}</span>
              <span className="text-gray-700 font-medium">${(item.unit_price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="flex justify-between mt-4 pt-3 border-t border-gray-100">
            <span className="font-bold text-gray-800">Total</span>
            <span className="font-bold text-orange-500 text-lg">${parseFloat(order?.total_amount).toFixed(2)}</span>
          </div>
        </div>

        {/* Payment Form */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="font-semibold text-gray-700 mb-4">Card Details</h2>
          <Elements stripe={stripePromise}>
            <CheckoutForm
              orderId={parseInt(id)}
              amount={order?.total_amount}
              onSuccess={() => navigate(`/orders/${id}`)}
            />
          </Elements>
        </div>
      </div>
    </div>
  )
}

export default Payment