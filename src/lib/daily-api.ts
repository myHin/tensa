import { requireSupabase } from '@/lib/supabase'
import type { ActionResult } from '@/types/daily'
import type { MealType } from '@/types/meal'

function parseActionResult(data: unknown): ActionResult {
  if (!data || typeof data !== 'object') return { ok: false, error: 'UNKNOWN' }
  const row = data as Record<string, unknown>
  return {
    ok: Boolean(row.ok),
    error: typeof row.error === 'string' ? row.error : undefined,
    points: typeof row.points === 'number' ? row.points : undefined,
    title: typeof row.title === 'string' ? row.title : undefined,
  }
}

export async function seedCoupleDefaults(coupleId: string) {
  const client = requireSupabase()
  const { error } = await client.rpc('seed_couple_defaults', { p_couple_id: coupleId })
  if (error) throw error
}

export async function fetchCouplePoints(coupleId: string): Promise<number> {
  const client = requireSupabase()
  const { data, error } = await client.rpc('get_couple_points', { p_couple_id: coupleId })
  if (error) throw error
  return typeof data === 'number' ? data : 0
}

export async function completeCheckIn(slug: string): Promise<ActionResult> {
  const client = requireSupabase()
  const { data, error } = await client.rpc('complete_check_in', { p_slug: slug })
  if (error) throw error
  return parseActionResult(data)
}

export async function submitMealRecord(
  photoPath: string,
  caption: string,
  mealType: MealType,
): Promise<ActionResult> {
  const client = requireSupabase()
  const { data, error } = await client.rpc('submit_meal', {
    p_photo_path: photoPath,
    p_caption: caption,
    p_meal_type: mealType,
  })
  if (error) throw error
  return parseActionResult(data)
}

export async function redeemReward(rewardId: string): Promise<ActionResult> {
  const client = requireSupabase()
  const { data, error } = await client.rpc('redeem_reward', { p_reward_id: rewardId })
  if (error) throw error
  return parseActionResult(data)
}

export async function uploadMealPhoto(coupleId: string, userId: string, file: File) {
  const client = requireSupabase()
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const path = `${coupleId}/${userId}/${Date.now()}.${ext}`

  const { error } = await client.storage.from('meal-photos').upload(path, file, {
    cacheControl: '3600',
    upsert: false,
    contentType: file.type || 'image/jpeg',
  })

  if (error) throw error
  return path
}

export async function getMealPhotoUrl(photoPath: string): Promise<string> {
  const client = requireSupabase()
  const { data, error } = await client.storage
    .from('meal-photos')
    .createSignedUrl(photoPath, 60 * 60 * 24)

  if (error) throw error
  return data.signedUrl
}

export function todayKey() {
  return new Date().toISOString().slice(0, 10)
}

export function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('zh-Hant', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

export function formatDateLabel(dateStr: string) {
  const today = todayKey()
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayKey = yesterday.toISOString().slice(0, 10)

  if (dateStr === today) return '今天'
  if (dateStr === yesterdayKey) return '昨天'

  const [, month, day] = dateStr.split('-')
  return `${Number(month)}/${Number(day)}`
}

export function formatTransactionTime(iso: string) {
  const date = new Date(iso)
  const today = new Date()
  const isToday =
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()

  if (isToday) {
    return `今天 ${formatTime(iso)}`
  }

  return `${date.getMonth() + 1}/${date.getDate()}`
}
