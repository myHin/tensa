import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { ScreenHeader } from '@/components/layout/ScreenHeader'

export function RegisterScreen() {
  const navigate = useNavigate()

  return (
    <div className="flex-1 flex flex-col">
      <ScreenHeader title="註冊" subtitle="建立你的帳號" backTo="/" />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1 px-4 flex flex-col gap-4"
      >
        <Input label="暱稱" placeholder="你的名字" />
        <Input label="電郵" type="email" placeholder="you@example.com" />
        <Input label="密碼" type="password" placeholder="至少 8 個字元" hint="建議包含字母與數字" />

        <Button fullWidth size="lg" className="mt-2" onClick={() => navigate('/pair')}>
          繼續
        </Button>

        <Button variant="outline" fullWidth icon={<GoogleIcon />}>
          Google 註冊
        </Button>

        <p className="text-center text-sm text-muted mt-auto pb-6">
          已有帳號？{' '}
          <Link to="/login" className="font-semibold text-[var(--color-primary)]">
            登入
          </Link>
        </p>
      </motion.div>
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
