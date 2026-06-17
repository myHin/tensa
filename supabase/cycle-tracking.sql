-- Run after schema.sql + pairing.sql + daily-features.sql (safe to re-run)

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table if not exists public.cycle_settings (
  user_id uuid primary key references auth.users (id) on delete cascade,
  couple_id uuid not null references public.couples (id) on delete cascade,
  share_logs_with_partner boolean not null default false,
  share_prediction_with_partner boolean not null default false,
  updated_at timestamptz not null default now()
);

create table if not exists public.cycle_periods (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  couple_id uuid not null references public.couples (id) on delete cascade,
  start_date date not null,
  end_date date,
  note text not null default '',
  created_at timestamptz not null default now(),
  check (end_date is null or end_date >= start_date)
);

create index if not exists cycle_periods_user_start_idx
  on public.cycle_periods (user_id, start_date desc);

create index if not exists cycle_settings_couple_idx
  on public.cycle_settings (couple_id);

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------

alter table public.cycle_settings enable row level security;
alter table public.cycle_periods enable row level security;

drop policy if exists "Users manage own cycle settings" on public.cycle_settings;
create policy "Users manage own cycle settings"
on public.cycle_settings for all
to authenticated
using (user_id = auth.uid())
with check (
  user_id = auth.uid()
  and couple_id = public.get_my_couple_id()
);

drop policy if exists "Partners read cycle settings flags" on public.cycle_settings;
create policy "Partners read cycle settings flags"
on public.cycle_settings for select
to authenticated
using (
  couple_id = public.get_my_couple_id()
  and user_id <> auth.uid()
);

drop policy if exists "Users manage own cycle periods" on public.cycle_periods;
create policy "Users manage own cycle periods"
on public.cycle_periods for all
to authenticated
using (user_id = auth.uid())
with check (
  user_id = auth.uid()
  and couple_id = public.get_my_couple_id()
);

drop policy if exists "Partners read shared cycle logs" on public.cycle_periods;
create policy "Partners read shared cycle logs"
on public.cycle_periods for select
to authenticated
using (
  couple_id = public.get_my_couple_id()
  and user_id <> auth.uid()
  and exists (
    select 1
    from public.cycle_settings cs
    where cs.user_id = cycle_periods.user_id
      and cs.share_logs_with_partner = true
  )
);

-- ---------------------------------------------------------------------------
-- Prediction helper
-- ---------------------------------------------------------------------------

create or replace function public.compute_cycle_prediction(p_user_id uuid)
returns json
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_avg integer := 28;
  v_last_start date;
  v_next date;
begin
  select coalesce(round(avg(gap))::integer, 28)
  into v_avg
  from (
    select (start_date - lag(start_date) over (order by start_date)) as gap
    from public.cycle_periods
    where user_id = p_user_id
      and end_date is not null
    order by start_date desc
    limit 12
  ) gaps
  where gap is not null and gap between 15 and 45;

  select start_date
  into v_last_start
  from public.cycle_periods
  where user_id = p_user_id
  order by start_date desc
  limit 1;

  if v_last_start is null then
    return json_build_object('avg_cycle', v_avg, 'next_predicted', null);
  end if;

  v_next := v_last_start + v_avg;

  return json_build_object(
    'avg_cycle', v_avg,
    'next_predicted', v_next
  );
end;
$$;

grant execute on function public.compute_cycle_prediction(uuid) to authenticated;

-- ---------------------------------------------------------------------------
-- Ensure settings row exists
-- ---------------------------------------------------------------------------

create or replace function public.ensure_cycle_settings()
returns public.cycle_settings
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_couple_id uuid := public.get_my_couple_id();
  v_row public.cycle_settings;
begin
  if v_user_id is null or v_couple_id is null then
    raise exception 'NOT_AUTHENTICATED';
  end if;

  select * into v_row from public.cycle_settings where user_id = v_user_id;
  if found then
    return v_row;
  end if;

  insert into public.cycle_settings (user_id, couple_id)
  values (v_user_id, v_couple_id)
  returning * into v_row;

  return v_row;
end;
$$;

grant execute on function public.ensure_cycle_settings() to authenticated;

-- ---------------------------------------------------------------------------
-- Update privacy toggles
-- ---------------------------------------------------------------------------

