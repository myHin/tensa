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
import {
  fetchCouplePoints,
  formatTransactionTime,
  redeemReward,
  seedCoupleDefaults,
} from '@/lib/daily-api'
import { requireSupabase } from '@/lib/supabase'
import type { PointTransactionView, RewardView } from '@/types/daily'

interface PointsContextValue {
  balance: number
  transactions: PointTransactionView[]
  rewards: RewardView[]
  loading: boolean
  refresh: () => Promise<void>
  redeem: (rewardId: string) => Promise<{ ok: boolean; error?: string }>
}

const PointsContext = createContext<PointsContextValue | null>(null)

export function PointsProvider({ children }: { children: ReactNode }) {
  const { profile } = useAuth()
  const [balance, setBalance] = useState(0)
  const [transactions, setTransactions] = useState<PointTransactionView[]>([])
  const [rewards, setRewards] = useState<RewardView[]>([])
  const [loading, setLoading] = useState(false)

  const refresh = useCallback(async () => {
    if (!profile?.couple_id) {
      setBalance(0)
      setTransactions([])
      setRewards([])
      return
    }

    setLoading(true)
    try {
      await seedCoupleDefaults(profile.couple_id)

      const client = requireSupabase()
      const [points, txResult, rewardsResult] = await Promise.all([
        fetchCouplePoints(profile.couple_id),
        client
          .from('point_transactions')
          .select('*')
          .eq('couple_id', profile.couple_id)
          .order('created_at', { ascending: false })
          .limit(30),
        client
          .from('rewards')
          .select('*')
          .eq('couple_id', profile.couple_id)
          .eq('active', true)
          .order('cost', { ascending: true }),
      ])

      if (txResult.error) throw txResult.error
      if (rewardsResult.error) throw rewardsResult.error

      setBalance(points)
      setTransactions(
        (txResult.data ?? []).map((row) => ({
          id: row.id,
          label: row.label,
          time: formatTransactionTime(row.created_at),
          amount: row.amount,
        })),
      )
      setRewards(
        (rewardsResult.data ?? []).map((row) => ({
          id: row.id,
          emoji: row.emoji,
          title: row.title,
          description: row.description,
          cost: row.cost,
        })),
      )
    } finally {
      setLoading(false)
    }
  }, [profile?.couple_id])

  useEffect(() => {
    refresh()
  }, [refresh])

  const redeem = useCallback(
    async (rewardId: string) => {
      const result = await redeemReward(rewardId)
      if (result.ok) {
        await refresh()
        return { ok: true }
      }
      return { ok: false, error: result.error }
    },
    [refresh],
  )

  const value = useMemo(
    () => ({ balance, transactions, rewards, loading, refresh, redeem }),
    [balance, transactions, rewards, loading, refresh, redeem],
  )

  return <PointsContext.Provider value={value}>{children}</PointsContext.Provider>
}

export function usePoints() {
  const ctx = useContext(PointsContext)
  if (!ctx) throw new Error('usePoints must be used within PointsProvider')
  return ctx
}
