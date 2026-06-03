import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import HowItWorksModal from './HowItWorksModal'
import { WELCOME_DISMISSED_KEY } from '../constants/howItWorksSteps'

const HIDDEN_PREFIXES = ['/admin', '/staff', '/kitchen', '/login', '/register']

const CustomerHelp = () => {
  const { pathname } = useLocation()
  const hidden = HIDDEN_PREFIXES.some((p) => pathname.startsWith(p))

  const [showWelcome, setShowWelcome] = useState(false)
  const [showHelp, setShowHelp] = useState(false)

  useEffect(() => {
    if (hidden) return
    if (!localStorage.getItem(WELCOME_DISMISSED_KEY)) {
      const timer = setTimeout(() => setShowWelcome(true), 700)
      return () => clearTimeout(timer)
    }
  }, [hidden, pathname])

  const dismiss = () => {
    localStorage.setItem(WELCOME_DISMISSED_KEY, '1')
    setShowWelcome(false)
    setShowHelp(false)
  }

  const modalOpen = showWelcome || showHelp

  if (hidden) return null

  return (
    <>
      <HowItWorksModal open={modalOpen} onClose={dismiss} />

      {!modalOpen && (
        <button
          type="button"
          onClick={() => setShowHelp(true)}
          className="fixed bottom-20 right-4 z-[90] flex h-12 w-12 items-center justify-center rounded-full bg-stone-900 text-lg font-bold text-white shadow-xl shadow-stone-900/25 transition-all duration-200 hover:scale-105 hover:bg-stone-800 md:bottom-6 md:right-6"
          aria-label="How it works"
          title="How it works"
        >
          ?
        </button>
      )}
    </>
  )
}

export default CustomerHelp
