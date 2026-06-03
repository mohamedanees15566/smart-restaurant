import { useState } from 'react'
import useAuthStore from '../store/authStore'
import api from '../services/api'
import Toast from '../components/Toast'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import PageHeader from '../components/ui/PageHeader'

const roleBadge = {
  admin: 'bg-violet-100 text-violet-700 ring-violet-600/10',
  staff: 'bg-blue-100 text-blue-700 ring-blue-600/10',
  customer: 'bg-emerald-100 text-emerald-700 ring-emerald-600/10',
}

const Profile = () => {
  const { user, setAuth, token } = useAuthStore()
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
  })
  const [toast, setToast] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleUpdate = async () => {
    setLoading(true)
    try {
      const res = await api.patch('/profile', { name: form.name, phone: form.phone })
      setAuth(res.data.user, token)
      setToast({ message: 'Profile updated!', type: 'success' })
    } catch (err) {
      setToast({ message: 'Failed to update profile.', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-shell">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="page-container-narrow max-w-lg">
        <PageHeader title="My Profile" subtitle="Manage your account settings" />

        <Card className="mb-6 p-6">
          <div className="mb-8 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 text-2xl font-bold text-white shadow-lg shadow-orange-500/25">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-bold text-stone-900">{user?.name}</p>
              <p className="text-sm text-stone-500">{user?.email}</p>
              <span className={`badge mt-2 ring-1 ${roleBadge[user?.role] || roleBadge.customer}`}>
                {user?.role}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <Input label="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <Input label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+94 77 123 4567" />
            <Button onClick={handleUpdate} disabled={loading} className="w-full">
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="mb-4 font-semibold text-stone-800">Account info</h2>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between border-b border-stone-50 pb-3">
              <dt className="text-stone-500">Email</dt>
              <dd className="font-medium text-stone-800">{user?.email}</dd>
            </div>
            <div className="flex justify-between border-b border-stone-50 pb-3">
              <dt className="text-stone-500">Role</dt>
              <dd className="font-medium capitalize text-stone-800">{user?.role}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-stone-500">Status</dt>
              <dd className="font-semibold text-emerald-600">Active</dd>
            </div>
          </dl>
        </Card>
      </div>
    </div>
  )
}

export default Profile
