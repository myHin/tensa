-- Fix: infinite recursion in profiles RLS (run once in SQL Editor)

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
