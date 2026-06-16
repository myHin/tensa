import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ScreenHeader } from '@/components/layout/ScreenHeader'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { TodayMealStatus } from '@/components/meals/TodayMealStatus'
import { useApp } from '@/context/AppContext'
import { checkInTemplates } from '@/data/mock'
import { useMeals } from '@/context/MealContext'
import { mealTypeLabels } from '@/types/meal'

function getCheckInPath(id: string) {
  if (id === 'meal') return '/app/meals/check-in'
  return '/app/check-in-success'
}

export function CheckInsScreen() {
  const navigate = useNavigate()
  const { profile } = useApp()
  const { hasCheckedInToday, getTodayMealByUser } = useMeals()
  const [filter, setFilter] = useState<'all' | 'pending' | 'done'>('all')

  const userCheckedIn = hasCheckedInToday(profile.name)
  const userMeal = getTodayMealByUser(profile.name)
  const partnerMeal = getTodayMealByUser(profile.partnerName)

  const items = checkInTemplates.map((item) =>
    item.id === 'meal' ? { ...item, completedToday: userCheckedIn } : item,
  )

  const filtered = items.filter((c) => {
    if (filter === 'pending') return !c.completedToday
    if (filter === 'done') return c.completedToday
    return true
  })

  return (
    <div>
      <ScreenHeader
        title="簽到"
        subtitle="自訂你們的日常習慣"
        action={
          <Button size="sm" variant="secondary">
            + 新增
          </Button>
        }
      />

      <div className="px-4 mb-4 flex gap-2">
        {([
          ['all', '全部'],
          ['pending', '待完成'],
          ['done', '已完成'],
        ] as const).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setFilter(key)}
            className={[
              'px-3 py-1.5 text-xs font-semibold rounded-full transition-colors',
              filter === key ? 'bg-primary-soft text-[var(--color-primary)]' : 'bg-[var(--color-bg-muted)] text-muted',
            ].join(' ')}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="px-4 space-y-3 pb-4">
        {filtered.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
          >
            <Card padding="md" hover>
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-[var(--radius-xl)] bg-[var(--color-bg-muted)] flex items-center justify-center text-2xl">
                  {item.emoji}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="font-semibold">{item.title}</h3>
                    {item.completedToday && <Badge variant="success">你已分享</Badge>}
                  </div>
                  <p className="text-sm text-muted mb-2">
                    {item.id === 'meal'
                      ? '各自分享今天的一餐，不用一起吃也可以'
                      : item.description}
                  </p>
                  {item.id === 'meal' && (
                    <TodayMealStatus
                      userName={profile.name}
                      partnerName={profile.partnerName}
                      userMeal={userMeal}
                      partnerMeal={partnerMeal}
                      compact
                    />
                  )}
                  <div className="flex items-center gap-2 flex-wrap mt-2">
                    <Badge variant="primary">+{item.points} 點</Badge>
                    {item.streak ? (
                      <Badge variant="accent">🔥 {item.streak} 天連續</Badge>
                    ) : null}
                    <Badge variant="muted">{item.schedule}</Badge>
                  </div>
                </div>
              </div>
              {item.id === 'meal' && (
                <Button
                  variant="ghost"
                  fullWidth
                  className="mt-2"
                  onClick={() => navigate('/app/meals')}
                >
                  查看彼此用餐紀錄
                </Button>
              )}
              {!item.completedToday && (
                <Button
                  fullWidth
                  className="mt-3"
                  onClick={() => navigate(getCheckInPath(item.id))}
                >
                  {item.id === 'meal'
                    ? partnerMeal
                      ? `分享我的${mealTypeLabels.lunch}`
                      : '分享我的餐點'
                    : '完成簽到'}
                </Button>
              )}
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
