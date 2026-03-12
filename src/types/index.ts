// Aviation Types
export interface Aircraft {
  icao: string
  flight?: string
  latitude: number
  longitude: number
  altitude: number
  speed: number
  track: number
  verticalRate?: number
  squawk?: string
  timestamp: string
}

// Weather Types
export interface WeatherStation {
  stationId: string
  location: string
  latitude: number
  longitude: number
  temperature: number
  humidity: number
  windSpeed: number
  windDirection: string
  conditions: string
  pressure: number
  observationTime: string
}

export interface WeatherAlert {
  id: string
  event: string
  severity: 'Minor' | 'Moderate' | 'Severe' | 'Extreme'
  headline: string
  description: string
  areas: string[]
  onset: string
  expires: string
}

// Traffic Types
export interface TrafficSegment {
  id: string
  linkName: string
  borough: string
  speed: number
  travelTime: number
  status: number
  coordinates: [number, number][]
  timestamp: string
}

export interface TrafficCamera {
  id: string
  name: string
  latitude: number
  longitude: number
  url: string
  roadway: string
}

// Market Types
export interface StockTrade {
  symbol: string
  price: number
  volume: number
  exchange: string
  timestamp: string
  change?: number
  changePercent?: number
}

export interface CryptoPrice {
  id: string
  symbol: string
  name: string
  price: number
  change24h: number
  volume24h: number
  marketCap: number
}

// Air Quality Types
export interface AirQualityReading {
  stationId: string
  location: string
  latitude: number
  longitude: number
  aqi: number
  category: string
  parameter: string
  timestamp: string
}

// Earthquake Types
export interface Earthquake {
  id: string
  magnitude: number
  place: string
  latitude: number
  longitude: number
  depth: number
  time: string
  tsunami: boolean
  alert?: string
  significance: number
}

// Transit Types
export interface TransitVehicle {
  vehicleId: string
  routeId: string
  latitude: number
  longitude: number
  bearing: number
  speed?: number
  destination: string
  timestamp: string
}

export interface ServiceAlert {
  id: string
  routeId?: string
  effect: string
  cause?: string
  headerText: string
  descriptionText: string
  activeStart: string
  activeEnd?: string
}

// Travel Advisory Types
export interface TravelAdvisory {
  country: string
  level: number
  title: string
  description: string
  published: string
  category: string
}

// Sensor Types
export interface SensorReading {
  id: string
  hostname: string
  temperature: number
  humidity: number
  co2?: number
  pressure?: number
  timestamp: string
}

// Meshtastic Types
export interface MeshtasticNode {
  fromId: string
  latitude?: number
  longitude?: number
  altitude?: number
  battery?: number
  snr?: number
  rssi?: number
  timestamp: string
  packetType: string
  satsInView?: number
  groundSpeed?: number
  textMessage?: string
}

// Cyber Threat Types
export interface CyberThreat {
  id: string
  type: string
  indicator: string
  confidence: number
  severity: 'low' | 'medium' | 'high' | 'critical'
  source: string
  timestamp: string
}

// News Types
export interface NewsItem {
  id: string
  title: string
  source: string
  url: string
  publishedAt: string
  category?: string
}

// Panel State
export interface PanelState {
  expanded: boolean
  refreshing: boolean
  lastUpdated: Date | null
  error: string | null
}

// OSINT Data Source
export interface DataSource {
  name: string
  url: string
  category: string
  description: string
  rateLimit?: string
  apiKey?: boolean
}

// GDACS Disaster Alert
export interface GDACSAlert {
  id: string
  title: string
  eventType: 'EQ' | 'TC' | 'FL' | 'VO' | 'DR' | 'WF' | string // Earthquake, Tropical Cyclone, Flood, Volcano, Drought, Wildfire
  alertLevel: 'Green' | 'Orange' | 'Red'
  country: string
  description: string
  link: string
  pubDate: string
  latitude?: number
  longitude?: number
}

// Polymarket Prediction Event
export interface PolymarketEvent {
  id: string
  title: string
  slug: string
  description: string
  startDate: string
  endDate?: string
  volume: number
  liquidity: number
  markets: PolymarketMarket[]
  active: boolean
}

export interface PolymarketMarket {
  id: string
  question: string
  outcomePrices: string[]
  volume: number
}