create or replace function public.update_cycle_privacy(
  p_share_logs boolean,
  p_share_prediction boolean
)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_couple_id uuid := public.get_my_couple_id();
begin
  if v_user_id is null or v_couple_id is null then
    return json_build_object('ok', false, 'error', 'NOT_AUTHENTICATED');
  end if;

  insert into public.cycle_settings (user_id, couple_id, share_logs_with_partner, share_prediction_with_partner)
  values (v_user_id, v_couple_id, p_share_logs, p_share_prediction)
  on conflict (user_id) do update
  set
    share_logs_with_partner = excluded.share_logs_with_partner,
    share_prediction_with_partner = excluded.share_prediction_with_partner,
    updated_at = now();

  return json_build_object('ok', true);
end;
$$;

grant execute on function public.update_cycle_privacy(boolean, boolean) to authenticated;

-- ---------------------------------------------------------------------------
-- Start / end period
-- ---------------------------------------------------------------------------

create or replace function public.start_cycle_period()
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_couple_id uuid := public.get_my_couple_id();
  v_today date := (timezone('utc', now()))::date;
  v_id uuid;
begin
  if v_user_id is null or v_couple_id is null then
    return json_build_object('ok', false, 'error', 'NOT_AUTHENTICATED');
  end if;

  perform public.ensure_cycle_settings();

  if exists (
    select 1 from public.cycle_periods
    where user_id = v_user_id and end_date is null
  ) then
    return json_build_object('ok', false, 'error', 'ALREADY_ACTIVE');
  end if;

  insert into public.cycle_periods (user_id, couple_id, start_date)
  values (v_user_id, v_couple_id, v_today)
  returning id into v_id;

  return json_build_object('ok', true, 'id', v_id);
end;
$$;

grant execute on function public.start_cycle_period() to authenticated;

create or replace function public.end_cycle_period()
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_today date := (timezone('utc', now()))::date;
  v_id uuid;
begin
  if v_user_id is null then
    return json_build_object('ok', false, 'error', 'NOT_AUTHENTICATED');
  end if;

  update public.cycle_periods
  set end_date = v_today
  where id = (
    select id from public.cycle_periods
    where user_id = v_user_id and end_date is null
    order by start_date desc
    limit 1
  )
  returning id into v_id;

  if v_id is null then
    return json_build_object('ok', false, 'error', 'NO_ACTIVE_PERIOD');
  end if;

  return json_build_object('ok', true, 'id', v_id);
end;
$$;

grant execute on function public.end_cycle_period() to authenticated;

-- ---------------------------------------------------------------------------
-- Partner snapshot (respects partner privacy flags)
-- ---------------------------------------------------------------------------

create or replace function public.get_partner_cycle_snapshot()
returns json
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_couple_id uuid := public.get_my_couple_id();
  v_partner_id uuid;
  v_settings public.cycle_settings;
  v_prediction json;
  v_logs json;
begin
  if v_user_id is null or v_couple_id is null then
    return json_build_object('ok', false, 'error', 'NOT_AUTHENTICATED');
  end if;

  select id into v_partner_id
  from public.profiles
  where couple_id = v_couple_id and id <> v_user_id
  limit 1;

  if v_partner_id is null then
    return json_build_object('ok', true, 'has_partner', false);
  end if;

  select * into v_settings
  from public.cycle_settings
  where user_id = v_partner_id;

  if not found
    or (not v_settings.share_logs_with_partner and not v_settings.share_prediction_with_partner)
  then
    return json_build_object(
      'ok', true,
      'has_partner', true,
      'shared', false,
      'partner_id', v_partner_id
    );
  end if;

  v_prediction := null;
  if v_settings.share_prediction_with_partner then
    v_prediction := public.compute_cycle_prediction(v_partner_id);
  end if;

  v_logs := '[]'::json;
  if v_settings.share_logs_with_partner then
    select coalesce(json_agg(row_to_json(t)), '[]'::json)
    into v_logs
    from (
      select
        id,
        start_date,
        end_date,
        note,
        case
          when end_date is not null then (end_date - start_date + 1)
          else null
        end as duration_days
      from public.cycle_periods
      where user_id = v_partner_id
      order by start_date desc
      limit 12
    ) t;
  end if;

  return json_build_object(
    'ok', true,
    'has_partner', true,
    'shared', true,
    'partner_id', v_partner_id,
    'share_logs', v_settings.share_logs_with_partner,
    'share_prediction', v_settings.share_prediction_with_partner,
    'prediction', v_prediction,
    'logs', v_logs
  );
end;
$$;

grant execute on function public.get_partner_cycle_snapshot() to authenticated;
