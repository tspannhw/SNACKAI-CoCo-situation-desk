import { CloudSun, AlertTriangle, Droplets, ExternalLink } from 'lucide-react'
import { Panel } from '@/components/ui/Panel'
import { useWeatherAlerts } from '@/hooks/useOsintData'
import { cn } from '@/lib/utils'

export function WeatherPanel() {
  const { data: alerts, isLoading, refetch, dataUpdatedAt } = useWeatherAlerts()

  const severeAlerts = alerts?.filter((a) => a.severity === 'Severe' || a.severity === 'Extreme').length || 0

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Extreme': return 'text-red-400 bg-red-500/20 border-red-500/50'
      case 'Severe': return 'text-orange-400 bg-orange-500/20 border-orange-500/50'
      case 'Moderate': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/50'
      default: return 'text-green-400 bg-green-500/20 border-green-500/50'
    }
  }

  // Demo weather data (would come from Snowflake NOAAWEATHER)
  const currentConditions = [
    { city: 'New York', temp: 72, conditions: 'Partly Cloudy', humidity: 65, lat: 40.7128, lng: -74.0060 },
    { city: 'Los Angeles', temp: 78, conditions: 'Sunny', humidity: 45, lat: 34.0522, lng: -118.2437 },
    { city: 'Chicago', temp: 68, conditions: 'Overcast', humidity: 72, lat: 41.8781, lng: -87.6298 },
    { city: 'Houston', temp: 85, conditions: 'Clear', humidity: 78, lat: 29.7604, lng: -95.3698 },
  ]

  return (
    <Panel
      id="weather"
      title="Weather & Alerts"
      icon={<CloudSun className="w-4 h-4" />}
      status={severeAlerts > 0 ? 'warning' : 'ok'}
      count={alerts?.length || 0}
      refreshing={isLoading}
      lastUpdated={dataUpdatedAt ? new Date(dataUpdatedAt) : null}
      onRefresh={() => refetch()}
    >
      <div className="p-2 space-y-2">
        {/* Current Conditions Grid */}
        <div className="grid grid-cols-4 gap-1">
          {currentConditions.map((w) => (
            <a
              key={w.city}
              href={`https://forecast.weather.gov/MapClick.php?lat=${w.lat}&lon=${w.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-slate-800/50 hover:bg-slate-800/70 rounded p-1.5 text-center transition-colors cursor-pointer"
            >
              <div className="text-xs text-slate-500 truncate">{w.city}</div>
              <div className="text-lg font-bold text-slate-200">{w.temp}°</div>
              <div className="flex items-center justify-center gap-1 text-xs text-slate-400">
                <Droplets className="w-3 h-3" />
                {w.humidity}%
              </div>
            </a>
          ))}
        </div>

        {/* Alert Summary */}
        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="bg-red-500/10 border border-red-500/30 rounded p-1">
            <div className="text-lg font-bold text-red-400">
              {alerts?.filter((a) => a.severity === 'Extreme').length || 0}
            </div>
            <div className="text-xs text-slate-500">Extreme</div>
          </div>
          <div className="bg-orange-500/10 border border-orange-500/30 rounded p-1">
            <div className="text-lg font-bold text-orange-400">
              {alerts?.filter((a) => a.severity === 'Severe').length || 0}
            </div>
            <div className="text-xs text-slate-500">Severe</div>
          </div>
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded p-1">
            <div className="text-lg font-bold text-yellow-400">
              {alerts?.filter((a) => a.severity === 'Moderate').length || 0}
            </div>
            <div className="text-xs text-slate-500">Moderate</div>
          </div>
          <div className="bg-green-500/10 border border-green-500/30 rounded p-1">
            <div className="text-lg font-bold text-green-400">
              {alerts?.filter((a) => a.severity === 'Minor').length || 0}
            </div>
            <div className="text-xs text-slate-500">Minor</div>
          </div>
        </div>

        {/* Alert List */}
        <div className="space-y-1 max-h-24 overflow-auto">
          {alerts?.slice(0, 5).map((a) => (
            <a
              key={a.id}
              href={`https://api.weather.gov/alerts/${encodeURIComponent(a.id)}`}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                'block px-2 py-1.5 rounded border text-xs hover:opacity-80 transition-opacity cursor-pointer',
                getSeverityColor(a.severity)
              )}
            >
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <div className="font-medium flex items-center gap-1">
                    {a.event}
                    <ExternalLink className="w-3 h-3" />
                  </div>
                  <div className="text-slate-400 truncate">{a.areas?.slice(0, 2).join(', ')}</div>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Source */}
        <div className="text-xs text-slate-500">
          Sources: <a href="https://api.weather.gov/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">NWS Weather API</a>, Snowflake NOAAWEATHER
        </div>
      </div>
    </Panel>
  )
}
