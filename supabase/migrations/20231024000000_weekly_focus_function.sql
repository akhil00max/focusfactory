-- Create a function to get weekly focus time
create or replace function public.get_weekly_focus_time(weeks_param integer default 4)
returns table (week_start date, total_minutes numeric)
language sql
security definer
as $$
  select 
    date_trunc('week', started_at)::date as week_start,
    coalesce(sum(duration_minutes), 0) as total_minutes
  from 
    public.focus_sessions
  where 
    user_id = auth.uid()
    and started_at >= (now() - (weeks_param * interval '1 week'))
  group by 
    week_start
  order by 
    week_start desc
  limit weeks_param;
$$;

-- Grant execute permission to authenticated users
grant execute on function public.get_weekly_focus_time(integer) to authenticated;

-- Create a policy to ensure users can only see their own focus sessions
create policy "Users can view their own focus sessions"
on public.focus_sessions
for select
using (auth.uid() = user_id);

-- Create a policy to ensure users can only insert their own focus sessions
create policy "Users can insert their own focus sessions"
on public.focus_sessions
for insert
with check (auth.uid() = user_id);

-- Similar policies for other tables
create policy "Users can view their own reflections"
on public.reflections
for select
using (auth.uid() = user_id);

create policy "Users can insert their own reflections"
on public.reflections
for insert
with check (auth.uid() = user_id);

create policy "Users can view their own pomodoro history"
on public.pomodoro_history
for select
using (auth.uid() = user_id);

create policy "Users can insert their own pomodoro history"
on public.pomodoro_history
for insert
with check (auth.uid() = user_id);
