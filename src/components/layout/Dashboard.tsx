import { useMemo } from 'react'
import { GlobalMap, type MapMarker } from '@/components/maps/GlobalMap'
import { Header } from '@/components/layout/Header'
import { AviationPanel } from '@/components/panels/AviationPanel'
import { WeatherPanel } from '@/components/panels/WeatherPanel'
import { TrafficPanel } from '@/components/panels/TrafficPanel'
import { MarketsPanel } from '@/components/panels/MarketsPanel'
import { EarthquakesPanel } from '@/components/panels/EarthquakesPanel'
import { AlertsPanel } from '@/components/panels/AlertsPanel'
import { AirQualityPanel } from '@/components/panels/AirQualityPanel'
import { NewsPanel } from '@/components/panels/NewsPanel'
import { CyberPanel } from '@/components/panels/CyberPanel'
import { SensorsPanel } from '@/components/panels/SensorsPanel'
import { DataSourcesModal } from '@/components/layout/DataSourcesModal'
import { useEarthquakes, useOpenSkyAircraft } from '@/hooks/useOsintData'
import { useWeatherStations, useAirQuality, useTransitVehicles, useTrafficCameras, useMeshtasticNodes } from '@/hooks/useSnowflakeData'
import { useDashboardStore } from '@/store/dashboard'

