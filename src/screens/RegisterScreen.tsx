import { Link, useNavigate } from 'react-router-dom'
import { useState, type FormEvent } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { ScreenHeader } from '@/components/layout/ScreenHeader'
import { SupabaseSetupBanner } from '@/components/auth/SupabaseSetupBanner'
import { Card } from '@/components/ui/Card'
import { useAuth } from '@/context/AuthContext'
import { getPostAuthPath, translateAuthError } from '@/lib/auth-utils'

export function RegisterScreen() {
  const navigate = useNavigate()
  const { configured, signUpWithEmail, signInWithGoogle, refreshProfile } = useAuth()

  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!configured) return

    setLoading(true)
    setError(null)
    setInfo(null)

    const { error: authError, needsEmailConfirmation } = await signUpWithEmail(
      email.trim(),
      password,
      displayName.trim(),
    )

    if (authError) {
      setError(translateAuthError(authError))
      setLoading(false)
      return
    }

    if (needsEmailConfirmation) {
      setInfo('註冊成功！請到電郵確認帳號後再登入。')
      setLoading(false)
      return
    }

    const nextProfile = await refreshProfile()
    navigate(getPostAuthPath(nextProfile), { replace: true })
    setLoading(false)
  }

  async function handleGoogle() {
    if (!configured) return
    setGoogleLoading(true)
    setError(null)
    const { error: authError } = await signInWithGoogle()
    if (authError) {
      setError(translateAuthError(authError))
      setGoogleLoading(false)
    }
  }

  return (
    <div className="flex-1 flex flex-col">
      <ScreenHeader title="註冊" subtitle="建立你的帳號" backTo="/" />
      {!configured && <SupabaseSetupBanner />}

      <motion.form
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="flex-1 px-4 flex flex-col gap-4"
      >
        <Input
          label="暱稱"
          placeholder="你的名字"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          required
        />
        <Input
          label="電郵"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
        <Input
          label="密碼"
          type="password"
          placeholder="至少 6 個字元"
          hint="建議包含字母與數字"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          autoComplete="new-password"
        />

        {error && <p className="text-sm text-red-500">{error}</p>}
        {info && (
          <Card padding="sm" className="bg-success-soft border-none">
            <p className="text-sm">{info}</p>
          </Card>
        )}

        <Button fullWidth size="lg" className="mt-2" type="submit" loading={loading} disabled={!configured}>
          繼續
        </Button>

        <Button
          type="button"
          variant="outline"
          fullWidth
          icon={<GoogleIcon />}
          loading={googleLoading}
          disabled={!configured}
          onClick={handleGoogle}
        >
          Google 註冊
        </Button>

        <p className="text-center text-sm text-muted mt-auto pb-6">
          已有帳號？{' '}
          <Link to="/login" className="font-semibold text-[var(--color-primary)]">
            登入
          </Link>
        </p>
      </motion.form>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  )
}
