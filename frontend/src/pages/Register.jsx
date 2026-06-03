import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../services/api'
import useAuthStore from '../store/authStore'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'

const Register = () => {
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await api.post('/register', form)
      setAuth(res.data.user, res.data.token)
      navigate('/')
    } catch (err) {
      const errors = err.response?.data?.errors
      if (errors) {
        setError(Object.values(errors)[0][0])
      } else {
        setError(err.response?.data?.message || 'Registration failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-shell flex min-h-[calc(100dvh-4rem)] items-center justify-center py-12">
      <Card className="animate-scale-in w-full max-w-md p-8 sm:p-10">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 text-2xl text-white shadow-lg shadow-orange-500/25">
            ✨
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-stone-900">Create account</h2>
          <p className="mt-1 text-sm text-stone-500">Join us to start ordering</p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Full Name" type="text" name="name" value={form.name} onChange={handleChange} required placeholder="John Doe" />
          <Input label="Email" type="email" name="email" value={form.email} onChange={handleChange} required placeholder="you@example.com" />
          <Input label="Phone (optional)" type="text" name="phone" value={form.phone} onChange={handleChange} placeholder="+94 77 123 4567" />
          <Input label="Password" type="password" name="password" value={form.password} onChange={handleChange} required placeholder="••••••••" />
          <Input label="Confirm Password" type="password" name="password_confirmation" value={form.password_confirmation} onChange={handleChange} required placeholder="••••••••" />
          <Button type="submit" disabled={loading} className="w-full !mt-6">
            {loading ? 'Creating account...' : 'Create Account'}
          </Button>
        </form>

        <p className="mt-8 text-center text-sm text-stone-500">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-orange-600 hover:underline">
            Sign in
          </Link>
        </p>
      </Card>
    </div>
  )
}

export default Register
