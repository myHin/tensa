export interface CheckInTemplateView {
  id: string
  slug: string
  emoji: string
  title: string
  subtitle: string
  description: string
  points: number
  schedule: string
  completedToday: boolean
  streak: number
}

export interface PointTransactionView {
  id: string
  label: string
  time: string
  amount: number
}

export interface RewardView {
  id: string
  emoji: string
  title: string
  description: string
  cost: number
}

export interface ActionResult {
  ok: boolean
  error?: string
  points?: number
  title?: string
}

export function translateDailyError(code: string | undefined) {
  const map: Record<string, string> = {
    NOT_AUTHENTICATED: '請先登入並完成配對',
    TEMPLATE_NOT_FOUND: '找不到此簽到項目',
    ALREADY_COMPLETED: '今天已完成',
    PHOTO_REQUIRED: '請上傳照片',
    REWARD_NOT_FOUND: '找不到獎勵',
    INSUFFICIENT_POINTS: '點數不足',
    USE_MEAL_FLOW: '請使用用餐打卡',
  }
  return map[code ?? ''] ?? '操作失敗，請稍後再試'
}
