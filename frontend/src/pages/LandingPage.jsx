import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Cloud, Zap, GitBranch, DollarSign, ArrowRight, CheckCircle2 } from 'lucide-react'

const features = [
  {
    icon: Zap,
    title: 'AI-Powered Generation',
    description: 'Describe your application in plain English and receive three tailored AWS architecture plans instantly.',
  },
  {
    icon: GitBranch,
    title: 'Three Architecture Tiers',
    description: 'Get Startup, Production, and Enterprise plans — each with a full diagram, service list, and deployment guide.',
  },
  {
    icon: DollarSign,
    title: 'Cost Estimates Included',
    description: 'Every plan includes a monthly cost breakdown so you can choose the tier that fits your budget.',
  },
]

const highlights = [
  'Visual architecture diagrams powered by React Flow',
  'Cognito-secured accounts — your data stays private',
  'Export-ready Terraform snippets for each plan',
  'One-click regeneration if you want alternatives',
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-surface-950 text-white overflow-x-hidden">
      {/* Navbar */}
      <header className="fixed top-0 inset-x-0 z-50 border-b border-surface-800/60 bg-surface-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center">
              <Cloud className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-lg">CloudArch AI</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/auth" className="btn-ghost">Sign In</Link>
            <Link to="/auth" className="btn-primary">Get Started Free</Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-40 pb-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="badge bg-brand-500/20 text-brand-400 border border-brand-500/30 mb-6 inline-flex">
              ✦ AI-Powered AWS Architecture
            </span>
            <h1 className="font-display text-5xl md:text-6xl font-extrabold leading-tight mb-6">
              Generate{' '}
              <span className="gradient-text">Production-Ready</span>
              <br />AWS Architectures in Seconds
            </h1>
            <p className="text-surface-200 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-10">
              Describe your application and our AI will produce three fully detailed AWS architecture
              plans — complete with diagrams, cost estimates, and Terraform snippets.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/auth" className="btn-primary text-base px-7 py-3">
                Start Building Free <ArrowRight size={18} />
              </Link>
              <a href="#features" className="btn-secondary text-base px-7 py-3">
                See How It Works
              </a>
            </div>
          </motion.div>
        </div>

        {/* Hero gradient orb */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[600px] overflow-hidden"
        >
          <div className="absolute left-1/2 top-20 -translate-x-1/2 w-[800px] h-[400px] bg-brand-600/20 blur-[120px] rounded-full" />
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6 border-t border-surface-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to Architect at Scale
            </h2>
            <p className="text-surface-200 text-lg max-w-xl mx-auto">
              From idea to deployable infrastructure in minutes — not days.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, description }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="card"
              >
                <div className="w-12 h-12 rounded-xl bg-brand-500/20 border border-brand-500/30 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-brand-400" />
                </div>
                <h3 className="font-display text-xl font-bold mb-2">{title}</h3>
                <p className="text-surface-200 text-sm leading-relaxed">{description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="py-24 px-6 bg-surface-900/50">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-display text-3xl font-bold mb-6">
              Built for Teams Who Move Fast
            </h2>
            <ul className="space-y-4">
              {highlights.map((item) => (
                <li key={item} className="flex items-start gap-3 text-surface-200 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-brand-400 mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <Link to="/auth" className="btn-primary mt-8 inline-flex">
              Get Started <ArrowRight size={16} />
            </Link>
          </div>
          <div className="glass p-6 rounded-2xl space-y-3">
            {['Startup Plan — ~$45/mo', 'Production Plan — ~$320/mo', 'Enterprise Plan — ~$1,800/mo'].map(
              (plan, i) => (
                <div key={plan} className="flex items-center gap-3 p-3 rounded-xl bg-surface-800/60">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      i === 0 ? 'bg-green-400' : i === 1 ? 'bg-blue-400' : 'bg-purple-400'
                    }`}
                  />
                  <span className="text-sm font-medium text-white">{plan}</span>
                </div>
              )
            )}
            <p className="text-xs text-surface-200 pt-2">
              * Illustrative estimates. Your actual plan costs are generated by AI based on your requirements.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Ready to Architect Smarter?
          </h2>
          <p className="text-surface-200 mb-8">
            Join engineers who are skipping the whiteboard and shipping faster with AI-generated AWS blueprints.
          </p>
          <Link to="/auth" className="btn-primary text-base px-8 py-3">
            Create Your First Architecture <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-surface-800 py-8 px-6 text-center text-surface-200 text-sm">
        <p>© {new Date().getFullYear()} CloudArch AI. Built with ❤️ and AWS.</p>
      </footer>
    </div>
  )
}
