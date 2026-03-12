import { Shield, Zap, Skull, Bug, Globe, ExternalLink } from 'lucide-react'
import { Panel } from '@/components/ui/Panel'
import { cn } from '@/lib/utils'

export function CyberPanel() {
  // Demo cyber threat data
  const threats = [
    { id: 1, type: 'Malware', indicator: 'ransomware.bad.actor', severity: 'critical', source: 'ThreatFox', url: 'https://threatfox.abuse.ch/' },
    { id: 2, type: 'C2', indicator: '192.168.1.100', severity: 'high', source: 'AbuseIPDB', url: 'https://www.abuseipdb.com/' },
    { id: 3, type: 'Phishing', indicator: 'fake-login.example.com', severity: 'high', source: 'URLhaus', url: 'https://urlhaus.abuse.ch/' },
    { id: 4, type: 'Botnet', indicator: '10.0.0.50', severity: 'medium', source: 'GreyNoise', url: 'https://www.greynoise.io/' },
    { id: 5, type: 'Exploit', indicator: 'CVE-2025-1234', severity: 'critical', source: 'CISA', url: 'https://www.cisa.gov/known-exploited-vulnerabilities-catalog' },
  ]

  const recentIncidents = [
    { title: 'Microsoft Patch Tuesday', severity: 'info', time: '2h ago', url: 'https://msrc.microsoft.com/update-guide/' },
    { title: 'Healthcare ransomware campaign', severity: 'critical', time: '4h ago', url: 'https://www.cisa.gov/stopransomware' },
    { title: 'New APT group targeting energy', severity: 'high', time: '6h ago', url: 'https://attack.mitre.org/groups/' },
  ]

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-400 bg-red-500/20 border-red-500/50'
      case 'high': return 'text-orange-400 bg-orange-500/20 border-orange-500/50'
      case 'medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/50'
      case 'low': return 'text-green-400 bg-green-500/20 border-green-500/50'
      default: return 'text-blue-400 bg-blue-500/20 border-blue-500/50'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Malware': return <Bug className="w-3 h-3" />
      case 'Ransomware': return <Skull className="w-3 h-3" />
      case 'C2': return <Globe className="w-3 h-3" />
      default: return <Zap className="w-3 h-3" />
    }
  }

  const criticalCount = threats.filter((t) => t.severity === 'critical').length
  const highCount = threats.filter((t) => t.severity === 'high').length

  return (
    <Panel
      id="cyber"
      title="Cyber Intelligence"
      icon={<Shield className="w-4 h-4" />}
      status={criticalCount > 0 ? 'critical' : 'ok'}
      count={threats.length}
    >
      <div className="p-2 space-y-2">
        {/* Threat Level Summary */}
        <div className="grid grid-cols-4 gap-1 text-center">
          <div className="bg-red-500/10 border border-red-500/30 rounded p-1">
            <div className="text-lg font-bold text-red-400">{criticalCount}</div>
            <div className="text-xs text-slate-500">Critical</div>
          </div>
          <div className="bg-orange-500/10 border border-orange-500/30 rounded p-1">
            <div className="text-lg font-bold text-orange-400">{highCount}</div>
            <div className="text-xs text-slate-500">High</div>
          </div>
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded p-1">
            <div className="text-lg font-bold text-yellow-400">
              {threats.filter((t) => t.severity === 'medium').length}
            </div>
            <div className="text-xs text-slate-500">Medium</div>
          </div>
          <div className="bg-green-500/10 border border-green-500/30 rounded p-1">
            <div className="text-lg font-bold text-green-400">
              {threats.filter((t) => t.severity === 'low').length}
            </div>
            <div className="text-xs text-slate-500">Low</div>
          </div>
        </div>

        {/* Threat Feed */}
        <div className="space-y-1 max-h-24 overflow-auto">
          {threats.map((t) => (
            <a
              key={t.id}
              href={t.url}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                'flex items-center justify-between px-2 py-1 rounded border text-xs hover:opacity-80 transition-opacity cursor-pointer',
                getSeverityColor(t.severity)
              )}
            >
              <div className="flex items-center gap-2">
                {getTypeIcon(t.type)}
                <span className="font-medium">{t.type}</span>
                <span className="font-mono text-xs opacity-70 truncate max-w-[120px]">
                  {t.indicator}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-xs opacity-70">{t.source}</span>
                <ExternalLink className="w-3 h-3" />
              </div>
            </a>
          ))}
        </div>

        {/* Recent Incidents */}
        <div>
          <div className="text-xs text-slate-500 mb-1">Recent Incidents</div>
          <div className="space-y-1">
            {recentIncidents.map((inc, i) => (
              <a
                key={i}
                href={inc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between px-2 py-1 bg-slate-800/30 hover:bg-slate-800/50 rounded text-xs transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className={cn(
                    'w-1.5 h-1.5 rounded-full',
                    inc.severity === 'critical' ? 'bg-red-500' :
                    inc.severity === 'high' ? 'bg-orange-500' : 'bg-blue-500'
                  )} />
                  <span className="text-slate-300">{inc.title}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">{inc.time}</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </div>
              </a>
            ))}
          </div>
        </div>

        <div className="text-xs text-slate-500">
          Sources: <a href="https://www.cisa.gov/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">CISA</a>, <a href="https://www.abuseipdb.com/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">AbuseIPDB</a>, <a href="https://threatfox.abuse.ch/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">ThreatFox</a>, URLhaus, GreyNoise
        </div>
      </div>
    </Panel>
  )
}
