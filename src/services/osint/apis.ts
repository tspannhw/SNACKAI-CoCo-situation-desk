import axios from 'axios'
import type { Earthquake, WeatherAlert, NewsItem, CryptoPrice, GDACSAlert, PolymarketEvent } from '@/types'

// USGS Earthquake API
export async function fetchEarthquakes(): Promise<Earthquake[]> {
  try {
    const response = await axios.get(
      'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson'
    )
    return response.data.features.map((f: any) => ({
      id: f.id,
      magnitude: f.properties.mag,
      place: f.properties.place,
      latitude: f.geometry.coordinates[1],
      longitude: f.geometry.coordinates[0],
      depth: f.geometry.coordinates[2],
      time: new Date(f.properties.time).toISOString(),
      tsunami: f.properties.tsunami > 0,
      alert: f.properties.alert,
      significance: f.properties.sig,
    }))
  } catch (error) {
    console.error('USGS API error:', error)
    return []
  }
}

// NWS Weather Alerts
export async function fetchWeatherAlerts(): Promise<WeatherAlert[]> {
  try {
    const response = await axios.get('https://api.weather.gov/alerts/active', {
      headers: { 'User-Agent': 'SituationDesk/1.0' },
    })
    return response.data.features
      .filter((f: any) => !f.properties.id?.includes('KEEPALIVE'))
      .slice(0, 50)
      .map((f: any) => ({
        id: f.properties.id,
        event: f.properties.event,
        severity: f.properties.severity,
        headline: f.properties.headline,
        description: f.properties.description?.substring(0, 500),
        areas: f.properties.areaDesc?.split('; ') || [],
        onset: f.properties.onset,
        expires: f.properties.expires,
      }))
  } catch (error) {
    console.error('NWS Alerts error:', error)
    return []
  }
}

// CoinGecko Crypto Prices
export async function fetchCryptoPrices(): Promise<CryptoPrice[]> {
  try {
    const response = await axios.get(
      'https://api.coingecko.com/api/v3/coins/markets',
      {
        params: {
          vs_currency: 'usd',
          order: 'market_cap_desc',
          per_page: 20,
          page: 1,
          sparkline: false,
        },
      }
    )
    return response.data.map((coin: any) => ({
      id: coin.id,
      symbol: coin.symbol.toUpperCase(),
      name: coin.name,
      price: coin.current_price,
      change24h: coin.price_change_percentage_24h,
      volume24h: coin.total_volume,
      marketCap: coin.market_cap,
    }))
  } catch (error) {
    console.error('CoinGecko error:', error)
    return []
  }
}

// Helper to parse RSS XML
function parseRSSItems(xml: string, sourceName: string, category: string): NewsItem[] {
  const items: NewsItem[] = []
  const itemRegex = /<item>([\s\S]*?)<\/item>/g
  let match
  let idx = 0
  while ((match = itemRegex.exec(xml)) !== null && idx < 10) {
    const item = match[1]
    const title = item.match(/<title>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/title>/)?.[1]?.trim()
    const link = item.match(/<link>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/link>/)?.[1]?.trim()
    const pubDate = item.match(/<pubDate>(.*?)<\/pubDate>/)?.[1]?.trim()
    if (title && link) {
      items.push({
        id: `${sourceName.toLowerCase()}-${idx++}`,
        title: title.replace(/<[^>]*>/g, ''),
        source: sourceName,
        url: link,
        publishedAt: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
        category,
      })
    }
  }
  return items
}

// Fetch Reuters RSS
async function fetchReutersNews(): Promise<NewsItem[]> {
  try {
    const response = await axios.get('https://www.reutersagency.com/feed/?best-topics=business-finance&post_type=best', {
      timeout: 5000,
    })
    return parseRSSItems(response.data, 'Reuters', 'business')
  } catch (error) {
    console.warn('Reuters fetch error:', error)
    return []
  }
}

// Fetch AP News RSS
async function fetchAPNews(): Promise<NewsItem[]> {
  try {
    const response = await axios.get('https://feedx.net/rss/ap.xml', {
      timeout: 5000,
    })
    return parseRSSItems(response.data, 'AP News', 'world')
  } catch (error) {
    console.warn('AP News fetch error:', error)
    return []
  }
}

// Fetch GDELT News (GKG - Global Knowledge Graph)
async function fetchGDELTNews(): Promise<NewsItem[]> {
  try {
    const response = await axios.get('https://api.gdeltproject.org/api/v2/doc/doc?query=&mode=artlist&maxrecords=20&format=json', {
      timeout: 8000,
    })
    if (response.data?.articles) {
      return response.data.articles.slice(0, 15).map((article: any, idx: number) => ({
        id: `gdelt-${idx}`,
        title: article.title,
        source: article.domain || 'GDELT',
        url: article.url,
        publishedAt: article.seendate ? new Date(article.seendate).toISOString() : new Date().toISOString(),
        category: 'world',
      }))
    }
    return []
  } catch (error) {
    console.warn('GDELT fetch error:', error)
    return []
  }
}

