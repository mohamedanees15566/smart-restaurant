import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import useAuthStore from '../store/authStore'
import Toast from '../components/Toast'
import Spinner from '../components/Spinner'

const Reservation = () => {
  const { token } = useAuthStore()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    date: '',
    time: '',
    party_size: 2,
    table_id: '',
    notes: '',
  })
  const [availableTables, setAvailableTables] = useState([])
  const [myReservations, setMyReservations] = useState([])
  const [loading, setLoading] = useState(false)
  const [searching, setSearching] = useState(false)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    if (token) fetchMyReservations()
  }, [token])

  const fetchMyReservations = async () => {
    try {
      const res = await api.get('/reservations/mine')
      setMyReservations(res.data)
    } catch (err) {
      if (err.response?.status !== 401) {
        console.error(err)
      }
    }
  }

  const handleSearch = async () => {
    if (!form.date || !form.time) {
      setToast({ message: 'Please select date and time!', type: 'error' })
      return
    }
    setSearching(true)
    try {
      const reserved_at = `${form.date}T${form.time}`
      const res = await api.get('/reservations/available-tables', {
        params: { reserved_at, party_size: form.party_size }
      })
      setAvailableTables(res.data)
      setStep(2)
    } catch (err) {
      setToast({ message: 'Failed to search tables.', type: 'error' })
    } finally {
      setSearching(false)
    }
  }

  const handleReserve = async () => {
    if (!token) {
      navigate('/login', { state: { from: '/reservation' } })
      return
    }
    if (!form.table_id) {
      setToast({ message: 'Please select a table!', type: 'error' })
      return
    }
    setLoading(true)
    try {
      await api.post('/reservations', {
        table_id:    form.table_id,
        party_size:  form.party_size,
        reserved_at: `${form.date}T${form.time}`,
        notes:       form.notes,
      })
      setToast({ message: 'Reservation created! 🎉', type: 'success' })
      setStep(3)
      fetchMyReservations()
    } catch (err) {
      setToast({
        message: err.response?.data?.message || 'Failed to create reservation.',
        type: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async (id) => {
    try {
      await api.patch(`/reservations/${id}/cancel`)
      setToast({ message: 'Reservation cancelled.', type: 'info' })
      fetchMyReservations()
    } catch (err) {
      setToast({ message: 'Failed to cancel.', type: 'error' })
    }
  }

  const statusColors = {
    pending:   'bg-yellow-100 text-yellow-600',
    confirmed: 'bg-green-100 text-green-600',
    cancelled: 'bg-red-100 text-red-500',
    completed: 'bg-gray-100 text-gray-600',
  }

  return (
    <div className="page-shell">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="page-container-narrow max-w-2xl">
        <h1 className="section-title">Table Reservation</h1>
        <p className="section-subtitle mb-8">Book a table in advance for your visit</p>

        {/* Step Indicator */}
        <div className="flex items-center gap-3 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                step >= s ? 'bg-stone-900 text-white shadow-md' : 'bg-stone-200 text-stone-500'
              }`}>
                {s}
              </div>
              {s < 3 && <div className={`h-1 w-12 rounded ${step > s ? 'bg-orange-500' : 'bg-stone-200'}`} />}
            </div>
          ))}
          <div className="flex gap-8 ml-2 text-xs text-stone-400">
            <span className={step >= 1 ? 'text-orange-500 font-medium' : ''}>Search</span>
            <span className={step >= 2 ? 'text-orange-500 font-medium' : ''}>Select</span>
            <span className={step >= 3 ? 'text-orange-500 font-medium' : ''}>Done</span>
          </div>
        </div>

        {/* Step 1 — Search */}
        {step === 1 && (
          <div className="card p-6 mb-6">
            <h2 className="font-semibold text-gray-700 mb-4">When would you like to visit?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-xs text-gray-500 block mb-1">Date</label>
                <input
                  type="date"
                  value={form.date}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Time</label>
                <input
                  type="time"
                  value={form.time}
                  onChange={(e) => setForm({ ...form, time: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="text-xs text-gray-500 block mb-2">Party Size</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setForm({ ...form, party_size: Math.max(1, form.party_size - 1) })}
                  className="w-9 h-9 rounded-full bg-gray-100 text-gray-600 font-bold hover:bg-gray-200 transition"
                >−</button>
                <span className="text-xl font-bold text-gray-800 w-6 text-center">{form.party_size}</span>
                <button
                  onClick={() => setForm({ ...form, party_size: Math.min(20, form.party_size + 1) })}
                  className="w-9 h-9 rounded-full bg-orange-100 text-orange-600 font-bold hover:bg-orange-200 transition"
                >+</button>
                <span className="text-sm text-gray-400 ml-2">people</span>
              </div>
            </div>
            <button
              onClick={handleSearch}
              disabled={searching}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl transition text-sm"
            >
              {searching ? 'Searching...' : 'Search Available Tables 🔍'}
            </button>
          </div>
        )}

        {/* Step 2 — Select Table */}
        {step === 2 && (
          <div className="mb-6">
            <div className="card p-6 mb-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-700">
                  Available Tables ({availableTables.length})
                </h2>
                <button
                  onClick={() => setStep(1)}
                  className="text-sm text-orange-500 hover:underline"
                >
                  ← Change date
                </button>
              </div>

              {availableTables.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <div className="text-4xl mb-2">😔</div>
                  <p>No tables available for this time</p>
                  <p className="text-sm mt-1">Try a different date or time</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {availableTables.map((table) => (
                    <div
                      key={table.id}
                      onClick={() => setForm({ ...form, table_id: table.id })}
                      className={`border-2 rounded-xl p-4 text-center cursor-pointer transition ${
                        form.table_id === table.id
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-200 hover:border-orange-300'
                      }`}
                    >
                      <div className="text-xl font-bold text-gray-800 mb-1">{table.table_number}</div>
                      <div className="text-xs text-gray-400">👥 {table.capacity} seats</div>
                      <div className="text-xs text-gray-400">📍 {table.location}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {availableTables.length > 0 && (
              <div className="card p-6">
                <label className="text-xs text-gray-500 block mb-1">Special Notes (optional)</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Any special requests..."
                  rows={2}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 mb-4"
                />
                <button
                  onClick={handleReserve}
                  disabled={loading || !form.table_id}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl transition text-sm disabled:opacity-50"
                >
                  {loading ? 'Reserving...' : 'Confirm Reservation 📅'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Step 3 — Success */}
        {step === 3 && (
          <div className="card p-8 text-center mb-6">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Reservation Created!</h2>
            <p className="text-gray-400 text-sm mb-6">
              Your reservation is pending confirmation from the restaurant.
              You will receive a notification once confirmed.
            </p>
            <button
              onClick={() => setStep(1)}
              className="bg-orange-500 text-white px-6 py-2.5 rounded-full font-semibold hover:bg-orange-600 transition text-sm"
            >
              Make Another Reservation
            </button>
          </div>
        )}

        {/* My Reservations */}
        {token && myReservations.length > 0 && (
          <div className="card p-6">
            <h2 className="font-semibold text-gray-700 mb-4">My Reservations</h2>
            <div className="space-y-3">
              {myReservations.map((r) => (
                <div key={r.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Table {r.table?.table_number} — 👥 {r.party_size} people
                    </p>
                    <p className="text-xs text-gray-400">
                      📅 {new Date(r.reserved_at).toLocaleString()}
                    </p>
                    {r.notes && <p className="text-xs text-gray-400">📝 {r.notes}</p>}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[r.status]}`}>
                      {r.status}
                    </span>
                    {r.status === 'pending' && (
                      <button
                        onClick={() => handleCancel(r.id)}
                        className="text-xs text-red-400 hover:text-red-600"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Reservation