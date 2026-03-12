import type { ReactNode } from 'react'
import { RefreshCw, Maximize2, Minimize2, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PanelProps {
  id: string
  title: string
  icon: ReactNode
  children: ReactNode
  status?: 'ok' | 'warning' | 'critical' | 'info'
  count?: number
  expanded?: boolean
  refreshing?: boolean
  lastUpdated?: Date | null
  error?: string | null
  onRefresh?: () => void
  onExpand?: () => void
  className?: string
}

const statusColors = {
  ok: 'bg-green-500',
  warning: 'bg-yellow-500',
  critical: 'bg-red-500',
  info: 'bg-blue-500',
}

export function Panel({
  title,
  icon,
  children,
  status = 'ok',
  count,
  expanded,
  refreshing,
  lastUpdated,
  error,
  onRefresh,
  onExpand,
  className,
}: PanelProps) {
  return (
    <div
      className={cn(
        'bg-slate-900/80 border border-slate-700/50 rounded-lg overflow-hidden',
        'backdrop-blur-sm transition-all duration-300',
        expanded && 'fixed inset-4 z-50',
        error && 'border-red-500/50',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-800/50 border-b border-slate-700/50">
        <div className="flex items-center gap-2">
          <span className={cn('w-2 h-2 rounded-full', statusColors[status])} />
          <span className="text-slate-400">{icon}</span>
          <h3 className="text-sm font-medium text-slate-200">{title}</h3>
          {count !== undefined && (
            <span className="px-1.5 py-0.5 text-xs bg-slate-700 text-slate-300 rounded">
              {count}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {lastUpdated && (
            <span className="text-xs text-slate-500 mr-2">
              {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="p-1 hover:bg-slate-700 rounded transition-colors"
              title="Refresh"
            >
              <RefreshCw
                className={cn('w-3.5 h-3.5 text-slate-400', refreshing && 'refreshing')}
              />
            </button>
          )}
          {onExpand && (
            <button
              onClick={onExpand}
              className="p-1 hover:bg-slate-700 rounded transition-colors"
              title={expanded ? 'Minimize' : 'Maximize'}
            >
              {expanded ? (
                <Minimize2 className="w-3.5 h-3.5 text-slate-400" />
              ) : (
                <Maximize2 className="w-3.5 h-3.5 text-slate-400" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className={cn('overflow-auto', expanded ? 'h-[calc(100%-44px)]' : 'h-64')}>
        {error ? (
          <div className="flex items-center justify-center h-full text-red-400 gap-2">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">{error}</span>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  )
}