// Fetch CDC Health Alerts
async function fetchCDCNews(): Promise<NewsItem[]> {
  try {
    const response = await axios.get('https://tools.cdc.gov/api/v2/resources/media/rss', {
      timeout: 5000,
    })
    return parseRSSItems(response.data, 'CDC', 'health')
  } catch (error) {
    console.warn('CDC fetch error:', error)
    return []
  }
}

// Fetch DailyMed Drug Safety
async function fetchDailyMedNews(): Promise<NewsItem[]> {
  try {
    const response = await axios.get('https://dailymed.nlm.nih.gov/dailymed/rss.cfm', {
      timeout: 5000,
    })
    return parseRSSItems(response.data, 'DailyMed', 'health')
  } catch (error) {
    console.warn('DailyMed fetch error:', error)
    return []
  }
}

// Fetch Reddit worldnews
async function fetchRedditNews(): Promise<NewsItem[]> {
  try {
    const response = await axios.get('https://www.reddit.com/r/worldnews/hot.json?limit=15', {
      timeout: 5000,
    })
    return response.data.data.children.map((post: any) => ({
      id: `reddit-${post.data.id}`,
      title: post.data.title,
      source: post.data.domain,
      url: post.data.url,
      publishedAt: new Date(post.data.created_utc * 1000).toISOString(),
      category: 'world',
    }))
  } catch (error) {
    console.warn('Reddit fetch error:', error)
    return []
  }
}

// Combined news fetcher from multiple sources
export async function fetchNews(): Promise<NewsItem[]> {
  // Fetch from multiple sources in parallel
  const [reddit, gdelt, reuters, apNews, cdc, dailyMed] = await Promise.all([
    fetchRedditNews(),
    fetchGDELTNews(),
    fetchReutersNews(),
    fetchAPNews(),
    fetchCDCNews(),
    fetchDailyMedNews(),
  ])

  // Combine and sort by date
  const allNews = [...gdelt, ...reuters, ...apNews, ...reddit, ...cdc, ...dailyMed]
  allNews.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
  
  // Return top 30 unique items
  const seen = new Set<string>()
  return allNews.filter(item => {
    if (seen.has(item.title)) return false
    seen.add(item.title)
    return true
  }).slice(0, 30)
}

// OpenSky Network (free tier - limited) with fallback to ADSB.lol
export async function fetchOpenSkyAircraft() {
  // Try OpenSky first
  try {
    const response = await axios.get(
      'https://opensky-network.org/api/states/all',
      {
        params: {
          lamin: 25,
          lomin: -130,
          lamax: 50,
          lomax: -60,
        },
        timeout: 10000,
        headers: {
          'Accept': 'application/json',
        },
      }
    )
    if (response.data?.states?.length > 0) {
      return response.data.states.slice(0, 200).map((state: any) => ({
        icao: state[0],
        callsign: state[1]?.trim(),
        latitude: state[6],
        longitude: state[5],
        altitude: state[7],
        velocity: state[9],
        heading: state[10],
        verticalRate: state[11],
        onGround: state[8],
      }))
    }
  } catch (error: any) {
    console.warn('OpenSky API error, trying fallback:', error?.message || error)
  }

  // Fallback to ADSB.lol (free, unlimited)
  try {
    const response = await axios.get('https://api.adsb.lol/v2/ladd', {
      timeout: 8000,
    })
    if (response.data?.ac?.length > 0) {
      return response.data.ac.slice(0, 200).map((ac: any) => ({
        icao: ac.hex,
        callsign: ac.flight?.trim() || ac.r,
        latitude: ac.lat,
        longitude: ac.lon,
        altitude: ac.alt_baro || ac.alt_geom,
        velocity: ac.gs,
        heading: ac.track,
        verticalRate: ac.baro_rate,
        onGround: ac.alt_baro === 'ground',
      })).filter((ac: any) => ac.latitude && ac.longitude)
    }
  } catch (fallbackError: any) {
    console.warn('ADSB.lol fallback error:', fallbackError?.message || fallbackError)
  }

  return []
}

// NWS Weather Alerts for specific area (e.g., NY)
export async function fetchWeatherAlertsByArea(area: string = 'NY'): Promise<WeatherAlert[]> {
  try {
    const response = await axios.get(`https://api.weather.gov/alerts/active?area=${area}`, {
      headers: { 'User-Agent': 'SituationDesk/1.0' },
      timeout: 10000,
    })
    return response.data.features
      .filter((f: any) => !f.properties.id?.includes('KEEPALIVE'))
      .slice(0, 50)
      .map((f: any) => ({
        id: f.properties.id,
        event: f.properties.event,
        severity: f.properties.severity,
        headline: f.properties.headline,
        description: f.properties.description?.substring(0, 500),
        areas: f.properties.areaDesc?.split('; ') || [],
        onset: f.properties.onset,
        expires: f.properties.expires,
      }))
  } catch (error) {
    console.error(`NWS Alerts (${area}) error:`, error)
    return []
  }
}

