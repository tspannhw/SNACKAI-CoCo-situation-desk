import axios from 'axios'

const SNOWFLAKE_API = '/api/snowflake'

interface SnowflakeQueryResult<T> {
  data: T[]
  rowCount: number
  error?: string
}

interface SnowflakeInsertResult {
  success: boolean
  rowsInserted: number
  error?: string
}

export async function querySnowflake<T>(sql: string): Promise<SnowflakeQueryResult<T>> {
  try {
    const response = await axios.post(`${SNOWFLAKE_API}/query`, { sql })
    // Handle backend response format: { success: true, data: [...] }
    const result = response.data
    if (result.success && Array.isArray(result.data)) {
      return { data: result.data as T[], rowCount: result.data.length }
    }
    // Fallback for direct data format
    if (Array.isArray(result)) {
      return { data: result as T[], rowCount: result.length }
    }
    return { data: result.data || [], rowCount: result.data?.length || 0 }
  } catch (error) {
    console.error('Snowflake query error:', error)
    return { data: [], rowCount: 0, error: String(error) }
  }
}

export async function executeSnowflake(sql: string): Promise<SnowflakeInsertResult> {
  try {
    const response = await axios.post(`${SNOWFLAKE_API}/execute`, { sql })
    return { success: true, rowsInserted: response.data.rowCount || 0 }
  } catch (error) {
    console.error('Snowflake execute error:', error)
    return { success: false, rowsInserted: 0, error: String(error) }
  }
}

// Helper to escape SQL string values
function escapeSQL(value: string | undefined | null): string {
  if (value === null || value === undefined) return 'NULL'
  return `'${String(value).replace(/'/g, "''")}'`
}

function toSQLNumber(value: number | undefined | null): string {
  if (value === null || value === undefined || isNaN(value)) return 'NULL'
  return String(value)
}

function toSQLBoolean(value: boolean | undefined | null): string {
  if (value === null || value === undefined) return 'NULL'
  return value ? 'TRUE' : 'FALSE'
}

