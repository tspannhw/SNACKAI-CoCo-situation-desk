import { describe, it, expect } from 'vitest'
import {
  FALLBACK_EARTHQUAKES,
  FALLBACK_WEATHER_STATIONS,
  FALLBACK_AIR_QUALITY,
  FALLBACK_CAMERAS,
  FALLBACK_AIRCRAFT,
} from '../data/fallbackData'

describe('fallbackData', () => {
  describe('FALLBACK_EARTHQUAKES', () => {
    it('has valid earthquake data', () => {
      expect(FALLBACK_EARTHQUAKES.length).toBeGreaterThan(0)
      FALLBACK_EARTHQUAKES.forEach((eq) => {
        expect(eq).toHaveProperty('id')
        expect(eq).toHaveProperty('magnitude')
        expect(eq).toHaveProperty('latitude')
        expect(eq).toHaveProperty('longitude')
        expect(typeof eq.magnitude).toBe('number')
      })
    })
  })

  describe('FALLBACK_WEATHER_STATIONS', () => {
    it('has valid weather station data', () => {
      expect(FALLBACK_WEATHER_STATIONS.length).toBeGreaterThan(0)
      FALLBACK_WEATHER_STATIONS.forEach((ws) => {
        expect(ws).toHaveProperty('stationId')
        expect(ws).toHaveProperty('latitude')
        expect(ws).toHaveProperty('longitude')
        expect(ws).toHaveProperty('temperature')
      })
    })
  })

  describe('FALLBACK_AIR_QUALITY', () => {
    it('has valid air quality data', () => {
      expect(FALLBACK_AIR_QUALITY.length).toBeGreaterThan(0)
      FALLBACK_AIR_QUALITY.forEach((aq) => {
        expect(aq).toHaveProperty('stationId')
        expect(aq).toHaveProperty('aqi')
        expect(typeof aq.aqi).toBe('number')
      })
    })
  })

  describe('FALLBACK_CAMERAS', () => {
    it('has valid camera data', () => {
      expect(FALLBACK_CAMERAS.length).toBeGreaterThan(0)
      FALLBACK_CAMERAS.forEach((cam) => {
        expect(cam).toHaveProperty('id')
        expect(cam).toHaveProperty('name')
        expect(cam).toHaveProperty('url')
      })
    })
  })

  describe('FALLBACK_AIRCRAFT', () => {
    it('has valid aircraft data', () => {
      expect(FALLBACK_AIRCRAFT.length).toBeGreaterThan(0)
      FALLBACK_AIRCRAFT.forEach((ac) => {
        expect(ac).toHaveProperty('icao')
        expect(ac).toHaveProperty('latitude')
        expect(ac).toHaveProperty('longitude')
      })
    })
  })
})
