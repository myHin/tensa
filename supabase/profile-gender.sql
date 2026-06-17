-- Run in Supabase SQL Editor (safe to re-run)

alter table public.profiles
add column if not exists gender text check (gender in ('female', 'male', 'other'));

comment on column public.profiles.gender is 'Used to show/hide menstrual cycle tracking (female only by default in app)';
