import { Thermometer, Cpu, Radio, MapPin } from 'lucide-react'
import { Panel } from '@/components/ui/Panel'
import { ProgressBar } from '@/components/ui/Stats'
import { useMeshtasticNodes } from '@/hooks/useSnowflakeData'

export function SensorsPanel() {
  // Live data from Snowflake
  const { data: meshtasticNodes = [], isLoading } = useMeshtasticNodes()
  
  // Demo thermal sensor data (could be hooked to Snowflake too)
  const thermalSensors = [
    { id: 'thermal', temp: 31.6, humidity: 21.8, co2: 987, cpu: 29.1, cputemp: 142 },
  ]

  const getSignalQuality = (snr: number | undefined) => {
    if (!snr) return { label: 'Unknown', color: 'text-slate-400' }
    if (snr > -10) return { label: 'Excellent', color: 'text-green-400' }
    if (snr > -15) return { label: 'Good', color: 'text-yellow-400' }
    return { label: 'Fair', color: 'text-orange-400' }
  }

  const nodesOnline = meshtasticNodes.filter(n => n.latitude && n.longitude).length
  const totalNodes = meshtasticNodes.length

  return (
    <Panel
      id="sensors"
      title="IoT Sensors"
      icon={<Cpu className="w-4 h-4" />}
      status={isLoading ? 'info' : 'ok'}
      count={thermalSensors.length + meshtasticNodes.length}
    >
      <div className="p-2 space-y-2">
        {/* Thermal Sensor */}
        <div>
          <div className="flex items-center gap-1 text-xs text-slate-500 mb-1">
            <Thermometer className="w-3 h-3" />
            Thermal Sensors (Snowflake)
          </div>
          {thermalSensors.map((s) => (
            <div key={s.id} className="bg-slate-800/50 rounded p-2">
              <div className="grid grid-cols-5 gap-2 text-center">
                <div>
                  <div className="text-lg font-bold text-blue-400">{s.temp.toFixed(1)}°</div>
                  <div className="text-xs text-slate-500">Temp</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-cyan-400">{s.humidity}%</div>
                  <div className="text-xs text-slate-500">Humidity</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-yellow-400">{s.co2}</div>
                  <div className="text-xs text-slate-500">CO2 ppm</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-green-400">{s.cpu}%</div>
                  <div className="text-xs text-slate-500">CPU</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-orange-400">{s.cputemp}°F</div>
                  <div className="text-xs text-slate-500">CPU Temp</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Meshtastic Nodes - Live from Snowflake */}
        <div>
          <div className="flex items-center gap-1 text-xs text-slate-500 mb-1">
            <Radio className="w-3 h-3 text-pink-400" />
            <a href="https://meshtastic.org/" target="_blank" rel="noopener noreferrer" className="hover:text-pink-400 transition-colors">
              Meshtastic Mesh Network - NYC ({nodesOnline} nodes)
            </a>
          </div>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {meshtasticNodes.slice(0, 8).map((node, idx) => {
              const signal = getSignalQuality(node.snr)
              const timeAgo = node.timestamp ? new Date(node.timestamp).toLocaleTimeString() : 'Unknown'
              return (
                <div
                  key={`${node.fromId}-${idx}`}
                  className="flex items-center justify-between px-2 py-1.5 bg-slate-800/30 hover:bg-slate-800/50 rounded text-xs transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-pink-400">📡</span>
                    <span className="font-mono text-slate-300">{node.fromId || 'Unknown'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-400">
                    {node.latitude && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {node.latitude.toFixed(3)}
                      </span>
                    )}
                    <span className={signal.color}>
                      SNR: {node.snr?.toFixed(1) || 'N/A'}
                    </span>
                    <span className="text-slate-500 text-[10px]">{timeAgo}</span>
                  </div>
                </div>
              )
            })}
            {meshtasticNodes.length === 0 && !isLoading && (
              <div className="text-xs text-slate-500 text-center py-2">No mesh nodes in NYC area</div>
            )}
          </div>
        </div>

        {/* Network Health */}
        <div className="pt-2 border-t border-slate-700/50">
          <div className="text-xs text-slate-500 mb-1">Mesh Network Health</div>
          <div className="grid grid-cols-2 gap-2">
            <ProgressBar
              label="Nodes with GPS"
              value={totalNodes > 0 ? Math.round((nodesOnline / totalNodes) * 100) : 0}
              color="green"
              showValue
            />
            <ProgressBar
              label="Strong Signal"
              value={totalNodes > 0 ? Math.round((meshtasticNodes.filter(n => n.snr && n.snr > -15).length / totalNodes) * 100) : 0}
              color="yellow"
              showValue
            />
          </div>
        </div>

        <div className="text-xs text-slate-500">
          Sources: Snowflake THERMAL_SENSOR_DATA, <a href="https://meshtastic.org/" target="_blank" rel="noopener noreferrer" className="text-pink-400 hover:underline">MESHTASTIC_DATA</a>
        </div>
      </div>
    </Panel>
  )
}
