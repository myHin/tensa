import type { Profile, Couple } from '@/types/database'

export type PairingErrorCode =
  | 'NOT_AUTHENTICATED'
  | 'ALREADY_PAIRED'
  | 'INVALID_CODE'
  | 'COUPLE_FULL'
  | 'CODE_GENERATION_FAILED'
  | 'UNKNOWN'

export interface PairingResult {
  ok: boolean
  couple_id?: string
  invite_code?: string
  error?: PairingErrorCode
}

export function translatePairingError(code: PairingErrorCode | string | undefined) {
  const map: Record<string, string> = {
    NOT_AUTHENTICATED: '請先登入',
    ALREADY_PAIRED: '你已經在情侶空間中',
    INVALID_CODE: '邀請碼不存在，請再確認',
    COUPLE_FULL: '此邀請碼的情侶空間已滿',
    CODE_GENERATION_FAILED: '無法產生邀請碼，請稍後再試',
  }
  return map[code ?? ''] ?? '配對失敗，請稍後再試'
}

export interface CoupleMemberView {
  couple: Couple
  me: Profile
  partner: Profile | null
  memberCount: number
  isPaired: boolean
}
