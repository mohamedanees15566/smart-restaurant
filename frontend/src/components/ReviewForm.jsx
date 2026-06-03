import { useState } from 'react'
import api from '../services/api'
import Toast from './Toast'
import Card from './ui/Card'
import Button from './ui/Button'

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
        type: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="p-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <h3 className="mb-4 font-semibold text-stone-800">Rate your experience</h3>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoveredStar(star)}
            onMouseLeave={() => setHoveredStar(0)}
            className="text-3xl transition-transform hover:scale-110 active:scale-95"
            aria-label={`Rate ${star} stars`}
          >
            {star <= (hoveredStar || rating) ? '⭐' : '☆'}
          </button>
        ))}
        {rating > 0 && (
          <span className="ml-2 text-sm text-stone-500">
            {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][rating]}
          </span>
        )}
      </div>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Tell us about your experience (optional)..."
        rows={3}
        className="textarea-field mb-4"
      />

      <Button onClick={handleSubmit} disabled={loading} className="w-full">
        {loading ? 'Submitting...' : 'Submit Review'}
      </Button>
    </Card>
  )
}

export default ReviewForm
