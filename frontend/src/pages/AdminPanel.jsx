import TableQRCode from '../components/TableQRCode'
import { useEffect, useState } from 'react'
import api from '../services/api'
import Spinner from '../components/Spinner'
import Toast from '../components/Toast'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, BarChart, Bar,
  PieChart, Pie, Cell,
} from 'recharts'

const COLORS = ['#f97316', '#3b82f6', '#10b981', '#8b5cf6', '#ef4444']

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [stats, setStats] = useState(null)
  const [revenue, setRevenue] = useState([])
  const [topItems, setTopItems] = useState([])
  const [orderStats, setOrderStats] = useState([])
  const [users, setUsers] = useState([])
  const [menuItems, setMenuItems] = useState([])
  const [categories, setCategories] = useState([])
  const [tables, setTables] = useState([])
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)

  // Menu form
  const [menuForm, setMenuForm] = useState({
    name: '', category_id: '', price: '',
    description: '', prep_time_mins: 15, is_available: true, image: null
  })
  const [editingItem, setEditingItem] = useState(null)

  // Table form
  const [tableForm, setTableForm] = useState({
    table_number: '', capacity: 2, location: 'Indoor'
  })

  useEffect(() => {
    fetchAll()
  }, [])

  const fetchAll = async () => {
    setLoading(true)
    try {
      const [s, r, t, o, u, m, c, tb, rv] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/analytics/revenue'),
        api.get('/admin/analytics/items'),
        api.get('/admin/analytics/orders'),
        api.get('/admin/users'),
        api.get('/admin/menu/items'),
        api.get('/admin/categories'),
        api.get('/admin/tables'),
        api.get('/reviews'),
      ])
      setStats(s.data)
      setRevenue(r.data)
      setTopItems(t.data)
      setOrderStats(o.data)
      setUsers(u.data)
      setMenuItems(m.data)
      setCategories(c.data)
      setTables(tb.data)
      setReviews(rv.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // ── USER MANAGEMENT ──
  const handleUpdateUser = async (id, data) => {
    try {
      await api.patch(`/admin/users/${id}`, data)
      setToast({ message: 'User updated!', type: 'success' })
      fetchAll()
    } catch (err) {
      setToast({ message: 'Failed to update user.', type: 'error' })
    }
  }

  // ── MENU MANAGEMENT ──
  const handleMenuSubmit = async () => {
    try {
      const formData = new FormData()
      formData.append('name', menuForm.name)
      formData.append('category_id', menuForm.category_id)
      formData.append('price', menuForm.price)
      formData.append('description', menuForm.description)
      formData.append('prep_time_mins', menuForm.prep_time_mins)
      formData.append('is_available', menuForm.is_available ? 1 : 0)
      if (menuForm.image) {
        formData.append('image', menuForm.image)
      }

      if (editingItem) {
        formData.append('_method', 'PATCH')
        await api.post(`/admin/menu/items/${editingItem.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        setToast({ message: 'Menu item updated!', type: 'success' })
      } else {
        await api.post('/admin/menu/items', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        setToast({ message: 'Menu item created!', type: 'success' })
      }
      setMenuForm({ name: '', category_id: '', price: '', description: '', prep_time_mins: 15, is_available: true, image: null })
      setEditingItem(null)
      fetchAll()
    } catch (err) {
      setToast({ message: 'Failed to save item.', type: 'error' })
    }
  }

  const handleDeleteItem = async (id) => {
    if (!confirm('Delete this item?')) return
    try {
      await api.delete(`/admin/menu/items/${id}`)
      setToast({ message: 'Item deleted!', type: 'success' })
      fetchAll()
    } catch (err) {
      setToast({ message: 'Failed to delete.', type: 'error' })
    }
  }

  const handleEditItem = (item) => {
    setEditingItem(item)
    setMenuForm({
      name: item.name,
      category_id: item.category_id,
      price: item.price,
      description: item.description || '',
      prep_time_mins: item.prep_time_mins,
      is_available: item.is_available,
      image: null,
    })
    setActiveTab('menu')
  }

  // ── TABLE MANAGEMENT ──
  const handleTableSubmit = async () => {
    try {
      await api.post('/admin/tables', tableForm)
      setToast({ message: 'Table created!', type: 'success' })
      setTableForm({ table_number: '', capacity: 2, location: 'Indoor' })
      fetchAll()
    } catch (err) {
      setToast({ message: 'Failed to create table.', type: 'error' })
    }
  }

  const handleDeleteTable = async (id) => {
    if (!confirm('Delete this table?')) return
    try {
      await api.delete(`/admin/tables/${id}`)
      setToast({ message: 'Table deleted!', type: 'success' })
      fetchAll()
    } catch (err) {
      setToast({ message: 'Failed to delete table.', type: 'error' })
    }
  }

  if (loading) return <Spinner />

  const tabs = ['dashboard', 'menu', 'tables', 'users', 'reviews']

  return (
    <div className="min-h-screen bg-gray-50">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header */}
      <div className="bg-white shadow-sm py-4 px-6">
        <h1 className="text-xl font-bold text-gray-800">Admin Panel 🛠️</h1>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-100 px-6 overflow-x-auto">
        <div className="flex gap-6 min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 text-sm font-medium capitalize border-b-2 transition ${
                activeTab === tab
                  ? 'border-orange-500 text-orange-500'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab === 'dashboard' && '📊 Dashboard'}
              {tab === 'menu' && '🍽️ Menu'}
              {tab === 'tables' && '🪑 Tables'}
              {tab === 'users' && '👥 Users'}
              {tab === 'reviews' && `⭐ Reviews (${reviews.length})`}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">

        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <div>
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: "Today's Orders", value: stats?.today_orders, icon: '📋', color: 'text-blue-500' },
                { label: "Today's Revenue", value: `$${parseFloat(stats?.today_revenue || 0).toFixed(2)}`, icon: '💰', color: 'text-green-500' },
                { label: 'Pending Orders', value: stats?.pending_orders, icon: '⏳', color: 'text-orange-500' },
                { label: 'Queue Now', value: stats?.active_queue, icon: '👥', color: 'text-purple-500' },
                { label: 'Total Revenue', value: `$${parseFloat(stats?.total_revenue || 0).toFixed(2)}`, icon: '💵', color: 'text-green-600' },
                { label: 'Available Tables', value: `${stats?.available_tables}/${stats?.total_tables}`, icon: '🪑', color: 'text-blue-600' },
                { label: 'Total Customers', value: stats?.total_users, icon: '👤', color: 'text-gray-600' },
                { label: 'Menu Items', value: stats?.total_menu_items, icon: '🍽️', color: 'text-orange-600' },
              ].map((s, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-sm p-4">
                  <div className="text-2xl mb-1">{s.icon}</div>
                  <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
                  <div className="text-xs text-gray-400 mt-1">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Revenue Chart */}
            <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
              <h2 className="font-semibold text-gray-700 mb-4">Revenue Last 7 Days</h2>
              {revenue.length === 0 ? (
                <div className="text-center py-8 text-gray-400 text-sm">No data yet — place some orders first!</div>
              ) : (
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={revenue}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="revenue" stroke="#f97316" strokeWidth={2} dot={{ fill: '#f97316' }} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Top Items */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="font-semibold text-gray-700 mb-4">Top Selling Items</h2>
                {topItems.length === 0 ? (
                  <div className="text-center py-8 text-gray-400 text-sm">No data yet</div>
                ) : (
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={topItems}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <Bar dataKey="total_sold" fill="#f97316" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>

              {/* Order Status Pie */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="font-semibold text-gray-700 mb-4">Orders by Status</h2>
                {orderStats.length === 0 ? (
                  <div className="text-center py-8 text-gray-400 text-sm">No data yet</div>
                ) : (
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={orderStats}
                        dataKey="count"
                        nameKey="status"
                        cx="50%"
                        cy="50%"
                        outerRadius={70}
                        label={({ status, count }) => `${status}: ${count}`}
                      >
                        {orderStats.map((_, index) => (
                          <Cell key={index} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>
        )}

        {/* MENU TAB */}
        {activeTab === 'menu' && (
          <div>
            {/* Add/Edit Form */}
            <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
              <h2 className="font-semibold text-gray-700 mb-4">
                {editingItem ? `Edit: ${editingItem.name}` : 'Add New Menu Item'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Item Name</label>
                  <input
                    type="text"
                    value={menuForm.name}
                    onChange={(e) => setMenuForm({ ...menuForm, name: e.target.value })}
                    placeholder="e.g. Grilled Chicken"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Category</label>
                  <select
                    value={menuForm.category_id}
                    onChange={(e) => setMenuForm({ ...menuForm, category_id: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                  >
                    <option value="">Select category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Price ($)</label>
                  <input
                    type="number"
                    value={menuForm.price}
                    onChange={(e) => setMenuForm({ ...menuForm, price: e.target.value })}
                    placeholder="0.00"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Prep Time (mins)</label>
                  <input
                    type="number"
                    value={menuForm.prep_time_mins}
                    onChange={(e) => setMenuForm({ ...menuForm, prep_time_mins: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs text-gray-500 block mb-1">Description</label>
                  <textarea
                    value={menuForm.description}
                    onChange={(e) => setMenuForm({ ...menuForm, description: e.target.value })}
                    rows={2}
                    placeholder="Short description..."
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>

                {/* Image Upload */}
                <div className="md:col-span-2">
                  <label className="text-xs text-gray-500 block mb-1">Food Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setMenuForm({ ...menuForm, image: e.target.files[0] })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none"
                  />
                  {editingItem?.image && (
                    <img
                      src={`${import.meta.env.VITE_API_URL?.replace('/api', '')}/storage/${editingItem.image}`}
                      alt="Current"
                      className="mt-2 h-20 w-20 object-cover rounded-lg"
                    />
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="available"
                    checked={menuForm.is_available}
                    onChange={(e) => setMenuForm({ ...menuForm, is_available: e.target.checked })}
                  />
                  <label htmlFor="available" className="text-sm text-gray-600">Available</label>
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <button
                  onClick={handleMenuSubmit}
                  className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-6 py-2 rounded-xl transition"
                >
                  {editingItem ? 'Update Item' : 'Add Item'}
                </button>
                {editingItem && (
                  <button
                    onClick={() => {
                      setEditingItem(null)
                      setMenuForm({ name: '', category_id: '', price: '', description: '', prep_time_mins: 15, is_available: true, image: null })
                    }}
                    className="bg-gray-100 text-gray-600 text-sm font-semibold px-6 py-2 rounded-xl hover:bg-gray-200 transition"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>

            {/* Menu Items List */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500 text-xs">
                  <tr>
                    <th className="text-left px-4 py-3">Image</th>
                    <th className="text-left px-4 py-3">Item</th>
                    <th className="text-left px-4 py-3">Category</th>
                    <th className="text-left px-4 py-3">Price</th>
                    <th className="text-left px-4 py-3">Status</th>
                    <th className="text-left px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {menuItems.map((item) => (
                    <tr key={item.id} className="border-t border-gray-50 hover:bg-gray-50">
                      <td className="px-4 py-3">
                        {item.image ? (
                          <img
                            src={`${import.meta.env.VITE_API_URL?.replace('/api', '')}/storage/${item.image}`}
                            alt={item.name}
                            className="w-10 h-10 object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center text-lg">🍽️</div>
                        )}
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-700">{item.name}</td>
                      <td className="px-4 py-3 text-gray-400">{item.category?.name}</td>
                      <td className="px-4 py-3 text-orange-500 font-semibold">${item.price}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          item.is_available ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'
                        }`}>
                          {item.is_available ? 'Available' : 'Unavailable'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditItem(item)}
                            className="text-xs bg-blue-50 text-blue-500 px-3 py-1 rounded-lg hover:bg-blue-100 transition"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            className="text-xs bg-red-50 text-red-500 px-3 py-1 rounded-lg hover:bg-red-100 transition"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TABLES TAB */}
        {activeTab === 'tables' && (
          <div>
            {/* Add Table Form */}
            <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
              <h2 className="font-semibold text-gray-700 mb-4">Add New Table</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Table Number</label>
                  <input
                    type="text"
                    value={tableForm.table_number}
                    onChange={(e) => setTableForm({ ...tableForm, table_number: e.target.value })}
                    placeholder="e.g. T11"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Capacity</label>
                  <input
                    type="number"
                    value={tableForm.capacity}
                    onChange={(e) => setTableForm({ ...tableForm, capacity: e.target.value })}
                    min={1}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Location</label>
                  <select
                    value={tableForm.location}
                    onChange={(e) => setTableForm({ ...tableForm, location: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                  >
                    <option>Indoor</option>
                    <option>Outdoor</option>
                    <option>VIP</option>
                  </select>
                </div>
              </div>
              <button
                onClick={handleTableSubmit}
                className="mt-4 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-6 py-2 rounded-xl transition"
              >
                Add Table
              </button>
            </div>

            {/* Tables List */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500 text-xs">
                  <tr>
                    <th className="text-left px-4 py-3">Table</th>
                    <th className="text-left px-4 py-3">Capacity</th>
                    <th className="text-left px-4 py-3">Location</th>
                    <th className="text-left px-4 py-3">Status</th>
                    <th className="text-left px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tables.map((table) => (
                    <tr key={table.id} className="border-t border-gray-50 hover:bg-gray-50">
                      <td className="px-4 py-3 font-bold text-gray-700">{table.table_number}</td>
                      <td className="px-4 py-3 text-gray-400">{table.capacity} seats</td>
                      <td className="px-4 py-3 text-gray-400">{table.location}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          table.status === 'available' ? 'bg-green-100 text-green-600' :
                          table.status === 'occupied' ? 'bg-red-100 text-red-500' :
                          'bg-yellow-100 text-yellow-600'
                        }`}>
                          {table.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <TableQRCode table={table} />
                          <button
                            onClick={() => handleDeleteTable(table.id)}
                            className="text-xs bg-red-50 text-red-500 px-3 py-1 rounded-lg hover:bg-red-100 transition"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* USERS TAB */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs">
                <tr>
                  <th className="text-left px-4 py-3">Name</th>
                  <th className="text-left px-4 py-3">Email</th>
                  <th className="text-left px-4 py-3">Role</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-left px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-t border-gray-50 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-700">{user.name}</td>
                    <td className="px-4 py-3 text-gray-400">{user.email}</td>
                    <td className="px-4 py-3">
                      <select
                        value={user.role}
                        onChange={(e) => handleUpdateUser(user.id, { role: e.target.value })}
                        className="text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none"
                      >
                        <option value="customer">Customer</option>
                        <option value="staff">Staff</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        user.is_active ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'
                      }`}>
                        {user.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleUpdateUser(user.id, { is_active: !user.is_active })}
                        className={`text-xs px-3 py-1 rounded-lg transition ${
                          user.is_active
                            ? 'bg-red-50 text-red-500 hover:bg-red-100'
                            : 'bg-green-50 text-green-500 hover:bg-green-100'
                        }`}
                      >
                        {user.is_active ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* REVIEWS TAB */}
        {activeTab === 'reviews' && (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-700">Customer Reviews ⭐</h2>
            </div>
            {reviews.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <div className="text-5xl mb-3">⭐</div>
                <p>No reviews yet</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {reviews.map((review) => (
                  <div key={review.id} className="px-6 py-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-medium text-gray-700 text-sm">{review.user?.name}</p>
                        <p className="text-xs text-gray-400">{new Date(review.created_at).toLocaleString()}</p>
                      </div>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span key={star} className={star <= review.rating ? 'text-yellow-400' : 'text-gray-200'}>
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                    {review.comment && (
                      <p className="text-sm text-gray-500 mt-1">{review.comment}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  )
}

export default AdminPanel
