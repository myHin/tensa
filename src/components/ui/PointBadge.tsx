import { motion } from 'framer-motion'

interface PointBadgeProps {
  points: number
  size?: 'sm' | 'lg'
}

export function PointBadge({ points, size = 'sm' }: PointBadgeProps) {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={[
        'inline-flex items-center gap-1.5 font-bold rounded-full bg-primary-soft',
        size === 'lg' ? 'px-4 py-2 text-base' : 'px-2.5 py-1 text-sm',
      ].join(' ')}
    >
      <HeartCoin />
      <span>{points.toLocaleString()}</span>
    </motion.div>
  )
}

function HeartCoin() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="10" fill="var(--color-primary)" opacity="0.15" />
      <path
        d="M12 17.5l-1.1-1C7.4 13.1 5 11 5 8.5 5 6.5 6.5 5 8.5 5c1.2 0 2.4.6 3 1.5.6-.9 1.8-1.5 3-1.5 2 0 3.5 1.5 3.5 3.5 0 2.5-2.4 4.6-5.9 8l-1.1 1z"
        fill="var(--color-primary)"
      />
    </svg>
  )
}
