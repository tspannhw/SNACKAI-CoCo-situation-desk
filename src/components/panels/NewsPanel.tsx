import { Newspaper, ExternalLink } from 'lucide-react'
import { Panel } from '@/components/ui/Panel'
import { useNews } from '@/hooks/useOsintData'
import { timeAgo } from '@/lib/utils'

export function NewsPanel() {
  const { data: news, isLoading, refetch, dataUpdatedAt } = useNews()

  return (
    <Panel
      id="news"
      title="Breaking News"
      icon={<Newspaper className="w-4 h-4" />}
      status="info"
      count={news?.length || 0}
      refreshing={isLoading}
      lastUpdated={dataUpdatedAt ? new Date(dataUpdatedAt) : null}
      onRefresh={() => refetch()}
    >
      <div className="p-2 space-y-1">
        <div className="space-y-1 max-h-52 overflow-auto">
          {news?.map((item) => (
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block px-2 py-1.5 bg-slate-800/30 hover:bg-slate-800/50 rounded transition-colors"
            >
              <div className="flex items-start gap-2">
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-slate-200 line-clamp-2">{item.title}</div>
                  <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                    <span className="truncate max-w-[100px]">{item.source}</span>
                    <span>·</span>
                    <span>{timeAgo(item.publishedAt)}</span>
                  </div>
                </div>
                <ExternalLink className="w-3 h-3 text-slate-500 flex-shrink-0 mt-1" />
              </div>
            </a>
          ))}
        </div>

        {/* Sources */}
        <div className="pt-2 border-t border-slate-700/50 text-xs text-slate-500">
          Sources: GDELT, Reuters, AP News, Reddit, CDC, DailyMed
        </div>
      </div>
    </Panel>
  )
}
