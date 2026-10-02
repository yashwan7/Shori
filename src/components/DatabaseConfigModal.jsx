import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import {
  saveCustomSupabaseConfig,
  getSupabaseCredentials,
} from "../services/supabaseClient";
import {
  X,
  Database,
  CheckCircle2,
  AlertTriangle,
  Copy,
  ExternalLink,
  ShieldCheck,
  Zap,
  Terminal,
  RefreshCw,
} from "lucide-react";

export function DatabaseConfigModal() {
  const { setActiveModal, showToast } = useApp();

  const { url: initialUrl, anonKey: initialKey } = getSupabaseCredentials();
  const [supabaseUrl, setSupabaseUrl] = useState(initialUrl || "");
  const [supabaseAnonKey, setSupabaseAnonKey] = useState(initialKey || "");
  const [copied, setCopied] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  const handleSave = (e) => {
    e.preventDefault();
    if (!supabaseUrl.trim() || !supabaseAnonKey.trim()) {
      showToast("Please enter both Supabase URL and Anon Key", "error");
      return;
    }

    try {
      saveCustomSupabaseConfig(supabaseUrl, supabaseAnonKey);
      showToast("Supabase credentials saved! Refreshing connection...");
      setTestResult({ success: true, message: "Connected successfully to Supabase!" });
      setTimeout(() => {
        window.location.reload();
      }, 1200);
    } catch (err) {
      showToast("Failed to save credentials: " + err.message, "error");
    }
  };

  const handleCopySql = () => {
    const sqlContent = `-- 1. Profiles Table
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  name text default 'Yashwanth',
  title text default 'Software Engineer',
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

-- 2. Tasks Table
create table if not exists public.tasks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  description text default '',
  category text default 'DSA',
  priority text default 'Medium',
  status text default 'Todo',
  due_date date default current_date,
  estimated_mins integer default 30,
  goal_id text default 'dsa',
  notes text default '',
  completed_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 3. DSA Problems Table
create table if not exists public.dsa_problems (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  topic text not null default 'Arrays',
  difficulty text default 'Medium',
  status text default 'Solved',
  revision_status text default 'Solid',
  link text default '',
  notes text default '',
  time_spent_mins integer default 30,
  last_practiced date default current_date,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 4. GSoC Orgs & Contributions
create table if not exists public.gsoc_organizations (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  name text not null,
  tech_stack text[] default '{}',
  repo_url text default '',
  project_idea text default '',
  match_percentage integer default 80,
  status text default 'Shortlisted',
  notes text default '',
  created_at timestamp with time zone default timezone('utc'::text, now())
);

create table if not exists public.gsoc_contributions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  org_id uuid references public.gsoc_organizations(id) on delete set null,
  org_name text default '',
  title text not null,
  type text default 'PR',
  pr_number text default '',
  url text default '',
  status text default 'Under Review',
  date date default current_date,
  notes text default '',
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 5. Daily Check-ins Table
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

-- 6. Goals Table
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
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 7. Enable RLS
alter table public.profiles enable row level security;
alter table public.tasks enable row level security;
alter table public.dsa_problems enable row level security;
alter table public.gsoc_organizations enable row level security;
alter table public.gsoc_contributions enable row level security;
alter table public.daily_checkins enable row level security;
alter table public.goals enable row level security;

create policy "Users can read own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can CRUD own tasks" on public.tasks for all using (auth.uid() = user_id);
create policy "Users can CRUD own dsa_problems" on public.dsa_problems for all using (auth.uid() = user_id);
create policy "Users can CRUD own gsoc_organizations" on public.gsoc_organizations for all using (auth.uid() = user_id);
create policy "Users can CRUD own gsoc_contributions" on public.gsoc_contributions for all using (auth.uid() = user_id);
create policy "Users can CRUD own daily_checkins" on public.daily_checkins for all using (auth.uid() = user_id);
create policy "Users can CRUD own goals" on public.goals for all using (auth.uid() = user_id);`;

    navigator.clipboard.writeText(sqlContent);
    setCopied(true);
    showToast("Full Supabase SQL script copied to clipboard!");
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="modal-content" style={{ maxWidth: "620px" }}>
      {/* Header */}
      <div
        style={{
          padding: "20px 24px",
          borderBottom: "1px solid var(--border-subtle)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "linear-gradient(90deg, rgba(16, 185, 129, 0.1), transparent)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "34px",
              height: "34px",
              borderRadius: "var(--radius-sm)",
              background: "rgba(16, 185, 129, 0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--emerald)",
            }}
          >
            <Database size={18} />
          </div>
          <div>
            <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-white)" }}>
              Supabase Cloud Database Connection
            </h3>
            <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
              Connect your live PostgreSQL instance & authenticate real users
            </div>
          </div>
        </div>

        <button
          onClick={() => setActiveModal(null)}
          className="btn btn-ghost btn-icon"
        >
          <X size={18} />
        </button>
      </div>

      <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
        {/* Quick Steps */}
        <div
          style={{
            padding: "14px 16px",
            borderRadius: "var(--radius-md)",
            background: "rgba(255, 255, 255, 0.03)",
            border: "1px solid var(--border-subtle)",
          }}
        >
          <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-white)", marginBottom: "8px" }}>
            🚀 3-Minute Supabase Setup Guide:
          </div>
          <ol style={{ fontSize: "12px", color: "var(--text-secondary)", paddingLeft: "18px", lineHeight: 1.6, margin: 0 }}>
            <li>
              Create a free project at{" "}
              <a
                href="https://supabase.com"
                target="_blank"
                rel="noreferrer"
                style={{ color: "var(--cyan)", textDecoration: "underline" }}
              >
                supabase.com <ExternalLink size={10} style={{ display: "inline" }} />
              </a>
            </li>
            <li>
              In Supabase dashboard, click <strong>SQL Editor</strong> &rarr; paste the SQL script (click button below) &rarr; click <strong>Run</strong>.
            </li>
            <li>
              Go to <strong>Project Settings &rarr; API</strong> &rarr; copy <strong>Project URL</strong> and <strong>anon public key</strong> below.
            </li>
          </ol>

          <div style={{ marginTop: "12px" }}>
            <button
              type="button"
              onClick={handleCopySql}
              className="btn btn-secondary btn-sm"
              style={{ gap: "6px" }}
            >
              {copied ? <CheckCircle2 size={14} color="var(--emerald)" /> : <Copy size={14} />}
              <span>{copied ? "SQL Script Copied!" : "Copy Full SQL Schema"}</span>
            </button>
          </div>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div>
            <label style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "4px", display: "block" }}>
              Supabase Project URL *
            </label>
            <input
              type="url"
              required
              placeholder="https://xyzcompany.supabase.co"
              value={supabaseUrl}
              onChange={(e) => setSupabaseUrl(e.target.value)}
            />
          </div>

          <div>
            <label style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "4px", display: "block" }}>
              Supabase Anon / Public API Key *
            </label>
            <input
              type="text"
              required
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              value={supabaseAnonKey}
              onChange={(e) => setSupabaseAnonKey(e.target.value)}
            />
          </div>

          {testResult && (
            <div
              style={{
                padding: "10px 14px",
                borderRadius: "var(--radius-sm)",
                backgroundColor: testResult.success ? "rgba(16, 185, 129, 0.15)" : "rgba(244, 63, 94, 0.15)",
                border: `1px solid ${testResult.success ? "rgba(16, 185, 129, 0.3)" : "rgba(244, 63, 94, 0.3)"}`,
                color: testResult.success ? "var(--emerald)" : "var(--rose)",
                fontSize: "12px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <CheckCircle2 size={16} />
              <span>{testResult.message}</span>
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setActiveModal(null)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <Zap size={14} />
              <span>Save & Connect Database</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
