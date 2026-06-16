import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'

export function WelcomeScreen() {
  const navigate = useNavigate()

  return (
    <div className="flex-1 hero-gradient flex flex-col safe-top safe-bottom">
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="mb-8"
        >
          <div className="relative w-28 h-28 mx-auto">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              className="absolute inset-0 rounded-full bg-primary-soft"
            />
            <div className="absolute inset-2 rounded-full bg-[var(--color-surface)] card-surface flex items-center justify-center">
              <span className="text-4xl font-bold text-[var(--color-primary)]">10</span>
            </div>
            <motion.span
              className="absolute -top-1 -right-1 text-2xl animate-float"
              aria-hidden
            >
              ♥
            </motion.span>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15 }}
        >
          <p className="text-sm font-semibold text-[var(--color-primary)] mb-2 tracking-wide">
            10th Anniversary
          </p>
          <h1 className="text-3xl font-bold mb-3 leading-tight">
            情侶日記
          </h1>
          <p className="text-muted text-sm leading-relaxed max-w-xs mx-auto">
            一起記錄日常、賺情侶點數、<br />不錯過每個重要日子
          </p>
        </motion.div>
      </div>

      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="px-6 pb-8 flex flex-col gap-3"
      >
        <Button size="lg" fullWidth onClick={() => navigate('/register')}>
          開始使用
        </Button>
        <Button variant="ghost" fullWidth onClick={() => navigate('/login')}>
          已有帳號？登入
        </Button>
      </motion.div>
    </div>
  )
}
