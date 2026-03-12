import { TrendingUp, TrendingDown, DollarSign, ExternalLink } from 'lucide-react'
import { Panel } from '@/components/ui/Panel'
import { useCryptoPrices } from '@/hooks/useOsintData'
import { formatCurrency } from '@/lib/utils'

export function MarketsPanel() {
  const { data: crypto, isLoading, refetch, dataUpdatedAt } = useCryptoPrices()

  // Demo stock data (would come from Snowflake in production)
  const stocks = [
    { symbol: 'AAPL', price: 150.25, change: 1.25 },
    { symbol: 'TSLA', price: 483.08, change: -2.15 },
    { symbol: 'GOOGL', price: 141.80, change: 0.85 },
    { symbol: 'MSFT', price: 378.50, change: 1.02 },
    { symbol: 'NVDA', price: 875.25, change: 3.45 },
  ]

  const winners = crypto?.filter((c) => c.change24h > 0).length || 0
  const losers = crypto?.filter((c) => c.change24h < 0).length || 0

  return (
    <Panel
      id="markets"
      title="Markets Overview"
      icon={<DollarSign className="w-4 h-4" />}
      status="ok"
      refreshing={isLoading}
      lastUpdated={dataUpdatedAt ? new Date(dataUpdatedAt) : null}
      onRefresh={() => refetch()}
    >
      <div className="p-2">
        {/* Market Summary */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="bg-slate-800/50 rounded p-2 text-center">
            <div className="text-lg font-bold text-green-400">{winners}</div>
            <div className="text-xs text-slate-500">Gainers</div>
          </div>
          <div className="bg-slate-800/50 rounded p-2 text-center">
            <div className="text-lg font-bold text-red-400">{losers}</div>
            <div className="text-xs text-slate-500">Losers</div>
          </div>
          <div className="bg-slate-800/50 rounded p-2 text-center">
            <div className="text-lg font-bold text-blue-400">{crypto?.length || 0}</div>
            <div className="text-xs text-slate-500">Tracking</div>
          </div>
        </div>

        {/* Stocks from Snowflake */}
        <div className="mb-2">
          <div className="text-xs text-slate-500 mb-1 uppercase">Stocks (Snowflake)</div>
          <div className="grid grid-cols-5 gap-1">
            {stocks.map((s) => (
              <a
                key={s.symbol}
                href={`https://finance.yahoo.com/quote/${s.symbol}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-slate-800/50 hover:bg-slate-800/70 rounded p-1.5 text-center transition-colors cursor-pointer"
              >
                <div className="text-xs font-mono text-slate-300">{s.symbol}</div>
                <div className="text-xs text-slate-400">${s.price}</div>
                <div className={`text-xs ${s.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {s.change >= 0 ? '+' : ''}{s.change.toFixed(2)}%
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Crypto */}
        <div>
          <div className="text-xs text-slate-500 mb-1 uppercase">Crypto (CoinGecko)</div>
          <div className="space-y-1 max-h-24 overflow-auto">
            {crypto?.slice(0, 8).map((c) => (
              <a
                key={c.id}
                href={`https://www.coingecko.com/en/coins/${c.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between px-2 py-1 bg-slate-800/30 hover:bg-slate-800/50 rounded text-xs transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono text-slate-300 w-10">{c.symbol}</span>
                  <span className="text-slate-400">{formatCurrency(c.price)}</span>
                </div>
                <div className={`flex items-center gap-1 ${c.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {c.change24h >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {c.change24h.toFixed(2)}%
                  <ExternalLink className="w-3 h-3 text-slate-500 ml-1" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </Panel>
  )
}
