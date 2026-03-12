import { useQuery } from '@tanstack/react-query'
import { fetchEarthquakes, fetchWeatherAlerts, fetchCryptoPrices, fetchNews, fetchOpenSkyAircraft } from '@/services/osint/apis'
import {
  persistEarthquakes,
  persistWeatherAlerts,
  persistCryptoPrices,
  persistNews,
  persistAircraft,
} from '@/services/osint/persistence'
import type { Earthquake, WeatherAlert, CryptoPrice, NewsItem } from '@/types'
import { FALLBACK_EARTHQUAKES, FALLBACK_AIRCRAFT } from '@/data/fallbackData'

// Refresh intervals for live data
const REFRESH_INTERVALS = {
  REALTIME: 10000,    // 10 seconds - aircraft, critical alerts
  FAST: 30000,        // 30 seconds - earthquakes, crypto
  MODERATE: 60000,    // 1 minute - weather, news
  SLOW: 300000,       // 5 minutes - historical/stable data
}

// Wrapper to fetch and persist data, with fallback support
async function fetchAndPersist<T>(
  fetchFn: () => Promise<T[]>,
  persistFn: (data: T[]) => Promise<void>,
  fallbackData?: T[]
): Promise<T[]> {
  try {
    const data = await fetchFn()
    if (data.length > 0) {
      // Persist in background, don't block the UI
      persistFn(data).catch(err => console.warn('Persistence error:', err))
      return data
    }
  } catch (err) {
    console.warn('Fetch failed:', err)
  }
  // Return fallback data if available
  return fallbackData || []
}

export function useEarthquakes() {
  return useQuery({
    queryKey: ['earthquakes'],
    queryFn: () => fetchAndPersist<Earthquake>(fetchEarthquakes, persistEarthquakes, FALLBACK_EARTHQUAKES),
    refetchInterval: REFRESH_INTERVALS.FAST,
    staleTime: 15000,
  })
}

export function useWeatherAlerts() {
  return useQuery({
    queryKey: ['weatherAlerts'],
    queryFn: () => fetchAndPersist<WeatherAlert>(fetchWeatherAlerts, persistWeatherAlerts),
    refetchInterval: REFRESH_INTERVALS.MODERATE,
    staleTime: 30000,
  })
}

export function useCryptoPrices() {
  return useQuery({
    queryKey: ['cryptoPrices'],
    queryFn: () => fetchAndPersist<CryptoPrice>(fetchCryptoPrices, persistCryptoPrices),
    refetchInterval: REFRESH_INTERVALS.FAST,
    staleTime: 15000,
  })
}

export function useNews() {
  return useQuery({
    queryKey: ['news'],
    queryFn: () => fetchAndPersist<NewsItem>(fetchNews, persistNews),
    refetchInterval: REFRESH_INTERVALS.MODERATE,
    staleTime: 30000,
  })
}

export function useOpenSkyAircraft() {
  return useQuery({
    queryKey: ['openSkyAircraft'],
    queryFn: () => fetchAndPersist<any>(fetchOpenSkyAircraft, persistAircraft, FALLBACK_AIRCRAFT),
    refetchInterval: REFRESH_INTERVALS.REALTIME,
    staleTime: 5000,
  })
}
