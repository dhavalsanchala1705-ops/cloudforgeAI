import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, RefreshCw, Sparkles, DollarSign, Server, FileCode2,
  CheckCircle2, AlertCircle, Loader2, ChevronDown, ChevronUp
} from 'lucide-react'
import { projectsApi, architecturesApi } from '../services/api'
import LoadingScreen from '../components/shared/LoadingScreen'
import toast from 'react-hot-toast'

const TIER_CONFIG = {
  startup: {
    label: 'Startup',
    badgeClass: 'badge-startup',
    accentClass: 'text-green-400',
    borderClass: 'border-green-500/30',
    bgClass: 'bg-green-500/5',
  },
  production: {
    label: 'Production',
    badgeClass: 'badge-production',
    accentClass: 'text-blue-400',
    borderClass: 'border-blue-500/30',
    bgClass: 'bg-blue-500/5',
  },
  enterprise: {
    label: 'Enterprise',
    badgeClass: 'badge-enterprise',
    accentClass: 'text-purple-400',
    borderClass: 'border-purple-500/30',
    bgClass: 'bg-purple-500/5',
  },
}

function ServicePill({ name }) {
  return (
    <span className="px-2.5 py-1 rounded-lg bg-surface-800 border border-surface-700 text-xs font-mono text-surface-200">
      {name}
    </span>
  )
}

