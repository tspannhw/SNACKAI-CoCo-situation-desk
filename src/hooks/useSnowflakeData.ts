import { useQuery } from '@tanstack/react-query'
import { querySnowflake, snowflakeQueries } from '@/services/snowflake'
import type { WeatherStation, AirQualityReading, TransitVehicle, TrafficCamera, MeshtasticNode, TrafficSegment } from '@/types'
import {
  FALLBACK_WEATHER_STATIONS,
  FALLBACK_AIR_QUALITY,
  FALLBACK_TRANSIT_VEHICLES,
  FALLBACK_CAMERAS,
  FALLBACK_MESHTASTIC,
} from '@/data/fallbackData'

// Traffic Camera Image type
export interface TrafficCameraImage {
  fileName: string
  size: number
  lastModified: string
  imageUrl: string
}

// Refresh intervals for Snowflake data
const REFRESH_INTERVALS = {
  REALTIME: 15000,    // 15 seconds - transit vehicles
  FAST: 30000,        // 30 seconds - weather, air quality
  MODERATE: 60000,    // 1 minute - cameras, sensors
  SLOW: 300000,       // 5 minutes - traffic segments
}

// Weather stations from Snowflake
export function useWeatherStations() {
  return useQuery({
    queryKey: ['snowflake', 'weather'],
    queryFn: async (): Promise<WeatherStation[]> => {
      try {
        const result = await querySnowflake<any>(snowflakeQueries.getWeatherData())
        if (result.data && result.data.length > 0) {
          return result.data.map((row: any) => ({
            stationId: row.STATION_ID,
            location: row.LOCATION,
            latitude: row.LATITUDE,
            longitude: row.LONGITUDE,
            temperature: row.TEMP_F,
            humidity: row.RELATIVE_HUMIDITY,
            windSpeed: row.WIND_MPH,
            windDirection: row.WIND_DIR,
            conditions: row.WEATHER,
            pressure: row.PRESSURE_IN,
            observationTime: row.OBSERVATION_TIME,
          }))
        }
      } catch (err) {
        console.warn('Weather query failed, using fallback data:', err)
      }
      return FALLBACK_WEATHER_STATIONS
    },
    refetchInterval: REFRESH_INTERVALS.FAST,
    staleTime: 15000,
  })
}

// Air quality readings from Snowflake
export function useAirQuality() {
  return useQuery({
    queryKey: ['snowflake', 'airquality'],
    queryFn: async (): Promise<AirQualityReading[]> => {
      try {
        const result = await querySnowflake<any>(snowflakeQueries.getAirQuality())
        if (result.data && result.data.length > 0) {
          return result.data.map((row: any) => ({
            stationId: row.REPORTINGAREA,
            location: row.REPORTINGAREA,
            latitude: row.LATITUDE,
            longitude: row.LONGITUDE,
            aqi: row.AQI,
            category: row.CATEGORYNAME,
            parameter: row.PARAMETERNAME,
            timestamp: row.DATEOBSERVED,
          }))
        }
      } catch (err) {
        console.warn('Air quality query failed, using fallback data:', err)
      }
      return FALLBACK_AIR_QUALITY
    },
    refetchInterval: REFRESH_INTERVALS.FAST,
    staleTime: 15000,
  })
}

// Transit vehicles (MTA buses) from Snowflake
export function useTransitVehicles() {
  return useQuery({
    queryKey: ['snowflake', 'transit'],
    queryFn: async (): Promise<TransitVehicle[]> => {
      try {
        const result = await querySnowflake<any>(snowflakeQueries.getTransitVehicles())
        if (result.data && result.data.length > 0) {
          return result.data.map((row: any) => ({
            vehicleId: row.VEHICLEREF,
            routeId: row.LINEREF,
            latitude: parseFloat(row.VEHICLELOCATIONLATITUDE) || 0,
            longitude: parseFloat(row.VEHICLELOCATIONLONGITUDE) || 0,
            bearing: parseFloat(row.BEARING) || 0,
            destination: row.DESTINATIONNAME,
            timestamp: row.RECORDEDATTIME,
          }))
        }
      } catch (err) {
        console.warn('Transit query failed, using fallback data:', err)
      }
      return FALLBACK_TRANSIT_VEHICLES
    },
    refetchInterval: REFRESH_INTERVALS.REALTIME,
    staleTime: 10000,
  })
}

