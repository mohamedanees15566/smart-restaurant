import { Link } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import { HOW_IT_WORKS_STEPS } from '../constants/howItWorksSteps'

const features = [
  { icon: '📱', title: 'QR Code Ordering', desc: 'Scan your table QR code and order instantly from your phone' },
  { icon: '⏳', title: 'Virtual Queue', desc: 'Join the queue from anywhere and get notified when your table is ready' },
  { icon: '🔴', title: 'Live Order Tracking', desc: 'Track your order in real-time from placed to served' },
  { icon: '⭐', title: 'Rate & Review', desc: 'Share your experience and help us improve our service' },
  { icon: '🍽️', title: 'Pre-Order Food', desc: 'Order your food before you arrive to save time' },
  { icon: '💳', title: 'Easy Payment', desc: 'Pay online quickly and securely without waiting for the bill' },
]

const Home = () => {
  const { token, user } = useAuthStore()

  return (
    <div className="min-h-screen">
      <section className="hero-gradient px-4 py-24 sm:py-32">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgb(249_115_22/0.15),transparent_50%)]" />
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <span className="animate-fade-in inline-flex items-center rounded-full border border-white/10 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-orange-200 backdrop-blur-sm">
            Smart Restaurant System
          </span>
          <h1 className="animate-slide-up mt-8 text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl">
            Fresh food,
            <br />
            <span className="bg-gradient-to-r from-orange-300 to-amber-200 bg-clip-text text-transparent">
              fast service
            </span>
          </h1>
          <p className="animate-slide-up stagger-1 mx-auto mt-6 max-w-xl text-lg text-stone-300">
            Browse our menu, pre-order your food, and skip the wait with our smart queue system.
          </p>
          <div className="animate-slide-up stagger-2 mt-10 flex flex-wrap justify-center gap-4">
            <Link to="/menu">
              <Button className="min-w-[160px] shadow-lg shadow-orange-500/30">Browse Menu</Button>
            </Link>
            <Link to="/queue">
              <button type="button" className="btn-secondary min-w-[160px] border-white/20 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 hover:text-white">
                Join Queue
              </button>
            </Link>
          </div>
        </div>
      </section>

      {token && (
        <div className="border-b border-orange-200/60 bg-orange-50/80 px-4 py-3 text-center backdrop-blur-sm">
          <p className="text-sm font-medium text-orange-900">
            Welcome back, {user?.name}!{' '}
            <Link to="/menu" className="font-bold text-orange-600 underline-offset-2 hover:underline">
              Browse Menu
            </Link>
          </p>
        </div>
      )}

      <section className="page-shell">
        <div className="page-container">
          <div className="mb-12 text-center">
            <h2 className="section-title">Why SmartResto?</h2>
            <p className="section-subtitle mx-auto max-w-md">
              Everything you need for a seamless dining experience
            </p>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <Card key={f.title} hover className={`animate-slide-up p-6 text-center stagger-${(i % 4) + 1}`}>
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-3xl">
                  {f.icon}
                </div>
                <h3 className="font-semibold text-stone-900">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-500">{f.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-stone-200/80 bg-white/60 px-4 py-16 backdrop-blur-sm sm:py-20">
        <div className="page-container max-w-4xl">
          <div className="mb-12 text-center">
            <h2 className="section-title">How it works</h2>
            <p className="section-subtitle">Simple steps to enjoy your meal</p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            {HOW_IT_WORKS_STEPS.map((s, i) => (
              <div key={s.step} className={`animate-slide-up text-center stagger-${i + 1}`}>
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-stone-900 text-3xl text-white shadow-lg">
                  {s.icon}
                </div>
                <p className="text-xs font-bold uppercase tracking-wider text-orange-600">Step {s.step}</p>
                <h3 className="mt-2 font-semibold text-stone-900">{s.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-stone-500">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {!token && (
        <section className="bg-stone-900 px-4 py-20 text-center text-white">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Ready to order?</h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-stone-400">
            Create an account and enjoy a seamless dining experience
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link to="/register">
              <Button>Create Account</Button>
            </Link>
            <Link to="/menu">
              <button type="button" className="btn-secondary border-stone-600 text-stone-200 hover:border-stone-500 hover:bg-stone-800">
                Browse Menu
              </button>
            </Link>
          </div>
        </section>
      )}

      <footer className="border-t border-stone-200 bg-white px-4 py-10 text-center">
        <p className="text-lg font-bold text-stone-900">
          <span className="text-orange-600">Smart</span>Resto
        </p>
        <p className="mt-1 text-xs text-stone-500">Smart Restaurant Pre-Order & Queue Management</p>
        <p className="mt-2 text-xs text-stone-400">© 2026 SmartResto. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default Home
