-- Run after cycle-tracking.sql (safe to re-run)

-- Manual add / edit / delete period records (backfill, fix forgotten start/end)

create or replace function public.save_cycle_period(
  p_start_date date,
  p_end_date date default null,
  p_note text default '',
  p_id uuid default null
)
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
  v_end_for_overlap date;
begin
  if v_user_id is null or v_couple_id is null then
    return json_build_object('ok', false, 'error', 'NOT_AUTHENTICATED');
  end if;

  if p_start_date is null then
    return json_build_object('ok', false, 'error', 'START_REQUIRED');
  end if;

  if p_start_date > v_today then
    return json_build_object('ok', false, 'error', 'START_IN_FUTURE');
  end if;

  if p_end_date is not null and p_end_date > v_today then
    return json_build_object('ok', false, 'error', 'END_IN_FUTURE');
  end if;

  if p_end_date is not null and p_end_date < p_start_date then
    return json_build_object('ok', false, 'error', 'INVALID_RANGE');
  end if;

  perform public.ensure_cycle_settings();

  v_end_for_overlap := coalesce(p_end_date, v_today);

  if exists (
    select 1
    from public.cycle_periods cp
    where cp.user_id = v_user_id
      and (p_id is null or cp.id <> p_id)
      and daterange(
        cp.start_date,
        coalesce(cp.end_date, v_today),
        '[]'
      ) && daterange(p_start_date, v_end_for_overlap, '[]')
  ) then
    return json_build_object('ok', false, 'error', 'OVERLAP');
  end if;

  if p_end_date is null and exists (
    select 1
    from public.cycle_periods
    where user_id = v_user_id
      and end_date is null
      and (p_id is null or id <> p_id)
  ) then
    return json_build_object('ok', false, 'error', 'ALREADY_ACTIVE');
  end if;

  if p_id is null then
    insert into public.cycle_periods (user_id, couple_id, start_date, end_date, note)
    values (v_user_id, v_couple_id, p_start_date, p_end_date, coalesce(trim(p_note), ''))
    returning id into v_id;
  else
    update public.cycle_periods
    set
      start_date = p_start_date,
      end_date = p_end_date,
      note = coalesce(trim(p_note), '')
    where id = p_id
      and user_id = v_user_id
    returning id into v_id;

    if v_id is null then
      return json_build_object('ok', false, 'error', 'NOT_FOUND');
    end if;
  end if;

  return json_build_object('ok', true, 'id', v_id);
end;
$$;

grant execute on function public.save_cycle_period(date, date, text, uuid) to authenticated;

create or replace function public.delete_cycle_period(p_id uuid)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_deleted uuid;
begin
  if v_user_id is null then
    return json_build_object('ok', false, 'error', 'NOT_AUTHENTICATED');
  end if;

  if p_id is null then
    return json_build_object('ok', false, 'error', 'NOT_FOUND');
  end if;

  delete from public.cycle_periods
  where id = p_id and user_id = v_user_id
  returning id into v_deleted;

  if v_deleted is null then
    return json_build_object('ok', false, 'error', 'NOT_FOUND');
  end if;

  return json_build_object('ok', true, 'id', v_deleted);
end;
$$;

grant execute on function public.delete_cycle_period(uuid) to authenticated;
