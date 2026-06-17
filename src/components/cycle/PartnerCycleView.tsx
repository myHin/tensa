import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { cycleInfo } from '@/data/mock'

interface PartnerCycleViewProps {
  ownerName: string
  canViewLogs: boolean
  canViewPrediction: boolean
}

export function PartnerCycleView({
  ownerName,
  canViewLogs,
  canViewPrediction,
}: PartnerCycleViewProps) {
  if (!canViewLogs && !canViewPrediction) {
    return (
      <Card padding="lg" className="text-center bg-[var(--color-bg-muted)] border-none">
        <div className="text-3xl mb-3">🔒</div>
        <p className="font-semibold mb-1">{ownerName} 尚未分享</p>
        <p className="text-sm text-muted leading-relaxed">
          {ownerName} 的生理期記錄與預測目前僅自己可見
        </p>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Card padding="sm" className="bg-accent-soft border-none">
        <p className="text-xs font-semibold">
          你正在查看 {ownerName} 分享的資料
        </p>
      </Card>

      {canViewPrediction ? (
        <Card padding="lg" className="hero-gradient border-none">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted mb-1">{ownerName} · 預測下次生理期</p>
              <p className="text-2xl font-bold">{cycleInfo.nextPredicted}</p>
              <p className="text-xs text-muted mt-2">平均週期 {cycleInfo.avgCycle} 天</p>
            </div>
            <Badge variant="success">已分享</Badge>
          </div>
        </Card>
      ) : (
        <Card padding="md" className="bg-[var(--color-bg-muted)] border-none text-center">
          <p className="text-sm text-muted">🔒 週期預測未開放</p>
        </Card>
      )}

      {canViewLogs ? (
        <section>
          <h3 className="font-bold mb-3 text-sm">{ownerName} 的最近紀錄</h3>
          {cycleInfo.recentLogs.map((log) => (
            <Card key={log.id} padding="sm" className="mb-2 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium">{log.range}</p>
                <p className="text-xs text-muted">{log.duration} 天 · {log.cycle} 天週期</p>
              </div>
              {log.note && <Badge variant="muted">{log.note}</Badge>}
            </Card>
          ))}
        </section>
      ) : (
        <Card padding="md" className="bg-[var(--color-bg-muted)] border-none text-center">
          <p className="text-sm text-muted">🔒 生理期記錄未開放</p>
        </Card>
      )}
    </div>
  )
}
