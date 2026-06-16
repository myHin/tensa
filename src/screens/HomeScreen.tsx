import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { PointBadge } from '@/components/ui/PointBadge'
import { Button } from '@/components/ui/Button'
import { TodayMealStatus } from '@/components/meals/TodayMealStatus'
import { useApp } from '@/context/AppContext'
import { useMeals } from '@/context/MealContext'
import { checkInTemplates, upcomingEvents } from '@/data/mock'
import { mealTypeLabels } from '@/types/meal'

function getCheckInPath(id: string) {
  if (id === 'meal') return '/app/meals/check-in'
  return '/app/check-in-success'
}

export function HomeScreen() {
  const { profile, points } = useApp()
  const { records, hasCheckedInToday, getTodayMealByUser } = useMeals()
  const navigate = useNavigate()

  const userCheckedIn = hasCheckedInToday(profile.name)
  const userMeal = getTodayMealByUser(profile.name)
  const partnerMeal = getTodayMealByUser(profile.partnerName)

  const items = checkInTemplates.map((item) =>
    item.id === 'meal' ? { ...item, completedToday: userCheckedIn } : item,
  )
  const pending = items.filter((c) => !c.completedToday)
  const done = items.filter((c) => c.completedToday)
  const recentMeals = records.slice(0, 5)

  const mealSubtitle = userCheckedIn
    ? '你已分享今日餐點'
    : partnerMeal
      ? `${profile.partnerName} 已分享${mealTypeLabels[partnerMeal.mealType]} · 輪到你了`
      : '分享你今天吃了什麼'

  return (
    <div className="pb-4">
      <header className="hero-gradient px-4 pt-4 pb-6 safe-top rounded-b-[var(--radius-2xl)]">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm text-muted">早安，{profile.name} 👋</p>
            <h1 className="text-2xl font-bold mt-0.5">
              {profile.name} & {profile.partnerName}
            </h1>
          </div>
          <PointBadge points={points} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1"
        >
          <Badge variant="accent">🎉 紀念週限定</Badge>
          <Badge variant="warning">距紀念日 3 天</Badge>
        </motion.div>
      </header>

      <div className="px-4 -mt-3 space-y-4">
        <Card padding="md" hover className="cursor-pointer" onClick={() => navigate('/app/seasonal')}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-[var(--radius-lg)] bg-accent-soft flex items-center justify-center text-xl">
              ✨
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm">10 週年紀念週活動</p>
              <p className="text-xs text-muted truncate">限定小遊戲 · 雙倍點數</p>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </div>
        </Card>

        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold">今日簽到</h2>
            <span className="text-xs text-muted">{done.length}/{items.length} 完成</span>
          </div>

          <div className="space-y-2">
            {pending.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <CheckInRow
                  item={item}
                  mealSubtitle={item.id === 'meal' ? mealSubtitle : undefined}
                  onComplete={() => navigate(getCheckInPath(item.id))}
                />
              </motion.div>
            ))}
            {done.map((item) => (
              <CheckInRow
                key={item.id}
                item={item}
                mealSubtitle={item.id === 'meal' ? mealSubtitle : undefined}
                onView={item.id === 'meal' ? () => navigate('/app/meals/check-in') : undefined}
                onViewHistory={item.id === 'meal' ? () => navigate('/app/meals') : undefined}
              />
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold">今日吃了什麼</h2>
            <button
              type="button"
              onClick={() => navigate('/app/meals')}
              className="text-xs font-semibold text-[var(--color-primary)]"
            >
              查看全部
            </button>
          </div>

          <TodayMealStatus
            userName={profile.name}
            partnerName={profile.partnerName}
            userMeal={userMeal}
            partnerMeal={partnerMeal}
            compact
          />

          <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 mt-3">
            {!userCheckedIn && (
              <button
                type="button"
                onClick={() => navigate('/app/meals/check-in')}
                className="shrink-0 w-24 aspect-square rounded-[var(--radius-xl)] border-2 border-dashed border-[var(--color-primary)] bg-primary-soft flex flex-col items-center justify-center gap-1"
              >
                <span className="text-2xl">📷</span>
                <span className="text-[10px] font-semibold text-[var(--color-primary)]">分享我的</span>
              </button>
            )}
            {recentMeals.map((meal) => (
              <button
                key={meal.id}
                type="button"
                onClick={() => navigate('/app/meals')}
                className="shrink-0 w-24 aspect-square rounded-[var(--radius-xl)] overflow-hidden relative"
              >
                <img src={meal.photoUrl} alt={meal.caption} className="w-full h-full object-cover" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-1.5">
                  <p className="text-[9px] text-white font-semibold truncate">
                    {meal.uploadedBy} · {mealTypeLabels[meal.mealType]}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-bold mb-3">即將到來</h2>
          <div className="space-y-2">
            {upcomingEvents.slice(0, 3).map((event) => (
              <Card key={event.id} padding="sm" className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-[var(--radius-md)] flex items-center justify-center text-lg shrink-0"
                  style={{ background: event.color }}
                >
                  {event.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{event.title}</p>
                  <p className="text-xs text-muted">{event.dateLabel}</p>
                </div>
                <Badge variant="muted">{event.daysLeft} 天</Badge>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

interface CheckInItem {
  id: string
  emoji: string
  title: string
  subtitle: string
  points: number
  completedToday: boolean
  streak?: number
}

function CheckInRow({
  item,
  mealSubtitle,
  onComplete,
  onView,
  onViewHistory,
}: {
  item: CheckInItem
  mealSubtitle?: string
  onComplete?: () => void
  onView?: () => void
  onViewHistory?: () => void
}) {
  const subtitle = item.id === 'meal' && mealSubtitle ? mealSubtitle : item.subtitle

  return (
    <Card padding="sm" className="flex items-center gap-3">
      <div className="w-11 h-11 rounded-[var(--radius-lg)] bg-[var(--color-bg-muted)] flex items-center justify-center text-xl shrink-0">
        {item.emoji}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold ${item.completedToday ? 'line-through text-muted' : ''}`}>
          {item.title}
        </p>
        <p className="text-xs text-muted">{subtitle}</p>
      </div>
      {item.completedToday ? (
        onViewHistory ? (
          <div className="flex gap-1 shrink-0">
            {onView && (
              <Button size="sm" variant="secondary" onClick={onView}>
                詳情
              </Button>
            )}
            <Button size="sm" variant="ghost" onClick={onViewHistory}>
              紀錄
            </Button>
          </div>
        ) : (
          <Badge variant="success">已完成</Badge>
        )
      ) : (
        <Button size="sm" onClick={onComplete}>
          {item.id === 'meal' ? '分享' : `+${item.points}`}
        </Button>
      )}
    </Card>
  )
}