export function Dashboard() {
  const { showDataSources } = useDashboardStore()
  const { data: earthquakes } = useEarthquakes()
  const { data: aircraft } = useOpenSkyAircraft()
  const { data: weatherStations } = useWeatherStations()
  const { data: airQuality } = useAirQuality()
  const { data: transitVehicles } = useTransitVehicles()
  const { data: cameras } = useTrafficCameras()
  const { data: meshtasticNodes } = useMeshtasticNodes()

  // Combine all markers for the map
  const mapMarkers = useMemo<MapMarker[]>(() => {
    const markers: MapMarker[] = []

    // Add earthquake markers
    earthquakes?.forEach((eq) => {
      markers.push({
        id: `eq-${eq.id}`,
        lat: eq.latitude,
        lng: eq.longitude,
        type: 'earthquake',
        value: eq.magnitude,
        popupContent: (
          <div className="text-sm">
            <a
              href={`https://earthquake.usgs.gov/earthquakes/eventpage/${eq.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-red-400 hover:underline"
            >
              M{eq.magnitude.toFixed(1)}
            </a>
            <div>{eq.place}</div>
            <div className="text-xs text-gray-500">{eq.depth}km depth</div>
          </div>
        ),
      })
    })

    // Add aircraft markers
    aircraft?.slice(0, 100).forEach((ac) => {
      if (ac.latitude && ac.longitude) {
        const callsign = ac.callsign?.trim() || ac.icao
        markers.push({
          id: `ac-${ac.icao}`,
          lat: ac.latitude,
          lng: ac.longitude,
          type: 'aircraft',
          heading: ac.heading,
          popupContent: (
            <div className="text-sm">
              <a
                href={`https://www.flightaware.com/live/flight/${callsign}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-blue-400 hover:underline"
              >
                {callsign}
              </a>
              <div>{Math.round(ac.altitude || 0)} ft</div>
              <div>{Math.round(ac.velocity || 0)} kts</div>
            </div>
          ),
        })
      }
    })

    // Add weather station markers from Snowflake
    weatherStations?.forEach((ws) => {
      if (ws.latitude && ws.longitude) {
        markers.push({
          id: `ws-${ws.stationId}`,
          lat: ws.latitude,
          lng: ws.longitude,
          type: 'weather',
          popupContent: (
            <div className="text-sm">
              <a
                href={`https://forecast.weather.gov/MapClick.php?lat=${ws.latitude}&lon=${ws.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-green-400 hover:underline"
              >
                {ws.location || ws.stationId}
              </a>
              <div>{ws.temperature}°F - {ws.conditions}</div>
              <div className="text-xs text-gray-500">
                Humidity: {ws.humidity}% | Wind: {ws.windSpeed} mph {ws.windDirection}
              </div>
            </div>
          ),
        })
      }
    })

    // Add air quality markers from Snowflake
    airQuality?.forEach((aq) => {
      if (aq.latitude && aq.longitude) {
        const aqiColor = aq.aqi <= 50 ? 'text-green-400' : 
                         aq.aqi <= 100 ? 'text-yellow-400' : 
                         aq.aqi <= 150 ? 'text-orange-400' : 'text-red-400'
        markers.push({
          id: `aq-${aq.stationId}-${aq.parameter}`,
          lat: aq.latitude,
          lng: aq.longitude,
          type: 'sensor',
          popupContent: (
            <div className="text-sm">
              <a
                href={`https://www.airnow.gov/?city=${encodeURIComponent(aq.location)}&country=USA`}
                target="_blank"
                rel="noopener noreferrer"
                className={`font-bold ${aqiColor} hover:underline`}
              >
                {aq.location} - AQI {aq.aqi}
              </a>
              <div>{aq.category} ({aq.parameter})</div>
              <div className="text-xs text-gray-500">{aq.timestamp}</div>
            </div>
          ),
        })
      }
    })

    // Add transit vehicle markers from Snowflake (MTA buses)
    transitVehicles?.slice(0, 200).forEach((tv) => {
      if (tv.latitude && tv.longitude) {
        markers.push({
          id: `tv-${tv.vehicleId}`,
          lat: tv.latitude,
          lng: tv.longitude,
          type: 'transit',
          heading: tv.bearing,
          popupContent: (
            <div className="text-sm">
              <a
                href={`https://bustime.mta.info/m/index?q=${tv.routeId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-green-400 hover:underline"
              >
                {tv.routeId} - {tv.vehicleId}
              </a>
              <div>To: {tv.destination}</div>
              <div className="text-xs text-gray-500">
                Updated: {new Date(tv.timestamp).toLocaleTimeString()}
              </div>
            </div>
          ),
        })
      }
    })

    // Add traffic camera markers from Snowflake
    cameras?.slice(0, 300).forEach((cam) => {
      if (cam.latitude && cam.longitude) {
        markers.push({
          id: `cam-${cam.id}`,
          lat: cam.latitude,
          lng: cam.longitude,
          type: 'camera',
          popupContent: (
            <div className="text-sm">
              <a
                href={cam.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-purple-400 hover:underline"
              >
                {cam.name}
              </a>
              <div className="text-xs text-gray-500">{cam.roadway}</div>
            </div>
          ),
        })
      }
    })

    // Add meshtastic node markers from Snowflake - distinctive mesh network markers
    meshtasticNodes?.forEach((node) => {
      if (node.latitude && node.longitude) {
        const signalQuality = node.snr && node.snr > -10 ? 'Excellent' : 
                              node.snr && node.snr > -15 ? 'Good' : 'Fair'
        const signalColor = node.snr && node.snr > -10 ? 'text-green-400' : 
                            node.snr && node.snr > -15 ? 'text-yellow-400' : 'text-orange-400'
        const timeSince = node.timestamp ? new Date(node.timestamp).toLocaleString() : 'Unknown'
        markers.push({
          id: `mesh-${node.fromId || 'unknown'}-${node.latitude}`,
          lat: node.latitude,
          lng: node.longitude,
          type: 'mesh',
          popupContent: (
            <div className="text-sm">
              <div className={`font-bold ${signalColor}`}>
                📡 Mesh: {node.fromId || 'Unknown Node'}
              </div>
              <div>Signal: {signalQuality} (SNR: {node.snr?.toFixed(1) || 'N/A'} dB)</div>
              <div>Alt: {node.altitude || 0}m | RSSI: {node.rssi || 'N/A'} dBm</div>
              {node.satsInView && <div>GPS Sats: {node.satsInView}</div>}
              {node.battery && <div>Battery: {node.battery}%</div>}
              {node.textMessage && node.textMessage !== 'None' && (
                <div className="text-cyan-300 mt-1">"{node.textMessage}"</div>
              )}
              <div className="text-xs text-gray-500 mt-1">{timeSince}</div>
            </div>
          ),
        })
      }
    })

    return markers
  }, [earthquakes, aircraft, weatherStations, airQuality, transitVehicles, cameras, meshtasticNodes])

  return (
    <div className="min-h-screen bg-slate-950">
      <Header />
      
      {/* Main Content - below header */}
      <div className="pt-24 p-4">
        <div className="grid grid-cols-12 gap-3 h-[calc(100vh-120px)]">
          {/* Left Column - Panels */}
          <div className="col-span-3 space-y-3 overflow-auto">
            <AviationPanel />
            <WeatherPanel />
            <TrafficPanel />
          </div>

          {/* Center - Map */}
          <div className="col-span-6 bg-slate-900/80 border border-slate-700/50 rounded-lg overflow-hidden">
            <GlobalMap
              markers={mapMarkers}
              center={[40.7, -74]}
              zoom={6}
              className="h-full"
            />
          </div>

          {/* Right Column - Panels */}
          <div className="col-span-3 space-y-3 overflow-auto">
            <MarketsPanel />
            <EarthquakesPanel />
            <AlertsPanel />
          </div>
        </div>

        {/* Bottom Row - Additional Panels */}
        <div className="grid grid-cols-4 gap-3 mt-3">
          <AirQualityPanel />
          <NewsPanel />
          <CyberPanel />
          <SensorsPanel />
        </div>
      </div>

      {/* Data Sources Modal */}
      {showDataSources && <DataSourcesModal />}
    </div>
  )
}
