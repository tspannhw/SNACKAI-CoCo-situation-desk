import { Plane, Radio, ExternalLink } from 'lucide-react'
import { Panel } from '@/components/ui/Panel'
import { useOpenSkyAircraft } from '@/hooks/useOsintData'

export function AviationPanel() {
  const { data: aircraft, isLoading, refetch, dataUpdatedAt } = useOpenSkyAircraft()

  const activeCount = aircraft?.filter((a) => !a.onGround).length || 0

  return (
    <Panel
      id="aviation"
      title="Aircraft Tracking"
      icon={<Plane className="w-4 h-4" />}
      status={aircraft && aircraft.length > 0 ? 'ok' : 'warning'}
      count={activeCount}
      refreshing={isLoading}
      lastUpdated={dataUpdatedAt ? new Date(dataUpdatedAt) : null}
      onRefresh={() => refetch()}
    >
      <div className="p-2 space-y-1">
        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-2 mb-2 text-center">
          <div className="bg-slate-800/50 rounded p-2">
            <div className="text-lg font-bold text-blue-400">{aircraft?.length || 0}</div>
            <div className="text-xs text-slate-500">Total</div>
          </div>
          <div className="bg-slate-800/50 rounded p-2">
            <div className="text-lg font-bold text-green-400">{activeCount}</div>
            <div className="text-xs text-slate-500">Airborne</div>
          </div>
          <div className="bg-slate-800/50 rounded p-2">
            <div className="text-lg font-bold text-yellow-400">
              {aircraft?.filter((a) => a.onGround).length || 0}
            </div>
            <div className="text-xs text-slate-500">Ground</div>
          </div>
        </div>

        {/* Aircraft List */}
        <div className="space-y-1 max-h-40 overflow-auto">
          {aircraft?.slice(0, 15).map((a) => {
            const callsign = a.callsign?.trim() || a.icao
            return (
              <a
                key={a.icao}
                href={`https://www.flightaware.com/live/flight/${callsign}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between px-2 py-1 bg-slate-800/30 hover:bg-slate-800/50 rounded text-xs transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Plane className="w-3 h-3 text-blue-400" style={{ transform: `rotate(${a.heading || 0}deg)` }} />
                  <span className="font-mono text-slate-300">{callsign}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-400">
                  <span>{Math.round(a.altitude || 0).toLocaleString()} ft</span>
                  <span>{Math.round(a.velocity || 0)} kts</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </div>
              </a>
            )
          })}
        </div>

        {/* Data Sources */}
        <div className="pt-2 border-t border-slate-700/50">
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <Radio className="w-3 h-3" />
            <span>Sources: <a href="https://opensky-network.org/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">OpenSky Network</a>, Snowflake ADSB_AIRCRAFT_DATA</span>
          </div>
        </div>
      </div>
    </Panel>
  )
}
