import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, FolderOpen, Trash2, RefreshCw, Clock, ChevronRight } from 'lucide-react'
import { projectsApi } from '../services/api'
import { useAuthStore } from '../store/authStore'
import LoadingScreen from '../components/shared/LoadingScreen'
import EmptyState from '../components/shared/EmptyState'
import toast from 'react-hot-toast'

const STATUS_STYLES = {
  pending: 'badge bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
  generating: 'badge bg-blue-500/20 text-blue-400 border border-blue-500/30 animate-pulse',
  completed: 'badge bg-green-500/20 text-green-400 border border-green-500/30',
  failed: 'badge bg-red-500/20 text-red-400 border border-red-500/30',
}

function ProjectCard({ project, onDelete }) {
  const navigate = useNavigate()

  const handleDelete = async (e) => {
    e.stopPropagation()
    e.preventDefault()
    if (!window.confirm(`Delete "${project.name}"? This cannot be undone.`)) return
    try {
      await projectsApi.delete(project.id)
      toast.success('Project deleted')
      onDelete(project.id)
    } catch {
      toast.error('Failed to delete project')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={() => navigate(`/projects/${project.id}`)}
      className="card-hover group"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-semibold text-white truncate">{project.name}</h3>
            <span className={STATUS_STYLES[project.status] || STATUS_STYLES.pending}>
              {project.status}
            </span>
          </div>
          {project.description && (
            <p className="text-surface-200 text-sm line-clamp-2 mb-3">{project.description}</p>
          )}
          <div className="flex items-center gap-1.5 text-xs text-surface-200">
            <Clock size={12} />
            {new Date(project.created_at).toLocaleDateString('en-US', {
              year: 'numeric', month: 'short', day: 'numeric',
            })}
          </div>
        </div>
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleDelete}
            className="p-2 rounded-lg text-surface-200 hover:text-red-400 hover:bg-red-500/10 transition-colors"
            title="Delete project"
          >
            <Trash2 size={15} />
          </button>
          <ChevronRight size={18} className="text-surface-200" />
        </div>
      </div>
    </motion.div>
  )
}

export default function Dashboard() {
  const { user } = useAuthStore()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchProjects = async (silent = false) => {
    if (!silent) setLoading(true)
    else setRefreshing(true)
    try {
      const res = await projectsApi.list()
      setProjects(res.data?.projects || res.data || [])
    } catch {
      if (!silent) toast.error('Failed to load projects')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  const handleDelete = (id) => setProjects((prev) => prev.filter((p) => p.id !== id))

  if (loading) return <LoadingScreen message="Loading your projects..." />

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-white mb-1">
            Welcome back, {user?.name?.split(' ')[0] || 'there'} 👋
          </h1>
          <p className="text-surface-200 text-sm">
            {projects.length === 0
              ? 'Create your first architecture project to get started.'
              : `You have ${projects.length} project${projects.length !== 1 ? 's' : ''}.`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchProjects(true)}
            disabled={refreshing}
            className="btn-secondary"
            title="Refresh"
          >
            <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} />
          </button>
          <Link to="/projects/new" className="btn-primary">
            <Plus size={16} /> New Project
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Projects', value: projects.length },
          { label: 'Completed', value: projects.filter((p) => p.status === 'completed').length },
          { label: 'Generating', value: projects.filter((p) => p.status === 'generating').length },
          { label: 'Pending', value: projects.filter((p) => p.status === 'pending').length },
        ].map(({ label, value }) => (
          <div key={label} className="card py-4 text-center">
            <p className="text-2xl font-display font-bold text-white">{value}</p>
            <p className="text-xs text-surface-200 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Projects list */}
      {projects.length === 0 ? (
        <EmptyState
          icon={FolderOpen}
          title="No projects yet"
          description="Create your first architecture project and let AI generate tailored AWS plans for you."
          action={
            <Link to="/projects/new" className="btn-primary">
              <Plus size={16} /> Create First Project
            </Link>
          }
        />
      ) : (
        <div className="space-y-4">
          <h2 className="section-title mb-4">Your Projects</h2>
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  )
}
