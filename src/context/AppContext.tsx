import { createContext, useContext, type ReactNode } from 'react'

export interface CoupleProfile {
  name: string
  partnerName: string
  anniversary: string
  myBirthday: string
  partnerBirthday: string
}

interface AppContextValue {
  profile: CoupleProfile
  points: number
  inviteCode: string
}

const defaultProfile: CoupleProfile = {
  name: 'Alex',
  partnerName: 'Jamie',
  anniversary: '2016-06-16',
  myBirthday: '1995-03-12',
  partnerBirthday: '1996-08-22',
}

const AppContext = createContext<AppContextValue>({
  profile: defaultProfile,
  points: 1280,
  inviteCode: 'LOVE10',
})

export function AppProvider({ children }: { children: ReactNode }) {
  return (
    <AppContext.Provider
      value={{
        profile: defaultProfile,
        points: 1280,
        inviteCode: 'LOVE10',
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  return useContext(AppContext)
}
