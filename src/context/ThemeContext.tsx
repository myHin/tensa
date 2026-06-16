import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  getThemeTokens,
  themePresets,
  type ThemeId,
  type ThemeMode,
} from '@/design-system/themes'

interface ThemeContextValue {
  themeId: ThemeId
  mode: ThemeMode
  setThemeId: (id: ThemeId) => void
  setMode: (mode: ThemeMode) => void
  toggleMode: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

const STORAGE_KEY = '10sa-theme'

function loadStoredTheme(): { themeId: ThemeId; mode: ThemeMode } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as { themeId?: ThemeId; mode?: ThemeMode }
      return {
        themeId: parsed.themeId ?? 'rose',
        mode: parsed.mode ?? 'light',
      }
    }
  } catch {
    /* ignore */
  }
  return { themeId: 'rose', mode: 'light' }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const stored = loadStoredTheme()
  const [themeId, setThemeIdState] = useState<ThemeId>(stored.themeId)
  const [mode, setModeState] = useState<ThemeMode>(stored.mode)

  const setThemeId = useCallback((id: ThemeId) => setThemeIdState(id), [])
  const setMode = useCallback((m: ThemeMode) => setModeState(m), [])
  const toggleMode = useCallback(
    () => setModeState((m) => (m === 'light' ? 'dark' : 'light')),
    [],
  )

  useEffect(() => {
    const tokens = getThemeTokens(themeId, mode)
    const root = document.documentElement
    Object.entries(tokens).forEach(([key, value]) => {
      root.style.setProperty(key, value)
    })
    root.dataset.theme = themeId
    root.dataset.mode = mode

    const preset = themePresets.find((t) => t.id === themeId)!
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) meta.setAttribute('content', preset.swatch)

    localStorage.setItem(STORAGE_KEY, JSON.stringify({ themeId, mode }))
  }, [themeId, mode])

  const value = useMemo(
    () => ({ themeId, mode, setThemeId, setMode, toggleMode }),
    [themeId, mode, setThemeId, setMode, toggleMode],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
