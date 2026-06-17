import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

export interface CyclePrivacySettings {
  shareLogsWithPartner: boolean
  sharePredictionWithPartner: boolean
}

interface CycleContextValue extends CyclePrivacySettings {
  setShareLogsWithPartner: (value: boolean) => void
  setSharePredictionWithPartner: (value: boolean) => void
  partnerCanViewLogs: boolean
  partnerCanViewPrediction: boolean
}

const STORAGE_KEY = '10sa-cycle-privacy'

const defaultSettings: CyclePrivacySettings = {
  shareLogsWithPartner: false,
  sharePredictionWithPartner: false,
}

function loadSettings(): CyclePrivacySettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return { ...defaultSettings, ...JSON.parse(raw) }
  } catch {
    /* ignore */
  }
  return defaultSettings
}

const CycleContext = createContext<CycleContextValue | null>(null)

export function CycleProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<CyclePrivacySettings>(loadSettings)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  }, [settings])

  const setShareLogsWithPartner = useCallback(
    (value: boolean) => setSettings((s) => ({ ...s, shareLogsWithPartner: value })),
    [],
  )

  const setSharePredictionWithPartner = useCallback(
    (value: boolean) => setSettings((s) => ({ ...s, sharePredictionWithPartner: value })),
    [],
  )

  const value = useMemo(
    () => ({
      ...settings,
      setShareLogsWithPartner,
      setSharePredictionWithPartner,
      partnerCanViewLogs: settings.shareLogsWithPartner,
      partnerCanViewPrediction: settings.sharePredictionWithPartner,
    }),
    [settings, setShareLogsWithPartner, setSharePredictionWithPartner],
  )

  return <CycleContext.Provider value={value}>{children}</CycleContext.Provider>
}

export function useCyclePrivacy() {
  const ctx = useContext(CycleContext)
  if (!ctx) throw new Error('useCyclePrivacy must be used within CycleProvider')
  return ctx
}
