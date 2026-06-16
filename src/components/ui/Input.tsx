import { type InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  hint?: string
  error?: string
}

export function Input({ label, hint, error, className = '', id, ...props }: InputProps) {
  const inputId = id ?? label?.replace(/\s/g, '-').toLowerCase()

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={[
          'h-11 w-full px-3.5 rounded-[var(--radius-lg)] border text-sm',
          'bg-[var(--color-bg-elevated)] border-[var(--color-border)]',
          'text-[var(--color-text)] placeholder:text-[var(--color-text-muted)]',
          'focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent',
          'transition-shadow',
          error ? 'border-red-400 focus:ring-red-400' : '',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
      {hint && !error && <p className="text-xs text-muted">{hint}</p>}
    </div>
  )
}
