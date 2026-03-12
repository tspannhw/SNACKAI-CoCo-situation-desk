import { AlertTriangle, Globe, Shield, ExternalLink } from 'lucide-react'
import { Panel } from '@/components/ui/Panel'
import { cn } from '@/lib/utils'

export function AlertsPanel() {
  // Demo travel advisories (from Snowflake TRAVELADVISORIES)
  const advisories = [
    { country: 'Sudan', level: 4, reason: 'Armed Conflict', updated: '2025-04-22', code: 'SD' },
    { country: 'Ukraine', level: 4, reason: 'Armed Conflict', updated: '2025-03-15', code: 'UA' },
    { country: 'Syria', level: 4, reason: 'Civil Unrest', updated: '2025-03-10', code: 'SY' },
    { country: 'Venezuela', level: 4, reason: 'Crime', updated: '2025-02-28', code: 'VE' },
    { country: 'Armenia', level: 2, reason: 'Border Conflict', updated: '2025-09-05', code: 'AM' },
    { country: 'Zimbabwe', level: 2, reason: 'Crime', updated: '2025-06-27', code: 'ZW' },
    { country: 'Mexico', level: 2, reason: 'Crime', updated: '2025-01-15', code: 'MX' },
    { country: 'Brazil', level: 2, reason: 'Crime', updated: '2025-01-10', code: 'BR' },
  ]

  // Service alerts from transit (Snowflake SERVICEALERTS)
  const serviceAlerts = [
    { route: 'B35', message: 'Detoured - 39th St construction', severity: 'moderate' },
    { route: 'A Train', message: 'Delays due to signal problems', severity: 'minor' },
    { route: 'L Train', message: 'Weekend shutdown for maintenance', severity: 'major' },
  ]

  const getLevelColor = (level: number) => {
    switch (level) {
      case 4: return 'text-red-400 bg-red-500/20 border-red-500/50'
      case 3: return 'text-orange-400 bg-orange-500/20 border-orange-500/50'
      case 2: return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/50'
      default: return 'text-green-400 bg-green-500/20 border-green-500/50'
    }
  }

  const _getLevelLabel = (level: number) => {
    switch (level) {
      case 4: return 'Do Not Travel'
      case 3: return 'Reconsider Travel'
      case 2: return 'Exercise Caution'
      default: return 'Normal'
    }
  }

  const level4Count = advisories.filter((a) => a.level === 4).length
  const level3Count = advisories.filter((a) => a.level === 3).length
  const level2Count = advisories.filter((a) => a.level === 2).length

  return (
    <Panel
      id="alerts"
      title="Travel & Service Alerts"
      icon={<AlertTriangle className="w-4 h-4" />}
      status={level4Count > 0 ? 'critical' : 'warning'}
      count={advisories.length + serviceAlerts.length}
    >
      <div className="p-2 space-y-2">
        {/* Travel Advisory Summary */}
        <div className="grid grid-cols-4 gap-1 text-center">
          <div className="bg-red-500/10 border border-red-500/30 rounded p-1">
            <div className="text-lg font-bold text-red-400">{level4Count}</div>
            <div className="text-xs text-slate-500">Level 4</div>
          </div>
          <div className="bg-orange-500/10 border border-orange-500/30 rounded p-1">
            <div className="text-lg font-bold text-orange-400">{level3Count}</div>
            <div className="text-xs text-slate-500">Level 3</div>
          </div>
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded p-1">
            <div className="text-lg font-bold text-yellow-400">{level2Count}</div>
            <div className="text-xs text-slate-500">Level 2</div>
          </div>
          <div className="bg-green-500/10 border border-green-500/30 rounded p-1">
            <div className="text-lg font-bold text-green-400">
              {195 - level4Count - level3Count - level2Count}
            </div>
            <div className="text-xs text-slate-500">Level 1</div>
          </div>
        </div>

        {/* Travel Advisories */}
        <div>
          <div className="flex items-center gap-1 text-xs text-slate-500 mb-1">
            <Globe className="w-3 h-3" />
            Travel Advisories
          </div>
          <div className="space-y-1 max-h-20 overflow-auto">
            {advisories.slice(0, 5).map((a) => (
              <a
                key={a.country}
                href={`https://travel.state.gov/content/travel/en/traveladvisories/traveladvisories/${a.country.toLowerCase().replace(' ', '-')}-travel-advisory.html`}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  'flex items-center justify-between px-2 py-1 rounded border text-xs hover:opacity-80 transition-opacity cursor-pointer',
                  getLevelColor(a.level)
                )}
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium">{a.country}</span>
                  <span className="opacity-70">{a.reason}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs opacity-80">L{a.level}</span>
                  <ExternalLink className="w-3 h-3" />
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Service Alerts */}
        <div>
          <div className="flex items-center gap-1 text-xs text-slate-500 mb-1">
            <Shield className="w-3 h-3" />
            Transit Service Alerts
          </div>
          <div className="space-y-1">
            {serviceAlerts.map((a, i) => (
              <a
                key={i}
                href={`https://new.mta.info/alerts`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-2 py-1 bg-slate-800/30 hover:bg-slate-800/50 rounded text-xs transition-colors cursor-pointer"
              >
                <span className="font-mono text-blue-400 w-12">{a.route}</span>
                <span className="text-slate-300 truncate flex-1">{a.message}</span>
                <ExternalLink className="w-3 h-3 text-slate-500" />
              </a>
            ))}
          </div>
        </div>

        <div className="text-xs text-slate-500">
          Sources: <a href="https://travel.state.gov/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">US State Dept</a>, Snowflake TRAVELADVISORIES, SERVICEALERTS
        </div>
      </div>
    </Panel>
  )
}
