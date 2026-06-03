import { useEffect, useState } from 'react'
import api from '../services/api'
import echo from '../services/echo'
import useAuthStore from '../store/authStore'
import Toast from '../components/Toast'
import Spinner from '../components/Spinner'

const QueuePage = () => {
  const { token } = useAuthStore()
  const [myQueue, setMyQueue] = useState(null)
  const [queue, setQueue] = useState([])
  const [partySize, setPartySize] = useState(1)
  const [loading, setLoading] = useState(true)
  const [joining, setJoining] = useState(false)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    fetchQueue()
    fetchMyStatus()

    // Listen for real-time queue updates
    const channel = echo.channel('queue')
    channel.listen('.queue.updated', (data) => {
      setQueue(data)
      // Update my position if in queue
      if (myQueue) {
        const me = data.find((q) => q.id === myQueue.id)
        if (me) setMyQueue((prev) => ({ ...prev, ...me }))
      }
    })

    return () => echo.leaveChannel('queue')
  }, [])

  const fetchQueue = async () => {
    try {
      const res = await api.get('/queue')
      setQueue(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchMyStatus = async () => {
    try {
      const res = await api.get('/queue/my-status')
      setMyQueue(res.data)
    } catch (err) {
      setMyQueue(null)
    }
  }

  const handleJoin = async () => {
    setJoining(true)
    try {
      const res = await api.post('/queue/join', { party_size: partySize })
      setMyQueue(res.data.queue)
      setToast({ message: 'Joined queue successfully! 🎉', type: 'success' })
      fetchQueue()
    } catch (err) {
      setToast({
        message: err.response?.data?.message || 'Failed to join queue.',
        type: 'error',
      })
    } finally {
      setJoining(false)
    }
  }

  const handleLeave = async () => {
    try {
      await api.post('/queue/leave')
      setMyQueue(null)
      setToast({ message: 'Left queue successfully.', type: 'info' })
      fetchQueue()
    } catch (err) {
      setToast({ message: 'Failed to leave queue.', type: 'error' })
    }
  }

  if (loading) return <Spinner />

  return (
    <div className="min-h-screen px-4 py-8">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Virtual Queue ⏳</h1>
        <p className="text-gray-500 text-sm mb-8">Join the queue and we'll notify you when your table is ready</p>

        {/* My Queue Status */}
        {myQueue ? (
          <div className="bg-orange-500 text-white rounded-2xl p-6 mb-6 text-center">
            <p className="text-orange-100 text-sm mb-2">Your Queue Number</p>
            <div className="text-6xl font-bold mb-2">#{myQueue.queue_number}</div>
            <p className="text-orange-100 text-sm mb-1">Position: {myQueue.position}</p>
            <p className="text-orange-100 text-sm mb-4">
              Estimated wait: ~{myQueue.estimated_wait} mins
            </p>
            {myQueue.status === 'called' && (
              <div className="bg-white text-orange-500 font-bold py-2 px-4 rounded-xl mb-4 animate-pulse">
                🔔 Your table is ready! Please proceed to the host.
              </div>
            )}
            <button
              onClick={handleLeave}
              className="bg-white text-orange-500 font-semibold px-6 py-2 rounded-full text-sm hover:bg-orange-50 transition"
            >
              Leave Queue
            </button>
          </div>
        ) : (
          <div className="card p-6 mb-6">
            <h2 className="font-semibold text-gray-700 mb-4">Join the Queue</h2>
            <div className="mb-4">
              <label className="text-sm text-gray-600 block mb-2">Party Size</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setPartySize((p) => Math.max(1, p - 1))}
                  className="w-9 h-9 rounded-full bg-gray-100 text-gray-600 font-bold hover:bg-gray-200 transition"
                >
                  −
                </button>
                <span className="text-xl font-bold text-gray-800 w-6 text-center">{partySize}</span>
                <button
                  onClick={() => setPartySize((p) => Math.min(20, p + 1))}
                  className="w-9 h-9 rounded-full bg-orange-100 text-orange-600 font-bold hover:bg-orange-200 transition"
                >
                  +
                </button>
                <span className="text-sm text-gray-400 ml-2">people</span>
              </div>
            </div>
            <button
              onClick={handleJoin}
              disabled={joining || !token}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl transition text-sm"
            >
              {!token ? 'Login to Join Queue' : joining ? 'Joining...' : 'Join Queue'}
            </button>
          </div>
        )}

        {/* Queue List */}
        <div className="card p-6">
          <h2 className="font-semibold text-gray-700 mb-4">
            Current Queue ({queue.length} waiting)
          </h2>
          {queue.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <div className="text-4xl mb-2">🎉</div>
              <p className="text-sm">No one is waiting — walk right in!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {queue.map((entry) => (
                <div
                  key={entry.id}
                  className={`flex items-center justify-between p-3 rounded-xl ${
                    entry.status === 'called' ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      entry.status === 'called' ? 'bg-green-500 text-white' : 'bg-orange-100 text-orange-600'
                    }`}>
                      {entry.position}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Queue #{entry.queue_number}</p>
                      <p className="text-xs text-gray-400">👥 {entry.party_size} people</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      entry.status === 'called'
                        ? 'bg-green-100 text-green-600'
                        : 'bg-orange-100 text-orange-600'
                    }`}>
                      {entry.status === 'called' ? '🔔 Called' : `~${entry.estimated_wait} mins`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default QueuePage