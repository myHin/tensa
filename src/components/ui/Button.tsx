import { type ButtonHTMLAttributes, type ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'outline'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  fullWidth?: boolean
  icon?: ReactNode
  loading?: boolean
}

const variantClasses: Record<Variant, string> = {
  primary: 'bg-primary border-transparent',
  secondary: 'bg-primary-soft border-transparent',
  ghost: 'bg-transparent border-transparent text-[var(--color-text)] hover:bg-[var(--color-bg-muted)]',
  outline:
    'bg-transparent border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-bg-muted)]',
}

const sizeClasses: Record<Size, string> = {
  sm: 'h-9 px-3 text-sm gap-1.5 rounded-[var(--radius-md)]',
  md: 'h-11 px-4 text-sm gap-2 rounded-[var(--radius-lg)]',
  lg: 'h-13 px-6 text-base gap-2.5 rounded-[var(--radius-xl)]',
}

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth,
  icon,
  loading,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={[
        'inline-flex items-center justify-center font-semibold border transition-all active:scale-[0.97]',
        'disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth ? 'w-full' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        icon
      )}
      {children}
    </button>
  )
}
