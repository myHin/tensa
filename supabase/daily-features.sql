-- Run after schema.sql + pairing.sql (safe to re-run)

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table if not exists public.check_in_templates (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid not null references public.couples (id) on delete cascade,
  slug text not null,
  emoji text not null default '✓',
  title text not null,
  description text not null default '',
  points integer not null default 20 check (points > 0),
  schedule text not null default '每日一次',
  active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (couple_id, slug)
);

create table if not exists public.check_in_logs (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid not null references public.couples (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  template_id uuid not null references public.check_in_templates (id) on delete cascade,
  log_date date not null default (timezone('utc', now()))::date,
  created_at timestamptz not null default now(),
  unique (user_id, template_id, log_date)
);

create table if not exists public.meal_records (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid not null references public.couples (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  photo_path text not null,
  caption text not null default '',
  meal_type text not null check (meal_type in ('breakfast', 'lunch', 'dinner', 'snack')),
  points integer not null default 30 check (points > 0),
  log_date date not null default (timezone('utc', now()))::date,
  created_at timestamptz not null default now(),
  unique (user_id, log_date)
);

create table if not exists public.point_transactions (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid not null references public.couples (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  amount integer not null check (amount <> 0),
  label text not null,
  source_type text not null,
  source_id uuid,
  created_at timestamptz not null default now()
);

create table if not exists public.rewards (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid not null references public.couples (id) on delete cascade,
  emoji text not null default '🎁',
  title text not null,
  description text not null default '',
  cost integer not null check (cost > 0),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists check_in_logs_couple_date_idx
  on public.check_in_logs (couple_id, log_date desc);

create index if not exists meal_records_couple_date_idx
  on public.meal_records (couple_id, log_date desc);

create index if not exists point_transactions_couple_idx
  on public.point_transactions (couple_id, created_at desc);

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------

alter table public.check_in_templates enable row level security;
alter table public.check_in_logs enable row level security;
alter table public.meal_records enable row level security;
alter table public.point_transactions enable row level security;
alter table public.rewards enable row level security;

drop policy if exists "Couple members manage templates" on public.check_in_templates;
create policy "Couple members manage templates"
on public.check_in_templates for all
to authenticated
using (couple_id = public.get_my_couple_id())
with check (couple_id = public.get_my_couple_id());

drop policy if exists "Couple members manage logs" on public.check_in_logs;
create policy "Couple members manage logs"
on public.check_in_logs for all
to authenticated
using (couple_id = public.get_my_couple_id())
with check (couple_id = public.get_my_couple_id());

drop policy if exists "Couple members manage meals" on public.meal_records;
create policy "Couple members manage meals"
on public.meal_records for all
to authenticated
using (couple_id = public.get_my_couple_id())
with check (couple_id = public.get_my_couple_id());

drop policy if exists "Couple members view transactions" on public.point_transactions;
create policy "Couple members view transactions"
on public.point_transactions for select
to authenticated
using (couple_id = public.get_my_couple_id());

drop policy if exists "Couple members manage rewards" on public.rewards;
create policy "Couple members manage rewards"
on public.rewards for all
to authenticated
using (couple_id = public.get_my_couple_id())
with check (couple_id = public.get_my_couple_id());

-- ---------------------------------------------------------------------------
-- Storage bucket for meal photos
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('meal-photos', 'meal-photos', false)
on conflict (id) do nothing;

drop policy if exists "Couple members upload meal photos" on storage.objects;
create policy "Couple members upload meal photos"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'meal-photos'
  and (storage.foldername(name))[1] = public.get_my_couple_id()::text
  and (storage.foldername(name))[2] = auth.uid()::text
);

drop policy if exists "Couple members read meal photos" on storage.objects;
create policy "Couple members read meal photos"
on storage.objects for select
to authenticated
using (
  bucket_id = 'meal-photos'
  and (storage.foldername(name))[1] = public.get_my_couple_id()::text
);

drop policy if exists "Users update own meal photos" on storage.objects;
create policy "Users update own meal photos"
on storage.objects for update
to authenticated
using (
  bucket_id = 'meal-photos'
  and (storage.foldername(name))[1] = public.get_my_couple_id()::text
  and (storage.foldername(name))[2] = auth.uid()::text
);

-- ---------------------------------------------------------------------------
-- Seed defaults for a couple
-- ---------------------------------------------------------------------------

create or replace function public.seed_couple_defaults(p_couple_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_couple_id is null then
    return;
  end if;

  insert into public.check_in_templates (couple_id, slug, emoji, title, description, points, schedule)
  values
    (p_couple_id, 'meal', '🍽️', '每日一餐', '各自分享今天的一餐，不用一起吃也可以', 30, '每人每日一次'),
    (p_couple_id, 'brush', '🪥', '睡前刷牙', '每晚記得刷牙再睡覺', 20, '每日 22:00'),
    (p_couple_id, 'water', '💧', '喝夠 8 杯水', '各自追蹤，完成可賺點數', 15, '每日一次')
  on conflict (couple_id, slug) do nothing;

  insert into public.rewards (couple_id, emoji, title, description, cost)
  select p_couple_id, v.emoji, v.title, v.description, v.cost
  from (values
    ('☕', '請喝手搖飲', '兌換一杯對方指定的飲料', 200),
    ('🎬', '電影約會', '由對方安排一場電影之夜', 500),
    ('🍰', '小蛋糕驚喜', '換一份小甜點', 300)
  ) as v(emoji, title, description, cost)
  where not exists (select 1 from public.rewards where couple_id = p_couple_id);
end;
$$;

grant execute on function public.seed_couple_defaults(uuid) to authenticated;

-- ---------------------------------------------------------------------------
-- Points helper
-- ---------------------------------------------------------------------------

create or replace function public.get_couple_points(p_couple_id uuid)
returns integer
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(sum(amount), 0)::integer
  from public.point_transactions
  where couple_id = p_couple_id;
$$;

grant execute on function public.get_couple_points(uuid) to authenticated;

-- ---------------------------------------------------------------------------
-- Complete a non-meal check-in
-- ---------------------------------------------------------------------------

create or replace function public.complete_check_in(p_slug text)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_couple_id uuid := public.get_my_couple_id();
  v_template public.check_in_templates%rowtype;
  v_today date := (timezone('utc', now()))::date;
begin
  if v_user_id is null or v_couple_id is null then
    return json_build_object('ok', false, 'error', 'NOT_AUTHENTICATED');
  end if;

  if p_slug = 'meal' then
    return json_build_object('ok', false, 'error', 'USE_MEAL_FLOW');
  end if;

  select * into v_template
  from public.check_in_templates
  where couple_id = v_couple_id and slug = p_slug and active = true;

  if not found then
    return json_build_object('ok', false, 'error', 'TEMPLATE_NOT_FOUND');
  end if;

  if exists (
    select 1 from public.check_in_logs
    where user_id = v_user_id and template_id = v_template.id and log_date = v_today
  ) then
    return json_build_object('ok', false, 'error', 'ALREADY_COMPLETED');
  end if;

  insert into public.check_in_logs (couple_id, user_id, template_id, log_date)
  values (v_couple_id, v_user_id, v_template.id, v_today);

  insert into public.point_transactions (couple_id, user_id, amount, label, source_type, source_id)
  values (
    v_couple_id,
    v_user_id,
    v_template.points,
    v_template.title || '打卡',
    'check_in',
    v_template.id
  );

  return json_build_object(
    'ok', true,
    'points', v_template.points,
    'slug', v_template.slug,
    'title', v_template.title
  );
end;
$$;

grant execute on function public.complete_check_in(text) to authenticated;

-- ---------------------------------------------------------------------------
-- Submit meal share (photo already uploaded to storage)
-- ---------------------------------------------------------------------------

create or replace function public.submit_meal(
  p_photo_path text,
  p_caption text,
  p_meal_type text
)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_couple_id uuid := public.get_my_couple_id();
  v_template public.check_in_templates%rowtype;
  v_today date := (timezone('utc', now()))::date;
  v_meal_id uuid;
  v_points integer := 30;
begin
  if v_user_id is null or v_couple_id is null then
    return json_build_object('ok', false, 'error', 'NOT_AUTHENTICATED');
  end if;

  if p_photo_path is null or length(trim(p_photo_path)) = 0 then
    return json_build_object('ok', false, 'error', 'PHOTO_REQUIRED');
  end if;

  if exists (
    select 1 from public.meal_records
    where user_id = v_user_id and log_date = v_today
  ) then
    return json_build_object('ok', false, 'error', 'ALREADY_COMPLETED');
  end if;

  select * into v_template
  from public.check_in_templates
  where couple_id = v_couple_id and slug = 'meal' and active = true;

  if found then
    v_points := v_template.points;
  end if;

  insert into public.meal_records (
    couple_id, user_id, photo_path, caption, meal_type, points, log_date
  )
  values (
    v_couple_id,
    v_user_id,
    p_photo_path,
    coalesce(nullif(trim(p_caption), ''), '今日的一餐'),
    p_meal_type,
    v_points,
    v_today
  )
  returning id into v_meal_id;

  if v_template.id is not null then
    insert into public.check_in_logs (couple_id, user_id, template_id, log_date)
    values (v_couple_id, v_user_id, v_template.id, v_today)
    on conflict (user_id, template_id, log_date) do nothing;
  end if;

  insert into public.point_transactions (couple_id, user_id, amount, label, source_type, source_id)
  values (
    v_couple_id,
    v_user_id,
    v_points,
    '每日一餐打卡',
    'meal',
    v_meal_id
  );

  return json_build_object(
    'ok', true,
    'points', v_points,
    'meal_id', v_meal_id
  );
end;
$$;

grant execute on function public.submit_meal(text, text, text) to authenticated;

-- ---------------------------------------------------------------------------
-- Redeem reward
-- ---------------------------------------------------------------------------

create or replace function public.redeem_reward(p_reward_id uuid)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_couple_id uuid := public.get_my_couple_id();
  v_reward public.rewards%rowtype;
  v_balance integer;
begin
  if v_user_id is null or v_couple_id is null then
    return json_build_object('ok', false, 'error', 'NOT_AUTHENTICATED');
  end if;

  select * into v_reward
  from public.rewards
  where id = p_reward_id and couple_id = v_couple_id and active = true;

  if not found then
    return json_build_object('ok', false, 'error', 'REWARD_NOT_FOUND');
  end if;

  v_balance := public.get_couple_points(v_couple_id);

  if v_balance < v_reward.cost then
    return json_build_object('ok', false, 'error', 'INSUFFICIENT_POINTS');
  end if;

  insert into public.point_transactions (couple_id, user_id, amount, label, source_type, source_id)
  values (
    v_couple_id,
    v_user_id,
    -v_reward.cost,
    '兌換 · ' || v_reward.title,
    'reward',
    v_reward.id
  );

  return json_build_object('ok', true, 'cost', v_reward.cost, 'title', v_reward.title);
end;
$$;

grant execute on function public.redeem_reward(uuid) to authenticated;

-- Seed existing couples that have no templates yet
do $$
declare
  r record;
begin
  for r in select id from public.couples loop
    perform public.seed_couple_defaults(r.id);
  end loop;
end;
$$;
