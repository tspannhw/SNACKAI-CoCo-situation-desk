import { Car, Clock, Video, ExternalLink, MapPin, Camera } from 'lucide-react'
import { Panel } from '@/components/ui/Panel'
import { ProgressBar } from '@/components/ui/Stats'
import { useTrafficCameraImages } from '@/hooks/useSnowflakeData'
import { useState } from 'react'

export function TrafficPanel() {
  const { data: cameraImages } = useTrafficCameraImages()
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  // Demo traffic data (from Snowflake NYCTRAFFIC)
  const trafficSegments = [
    { id: 1, name: 'BQE North - Brooklyn', speed: 35, avgSpeed: 50, delay: 12, lat: 40.6892, lng: -73.9844 },
    { id: 2, name: 'FDR Drive - Midtown', speed: 42, avgSpeed: 45, delay: 5, lat: 40.7580, lng: -73.9672 },
    { id: 3, name: 'Holland Tunnel', speed: 18, avgSpeed: 35, delay: 25, lat: 40.7268, lng: -74.0090 },
    { id: 4, name: 'GW Bridge Lower', speed: 22, avgSpeed: 40, delay: 18, lat: 40.8517, lng: -73.9527 },
    { id: 5, name: 'Lincoln Tunnel', speed: 28, avgSpeed: 35, delay: 15, lat: 40.7615, lng: -74.0022 },
  ]

  // Demo camera count (from CAMERALIST)
  const cameraStats = {
    total: 2825,
    online: 2650,
    offline: 175,
  }

  const getSpeedColor = (speed: number, avg: number) => {
    const ratio = speed / avg
    if (ratio >= 0.8) return 'green'
    if (ratio >= 0.5) return 'yellow'
    return 'red'
  }

  return (
    <Panel
      id="traffic"
      title="Traffic Monitor"
      icon={<Car className="w-4 h-4" />}
      status="ok"
      count={trafficSegments.length}
    >
      <div className="p-2 space-y-2">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-slate-800/50 rounded p-2">
            <div className="text-lg font-bold text-green-400">
              {trafficSegments.filter((t) => t.speed / t.avgSpeed >= 0.8).length}
            </div>
            <div className="text-xs text-slate-500">Clear</div>
          </div>
          <div className="bg-slate-800/50 rounded p-2">
            <div className="text-lg font-bold text-yellow-400">
              {trafficSegments.filter((t) => t.speed / t.avgSpeed >= 0.5 && t.speed / t.avgSpeed < 0.8).length}
            </div>
            <div className="text-xs text-slate-500">Slow</div>
          </div>
          <div className="bg-slate-800/50 rounded p-2">
            <div className="text-lg font-bold text-red-400">
              {trafficSegments.filter((t) => t.speed / t.avgSpeed < 0.5).length}
            </div>
            <div className="text-xs text-slate-500">Congested</div>
          </div>
        </div>

        {/* Traffic Segments */}
        <div className="space-y-2">
          {trafficSegments.map((segment) => (
            <a
              key={segment.id}
              href={`https://www.google.com/maps/@${segment.lat},${segment.lng},15z/data=!5m1!1e1`}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-slate-800/30 hover:bg-slate-800/50 rounded p-2 transition-colors cursor-pointer"
            >
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-slate-300 truncate flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {segment.name}
                </span>
                <div className="flex items-center gap-2 text-xs">
                  <span className={`font-mono ${segment.speed < segment.avgSpeed * 0.5 ? 'text-red-400' : 'text-slate-400'}`}>
                    {segment.speed} mph
                  </span>
                  <span className="text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    +{segment.delay}m
                  </span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </div>
              </div>
              <ProgressBar
                value={segment.speed}
                max={segment.avgSpeed}
                color={getSpeedColor(segment.speed, segment.avgSpeed)}
              />
            </a>
          ))}
        </div>

        {/* Camera Status */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-700/50">
          <a 
            href="https://511ny.org/map"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs text-slate-400 hover:text-blue-400 transition-colors"
          >
            <Video className="w-3 h-3" />
            <span>Traffic Cameras</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-green-400">{cameraStats.online} online</span>
            <span className="text-slate-500">|</span>
            <span className="text-red-400">{cameraStats.offline} offline</span>
          </div>
        </div>

        {/* NYC Traffic Camera Images from Snowflake Stage */}
        {cameraImages && cameraImages.length > 0 && (
          <div className="pt-2 border-t border-slate-700/50">
            <div className="flex items-center gap-1 text-xs text-slate-500 mb-2">
              <Camera className="w-3 h-3" />
              <span>Live NYC Webcam Feeds ({cameraImages.length})</span>
            </div>
            <div className="grid grid-cols-4 gap-1 max-h-24 overflow-auto">
              {cameraImages.slice(0, 12).map((img, idx) => (
                <div
                  key={idx}
                  className="relative cursor-pointer group"
                  onClick={() => setSelectedImage(img.imageUrl)}
                >
                  <img
                    src={img.imageUrl}
                    alt={img.fileName}
                    className="w-full h-12 object-cover rounded border border-slate-600 group-hover:border-blue-400 transition-colors"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors rounded flex items-center justify-center">
                    <ExternalLink className="w-3 h-3 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Image Modal */}
        {selectedImage && (
          <div 
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <div className="max-w-4xl max-h-[90vh] relative">
              <img
                src={selectedImage}
                alt="Traffic Camera"
                className="max-w-full max-h-[85vh] object-contain rounded-lg"
              />
              <button 
                className="absolute top-2 right-2 text-white bg-black/50 rounded-full p-2 hover:bg-black/70"
                onClick={() => setSelectedImage(null)}
              >
                ✕
              </button>
            </div>
          </div>
        )}

        <div className="text-xs text-slate-500">
          Source: <a href="https://511ny.org/map" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Snowflake NYCTRAFFIC</a>, CAMERALIST
        </div>
      </div>
    </Panel>
  )
}
