-- ============================================================================
-- SHORI COMMAND CENTER - SUPABASE POSTGRESQL SCHEMA & ROW LEVEL SECURITY
-- ============================================================================
-- Run this complete script in your Supabase SQL Editor:
-- Dashboard -> SQL Editor -> New Query -> Paste & Run
-- ============================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================================
-- 1. PROFILES TABLE
-- ============================================================================
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  name text default 'Yashwanth',
  title text default 'Software Engineer & Open Source Contributor',
  target text default 'Tier-1 Tech / GSoC',
  avatar_url text,
  streak integer default 0,
  streak_last_date date default current_date,
  weekly_goal_hours numeric default 35,
  weekly_current_hours numeric default 0,
  leetcode_username text default 'yashwanth',
  github_username text default 'yashwan7',
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- ============================================================================
-- 2. TASKS TABLE
-- ============================================================================
create table if not exists public.tasks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  description text default '',
  category text default 'DSA', -- 'DSA' | 'GSoC' | 'AI/ML' | 'Project' | 'College' | 'Other'
  priority text default 'Medium', -- 'High' | 'Medium' | 'Low'
  status text default 'Todo', -- 'Todo' | 'In Progress' | 'Completed'
  due_date date default current_date,
  estimated_mins integer default 30,
  goal_id text default 'dsa',
  notes text default '',
  completed_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- ============================================================================
-- 3. DSA PROBLEMS TABLE
-- ============================================================================
create table if not exists public.dsa_problems (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  topic text not null default 'Arrays',
  difficulty text default 'Medium', -- 'Easy' | 'Medium' | 'Hard'
  status text default 'Solved', -- 'Solved' | 'Attempted' | 'Pending'
  revision_status text default 'Solid', -- 'Needs Revision' | 'Revised' | 'Solid'
  link text default '',
  notes text default '',
  time_spent_mins integer default 30,
  last_practiced date default current_date,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- ============================================================================
-- 4. GSOC ORGANIZATIONS TABLE
-- ============================================================================
create table if not exists public.gsoc_organizations (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  name text not null,
  tech_stack text[] default '{}',
  repo_url text default '',
  project_idea text default '',
  match_percentage integer default 80,
  status text default 'Shortlisted', -- 'Shortlisted' | 'Primary Focus' | 'Secondary Focus' | 'Explored' | 'Proposal Submitted'
  notes text default '',
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- ============================================================================
-- 5. GSOC CONTRIBUTIONS TABLE
-- ============================================================================
create table if not exists public.gsoc_contributions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  org_id uuid references public.gsoc_organizations(id) on delete set null,
  org_name text default '',
  title text not null,
  type text default 'PR', -- 'PR' | 'Issue' | 'Discussion'
  pr_number text default '',
  url text default '',
  status text default 'Under Review', -- 'Under Review' | 'Merged' | 'Open' | 'Closed'
  date date default current_date,
  notes text default '',
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- ============================================================================
-- 6. GSOC ROADMAP MILESTONES TABLE
-- ============================================================================
create table if not exists public.gsoc_milestones (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  status text default 'Not Started', -- 'Completed' | 'In Progress' | 'Not Started'
  date date default current_date,
  desc_text text default '',
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- ============================================================================
-- 7. DAILY CHECK-INS TABLE
-- ============================================================================
create table if not exists public.daily_checkins (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  date date default current_date,
  mood text default 'Good',
  hours_spent numeric default 0,
  problems_solved integer default 0,
  categories text[] default '{"DSA", "GSoC"}',
  accomplished text default '',
  pending text default '',
  tomorrow_priority text default '',
  reflection text default '',
  blockers text default '',
  wins text default '',
  notes text default '',
  ai_review jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  unique (user_id, date)
);

-- ============================================================================
-- 8. CUSTOM GOALS & MILESTONES TABLE
-- ============================================================================
create table if not exists public.goals (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  name text not null,
  description text default '',
  category text default 'AI/ML',
  target_date date default current_date,
  progress integer default 0,
  notes text default '',
  milestones jsonb default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- ============================================================================
-- 9. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.tasks enable row level security;
alter table public.dsa_problems enable row level security;
alter table public.gsoc_organizations enable row level security;
alter table public.gsoc_contributions enable row level security;
alter table public.gsoc_milestones enable row level security;
alter table public.daily_checkins enable row level security;
alter table public.goals enable row level security;

-- Drop existing policies if re-running
drop policy if exists "Users can read own profile" on public.profiles;
drop policy if exists "Users can insert own profile" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;

drop policy if exists "Users can CRUD own tasks" on public.tasks;
drop policy if exists "Users can CRUD own dsa_problems" on public.dsa_problems;
drop policy if exists "Users can CRUD own gsoc_organizations" on public.gsoc_organizations;
drop policy if exists "Users can CRUD own gsoc_contributions" on public.gsoc_contributions;
drop policy if exists "Users can CRUD own gsoc_milestones" on public.gsoc_milestones;
drop policy if exists "Users can CRUD own daily_checkins" on public.daily_checkins;
drop policy if exists "Users can CRUD own goals" on public.goals;

-- Profiles Policies
create policy "Users can read own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can insert own profile" on public.profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

-- Tasks Policies
create policy "Users can CRUD own tasks" on public.tasks
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- DSA Problems Policies
create policy "Users can CRUD own dsa_problems" on public.dsa_problems
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- GSoC Orgs Policies
create policy "Users can CRUD own gsoc_organizations" on public.gsoc_organizations
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- GSoC Contributions Policies
create policy "Users can CRUD own gsoc_contributions" on public.gsoc_contributions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- GSoC Milestones Policies
create policy "Users can CRUD own gsoc_milestones" on public.gsoc_milestones
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Daily Check-ins Policies
create policy "Users can CRUD own daily_checkins" on public.daily_checkins
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Goals Policies
create policy "Users can CRUD own goals" on public.goals
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ============================================================================
-- 10. AUTH TRIGGER: AUTO-CREATE PROFILE ON USER SIGNUP
-- ============================================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, name, title, target, leetcode_username, github_username)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'title', 'Software Engineer & Open Source Contributor'),
    coalesce(new.raw_user_meta_data->>'target', 'GSoC 2027 / Tier-1 Tech'),
    coalesce(new.raw_user_meta_data->>'leetcode_username', 'yashwanth'),
    coalesce(new.raw_user_meta_data->>'github_username', 'yashwan7')
  )
  on conflict (id) do update set
    email = excluded.email,
    name = coalesce(public.profiles.name, excluded.name),
    updated_at = now();
  return new;
end;
$$;

-- Drop trigger if exists and recreate
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================================
-- ALL TABLES AND POLICIES CONFIGURED SUCCESSFULLY
-- ============================================================================
