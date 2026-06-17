import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ScreenHeader } from '@/components/layout/ScreenHeader'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { TodayMealStatus } from '@/components/meals/TodayMealStatus'
import { useApp } from '@/context/AppContext'
import { useAuth } from '@/context/AuthContext'
import { useCouple } from '@/context/CoupleContext'
import { useCheckIns } from '@/context/CheckInContext'
import { useMeals } from '@/context/MealContext'
import { translateDailyError } from '@/types/daily'
import { mealTypeLabels } from '@/types/meal'

export function CheckInsScreen() {
  const navigate = useNavigate()
  const { profile } = useApp()
  const { user } = useAuth()
  const { partner } = useCouple()
  const { templates, loading, completeCheckInBySlug } = useCheckIns()
  const { hasCheckedInToday, getTodayMealByUser } = useMeals()
  const [filter, setFilter] = useState<'all' | 'pending' | 'done'>('all')
  const [busySlug, setBusySlug] = useState<string | null>(null)

  const userId = user?.id ?? ''
  const partnerId = partner?.id

  const userCheckedIn = hasCheckedInToday(userId)
  const userMeal = getTodayMealByUser(userId)
  const partnerMeal = partnerId ? getTodayMealByUser(partnerId) : undefined

  const items = templates.map((item) =>
    item.slug === 'meal' ? { ...item, completedToday: userCheckedIn } : item,
  )

  const filtered = items.filter((c) => {
    if (filter === 'pending') return !c.completedToday
    if (filter === 'done') return c.completedToday
    return true
  })

  async function handleComplete(slug: string) {
    if (slug === 'meal') {
      navigate('/app/meals/check-in')
      return
    }

    setBusySlug(slug)
    try {
      const result = await completeCheckInBySlug(slug)
      if (result.ok) {
        navigate('/app/check-in-success', {
          state: {
            type: 'check-in',
            title: result.title,
            points: result.points,
          },
        })
      } else {
        alert(translateDailyError(result.error))
      }
    } finally {
      setBusySlug(null)
    }
  }

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
        {loading && items.length === 0 ? (
          <p className="text-sm text-muted text-center py-8">載入中…</p>
        ) : null}

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
                    {item.slug === 'meal'
                      ? '各自分享今天的一餐，不用一起吃也可以'
                      : item.description}
                  </p>
                  {item.slug === 'meal' && (
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
              {item.slug === 'meal' && (
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
                  loading={busySlug === item.slug}
                  disabled={busySlug === item.slug}
                  onClick={() => handleComplete(item.slug)}
                >
                  {item.slug === 'meal'
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
