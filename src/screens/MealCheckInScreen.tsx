import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ScreenHeader } from '@/components/layout/ScreenHeader'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { TodayMealStatus } from '@/components/meals/TodayMealStatus'
import { useApp } from '@/context/AppContext'
import { useAuth } from '@/context/AuthContext'
import { useCouple } from '@/context/CoupleContext'
import { useMeals } from '@/context/MealContext'
import { translateDailyError } from '@/types/daily'
import { mealTypeEmoji, mealTypeLabels, type MealType } from '@/types/meal'

const mealTypes: MealType[] = ['breakfast', 'lunch', 'dinner', 'snack']

const defaultCaptions: Record<MealType, string> = {
  breakfast: '我的早餐',
  lunch: '我的午餐',
  dinner: '我的晚餐',
  snack: '我的宵夜',
}

export function MealCheckInScreen() {
  const navigate = useNavigate()
  const { profile } = useApp()
  const { user } = useAuth()
  const { partner } = useCouple()
  const { submitMeal, hasCheckedInToday, getTodayMealByUser } = useMeals()
  const fileRef = useRef<HTMLInputElement>(null)

  const userId = user?.id ?? ''
  const partnerId = partner?.id

  const userCheckedIn = hasCheckedInToday(userId)
  const userMeal = getTodayMealByUser(userId)
  const partnerMeal = partnerId ? getTodayMealByUser(partnerId) : undefined

  const [preview, setPreview] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [caption, setCaption] = useState('')
  const [mealType, setMealType] = useState<MealType>('lunch')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleFileSelect(selected: File | null) {
    if (!selected) return
    if (preview) URL.revokeObjectURL(preview)
    setFile(selected)
    setPreview(URL.createObjectURL(selected))
    setError(null)
  }

  function clearPhoto() {
    if (preview) URL.revokeObjectURL(preview)
    setPreview(null)
    setFile(null)
    if (fileRef.current) fileRef.current.value = ''
  }

  async function handleSubmit() {
    if (!file) return
    setSubmitting(true)
    setError(null)
    const finalCaption = caption.trim() || defaultCaptions[mealType]

    try {
      const result = await submitMeal(file, finalCaption, mealType)
      if (result.ok) {
        navigate('/app/check-in-success', {
          state: {
            type: 'meal',
            mealType,
            caption: finalCaption,
            partnerName: profile.partnerName,
            partnerShared: !!partnerMeal,
            points: result.points ?? 30,
          },
        })
      } else {
        setError(translateDailyError(result.error))
      }
    } catch {
      setError('上傳失敗，請稍後再試')
    } finally {
      setSubmitting(false)
    }
  }

  if (userCheckedIn && userMeal) {
    return (
      <div className="pb-6">
        <ScreenHeader title="每日一餐" subtitle="你已分享今日餐點" backTo="/app/home" />
        <div className="px-4 space-y-4">
          <div className="text-center py-4">
            <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-success-soft flex items-center justify-center text-2xl">
              ✓
            </div>
            <p className="font-semibold">今天已分享</p>
            <p className="text-sm text-muted mt-1">
              {partnerMeal
                ? `${profile.partnerName} 也分享了，去看看彼此吃了什麼`
                : `等 ${profile.partnerName} 分享今天的餐點吧`}
            </p>
          </div>

          <Card padding="none" className="overflow-hidden">
            <img src={userMeal.photoUrl} alt={userMeal.caption} className="w-full aspect-[4/3] object-cover" />
            <div className="p-3">
              <Badge variant="primary">{mealTypeLabels[userMeal.mealType]}</Badge>
              <p className="font-semibold mt-2">{userMeal.caption}</p>
              <p className="text-xs text-muted">{userMeal.time} · 你的分享</p>
            </div>
          </Card>

          <TodayMealStatus
            userName={profile.name}
            partnerName={profile.partnerName}
            userMeal={userMeal}
            partnerMeal={partnerMeal}
          />

          <Button fullWidth onClick={() => navigate('/app/meals')}>
            查看彼此用餐紀錄
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="pb-6">
      <ScreenHeader
        title="每日一餐"
        subtitle="分享你今天吃了什麼"
        backTo="/app/home"
        action={
          <button
            type="button"
            onClick={() => navigate('/app/meals')}
            className="text-sm font-semibold text-[var(--color-primary)]"
          >
            紀錄
          </button>
        }
      />

      <div className="px-4 space-y-4">
        <TodayMealStatus
          userName={profile.name}
          partnerName={profile.partnerName}
          userMeal={userMeal}
          partnerMeal={partnerMeal}
        />

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => handleFileSelect(e.target.files?.[0] ?? null)}
        />

        {!preview ? (
          <motion.button
            type="button"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => fileRef.current?.click()}
            className="w-full aspect-[4/3] rounded-[var(--radius-2xl)] border-2 border-dashed border-[var(--color-primary)] bg-primary-soft flex flex-col items-center justify-center gap-3 transition-colors hover:bg-[color-mix(in_srgb,var(--color-primary-soft)_80%,var(--color-primary)_20%)]"
          >
            <div className="w-16 h-16 rounded-full bg-[var(--color-surface)] flex items-center justify-center text-3xl shadow-sm">
              📷
            </div>
            <div className="text-center px-4">
              <p className="font-semibold text-[var(--color-primary)]">上傳你的餐點照片</p>
              <p className="text-xs text-muted mt-1">分開上班、各自用餐也可以分享</p>
            </div>
          </motion.button>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative rounded-[var(--radius-2xl)] overflow-hidden aspect-[4/3] card-surface p-0 border-none"
          >
            <img src={preview} alt="餐點預覽" className="w-full h-full object-cover" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4 pt-12">
              <Badge variant="primary">+30 點</Badge>
            </div>
            <button
              type="button"
              onClick={clearPhoto}
              className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center backdrop-blur-sm"
              aria-label="移除照片"
            >
              ✕
            </button>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="absolute top-3 left-3 px-3 py-1.5 rounded-full bg-black/50 text-white text-xs font-semibold backdrop-blur-sm"
            >
              更換
            </button>
          </motion.div>
        )}

        <section>
          <p className="text-sm font-medium mb-2">餐別</p>
          <div className="grid grid-cols-4 gap-2">
            {mealTypes.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setMealType(type)}
                className={[
                  'flex flex-col items-center gap-1 py-2.5 rounded-[var(--radius-lg)] text-xs font-semibold transition-all',
                  mealType === type
                    ? 'bg-primary-soft text-[var(--color-primary)] ring-2 ring-[var(--color-primary)]'
                    : 'bg-[var(--color-bg-muted)] text-muted',
                ].join(' ')}
              >
                <span className="text-lg">{mealTypeEmoji[type]}</span>
                {mealTypeLabels[type]}
              </button>
            ))}
          </div>
        </section>

        <Input
          label="備註（選填）"
          placeholder="例如：公司便當、外賣粉麵、自己帶飯…"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />

        {error && <p className="text-sm text-[var(--color-danger)]">{error}</p>}

        <Card padding="sm" className="bg-[var(--color-bg-muted)] border-none">
          <p className="text-xs text-muted leading-relaxed">
            不用一起吃也可以打卡 — 各自上傳今天的一餐，讓對方知道你在忙什麼、吃了什麼。每人每天分享一次即可賺點數。
          </p>
        </Card>

        <Button
          fullWidth
          size="lg"
          disabled={!file || submitting}
          loading={submitting}
          onClick={handleSubmit}
        >
          分享我的餐點 · +30 點
        </Button>
      </div>
    </div>
  )
}
