import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { ScreenHeader } from '@/components/layout/ScreenHeader'
import { useApp } from '@/context/AppContext'
import { useAuth } from '@/context/AuthContext'
import { useCouple } from '@/context/CoupleContext'
import { getPostAuthPath } from '@/lib/auth-utils'
import { translatePairingError } from '@/lib/pairing'

export function PairScreen() {
  const navigate = useNavigate()
  const { profile } = useAuth()
  const { inviteCode: appInviteCode, isPaired } = useApp()
  const { inviteCode, isWaitingForPartner, createCouple, joinCouple, loading } = useCouple()

  const [mode, setMode] = useState<'create' | 'join'>(profile?.couple_id ? 'create' : 'create')
  const [code, setCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const displayCode = inviteCode ?? appInviteCode
  const hasCoupleSpace = Boolean(profile?.couple_id && displayCode)

  useEffect(() => {
    if (isPaired && profile) {
      navigate(getPostAuthPath(profile), { replace: true })
    }
  }, [isPaired, profile, navigate])

  async function handleCreate() {
    setActionLoading(true)
    setError(null)
    try {
      const result = await createCouple()
      if (!result.ok) {
        setError(translatePairingError(result.error))
        return
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '建立失敗')
    } finally {
      setActionLoading(false)
    }
  }

  async function handleJoin() {
    setActionLoading(true)
    setError(null)
    try {
      const result = await joinCouple(code)
      if (!result.ok) {
        setError(translatePairingError(result.error))
        return
      }
      navigate('/profile-setup', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : '加入失敗')
    } finally {
      setActionLoading(false)
    }
  }

  async function handleCopy() {
    if (!displayCode) return
    await navigator.clipboard.writeText(displayCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex-1 flex flex-col">
      <ScreenHeader title="配對" subtitle="連結你們的情侶空間" backTo="/login" />

      <div className="px-4 mb-4">
        <div className="flex p-1 rounded-[var(--radius-xl)] bg-[var(--color-bg-muted)]">
          {(['create', 'join'] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => {
                setMode(m)
                setError(null)
              }}
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
        {error && <p className="text-sm text-red-500">{error}</p>}

        {mode === 'create' ? (
          <>
            {hasCoupleSpace ? (
              <>
                <Card padding="lg" className="text-center hero-gradient border-none">
                  <p className="text-sm text-muted mb-2">你的邀請碼</p>
                  <motion.p
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    className="text-4xl font-bold tracking-[0.3em] text-[var(--color-primary)] mb-3"
                  >
                    {displayCode}
                  </motion.p>
                  {isWaitingForPartner ? (
                    <Badge variant="warning">等待另一半加入</Badge>
                  ) : (
                    <Badge variant="success">已配對</Badge>
                  )}
                  <p className="text-xs text-muted mt-3">分享給另一半，讓對方輸入此碼即可配對</p>
                </Card>

                <div className="flex gap-2">
                  <Button variant="secondary" fullWidth onClick={handleCopy}>
                    {copied ? '已複製！' : '複製邀請碼'}
                  </Button>
                </div>

                <Button
                  fullWidth
                  size="lg"
                  className="mt-auto mb-6"
                  onClick={() => navigate('/profile-setup')}
                >
                  {isWaitingForPartner ? '先設定個人資料' : '進入主頁'}
                </Button>
              </>
            ) : (
              <>
                <Card padding="lg" className="text-center">
                  <p className="text-4xl mb-4">💑</p>
                  <p className="font-semibold mb-2">建立你們的情侶空間</p>
                  <p className="text-sm text-muted leading-relaxed">
                    系統會產生 6 位邀請碼，分享給另一半即可配對。
                  </p>
                </Card>

                <Button
                  fullWidth
                  size="lg"
                  className="mt-auto mb-6"
                  loading={actionLoading || loading}
                  onClick={handleCreate}
                >
                  建立情侶空間
                </Button>
              </>
            )}
          </>
        ) : (
          <>
            <Input
              label="輸入邀請碼"
              placeholder="例如 ABC123"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
              hint="向你的另一半索取 6 位邀請碼"
              maxLength={6}
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
              loading={actionLoading}
              onClick={handleJoin}
            >
              加入情侶空間
            </Button>
          </>
        )}
      </motion.div>
    </div>
  )
}
