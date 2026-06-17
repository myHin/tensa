import { createContext, useContext, useMemo, type ReactNode } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useCouple } from '@/context/CoupleContext'
import { usePoints } from '@/context/PointsContext'
import {
  canTrackOwnMenstrualCycle,
  type ProfileGender,
} from '@/types/profile'

export interface CoupleProfile {
  name: string
  partnerName: string
  gender: ProfileGender | null
  canTrackOwnCycle: boolean
  anniversary: string
  myBirthday: string
  partnerBirthday: string
}

interface AppContextValue {
  profile: CoupleProfile
  points: number
  inviteCode: string
  isPaired: boolean
  isWaitingForPartner: boolean
}

const AppContext = createContext<AppContextValue>({
  profile: {
    name: '你',
    partnerName: '另一半',
    gender: null,
    canTrackOwnCycle: false,
    anniversary: '',
    myBirthday: '',
    partnerBirthday: '',
  },
  points: 0,
  inviteCode: '',
  isPaired: false,
  isWaitingForPartner: false,
})

export function AppProvider({ children }: { children: ReactNode }) {
  const { profile: authProfile } = useAuth()
  const { couple, partner, inviteCode, isPaired, isWaitingForPartner } = useCouple()
  const { balance } = usePoints()

  const value = useMemo<AppContextValue>(
    () => ({
      profile: {
        name: authProfile?.display_name ?? '你',
        partnerName: partner?.display_name ?? (isWaitingForPartner ? '等待加入…' : '另一半'),
        gender: authProfile?.gender ?? null,
        canTrackOwnCycle: canTrackOwnMenstrualCycle(authProfile?.gender),
        anniversary: couple?.anniversary ?? '',
        myBirthday: authProfile?.birthday ?? '',
        partnerBirthday: partner?.birthday ?? '',
      },
      points: balance,
      inviteCode: inviteCode ?? '',
      isPaired,
      isWaitingForPartner,
    }),
    [authProfile, couple, partner, inviteCode, isPaired, isWaitingForPartner, balance],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  return useContext(AppContext)
}
