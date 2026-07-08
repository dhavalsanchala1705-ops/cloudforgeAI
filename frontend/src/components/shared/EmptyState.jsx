import { Cloud } from 'lucide-react'

export default function EmptyState({ icon: Icon = Cloud, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-2xl bg-surface-800 flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-surface-200" />
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      {description && <p className="text-surface-200 text-sm mb-6 max-w-sm">{description}</p>}
      {action}
    </div>
  )
}
