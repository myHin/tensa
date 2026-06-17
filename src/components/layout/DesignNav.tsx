import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const designScreens = [
  { path: '/', label: 'Welcome' },
  { path: '/auth/callback', label: 'Auth callback' },
  { path: '/register', label: 'Register' },
  { path: '/pair', label: 'Pair' },
  { path: '/profile-setup', label: 'Profile' },
  { path: '/app/home', label: 'Home' },
  { path: '/app/check-ins', label: 'Check-ins' },
  { path: '/app/points', label: 'Points' },
  { path: '/app/calendar', label: 'Calendar' },
  { path: '/app/settings', label: 'Settings' },
  { path: '/app/meals/check-in', label: 'Meal check-in' },
  { path: '/app/meals', label: 'Meal history' },
  { path: '/app/check-in-success', label: 'Success' },
  { path: '/app/seasonal', label: 'Seasonal' },
]

export function DesignNav() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <div className="design-nav-panel">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="ml-auto flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-full card-surface bg-[color-mix(in_srgb,var(--color-surface)_95%,transparent)] backdrop-blur-md shadow-lg"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
        UI 設計
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            className="mt-2 p-2 card-surface max-h-64 overflow-y-auto bg-[color-mix(in_srgb,var(--color-surface)_98%,transparent)] backdrop-blur-md"
          >
            <p className="px-2 py-1 text-[10px] font-semibold text-muted uppercase tracking-wide">
              Screen navigator
            </p>
            {designScreens.map(({ path, label }) => (
              <button
                key={path}
                type="button"
                onClick={() => {
                  navigate(path)
                  setOpen(false)
                }}
                className={[
                  'w-full text-left px-2 py-1.5 text-sm rounded-[var(--radius-md)] transition-colors',
                  location.pathname === path
                    ? 'bg-primary-soft font-semibold text-[var(--color-primary)]'
                    : 'hover:bg-[var(--color-bg-muted)]',
                ].join(' ')}
              >
                {label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
