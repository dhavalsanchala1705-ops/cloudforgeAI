import { Link } from 'react-router-dom'
import { Cloud, Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-surface-950 flex flex-col items-center justify-center px-6 text-center">
      {/* Decorative glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden -z-10"
      >
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-brand-600/10 blur-[100px] rounded-full" />
      </div>

      {/* Logo */}
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center shadow-lg mb-6">
        <Cloud className="w-8 h-8 text-white" />
      </div>

      <h1 className="font-display text-7xl font-extrabold gradient-text mb-4">404</h1>
      <h2 className="font-display text-2xl font-bold text-white mb-3">Page Not Found</h2>
      <p className="text-surface-200 text-sm max-w-sm mb-8">
        The page you're looking for doesn't exist or has been moved. Let's get you back on track.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <Link to="/" className="btn-primary">
          <Home size={16} /> Back to Home
        </Link>
        <Link to="/dashboard" className="btn-secondary">
          Go to Dashboard
        </Link>
      </div>
    </div>
  )
}
