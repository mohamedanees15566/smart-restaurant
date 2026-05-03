import { Component } from 'react'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-gray-700 mb-2">Something went wrong</h2>
            <p className="text-gray-400 text-sm mb-6">Please refresh the page and try again</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-orange-500 text-white px-6 py-2.5 rounded-full font-semibold hover:bg-orange-600 transition"
            >
              Refresh Page
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

export default ErrorBoundary