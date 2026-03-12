import { X, ExternalLink, Database, Plane, Cloud, Activity, DollarSign, Shield, Newspaper, Thermometer, Ship, Satellite, AlertTriangle, Heart, Zap, Video, MapPin } from 'lucide-react'
import { useDashboardStore } from '@/store/dashboard'

interface DataSource {
  name: string
  url: string
  description: string
  free: boolean
  apiKey?: boolean
}

interface DataCategory {
  name: string
  icon: React.ReactNode
  color: string
  snowflakeTables?: string[]
  sources: DataSource[]
}

const dataCategories: DataCategory[] = [
  {
    name: 'Aviation & Military',
    icon: <Plane className="w-4 h-4" />,
    color: 'text-blue-400',
    snowflakeTables: ['ADSB_AIRCRAFT_DATA', 'PLANES', 'FLIGHT_DATA_ICEBERG'],
    sources: [
      { name: 'OpenSky Network', url: 'https://opensky-network.org/api', description: 'Global ADS-B tracking', free: true },
      { name: 'ADSB.lol', url: 'https://api.adsb.lol/v2', description: 'Unlimited free ADS-B data', free: true },
      { name: 'ADS-B Exchange', url: 'https://globe.adsbexchange.com/', description: 'Worldwide flight tracking', free: true },
      { name: 'FlightRadar24', url: 'https://data-cloud.flightradar24.com/', description: 'Flight tracking (limited free)', free: true, apiKey: true },
      { name: 'ADS-B.fi', url: 'https://adsb.fi/', description: 'European ADS-B coverage', free: true },
      { name: 'Plane.watch', url: 'https://plane.watch/', description: 'Global plane tracking', free: true },
      { name: 'tar1090', url: 'https://github.com/wiedehopf/tar1090', description: 'Self-hosted ADS-B viewer', free: true },
    ],
  },
  {
    name: 'Weather & Climate',
    icon: <Cloud className="w-4 h-4" />,
    color: 'text-green-400',
    snowflakeTables: ['NOAAWEATHER', 'WEATHER_DATA', 'WEATHER_OBSERVATIONS', 'WEATHER_ALERTS'],
    sources: [
      { name: 'NWS Weather API', url: 'https://api.weather.gov/', description: 'Official US weather data & alerts', free: true },
      { name: 'Open-Meteo', url: 'https://open-meteo.com/', description: 'Free global weather API', free: true },
      { name: 'OpenWeatherMap', url: 'https://openweathermap.org/api', description: 'Global weather data', free: true, apiKey: true },
      { name: 'NOAA SPC', url: 'https://www.spc.noaa.gov/', description: 'Storm prediction center', free: true },
      { name: 'Windy API', url: 'https://api.windy.com/', description: 'Wind & weather visualization', free: true, apiKey: true },
      { name: 'Tropical Tidbits', url: 'https://www.tropicaltidbits.com/', description: 'Hurricane tracking', free: true },
      { name: 'Ventusky', url: 'https://www.ventusky.com/', description: 'Weather visualization maps', free: true },
      { name: 'NOAA Climate', url: 'https://www.ncei.noaa.gov/', description: 'Historical climate data', free: true },
    ],
  },
  {
    name: 'Earthquakes & Disasters',
    icon: <Activity className="w-4 h-4" />,
    color: 'text-red-400',
    sources: [
      { name: 'USGS Earthquake', url: 'https://earthquake.usgs.gov/fdsnws/event/1/', description: 'Real-time earthquake data', free: true },
      { name: 'EMSC', url: 'https://www.emsc-csem.org/', description: 'European seismic data', free: true },
      { name: 'GDACS', url: 'https://www.gdacs.org/gdacsapi/', description: 'Global disaster alerts', free: true },
      { name: 'ReliefWeb', url: 'https://api.reliefweb.int/v1/', description: 'Humanitarian crisis data', free: true },
      { name: 'Volcano Discovery', url: 'https://www.volcanodiscovery.com/', description: 'Volcanic activity monitoring', free: true },
      { name: 'NOAA Tsunami', url: 'https://www.tsunami.gov/', description: 'Tsunami warnings', free: true },
      { name: 'EONET (NASA)', url: 'https://eonet.gsfc.nasa.gov/api/v3', description: 'Natural events tracker', free: true },
    ],
  },
  {
    name: 'Markets & Finance',
    icon: <DollarSign className="w-4 h-4" />,
    color: 'text-yellow-400',
    snowflakeTables: ['STOCK_TRADES', 'STOCKVALUES', 'CRYPTO', 'COINTRADES'],
    sources: [
      { name: 'CoinGecko', url: 'https://api.coingecko.com/api/v3/', description: 'Cryptocurrency prices', free: true },
      { name: 'Polymarket', url: 'https://gamma-api.polymarket.com/events', description: 'Prediction markets & event contracts', free: true },
      { name: 'Alpha Vantage', url: 'https://www.alphavantage.co/', description: 'Stock market data', free: true, apiKey: true },
      { name: 'Finnhub', url: 'https://finnhub.io/api/v1/', description: 'Financial data', free: true, apiKey: true },
      { name: 'Yahoo Finance', url: 'https://query1.finance.yahoo.com/', description: 'Stock quotes', free: true },
      { name: 'FRED', url: 'https://api.stlouisfed.org/fred/', description: 'Economic data', free: true, apiKey: true },
      { name: 'ECB Data', url: 'https://sdw-wsrest.ecb.europa.eu/', description: 'European Central Bank stats', free: true },
      { name: 'World Bank', url: 'https://api.worldbank.org/v2/', description: 'Development indicators', free: true },
      { name: 'IMF Data', url: 'https://www.imf.org/external/datamapper/', description: 'Global economics', free: true },
    ],
  },
  {
    name: 'Cyber Threats',
    icon: <Shield className="w-4 h-4" />,
    color: 'text-purple-400',
    sources: [
      { name: 'CISA Alerts', url: 'https://www.cisa.gov/uscert/ncas/alerts.xml', description: 'US cyber security alerts', free: true },
      { name: 'AbuseIPDB', url: 'https://api.abuseipdb.com/', description: 'Malicious IP database', free: true, apiKey: true },
      { name: 'ThreatFox', url: 'https://threatfox.abuse.ch/api/', description: 'IOC database', free: true },
      { name: 'URLhaus', url: 'https://urlhaus.abuse.ch/api/', description: 'Malicious URL database', free: true },
      { name: 'Malware Bazaar', url: 'https://bazaar.abuse.ch/api/', description: 'Malware samples', free: true },
      { name: 'Shodan', url: 'https://api.shodan.io/', description: 'Internet scanning', free: true, apiKey: true },
      { name: 'GreyNoise', url: 'https://api.greynoise.io/', description: 'Internet noise analysis', free: true, apiKey: true },
      { name: 'AlienVault OTX', url: 'https://otx.alienvault.com/api/', description: 'Threat intelligence', free: true, apiKey: true },
    ],
  },
  {
    name: 'News & Events',
    icon: <Newspaper className="w-4 h-4" />,
    color: 'text-cyan-400',
    sources: [
      { name: 'GDELT', url: 'https://api.gdeltproject.org/', description: 'Global news events database', free: true },
      { name: 'NewsAPI', url: 'https://newsapi.org/v2/', description: 'News aggregation', free: true, apiKey: true },
      { name: 'Reddit API', url: 'https://www.reddit.com/dev/api/', description: 'Social news', free: true },
      { name: 'AP News RSS', url: 'https://apnews.com/', description: 'Associated Press feeds', free: true },
      { name: 'Reuters RSS', url: 'https://www.reuters.com/', description: 'International news', free: true },
      { name: 'Al Jazeera RSS', url: 'https://www.aljazeera.com/', description: 'Global perspective', free: true },
      { name: 'Event Registry', url: 'https://eventregistry.org/api/', description: 'News event tracking', free: true, apiKey: true },
    ],
  },
  {
    name: 'Conflicts & Geopolitical',
    icon: <AlertTriangle className="w-4 h-4" />,
    color: 'text-orange-400',
    snowflakeTables: ['TRAVELADVISORIES'],
    sources: [
      { name: 'ACLED', url: 'https://acleddata.com/data-export-tool/', description: 'Armed conflict events', free: true },
      { name: 'LiveUA Map', url: 'https://liveuamap.com/', description: 'Conflict mapping', free: true },
      { name: 'SIPRI', url: 'https://www.sipri.org/databases', description: 'Arms transfers data', free: true },
      { name: 'Crisis24', url: 'https://crisis24.garda.com/', description: 'Global security incidents', free: true },
      { name: 'Uppsala Conflict', url: 'https://ucdp.uu.se/', description: 'Conflict data program', free: true },
      { name: 'US State Dept', url: 'https://travel.state.gov/content/travel.html', description: 'Travel advisories', free: true },
    ],
  },
  {
    name: 'Disease & Health',
    icon: <Heart className="w-4 h-4" />,
    color: 'text-pink-400',
    sources: [
      { name: 'WHO Outbreaks', url: 'https://www.who.int/emergencies/disease-outbreak-news/', description: 'Disease outbreak news', free: true },
      { name: 'CDC Data', url: 'https://data.cdc.gov/', description: 'US health statistics', free: true },
      { name: 'CDC RSS', url: 'https://tools.cdc.gov/api/v2/resources/media/rss', description: 'CDC media feeds', free: true },
      { name: 'DailyMed', url: 'https://dailymed.nlm.nih.gov/dailymed/rss.cfm', description: 'Drug safety updates', free: true },
      { name: 'ProMED', url: 'https://promedmail.org/', description: 'Infectious disease alerts', free: true },
      { name: 'HealthMap', url: 'https://healthmap.org/', description: 'Disease surveillance', free: true },
      { name: 'Our World in Data', url: 'https://ourworldindata.org/', description: 'Health statistics', free: true },
      { name: 'GISAID', url: 'https://gisaid.org/', description: 'Pathogen sequences', free: true },
    ],
  },
  {
    name: 'Energy & Infrastructure',
    icon: <Zap className="w-4 h-4" />,
    color: 'text-amber-400',
    sources: [
      { name: 'EIA', url: 'https://api.eia.gov/', description: 'US energy information', free: true, apiKey: true },
      { name: 'ENTSO-E', url: 'https://transparency.entsoe.eu/', description: 'European power grid', free: true },
      { name: 'IAEA PRIS', url: 'https://pris.iaea.org/', description: 'Nuclear reactor status', free: true },
      { name: 'ERCOT', url: 'https://www.ercot.com/', description: 'Texas grid operations', free: true },
      { name: 'PHMSA', url: 'https://www.phmsa.dot.gov/', description: 'Pipeline safety data', free: true },
    ],
  },
  {
    name: 'Traffic & Transit',
    icon: <MapPin className="w-4 h-4" />,
    color: 'text-lime-400',
    snowflakeTables: ['NYCTRAFFIC', 'MTABUSVEHICLEMONITORING', 'SUBWAY', 'VEHICLEPOSITIONS', 'CAMERALIST', 'SERVICEALERTS'],
    sources: [
      { name: 'NYC 511', url: 'https://511ny.org/map', description: 'NY traffic & cameras', free: true },
      { name: 'GTFS Realtime', url: 'https://gtfs.org/realtime/', description: 'Transit feeds worldwide', free: true },
      { name: 'MTA API', url: 'https://api.mta.info/', description: 'NYC transit data', free: true, apiKey: true },
      { name: 'TransCom', url: 'https://xcm.transcom.org/', description: 'NYC traffic management', free: true },
      { name: 'OpenStreetMap Nominatim', url: 'https://nominatim.openstreetmap.org/', description: 'Free geocoding & reverse geocoding', free: true },
      { name: 'OpenStreetMap API', url: 'https://wiki.openstreetmap.org/wiki/API', description: 'Open map data & editing', free: true },
    ],
  },
  {
    name: 'Air Quality',
    icon: <Cloud className="w-4 h-4" />,
    color: 'text-teal-400',
    snowflakeTables: ['AIRQUALITY2', 'AQ', 'AQFORECAST'],
    sources: [
      { name: 'AirNow', url: 'https://www.airnow.gov/', description: 'EPA air quality', free: true },
      { name: 'OpenAQ', url: 'https://openaq.org/', description: 'Global air quality', free: true },
      { name: 'PurpleAir', url: 'https://www.purpleair.com/', description: 'Sensor network', free: true },
      { name: 'IQAir', url: 'https://www.iqair.com/', description: 'World AQI rankings', free: true },
    ],
  },
  {
    name: 'Live Cameras',
    icon: <Video className="w-4 h-4" />,
    color: 'text-rose-400',
    snowflakeTables: ['CAMERALIST', 'NYCTRAFFICIMAGES'],
    sources: [
      { name: '511 Traffic Cams', url: 'https://511.org/', description: 'State DOT cameras', free: true },
      { name: 'WorldCam', url: 'https://worldcam.eu/', description: 'Public webcams', free: true },
      { name: 'EarthCam', url: 'https://www.earthcam.com/', description: 'City cameras', free: true },
      { name: 'Windy Webcams', url: 'https://api.windy.com/webcams/', description: 'Weather cameras', free: true },
      { name: 'Insecam', url: 'http://insecam.org/', description: 'Public IP cameras', free: true },
    ],
  },
  {
    name: 'Maritime & Shipping',
    icon: <Ship className="w-4 h-4" />,
    color: 'text-sky-400',
    sources: [
      { name: 'MarineTraffic', url: 'https://www.marinetraffic.com/', description: 'Ship tracking', free: true },
      { name: 'VesselFinder', url: 'https://www.vesselfinder.com/', description: 'AIS vessel data', free: true },
      { name: 'OpenSeaMap', url: 'https://openseamap.org/', description: 'Marine charts', free: true },
    ],
  },
  {
    name: 'Space & Satellites',
    icon: <Satellite className="w-4 h-4" />,
    color: 'text-violet-400',
    sources: [
      { name: 'N2YO', url: 'https://www.n2yo.com/api/', description: 'Satellite tracking', free: true, apiKey: true },
      { name: 'CelesTrak', url: 'https://celestrak.com/', description: 'TLE orbital data', free: true },
      { name: 'Space-Track', url: 'https://www.space-track.org/', description: 'Space object catalog', free: true },
      { name: 'Heavens-Above', url: 'https://www.heavens-above.com/', description: 'Satellite passes', free: true },
    ],
  },
  {
    name: 'Sensors & IoT',
    icon: <Thermometer className="w-4 h-4" />,
    color: 'text-emerald-400',
    snowflakeTables: ['THERMAL_SENSOR_DATA', 'MESHTASTIC_DATA', 'SENSORS', 'SENSEHAT_SENSOR_DATA'],
    sources: [
      { name: 'Meshtastic', url: 'https://meshtastic.io/', description: 'LoRa mesh network', free: true },
      { name: 'meshmap.net', url: 'https://meshmap.net/', description: 'Global mesh nodes', free: true },
      { name: 'TTN Mapper', url: 'https://ttnmapper.org/', description: 'LoRaWAN coverage', free: true },
    ],
  },
]

