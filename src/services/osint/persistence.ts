/**
 * OSINT Data Persistence Service
 * 
 * Handles persisting all external OSINT data sources to Snowflake tables.
 * Each data source is stored with source attribution and ingestion timestamps.
 */

import {
  executeSnowflake,
  buildEarthquakeInsert,
  buildWeatherAlertInsert,
  buildCryptoPriceInsert,
  buildNewsInsert,
  buildAircraftInsert,
} from '@/services/snowflake'
import type { Earthquake, WeatherAlert, CryptoPrice, NewsItem } from '@/types'

// Persistence configuration
const PERSISTENCE_CONFIG = {
  enabled: true,
  batchSize: 100,
  dedupeWindow: '1 HOUR', // Don't insert duplicates within this window
}

// Track last persistence time to avoid flooding
const lastPersistTime: Record<string, number> = {}
const MIN_PERSIST_INTERVAL_MS = 10000 // Minimum 10 seconds between persists

function shouldPersist(dataType: string): boolean {
  if (!PERSISTENCE_CONFIG.enabled) return false
  
  const now = Date.now()
  const lastTime = lastPersistTime[dataType] || 0
  
  if (now - lastTime < MIN_PERSIST_INTERVAL_MS) {
    return false
  }
  
  lastPersistTime[dataType] = now
  return true
}

/**
 * Persist earthquake data from USGS API
 */
export async function persistEarthquakes(earthquakes: Earthquake[]): Promise<void> {
  if (!shouldPersist('earthquakes') || !earthquakes.length) return
  
  try {
    const sql = buildEarthquakeInsert(earthquakes.slice(0, PERSISTENCE_CONFIG.batchSize))
    if (sql) {
      await executeSnowflake(sql)
      console.log(`[Persistence] Stored ${earthquakes.length} earthquakes to Snowflake`)
    }
  } catch (error) {
    console.error('[Persistence] Failed to store earthquakes:', error)
  }
}

/**
 * Persist weather alerts from NWS API
 */
export async function persistWeatherAlerts(alerts: WeatherAlert[]): Promise<void> {
  if (!shouldPersist('weatherAlerts') || !alerts.length) return
  
  try {
    const sql = buildWeatherAlertInsert(alerts.slice(0, PERSISTENCE_CONFIG.batchSize))
    if (sql) {
      await executeSnowflake(sql)
      console.log(`[Persistence] Stored ${alerts.length} weather alerts to Snowflake`)
    }
  } catch (error) {
    console.error('[Persistence] Failed to store weather alerts:', error)
  }
}

/**
 * Persist crypto prices from CoinGecko API
 */
export async function persistCryptoPrices(prices: CryptoPrice[]): Promise<void> {
  if (!shouldPersist('cryptoPrices') || !prices.length) return
  
  try {
    const sql = buildCryptoPriceInsert(prices.slice(0, PERSISTENCE_CONFIG.batchSize))
    if (sql) {
      await executeSnowflake(sql)
      console.log(`[Persistence] Stored ${prices.length} crypto prices to Snowflake`)
    }
  } catch (error) {
    console.error('[Persistence] Failed to store crypto prices:', error)
  }
}

/**
 * Persist news items from Reddit/GDELT
 */
export async function persistNews(news: NewsItem[]): Promise<void> {
  if (!shouldPersist('news') || !news.length) return
  
  try {
    const sql = buildNewsInsert(news.slice(0, PERSISTENCE_CONFIG.batchSize))
    if (sql) {
      await executeSnowflake(sql)
      console.log(`[Persistence] Stored ${news.length} news items to Snowflake`)
    }
  } catch (error) {
    console.error('[Persistence] Failed to store news:', error)
  }
}

/**
 * Persist aircraft positions from OpenSky Network
 */
export async function persistAircraft(aircraft: any[]): Promise<void> {
  if (!shouldPersist('aircraft') || !aircraft.length) return
  
  try {
    const sql = buildAircraftInsert(aircraft.slice(0, PERSISTENCE_CONFIG.batchSize))
    if (sql) {
      await executeSnowflake(sql)
      console.log(`[Persistence] Stored ${aircraft.length} aircraft positions to Snowflake`)
    }
  } catch (error) {
    console.error('[Persistence] Failed to store aircraft:', error)
  }
}

/**
 * Persist all OSINT data sources at once
 */
export async function persistAllOsintData(data: {
  earthquakes?: Earthquake[]
  weatherAlerts?: WeatherAlert[]
  cryptoPrices?: CryptoPrice[]
  news?: NewsItem[]
  aircraft?: any[]
}): Promise<void> {
  const promises: Promise<void>[] = []
  
  if (data.earthquakes?.length) {
    promises.push(persistEarthquakes(data.earthquakes))
  }
  if (data.weatherAlerts?.length) {
    promises.push(persistWeatherAlerts(data.weatherAlerts))
  }
  if (data.cryptoPrices?.length) {
    promises.push(persistCryptoPrices(data.cryptoPrices))
  }
  if (data.news?.length) {
    promises.push(persistNews(data.news))
  }
  if (data.aircraft?.length) {
    promises.push(persistAircraft(data.aircraft))
  }
  
  await Promise.allSettled(promises)
}

/**
 * Get persistence statistics
 */
export function getPersistenceStats(): Record<string, number> {
  return { ...lastPersistTime }
}
