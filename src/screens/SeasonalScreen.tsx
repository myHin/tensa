import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ScreenHeader } from '@/components/layout/ScreenHeader'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'

const activities = [
  { id: '1', emoji: '🎮', title: '愛情問答', desc: '10 題了解彼此', points: 50, done: false },
  { id: '2', emoji: '📸', title: '合照打卡', desc: '上傳一張今日合照', points: 80, done: true },
  { id: '3', emoji: '💌', title: '情書膠囊', desc: '寫一句給對方的話', points: 30, done: false },
]

export function SeasonalScreen() {
  const navigate = useNavigate()

  return (
    <div>
      <ScreenHeader title="紀念週活動" subtitle="10th Anniversary Week" backTo="/app/home" />

      <div className="px-4 pb-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="hero-gradient rounded-[var(--radius-2xl)] p-6 mb-4 text-center relative overflow-hidden"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 20, ease: 'linear' }}
            className="absolute -top-8 -right-8 w-32 h-32 rounded-full border border-[var(--color-primary)] opacity-10"
          />
          <p className="text-5xl mb-3 animate-float">🎊</p>
          <h2 className="text-xl font-bold mb-1">10 週年快樂！</h2>
          <p className="text-sm text-muted mb-3">6/13 – 6/20 · 限定活動進行中</p>
          <Badge variant="accent" size="md">雙倍情侶點數</Badge>
        </motion.div>

        <section className="mb-4">
          <h3 className="font-bold mb-3">限定小遊戲</h3>
          <div className="space-y-2">
            {activities.map((a, i) => (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <Card padding="md" className="flex items-center gap-3">
                  <span className="text-3xl">{a.emoji}</span>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{a.title}</p>
                    <p className="text-xs text-muted">{a.desc}</p>
                  </div>
                  {a.done ? (
                    <Badge variant="success">已完成</Badge>
                  ) : (
                    <Button size="sm">+{a.points * 2}</Button>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        <Card padding="md" className="bg-primary-soft border-none">
          <p className="text-sm font-semibold mb-1">其他季節活動（規劃中）</p>
          <div className="flex flex-wrap gap-2 mt-2">
            {['情人節', '白色情人節', '生日週', '聖誕節'].map((label) => (
              <Badge key={label} variant="muted">{label}</Badge>
            ))}
          </div>
        </Card>

        <Button variant="ghost" fullWidth className="mt-4" onClick={() => navigate('/app/home')}>
          返回主頁
        </Button>
      </div>
    </div>
  )
}
