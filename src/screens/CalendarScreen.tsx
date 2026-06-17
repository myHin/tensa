import { useState } from 'react'
import { motion } from 'framer-motion'
import { ScreenHeader } from '@/components/layout/ScreenHeader'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { CyclePrivacyControls } from '@/components/cycle/CyclePrivacyControls'
import { CyclePeriodEditor } from '@/components/cycle/CyclePeriodEditor'
import { PartnerCycleView } from '@/components/cycle/PartnerCycleView'
import { useApp } from '@/context/AppContext'
import { useCycle } from '@/context/CycleContext'
import { translateCycleError, type CycleLogView } from '@/types/cycle'
import { calendarDays, upcomingEvents } from '@/data/mock'

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
  const {
    canTrackOwnCycle,
    shareLogsWithPartner,
    sharePredictionWithPartner,
    logs,
    prediction,
    partnerSnapshot,
    hasActivePeriod,
    loading,
    busy,
    startPeriod,
    endPeriod,
    savePeriod,
    deletePeriod,
  } = useCycle()
  const [previewAsPartner, setPreviewAsPartner] = useState(false)
  const [editorOpen, setEditorOpen] = useState(false)
  const [editingRecord, setEditingRecord] = useState<CycleLogView | null>(null)

  function openAddEditor() {
    setEditingRecord(null)
    setEditorOpen(true)
  }

  function openEditEditor(record: CycleLogView) {
    setEditingRecord(record)
    setEditorOpen(true)
  }

  function closeEditor() {
    setEditorOpen(false)
    setEditingRecord(null)
  }

  const sharingLabel = (() => {
    if (shareLogsWithPartner && sharePredictionWithPartner) return `${profile.partnerName} 可查看全部`
    if (sharePredictionWithPartner) return `${profile.partnerName} 僅可查看預測`
    if (shareLogsWithPartner) return `${profile.partnerName} 僅可查看記錄`
    return '僅自己可見'
  })()

  const badgeVariant =
    shareLogsWithPartner || sharePredictionWithPartner ? 'success' : 'accent'

  async function handleStart() {
    const result = await startPeriod()
    if (!result.ok) alert(translateCycleError(result.error))
  }

  async function handleEnd() {
    const result = await endPeriod()
    if (!result.ok) alert(translateCycleError(result.error))
  }

  if (!canTrackOwnCycle) {
    return (
      <div className="px-4 space-y-4 pb-4">
        <Card padding="lg" className="bg-[var(--color-bg-muted)] border-none text-center">
          <div className="text-3xl mb-3">📅</div>
          <p className="font-semibold mb-1">你不需要記錄生理期</p>
          <p className="text-sm text-muted leading-relaxed">
            此功能供女性用戶記錄週期。若 {profile.partnerName} 有分享，可在下方查看。
          </p>
        </Card>

        {loading ? (
          <p className="text-sm text-muted text-center py-4">載入中…</p>
        ) : partnerSnapshot?.shared ? (
          <section>
            <h3 className="font-bold mb-3">{profile.partnerName} 分享的</h3>
            <PartnerCycleView
              ownerName={profile.partnerName}
              canViewLogs={partnerSnapshot.shareLogs}
              canViewPrediction={partnerSnapshot.sharePrediction}
              logs={partnerSnapshot.logs}
              prediction={partnerSnapshot.prediction}
            />
          </section>
        ) : (
          <Card padding="md" className="bg-[var(--color-bg-muted)] border-none text-center">
            <p className="text-sm text-muted">{profile.partnerName} 尚未分享週期資料</p>
          </Card>
        )}
      </div>
    )
  }

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
                <p className="text-2xl font-bold">
                  {loading ? '…' : prediction.nextPredicted ?? '資料不足'}
                </p>
                <p className="text-xs text-muted mt-2">
                  平均週期 {prediction.avgCycle} 天
                  {hasActivePeriod ? ' · 進行中' : ' · 依你的紀錄計算'}
                </p>
              </div>
              <Badge variant={badgeVariant}>{sharingLabel}</Badge>
            </div>
          </Card>

          <CyclePrivacyControls partnerName={profile.partnerName} compact />

          <Card padding="md">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">快速記錄</h3>
              <button
                type="button"
                onClick={openAddEditor}
                className="text-xs font-semibold text-[var(--color-primary)]"
              >
                補登紀錄
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                disabled={busy || hasActivePeriod}
                onClick={handleStart}
                className="py-3 rounded-[var(--radius-lg)] bg-primary-soft font-semibold text-sm text-[var(--color-primary)] disabled:opacity-50"
              >
                開始生理期
              </button>
              <button
                type="button"
                disabled={busy || !hasActivePeriod}
                onClick={handleEnd}
                className="py-3 rounded-[var(--radius-lg)] bg-[var(--color-bg-muted)] font-semibold text-sm disabled:opacity-50"
              >
                結束生理期
              </button>
            </div>
          </Card>

          <section>
            <h3 className="font-bold mb-3">最近紀錄</h3>
            {loading && logs.length === 0 ? (
              <p className="text-sm text-muted text-center py-4">載入中…</p>
            ) : logs.length === 0 ? (
              <Card padding="md" className="bg-[var(--color-bg-muted)] border-none text-center space-y-3">
                <p className="text-sm text-muted">尚無紀錄</p>
                <Button size="sm" variant="secondary" onClick={openAddEditor}>
                  補登過往紀錄
                </Button>
              </Card>
            ) : (
              logs.map((log) => (
                <button
                  key={log.id}
                  type="button"
                  onClick={() => openEditEditor(log)}
                  className="w-full text-left mb-2"
                >
                  <Card padding="sm" hover className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium">{log.range}</p>
                      <p className="text-xs text-muted">
                        {log.duration ? `${log.duration} 天` : '進行中'}
                        {log.cycleLength ? ` · ${log.cycleLength} 天週期` : ''}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {log.note && <Badge variant="muted">{log.note}</Badge>}
                      <span className="text-xs text-[var(--color-primary)] font-semibold">編輯</span>
                    </div>
                  </Card>
                </button>
              ))
            )}
          </section>

          {partnerSnapshot?.shared ? (
            <section>
              <h3 className="font-bold mb-3">{profile.partnerName} 分享的</h3>
              <PartnerCycleView
                ownerName={profile.partnerName}
                canViewLogs={partnerSnapshot.shareLogs}
                canViewPrediction={partnerSnapshot.sharePrediction}
                logs={partnerSnapshot.logs}
                prediction={partnerSnapshot.prediction}
              />
            </section>
          ) : null}
        </>
      ) : (
        <PartnerCycleView
          ownerName={profile.name}
          canViewLogs={shareLogsWithPartner}
          canViewPrediction={sharePredictionWithPartner}
          logs={logs}
          prediction={prediction}
        />
      )}

      <p className="text-xs text-muted text-center px-4 leading-relaxed">
        預測僅供參考，不構成醫療建議。使用上方開關決定 {profile.partnerName} 能否查看記錄或預測。
      </p>

      <CyclePeriodEditor
        open={editorOpen}
        record={editingRecord}
        busy={busy}
        onClose={closeEditor}
        onSave={async (values) =>
          savePeriod({
            id: editingRecord?.id,
            startDate: values.startDate,
            endDate: values.ongoing ? null : values.endDate || null,
            note: values.note,
          })
        }
        onDelete={editingRecord ? deletePeriod : undefined}
      />
    </div>
  )
}
