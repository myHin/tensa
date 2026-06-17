import { Card } from '@/components/ui/Card'

export function SupabaseSetupBanner() {
  return (
    <Card padding="md" className="mx-4 mt-4 bg-warning-soft border-none">
      <p className="text-sm font-semibold mb-1">Supabase 尚未設定</p>
      <p className="text-xs leading-relaxed opacity-90">
        複製 <code className="font-mono">.env.example</code> 為{' '}
        <code className="font-mono">.env.local</code>，填入 Supabase URL 與 anon key，
        並在 Supabase SQL Editor 執行 <code className="font-mono">supabase/schema.sql</code>。
      </p>
    </Card>
  )
}