function ArchCard({ arch }) {
  const [expanded, setExpanded] = useState(false)
  const tier = TIER_CONFIG[arch.tier] || TIER_CONFIG.startup
  const services = arch.services || []
  const costItems = arch.cost_breakdown || {}

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`card border ${tier.borderClass} ${tier.bgClass}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <span className={tier.badgeClass}>{tier.label} Plan</span>
          <h3 className="text-lg font-display font-bold text-white mt-2">{arch.title}</h3>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1.5 justify-end">
            <DollarSign size={14} className={tier.accentClass} />
            <span className={`text-xl font-bold font-display ${tier.accentClass}`}>
              {arch.estimated_monthly_cost || '—'}
            </span>
          </div>
          <p className="text-xs text-surface-200">estimated / month</p>
        </div>
      </div>

      {/* Description */}
      <p className="text-surface-200 text-sm leading-relaxed mb-4">{arch.description}</p>

      {/* Services */}
      {services.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Server size={13} className="text-surface-200" />
            <span className="text-xs font-semibold text-surface-200 uppercase tracking-wide">AWS Services</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {services.map((s) => (
              <ServicePill key={s} name={s} />
            ))}
          </div>
        </div>
      )}

      {/* Cost breakdown */}
      {Object.keys(costItems).length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign size={13} className="text-surface-200" />
            <span className="text-xs font-semibold text-surface-200 uppercase tracking-wide">Cost Breakdown</span>
          </div>
          <div className="space-y-1.5">
            {Object.entries(costItems).map(([service, cost]) => (
              <div key={service} className="flex justify-between text-sm">
                <span className="text-surface-200">{service}</span>
                <span className="text-white font-medium">{cost}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Expandable deployment guide */}
      {arch.deployment_guide && (
        <div className="mt-4 border-t border-surface-800 pt-4">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-2 text-sm font-medium text-surface-200 hover:text-white transition-colors w-full"
          >
            <FileCode2 size={14} />
            Deployment Guide
            {expanded ? <ChevronUp size={14} className="ml-auto" /> : <ChevronDown size={14} className="ml-auto" />}
          </button>
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <pre className="mt-3 p-4 rounded-xl bg-surface-950 border border-surface-700 text-xs text-surface-200 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                  {arch.deployment_guide}
                </pre>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  )
}

export default function ProjectDetail() {
  const { projectId } = useParams()
  const navigate = useNavigate()

  const [project, setProject] = useState(null)
  const [architectures, setArchitectures] = useState([])
  const [loading, setLoading] = useState(true)
  const [regenerating, setRegenerating] = useState(false)
  const [polling, setPolling] = useState(false)

  const loadAll = useCallback(async () => {
    try {
      const [projRes, archRes] = await Promise.all([
        projectsApi.get(projectId),
        architecturesApi.getByProject(projectId),
      ])
      const proj = projRes.data?.project || projRes.data
      const archs = archRes.data?.architectures || archRes.data || []
      setProject(proj)
      setArchitectures(archs)
      return proj
    } catch {
      toast.error('Failed to load project')
    }
  }, [projectId])

  // Poll while generating
  useEffect(() => {
    let interval
    const init = async () => {
      setLoading(true)
      const proj = await loadAll()
      setLoading(false)
      if (proj?.status === 'generating') {
        setPolling(true)
        interval = setInterval(async () => {
          const p = await loadAll()
          if (p?.status !== 'generating') {
            clearInterval(interval)
            setPolling(false)
          }
        }, 4000)
      }
    }
    init()
    return () => clearInterval(interval)
  }, [loadAll])

  const handleRegenerate = async () => {
    setRegenerating(true)
    try {
      await projectsApi.generate(projectId)
      toast.success('Regeneration started…')
      setPolling(true)
      const interval = setInterval(async () => {
        const p = await loadAll()
        if (p?.status !== 'generating') {
          clearInterval(interval)
          setPolling(false)
        }
      }, 4000)
    } catch {
      toast.error('Failed to start regeneration')
    } finally {
      setRegenerating(false)
    }
  }

  if (loading) return <LoadingScreen message="Loading project details…" />
  if (!project) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <AlertCircle className="w-12 h-12 text-red-400" />
      <p className="text-white font-semibold">Project not found</p>
      <Link to="/dashboard" className="btn-secondary">Back to Dashboard</Link>
    </div>
  )

  const isGenerating = project.status === 'generating' || polling

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-8 gap-4 flex-wrap">
        <div>
          <button onClick={() => navigate('/dashboard')} className="btn-ghost mb-3 -ml-2">
            <ArrowLeft size={16} /> Dashboard
          </button>
          <h1 className="font-display text-3xl font-bold text-white mb-1">{project.name}</h1>
          <p className="text-surface-200 text-sm">{project.description}</p>
        </div>
        <div className="flex items-center gap-3">
          {project.status === 'completed' && (
            <button
              onClick={handleRegenerate}
              disabled={regenerating}
              className="btn-secondary"
            >
              {regenerating ? <Loader2 size={15} className="animate-spin" /> : <RefreshCw size={15} />}
              Regenerate
            </button>
          )}
        </div>
      </div>

      {/* Generating state */}
      {isGenerating && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="card text-center py-16 mb-8"
        >
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <Sparkles className="w-12 h-12 text-brand-400 animate-pulse" />
            </div>
            <h3 className="font-display text-xl font-bold text-white">AI is crafting your architectures…</h3>
            <p className="text-surface-200 text-sm max-w-sm">
              We're generating three tailored AWS architecture plans. This usually takes 15–30 seconds.
            </p>
            <div className="flex gap-2 mt-2">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ delay: i * 0.2, repeat: Infinity, duration: 1 }}
                  className="w-2 h-2 rounded-full bg-brand-500"
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Failed state */}
      {project.status === 'failed' && (
        <div className="card border border-red-500/30 bg-red-500/5 text-center py-12 mb-8">
          <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
          <h3 className="font-semibold text-white mb-2">Generation Failed</h3>
          <p className="text-surface-200 text-sm mb-4">Something went wrong. Please try regenerating.</p>
          <button onClick={handleRegenerate} disabled={regenerating} className="btn-primary mx-auto">
            <Sparkles size={15} /> Try Again
          </button>
        </div>
      )}

      {/* Architectures */}
      {architectures.length > 0 && !isGenerating && (
        <div>
          <div className="flex items-center gap-3 mb-6">
            <CheckCircle2 className="w-5 h-5 text-green-400" />
            <h2 className="section-title">Generated Architecture Plans</h2>
          </div>
          <div className="space-y-6">
            {architectures.map((arch) => (
              <ArchCard key={arch.id} arch={arch} />
            ))}
          </div>
        </div>
      )}

      {/* No architectures and not generating */}
      {architectures.length === 0 && !isGenerating && project.status !== 'failed' && (
        <div className="card text-center py-16">
          <Sparkles className="w-10 h-10 text-brand-400 mx-auto mb-3" />
          <h3 className="font-semibold text-white mb-2">Ready to Generate</h3>
          <p className="text-surface-200 text-sm mb-4">Click below to generate AWS architecture plans for this project.</p>
          <button onClick={handleRegenerate} disabled={regenerating} className="btn-primary mx-auto">
            <Sparkles size={15} /> Generate Now
          </button>
        </div>
      )}
    </div>
  )
}
