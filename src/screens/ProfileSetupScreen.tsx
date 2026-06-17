import { useState, useEffect, type FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { GenderSelect } from '@/components/profile/GenderSelect'
import { ScreenHeader } from '@/components/layout/ScreenHeader'
import { useAuth } from '@/context/AuthContext'
import { useCouple } from '@/context/CoupleContext'
import { useApp } from '@/context/AppContext'
import { requireSupabase } from '@/lib/supabase'
import type { ProfileGender } from '@/types/profile'
import { canTrackOwnMenstrualCycle } from '@/types/profile'

export function ProfileSetupScreen() {
  const navigate = useNavigate()
  const location = useLocation()
  const fromSettings = (location.state as { from?: string } | null)?.from === 'settings'
  const { user, profile, refreshProfile } = useAuth()
  const { partner, saveAnniversary } = useCouple()
  const { profile: appProfile } = useApp()

  const [displayName, setDisplayName] = useState(profile?.display_name ?? '')
  const [gender, setGender] = useState<ProfileGender | ''>(profile?.gender ?? '')
  const [birthday, setBirthday] = useState(profile?.birthday ?? '')
  const [anniversary, setAnniversary] = useState(appProfile.anniversary)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setDisplayName(profile?.display_name ?? '')
    setGender(profile?.gender ?? '')
    setBirthday(profile?.birthday ?? '')
    setAnniversary(appProfile.anniversary)
  }, [profile, appProfile.anniversary])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!user) return
    if (!gender) {
      setError('請選擇性別')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const client = requireSupabase()
      const { error: updateError } = await client
        .from('profiles')
        .update({
          display_name: displayName.trim(),
          birthday: birthday || null,
          gender,
        })
        .eq('id', user.id)

      if (updateError) throw updateError

      if (anniversary) {
        await saveAnniversary(anniversary)
      }

      await refreshProfile()
      navigate(fromSettings ? '/app/settings' : '/app/home', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : '儲存失敗')
    } finally {
      setLoading(false)
    }
  }

  const tracksCycle = gender ? canTrackOwnMenstrualCycle(gender) : false

  return (
    <div className="flex-1 flex flex-col">
      <ScreenHeader
        title="個人資料"
        subtitle="讓 App 記住你們的重要日子"
        backTo={fromSettings ? '/app/settings' : '/pair'}
      />

      <motion.form
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="flex-1 px-4 flex flex-col gap-4 overflow-y-auto pb-6"
      >
        <Input
          label="你的暱稱"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          required
        />

        <GenderSelect value={gender} onChange={setGender} required />

        <Input
          label="另一半暱稱"
          value={partner?.display_name ?? appProfile.partnerName}
          disabled
          hint={partner ? '已配對' : '另一半加入後會自動顯示'}
        />
        <Input
          label="交往紀念日"
          type="date"
          value={anniversary}
          onChange={(e) => setAnniversary(e.target.value)}
        />
        <Input
          label="你的生日"
          type="date"
          value={birthday}
          onChange={(e) => setBirthday(e.target.value)}
        />
        <Input
          label="另一半生日"
          type="date"
          value={partner?.birthday ?? appProfile.partnerBirthday}
          disabled
          hint="由對方在自己的帳號中設定"
        />

        <div className="mt-2 p-4 rounded-[var(--radius-xl)] bg-[var(--color-bg-muted)]">
          <p className="text-sm font-semibold mb-1">隱私提示</p>
          <p className="text-xs text-muted leading-relaxed">
            {tracksCycle
              ? '生理期等敏感資料可在之後自行設定分享範圍，預設僅自己可見。'
              : gender === 'male'
                ? '男性帳號不會顯示生理期記錄功能。若另一半有分享，可在日曆查看。'
                : '請選擇性別以個人化 App 功能。'}
          </p>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <Button fullWidth size="lg" className="mt-4" type="submit" loading={loading}>
          {fromSettings ? '儲存' : '完成，進入主頁'}
        </Button>
      </motion.form>
    </div>
  )
}