export function DataSourcesModal() {
  const { toggleDataSources } = useDashboardStore()

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-semibold text-slate-100">OSINT Data Sources</h2>
            <span className="px-2 py-0.5 text-xs bg-blue-500/20 text-blue-400 rounded">
              100+ Free APIs
            </span>
          </div>
          <button
            onClick={toggleDataSources}
            className="p-1 hover:bg-slate-800 rounded transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-auto max-h-[calc(90vh-60px)] p-4">
          <div className="grid grid-cols-2 gap-4">
            {dataCategories.map((category) => (
              <div
                key={category.name}
                className="bg-slate-800/50 border border-slate-700/50 rounded-lg overflow-hidden"
              >
                {/* Category Header */}
                <div className="flex items-center justify-between px-3 py-2 bg-slate-800 border-b border-slate-700/50">
                  <div className="flex items-center gap-2">
                    <span className={category.color}>{category.icon}</span>
                    <span className="font-medium text-slate-200">{category.name}</span>
                    <span className="text-xs text-slate-500">
                      ({category.sources.length} sources)
                    </span>
                  </div>
                </div>

                {/* Snowflake Tables */}
                {category.snowflakeTables && category.snowflakeTables.length > 0 && (
                  <div className="px-3 py-2 bg-blue-500/10 border-b border-slate-700/50">
                    <div className="flex items-center gap-1 text-xs text-blue-400 mb-1">
                      <Database className="w-3 h-3" />
                      <span>Snowflake Tables</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {category.snowflakeTables.map((table) => (
                        <a
                          key={table}
                          href={`https://app.snowflake.com/search?q=${encodeURIComponent(table)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-1.5 py-0.5 text-xs bg-blue-500/20 text-blue-300 rounded font-mono hover:bg-blue-500/40 hover:text-blue-200 transition-colors cursor-pointer inline-flex items-center gap-1"
                        >
                          {table}
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sources List */}
                <div className="p-2 space-y-1 max-h-48 overflow-auto">
                  {category.sources.map((source) => (
                    <a
                      key={source.name}
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between px-2 py-1.5 bg-slate-700/30 hover:bg-slate-700/50 rounded transition-colors group"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-slate-200 group-hover:text-white">
                            {source.name}
                          </span>
                          {source.apiKey && (
                            <span className="px-1 py-0.5 text-xs bg-yellow-500/20 text-yellow-400 rounded">
                              API Key
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-500 truncate">{source.description}</div>
                      </div>
                      <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-slate-300 flex-shrink-0 ml-2" />
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
