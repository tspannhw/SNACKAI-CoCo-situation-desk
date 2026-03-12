import { 
  RefreshCw, 
  Database, 
  Globe2, 
  Wifi, 
  List
} from 'lucide-react'
import { useCurrentTime } from '@/hooks/useUtils'
import { useDashboardStore } from '@/store/dashboard'
import { cn } from '@/lib/utils'

export function Header() {
  const time = useCurrentTime()
  const { globalRefreshing, showDataSources, toggleDataSources } = useDashboardStore()

  const utcTime = time.toUTCString().split(' ')[4]
  const localTime = time.toLocaleTimeString()
  const dateStr = time.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  })

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur border-b border-slate-700/50">
      <div className="flex items-center justify-between px-4 py-2">
        {/* Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Globe2 className="w-6 h-6 text-blue-400" />
            <div>
              <h1 className="text-lg font-bold text-slate-100 tracking-tight">
                SITUATION DESK
              </h1>
              <div className="text-xs text-slate-500 -mt-1">
                Global Intelligence Platform
              </div>
            </div>
          </div>
        </div>

        {/* Center - Time Display */}
        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="text-2xl font-mono font-bold text-slate-100">
              {localTime}
            </div>
            <div className="text-xs text-slate-500">Local</div>
          </div>
          <div className="h-8 w-px bg-slate-700" />
          <div className="text-center">
            <div className="text-2xl font-mono font-bold text-blue-400">
              {utcTime}
            </div>
            <div className="text-xs text-slate-500">UTC</div>
          </div>
          <div className="h-8 w-px bg-slate-700" />
          <div className="text-center">
            <div className="text-sm font-medium text-slate-300">{dateStr}</div>
          </div>
        </div>

        {/* Right - Status & Controls */}
        <div className="flex items-center gap-4">
          {/* Connection Status */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 px-2 py-1 rounded bg-green-500/20 border border-green-500/30">
              <Wifi className="w-3 h-3 text-green-400" />
              <span className="text-xs text-green-400">Connected</span>
            </div>
            <div className="flex items-center gap-1 px-2 py-1 rounded bg-blue-500/20 border border-blue-500/30">
              <Database className="w-3 h-3 text-blue-400" />
              <span className="text-xs text-blue-400">Snowflake</span>
            </div>
          </div>

          {/* Data Sources Button */}
          <button
            onClick={toggleDataSources}
            className={cn(
              'flex items-center gap-1 px-3 py-1.5 rounded transition-colors',
              showDataSources
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            )}
          >
            <List className="w-4 h-4" />
            <span className="text-sm">Data Sources</span>
          </button>

          {/* Global Refresh Indicator */}
          <div className="flex items-center gap-1">
            <RefreshCw
              className={cn(
                'w-4 h-4 text-slate-400',
                globalRefreshing && 'refreshing'
              )}
            />
            <span className="text-xs text-slate-500">Auto-refresh</span>
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between px-4 py-1 bg-slate-800/50 border-t border-slate-700/30 text-xs">
        <div className="flex items-center gap-4">
          <span className="text-slate-500">
            Snowflake: <span className="text-green-400">DEMO.DEMO</span> (200+ tables)
          </span>
          <span className="text-slate-500">
            External APIs: <span className="text-blue-400">12 active</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-slate-500">
            Press <kbd className="px-1 bg-slate-700 rounded">?</kbd> for shortcuts
          </span>
        </div>
      </div>
    </header>
  )
}
