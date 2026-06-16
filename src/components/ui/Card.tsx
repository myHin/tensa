import { type HTMLAttributes, type ReactNode } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  padding?: 'none' | 'sm' | 'md' | 'lg'
  hover?: boolean
}

const paddingMap = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-5',
}

export function Card({
  children,
  padding = 'md',
  hover,
  className = '',
  ...props
}: CardProps) {
  return (
    <div
      className={[
        'card-surface',
        paddingMap[padding],
        hover ? 'transition-transform hover:-translate-y-0.5' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {children}
    </div>
  )
}
