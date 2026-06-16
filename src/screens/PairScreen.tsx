import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { ScreenHeader } from '@/components/layout/ScreenHeader'
import { useApp } from '@/context/AppContext'

export function PairScreen() {
  const navigate = useNavigate()
  const { inviteCode } = useApp()
  const [mode, setMode] = useState<'create' | 'join'>('create')
  const [code, setCode] = useState('')

  return (
    <div className="flex-1 flex flex-col">
      <ScreenHeader title="配對" subtitle="連結你們的情侶空間" backTo="/login" />

      <div className="px-4 mb-4">
        <div className="flex p-1 rounded-[var(--radius-xl)] bg-[var(--color-bg-muted)]">
          {(['create', 'join'] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={[
                'flex-1 py-2 text-sm font-semibold rounded-[var(--radius-lg)] transition-all',
                mode === m
                  ? 'bg-[var(--color-surface)] shadow-sm text-[var(--color-text)]'
                  : 'text-muted',
              ].join(' ')}
            >
              {m === 'create' ? '建立空間' : '加入空間'}
            </button>
          ))}
        </div>
      </div>

      <motion.div
        key={mode}
        initial={{ opacity: 0, x: mode === 'create' ? -12 : 12 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex-1 px-4 flex flex-col gap-4"
      >
        {mode === 'create' ? (
          <>
            <Card padding="lg" className="text-center hero-gradient border-none">
              <p className="text-sm text-muted mb-2">你的邀請碼</p>
              <motion.p
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="text-4xl font-bold tracking-[0.3em] text-[var(--color-primary)] mb-3"
              >
                {inviteCode}
              </motion.p>
              <p className="text-xs text-muted">分享給另一半，讓對方輸入此碼即可配對</p>
            </Card>

            <div className="flex gap-2">
              <Button variant="secondary" fullWidth>
                複製邀請碼
              </Button>
              <Button variant="outline" fullWidth>
                分享連結
              </Button>
            </div>

            <Card padding="md" className="flex items-start gap-3">
              <span className="text-xl">💡</span>
              <div>
                <p className="text-sm font-semibold mb-1">簡單配對</p>
                <p className="text-xs text-muted leading-relaxed">
                  只需 6 位邀請碼，無需複雜審批。配對後即可共享簽到與情侶點數。
                </p>
              </div>
            </Card>

            <Button fullWidth size="lg" className="mt-auto mb-6" onClick={() => navigate('/profile-setup')}>
              等待對方加入… 先設定個人資料
            </Button>
          </>
        ) : (
          <>
            <Input
              label="輸入邀請碼"
              placeholder="例如 LOVE10"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              hint="向你的另一半索取 6 位邀請碼"
            />

            <Card padding="md" className="bg-primary-soft border-none">
              <p className="text-sm font-medium">配對成功後你將可以：</p>
              <ul className="mt-2 space-y-1.5 text-sm text-muted">
                <li>• 查看共享情侶點數</li>
                <li>• 完成每日簽到任務</li>
                <li>• 收到紀念日提醒</li>
              </ul>
            </Card>

            <Button
              fullWidth
              size="lg"
              className="mt-auto mb-6"
              disabled={code.length < 4}
              onClick={() => navigate('/profile-setup')}
            >
              加入情侶空間
            </Button>
          </>
        )}
      </motion.div>
    </div>
  )
}
