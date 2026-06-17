-- Run after schema.sql (safe to re-run)

-- Invite code generator (excludes ambiguous chars)
create or replace function public.generate_invite_code()
returns text
language plpgsql
as $$
declare
  chars text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  result text := '';
  i int;
begin
  for i in 1..6 loop
    result := result || substr(chars, 1 + floor(random() * length(chars))::int, 1);
  end loop;
  return result;
end;
$$;

-- Create a couple space and link current user
create or replace function public.create_couple()
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_couple_id uuid;
  v_code text;
  v_attempts int := 0;
begin
  if v_user_id is null then
    return json_build_object('ok', false, 'error', 'NOT_AUTHENTICATED');
  end if;

  if exists (
    select 1 from public.profiles
    where id = v_user_id and couple_id is not null
  ) then
    return json_build_object('ok', false, 'error', 'ALREADY_PAIRED');
  end if;

  loop
    v_code := public.generate_invite_code();
    exit when not exists (select 1 from public.couples where invite_code = v_code);
    v_attempts := v_attempts + 1;
    if v_attempts > 30 then
      return json_build_object('ok', false, 'error', 'CODE_GENERATION_FAILED');
    end if;
  end loop;

  insert into public.couples (invite_code)
  values (v_code)
  returning id into v_couple_id;

  update public.profiles
  set couple_id = v_couple_id
  where id = v_user_id;

  return json_build_object(
    'ok', true,
    'couple_id', v_couple_id,
    'invite_code', v_code
  );
end;
$$;

-- Join an existing couple by invite code
create or replace function public.join_couple(p_invite_code text)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_couple_id uuid;
  v_member_count int;
  v_code text := upper(trim(p_invite_code));
begin
  if v_user_id is null then
    return json_build_object('ok', false, 'error', 'NOT_AUTHENTICATED');
  end if;

  if v_code is null or length(v_code) < 4 then
    return json_build_object('ok', false, 'error', 'INVALID_CODE');
  end if;

  if exists (
    select 1 from public.profiles
    where id = v_user_id and couple_id is not null
  ) then
    return json_build_object('ok', false, 'error', 'ALREADY_PAIRED');
  end if;

  select id into v_couple_id
  from public.couples
  where invite_code = v_code;

  if v_couple_id is null then
    return json_build_object('ok', false, 'error', 'INVALID_CODE');
  end if;

  select count(*) into v_member_count
  from public.profiles
  where couple_id = v_couple_id;

  if v_member_count >= 2 then
    return json_build_object('ok', false, 'error', 'COUPLE_FULL');
  end if;

  update public.profiles
  set couple_id = v_couple_id
  where id = v_user_id;

  return json_build_object(
    'ok', true,
    'couple_id', v_couple_id,
    'invite_code', v_code
  );
end;
$$;

grant execute on function public.create_couple() to authenticated;
grant execute on function public.join_couple(text) to authenticated;

-- Helper bypasses RLS to avoid infinite recursion in policies
create or replace function public.get_my_couple_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select couple_id from public.profiles where id = auth.uid();
$$;

grant execute on function public.get_my_couple_id() to authenticated;

-- RLS: replace permissive couple read + narrow profile read
drop policy if exists "Authenticated users can read couples" on public.couples;
drop policy if exists "Users can view own profile" on public.profiles;
drop policy if exists "Users can view own and partner profile" on public.profiles;
drop policy if exists "Members can view their couple" on public.couples;
drop policy if exists "Members can update their couple" on public.couples;

create policy "Members can view their couple"
on public.couples for select
to authenticated
using (id = public.get_my_couple_id());

create policy "Members can update their couple"
on public.couples for update
to authenticated
using (id = public.get_my_couple_id())
with check (id = public.get_my_couple_id());

create policy "Users can view own and partner profile"
on public.profiles for select
to authenticated
using (
  id = auth.uid()
  or (
    couple_id is not null
    and couple_id = public.get_my_couple_id()
  )
);
