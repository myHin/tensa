import { useEffect, useState, type FormEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import type { CycleLogView } from '@/types/cycle'
import { translateCycleError } from '@/types/cycle'

export interface CyclePeriodFormValues {
  startDate: string
  endDate: string
  ongoing: boolean
  note: string
}

interface CyclePeriodEditorProps {
  open: boolean
  record?: CycleLogView | null
  busy?: boolean
  onClose: () => void
  onSave: (values: CyclePeriodFormValues) => Promise<{ ok: boolean; error?: string }>
  onDelete?: (id: string) => Promise<{ ok: boolean; error?: string }>
}

function todayInputValue() {
  return new Date().toISOString().slice(0, 10)
}

function toFormValues(record?: CycleLogView | null): CyclePeriodFormValues {
  if (!record) {
    return { startDate: todayInputValue(), endDate: '', ongoing: false, note: '' }
  }
  return {
    startDate: record.startDate,
    endDate: record.endDate ?? '',
    ongoing: !record.endDate,
    note: record.note,
  }
}

export function CyclePeriodEditor({
  open,
  record,
  busy,
  onClose,
  onSave,
  onDelete,
}: CyclePeriodEditorProps) {
  const isEdit = Boolean(record)
  const [values, setValues] = useState<CyclePeriodFormValues>(() => toFormValues(record))
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      setValues(toFormValues(record))
      setError(null)
    }
  }, [open, record])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)

    if (!values.startDate) {
      setError('請選擇開始日期')
      return
    }

    if (!values.ongoing && !values.endDate) {
      setError('請選擇結束日期，或勾選「仍在進行中」')
      return
    }

    if (!values.ongoing && values.endDate < values.startDate) {
      setError('結束日期不能早於開始日期')
      return
    }

    const result = await onSave(values)
    if (result.ok) {
      onClose()
    } else {
      setError(translateCycleError(result.error))
    }
  }

  async function handleDelete() {
    if (!record || !onDelete) return
    if (!confirm('確定要刪除這筆紀錄嗎？')) return

    const result = await onDelete(record.id)
    if (result.ok) {
      onClose()
    } else {
      setError(translateCycleError(result.error))
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
            className="w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <Card padding="md" className="space-y-4">
              <div>
                <h2 className="text-lg font-bold">{isEdit ? '編輯紀錄' : '補登紀錄'}</h2>
                <p className="text-xs text-muted mt-1 leading-relaxed">
                  可補登過往月份，或修正忘記開始／結束的日期。
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                <Input
                  label="開始日期"
                  type="date"
                  value={values.startDate}
                  max={todayInputValue()}
                  onChange={(e) => setValues((v) => ({ ...v, startDate: e.target.value }))}
                  required
                />

                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={values.ongoing}
                    onChange={(e) =>
                      setValues((v) => ({
                        ...v,
                        ongoing: e.target.checked,
                        endDate: e.target.checked ? '' : v.endDate,
                      }))
                    }
                    className="rounded border-[var(--color-border)]"
                  />
                  仍在進行中（尚未結束）
                </label>

                {!values.ongoing && (
                  <Input
                    label="結束日期"
                    type="date"
                    value={values.endDate}
                    min={values.startDate || undefined}
                    max={todayInputValue()}
                    onChange={(e) => setValues((v) => ({ ...v, endDate: e.target.value }))}
                  />
                )}

                <Input
                  label="備註（選填）"
                  placeholder="例如：週期偏短、旅行中…"
                  value={values.note}
                  onChange={(e) => setValues((v) => ({ ...v, note: e.target.value }))}
                />

                {error && <p className="text-sm text-red-500">{error}</p>}

                <div className="flex gap-2 pt-1">
                  <Button type="button" variant="secondary" fullWidth onClick={onClose} disabled={busy}>
                    取消
                  </Button>
                  <Button type="submit" fullWidth loading={busy} disabled={busy}>
                    儲存
                  </Button>
                </div>

                {isEdit && onDelete && (
                  <Button
                    type="button"
                    variant="ghost"
                    fullWidth
                    className="text-red-500"
                    disabled={busy}
                    onClick={handleDelete}
                  >
                    刪除這筆紀錄
                  </Button>
                )}
              </form>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
