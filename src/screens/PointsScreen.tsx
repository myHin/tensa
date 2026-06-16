import { motion } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'
import { ScreenHeader } from '@/components/layout/ScreenHeader'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { PointBadge } from '@/components/ui/PointBadge'
import { useApp } from '@/context/AppContext'
import { pointHistory, rewards } from '@/data/mock'

export function PointsScreen() {
  const { points } = useApp()

  return (
    <div>
      <ScreenHeader title="情侶點數" subtitle="一起努力，一起兌換" />

      <div className="px-4">
        <Card padding="lg" className="hero-gradient border-none mb-4 text-center">
          <p className="text-sm text-muted mb-2">目前共有</p>
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <PointBadge points={points} size="lg" />
          </motion.div>
          <p className="text-xs text-muted mt-3">本月已賺取 +420 點</p>
        </Card>

        <section className="mb-6">
          <h2 className="font-bold mb-3">可兌換獎勵</h2>
          <div className="space-y-2">
            {rewards.map((reward) => (
              <Card key={reward.id} padding="md" hover className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-[var(--radius-lg)] bg-accent-soft flex items-center justify-center text-2xl">
                  {reward.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">{reward.title}</p>
                  <p className="text-xs text-muted">{reward.description}</p>
                </div>
                <Button
                  size="sm"
                  variant={points >= reward.cost ? 'primary' : 'outline'}
                  disabled={points < reward.cost}
                >
                  {reward.cost} 點
                </Button>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-bold mb-3">最近紀錄</h2>
          <Card padding="none">
            {pointHistory.map((entry, i) => (
              <div
                key={entry.id}
                className={[
                  'flex items-center justify-between px-4 py-3',
                  i < pointHistory.length - 1 ? 'border-b border-[var(--color-border)]' : '',
                ].join(' ')}
              >
                <div>
                  <p className="text-sm font-medium">{entry.label}</p>
                  <p className="text-xs text-muted">{entry.time}</p>
                </div>
                <Badge variant={entry.amount > 0 ? 'success' : 'warning'}>
                  {entry.amount > 0 ? '+' : ''}{entry.amount}
                </Badge>
              </div>
            ))}
          </Card>
        </section>
      </div>
    </div>
  )
}

export function CheckInSuccessScreen() {
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as {
    type?: string
    mealType?: string
    caption?: string
    partnerName?: string
    partnerShared?: boolean
  } | null
  const isMeal = state?.type === 'meal'

  return (
    <div className="min-h-[70dvh] flex flex-col items-center justify-center px-6 text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 18 }}
        className="relative mb-6"
      >
        <motion.div
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-24 h-24 rounded-full bg-success-soft flex items-center justify-center text-4xl"
        >
          {isMeal ? '🍽️' : '✓'}
        </motion.div>
        {[...Array(6)].map((_, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 1, 0], scale: [0, 1, 0.5], x: Math.cos(i) * 50, y: Math.sin(i) * 50 }}
            transition={{ delay: 0.2 + i * 0.05, duration: 0.8 }}
            className="absolute top-1/2 left-1/2 text-lg"
          >
            ♥
          </motion.span>
        ))}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <h1 className="text-2xl font-bold mb-2">{isMeal ? '分享成功！' : '簽到成功！'}</h1>
        <p className="text-muted text-sm mb-4">
          {isMeal
            ? state?.partnerShared
              ? `${state.caption ?? '你的餐點'} · 你和 ${state.partnerName ?? '對方'} 今天都分享了`
              : `${state.caption ?? '你的餐點'} · 等 ${state.partnerName ?? '對方'} 分享吧`
            : '今晚刷牙 · 連續 5 天 🔥'}
        </p>
        <Badge variant="success" size="md">{isMeal ? '+30' : '+20'} 情侶點數</Badge>
      </motion.div>

      <div className="mt-10 flex flex-col gap-2 w-full max-w-xs">
        {isMeal && (
          <Button fullWidth size="lg" variant="secondary" onClick={() => navigate('/app/meals')}>
            查看用餐紀錄
          </Button>
        )}
        <Button fullWidth size="lg" onClick={() => navigate('/app/home')}>
          返回今日
        </Button>
      </div>
    </div>
  )
}
