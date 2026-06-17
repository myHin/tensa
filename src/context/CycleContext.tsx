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
  deleteCyclePeriod,
  endCyclePeriod,
  fetchMyCyclePeriods,
  fetchMyCyclePrediction,
  fetchMyCycleSettings,
  fetchPartnerCycleSnapshot,
  hasActiveCyclePeriod,
  saveCyclePeriod,
  startCyclePeriod,
  updateCyclePrivacy,
} from '@/lib/cycle-api'
import type {
  CycleLogView,
  CyclePrediction,
  PartnerCycleSnapshot,
} from '@/types/cycle'
import { canTrackOwnMenstrualCycle } from '@/types/profile'

export interface CyclePrivacySettings {
  shareLogsWithPartner: boolean
  sharePredictionWithPartner: boolean
}

interface CycleContextValue extends CyclePrivacySettings {
  canTrackOwnCycle: boolean
  logs: CycleLogView[]
  prediction: CyclePrediction
  partnerSnapshot: PartnerCycleSnapshot | null
  hasActivePeriod: boolean
  loading: boolean
  busy: boolean
  refresh: () => Promise<void>
  setShareLogsWithPartner: (value: boolean) => Promise<void>
  setSharePredictionWithPartner: (value: boolean) => Promise<void>
  startPeriod: () => Promise<{ ok: boolean; error?: string }>
  endPeriod: () => Promise<{ ok: boolean; error?: string }>
  savePeriod: (input: {
    id?: string
    startDate: string
    endDate: string | null
    note?: string
  }) => Promise<{ ok: boolean; error?: string }>
  deletePeriod: (id: string) => Promise<{ ok: boolean; error?: string }>
  partnerCanViewLogs: boolean
  partnerCanViewPrediction: boolean
}

const defaultPrediction: CyclePrediction = {
  avgCycle: 28,
  nextPredicted: null,
  nextPredictedDate: null,
}

const CycleContext = createContext<CycleContextValue | null>(null)

