import type { Profile } from '@/types/database'
import { isProfileCompleteForApp } from '@/types/profile'

export function getPostAuthPath(profile: Profile | null) {
  if (!profile?.couple_id) return '/pair'
  if (!isProfileCompleteForApp(profile)) return '/profile-setup'
  return '/app/home'
}

export function translateAuthError(message: string) {
  const map: Record<string, string> = {
    'Invalid login credentials': '電郵或密碼不正確',
    'User already registered': '此電郵已註冊',
    'Password should be at least 6 characters': '密碼至少需要 6 個字元',
    'Unable to validate email address: invalid format': '電郵格式不正確',
    'Email not confirmed': '請先到電郵確認帳號後再登入',
  }
  return map[message] ?? message
}