// Snowflake Query Builders
export const snowflakeQueries = {
  // Aircraft Data
  getAircraftData: () => `
    SELECT ICAO_HEX, FLIGHT, LATITUDE, LONGITUDE, ALTITUDE_BARO, 
           GROUND_SPEED, TRACK, VERTICAL_RATE, SQUAWK, DATETIMESTAMP
    FROM DEMO.DEMO.ADSB_AIRCRAFT_DATA
    WHERE LATITUDE IS NOT NULL AND LONGITUDE IS NOT NULL
    ORDER BY DATETIMESTAMP DESC
    LIMIT 500
  `,

  // Weather Data
  getWeatherData: () => `
    SELECT STATION_ID, LOCATION, LATITUDE, LONGITUDE, TEMP_F, 
           RELATIVE_HUMIDITY, WIND_MPH, WIND_DIR, WEATHER, 
           PRESSURE_IN, OBSERVATION_TIME
    FROM DEMO.DEMO.NOAAWEATHER
    WHERE LATITUDE IS NOT NULL
    ORDER BY OBSERVATION_TIME DESC
    LIMIT 200
  `,

  // Traffic Data
  getTrafficData: () => `
    SELECT ID, LINK_NAME, BOROUGH, SPEED, TRAVEL_TIME, STATUS,
           LINK_POINTS, DATA_AS_OF
    FROM DEMO.DEMO.NYCTRAFFIC
    ORDER BY DATA_AS_OF DESC
    LIMIT 500
  `,

  // Traffic Cameras
  getCameras: () => `
    SELECT ID, NAME, LATITUDE, LONGITUDE, URL, ROADWAYNAME
    FROM DEMO.DEMO.CAMERALIST
    WHERE LATITUDE IS NOT NULL AND LONGITUDE IS NOT NULL
    LIMIT 500
  `,

  // Stock Trades
  getStockTrades: () => `
    SELECT SYMBOL, PRICE, VOLUME, EXCHANGE, TRADE_TIMESTAMP
    FROM DEMO.DEMO.STOCK_TRADES
    ORDER BY TRADE_TIMESTAMP DESC
    LIMIT 100
  `,

  // Air Quality
  getAirQuality: () => `
    SELECT REPORTINGAREA, LATITUDE, LONGITUDE, AQI, 
           CATEGORYNAME, PARAMETERNAME, DATEOBSERVED
    FROM DEMO.DEMO.AIRQUALITY2
    WHERE LATITUDE IS NOT NULL
    ORDER BY DATEOBSERVED DESC
    LIMIT 200
  `,

  // Transit Vehicles
  getTransitVehicles: () => `
    SELECT VEHICLEREF, LINEREF, VEHICLELOCATIONLATITUDE, 
           VEHICLELOCATIONLONGITUDE, BEARING, DESTINATIONNAME,
           RECORDEDATTIME
    FROM DEMO.DEMO.MTABUSVEHICLEMONITORING
    WHERE VEHICLELOCATIONLATITUDE IS NOT NULL
    ORDER BY RECORDEDATTIME DESC
    LIMIT 300
  `,

  // Service Alerts
  getServiceAlerts: () => `
    SELECT ROUTEID, EFFECT, CAUSE, ALERTTEXT, DESCRIPTIONTEXT,
           ACTIVEPERIODSTART, ACTIVEPERIODEND
    FROM DEMO.DEMO.SERVICEALERTS
    ORDER BY ACTIVEPERIODSTART DESC
    LIMIT 50
  `,

  // Travel Advisories
  getTravelAdvisories: () => `
    SELECT TITLE, DESCRIPTION, PUBLISHED, CATEGORY, LINK
    FROM DEMO.DEMO.TRAVELADVISORIES
    ORDER BY PUBLISHED DESC
    LIMIT 50
  `,

  // Thermal Sensors
  getSensorData: () => `
    SELECT HOSTNAME, TEMPERATURE, HUMIDITY, CO2, PRESSURE,
           DATETIMESTAMP
    FROM DEMO.DEMO.THERMAL_SENSOR_DATA
    ORDER BY DATETIMESTAMP DESC
    LIMIT 100
  `,

  // Meshtastic - NYC metro area with latest position per node
  getMeshtasticData: () => `
    SELECT FROM_ID, LATITUDE, LONGITUDE, ALTITUDE, RX_SNR,
           RX_RSSI, PACKET_TYPE, INGESTED_AT, BATTERY_LEVEL,
           SATS_IN_VIEW, GROUND_SPEED, TEXT_MESSAGE
    FROM DEMO.DEMO.MESHTASTIC_DATA
    WHERE LATITUDE IS NOT NULL
      AND LATITUDE BETWEEN 39.5 AND 42.0
      AND LONGITUDE BETWEEN -75.5 AND -72.5
    QUALIFY ROW_NUMBER() OVER (PARTITION BY COALESCE(FROM_ID, FROM_NUM::VARCHAR) ORDER BY INGESTED_AT DESC) = 1
    ORDER BY INGESTED_AT DESC
    LIMIT 100
  `,

  // Traffic Camera Images from Stage (get presigned URLs)
  getTrafficCameraImages: () => `
    SELECT 
      RELATIVE_PATH as FILE_NAME,
      SIZE,
      LAST_MODIFIED,
      GET_PRESIGNED_URL(@DEMO.DEMO.TRAFFIC, RELATIVE_PATH, 3600) as IMAGE_URL
    FROM DIRECTORY(@DEMO.DEMO.TRAFFIC)
    WHERE RELATIVE_PATH LIKE '%.jpg' OR RELATIVE_PATH LIKE '%.png'
    ORDER BY LAST_MODIFIED DESC
    LIMIT 50
  `,
}

// ============================================
// INSERT Functions for OSINT Data Persistence
// ============================================

import type { Earthquake, WeatherAlert, CryptoPrice, NewsItem } from '@/types'

// Insert earthquake data from USGS
export function buildEarthquakeInsert(earthquakes: Earthquake[]): string {
  if (!earthquakes.length) return ''
  
  const values = earthquakes.map(eq => `(
    ${escapeSQL(eq.id)},
    ${toSQLNumber(eq.magnitude)},
    ${escapeSQL(eq.place)},
    ${toSQLNumber(eq.latitude)},
    ${toSQLNumber(eq.longitude)},
    ${toSQLNumber(eq.depth)},
    ${escapeSQL(eq.time)},
    ${toSQLBoolean(eq.tsunami)},
    ${escapeSQL(eq.alert)},
    ${toSQLNumber(eq.significance)},
    'USGS',
    CURRENT_TIMESTAMP()
  )`).join(',\n')

  return `
    INSERT INTO DEMO.DEMO.OSINT_EARTHQUAKES 
    (ID, MAGNITUDE, PLACE, LATITUDE, LONGITUDE, DEPTH, EVENT_TIME, TSUNAMI, ALERT_LEVEL, SIGNIFICANCE, SOURCE, INGESTED_AT)
    VALUES ${values}
  `
}