export function CycleProvider({ children }: { children: ReactNode }) {
  const { profile } = useAuth()
  const [settings, setSettings] = useState<CyclePrivacySettings>({
    shareLogsWithPartner: false,
    sharePredictionWithPartner: false,
  })
  const [logs, setLogs] = useState<CycleLogView[]>([])
  const [prediction, setPrediction] = useState<CyclePrediction>(defaultPrediction)
  const [partnerSnapshot, setPartnerSnapshot] = useState<PartnerCycleSnapshot | null>(null)
  const [hasActivePeriod, setHasActivePeriod] = useState(false)
  const [loading, setLoading] = useState(false)
  const [busy, setBusy] = useState(false)

  const refresh = useCallback(async () => {
    if (!profile?.couple_id) {
      setLogs([])
      setPrediction(defaultPrediction)
      setPartnerSnapshot(null)
      setHasActivePeriod(false)
      return
    }

    const canTrack = canTrackOwnMenstrualCycle(profile.gender)

    setLoading(true)
    try {
      if (canTrack) {
        const [settingsRow, periodLogs, periodPrediction, active, snapshot] = await Promise.all([
          fetchMyCycleSettings(),
          fetchMyCyclePeriods(),
          fetchMyCyclePrediction(),
          hasActiveCyclePeriod(),
          fetchPartnerCycleSnapshot(),
        ])

        if (settingsRow) {
          setSettings({
            shareLogsWithPartner: settingsRow.share_logs_with_partner,
            sharePredictionWithPartner: settingsRow.share_prediction_with_partner,
          })
        }

        setLogs(periodLogs)
        setPrediction(periodPrediction)
        setHasActivePeriod(active)
        setPartnerSnapshot(snapshot)
      } else {
        setSettings({
          shareLogsWithPartner: false,
          sharePredictionWithPartner: false,
        })
        setLogs([])
        setPrediction(defaultPrediction)
        setHasActivePeriod(false)
        setPartnerSnapshot(await fetchPartnerCycleSnapshot())
      }
    } finally {
      setLoading(false)
    }
  }, [profile?.couple_id, profile?.gender])

  useEffect(() => {
    refresh()
  }, [refresh])

  const persistPrivacy = useCallback(
    async (next: CyclePrivacySettings) => {
      if (!canTrackOwnMenstrualCycle(profile?.gender)) return
      setSettings(next)
      await updateCyclePrivacy(next.shareLogsWithPartner, next.sharePredictionWithPartner)
      await refresh()
    },
    [profile?.gender, refresh],
  )

  const setShareLogsWithPartner = useCallback(
    async (value: boolean) => {
      await persistPrivacy({
        ...settings,
        shareLogsWithPartner: value,
      })
    },
    [settings, persistPrivacy],
  )

  const setSharePredictionWithPartner = useCallback(
    async (value: boolean) => {
      await persistPrivacy({
        ...settings,
        sharePredictionWithPartner: value,
      })
    },
    [settings, persistPrivacy],
  )

  const startPeriod = useCallback(async () => {
    if (!canTrackOwnMenstrualCycle(profile?.gender)) {
      return { ok: false, error: 'NOT_AVAILABLE' }
    }
    setBusy(true)
    try {
      const result = await startCyclePeriod()
      if (result.ok) await refresh()
      return result
    } finally {
      setBusy(false)
    }
  }, [profile?.gender, refresh])

  const endPeriod = useCallback(async () => {
    if (!canTrackOwnMenstrualCycle(profile?.gender)) {
      return { ok: false, error: 'NOT_AVAILABLE' }
    }
    setBusy(true)
    try {
      const result = await endCyclePeriod()
      if (result.ok) await refresh()
      return result
    } finally {
      setBusy(false)
    }
  }, [profile?.gender, refresh])

  const savePeriod = useCallback(
    async (input: {
      id?: string
      startDate: string
      endDate: string | null
      note?: string
    }) => {
      if (!canTrackOwnMenstrualCycle(profile?.gender)) {
        return { ok: false, error: 'NOT_AVAILABLE' }
      }
      setBusy(true)
      try {
        const result = await saveCyclePeriod(input)
        if (result.ok) await refresh()
        return result
      } finally {
        setBusy(false)
      }
    },
    [profile?.gender, refresh],
  )

  const deletePeriod = useCallback(
    async (id: string) => {
      if (!canTrackOwnMenstrualCycle(profile?.gender)) {
        return { ok: false, error: 'NOT_AVAILABLE' }
      }
      setBusy(true)
      try {
        const result = await deleteCyclePeriod(id)
        if (result.ok) await refresh()
        return result
      } finally {
        setBusy(false)
      }
    },
    [profile?.gender, refresh],
  )

  const canTrackOwnCycle = canTrackOwnMenstrualCycle(profile?.gender)

  const value = useMemo(
    () => ({
      ...settings,
      canTrackOwnCycle,
      logs,
      prediction,
      partnerSnapshot,
      hasActivePeriod,
      loading,
      busy,
      refresh,
      setShareLogsWithPartner,
      setSharePredictionWithPartner,
      startPeriod,
      endPeriod,
      savePeriod,
      deletePeriod,
      partnerCanViewLogs: settings.shareLogsWithPartner,
      partnerCanViewPrediction: settings.sharePredictionWithPartner,
    }),
    [
      settings,
      canTrackOwnCycle,
      logs,
      prediction,
      partnerSnapshot,
      hasActivePeriod,
      loading,
      busy,
      refresh,
      setShareLogsWithPartner,
      setSharePredictionWithPartner,
      startPeriod,
      endPeriod,
      savePeriod,
      deletePeriod,
    ],
  )

  return <CycleContext.Provider value={value}>{children}</CycleContext.Provider>
}

export function useCyclePrivacy() {
  const ctx = useContext(CycleContext)
  if (!ctx) throw new Error('useCyclePrivacy must be used within CycleProvider')
  return ctx
}

export function useCycle() {
  return useCyclePrivacy()
}
