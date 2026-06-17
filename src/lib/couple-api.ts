import { requireSupabase } from '@/lib/supabase'
import type { Couple, Profile } from '@/types/database'
import type { CoupleMemberView, PairingResult } from '@/lib/pairing'

function parsePairingResult(data: unknown): PairingResult {
  if (!data || typeof data !== 'object') return { ok: false, error: 'UNKNOWN' }
  const row = data as Record<string, unknown>
  return {
    ok: Boolean(row.ok),
    couple_id: typeof row.couple_id === 'string' ? row.couple_id : undefined,
    invite_code: typeof row.invite_code === 'string' ? row.invite_code : undefined,
    error: typeof row.error === 'string' ? (row.error as PairingResult['error']) : undefined,
  }
}

export async function rpcCreateCouple(): Promise<PairingResult> {
  const client = requireSupabase()
  const { data, error } = await client.rpc('create_couple')
  if (error) throw error
  return parsePairingResult(data)
}

export async function rpcJoinCouple(inviteCode: string): Promise<PairingResult> {
  const client = requireSupabase()
  const { data, error } = await client.rpc('join_couple', {
    p_invite_code: inviteCode.trim().toUpperCase(),
  })
  if (error) throw error
  return parsePairingResult(data)
}

export async function fetchCouple(coupleId: string): Promise<Couple | null> {
  const client = requireSupabase()
  const { data, error } = await client
    .from('couples')
    .select('*')
    .eq('id', coupleId)
    .maybeSingle()

  if (error) throw error
  return data
}

export async function fetchCoupleMembers(coupleId: string): Promise<Profile[]> {
  const client = requireSupabase()
  const { data, error } = await client
    .from('profiles')
    .select('*')
    .eq('couple_id', coupleId)
    .order('created_at', { ascending: true })

  if (error) throw error
  return data ?? []
}

export async function loadCoupleView(
  userId: string,
  coupleId: string,
): Promise<CoupleMemberView | null> {
  const [couple, members] = await Promise.all([
    fetchCouple(coupleId),
    fetchCoupleMembers(coupleId),
  ])

  if (!couple) return null

  const me = members.find((m) => m.id === userId)
  if (!me) return null

  const partner = members.find((m) => m.id !== userId) ?? null

  return {
    couple,
    me,
    partner,
    memberCount: members.length,
    isPaired: members.length >= 2,
  }
}

export async function updateCoupleAnniversary(coupleId: string, anniversary: string | null) {
  const client = requireSupabase()
  const { error } = await client
    .from('couples')
    .update({ anniversary })
    .eq('id', coupleId)

  if (error) throw error
}
