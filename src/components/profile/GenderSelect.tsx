import type { ProfileGender } from '@/types/profile'
import { genderOptions } from '@/types/profile'

interface GenderSelectProps {
  value: ProfileGender | ''
  onChange: (value: ProfileGender) => void
  required?: boolean
}

export function GenderSelect({ value, onChange, required }: GenderSelectProps) {
  return (
    <div>
      <p className="text-sm font-medium mb-2">
        性別{required ? ' *' : ''}
      </p>
      <div className="grid grid-cols-3 gap-2">
        {genderOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={[
              'py-2.5 rounded-[var(--radius-lg)] text-sm font-semibold transition-all',
              value === option.value
                ? 'bg-primary-soft text-[var(--color-primary)] ring-2 ring-[var(--color-primary)]'
                : 'bg-[var(--color-bg-muted)] text-muted',
            ].join(' ')}
          >
            {option.label}
          </button>
        ))}
      </div>
      <p className="text-xs text-muted mt-2 leading-relaxed">
        女性才會顯示生理期記錄功能；男性帳號不會出現「開始生理期」等操作。
      </p>
    </div>
  )
}