// GDACS - Global Disaster Alert and Coordination System RSS
export async function fetchGDACSAlerts(): Promise<GDACSAlert[]> {
  try {
    const response = await axios.get('https://www.gdacs.org/xml/rss.xml', {
      timeout: 10000,
    })
    const items: GDACSAlert[] = []
    const itemRegex = /<item>([\s\S]*?)<\/item>/g
    let match
    let idx = 0
    
    while ((match = itemRegex.exec(response.data)) !== null && idx < 20) {
      const item = match[1]
      const title = item.match(/<title>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/title>/)?.[1]?.trim()
      const link = item.match(/<link>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/link>/)?.[1]?.trim()
      const description = item.match(/<description>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/)?.[1]?.trim()
      const pubDate = item.match(/<pubDate>(.*?)<\/pubDate>/)?.[1]?.trim()
      
      // Parse GDACS-specific fields
      const eventType = item.match(/<gdacs:eventtype>(.*?)<\/gdacs:eventtype>/)?.[1]?.trim() || 'Unknown'
      const alertLevel = item.match(/<gdacs:alertlevel>(.*?)<\/gdacs:alertlevel>/)?.[1]?.trim() || 'Green'
      const country = item.match(/<gdacs:country>(.*?)<\/gdacs:country>/)?.[1]?.trim() || 'Unknown'
      
      // Try to extract coordinates from geo namespace
      const lat = item.match(/<geo:lat>(.*?)<\/geo:lat>/)?.[1]
      const lon = item.match(/<geo:long>(.*?)<\/geo:long>/)?.[1]
      
      if (title && link) {
        items.push({
          id: `gdacs-${idx++}`,
          title: title.replace(/<[^>]*>/g, ''),
          eventType: eventType as GDACSAlert['eventType'],
          alertLevel: alertLevel as GDACSAlert['alertLevel'],
          country,
          description: description?.replace(/<[^>]*>/g, '').substring(0, 500) || '',
          link,
          pubDate: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
          latitude: lat ? parseFloat(lat) : undefined,
          longitude: lon ? parseFloat(lon) : undefined,
        })
      }
    }
    return items
  } catch (error) {
    console.error('GDACS RSS error:', error)
    return []
  }
}

// Polymarket Prediction Markets API
export async function fetchPolymarketEvents(): Promise<PolymarketEvent[]> {
  try {
    const response = await axios.get('https://gamma-api.polymarket.com/events', {
      params: {
        active: true,
        closed: false,
        limit: 20,
      },
      timeout: 10000,
    })
    
    return response.data.map((event: any) => ({
      id: event.id,
      title: event.title,
      slug: event.slug,
      description: event.description?.substring(0, 500) || '',
      startDate: event.startDate || new Date().toISOString(),
      endDate: event.endDate,
      volume: event.volume || 0,
      liquidity: event.liquidity || 0,
      markets: (event.markets || []).slice(0, 5).map((m: any) => ({
        id: m.id,
        question: m.question,
        outcomePrices: m.outcomePrices || [],
        volume: m.volume || 0,
      })),
      active: event.active ?? true,
    }))
  } catch (error) {
    console.error('Polymarket API error:', error)
    return []
  }
}

// NewsAPI - requires API key (optional integration)
export async function fetchNewsAPIArticles(apiKey?: string, query: string = 'snowflake'): Promise<NewsItem[]> {
  if (!apiKey) {
    console.warn('NewsAPI requires an API key. Set VITE_NEWSAPI_KEY environment variable.')
    return []
  }
  
  try {
    const response = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: query,
        sortBy: 'publishedAt',
        pageSize: 15,
        language: 'en',
      },
      headers: {
        'X-Api-Key': apiKey,
      },
      timeout: 10000,
    })
    
    return response.data.articles.map((article: any, idx: number) => ({
      id: `newsapi-${idx}`,
      title: article.title,
      source: article.source?.name || 'NewsAPI',
      url: article.url,
      publishedAt: article.publishedAt || new Date().toISOString(),
      category: 'tech',
    }))
  } catch (error) {
    console.error('NewsAPI error:', error)
    return []
  }
}

// OpenStreetMap Nominatim API - for geocoding/reverse geocoding
export async function searchOSMLocation(query: string): Promise<Array<{
  placeId: string
  displayName: string
  latitude: number
  longitude: number
  type: string
}>> {
  try {
    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q: query,
        format: 'json',
        limit: 10,
      },
      headers: {
        'User-Agent': 'SituationDesk/1.0',
      },
      timeout: 10000,
    })
    
    return response.data.map((place: any) => ({
      placeId: place.place_id,
      displayName: place.display_name,
      latitude: parseFloat(place.lat),
      longitude: parseFloat(place.lon),
      type: place.type,
    }))
  } catch (error) {
    console.error('OSM Nominatim error:', error)
    return []
  }
}

// Reverse geocode coordinates to address
export async function reverseGeocodeOSM(lat: number, lon: number): Promise<string | null> {
  try {
    const response = await axios.get('https://nominatim.openstreetmap.org/reverse', {
      params: {
        lat,
        lon,
        format: 'json',
      },
      headers: {
        'User-Agent': 'SituationDesk/1.0',
      },
      timeout: 10000,
    })
    
    return response.data.display_name || null
  } catch (error) {
    console.error('OSM reverse geocode error:', error)
    return null
  }
}