// Traffic cameras from Snowflake
export function useTrafficCameras() {
  return useQuery({
    queryKey: ['snowflake', 'cameras'],
    queryFn: async (): Promise<TrafficCamera[]> => {
      try {
        const result = await querySnowflake<any>(snowflakeQueries.getCameras())
        if (result.data && result.data.length > 0) {
          return result.data.map((row: any) => ({
            id: row.ID,
            name: row.NAME,
            latitude: row.LATITUDE,
            longitude: row.LONGITUDE,
            url: row.URL,
            roadway: row.ROADWAYNAME,
          }))
        }
      } catch (err) {
        console.warn('Cameras query failed, using fallback data:', err)
      }
      return FALLBACK_CAMERAS
    },
    refetchInterval: REFRESH_INTERVALS.MODERATE,
    staleTime: 30000,
  })
}

// Meshtastic nodes from Snowflake - NYC metro area, deduplicated by node
export function useMeshtasticNodes() {
  return useQuery({
    queryKey: ['snowflake', 'meshtastic'],
    queryFn: async (): Promise<MeshtasticNode[]> => {
      try {
        const result = await querySnowflake<any>(snowflakeQueries.getMeshtasticData())
        if (result.data && result.data.length > 0) {
          return result.data.map((row: any) => ({
            fromId: row.FROM_ID || `Node-${row.FROM_NUM}`,
            latitude: row.LATITUDE,
            longitude: row.LONGITUDE,
            altitude: row.ALTITUDE,
            snr: row.RX_SNR,
            rssi: row.RX_RSSI,
            timestamp: row.INGESTED_AT,
            packetType: row.PACKET_TYPE,
            battery: row.BATTERY_LEVEL,
            satsInView: row.SATS_IN_VIEW,
            groundSpeed: row.GROUND_SPEED,
            textMessage: row.TEXT_MESSAGE,
          }))
        }
      } catch (err) {
        console.warn('Meshtastic query failed, using fallback data:', err)
      }
      return FALLBACK_MESHTASTIC
    },
    refetchInterval: REFRESH_INTERVALS.REALTIME, // 15 seconds for real-time mesh updates
    staleTime: 10000,
  })
}

// Traffic segments from Snowflake
export function useTrafficSegments() {
  return useQuery({
    queryKey: ['snowflake', 'traffic'],
    queryFn: async (): Promise<TrafficSegment[]> => {
      const result = await querySnowflake<any>(snowflakeQueries.getTrafficData())
      return result.data.map((row: any) => {
        // Parse LINK_POINTS which contains coordinate pairs
        let coordinates: [number, number][] = []
        if (row.LINK_POINTS) {
          try {
            const points = row.LINK_POINTS.split(' ')
            coordinates = points.map((p: string) => {
              const [lat, lng] = p.split(',').map(Number)
              return [lat, lng] as [number, number]
            }).filter((c: [number, number]) => !isNaN(c[0]) && !isNaN(c[1]))
          } catch {
            // If parsing fails, leave empty
          }
        }
        return {
          id: row.ID,
          linkName: row.LINK_NAME,
          borough: row.BOROUGH,
          speed: row.SPEED,
          travelTime: row.TRAVEL_TIME,
          status: row.STATUS,
          coordinates,
          timestamp: row.DATA_AS_OF,
        }
      })
    },
    refetchInterval: REFRESH_INTERVALS.SLOW,
    staleTime: 60000,
  })
}

// Traffic camera images from Snowflake stage
export function useTrafficCameraImages() {
  return useQuery({
    queryKey: ['snowflake', 'trafficImages'],
    queryFn: async (): Promise<TrafficCameraImage[]> => {
      const result = await querySnowflake<any>(snowflakeQueries.getTrafficCameraImages())
      return result.data.map((row: any) => ({
        fileName: row.FILE_NAME,
        size: row.SIZE,
        lastModified: row.LAST_MODIFIED,
        imageUrl: row.IMAGE_URL,
      }))
    },
    refetchInterval: REFRESH_INTERVALS.MODERATE,
    staleTime: 30000,
  })
}
