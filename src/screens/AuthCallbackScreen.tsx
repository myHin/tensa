import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { requireSupabase } from '@/lib/supabase'
import { getPostAuthPath } from '@/lib/auth-utils'
import { useAuth } from '@/context/AuthContext'

export function AuthCallbackScreen() {
  const navigate = useNavigate()
  const { refreshProfile } = useAuth()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function handleCallback() {
      try {
        const client = requireSupabase()
        const { data, error: sessionError } = await client.auth.getSession()
        if (sessionError) throw sessionError

        if (!data.session) {
          setError('登入未完成，請再試一次')
          return
        }

        const profile = await refreshProfile()
        navigate(getPostAuthPath(profile), { replace: true })
      } catch (err) {
        setError(err instanceof Error ? err.message : '登入失敗')
      }
    }

    handleCallback()
  }, [navigate, refreshProfile])

  if (error) {
    return (
      <div className="app-shell min-h-dvh flex flex-col items-center justify-center px-6 text-center">
        <p className="text-sm text-red-500 mb-4">{error}</p>
        <button
          type="button"
          onClick={() => navigate('/login', { replace: true })}
          className="text-sm font-semibold text-[var(--color-primary)]"
        >
          返回登入
        </button>
      </div>
    )
  }

  return (
    <div className="app-shell min-h-dvh flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <span className="w-8 h-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-muted">正在完成登入…</p>
      </div>
    </div>
  )
}
