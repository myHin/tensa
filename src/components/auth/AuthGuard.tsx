import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { getPostAuthPath } from '@/lib/auth-utils'

function LoadingScreen() {
  return (
    <div className="app-shell min-h-dvh flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <span className="w-8 h-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-muted">載入中…</p>
      </div>
    </div>
  )
}

export function RequireAuth() {
  const { session, loading, configured } = useAuth()
  const location = useLocation()

  if (!configured) {
    return <Navigate to="/login" replace state={{ from: location.pathname, configMissing: true }} />
  }

  if (loading) return <LoadingScreen />
  if (!session) return <Navigate to="/login" replace state={{ from: location.pathname }} />

  return <Outlet />
}

export function RequireGuest() {
  const { session, profile, loading, configured } = useAuth()

  if (!configured) return <Outlet />
  if (loading) return <LoadingScreen />
  if (session) return <Navigate to={getPostAuthPath(profile)} replace />

  return <Outlet />
}

export function RequireAppAccess() {
  const { session, profile, loading, configured } = useAuth()
  const location = useLocation()

  if (!configured) {
    return <Navigate to="/login" replace state={{ from: location.pathname, configMissing: true }} />
  }

  if (loading) return <LoadingScreen />
  if (!session) return <Navigate to="/login" replace state={{ from: location.pathname }} />

  if (!profile?.couple_id) {
    return <Navigate to="/pair" replace />
  }

  return <Outlet />
}

export function RequireOnboarding() {
  const { session, loading, configured } = useAuth()
  const location = useLocation()

  if (!configured) {
    return <Navigate to="/login" replace state={{ from: location.pathname, configMissing: true }} />
  }

  if (loading) return <LoadingScreen />
  if (!session) return <Navigate to="/login" replace />

  return <Outlet />
}
