import { cn } from '@/lib/utils'

interface StatCardProps {
  label: string
  value: string | number
  change?: number
  icon?: React.ReactNode
  status?: 'ok' | 'warning' | 'critical'
}

export function StatCard({ label, value, change, icon, status = 'ok' }: StatCardProps) {
  const statusColors = {
    ok: 'text-green-400',
    warning: 'text-yellow-400',
    critical: 'text-red-400',
  }

  return (
    <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/30">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-slate-500 uppercase tracking-wide">{label}</span>
        {icon && <span className="text-slate-500">{icon}</span>}
      </div>
      <div className="flex items-baseline gap-2">
        <span className={cn('text-xl font-semibold', statusColors[status])}>{value}</span>
        {change !== undefined && (
          <span
            className={cn(
              'text-xs',
              change >= 0 ? 'text-green-400' : 'text-red-400'
            )}
          >
            {change >= 0 ? '+' : ''}{change.toFixed(2)}%
          </span>
        )}
      </div>
    </div>
  )
}

interface StatusBadgeProps {
  status: 'ok' | 'warning' | 'critical' | 'info' | 'unknown'
  label?: string
  pulse?: boolean
}

export function StatusBadge({ status, label, pulse }: StatusBadgeProps) {
  const colors = {
    ok: 'bg-green-500 text-green-100',
    warning: 'bg-yellow-500 text-yellow-100',
    critical: 'bg-red-500 text-red-100',
    info: 'bg-blue-500 text-blue-100',
    unknown: 'bg-slate-500 text-slate-100',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium',
        colors[status],
        pulse && status === 'critical' && 'animate-pulse'
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {label || status.toUpperCase()}
    </span>
  )
}

interface ProgressBarProps {
  value: number
  max?: number
  label?: string
  showValue?: boolean
  color?: 'green' | 'yellow' | 'red' | 'blue'
}

export function ProgressBar({
  value,
  max = 100,
  label,
  showValue,
  color = 'blue',
}: ProgressBarProps) {
  const percent = Math.min((value / max) * 100, 100)
  const colors = {
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
    blue: 'bg-blue-500',
  }

  return (
    <div className="w-full">
      {(label || showValue) && (
        <div className="flex justify-between text-xs text-slate-400 mb-1">
          {label && <span>{label}</span>}
          {showValue && <span>{value.toFixed(0)}%</span>}
        </div>
      )}
      <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
        <div
          className={cn('h-full rounded-full transition-all duration-500', colors[color])}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}
