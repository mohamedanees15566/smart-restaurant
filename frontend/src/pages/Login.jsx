import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import api from '../services/api'
import useAuthStore from '../store/authStore'
import Toast from '../components/Toast'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'

const Login = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { setAuth } = useAuthStore()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [toast, setToast] = useState(null)
  const [loading, setLoading] = useState(false)

  const from = location.state?.from || '/'

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await api.post('/login', form)
      setAuth(res.data.user, res.data.token)
      setToast({ message: 'Login successful! Welcome back 👋', type: 'success' })
      setTimeout(() => {
        const role = res.data.user.role
        if (role === 'admin') navigate('/admin')
        else if (role === 'staff') navigate('/staff')
        else navigate(from)
      }, 1000)
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-shell flex min-h-[calc(100dvh-4rem)] items-center justify-center">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <Card className="animate-scale-in w-full max-w-md p-8 sm:p-10">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 text-2xl text-white shadow-lg shadow-orange-500/25">
            🍽
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-stone-900">Welcome back</h2>
          <p className="mt-1 text-sm text-stone-500">Sign in to continue your order</p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            placeholder="you@example.com"
            autoComplete="email"
          />
          <Input
            label="Password"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            placeholder="••••••••"
            autoComplete="current-password"
          />
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>

        <p className="mt-8 text-center text-sm text-stone-500">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="font-semibold text-orange-600 hover:text-orange-700 hover:underline">
            Create one
          </Link>
        </p>
      </Card>
    </div>
  )
}

export default Login
