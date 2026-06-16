import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'

const tabs = [
  { to: '/app/home', label: '今日', icon: HomeIcon },
  { to: '/app/check-ins', label: '簽到', icon: CheckIcon },
  { to: '/app/points', label: '點數', icon: PointsIcon },
  { to: '/app/calendar', label: '日曆', icon: CalendarIcon },
  { to: '/app/settings', label: '設定', icon: SettingsIcon },
]

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-50 safe-bottom">
      <div className="mx-3 mb-3 px-2 py-2 card-surface flex items-center justify-around backdrop-blur-md bg-[color-mix(in_srgb,var(--color-surface)_92%,transparent)]">
        {tabs.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} className="relative flex-1">
            {({ isActive }) => (
              <div className="flex flex-col items-center gap-0.5 py-1">
                {isActive && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-x-1 inset-y-0 rounded-[var(--radius-lg)] bg-primary-soft"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">
                  <Icon active={isActive} />
                </span>
                <span
                  className={[
                    'relative z-10 text-[10px] font-semibold',
                    isActive ? 'text-[var(--color-primary)]' : 'text-muted',
                  ].join(' ')}
                >
                  {label}
                </span>
              </div>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? 'var(--color-primary)' : 'none'} stroke={active ? 'var(--color-primary)' : 'var(--color-text-muted)'} strokeWidth="2">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H5a1 1 0 01-1-1V9.5z" />
    </svg>
  )
}

function CheckIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? 'var(--color-primary)' : 'var(--color-text-muted)'} strokeWidth="2">
      <path d="M9 11l3 3L22 4" />
      <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
    </svg>
  )
}

function PointsIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? 'var(--color-primary)' : 'none'} stroke={active ? 'var(--color-primary)' : 'var(--color-text-muted)'} strokeWidth="2">
      <path d="M12 17.5l-1.1-1C7.4 13.1 5 11 5 8.5 5 6.5 6.5 5 8.5 5c1.2 0 2.4.6 3 1.5.6-.9 1.8-1.5 3-1.5 2 0 3.5 1.5 3.5 3.5 0 2.5-2.4 4.6-5.9 8l-1.1 1z" />
    </svg>
  )
}

function CalendarIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? 'var(--color-primary)' : 'var(--color-text-muted)'} strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  )
}

function SettingsIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? 'var(--color-primary)' : 'var(--color-text-muted)'} strokeWidth="2">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  )
}
