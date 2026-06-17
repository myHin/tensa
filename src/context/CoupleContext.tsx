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
  loadCoupleView,
  rpcCreateCouple,
  rpcJoinCouple,
  updateCoupleAnniversary,
} from '@/lib/couple-api'
import type { CoupleMemberView, PairingResult } from '@/lib/pairing'
import type { Couple, Profile } from '@/types/database'

interface CoupleContextValue {
  coupleView: CoupleMemberView | null
  couple: Couple | null
  partner: Profile | null
  inviteCode: string | null
  memberCount: number
  isPaired: boolean
  isWaitingForPartner: boolean
  loading: boolean
  createCouple: () => Promise<PairingResult>
  joinCouple: (code: string) => Promise<PairingResult>
  refreshCouple: () => Promise<CoupleMemberView | null>
  saveAnniversary: (date: string | null) => Promise<void>
}

const CoupleContext = createContext<CoupleContextValue | null>(null)

export function CoupleProvider({ children }: { children: ReactNode }) {
  const { user, profile, refreshProfile } = useAuth()
  const [coupleView, setCoupleView] = useState<CoupleMemberView | null>(null)
  const [loading, setLoading] = useState(false)

  const refreshCouple = useCallback(async () => {
    if (!user || !profile?.couple_id) {
      setCoupleView(null)
      return null
    }

    setLoading(true)
    try {
      const view = await loadCoupleView(user.id, profile.couple_id)
      setCoupleView(view)
      return view
    } finally {
      setLoading(false)
    }
  }, [user, profile?.couple_id])

  useEffect(() => {
    if (!user || !profile?.couple_id) {
      setCoupleView(null)
      return
    }
    refreshCouple()
  }, [user, profile?.couple_id, refreshCouple])

  const createCouple = useCallback(async () => {
    const result = await rpcCreateCouple()
    if (result.ok) {
      await refreshProfile()
      if (result.couple_id && user) {
        const view = await loadCoupleView(user.id, result.couple_id)
        setCoupleView(view)
      }
    }
    return result
  }, [refreshProfile, user])

  const joinCouple = useCallback(
    async (code: string) => {
      const result = await rpcJoinCouple(code)
      if (result.ok) {
        await refreshProfile()
        if (result.couple_id && user) {
          const view = await loadCoupleView(user.id, result.couple_id)
          setCoupleView(view)
        }
      }
      return result
    },
    [refreshProfile, user],
  )

  const saveAnniversary = useCallback(
    async (date: string | null) => {
      if (!profile?.couple_id) return
      await updateCoupleAnniversary(profile.couple_id, date)
      await refreshCouple()
    },
    [profile?.couple_id, refreshCouple],
  )

  const value = useMemo<CoupleContextValue>(
    () => ({
      coupleView,
      couple: coupleView?.couple ?? null,
      partner: coupleView?.partner ?? null,
      inviteCode: coupleView?.couple.invite_code ?? null,
      memberCount: coupleView?.memberCount ?? 0,
      isPaired: coupleView?.isPaired ?? false,
      isWaitingForPartner: Boolean(coupleView && coupleView.memberCount === 1),
      loading,
      createCouple,
      joinCouple,
      refreshCouple,
      saveAnniversary,
    }),
    [
      coupleView,
      loading,
      createCouple,
      joinCouple,
      refreshCouple,
      saveAnniversary,
    ],
  )

  return <CoupleContext.Provider value={value}>{children}</CoupleContext.Provider>
}

export function useCouple() {
  const ctx = useContext(CoupleContext)
  if (!ctx) throw new Error('useCouple must be used within CoupleProvider')
  return ctx
}
