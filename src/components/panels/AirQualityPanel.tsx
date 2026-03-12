import { Wind, Gauge, ExternalLink } from 'lucide-react'
import { Panel } from '@/components/ui/Panel'
import { cn } from '@/lib/utils'

export function AirQualityPanel() {
  // Demo data (from Snowflake AIRQUALITY2, AQ)
  const readings = [
    { city: 'New York', aqi: 42, category: 'Good', parameter: 'PM2.5', lat: 40.7128, lng: -74.0060 },
    { city: 'Los Angeles', aqi: 87, category: 'Moderate', parameter: 'Ozone', lat: 34.0522, lng: -118.2437 },
    { city: 'Houston', aqi: 65, category: 'Moderate', parameter: 'PM2.5', lat: 29.7604, lng: -95.3698 },
    { city: 'Phoenix', aqi: 112, category: 'USG', parameter: 'Ozone', lat: 33.4484, lng: -112.0740 },
    { city: 'Seattle', aqi: 35, category: 'Good', parameter: 'PM2.5', lat: 47.6062, lng: -122.3321 },
    { city: 'Denver', aqi: 55, category: 'Moderate', parameter: 'Ozone', lat: 39.7392, lng: -104.9903 },
  ]

  const getAQIColor = (aqi: number) => {
    if (aqi <= 50) return 'text-green-400 bg-green-500/20'
    if (aqi <= 100) return 'text-yellow-400 bg-yellow-500/20'
    if (aqi <= 150) return 'text-orange-400 bg-orange-500/20'
    if (aqi <= 200) return 'text-red-400 bg-red-500/20'
    return 'text-purple-400 bg-purple-500/20'
  }

  const getAQILabel = (aqi: number) => {
    if (aqi <= 50) return 'Good'
    if (aqi <= 100) return 'Moderate'
    if (aqi <= 150) return 'USG'
    if (aqi <= 200) return 'Unhealthy'
    return 'Very Unhealthy'
  }

  const goodCount = readings.filter((r) => r.aqi <= 50).length
  const moderateCount = readings.filter((r) => r.aqi > 50 && r.aqi <= 100).length
  const unhealthyCount = readings.filter((r) => r.aqi > 100).length

  return (
    <Panel
      id="airquality"
      title="Air Quality Index"
      icon={<Wind className="w-4 h-4" />}
      status={unhealthyCount > 0 ? 'warning' : 'ok'}
      count={readings.length}
    >
      <div className="p-2 space-y-2">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-green-500/10 border border-green-500/30 rounded p-2">
            <div className="text-xl font-bold text-green-400">{goodCount}</div>
            <div className="text-xs text-slate-500">Good</div>
          </div>
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded p-2">
            <div className="text-xl font-bold text-yellow-400">{moderateCount}</div>
            <div className="text-xs text-slate-500">Moderate</div>
          </div>
          <div className="bg-orange-500/10 border border-orange-500/30 rounded p-2">
            <div className="text-xl font-bold text-orange-400">{unhealthyCount}</div>
            <div className="text-xs text-slate-500">Unhealthy</div>
          </div>
        </div>

        {/* AQI Grid */}
        <div className="grid grid-cols-3 gap-1">
          {readings.map((r) => (
            <a
              key={r.city}
              href={`https://www.airnow.gov/?city=${encodeURIComponent(r.city)}&country=USA`}
              target="_blank"
              rel="noopener noreferrer"
              className={cn('rounded p-2 text-center border border-transparent hover:border-slate-500 transition-colors cursor-pointer', getAQIColor(r.aqi))}
            >
              <div className="text-xs text-slate-300 truncate mb-1 flex items-center justify-center gap-1">
                {r.city}
                <ExternalLink className="w-2 h-2" />
              </div>
              <div className="flex items-center justify-center gap-1">
                <Gauge className="w-3 h-3" />
                <span className="text-lg font-bold">{r.aqi}</span>
              </div>
              <div className="text-xs opacity-80">{getAQILabel(r.aqi)}</div>
            </a>
          ))}
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-2 pt-2 border-t border-slate-700/50">
          <div className="flex items-center gap-1 text-xs">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-slate-400">0-50</span>
          </div>
          <div className="flex items-center gap-1 text-xs">
            <span className="w-2 h-2 rounded-full bg-yellow-500" />
            <span className="text-slate-400">51-100</span>
          </div>
          <div className="flex items-center gap-1 text-xs">
            <span className="w-2 h-2 rounded-full bg-orange-500" />
            <span className="text-slate-400">101-150</span>
          </div>
          <div className="flex items-center gap-1 text-xs">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <span className="text-slate-400">151+</span>
          </div>
        </div>

        <div className="text-xs text-slate-500">
          Sources: <a href="https://www.airnow.gov/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">AirNow EPA</a>, Snowflake AIRQUALITY2
        </div>
      </div>
    </Panel>
  )
}
