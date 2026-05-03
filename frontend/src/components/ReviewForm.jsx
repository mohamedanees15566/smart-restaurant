import { useState } from 'react'
import api from '../services/api'
import Toast from './Toast'

const ReviewForm = ({ orderId, onSubmitted }) => {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [hoveredStar, setHoveredStar] = useState(0)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)

  const handleSubmit = async () => {
    if (rating === 0) {
      setToast({ message: 'Please select a rating!', type: 'error' })
      return
    }
    setLoading(true)
    try {
      await api.post('/reviews', { order_id: orderId, rating, comment })
      setToast({ message: 'Review submitted! Thank you 🌟', type: 'success' })
      setTimeout(() => onSubmitted && onSubmitted(), 1500)
    } catch (err) {
      setToast({
        message: err.response?.data?.message || 'Failed to submit review.',
        type: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <h3 className="font-semibold text-gray-700 mb-4">Rate your experience</h3>

      {/* Star Rating */}
      <div className="flex gap-2 mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoveredStar(star)}
            onMouseLeave={() => setHoveredStar(0)}
            className="text-3xl transition-transform hover:scale-110"
          >
            {star <= (hoveredStar || rating) ? '⭐' : '☆'}
          </button>
        ))}
        {rating > 0 && (
          <span className="text-sm text-gray-400 self-center ml-2">
            {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][rating]}
          </span>
        )}
      </div>

      {/* Comment */}
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Tell us about your experience (optional)..."
        rows={3}
        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 mb-4"
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 rounded-xl transition text-sm"
      >
        {loading ? 'Submitting...' : 'Submit Review ⭐'}
      </button>
    </div>
  )
}

export default ReviewForm