import { Activity, ExternalLink } from 'lucide-react'
import { Panel } from '@/components/ui/Panel'
import { useEarthquakes } from '@/hooks/useOsintData'

export function EarthquakesPanel() {
  const { data: quakes, isLoading, refetch, dataUpdatedAt } = useEarthquakes()

  const significant = quakes?.filter((q) => q.magnitude >= 4.0).length || 0

  const getMagnitudeColor = (mag: number) => {
    if (mag >= 6) return 'text-red-400 bg-red-500/20'
    if (mag >= 4) return 'text-orange-400 bg-orange-500/20'
    if (mag >= 2.5) return 'text-yellow-400 bg-yellow-500/20'
    return 'text-green-400 bg-green-500/20'
  }

  return (
    <Panel
      id="earthquakes"
      title="Earthquake Monitor"
      icon={<Activity className="w-4 h-4" />}
      status={significant > 0 ? 'warning' : 'ok'}
      count={quakes?.length || 0}
      refreshing={isLoading}
      lastUpdated={dataUpdatedAt ? new Date(dataUpdatedAt) : null}
      onRefresh={() => refetch()}
    >
      <div className="p-2 space-y-1">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-2 mb-2">
          <div className="bg-slate-800/50 rounded p-2 text-center">
            <div className="text-lg font-bold text-slate-200">{quakes?.length || 0}</div>
            <div className="text-xs text-slate-500">Last Hour</div>
          </div>
          <div className="bg-slate-800/50 rounded p-2 text-center">
            <div className="text-lg font-bold text-yellow-400">{significant}</div>
            <div className="text-xs text-slate-500">M4.0+</div>
          </div>
          <div className="bg-slate-800/50 rounded p-2 text-center">
            <div className="text-lg font-bold text-orange-400">
              {quakes?.filter((q) => q.magnitude >= 5).length || 0}
            </div>
            <div className="text-xs text-slate-500">M5.0+</div>
          </div>
          <div className="bg-slate-800/50 rounded p-2 text-center">
            <div className="text-lg font-bold text-red-400">
              {quakes?.filter((q) => q.tsunami).length || 0}
            </div>
            <div className="text-xs text-slate-500">Tsunami</div>
          </div>
        </div>

        {/* Earthquake List */}
        <div className="space-y-1 max-h-36 overflow-auto">
          {quakes?.slice(0, 10).map((q) => (
            <a
              key={q.id}
              href={`https://earthquake.usgs.gov/earthquakes/eventpage/${q.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-2 py-1.5 bg-slate-800/30 hover:bg-slate-800/50 rounded text-xs transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span className={`px-1.5 py-0.5 rounded font-mono font-bold ${getMagnitudeColor(q.magnitude)}`}>
                  {q.magnitude.toFixed(1)}
                </span>
                <span className="text-slate-300 truncate max-w-[150px]">{q.place}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-500">
                  {new Date(q.time).toLocaleTimeString()}
                </span>
                <ExternalLink className="w-3 h-3 text-slate-500" />
              </div>
            </a>
          ))}
          {(!quakes || quakes.length === 0) && (
            <div className="text-center text-slate-500 py-4">No recent earthquakes</div>
          )}
        </div>

        {/* Source */}
        <div className="pt-2 border-t border-slate-700/50 text-xs text-slate-500">
          Source: <a href="https://earthquake.usgs.gov/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">USGS Earthquake Hazards Program</a>
        </div>
      </div>
    </Panel>
  )
}
