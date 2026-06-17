import { Card } from '@/components/ui/Card'
import { Toggle } from '@/components/ui/Toggle'
import { useCyclePrivacy } from '@/context/CycleContext'

interface CyclePrivacyControlsProps {
  partnerName: string
  compact?: boolean
}

export function CyclePrivacyControls({ partnerName, compact }: CyclePrivacyControlsProps) {
  const {
    shareLogsWithPartner,
    sharePredictionWithPartner,
    setShareLogsWithPartner,
    setSharePredictionWithPartner,
  } = useCyclePrivacy()

  const anyShared = shareLogsWithPartner || sharePredictionWithPartner

  if (compact) {
    return (
      <Card padding="sm" className="bg-[var(--color-bg-muted)] border-none space-y-3">
        <PrivacyToggleRow
          label="分享生理期記錄"
          hint={`${partnerName} 可查看你的記錄`}
          checked={shareLogsWithPartner}
          onChange={(value) => void setShareLogsWithPartner(value)}
        />
        <PrivacyToggleRow
          label="分享週期預測"
          hint={`${partnerName} 可查看 AI 預測`}
          checked={sharePredictionWithPartner}
          onChange={(value) => void setSharePredictionWithPartner(value)}
          border
        />
      </Card>
    )
  }

  return (
    <Card padding="md" className="space-y-1">
      <div className="mb-3">
        <h3 className="font-semibold text-sm">分享設定</h3>
        <p className="text-xs text-muted mt-0.5">
          {anyShared
            ? `${partnerName} 可查看你允許的項目`
            : '預設僅自己可見，你可選擇性開放給另一半'}
        </p>
      </div>
      <PrivacyToggleRow
        label="允許查看生理期記錄"
        hint="包含開始/結束日期與最近紀錄"
        checked={shareLogsWithPartner}
        onChange={(value) => void setShareLogsWithPartner(value)}
      />
      <PrivacyToggleRow
        label="允許查看週期預測"
        hint="包含下次生理期預測與 AI 監測"
        checked={sharePredictionWithPartner}
        onChange={(value) => void setSharePredictionWithPartner(value)}
        border
      />
    </Card>
  )
}

function PrivacyToggleRow({
  label,
  hint,
  checked,
  onChange,
  border,
}: {
  label: string
  hint: string
  checked: boolean
  onChange: (value: boolean) => void
  border?: boolean
}) {
  return (
    <div
      className={[
        'flex items-center justify-between gap-3 py-3',
        border ? 'border-t border-[var(--color-border)]' : '',
      ].join(' ')}
    >
      <div className="min-w-0">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted">{hint}</p>
      </div>
      <Toggle checked={checked} onChange={onChange} label={label} />
    </div>
  )
}
