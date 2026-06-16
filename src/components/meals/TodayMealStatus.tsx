import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import type { MealRecord } from '@/types/meal'
import { mealTypeLabels } from '@/types/meal'

interface TodayMealStatusProps {
  userName: string
  partnerName: string
  userMeal?: MealRecord
  partnerMeal?: MealRecord
  compact?: boolean
}

export function TodayMealStatus({
  userName,
  partnerName,
  userMeal,
  partnerMeal,
  compact,
}: TodayMealStatusProps) {
  if (compact) {
    return (
      <div className="flex flex-wrap gap-1.5">
        <StatusChip
          name={userName}
          done={!!userMeal}
          mealType={userMeal?.mealType}
          isSelf
        />
        <StatusChip
          name={partnerName}
          done={!!partnerMeal}
          mealType={partnerMeal?.mealType}
        />
      </div>
    )
  }

  return (
    <Card padding="sm" className="bg-[var(--color-bg-muted)] border-none space-y-2">
      <p className="text-xs font-semibold text-muted">今日分享狀態</p>
      <div className="grid grid-cols-2 gap-2">
        <PersonStatus name={userName} meal={userMeal} isSelf />
        <PersonStatus name={partnerName} meal={partnerMeal} />
      </div>
    </Card>
  )
}

function StatusChip({
  name,
  done,
  mealType,
  isSelf,
}: {
  name: string
  done: boolean
  mealType?: MealRecord['mealType']
  isSelf?: boolean
}) {
  return (
    <Badge variant={done ? 'success' : 'muted'} size="sm">
      {done
        ? `${isSelf ? '你' : name} · ${mealType ? mealTypeLabels[mealType] : '已分享'}`
        : `${isSelf ? '你' : name} 還沒分享`}
    </Badge>
  )
}

function PersonStatus({
  name,
  meal,
  isSelf,
}: {
  name: string
  meal?: MealRecord
  isSelf?: boolean
}) {
  if (!meal) {
    return (
      <div className="p-2.5 rounded-[var(--radius-lg)] bg-[var(--color-surface)] border border-dashed border-[var(--color-border)] text-center">
        <p className="text-xs font-semibold text-muted">{isSelf ? '你' : name}</p>
        <p className="text-[10px] text-muted mt-0.5">尚未分享</p>
      </div>
    )
  }

  return (
    <div className="p-2 rounded-[var(--radius-lg)] bg-[var(--color-surface)] overflow-hidden">
      <img src={meal.photoUrl} alt={meal.caption} className="w-full aspect-[4/3] rounded-[var(--radius-md)] object-cover mb-1.5" />
      <p className="text-[10px] font-semibold truncate">{isSelf ? '你' : name} · {mealTypeLabels[meal.mealType]}</p>
      <p className="text-[10px] text-muted truncate">{meal.caption}</p>
    </div>
  )
}
