import { useMemo } from 'react'
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix Leaflet default marker icon issue
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

// Custom icons
const createIcon = (color: string, size: number = 8) =>
  L.divIcon({
    className: 'custom-marker',
    html: `<div style="background:${color};width:${size}px;height:${size}px;border-radius:50%;border:1px solid rgba(255,255,255,0.5);box-shadow:0 0 4px ${color}"></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  })

export interface MapMarker {
  id: string
  lat: number
  lng: number
  type: 'aircraft' | 'weather' | 'traffic' | 'earthquake' | 'camera' | 'sensor' | 'alert' | 'transit' | 'mesh'
  label?: string
  value?: number
  heading?: number
  popupContent?: React.ReactNode
}

interface GlobalMapProps {
  markers?: MapMarker[]
  center?: [number, number]
  zoom?: number
  selectedLayer?: string
  className?: string
}

const markerColors: Record<MapMarker['type'], string> = {
  aircraft: '#3b82f6',
  weather: '#10b981',
  traffic: '#f59e0b',
  earthquake: '#ef4444',
  camera: '#8b5cf6',
  sensor: '#06b6d4',
  alert: '#f43f5e',
  transit: '#22c55e',
  mesh: '#f472b6',
}

export function GlobalMap({
  markers = [],
  center = [40.7, -74],
  zoom = 8,
  selectedLayer = 'all',
  className,
}: GlobalMapProps) {
  const filteredMarkers = useMemo(() => {
    if (selectedLayer === 'all') return markers
    return markers.filter((m) => m.type === selectedLayer)
  }, [markers, selectedLayer])

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      className={className}
      style={{ height: '100%', width: '100%' }}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      
      {filteredMarkers.map((marker) => {
        if (marker.type === 'earthquake' && marker.value) {
          return (
            <CircleMarker
              key={marker.id}
              center={[marker.lat, marker.lng]}
              radius={Math.max(marker.value * 3, 5)}
              pathOptions={{
                color: '#ef4444',
                fillColor: '#ef4444',
                fillOpacity: 0.4,
                weight: 1,
              }}
            >
              {marker.popupContent && <Popup>{marker.popupContent}</Popup>}
            </CircleMarker>
          )
        }

        if (marker.type === 'aircraft') {
          return (
            <Marker
              key={marker.id}
              position={[marker.lat, marker.lng]}
              icon={L.divIcon({
                className: 'aircraft-marker',
                html: `<div style="font-size:12px;transform:rotate(${marker.heading || 0}deg);color:#3b82f6;text-shadow:0 0 3px #3b82f6">✈</div>`,
                iconSize: [14, 14],
                iconAnchor: [7, 7],
              })}
            >
              {marker.popupContent && <Popup>{marker.popupContent}</Popup>}
            </Marker>
          )
        }

        if (marker.type === 'mesh') {
          return (
            <Marker
              key={marker.id}
              position={[marker.lat, marker.lng]}
              icon={L.divIcon({
                className: 'mesh-marker',
                html: `<div style="font-size:14px;color:#f472b6;text-shadow:0 0 6px #f472b6, 0 0 12px #f472b6;filter:drop-shadow(0 0 3px #f472b6)">📡</div>`,
                iconSize: [16, 16],
                iconAnchor: [8, 8],
              })}
            >
              {marker.popupContent && <Popup>{marker.popupContent}</Popup>}
            </Marker>
          )
        }

        return (
          <Marker
            key={marker.id}
            position={[marker.lat, marker.lng]}
            icon={createIcon(markerColors[marker.type])}
          >
            {marker.popupContent && <Popup>{marker.popupContent}</Popup>}
          </Marker>
        )
      })}
    </MapContainer>
  )
}

export default GlobalMap
