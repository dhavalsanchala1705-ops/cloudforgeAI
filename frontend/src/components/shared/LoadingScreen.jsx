import Spinner from './Spinner'

export default function LoadingScreen({ message = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <Spinner size="lg" />
      <p className="text-surface-200 text-sm animate-pulse">{message}</p>
    </div>
  )
}
