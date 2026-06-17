import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { isSupabaseConfigured, requireSupabase } from '@/lib/supabase'
import type { Profile } from '@/types/database'

interface AuthContextValue {
  user: User | null
  session: Session | null
  profile: Profile | null
  loading: boolean
  configured: boolean
  signInWithEmail: (email: string, password: string) => Promise<{ error: string | null }>
  signUpWithEmail: (
    email: string,
    password: string,
    displayName: string,
  ) => Promise<{ error: string | null; needsEmailConfirmation: boolean }>
  signInWithGoogle: () => Promise<{ error: string | null }>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<Profile | null>
}

const AuthContext = createContext<AuthContextValue | null>(null)

async function fetchProfile(userId: string): Promise<Profile | null> {
  const client = requireSupabase()
  const { data, error } = await client
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle()

  if (error) throw error
  return data
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(isSupabaseConfigured)

  const refreshProfile = useCallback(async () => {
    if (!user) {
      setProfile(null)
      return null
    }
    const next = await fetchProfile(user.id)
    setProfile(next)
    return next
  }, [user])

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false)
      return
    }

    const client = requireSupabase()
    let mounted = true

    async function initSession() {
      const { data, error } = await client.auth.getSession()
      if (!mounted) return
      if (error) {
        console.error(error)
        setLoading(false)
        return
      }

      const currentSession = data.session
      setSession(currentSession)
      setUser(currentSession?.user ?? null)

      if (currentSession?.user) {
        try {
          const nextProfile = await fetchProfile(currentSession.user.id)
          if (mounted) setProfile(nextProfile)
        } catch (err) {
          console.error(err)
        }
      }

      if (mounted) setLoading(false)
    }

    initSession()

    const {
      data: { subscription },
    } = client.auth.onAuthStateChange(async (_event, nextSession) => {
      setSession(nextSession)
      setUser(nextSession?.user ?? null)

      if (nextSession?.user) {
        try {
          const nextProfile = await fetchProfile(nextSession.user.id)
          setProfile(nextProfile)
        } catch (err) {
          console.error(err)
          setProfile(null)
        }
      } else {
        setProfile(null)
      }

      setLoading(false)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    try {
      const client = requireSupabase()
      const { error } = await client.auth.signInWithPassword({ email, password })
      return { error: error?.message ?? null }
    } catch (err) {
      return { error: err instanceof Error ? err.message : '登入失敗' }
    }
  }, [])

  const signUpWithEmail = useCallback(
    async (email: string, password: string, displayName: string) => {
      try {
        const client = requireSupabase()
        const { data, error } = await client.auth.signUp({
          email,
          password,
          options: {
            data: { display_name: displayName.trim() },
          },
        })
        return {
          error: error?.message ?? null,
          needsEmailConfirmation: Boolean(data.user && !data.session),
        }
      } catch (err) {
        return {
          error: err instanceof Error ? err.message : '註冊失敗',
          needsEmailConfirmation: false,
        }
      }
    },
    [],
  )

  const signInWithGoogle = useCallback(async () => {
    try {
      const client = requireSupabase()
      const { error } = await client.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      return { error: error?.message ?? null }
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Google 登入失敗' }
    }
  }, [])

  const signOut = useCallback(async () => {
    const client = requireSupabase()
    await client.auth.signOut()
    setProfile(null)
  }, [])

  const value = useMemo(
    () => ({
      user,
      session,
      profile,
      loading,
      configured: isSupabaseConfigured,
      signInWithEmail,
      signUpWithEmail,
      signInWithGoogle,
      signOut,
      refreshProfile,
    }),
    [
      user,
      session,
      profile,
      loading,
      signInWithEmail,
      signUpWithEmail,
      signInWithGoogle,
      signOut,
      refreshProfile,
    ],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
