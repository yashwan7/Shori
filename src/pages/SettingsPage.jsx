import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  saveCustomSupabaseConfig,
  getSupabaseCredentials,
} from "../services/supabaseClient";
import {
  Settings,
  Key,
  Database,
  Download,
  Upload,
  RotateCcw,
  User,
  ShieldCheck,
  CheckCircle2,
  Eye,
  EyeOff,
  Sparkles,
  Code2,
  Copy,
  ExternalLink,
  Zap,
} from "lucide-react";
import { GithubIcon } from "../components/GithubIcon";

export function SettingsPage() {
  const {
    state,
    updateProfile,
    resetToSampleData,
    importData,
    showToast,
    isCloudConnected,
    isSupabaseConfigured,
    setActiveModal,
  } = useApp();

  const { profile } = state;

  const [name, setName] = useState(profile.name || "");
  const [title, setTitle] = useState(profile.title || "");
  const [target, setTarget] = useState(profile.target || "");
  const [weeklyGoalHours, setWeeklyGoalHours] = useState(profile.weeklyGoalHours || 35);
  const [leetcodeUsername, setLeetcodeUsername] = useState(profile.leetcodeUsername || "yashwanth");
  const [githubUsername, setGithubUsername] = useState(profile.githubUsername || "yashwan7");

  // Supabase direct config
  const creds = getSupabaseCredentials();
  const [supabaseUrl, setSupabaseUrl] = useState(creds.url || "");
  const [supabaseAnonKey, setSupabaseAnonKey] = useState(creds.anonKey || "");
  const [showDbKey, setShowDbKey] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  // AI settings
  const [apiKey, setApiKey] = useState(
    () => localStorage.getItem("shori_ai_api_key") || ""
  );
  const [selectedModel, setSelectedModel] = useState(
    () => localStorage.getItem("shori_ai_model") || "gemini-3.5-flash"
  );
  const [showApiKey, setShowApiKey] = useState(false);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateProfile({
      name,
      title,
      target,
      weeklyGoalHours: parseFloat(weeklyGoalHours) || 30,
      leetcodeUsername: leetcodeUsername.trim(),
      githubUsername: githubUsername.trim(),
    });
  };

  const handleSaveSupabaseConfig = (e) => {
    e.preventDefault();
    if (!supabaseUrl.trim() || !supabaseAnonKey.trim()) {
      showToast("Please enter both Supabase URL and Anon Key", "error");
      return;
    }
    saveCustomSupabaseConfig(supabaseUrl, supabaseAnonKey);
    showToast("Supabase credentials updated! Reloading...");
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const handleSaveAiConfig = (e) => {
    e.preventDefault();
    if (apiKey.trim()) {
      localStorage.setItem("shori_ai_api_key", apiKey.trim());
    } else {
      localStorage.removeItem("shori_ai_api_key");
    }
    localStorage.setItem("shori_ai_model", selectedModel);
    showToast("AI Configuration saved");
  };

  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `shori_backup_${new Date().toISOString().split("T")[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast("Exported complete command center backup");
  };

  const handleImportFile = (e) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        importData(event.target.result);
      };
    }
  };

  const handleCopySqlScript = () => {
    const sql = `-- Shori Command Center Supabase Tables
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
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

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
  created_at timestamp with time zone default timezone('utc'::text, now())
);

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
  notes text default '',
  ai_review jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  unique (user_id, date)
);

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

    navigator.clipboard.writeText(sql);
    setCopiedSql(true);
    showToast("Supabase SQL copied to clipboard!");
    setTimeout(() => setCopiedSql(false), 3000);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", maxWidth: "920px" }}>
      {/* 1. Header Banner */}
      <div
        className="glass-panel"
        style={{
          padding: "24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "var(--radius-md)",
                background: "rgba(56, 189, 248, 0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--cyan)",
              }}
            >
              <Settings size={20} />
            </div>
            <h1 style={{ fontSize: "22px", fontWeight: 700 }}>System Settings & Cloud Database</h1>
            <span className={`badge ${isCloudConnected ? "badge-emerald" : "badge-amber"}`}>
              {isCloudConnected ? "Cloud Synced" : "Guest / Offline"}
            </span>
          </div>
          <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
            Configure live PostgreSQL cloud persistence, LeetCode / GitHub live tracking, and Gemini AI.
          </p>
        </div>
      </div>

      {/* 2. Supabase Cloud Database Status & Configuration */}
      <div className="glass-panel" style={{ padding: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Database size={18} color="var(--emerald)" />
            <h2 style={{ fontSize: "16px", fontWeight: 700 }}>Supabase PostgreSQL Connection</h2>
          </div>

          <button
            type="button"
            onClick={handleCopySqlScript}
            className="btn btn-secondary btn-sm"
          >
            {copiedSql ? <CheckCircle2 size={14} color="var(--emerald)" /> : <Copy size={14} />}
            <span>{copiedSql ? "SQL Copied!" : "Copy SQL Schema"}</span>
          </button>
        </div>

        <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "16px", lineHeight: 1.5 }}>
          Shori uses Supabase to persist your tasks, DSA questions, GSoC tracker, and daily check-ins in the cloud with Row Level Security.
        </p>

        <form onSubmit={handleSaveSupabaseConfig} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div>
            <label style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "6px", display: "block" }}>
              Supabase Project URL
            </label>
            <input
              type="url"
              placeholder="https://xyzcompany.supabase.co"
              value={supabaseUrl}
              onChange={(e) => setSupabaseUrl(e.target.value)}
            />
          </div>

          <div>
            <label style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "6px", display: "block" }}>
              Supabase Anon / Public Key
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showDbKey ? "text" : "password"}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                value={supabaseAnonKey}
                onChange={(e) => setSupabaseAnonKey(e.target.value)}
                style={{ paddingRight: "40px" }}
              />
              <button
                type="button"
                onClick={() => setShowDbKey(!showDbKey)}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  color: "var(--text-muted)",
                  cursor: "pointer",
                }}
              >
                {showDbKey ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
              Can also be provided via <code>.env</code> as <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code>.
            </span>

            <button type="submit" className="btn btn-primary">
              <Zap size={14} />
              <span>Save & Connect Database</span>
            </button>
          </div>
        </form>
      </div>

      {/* 3. User Profile & Live Handles (LeetCode & GitHub) */}
      <div className="glass-panel" style={{ padding: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
          <User size={18} color="var(--cyan)" />
          <h2 style={{ fontSize: "16px", fontWeight: 700 }}>Profile & Live External Handles</h2>
        </div>

        <form onSubmit={handleSaveProfile} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
            <div>
              <label style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "6px", display: "block" }}>
                Your Name
              </label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            <div>
              <label style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "6px", display: "block" }}>
                Target Year / Primary Goal
              </label>
              <input type="text" value={target} onChange={(e) => setTarget(e.target.value)} />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
            <div>
              <label style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "6px", display: "block" }}>
                Professional Title / Specialty
              </label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>

            <div>
              <label style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "6px", display: "block" }}>
                Weekly Deep-Work Target (Hours)
              </label>
              <input
                type="number"
                value={weeklyGoalHours}
                onChange={(e) => setWeeklyGoalHours(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
            <div>
              <label style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "6px", display: "block" }}>
                LeetCode Username (For Live Solved Stats)
              </label>
              <div style={{ position: "relative" }}>
                <Code2 size={15} color="#f59e0b" style={{ position: "absolute", left: "10px", top: "12px" }} />
                <input
                  type="text"
                  placeholder="e.g. yashwanth"
                  value={leetcodeUsername}
                  onChange={(e) => setLeetcodeUsername(e.target.value)}
                  style={{ paddingLeft: "34px" }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "6px", display: "block" }}>
                GitHub Username (For Live PRs & Commits)
              </label>
              <div style={{ position: "relative" }}>
                <GithubIcon size={15} color="var(--cyan)" style={{ position: "absolute", left: "10px", top: "12px" }} />
                <input
                  type="text"
                  placeholder="e.g. yashwan7"
                  value={githubUsername}
                  onChange={(e) => setGithubUsername(e.target.value)}
                  style={{ paddingLeft: "34px" }}
                />
              </div>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button type="submit" className="btn btn-primary">
              <span>Save Profile & Handles</span>
            </button>
          </div>
        </form>
      </div>

      {/* 4. AI Model & API Key Configuration */}
      <div className="glass-panel" style={{ padding: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
          <Sparkles size={18} color="var(--violet)" />
          <h2 style={{ fontSize: "16px", fontWeight: 700 }}>AI Personal Planner Configuration</h2>
        </div>

        <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "16px", lineHeight: 1.5 }}>
          Shori includes an offline heuristic reasoner. For real-time generation powered by Google Gemini, enter your API key below or set <code style={{ color: "var(--cyan)" }}>VITE_AI_API_KEY</code> in <code style={{ color: "var(--cyan)" }}>.env</code>.
        </p>

        <form onSubmit={handleSaveAiConfig} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div>
            <label style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "6px", display: "block" }}>
              Google Gemini API Key
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showApiKey ? "text" : "password"}
                placeholder="AIzaSy..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                style={{ paddingRight: "40px" }}
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  color: "var(--text-muted)",
                  cursor: "pointer",
                }}
              >
                {showApiKey ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div>
            <label style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "6px", display: "block" }}>
              Active Gemini Model
            </label>
            <select value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)}>
              <option value="gemini-3.5-flash">Gemini 3.5 Flash (Recommended - Balanced)</option>
              <option value="gemini-flash-lite-latest">Gemini 3.5 Flash Lite (High Availability & Fast)</option>
              <option value="gemini-3.8-flash">Gemini 3.8 Flash (Next-Gen Flagship)</option>
              <option value="gemini-3.1-pro-preview">Gemini 3.1 Pro (Deep Complex Reasoning)</option>
            </select>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button type="submit" className="btn btn-ai">
              <span>Save AI Settings</span>
            </button>
          </div>
        </form>
      </div>

      {/* 5. Data Persistence & Backup / Reset */}
      <div className="glass-panel" style={{ padding: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
          <Database size={18} color="var(--emerald)" />
          <h2 style={{ fontSize: "16px", fontWeight: 700 }}>Telemetry Data Management & Backups</h2>
        </div>

        <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "16px" }}>
          Export a complete JSON snapshot of your command center or restore data onto a secondary device.
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
          <button onClick={handleExportData} className="btn btn-secondary">
            <Download size={15} />
            <span>Export Data (JSON)</span>
          </button>

          <label className="btn btn-secondary" style={{ cursor: "pointer" }}>
            <Upload size={15} />
            <span>Import Backup JSON</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportFile}
              style={{ display: "none" }}
            />
          </label>

          <button onClick={resetToSampleData} className="btn btn-danger">
            <RotateCcw size={15} />
            <span>Reset to Sample Data</span>
          </button>
        </div>
      </div>
    </div>
  );
}
