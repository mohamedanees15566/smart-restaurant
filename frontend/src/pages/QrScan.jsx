import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../services/api'
import Spinner from '../components/Spinner'
import Card from '../components/ui/Card'

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
        localStorage.setItem('selected_table', JSON.stringify(res.data))
        setTimeout(() => navigate('/menu'), 2000)
      } catch (err) {
        setError('Table not found or inactive.')
      } finally {
        setLoading(false)
      }
    }
    scanTable()
  }, [tableNumber, navigate])

  if (loading) return <div className="page-shell flex min-h-[60vh] items-center justify-center"><Spinner label="Scanning table..." /></div>

  return (
    <div className="page-shell flex min-h-[60vh] items-center justify-center">
      <Card className="animate-scale-in max-w-sm p-10 text-center">
        {error ? (
          <>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100 text-3xl">✕</div>
            <h2 className="text-xl font-bold text-stone-900">Table not found</h2>
            <p className="mt-2 text-sm text-stone-500">{error}</p>
          </>
        ) : (
          <>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-3xl">✓</div>
            <h2 className="text-xl font-bold text-stone-900">Table {table?.table_number}</h2>
            <p className="mt-2 text-sm text-stone-500">{table?.location} · {table?.capacity} seats</p>
            <p className="mt-6 text-sm font-semibold text-orange-600 animate-pulse">Redirecting to menu...</p>
          </>
        )}
      </Card>
    </div>
  )
}

export default QrScan
