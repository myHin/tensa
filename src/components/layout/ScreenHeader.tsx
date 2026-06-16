import { type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'

interface ScreenHeaderProps {
  title: string
  subtitle?: string
  backTo?: string
  action?: ReactNode
}

export function ScreenHeader({ title, subtitle, backTo, action }: ScreenHeaderProps) {
  const navigate = useNavigate()

  return (
    <header className="flex items-start justify-between gap-3 px-4 pt-2 pb-3 safe-top">
      <div className="flex items-start gap-2 min-w-0">
        {backTo && (
          <button
            type="button"
            onClick={() => navigate(backTo)}
            className="mt-0.5 shrink-0 w-9 h-9 flex items-center justify-center rounded-[var(--radius-lg)] hover:bg-[var(--color-bg-muted)] transition-colors"
            aria-label="返回"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        )}
        <div className="min-w-0">
          <h1 className="text-xl font-bold truncate">{title}</h1>
          {subtitle && <p className="text-sm text-muted mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {action}
    </header>
  )
}
