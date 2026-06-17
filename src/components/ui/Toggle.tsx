import { type ButtonHTMLAttributes } from 'react'

interface ToggleProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
}

export function Toggle({ checked, onChange, label, className = '', ...props }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={[
        'w-11 h-6 rounded-full relative shrink-0 transition-colors',
        checked ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-border)]',
        className,
      ].join(' ')}
      {...props}
    >
      <span
        className={[
          'absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform',
          checked ? 'translate-x-6' : 'translate-x-1',
        ].join(' ')}
      />
    </button>
  )
}
