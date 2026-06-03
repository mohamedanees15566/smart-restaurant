import { HOW_IT_WORKS_STEPS } from '../constants/howItWorksSteps'
import Button from './ui/Button'

const HowItWorksModal = ({ open, onClose }) => {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-stone-900/50 p-4 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-title"
      onClick={onClose}
    >
      <div
        className="card animate-scale-in max-h-[90vh] w-full max-w-md overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="rounded-t-2xl bg-gradient-to-br from-stone-900 to-stone-800 px-6 py-8 text-center text-white">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500 text-2xl shadow-lg shadow-orange-500/30">
            🍽
          </div>
          <h2 id="welcome-title" className="text-xl font-bold tracking-tight">
            Welcome to SmartResto
          </h2>
          <p className="mt-2 text-sm text-stone-300">Four simple steps to enjoy your meal</p>
        </div>

        <div className="space-y-4 px-6 py-6">
          {HOW_IT_WORKS_STEPS.map((s) => (
            <div key={s.step} className="flex gap-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-orange-50 text-xl">
                {s.icon}
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-orange-600">Step {s.step}</p>
                <h3 className="font-semibold text-stone-900">{s.title}</h3>
                <p className="mt-0.5 text-xs leading-relaxed text-stone-500">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="px-6 pb-6">
          <Button className="w-full" onClick={onClose}>
            Got it!
          </Button>
        </div>
      </div>
    </div>
  )
}

export default HowItWorksModal
