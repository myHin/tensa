import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ScreenHeader } from '@/components/layout/ScreenHeader'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Toggle } from '@/components/ui/Toggle'
import { CyclePrivacyControls } from '@/components/cycle/CyclePrivacyControls'
import { useTheme } from '@/context/ThemeContext'
import { themePresets } from '@/design-system/themes'
import { useApp } from '@/context/AppContext'
import { useAuth } from '@/context/AuthContext'
import { useCyclePrivacy } from '@/context/CycleContext'

export function SettingsScreen() {
  const navigate = useNavigate()
  const { themeId, mode, setThemeId, toggleMode } = useTheme()
  const { profile, inviteCode } = useApp()
  const { user, signOut, configured } = useAuth()
  const {
    shareLogsWithPartner,
    sharePredictionWithPartner,
  } = useCyclePrivacy()

  return (
    <div>
      <ScreenHeader title="設定" subtitle="個人化你的 App" />

      <div className="px-4 space-y-6 pb-4">
        <section>
          <h2 className="text-sm font-semibold text-muted mb-3 uppercase tracking-wide">情侶資料</h2>
          <Card padding="none">
            <SettingRow label="你的名字" value={profile.name} />
            <SettingRow label="另一半" value={profile.partnerName} border />
            {inviteCode ? (
              <SettingRow label="邀請碼" value={inviteCode} border />
            ) : null}
            {profile.anniversary ? (
              <SettingRow label="交往紀念日" value={profile.anniversary} border />
            ) : (
              <SettingRow label="交往紀念日" value="未設定" border />
            )}
          </Card>
        </section>

        <section>
          <h2 className="text-sm font-semibold text-muted mb-3 uppercase tracking-wide">生理期隱私</h2>
          <CyclePrivacyControls partnerName={profile.partnerName} />
          <p className="text-xs text-muted mt-2 px-1 leading-relaxed">
            目前狀態：
            {shareLogsWithPartner && sharePredictionWithPartner
              ? ` ${profile.partnerName} 可查看記錄與預測`
              : shareLogsWithPartner
                ? ` 僅分享記錄給 ${profile.partnerName}`
                : sharePredictionWithPartner
                  ? ` 僅分享預測給 ${profile.partnerName}`
                  : ' 全部資料僅自己可見'}
          </p>
        </section>

        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-muted uppercase tracking-wide">主題色彩</h2>
            <button
              type="button"
              onClick={toggleMode}
              className="text-xs font-semibold text-[var(--color-primary)]"
            >
              {mode === 'light' ? '🌙 深色模式' : '☀️ 淺色模式'}
            </button>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {themePresets.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => setThemeId(preset.id)}
                className={[
                  'flex flex-col items-center gap-1.5 p-2 rounded-[var(--radius-lg)] transition-all',
                  themeId === preset.id
                    ? 'ring-2 ring-[var(--color-primary)] bg-primary-soft'
                    : 'hover:bg-[var(--color-bg-muted)]',
                ].join(' ')}
              >
                <span
                  className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                  style={{ background: preset.swatch }}
                />
                <span className="text-[10px] font-semibold">{preset.nameZh}</span>
              </button>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-sm font-semibold text-muted mb-3 uppercase tracking-wide">通知</h2>
          <Card padding="none">
            <NotificationToggle label="簽到提醒" defaultOn />
            <NotificationToggle label="紀念日提醒" defaultOn border />
            <NotificationToggle label="生理期預測提醒" border />
          </Card>
        </section>

        <section>
          <h2 className="text-sm font-semibold text-muted mb-3 uppercase tracking-wide">帳號</h2>
          <Card padding="md" className="space-y-2">
            {user?.email && (
              <p className="text-xs text-muted text-center pb-1">{user.email}</p>
            )}
            <Button variant="outline" fullWidth disabled={!configured}>
              Google 帳號已連結
            </Button>
            <Button
              variant="ghost"
              fullWidth
              className="text-red-500"
              disabled={!configured}
              onClick={async () => {
                await signOut()
                navigate('/', { replace: true })
              }}
            >
              登出
            </Button>
          </Card>
        </section>

        <p className="text-center text-xs text-muted pb-2">10-sa · UI Design Prototype v0.1</p>
      </div>
    </div>
  )
}

function SettingRow({ label, value, border }: { label: string; value: string; border?: boolean }) {
  return (
    <div className={['flex items-center justify-between px-4 py-3', border ? 'border-t border-[var(--color-border)]' : ''].join(' ')}>
      <span className="text-sm">{label}</span>
      <span className="text-sm font-semibold text-muted">{value}</span>
    </div>
  )
}

function NotificationToggle({ label, defaultOn, border }: { label: string; defaultOn?: boolean; border?: boolean }) {
  const [on, setOn] = useState(!!defaultOn)

  return (
    <div className={['flex items-center justify-between px-4 py-3', border ? 'border-t border-[var(--color-border)]' : ''].join(' ')}>
      <span className="text-sm">{label}</span>
      <Toggle checked={on} onChange={setOn} label={label} />
    </div>
  )
}
