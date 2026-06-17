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
import { usePoints } from '@/context/PointsContext'
import { completeCheckIn, seedCoupleDefaults, todayKey } from '@/lib/daily-api'
import { requireSupabase } from '@/lib/supabase'
import type { CheckInTemplateView } from '@/types/daily'

interface CheckInContextValue {
  templates: CheckInTemplateView[]
  loading: boolean
  refresh: () => Promise<void>
  completeCheckInBySlug: (
    slug: string,
  ) => Promise<{ ok: boolean; error?: string; points?: number; title?: string }>
}

const CheckInContext = createContext<CheckInContextValue | null>(null)

function computeStreak(logDates: string[]): number {
  if (logDates.length === 0) return 0
  const unique = [...new Set(logDates)].sort().reverse()
  let streak = 0
  const cursor = new Date()

  for (let i = 0; i < unique.length; i++) {
    const expected = cursor.toISOString().slice(0, 10)
    if (unique[i] === expected) {
      streak += 1
      cursor.setDate(cursor.getDate() - 1)
    } else if (i === 0 && unique[i] !== expected) {
      cursor.setDate(cursor.getDate() - 1)
      if (unique[i] === cursor.toISOString().slice(0, 10)) {
        streak += 1
        cursor.setDate(cursor.getDate() - 1)
      } else {
        break
      }
    } else {
      break
    }
  }
  return streak
}

export function CheckInProvider({ children }: { children: ReactNode }) {
  const { user, profile } = useAuth()
  const { refresh: refreshPoints } = usePoints()
  const [templates, setTemplates] = useState<CheckInTemplateView[]>([])
  const [loading, setLoading] = useState(false)

  const refresh = useCallback(async () => {
    if (!user || !profile?.couple_id) {
      setTemplates([])
      return
    }

    setLoading(true)
    try {
      await seedCoupleDefaults(profile.couple_id)
      const client = requireSupabase()
      const today = todayKey()

      const [templatesResult, logsResult] = await Promise.all([
        client
          .from('check_in_templates')
          .select('*')
          .eq('couple_id', profile.couple_id)
          .eq('active', true)
          .order('created_at', { ascending: true }),
        client
          .from('check_in_logs')
          .select('template_id, log_date, user_id')
          .eq('couple_id', profile.couple_id)
          .eq('user_id', user.id),
      ])

      if (templatesResult.error) throw templatesResult.error
      if (logsResult.error) throw logsResult.error

      const logs = logsResult.data ?? []
      const todayTemplateIds = new Set(
        logs.filter((l) => l.log_date === today).map((l) => l.template_id),
      )

      const views: CheckInTemplateView[] = (templatesResult.data ?? []).map((t) => {
        const userLogDates = logs
          .filter((l) => l.template_id === t.id)
          .map((l) => l.log_date)

        return {
          id: t.slug,
          slug: t.slug,
          emoji: t.emoji,
          title: t.title,
          subtitle:
            t.slug === 'meal' ? '各自分享今天的一餐，不用一起吃也可以' : t.description,
          description: t.description,
          points: t.points,
          schedule: t.schedule,
          completedToday: todayTemplateIds.has(t.id),
          streak: computeStreak(userLogDates),
        }
      })

      setTemplates(views)
    } finally {
      setLoading(false)
    }
  }, [user, profile?.couple_id])

  useEffect(() => {
    refresh()
  }, [refresh])

  const completeCheckInBySlug = useCallback(
    async (slug: string) => {
      const result = await completeCheckIn(slug)
      if (result.ok) {
        await Promise.all([refresh(), refreshPoints()])
      }
      return result
    },
    [refresh, refreshPoints],
  )

  const value = useMemo(
    () => ({ templates, loading, refresh, completeCheckInBySlug }),
    [templates, loading, refresh, completeCheckInBySlug],
  )

  return <CheckInContext.Provider value={value}>{children}</CheckInContext.Provider>
}

export function useCheckIns() {
  const ctx = useContext(CheckInContext)
  if (!ctx) throw new Error('useCheckIns must be used within CheckInProvider')
  return ctx
}
