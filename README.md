# Global Situation Desk

A real-time global intelligence dashboard built with React, TypeScript, and integrated with Snowflake data. Inspired by [sitdeck.com](https://sitdeck.com).

## Live at: http://localhost:3000

![dash](https://raw.githubusercontent.com/tspannhw/SNACKAI-CoCo-situation-desk/refs/heads/main/sitdesk.png)

![dash](https://raw.githubusercontent.com/tspannhw/SNACKAI-CoCo-situation-desk/refs/heads/main/sitdesk2.png)


## Features

- **10 Dashboard Panels** with real-time auto-refresh
- **Interactive Global Map** with Leaflet.js (no API key required)
- **Snowflake Integration** - 25+ tables from DEMO.DEMO
- **100+ Free OSINT APIs** integrated
- **Live Data Updates** - automatic refresh every 10-60 seconds

## Live Data Refresh Rates

| Data Type | Refresh Interval | Stale Time |
|-----------|------------------|------------|
| Aircraft (ADS-B) | 10 seconds | 5 seconds |
| Earthquakes | 30 seconds | 15 seconds |
| Crypto Prices | 30 seconds | 15 seconds |
| Weather Alerts | 1 minute | 30 seconds |
| News Feed | 1 minute | 30 seconds |

## Tech Stack

- React 19 + TypeScript + Vite
- Tailwind CSS
- Leaflet.js + React-Leaflet (maps)
- Recharts (charts)
- TanStack Query (data fetching with auto-refresh)
- Zustand (state management)
- Vitest + Testing Library (testing)

---

## Snowflake Tables (DEMO.DEMO)

### Aviation & Military
| Table | Description |
|-------|-------------|
| `ADSB_AIRCRAFT_DATA` | Real-time ADS-B aircraft positions |
| `PLANES` | Aircraft registry and metadata |
| `FLIGHT_DATA_ICEBERG` | Historical flight data (Iceberg format) |

### Traffic & Transit
| Table | Description |
|-------|-------------|
| `NYCTRAFFIC` | NYC traffic flow data |
| `NYCTRAFFICEVENTS` | Traffic incidents and events |
| `NYCTRAFFICSTATIONS` | Traffic monitoring stations |
| `MTABUSVEHICLEMONITORING` | Real-time MTA bus positions |
| `SUBWAY` | NYC subway train positions |
| `VEHICLEPOSITIONS` | General vehicle tracking |
| `SERVICEALERTS` | Transit service alerts |

### Weather & Climate
| Table | Description |
|-------|-------------|
| `NOAAWEATHER` | NOAA weather observations |
| `WEATHER_DATA` | General weather data |
| `WEATHER_OBSERVATIONS` | Weather station readings |
| `WEATHER_ALERTS` | Active weather alerts |

### Air Quality
| Table | Description |
|-------|-------------|
| `AIRQUALITY2` | Air quality index data |
| `AQ` | Air quality measurements |
| `AQFORECAST` | Air quality forecasts |

### Live Cameras
| Table | Description |
|-------|-------------|
| `CAMERALIST` | Traffic camera registry |
| `NYCTRAFFICIMAGES` | NYC traffic camera images |

### Markets & Finance
| Table | Description |
|-------|-------------|
| `STOCK_TRADES` | Stock trade data |
| `STOCKVALUES` | Stock price history |
| `CRYPTO` | Cryptocurrency data |
| `COINTRADES` | Crypto trade history |

### Alerts & Advisories
| Table | Description |
|-------|-------------|
| `TRAVELADVISORIES` | US State Dept travel advisories |
| `SERVICEALERTS` | Transit/service alerts |
| `TRANSIT_ALERTS` | Public transit alerts |

### Sensors & IoT
| Table | Description |
|-------|-------------|
| `THERMAL_SENSOR_DATA` | Thermal sensor readings |
| `MESHTASTIC_DATA` | Meshtastic LoRa mesh data |
| `SENSORS` | General sensor data |
| `SENSEHAT_SENSOR_DATA` | Raspberry Pi SenseHat data |

---

## Free OSINT Data Sources (100+)

### 1. Aviation & Military Aircraft Tracking

| Source | URL | Description | Free Tier |
|--------|-----|-------------|-----------|
| [OpenSky Network](https://opensky-network.org/api) | `opensky-network.org/api` | Global ADS-B tracking | 400 req/day |
| [ADSB.lol](https://api.adsb.lol/v2) | `api.adsb.lol/v2` | Unlimited free ADS-B | Unlimited |
| [ADS-B Exchange](https://globe.adsbexchange.com/) | `adsbexchange.com` | Worldwide flight tracking | Free |
| [FlightRadar24](https://data-cloud.flightradar24.com/) | `flightradar24.com` | Commercial flight tracking | Limited |
| [ADS-B.fi](https://adsb.fi/) | `adsb.fi` | European ADS-B coverage | Free |
| [Plane.watch](https://plane.watch/) | `plane.watch` | Global plane tracking | Free |
| [tar1090](https://github.com/wiedehopf/tar1090) | GitHub | Self-hosted ADS-B viewer | Self-hosted |

### 2. Weather & Climate

| Source | URL | Description | Free Tier |
|--------|-----|-------------|-----------|
| [NWS Weather API](https://api.weather.gov/) | `api.weather.gov` | Official US weather & alerts | Unlimited |
| [Open-Meteo](https://open-meteo.com/) | `open-meteo.com` | Free global weather API | Unlimited |
| [OpenWeatherMap](https://openweathermap.org/api) | `openweathermap.org/api` | Global weather (API key) | 1000 req/day |
| [NOAA SPC](https://www.spc.noaa.gov/) | `spc.noaa.gov` | Storm prediction center | Free |
| [Windy API](https://api.windy.com/) | `api.windy.com` | Wind visualization | API key |
| [Tropical Tidbits](https://www.tropicaltidbits.com/) | `tropicaltidbits.com` | Hurricane tracking | Free |
| [Ventusky](https://www.ventusky.com/) | `ventusky.com` | Weather visualization maps | Free |
| [NOAA Climate](https://www.ncei.noaa.gov/) | `ncei.noaa.gov` | Historical climate data | Free |

### 3. Earthquakes & Natural Disasters

| Source | URL | Description | Free Tier |
|--------|-----|-------------|-----------|
| [USGS Earthquake](https://earthquake.usgs.gov/fdsnws/event/1/) | `earthquake.usgs.gov` | Real-time earthquake data | Unlimited |
| [EMSC](https://www.emsc-csem.org/) | `emsc-csem.org` | European seismic data | Free |
| [GDACS](https://www.gdacs.org/gdacsapi/) | `gdacs.org/gdacsapi` | Global disaster alerts | Free |
| [ReliefWeb](https://api.reliefweb.int/v1/) | `api.reliefweb.int` | Humanitarian crisis data | Free |
| [Volcano Discovery](https://www.volcanodiscovery.com/) | `volcanodiscovery.com` | Volcanic activity | Free |
| [NOAA Tsunami](https://www.tsunami.gov/) | `tsunami.gov` | Tsunami warnings | Free |
| [EONET (NASA)](https://eonet.gsfc.nasa.gov/api/v3) | `eonet.gsfc.nasa.gov` | Natural events tracker | Free |

### 4. Markets & Finance

| Source | URL | Description | Free Tier |
|--------|-----|-------------|-----------|
| [CoinGecko](https://api.coingecko.com/api/v3/) | `api.coingecko.com` | Cryptocurrency prices | 10-50 req/min |
| [Alpha Vantage](https://www.alphavantage.co/) | `alphavantage.co` | Stock market data | 5 req/min |
| [Finnhub](https://finnhub.io/api/v1/) | `finnhub.io` | Financial data | 60 req/min |
| [Yahoo Finance](https://query1.finance.yahoo.com/) | `finance.yahoo.com` | Stock quotes | Free |
| [FRED](https://api.stlouisfed.org/fred/) | `api.stlouisfed.org` | Economic data | API key |
| [ECB Data](https://sdw-wsrest.ecb.europa.eu/) | `ecb.europa.eu` | European Central Bank | Free |
| [World Bank](https://api.worldbank.org/v2/) | `api.worldbank.org` | Development indicators | Free |
| [IMF Data](https://www.imf.org/external/datamapper/) | `imf.org` | Global economics | Free |

### 5. Cyber Threats & Security

| Source | URL | Description | Free Tier |
|--------|-----|-------------|-----------|
| [CISA Alerts](https://www.cisa.gov/uscert/ncas/alerts.xml) | `cisa.gov` | US cyber security alerts | Free |
| [AbuseIPDB](https://api.abuseipdb.com/) | `api.abuseipdb.com` | Malicious IP database | 1000 req/day |
| [ThreatFox](https://threatfox.abuse.ch/api/) | `threatfox.abuse.ch` | IOC database | Free |
| [URLhaus](https://urlhaus.abuse.ch/api/) | `urlhaus.abuse.ch` | Malicious URL database | Free |
| [Malware Bazaar](https://bazaar.abuse.ch/api/) | `bazaar.abuse.ch` | Malware samples | Free |
| [Shodan](https://api.shodan.io/) | `api.shodan.io` | Internet scanning | API key |
| [GreyNoise](https://api.greynoise.io/) | `api.greynoise.io` | Internet noise analysis | API key |
| [AlienVault OTX](https://otx.alienvault.com/api/) | `otx.alienvault.com` | Threat intelligence | API key |

### 6. News & Events

| Source | URL | Description | Free Tier |
|--------|-----|-------------|-----------|
| [GDELT](https://api.gdeltproject.org/) | `api.gdeltproject.org` | Global news events | Free |
| [NewsAPI](https://newsapi.org/v2/) | `newsapi.org` | News aggregation | 100 req/day |
| [Reddit API](https://www.reddit.com/dev/api/) | `reddit.com/dev/api` | Social news | Free |
| [AP News RSS](https://apnews.com/) | `apnews.com` | Associated Press | Free |
| [Reuters RSS](https://www.reuters.com/) | `reuters.com` | International news | Free |
| [Al Jazeera RSS](https://www.aljazeera.com/) | `aljazeera.com` | Global perspective | Free |
| [Event Registry](https://eventregistry.org/api/) | `eventregistry.org` | News event tracking | API key |

### 7. Conflicts & Geopolitical

| Source | URL | Description | Free Tier |
|--------|-----|-------------|-----------|
| [ACLED](https://acleddata.com/data-export-tool/) | `acleddata.com` | Armed conflict events | Free |
| [LiveUA Map](https://liveuamap.com/) | `liveuamap.com` | Conflict mapping | Free |
| [SIPRI](https://www.sipri.org/databases) | `sipri.org` | Arms transfers data | Free |
| [Crisis24](https://crisis24.garda.com/) | `crisis24.garda.com` | Global security incidents | Free |
| [Uppsala Conflict](https://ucdp.uu.se/) | `ucdp.uu.se` | Conflict data program | Free |
| [US State Dept](https://travel.state.gov/) | `travel.state.gov` | Travel advisories | Free |

### 8. Disease & Health

| Source | URL | Description | Free Tier |
|--------|-----|-------------|-----------|
| [WHO Outbreaks](https://www.who.int/emergencies/disease-outbreak-news/) | `who.int` | Disease outbreak news | Free |
| [CDC Data](https://data.cdc.gov/) | `data.cdc.gov` | US health statistics | Free |
| [ProMED](https://promedmail.org/) | `promedmail.org` | Infectious disease alerts | Free |
| [HealthMap](https://healthmap.org/) | `healthmap.org` | Disease surveillance | Free |
| [Our World in Data](https://ourworldindata.org/) | `ourworldindata.org` | Health statistics | Free |
| [GISAID](https://gisaid.org/) | `gisaid.org` | Pathogen sequences | Free |

### 9. Energy & Infrastructure

| Source | URL | Description | Free Tier |
|--------|-----|-------------|-----------|
| [EIA](https://api.eia.gov/) | `api.eia.gov` | US energy data | API key |
| [ENTSO-E](https://transparency.entsoe.eu/) | `entsoe.eu` | European power grid | Free |
| [IAEA PRIS](https://pris.iaea.org/) | `pris.iaea.org` | Nuclear reactor status | Free |
| [ERCOT](https://www.ercot.com/) | `ercot.com` | Texas grid operations | Free |
| [PHMSA](https://www.phmsa.dot.gov/) | `phmsa.dot.gov` | Pipeline safety data | Free |

### 10. Traffic & Transit

| Source | URL | Description | Free Tier |
|--------|-----|-------------|-----------|
| [NYC 511](https://511ny.org/) | `511ny.org` | NY traffic & cameras | Free |
| [GTFS Realtime](https://gtfs.org/realtime/) | `gtfs.org` | Transit feeds worldwide | Free |
| [MTA API](https://api.mta.info/) | `api.mta.info` | NYC transit data | API key |
| [TransCom](https://xcm.transcom.org/) | `transcom.org` | NYC traffic management | Free |

### 11. Air Quality

| Source | URL | Description | Free Tier |
|--------|-----|-------------|-----------|
| [AirNow](https://www.airnow.gov/) | `airnow.gov` | EPA air quality | Free |
| [OpenAQ](https://openaq.org/) | `openaq.org` | Global air quality | Free |
| [PurpleAir](https://www.purpleair.com/) | `purpleair.com` | Sensor network | Free |
| [IQAir](https://www.iqair.com/) | `iqair.com` | World AQI rankings | Free |

### 12. Live Cameras

| Source | URL | Description | Free Tier |
|--------|-----|-------------|-----------|
| [511 Traffic Cams](https://511.org/) | `511.org` | State DOT cameras | Free |
| [WorldCam](https://worldcam.eu/) | `worldcam.eu` | Public webcams | Free |
| [EarthCam](https://www.earthcam.com/) | `earthcam.com` | City cameras | Free |
| [Windy Webcams](https://api.windy.com/webcams/) | `windy.com/webcams` | Weather cameras | Free |
| [Insecam](http://insecam.org/) | `insecam.org` | Public IP cameras | Free |

### 13. Maritime & Shipping

| Source | URL | Description | Free Tier |
|--------|-----|-------------|-----------|
| [MarineTraffic](https://www.marinetraffic.com/) | `marinetraffic.com` | Ship tracking | Limited |
| [VesselFinder](https://www.vesselfinder.com/) | `vesselfinder.com` | AIS vessel data | Free |
| [OpenSeaMap](https://openseamap.org/) | `openseamap.org` | Marine charts | Free |

### 14. Space & Satellites

| Source | URL | Description | Free Tier |
|--------|-----|-------------|-----------|
| [N2YO](https://www.n2yo.com/api/) | `n2yo.com/api` | Satellite tracking | API key |
| [CelesTrak](https://celestrak.com/) | `celestrak.com` | TLE orbital data | Free |
| [Space-Track](https://www.space-track.org/) | `space-track.org` | Space object catalog | Free |
| [Heavens-Above](https://www.heavens-above.com/) | `heavens-above.com` | Satellite passes | Free |

### 15. Sensors & IoT / Meshtastic

| Source | URL | Description | Free Tier |
|--------|-----|-------------|-----------|
| [Meshtastic](https://meshtastic.io/) | `meshtastic.io` | LoRa mesh network | Free |
| [meshmap.net](https://meshmap.net/) | `meshmap.net` | Global mesh nodes | Free |
| [TTN Mapper](https://ttnmapper.org/) | `ttnmapper.org` | LoRaWAN coverage | Free |

### 16. Elections & Politics

| Source | URL | Description | Free Tier |
|--------|-----|-------------|-----------|
| [OpenSecrets](https://api.opensecrets.org/) | `api.opensecrets.org` | Campaign finance | API key |
| [FEC](https://api.open.fec.gov/) | `api.open.fec.gov` | US elections data | API key |
| [Election Guide](https://www.electionguide.org/) | `electionguide.org` | Global elections | Free |
| [MIT Election Lab](https://electionlab.mit.edu/data) | `electionlab.mit.edu` | Election data | Free |

---

## Active API Integrations

The following APIs are **actively integrated** and refresh automatically:

| API | Endpoint | Refresh Rate | Panel |
|-----|----------|--------------|-------|
| USGS Earthquakes | `earthquake.usgs.gov` | 30 sec | Earthquakes |
| NWS Alerts | `api.weather.gov/alerts` | 1 min | Weather |
| CoinGecko | `api.coingecko.com` | 30 sec | Markets |
| OpenSky Network | `opensky-network.org/api` | 10 sec | Aviation |
| Reddit r/worldnews | `reddit.com` | 1 min | News |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         SITUATION DESK                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌──────────────┐     ┌──────────────┐     ┌──────────────┐   │
│   │   Frontend   │     │   Backend    │     │  Snowflake   │   │
│   │  (React/Vite)│────▶│  (Express)   │────▶│   (DEMO.DEMO)│   │
│   │  Port: 3000  │     │  Port: 8080  │     │   tspann1    │   │
│   └──────────────┘     └──────────────┘     └──────────────┘   │
│          │                                                      │
│          │         ┌──────────────────────────────────┐        │
│          └────────▶│  External OSINT APIs (100+)     │        │
│                    │  • USGS Earthquakes             │        │
│                    │  • NWS Weather Alerts           │        │
│                    │  • OpenSky Aircraft             │        │
│                    │  • CoinGecko Crypto             │        │
│                    │  • Reddit News                  │        │
│                    └──────────────────────────────────┘        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Quick Start

### Prerequisites

- Node.js 18+ 
- Cortex CLI with Snowflake connection `tspann1` configured
- Access to Snowflake database `DEMO.DEMO`

### Installation & Running

```bash
# 1. Install dependencies
npm install

# 2. Start both backend and frontend (recommended)
npm start
# This starts:
#   - Backend server on http://localhost:8080
#   - Frontend dev server on http://localhost:3000

# OR run them separately in two terminals:

# Terminal 1: Start the backend server
npm run server
# Server runs on http://localhost:8080

# Terminal 2: Start the frontend dev server  
npm run dev
# Frontend runs on http://localhost:3000

# 3. Open browser to http://localhost:3000
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start both backend (8080) and frontend (3000) |
| `npm run dev` | Start frontend only (Vite dev server on port 3000) |
| `npm run server` | Start backend only (Express on port 8080) |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm test` | Run tests in watch mode |
| `npm run test:run` | Run tests once |
| `npm run test:coverage` | Run tests with coverage |

### Port Configuration

| Service | Port | Description |
|---------|------|-------------|
| Frontend (Vite) | **3000** | React application |
| Backend (Express) | **8080** | Snowflake API proxy |

The frontend proxies `/api/snowflake/*` requests to the backend server.

## Backend API Endpoints

The Express server (`server.js`) provides these endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/snowflake/query` | Execute a SQL query |
| `POST` | `/api/snowflake/execute` | Execute a SQL query (alias) |
| `GET` | `/api/snowflake/test` | Test Snowflake connection |
| `GET` | `/api/health` | Health check |

### Example API Usage

```bash
# Test connection
curl http://localhost:8080/api/snowflake/test

# Execute a query
curl -X POST http://localhost:8080/api/snowflake/query \
  -H "Content-Type: application/json" \
  -d '{"sql": "SELECT * FROM DEMO.DEMO.ADSB_AIRCRAFT_DATA LIMIT 10"}'
```

## Snowflake Configuration

The backend uses the Cortex CLI to execute Snowflake queries. Ensure you have:

1. **Cortex CLI installed** and in your PATH
2. **Snowflake connection** named `tspann1` configured:
   ```bash
   # Check your connections
   cortex connection list
   
   # The tspann1 connection should have access to DEMO.DEMO database
   ```

### Required Database Access

The application queries these tables in `DEMO.DEMO`:

```
DEMO.DEMO.ADSB_AIRCRAFT_DATA      - Aircraft positions
DEMO.DEMO.NOAAWEATHER             - Weather stations
DEMO.DEMO.AIRQUALITY2             - Air quality readings
DEMO.DEMO.MTABUSVEHICLEMONITORING - MTA bus positions
DEMO.DEMO.MESHTASTIC_DATA         - Mesh network nodes
DEMO.DEMO.CAMERALIST              - Traffic cameras
DEMO.DEMO.NYCTRAFFIC              - Traffic flow data
DEMO.DEMO.SERVICEALERTS           - Transit alerts
DEMO.DEMO.TRAVELADVISORIES        - Travel advisories
DEMO.DEMO.STOCK_TRADES            - Stock data
```

## Troubleshooting

### ECONNREFUSED on /api/snowflake

**Symptom:** `[vite] http proxy error: /api/snowflake/execute ECONNREFUSED`

**Cause:** Backend server is not running on port 8080.

**Solution:** Start the backend server:
```bash
npm run server
# or
npm start  # starts both frontend and backend
```

### Port Already in Use

```bash
# Find what's using port 3000
lsof -i :3000

# Find what's using port 8080  
lsof -i :8080

# Kill the process
kill -9 <PID>
```

### Snowflake Connection Issues

```bash
# Test your Cortex connection
cortex sql "SELECT 1" --connection tspann1

# List available connections
cortex connection list
```

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `?` | Show help |
| `r` | Refresh all panels |
| `d` | Toggle data sources modal |
| `Esc` | Close expanded panel |

---

Built with Snowflake + React + 100+ OSINT feeds
