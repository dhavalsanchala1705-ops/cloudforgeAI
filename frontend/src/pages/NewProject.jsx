import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Loader2, Sparkles } from 'lucide-react'
import { projectsApi } from '../services/api'
import toast from 'react-hot-toast'

const APP_TYPES = [
  'Web Application',
  'Mobile Backend',
  'Data Pipeline',
  'Machine Learning',
  'E-commerce',
  'SaaS Platform',
  'IoT Application',
  'Media Streaming',
]

const SCALE_OPTIONS = [
  { value: 'startup', label: 'Startup', sub: '< 10k users' },
  { value: 'growth', label: 'Growth', sub: '10k – 500k users' },
  { value: 'enterprise', label: 'Enterprise', sub: '500k+ users' },
]

const REGIONS = [
  'us-east-1 (N. Virginia)',
  'us-west-2 (Oregon)',
  'eu-west-1 (Ireland)',
  'ap-southeast-1 (Singapore)',
  'ap-northeast-1 (Tokyo)',
]

const STEPS = ['Project Info', 'Requirements', 'Review & Generate']

export default function NewProject() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [creating, setCreating] = useState(false)

  const [form, setForm] = useState({
    name: '',
    description: '',
    appType: '',
    scale: 'startup',
    region: 'us-east-1 (N. Virginia)',
    requirements: '',
    budget: '',
    compliance: [],
  })

  const update = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }))

  const toggleCompliance = (item) =>
    setForm((f) => ({
      ...f,
      compliance: f.compliance.includes(item)
        ? f.compliance.filter((c) => c !== item)
        : [...f.compliance, item],
    }))

  const canNext = () => {
    if (step === 0) return form.name.trim().length > 0 && form.description.trim().length > 0
    if (step === 1) return form.appType !== ''
    return true
  }

  const handleSubmit = async () => {
    setCreating(true)
    try {
      const payload = {
        name: form.name,
        description: form.description,
        questions: {
          app_type: form.appType,
          scale: form.scale,
          region: form.region,
          requirements: form.requirements,
          budget: form.budget,
          compliance: form.compliance,
        },
      }
      const res = await projectsApi.create(payload)
      const projectId = res.data?.id || res.data?.project_id
      if (!projectId) throw new Error('No project ID returned')
      toast.success('Project created! Generating architectures…')
      // Fire generation immediately
      await projectsApi.generate(projectId)
      navigate(`/projects/${projectId}`)
    } catch (err) {
      toast.error(err?.response?.data?.detail || 'Failed to create project')
      setCreating(false)
    }
  }

  // ── Step renderers ──────────────────────────────────────────
  const renderStep0 = () => (
    <div className="space-y-5">
      <div>
        <label className="label">Project Name *</label>
        <input
          type="text"
          placeholder="e.g. My E-commerce Platform"
          value={form.name}
          onChange={update('name')}
          className="input"
          maxLength={100}
        />
      </div>
      <div>
        <label className="label">What does your application do? *</label>
        <textarea
          placeholder="Describe your application in a few sentences. Include the core functionality, who the users are, and any key technical constraints…"
          value={form.description}
          onChange={update('description')}
          rows={5}
          className="input resize-none"
        />
        <p className="text-xs text-surface-200 mt-1.5">
          {form.description.length} / 2000 characters
        </p>
      </div>
    </div>
  )

  const renderStep1 = () => (
    <div className="space-y-6">
      {/* App type */}
      <div>
        <label className="label">Application Type *</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {APP_TYPES.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setForm((f) => ({ ...f, appType: type }))}
              className={`px-3 py-2.5 rounded-xl text-sm font-medium border transition-all duration-200 text-center ${
                form.appType === type
                  ? 'bg-brand-500/20 text-brand-400 border-brand-500/50'
                  : 'bg-surface-800 text-surface-200 border-surface-700 hover:border-surface-600 hover:text-white'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Scale */}
      <div>
        <label className="label">Expected Scale</label>
        <div className="grid grid-cols-3 gap-3">
          {SCALE_OPTIONS.map(({ value, label, sub }) => (
            <button
              key={value}
              type="button"
              onClick={() => setForm((f) => ({ ...f, scale: value }))}
              className={`px-4 py-3 rounded-xl border transition-all duration-200 text-center ${
                form.scale === value
                  ? 'bg-brand-500/20 text-brand-400 border-brand-500/50'
                  : 'bg-surface-800 text-surface-200 border-surface-700 hover:border-surface-600 hover:text-white'
              }`}
            >
              <p className="font-semibold text-sm">{label}</p>
              <p className="text-xs opacity-70 mt-0.5">{sub}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Region */}
      <div>
        <label className="label">Preferred AWS Region</label>
        <select value={form.region} onChange={update('region')} className="input">
          {REGIONS.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div>

      {/* Budget */}
      <div>
        <label className="label">Monthly Budget (optional)</label>
        <input
          type="text"
          placeholder="e.g. $500/month or no limit"
          value={form.budget}
          onChange={update('budget')}
          className="input"
        />
      </div>

      {/* Compliance */}
      <div>
        <label className="label">Compliance Requirements (select all that apply)</label>
        <div className="flex flex-wrap gap-2">
          {['HIPAA', 'PCI-DSS', 'SOC 2', 'GDPR', 'FedRAMP', 'ISO 27001'].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => toggleCompliance(item)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                form.compliance.includes(item)
                  ? 'bg-purple-500/20 text-purple-400 border-purple-500/50'
                  : 'bg-surface-800 text-surface-200 border-surface-700 hover:border-surface-600'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Additional requirements */}
      <div>
        <label className="label">Additional Requirements (optional)</label>
        <textarea
          placeholder="Any specific services, constraints, or preferences you'd like the AI to consider…"
          value={form.requirements}
          onChange={update('requirements')}
          rows={3}
          className="input resize-none"
        />
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-4">
      <p className="text-surface-200 text-sm">
        Review your inputs before generating. The AI will produce three AWS architecture plans based on these details.
      </p>
      <div className="card bg-surface-800/50 space-y-3">
        {[
          { label: 'Project Name', value: form.name },
          { label: 'Application Type', value: form.appType },
          { label: 'Scale', value: form.scale },
          { label: 'Region', value: form.region },
          form.budget && { label: 'Budget', value: form.budget },
          form.compliance.length > 0 && { label: 'Compliance', value: form.compliance.join(', ') },
        ]
          .filter(Boolean)
          .map(({ label, value }) => (
            <div key={label} className="flex justify-between text-sm gap-4">
              <span className="text-surface-200 shrink-0">{label}</span>
              <span className="text-white text-right">{value}</span>
            </div>
          ))}
      </div>
      <div className="divider" />
      <p className="text-sm font-medium text-white">Description</p>
      <p className="text-surface-200 text-sm leading-relaxed">{form.description}</p>
      {form.requirements && (
        <>
          <p className="text-sm font-medium text-white">Additional Requirements</p>
          <p className="text-surface-200 text-sm leading-relaxed">{form.requirements}</p>
        </>
      )}
    </div>
  )

  const steps = [renderStep0, renderStep1, renderStep2]

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => (step > 0 ? setStep(step - 1) : navigate('/dashboard'))}
          className="btn-ghost mb-4 -ml-2"
        >
          <ArrowLeft size={16} /> {step > 0 ? 'Back' : 'Dashboard'}
        </button>
        <h1 className="font-display text-3xl font-bold text-white">New Architecture Project</h1>
        <p className="text-surface-200 text-sm mt-1">
          Step {step + 1} of {STEPS.length} — {STEPS[step]}
        </p>
      </div>

      {/* Step progress */}
      <div className="flex gap-2 mb-8">
        {STEPS.map((s, i) => (
          <div
            key={s}
            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
              i <= step ? 'bg-brand-500' : 'bg-surface-800'
            }`}
          />
        ))}
      </div>

      {/* Form card */}
      <motion.div
        key={step}
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.25 }}
        className="card mb-6"
      >
        <h2 className="font-display text-xl font-bold text-white mb-6">{STEPS[step]}</h2>
        {steps[step]()}
      </motion.div>

      {/* Navigation buttons */}
      <div className="flex justify-end gap-3">
        {step < STEPS.length - 1 ? (
          <button
            onClick={() => setStep(step + 1)}
            disabled={!canNext()}
            className="btn-primary"
          >
            Continue <ArrowRight size={16} />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={creating}
            className="btn-primary"
          >
            {creating ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Generating…
              </>
            ) : (
              <>
                <Sparkles size={16} /> Generate Architectures
              </>
            )}
          </button>
        )}
      </div>
    </div>
  )
}
