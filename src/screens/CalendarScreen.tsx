import { useState } from 'react'
import { motion } from 'framer-motion'
import { ScreenHeader } from '@/components/layout/ScreenHeader'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { CyclePrivacyControls } from '@/components/cycle/CyclePrivacyControls'
import { PartnerCycleView } from '@/components/cycle/PartnerCycleView'
import { useApp } from '@/context/AppContext'
import { useCyclePrivacy } from '@/context/CycleContext'
import { calendarDays, upcomingEvents, cycleInfo } from '@/data/mock'

export function CalendarScreen() {
  const [tab, setTab] = useState<'events' | 'cycle'>('events')

  return (
    <div>
      <ScreenHeader title="情侶日曆" subtitle="重要日子與週期記錄" />

      <div className="px-4 mb-4">
        <div className="flex p-1 rounded-[var(--radius-xl)] bg-[var(--color-bg-muted)]">
          {([
            ['events', '紀念日'],
            ['cycle', '生理期'],
          ] as const).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={[
                'flex-1 py-2 text-sm font-semibold rounded-[var(--radius-lg)] transition-all',
                tab === key ? 'bg-[var(--color-surface)] shadow-sm' : 'text-muted',
              ].join(' ')}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {tab === 'events' ? <EventsTab /> : <CycleTab />}
    </div>
  )
}

function EventsTab() {
  const today = 16

  return (
    <div className="px-4 space-y-4 pb-4">
      <Card padding="md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold">2026 年 6 月</h3>
          <div className="flex gap-1">
            <button type="button" className="w-8 h-8 rounded-[var(--radius-md)] hover:bg-[var(--color-bg-muted)]">‹</button>
            <button type="button" className="w-8 h-8 rounded-[var(--radius-md)] hover:bg-[var(--color-bg-muted)]">›</button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted mb-2">
          {['日', '一', '二', '三', '四', '五', '六'].map((d) => (
            <span key={d}>{d}</span>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day) => (
            <motion.button
              key={day.date}
              type="button"
              whileTap={{ scale: 0.92 }}
              className={[
                'aspect-square rounded-[var(--radius-md)] text-sm font-medium relative flex flex-col items-center justify-center',
                day.date === today ? 'bg-primary text-[var(--color-primary-foreground)]' : 'hover:bg-[var(--color-bg-muted)]',
                day.otherMonth ? 'text-muted opacity-40' : '',
              ].join(' ')}
            >
              {day.date}
              {day.dots?.map((color, i) => (
                <span
                  key={i}
                  className="absolute bottom-1 w-1 h-1 rounded-full"
                  style={{ background: color, left: `calc(50% + ${(i - (day.dots!.length - 1) / 2) * 6}px)` }}
                />
              ))}
            </motion.button>
          ))}
        </div>
      </Card>

      <section>
        <h3 className="font-bold mb-3">即將到來</h3>
        <div className="space-y-2">
          {upcomingEvents.map((event) => (
            <Card key={event.id} padding="sm" className="flex items-center gap-3">
              <span className="text-2xl">{event.emoji}</span>
              <div className="flex-1">
                <p className="text-sm font-semibold">{event.title}</p>
                <p className="text-xs text-muted">{event.dateLabel}</p>
              </div>
              <Badge variant="primary">{event.daysLeft} 天後</Badge>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}

function CycleTab() {
  const { profile } = useApp()
  const { shareLogsWithPartner, sharePredictionWithPartner } = useCyclePrivacy()
  const [previewAsPartner, setPreviewAsPartner] = useState(false)

  const sharingLabel = (() => {
    if (shareLogsWithPartner && sharePredictionWithPartner) return `${profile.partnerName} 可查看全部`
    if (sharePredictionWithPartner) return `${profile.partnerName} 僅可查看預測`
    if (shareLogsWithPartner) return `${profile.partnerName} 僅可查看記錄`
    return '僅自己可見'
  })()

  const badgeVariant =
    shareLogsWithPartner || sharePredictionWithPartner ? 'success' : 'accent'

  return (
    <div className="px-4 space-y-4 pb-4">
      <div className="flex p-1 rounded-[var(--radius-xl)] bg-[var(--color-bg-muted)]">
        {([
          [false, '我的記錄'],
          [true, `預覽 ${profile.partnerName} 視角`],
        ] as const).map(([isPartner, label]) => (
          <button
            key={label}
            type="button"
            onClick={() => setPreviewAsPartner(isPartner)}
            className={[
              'flex-1 py-2 text-xs font-semibold rounded-[var(--radius-lg)] transition-all',
              previewAsPartner === isPartner ? 'bg-[var(--color-surface)] shadow-sm' : 'text-muted',
            ].join(' ')}
          >
            {label}
          </button>
        ))}
      </div>

      {!previewAsPartner ? (
        <>
          <Card padding="lg" className="hero-gradient border-none">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm text-muted mb-1">預測下次生理期</p>
                <p className="text-2xl font-bold">{cycleInfo.nextPredicted}</p>
                <p className="text-xs text-muted mt-2">平均週期 {cycleInfo.avgCycle} 天 · AI 監測中</p>
              </div>
              <Badge variant={badgeVariant}>{sharingLabel}</Badge>
            </div>
          </Card>

          <CyclePrivacyControls partnerName={profile.partnerName} compact />

          <Card padding="md">
            <h3 className="font-semibold mb-3">快速記錄</h3>
            <div className="grid grid-cols-2 gap-2">
              <button type="button" className="py-3 rounded-[var(--radius-lg)] bg-primary-soft font-semibold text-sm text-[var(--color-primary)]">
                開始生理期
              </button>
              <button type="button" className="py-3 rounded-[var(--radius-lg)] bg-[var(--color-bg-muted)] font-semibold text-sm">
                結束生理期
              </button>
            </div>
          </Card>

          <section>
            <h3 className="font-bold mb-3">最近紀錄</h3>
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
        </>
      ) : (
        <PartnerCycleView
          ownerName={profile.name}
          canViewLogs={shareLogsWithPartner}
          canViewPrediction={sharePredictionWithPartner}
        />
      )}

      <p className="text-xs text-muted text-center px-4 leading-relaxed">
        預測僅供參考，不構成醫療建議。使用上方開關決定 {profile.partnerName} 能否查看記錄或預測。
      </p>
    </div>
  )
}
