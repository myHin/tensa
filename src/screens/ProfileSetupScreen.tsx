import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { ScreenHeader } from '@/components/layout/ScreenHeader'

export function ProfileSetupScreen() {
  const navigate = useNavigate()

  return (
    <div className="flex-1 flex flex-col">
      <ScreenHeader title="個人資料" subtitle="讓 App 記住你們的重要日子" backTo="/pair" />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1 px-4 flex flex-col gap-4 overflow-y-auto pb-6"
      >
        <Input label="你的暱稱" defaultValue="Alex" />
        <Input label="另一半暱稱" defaultValue="Jamie" />
        <Input label="交往紀念日" type="date" defaultValue="2016-06-16" />
        <Input label="你的生日" type="date" defaultValue="1995-03-12" />
        <Input label="另一半生日" type="date" defaultValue="1996-08-22" />

        <div className="mt-2 p-4 rounded-[var(--radius-xl)] bg-[var(--color-bg-muted)]">
          <p className="text-sm font-semibold mb-1">隱私提示</p>
          <p className="text-xs text-muted leading-relaxed">
            生理期等敏感資料可在之後自行設定分享範圍，預設僅自己可見。
          </p>
        </div>

        <Button fullWidth size="lg" className="mt-4" onClick={() => navigate('/app/home')}>
          完成，進入主頁
        </Button>
      </motion.div>
    </div>
  )
}
