import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import useCartStore from '../store/cartStore'
import useAuthStore from '../store/authStore'
import Toast from '../components/Toast'
import Spinner from '../components/Spinner'

const Menu = () => {
  const navigate = useNavigate()
  const { token } = useAuthStore()
  const { addItem, getCount } = useCartStore()

  const [categories, setCategories] = useState([])
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [toast, setToast] = useState(null)

  useEffect(() => {
    fetchCategories()
    fetchItems()
  }, [])

  useEffect(() => {
    fetchItems()
  }, [search, selectedCategory])

  const fetchCategories = async () => {
    try {
      const res = await api.get('/menu/categories')
      setCategories(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  const fetchItems = async () => {
    setLoading(true)
    try {
      const params = {}
      if (search) params.search = search
      if (selectedCategory) params.category_id = selectedCategory
      const res = await api.get('/menu/items', { params })
      setItems(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = (item) => {
    if (!token) {
      navigate('/login', { state: { from: '/menu' } })
      return
    }
    addItem(item)
    setToast({ message: `${item.name} added to cart! 🛒`, type: 'success' })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header */}
      <div className="bg-white shadow-sm py-6 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Our Menu</h1>
              <p className="text-gray-500 text-sm">Fresh food made with love</p>
            </div>
            {getCount() > 0 && (
              <button
                onClick={() => token ? navigate('/cart') : navigate('/login')}
                className="bg-orange-500 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-orange-600 transition"
              >
                🛒 Cart ({getCount()})
              </button>
            )}
          </div>

          {/* Search */}
          <input
            type="text"
            placeholder="Search menu..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 mb-4"
          />

          {/* Category Filter */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setSelectedCategory('')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${selectedCategory === ''
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${selectedCategory === cat.id
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {loading ? (
          <Spinner />
        ) : items.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <div className="text-5xl mb-4">🍽️</div>
            <p className="text-lg font-medium">No items found</p>
            <p className="text-sm mt-1">Try a different search or category</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition">

                {/* Image */}
                <div className="h-40 overflow-hidden bg-orange-50">
                  {item.image ? (
                    <img
                      src={`${import.meta.env.VITE_API_URL?.replace('/api', '')}/storage/${item.image}`}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.style.display = 'none' }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl">
                      🍽️
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="font-semibold text-gray-800">{item.name}</h3>
                    <span className="text-orange-500 font-bold text-sm">${item.price}</span>
                  </div>
                  <p className="text-gray-500 text-xs mb-1">{item.description}</p>
                  <p className="text-gray-400 text-xs mb-4">⏱ {item.prep_time_mins} mins</p>
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold py-2 rounded-xl transition"
                  >
                    {token ? 'Add to Cart' : 'Login to Order'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Menu