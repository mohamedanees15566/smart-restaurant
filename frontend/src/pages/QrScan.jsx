import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../services/api'
import Spinner from '../components/Spinner'

const QrScan = () => {
  const { tableNumber } = useParams()
  const navigate = useNavigate()
  const [table, setTable] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const scanTable = async () => {
      try {
        const res = await api.get(`/table/${tableNumber}/scan`)
        setTable(res.data)
        // Store table in session
        localStorage.setItem('selected_table', JSON.stringify(res.data))
        // Redirect to menu after 2 seconds
        setTimeout(() => navigate('/menu'), 2000)
      } catch (err) {
        setError('Table not found or inactive.')
      } finally {
        setLoading(false)
      }
    }
    scanTable()
  }, [tableNumber])

  if (loading) return <Spinner />

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-sm w-full">
        {error ? (
          <>
            <div className="text-5xl mb-4">❌</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Table Not Found</h2>
            <p className="text-gray-400 text-sm">{error}</p>
          </>
        ) : (
          <>
            <div className="text-5xl mb-4">✅</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Table {table?.table_number}
            </h2>
            <p className="text-gray-400 text-sm mb-1">📍 {table?.location}</p>
            <p className="text-gray-400 text-sm mb-4">👥 Capacity: {table?.capacity}</p>
            <p className="text-orange-500 text-sm font-medium">Redirecting to menu...</p>
          </>
        )}
      </div>
    </div>
  )
}

export default QrScan