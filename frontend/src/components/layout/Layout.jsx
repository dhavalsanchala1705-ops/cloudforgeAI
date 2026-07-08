import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { useAuth } from '../../hooks/useAuth'
import { LayoutDashboard, Plus, LogOut, Cloud, Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function Layout({ children }) {
  const { user } = useAuthStore()
  const { signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const handleSignOut = () => {
    signOut()
    navigate('/')
  }

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
    { icon: Plus, label: 'New Project', href: '/projects/new' },
  ]

  return (
    <div className="min-h-screen flex bg-surface-950">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex flex-col w-64 bg-surface-900 border-r border-surface-800 transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-surface-800">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center shadow-lg">
            <Cloud className="w-5 h-5 text-white" />
          </div>
          <span className="font-display font-bold text-white text-lg">CloudArch AI</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navItems.map(({ icon: Icon, label, href }) => (
            <Link
              key={href}
              to={href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                location.pathname === href
                  ? 'bg-brand-500/20 text-brand-400 border border-brand-500/30'
                  : 'text-surface-200 hover:text-white hover:bg-surface-800'
              }`}
            >
              <Icon className="w-4.5 h-4.5" size={18} />
              {label}
            </Link>
          ))}
        </nav>

        {/* User + Sign out */}
        <div className="px-4 py-4 border-t border-surface-800">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-surface-800 mb-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-purple-500 flex items-center justify-center text-xs font-bold">
              {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.name || 'User'}</p>
              <p className="text-xs text-surface-200 truncate">{user?.email || ''}</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="btn-ghost w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Toggle button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-surface-800 border border-surface-700 text-white hover:bg-surface-700 transition-all lg:hidden"
      >
        {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      {/* Main content */}
      <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <div className="min-h-screen p-8">{children}</div>
      </main>
    </div>
  )
}
