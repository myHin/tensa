import { requireSupabase } from '@/lib/supabase'
import type {
  CycleActionResult,
  CycleLogView,
  CyclePrediction,
  PartnerCycleSnapshot,
} from '@/types/cycle'
import {
  computeCycleLength,
  computeDuration,
  formatDateRange,
  formatPredictionLabel,
} from '@/types/cycle'

function parseActionResult(data: unknown): CycleActionResult {
  if (!data || typeof data !== 'object') return { ok: false, error: 'UNKNOWN' }
  const row = data as Record<string, unknown>
  return {
    ok: Boolean(row.ok),
    error: typeof row.error === 'string' ? row.error : undefined,
  }
}

function parsePrediction(data: unknown): CyclePrediction {
  if (!data || typeof data !== 'object') {
    return { avgCycle: 28, nextPredicted: null, nextPredictedDate: null }
  }
  const row = data as Record<string, unknown>
  const nextDate = typeof row.next_predicted === 'string' ? row.next_predicted : null
  return {
    avgCycle: typeof row.avg_cycle === 'number' ? row.avg_cycle : 28,
    nextPredictedDate: nextDate,
    nextPredicted: formatPredictionLabel(nextDate),
  }
}

function mapPeriodRows(
  rows: Array<{
    id: string
    start_date: string
    end_date: string | null
    note: string
  }>,
): CycleLogView[] {
  const sorted = [...rows].sort(
    (a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime(),
  )

  return sorted.map((row, index) => {
    const previousStart = sorted[index + 1]?.start_date
    return {
      id: row.id,
      startDate: row.start_date,
      endDate: row.end_date,
      range: formatDateRange(row.start_date, row.end_date),
      duration: computeDuration(row.start_date, row.end_date),
      cycleLength: computeCycleLength(row.start_date, previousStart),
      note: row.note,
    }
  })
}

export async function ensureCycleSettings() {
  const client = requireSupabase()
  const { data, error } = await client.rpc('ensure_cycle_settings')
  if (error) throw error
  return data
}

export async function fetchMyCycleSettings() {
  await ensureCycleSettings()
  const client = requireSupabase()
  const { data: userData, error: userError } = await client.auth.getUser()
  if (userError) throw userError
  if (!userData.user) throw new Error('NOT_AUTHENTICATED')

  const { data, error } = await client
    .from('cycle_settings')
    .select('*')
    .eq('user_id', userData.user.id)
    .maybeSingle()

  if (error) throw error
  return data
}

export async function fetchMyCyclePeriods(): Promise<CycleLogView[]> {
  const client = requireSupabase()
  const { data, error } = await client
    .from('cycle_periods')
    .select('id, start_date, end_date, note')
    .order('start_date', { ascending: false })
    .limit(24)

  if (error) throw error
  return mapPeriodRows(data ?? [])
}

export async function fetchMyCyclePrediction(): Promise<CyclePrediction> {
  const client = requireSupabase()
  const { data: userData, error: userError } = await client.auth.getUser()
  if (userError) throw userError
  if (!userData.user) throw new Error('NOT_AUTHENTICATED')

  const { data, error } = await client.rpc('compute_cycle_prediction', {
    p_user_id: userData.user.id,
  })
  if (error) throw error
  return parsePrediction(data)
}

export async function updateCyclePrivacy(
  shareLogs: boolean,
  sharePrediction: boolean,
): Promise<CycleActionResult> {
  const client = requireSupabase()
  const { data, error } = await client.rpc('update_cycle_privacy', {
    p_share_logs: shareLogs,
    p_share_prediction: sharePrediction,
  })
  if (error) throw error
  return parseActionResult(data)
}

export async function startCyclePeriod(): Promise<CycleActionResult> {
  const client = requireSupabase()
  const { data, error } = await client.rpc('start_cycle_period')
  if (error) throw error
  return parseActionResult(data)
}

export async function endCyclePeriod(): Promise<CycleActionResult> {
  const client = requireSupabase()
  const { data, error } = await client.rpc('end_cycle_period')
  if (error) throw error
  return parseActionResult(data)
}

export async function saveCyclePeriod(input: {
  id?: string
  startDate: string
  endDate: string | null
  note?: string
}): Promise<CycleActionResult> {
  const client = requireSupabase()
  const { data, error } = await client.rpc('save_cycle_period', {
    p_start_date: input.startDate,
    p_end_date: input.endDate,
    p_note: input.note ?? '',
    p_id: input.id ?? null,
  })
  if (error) throw error
  return parseActionResult(data)
}

export async function deleteCyclePeriod(id: string): Promise<CycleActionResult> {
  const client = requireSupabase()
  const { data, error } = await client.rpc('delete_cycle_period', { p_id: id })
  if (error) throw error
  return parseActionResult(data)
}

export async function fetchPartnerCycleSnapshot(): Promise<PartnerCycleSnapshot> {
  const client = requireSupabase()
  const { data, error } = await client.rpc('get_partner_cycle_snapshot')
  if (error) throw error

  if (!data || typeof data !== 'object') {
    return {
      hasPartner: false,
      shared: false,
      shareLogs: false,
      sharePrediction: false,
      prediction: null,
      logs: [],
    }
  }

  const row = data as Record<string, unknown>
  const predictionRaw = row.prediction
  const logsRaw = row.logs

  const logsArray = Array.isArray(logsRaw)
    ? logsRaw.map((item) => {
        const log = item as Record<string, unknown>
        return {
          id: String(log.id ?? ''),
          start_date: String(log.start_date ?? ''),
          end_date:
            log.end_date === null || log.end_date === undefined
              ? null
              : String(log.end_date),
          note: typeof log.note === 'string' ? log.note : '',
        }
      })
    : []

  return {
    hasPartner: Boolean(row.has_partner),
    shared: Boolean(row.shared),
    shareLogs: Boolean(row.share_logs),
    sharePrediction: Boolean(row.share_prediction),
    prediction:
      predictionRaw && typeof predictionRaw === 'object'
        ? parsePrediction(predictionRaw)
        : null,
    logs: mapPeriodRows(logsArray),
  }
}

export async function hasActiveCyclePeriod(): Promise<boolean> {
  const client = requireSupabase()
  const { data, error } = await client
    .from('cycle_periods')
    .select('id')
    .is('end_date', null)
    .limit(1)

  if (error) throw error
  return (data?.length ?? 0) > 0
}