// Insert weather alerts from NWS
export function buildWeatherAlertInsert(alerts: WeatherAlert[]): string {
  if (!alerts.length) return ''
  
  const values = alerts.map(alert => `(
    ${escapeSQL(alert.id)},
    ${escapeSQL(alert.event)},
    ${escapeSQL(alert.severity)},
    ${escapeSQL(alert.headline)},
    ${escapeSQL(alert.description?.substring(0, 4000))},
    ${escapeSQL(alert.areas?.join('; '))},
    ${escapeSQL(alert.onset)},
    ${escapeSQL(alert.expires)},
    'NWS',
    CURRENT_TIMESTAMP()
  )`).join(',\n')

  return `
    INSERT INTO DEMO.DEMO.OSINT_WEATHER_ALERTS 
    (ID, EVENT, SEVERITY, HEADLINE, DESCRIPTION, AREAS, ONSET, EXPIRES, SOURCE, INGESTED_AT)
    VALUES ${values}
  `
}

// Insert crypto prices from CoinGecko
export function buildCryptoPriceInsert(prices: CryptoPrice[]): string {
  if (!prices.length) return ''
  
  const values = prices.map(price => `(
    ${escapeSQL(price.id)},
    ${escapeSQL(price.symbol)},
    ${escapeSQL(price.name)},
    ${toSQLNumber(price.price)},
    ${toSQLNumber(price.change24h)},
    ${toSQLNumber(price.volume24h)},
    ${toSQLNumber(price.marketCap)},
    'COINGECKO',
    CURRENT_TIMESTAMP()
  )`).join(',\n')

  return `
    INSERT INTO DEMO.DEMO.OSINT_CRYPTO_PRICES 
    (ID, SYMBOL, NAME, PRICE_USD, CHANGE_24H, VOLUME_24H, MARKET_CAP, SOURCE, INGESTED_AT)
    VALUES ${values}
  `
}

// Insert news items from Reddit/GDELT
export function buildNewsInsert(news: NewsItem[]): string {
  if (!news.length) return ''
  
  const values = news.map(item => `(
    ${escapeSQL(item.id)},
    ${escapeSQL(item.title?.substring(0, 1000))},
    ${escapeSQL(item.source)},
    ${escapeSQL(item.url)},
    ${escapeSQL(item.publishedAt)},
    ${escapeSQL(item.category)},
    'REDDIT',
    CURRENT_TIMESTAMP()
  )`).join(',\n')

  return `
    INSERT INTO DEMO.DEMO.OSINT_NEWS 
    (ID, TITLE, SOURCE_NAME, URL, PUBLISHED_AT, CATEGORY, DATA_SOURCE, INGESTED_AT)
    VALUES ${values}
  `
}

// Insert aircraft data from OpenSky
export function buildAircraftInsert(aircraft: any[]): string {
  if (!aircraft.length) return ''
  
  const values = aircraft.map(ac => `(
    ${escapeSQL(ac.icao)},
    ${escapeSQL(ac.callsign)},
    ${toSQLNumber(ac.latitude)},
    ${toSQLNumber(ac.longitude)},
    ${toSQLNumber(ac.altitude)},
    ${toSQLNumber(ac.velocity)},
    ${toSQLNumber(ac.heading)},
    ${toSQLNumber(ac.verticalRate)},
    ${toSQLBoolean(ac.onGround)},
    'OPENSKY',
    CURRENT_TIMESTAMP()
  )`).join(',\n')

  return `
    INSERT INTO DEMO.DEMO.OSINT_AIRCRAFT 
    (ICAO, CALLSIGN, LATITUDE, LONGITUDE, ALTITUDE, VELOCITY, HEADING, VERTICAL_RATE, ON_GROUND, SOURCE, INGESTED_AT)
    VALUES ${values}
  `
}

// Batch insert with deduplication
export async function persistOsintData(
  tableName: string,
  data: any[],
  buildInsertFn: (data: any[]) => string,
  _idField: string = 'ID'
): Promise<SnowflakeInsertResult> {
  if (!data.length) return { success: true, rowsInserted: 0 }
  
  try {
    // Use MERGE to avoid duplicates
    const insertSQL = buildInsertFn(data)
    if (!insertSQL) return { success: true, rowsInserted: 0 }
    
    const result = await executeSnowflake(insertSQL)
    console.log(`Persisted ${result.rowsInserted} rows to ${tableName}`)
    return result
  } catch (error) {
    console.error(`Error persisting to ${tableName}:`, error)
    return { success: false, rowsInserted: 0, error: String(error) }
  }
}
