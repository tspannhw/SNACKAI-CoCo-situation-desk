// Fallback data to ensure map always displays something
// This data is used when live queries fail or return empty results

import type { Earthquake, WeatherStation, AirQualityReading, TransitVehicle, TrafficCamera, MeshtasticNode } from '@/types'

export const FALLBACK_EARTHQUAKES: Earthquake[] = [
  {
    id: 'fallback-eq-1',
    magnitude: 4.2,
    place: '15km NW of Los Angeles, CA (Sample)',
    latitude: 34.1522,
    longitude: -118.4437,
    depth: 12.5,
    time: new Date(Date.now() - 3600000).toISOString(),
    tsunami: false,
    alert: undefined,
    significance: 250,
  },
  {
    id: 'fallback-eq-2',
    magnitude: 3.8,
    place: '25km S of San Francisco, CA (Sample)',
    latitude: 37.5585,
    longitude: -122.2711,
    depth: 8.3,
    time: new Date(Date.now() - 7200000).toISOString(),
    tsunami: false,
    alert: undefined,
    significance: 180,
  },
  {
    id: 'fallback-eq-3',
    magnitude: 5.1,
    place: '45km E of Anchorage, AK (Sample)',
    latitude: 61.2181,
    longitude: -149.0,
    depth: 35.0,
    time: new Date(Date.now() - 14400000).toISOString(),
    tsunami: false,
    alert: 'green',
    significance: 400,
  },
]

export const FALLBACK_AIRCRAFT: any[] = [
  {
    icao: 'FALLBACK1',
    callsign: 'UAL123',
    latitude: 40.6413,
    longitude: -73.7781,
    altitude: 35000,
    velocity: 450,
    heading: 270,
    verticalRate: 0,
    onGround: false,
  },
  {
    icao: 'FALLBACK2',
    callsign: 'DAL456',
    latitude: 40.7128,
    longitude: -74.006,
    altitude: 28000,
    velocity: 420,
    heading: 180,
    verticalRate: -500,
    onGround: false,
  },
  {
    icao: 'FALLBACK3',
    callsign: 'AAL789',
    latitude: 40.4774,
    longitude: -74.2591,
    altitude: 15000,
    velocity: 350,
    heading: 45,
    verticalRate: 1500,
    onGround: false,
  },
]

export const FALLBACK_WEATHER_STATIONS: WeatherStation[] = [
  {
    stationId: 'KNYC',
    location: 'New York City, NY (Sample)',
    latitude: 40.7128,
    longitude: -74.006,
    temperature: 72,
    humidity: 55,
    windSpeed: 8,
    windDirection: 'NW',
    conditions: 'Partly Cloudy',
    pressure: 30.12,
    observationTime: new Date().toISOString(),
  },
  {
    stationId: 'KEWR',
    location: 'Newark, NJ (Sample)',
    latitude: 40.6895,
    longitude: -74.1745,
    temperature: 70,
    humidity: 58,
    windSpeed: 10,
    windDirection: 'W',
    conditions: 'Clear',
    pressure: 30.15,
    observationTime: new Date().toISOString(),
  },
  {
    stationId: 'KJFK',
    location: 'JFK Airport, NY (Sample)',
    latitude: 40.6413,
    longitude: -73.7781,
    temperature: 68,
    humidity: 62,
    windSpeed: 12,
    windDirection: 'SW',
    conditions: 'Overcast',
    pressure: 30.08,
    observationTime: new Date().toISOString(),
  },
]

export const FALLBACK_AIR_QUALITY: AirQualityReading[] = [
  {
    stationId: 'NYC-AQ-1',
    location: 'Manhattan, NY (Sample)',
    latitude: 40.7831,
    longitude: -73.9712,
    aqi: 42,
    category: 'Good',
    parameter: 'PM2.5',
    timestamp: new Date().toISOString(),
  },
  {
    stationId: 'NYC-AQ-2',
    location: 'Brooklyn, NY (Sample)',
    latitude: 40.6782,
    longitude: -73.9442,
    aqi: 55,
    category: 'Moderate',
    parameter: 'Ozone',
    timestamp: new Date().toISOString(),
  },
]

export const FALLBACK_TRANSIT_VEHICLES: TransitVehicle[] = [
  {
    vehicleId: 'MTA-001',
    routeId: 'M42',
    latitude: 40.7527,
    longitude: -73.9772,
    bearing: 90,
    destination: 'Times Square',
    timestamp: new Date().toISOString(),
  },
  {
    vehicleId: 'MTA-002',
    routeId: 'B63',
    latitude: 40.6734,
    longitude: -73.9893,
    bearing: 180,
    destination: 'Bay Ridge',
    timestamp: new Date().toISOString(),
  },
  {
    vehicleId: 'MTA-003',
    routeId: 'Q44',
    latitude: 40.7614,
    longitude: -73.8304,
    bearing: 270,
    destination: 'Jamaica',
    timestamp: new Date().toISOString(),
  },
]

export const FALLBACK_CAMERAS: TrafficCamera[] = [
  {
    id: 'CAM-001',
    name: 'Times Square (Sample)',
    latitude: 40.758,
    longitude: -73.9855,
    url: 'https://webcams.nyctmc.org/google_popup.php?cid=1',
    roadway: '7th Avenue',
  },
  {
    id: 'CAM-002',
    name: 'Holland Tunnel (Sample)',
    latitude: 40.7267,
    longitude: -74.0088,
    url: 'https://webcams.nyctmc.org/google_popup.php?cid=2',
    roadway: 'I-78',
  },
  {
    id: 'CAM-003',
    name: 'Brooklyn Bridge (Sample)',
    latitude: 40.7061,
    longitude: -73.9969,
    url: 'https://webcams.nyctmc.org/google_popup.php?cid=3',
    roadway: 'Brooklyn Bridge',
  },
]

export const FALLBACK_MESHTASTIC: MeshtasticNode[] = [
  {
    fromId: 'MESH-001',
    latitude: 40.7484,
    longitude: -73.9857,
    altitude: 125,
    snr: 8.5,
    rssi: -85,
    timestamp: new Date().toISOString(),
    packetType: 'POSITION',
  },
  {
    fromId: 'MESH-002',
    latitude: 40.6892,
    longitude: -74.0445,
    altitude: 15,
    snr: 6.2,
    rssi: -92,
    timestamp: new Date().toISOString(),
    packetType: 'TELEMETRY',
  },
]
