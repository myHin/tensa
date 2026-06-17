import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ScreenHeader } from '@/components/layout/ScreenHeader'
import { Badge } from '@/components/ui/Badge'
import { useMeals } from '@/context/MealContext'
import { mealTypeEmoji, mealTypeLabels, type MealRecord } from '@/types/meal'

type ViewMode = 'grid' | 'list'

export function MealHistoryScreen() {
  const { records, loading } = useMeals()
  const [view, setView] = useState<ViewMode>('grid')
  const [selected, setSelected] = useState<MealRecord | null>(null)

  const grouped = useMemo(() => {
    const map = new Map<string, MealRecord[]>()
    for (const record of records) {
      const key = record.dateLabel
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(record)
    }
    return Array.from(map.entries())
  }, [records])

  return (
    <div className="pb-6">
      <ScreenHeader
        title="用餐紀錄"
        subtitle="看看彼此吃了什麼"
        backTo="/app/home"
        action={<ViewToggle view={view} onChange={setView} />}
      />

      <div className="px-4 space-y-5">
        {loading && records.length === 0 ? (
          <p className="text-sm text-muted text-center py-8">載入中…</p>
        ) : null}
        {grouped.map(([dateLabel, items]) => (
          <section key={dateLabel}>
            <div className="flex items-center gap-2 mb-3">
              <h2 className="font-bold text-sm">{dateLabel}</h2>
              <span className="text-xs text-muted">{items.length} 餐</span>
            </div>

            {view === 'grid' ? (
              <div className="grid grid-cols-2 gap-2">
                {items.map((record, i) => (
                  <MealGridCard
                    key={record.id}
                    record={record}
                    index={i}
                    onClick={() => setSelected(record)}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {items.map((record, i) => (
                  <MealListRow
                    key={record.id}
                    record={record}
                    index={i}
                    onClick={() => setSelected(record)}
                  />
                ))}
              </div>
            )}
          </section>
        ))}
      </div>

      <AnimatePresence>
        {selected && (
          <MealDetailModal record={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </div>
  )
}

function ViewToggle({ view, onChange }: { view: ViewMode; onChange: (v: ViewMode) => void }) {
  return (
    <div className="flex p-0.5 rounded-[var(--radius-md)] bg-[var(--color-bg-muted)]">
      {(['grid', 'list'] as const).map((mode) => (
        <button
          key={mode}
          type="button"
          onClick={() => onChange(mode)}
          className={[
            'px-2 py-1 rounded-[var(--radius-sm)] transition-colors',
            view === mode ? 'bg-[var(--color-surface)] shadow-sm' : 'text-muted',
          ].join(' ')}
          aria-label={mode === 'grid' ? '網格檢視' : '列表檢視'}
        >
          {mode === 'grid' ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
            </svg>
          )}
        </button>
      ))}
    </div>
  )
}

function MealGridCard({
  record,
  index,
  onClick,
}: {
  record: MealRecord
  index: number
  onClick: () => void
}) {
  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.04 }}
      onClick={onClick}
      className="relative aspect-square rounded-[var(--radius-xl)] overflow-hidden text-left group"
    >
      <img src={record.photoUrl} alt={record.caption} className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-90" />
      <div className="absolute inset-x-0 bottom-0 p-2.5">
        <Badge variant="muted" size="sm">
          {record.uploadedBy} · {mealTypeEmoji[record.mealType]} {mealTypeLabels[record.mealType]}
        </Badge>
        <p className="text-white text-xs font-semibold mt-1 line-clamp-2">{record.caption}</p>
        <p className="text-white/70 text-[10px] mt-0.5">{record.uploadedBy} · {record.time}</p>
      </div>
    </motion.button>
  )
}

function MealListRow({
  record,
  index,
  onClick,
}: {
  record: MealRecord
  index: number
  onClick: () => void
}) {
  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04 }}
      onClick={onClick}
      className="w-full flex items-center gap-3 p-2 rounded-[var(--radius-xl)] card-surface text-left"
    >
      <img
        src={record.photoUrl}
        alt={record.caption}
        className="w-16 h-16 rounded-[var(--radius-lg)] object-cover shrink-0"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <Badge variant="primary" size="sm">
            {mealTypeLabels[record.mealType]}
          </Badge>
          <span className="text-[10px] text-muted">{record.time}</span>
        </div>
        <p className="text-sm font-semibold truncate">{record.caption}</p>
        <p className="text-xs text-muted">{record.uploadedBy} · +{record.points} 點</p>
      </div>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="2">
        <path d="M9 18l6-6-6-6" />
      </svg>
    </motion.button>
  )
}

function MealDetailModal({ record, onClose }: { record: MealRecord; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex flex-col bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 320 }}
        className="mt-auto max-h-[92dvh] w-full max-w-[480px] mx-auto rounded-t-[var(--radius-2xl)] overflow-hidden bg-[var(--color-bg)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative aspect-[4/3]">
          <img src={record.photoUrl} alt={record.caption} className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center"
            aria-label="關閉"
          >
            ✕
          </button>
        </div>

        <div className="p-4 safe-bottom">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <Badge variant="primary">
              {mealTypeEmoji[record.mealType]} {mealTypeLabels[record.mealType]}
            </Badge>
            <Badge variant="success">+{record.points} 點</Badge>
          </div>
          <h2 className="text-lg font-bold mb-1">{record.caption}</h2>
          <p className="text-sm text-muted mb-4">
            {record.dateLabel} · {record.time} · {record.uploadedBy} 上傳
          </p>
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 rounded-[var(--radius-lg)] bg-[var(--color-bg-muted)] font-semibold text-sm"
          >
            關閉
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
