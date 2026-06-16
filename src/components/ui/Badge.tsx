interface BadgeProps {
  children: React.ReactNode
  variant?: 'primary' | 'success' | 'accent' | 'warning' | 'muted'
  size?: 'sm' | 'md'
}

const variants = {
  primary: 'bg-primary-soft text-[var(--color-primary)]',
  success: 'bg-success-soft',
  accent: 'bg-accent-soft',
  warning: 'bg-warning-soft',
  muted: 'bg-[var(--color-bg-muted)] text-muted',
}

export function Badge({ children, variant = 'primary', size = 'sm' }: BadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center font-semibold rounded-full',
        variants[variant],
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm',
      ].join(' ')}
    >
      {children}
    </span>
  )
}
