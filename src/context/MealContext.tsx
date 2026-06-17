import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { useAuth } from '@/context/AuthContext'
import { useCouple } from '@/context/CoupleContext'
import { useCheckIns } from '@/context/CheckInContext'
import { usePoints } from '@/context/PointsContext'
import {
  formatDateLabel,
  formatTime,
  getMealPhotoUrl,
  seedCoupleDefaults,
  submitMealRecord,
  todayKey,
  uploadMealPhoto,
} from '@/lib/daily-api'
import { requireSupabase } from '@/lib/supabase'
import type { ActionResult } from '@/types/daily'
import type { MealRecord, MealType } from '@/types/meal'

interface MealContextValue {
  records: MealRecord[]
  loading: boolean
  refresh: () => Promise<void>
  submitMeal: (file: File, caption: string, mealType: MealType) => Promise<ActionResult>
  hasCheckedInToday: (userId: string) => boolean
  getTodayMeals: () => MealRecord[]
  getTodayMealByUser: (userId: string) => MealRecord | undefined
  getRecordsByDate: (date: string) => MealRecord[]
}

const MealContext = createContext<MealContextValue | null>(null)

function displayNameForUser(
  userId: string,
  selfId: string | undefined,
  selfName: string | null | undefined,
  partnerId: string | undefined,
  partnerName: string | null | undefined,
) {
  if (userId === selfId) return selfName ?? '你'
  if (userId === partnerId) return partnerName ?? '另一半'
  return '對方'
}

export function MealProvider({ children }: { children: ReactNode }) {
  const { user, profile } = useAuth()
  const { partner } = useCouple()
  const { refresh: refreshPoints } = usePoints()
  const { refresh: refreshCheckIns } = useCheckIns()
  const [records, setRecords] = useState<MealRecord[]>([])
  const [loading, setLoading] = useState(false)

  const refresh = useCallback(async () => {
    if (!profile?.couple_id) {
      setRecords([])
      return
    }

    setLoading(true)
    try {
      await seedCoupleDefaults(profile.couple_id)
      const client = requireSupabase()
      const { data, error } = await client
        .from('meal_records')
        .select('*')
        .eq('couple_id', profile.couple_id)
        .order('created_at', { ascending: false })
        .limit(100)

      if (error) throw error

      const mapped = await Promise.all(
        (data ?? []).map(async (row) => {
          const photoUrl = await getMealPhotoUrl(row.photo_path)
          return {
            id: row.id,
            userId: row.user_id,
            photoUrl,
            caption: row.caption,
            mealType: row.meal_type as MealType,
            uploadedBy: displayNameForUser(
              row.user_id,
              user?.id,
              profile.display_name,
              partner?.id,
              partner?.display_name,
            ),
            date: row.log_date,
            time: formatTime(row.created_at),
            dateLabel: formatDateLabel(row.log_date),
            points: row.points,
          } satisfies MealRecord
        }),
      )

      setRecords(mapped)
    } finally {
      setLoading(false)
    }
  }, [profile?.couple_id, profile?.display_name, user?.id, partner?.id, partner?.display_name])

  useEffect(() => {
    refresh()
  }, [refresh])

  const submitMeal = useCallback(
    async (file: File, caption: string, mealType: MealType) => {
      if (!user || !profile?.couple_id) {
        return { ok: false, error: 'NOT_AUTHENTICATED' }
      }

      const photoPath = await uploadMealPhoto(profile.couple_id, user.id, file)
      const result = await submitMealRecord(photoPath, caption, mealType)

      if (result.ok) {
        await Promise.all([refresh(), refreshPoints(), refreshCheckIns()])
      }

      return result
    },
    [user, profile?.couple_id, refresh, refreshPoints, refreshCheckIns],
  )

  const hasCheckedInToday = useCallback(
    (userId: string) => records.some((r) => r.date === todayKey() && r.userId === userId),
    [records],
  )

  const getTodayMeals = useCallback(
    () => records.filter((r) => r.date === todayKey()),
    [records],
  )

  const getTodayMealByUser = useCallback(
    (userId: string) => records.find((r) => r.date === todayKey() && r.userId === userId),
    [records],
  )

  const getRecordsByDate = useCallback(
    (date: string) => records.filter((r) => r.date === date),
    [records],
  )

  const value = useMemo(
    () => ({
      records,
      loading,
      refresh,
      submitMeal,
      hasCheckedInToday,
      getTodayMeals,
      getTodayMealByUser,
      getRecordsByDate,
    }),
    [
      records,
      loading,
      refresh,
      submitMeal,
      hasCheckedInToday,
      getTodayMeals,
      getTodayMealByUser,
      getRecordsByDate,
    ],
  )

  return <MealContext.Provider value={value}>{children}</MealContext.Provider>
}

export function useMeals() {
  const ctx = useContext(MealContext)
  if (!ctx) throw new Error('useMeals must be used within MealProvider')
  return ctx
}
