import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import { getMenuImageUrl } from '../utils/media'
import useCartStore from '../store/cartStore'
import useAuthStore from '../store/authStore'
import Toast from '../components/Toast'
import Spinner from '../components/Spinner'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import EmptyState from '../components/ui/EmptyState'

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
    setToast({ message: `${item.name} added to cart`, type: 'success' })
  }

  return (
    <div className="min-h-screen">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="border-b border-stone-200/80 bg-white/80 px-4 py-8 backdrop-blur-xl sm:px-6">
        <div className="page-container">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="section-title">Our Menu</h1>
              <p className="section-subtitle">Fresh food made with love</p>
            </div>
            {getCount() > 0 && (
              <Button size="sm" onClick={() => (token ? navigate('/cart') : navigate('/login'))}>
                Cart ({getCount()})
              </Button>
            )}
          </div>

          <div className="relative mb-5">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-stone-400">🔍</span>
            <input
              type="search"
              placeholder="Search dishes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-11"
              aria-label="Search menu"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setSelectedCategory('')}
              className={`chip ${selectedCategory === '' ? 'chip-active' : 'chip-inactive'}`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`chip ${selectedCategory === cat.id ? 'chip-active' : 'chip-inactive'}`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="page-shell pt-8">
        <div className="page-container">
          {loading ? (
            <Spinner label="Loading menu..." />
          ) : items.length === 0 ? (
            <EmptyState
              icon="🍽️"
              title="No items found"
              description="Try a different search or category"
              actionLabel="View all"
              onAction={() => { setSearch(''); setSelectedCategory('') }}
            />
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item, i) => (
                <Card key={item.id} hover className={`animate-slide-up overflow-hidden stagger-${(i % 4) + 1}`}>
                  <div className="relative h-44 overflow-hidden bg-gradient-to-br from-orange-50 to-stone-100">
                    {getMenuImageUrl(item) ? (
                      <img
                        src={getMenuImageUrl(item)}
                        alt={item.name}
                        className="h-full w-full object-cover transition duration-500 hover:scale-105"
                        onError={(e) => { e.target.style.display = 'none' }}
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-5xl opacity-60">🍽️</div>
                    )}
                    <span className="absolute right-3 top-3 rounded-full bg-white/95 px-3 py-1 text-sm font-bold text-orange-600 shadow-sm backdrop-blur-sm">
                      ${item.price}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-stone-900">{item.name}</h3>
                    <p className="mt-1 line-clamp-2 text-xs text-stone-500">{item.description}</p>
                    <p className="mt-2 text-xs text-stone-400">⏱ {item.prep_time_mins} min prep</p>
                    <Button className="mt-4 w-full" size="sm" onClick={() => handleAddToCart(item)}>
                      {token ? 'Add to Cart' : 'Sign in to Order'}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Menu
