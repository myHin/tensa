export interface CycleLogView {
  id: string
  startDate: string
  endDate: string | null
  range: string
  duration: number | null
  cycleLength: number | null
  note: string
}

export interface CyclePrediction {
  avgCycle: number
  nextPredicted: string | null
  nextPredictedDate: string | null
}

export interface PartnerCycleSnapshot {
  hasPartner: boolean
  shared: boolean
  shareLogs: boolean
  sharePrediction: boolean
  prediction: CyclePrediction | null
  logs: CycleLogView[]
}

export interface CycleActionResult {
  ok: boolean
  error?: string
}

export function translateCycleError(code: string | undefined) {
  const map: Record<string, string> = {
    NOT_AUTHENTICATED: '請先登入並完成配對',
    NOT_AVAILABLE: '此帳號不支援生理期記錄',
    ALREADY_ACTIVE: '已有進行中的生理期，請先結束或編輯該筆紀錄',
    NO_ACTIVE_PERIOD: '沒有進行中的生理期可結束',
    START_REQUIRED: '請選擇開始日期',
    START_IN_FUTURE: '開始日期不能是未來',
    END_IN_FUTURE: '結束日期不能是未來',
    INVALID_RANGE: '結束日期不能早於開始日期',
    OVERLAP: '日期與其他紀錄重疊，請調整',
    NOT_FOUND: '找不到這筆紀錄',
  }
  return map[code ?? ''] ?? '操作失敗，請稍後再試'
}

export function formatDateShort(dateStr: string) {
  const [, month, day] = dateStr.split('-')
  return `${Number(month)}/${Number(day)}`
}

export function formatDateRange(startDate: string, endDate: string | null) {
  if (!endDate) return `${formatDateShort(startDate)} – 進行中`
  return `${formatDateShort(startDate)} – ${formatDateShort(endDate)}`
}

export function formatPredictionLabel(dateStr: string | null) {
  if (!dateStr) return '資料不足'
  const date = new Date(`${dateStr}T00:00:00`)
  return date.toLocaleDateString('zh-Hant', { month: 'long', day: 'numeric' })
}

export function computeDuration(startDate: string, endDate: string | null) {
  if (!endDate) return null
  const start = new Date(`${startDate}T00:00:00`)
  const end = new Date(`${endDate}T00:00:00`)
  return Math.round((end.getTime() - start.getTime()) / 86400000) + 1
}

export function computeCycleLength(
  startDate: string,
  previousStartDate: string | undefined,
) {
  if (!previousStartDate) return null
  const start = new Date(`${startDate}T00:00:00`)
  const prev = new Date(`${previousStartDate}T00:00:00`)
  return Math.round((start.getTime() - prev.getTime()) / 86400000)
}
