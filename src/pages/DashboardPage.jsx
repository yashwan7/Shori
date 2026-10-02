import React from "react";
import { useApp } from "../context/AppContext";
import {
  Flame,
  CheckCircle2,
  Circle,
  Clock,
  Sparkles,
  Plus,
  ArrowUpRight,
  TrendingUp,
  Code2,
  GitBranch,
  Target,
  Calendar,
  AlertTriangle,
  ChevronRight,
  Play,
  RotateCw,
  ExternalLink,
  Award,
  Zap,
  GitPullRequest,
  Check,
  RefreshCw,
} from "lucide-react";
import { GithubIcon } from "../components/GithubIcon";

export function DashboardPage() {
  const {
    state,
    leetcodeStats,
    githubStats,
    isStatsLoading,
    refreshExternalStats,
    dbLoading,
    setActiveTab,
    setActiveModal,
    toggleTaskStatus,
  } = useApp();

  const { profile, dsa, gsoc, goals, tasks, checkIns, weeklyProductivity } = state;

  // Progress metrics
  const dsaSolvedCount = dsa.problems.filter((p) => p.status === "Solved").length;
  const dsaTotalCount = dsa.problems.length;
  const dsaPercentage = Math.round((dsaSolvedCount / (dsa.targetProblems || 100)) * 100);
  const dsaNeedsRevision = dsa.problems.filter((p) => p.revisionStatus === "Needs Revision").length;

  const gsocCompletedMilestones = gsoc.milestones.filter((m) => m.status === "Completed").length;
  const gsocPercentage = Math.round((gsocCompletedMilestones / (gsoc.milestones?.length || 1)) * 100);
  const gsocMergedContributions = gsoc.contributions.filter((c) => c.status === "Merged").length;

  const pendingTasks = tasks.filter((t) => t.status !== "Completed");
  const completedTasks = tasks.filter((t) => t.status === "Completed");
  const todayPriorities = pendingTasks.filter((t) => t.priority === "High");

  // Overall index: weighted average of DSA (35%), GSoC (45%), Goals (20%)
  const avgGoalsProgress = goals.length
    ? Math.round(goals.reduce((acc, g) => acc + (g.progress || 0), 0) / goals.length)
    : 50;
  const overallScore = Math.round(
    dsaPercentage * 0.35 + gsocPercentage * 0.45 + avgGoalsProgress * 0.2
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* 1. Hero Command Strip */}
      <div
        className="glass-panel-elevated"
        style={{
          padding: "24px",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "20px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ zIndex: 1, maxWidth: "560px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "4px 10px",
              borderRadius: "var(--radius-full)",
              background: "rgba(56, 189, 248, 0.12)",
              border: "1px solid rgba(56, 189, 248, 0.25)",
              color: "var(--cyan)",
              fontSize: "11px",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: "10px",
            }}
          >
            <span>Command Center Online</span>
            <span className="status-live-dot" />
          </div>

          <h1 style={{ fontSize: "24px", fontWeight: 700, marginBottom: "8px" }}>
            Welcome back, {profile.name}.
          </h1>
          <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.6 }}>
            You have <strong style={{ color: "var(--cyan)" }}>{todayPriorities.length} high-priority directives</strong> and{" "}
            <strong style={{ color: "var(--amber)" }}>{pendingTasks.length} pending operations</strong> today.
            GSoC proposal submission deadline approaches in 10 days. Maintain velocity.
          </p>
        </div>

        {/* Hero Right Metrics */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px", zIndex: 1 }}>
          {/* Day Streak Metric */}
          <div
            style={{
              background: "rgba(245, 158, 11, 0.1)",
              border: "1px solid rgba(245, 158, 11, 0.25)",
              borderRadius: "var(--radius-lg)",
              padding: "16px 20px",
              textAlign: "center",
              minWidth: "120px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", color: "var(--amber)" }}>
              <Flame size={20} />
              <span style={{ fontSize: "22px", fontWeight: 800, fontFamily: "var(--font-mono)" }}>
                {profile.streak}
              </span>
            </div>
            <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>
              Day Streak
            </div>
          </div>

          {/* Overall Growth Metric */}
          <div
            style={{
              background: "rgba(56, 189, 248, 0.1)",
              border: "1px solid rgba(56, 189, 248, 0.25)",
              borderRadius: "var(--radius-lg)",
              padding: "16px 20px",
              textAlign: "center",
              minWidth: "120px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "4px", color: "var(--cyan)" }}>
              <TrendingUp size={20} />
              <span style={{ fontSize: "22px", fontWeight: 800, fontFamily: "var(--font-mono)" }}>
                {overallScore}%
              </span>
            </div>
            <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>
              Overall Progress
            </div>
          </div>

          <button
            onClick={() => setActiveTab("AI Planner")}
            className="btn btn-ai"
            style={{ padding: "14px 20px", height: "fit-content" }}
          >
            <Sparkles size={16} />
            <span>Generate Today's Plan</span>
          </button>
        </div>
      </div>

      {/* 2. LIVE TELEMETRY WIDGETS: LEETCODE & GITHUB */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }} className="dashboard-split-grid">
        {/* LeetCode Live Card */}
        <div className="glass-panel" style={{ padding: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "var(--radius-md)",
                  background: "rgba(245, 158, 11, 0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#f59e0b",
                }}
              >
                <Code2 size={20} />
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <h3 style={{ fontSize: "15px", fontWeight: 700 }}>LeetCode Telemetry</h3>
                  <span className={`badge ${leetcodeStats?.isLive ? "badge-emerald" : "badge-neutral"}`} style={{ fontSize: "9px" }}>
                    {leetcodeStats?.isLive ? "Live API" : "Cached"}
                  </span>
                </div>
                <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                  @{profile.leetcodeUsername || "yashwanth"} • Rank: <span style={{ color: "var(--cyan)" }}>#{leetcodeStats?.ranking || "180k"}</span>
                </div>
              </div>
            </div>

            <a
              href={`https://leetcode.com/${profile.leetcodeUsername || "yashwanth"}/`}
              target="_blank"
              rel="noreferrer"
              className="btn btn-ghost btn-sm btn-icon"
              title="View on LeetCode"
            >
              <ExternalLink size={15} />
            </a>
          </div>

          {/* Solved metrics grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px", marginBottom: "14px" }}>
            <div style={{ padding: "10px", borderRadius: "var(--radius-sm)", backgroundColor: "rgba(16, 185, 129, 0.08)", border: "1px solid rgba(16, 185, 129, 0.2)", textAlign: "center" }}>
              <div style={{ fontSize: "10px", color: "var(--emerald)", fontWeight: 600 }}>EASY</div>
              <div className="mono" style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-white)" }}>
                {leetcodeStats?.easySolved ?? 54}
              </div>
            </div>

            <div style={{ padding: "10px", borderRadius: "var(--radius-sm)", backgroundColor: "rgba(245, 158, 11, 0.08)", border: "1px solid rgba(245, 158, 11, 0.2)", textAlign: "center" }}>
              <div style={{ fontSize: "10px", color: "var(--amber)", fontWeight: 600 }}>MEDIUM</div>
              <div className="mono" style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-white)" }}>
                {leetcodeStats?.mediumSolved ?? 76}
              </div>
            </div>

            <div style={{ padding: "10px", borderRadius: "var(--radius-sm)", backgroundColor: "rgba(244, 63, 94, 0.08)", border: "1px solid rgba(244, 63, 94, 0.2)", textAlign: "center" }}>
              <div style={{ fontSize: "10px", color: "var(--rose)", fontWeight: 600 }}>HARD</div>
              <div className="mono" style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-white)" }}>
                {leetcodeStats?.hardSolved ?? 12}
              </div>
            </div>
          </div>

          {/* Solved ratio bar */}
          <div style={{ marginBottom: "14px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", marginBottom: "4px" }}>
              <span style={{ color: "var(--text-muted)" }}>Total Solved: {leetcodeStats?.totalSolved ?? dsaSolvedCount}</span>
              <span style={{ color: "var(--cyan)", fontWeight: 600 }}>Acceptance: {leetcodeStats?.acceptanceRate ?? "58.4"}%</span>
            </div>
            <div className="progress-bar-container" style={{ height: "6px" }}>
              <div
                className="progress-bar-fill"
                style={{ width: `${Math.min(100, Math.round(((leetcodeStats?.totalSolved ?? 142) / 300) * 100))}%`, backgroundColor: "#f59e0b" }}
              />
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
              {dsaNeedsRevision} problems in active revision queue
            </span>
            <button onClick={() => setActiveTab("DSA")} className="btn btn-secondary btn-sm" style={{ fontSize: "11px" }}>
              <span>Open DSA Matrix</span>
              <ChevronRight size={12} />
            </button>
          </div>
        </div>

        {/* GitHub Live Card */}
        <div className="glass-panel" style={{ padding: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
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
                <GithubIcon size={20} />
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <h3 style={{ fontSize: "15px", fontWeight: 700 }}>GitHub Activity & PRs</h3>
                  <span className={`badge ${githubStats?.isLive ? "badge-emerald" : "badge-neutral"}`} style={{ fontSize: "9px" }}>
                    {githubStats?.isLive ? "Live API" : "Cached"}
                  </span>
                </div>
                <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                  @{profile.githubUsername || "yashwan7"} • {githubStats?.publicRepos || 18} Repos • {githubStats?.followers || 42} Followers
                </div>
              </div>
            </div>

            <a
              href={`https://github.com/${profile.githubUsername || "yashwan7"}`}
              target="_blank"
              rel="noreferrer"
              className="btn btn-ghost btn-sm btn-icon"
              title="View on GitHub"
            >
              <ExternalLink size={15} />
            </a>
          </div>

          {/* GitHub Velocity Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "14px" }}>
            <div style={{ padding: "10px 12px", borderRadius: "var(--radius-sm)", backgroundColor: "rgba(255, 255, 255, 0.03)", border: "1px solid var(--border-subtle)" }}>
              <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>GSoC PRs Logged</div>
              <div className="mono" style={{ fontSize: "16px", fontWeight: 700, color: "var(--cyan)" }}>
                {gsoc.contributions.length} ({gsocMergedContributions} Merged)
              </div>
            </div>

            <div style={{ padding: "10px 12px", borderRadius: "var(--radius-sm)", backgroundColor: "rgba(255, 255, 255, 0.03)", border: "1px solid var(--border-subtle)" }}>
              <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>Weekly Commits</div>
              <div className="mono" style={{ fontSize: "16px", fontWeight: 700, color: "var(--emerald)" }}>
                {githubStats?.totalCommits || 38} commits
              </div>
            </div>
          </div>

          {/* Latest PR preview */}
          <div style={{ fontSize: "12px", marginBottom: "14px", padding: "8px 10px", borderRadius: "var(--radius-sm)", background: "rgba(255, 255, 255, 0.02)", border: "1px solid var(--border-subtle)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--text-white)", fontWeight: 500 }}>
                <GitPullRequest size={13} color="var(--amber)" />
                <span style={{ maxWidth: "260px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {gsoc.contributions[0]?.title || "Vectorize ascii string lower/upper kernels"}
                </span>
              </div>
              <span className="badge badge-amber" style={{ fontSize: "9px" }}>
                {gsoc.contributions[0]?.status || "Under Review"}
              </span>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
              Target Org: {gsoc.organizations[0]?.name || "Apache Arrow"}
            </span>
            <button onClick={() => setActiveTab("GSoC")} className="btn btn-secondary btn-sm" style={{ fontSize: "11px" }}>
              <span>View GSoC Desk</span>
              <ChevronRight size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Major Goal Cards (DSA, GSoC, Other Goals) */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px" }}>
        {/* DSA Card */}
        <div className="glass-panel" style={{ padding: "20px", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
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
                <Code2 size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: "16px", fontWeight: 700 }}>DSA Mastery</h3>
                <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                  Current: <strong style={{ color: "var(--text-primary)" }}>{dsa.currentTopic}</strong>
                </span>
              </div>
            </div>

            <button
              onClick={() => setActiveTab("DSA")}
              className="btn btn-ghost btn-sm"
              title="Open DSA Tracker"
            >
              <ArrowUpRight size={16} />
            </button>
          </div>

          {/* Progress bar */}
          <div style={{ marginBottom: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "6px" }}>
              <span style={{ color: "var(--text-secondary)" }}>Solve Progress</span>
              <span className="mono" style={{ fontWeight: 600, color: "var(--cyan)" }}>
                {dsaSolvedCount} / {dsa.targetProblems} ({dsaPercentage}%)
              </span>
            </div>
            <div className="progress-bar-container">
              <div
                className="progress-bar-fill"
                style={{ width: `${Math.min(100, dsaPercentage)}%`, backgroundColor: "var(--cyan)" }}
              />
            </div>
          </div>

          {/* Meta details */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px",
              padding: "12px",
              borderRadius: "var(--radius-md)",
              backgroundColor: "rgba(255, 255, 255, 0.03)",
              border: "1px solid var(--border-subtle)",
              marginBottom: "16px",
            }}
          >
            <div>
              <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>Remaining</div>
              <div className="mono" style={{ fontSize: "15px", fontWeight: 700 }}>
                {Math.max(0, dsa.targetProblems - dsaSolvedCount)} problems
              </div>
            </div>
            <div>
              <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>Revision Queue</div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span className="mono" style={{ fontSize: "15px", fontWeight: 700, color: dsaNeedsRevision > 0 ? "var(--amber)" : "var(--emerald)" }}>
                  {dsaNeedsRevision} flagged
                </span>
              </div>
            </div>
          </div>

          <div style={{ marginTop: "auto", display: "flex", gap: "8px" }}>
            <button
              onClick={() => setActiveModal({ type: "addProblem" })}
              className="btn btn-secondary btn-sm"
              style={{ flex: 1 }}
            >
              <Plus size={14} />
              <span>Log Problem</span>
            </button>
            <button
              onClick={() => setActiveTab("DSA")}
              className="btn btn-primary btn-sm"
              style={{ flex: 1 }}
            >
              <span>Practice DSA</span>
            </button>
          </div>
        </div>

        {/* GSoC Card */}
        <div className="glass-panel" style={{ padding: "20px", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "var(--radius-md)",
                  background: "rgba(245, 158, 11, 0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--amber)",
                }}
              >
                <GitBranch size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: "16px", fontWeight: 700 }}>GSoC {gsoc.targetYear}</h3>
                <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                  Primary Org: <strong style={{ color: "var(--text-primary)" }}>{gsoc.organizations[0]?.name}</strong>
                </span>
              </div>
            </div>

            <button
              onClick={() => setActiveTab("GSoC")}
              className="btn btn-ghost btn-sm"
              title="Open GSoC Tracker"
            >
              <ArrowUpRight size={16} />
            </button>
          </div>

          {/* Progress bar */}
          <div style={{ marginBottom: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "6px" }}>
              <span style={{ color: "var(--text-secondary)" }}>Roadmap Velocity</span>
              <span className="mono" style={{ fontWeight: 600, color: "var(--amber)" }}>
                {gsocCompletedMilestones} / {gsoc.milestones?.length || 9} ({gsocPercentage}%)
              </span>
            </div>
            <div className="progress-bar-container">
              <div
                className="progress-bar-fill"
                style={{ width: `${gsocPercentage}%`, backgroundColor: "var(--amber)" }}
              />
            </div>
          </div>

          {/* Meta details */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px",
              padding: "12px",
              borderRadius: "var(--radius-md)",
              backgroundColor: "rgba(255, 255, 255, 0.03)",
              border: "1px solid var(--border-subtle)",
              marginBottom: "16px",
            }}
          >
            <div>
              <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>Contributions</div>
              <div className="mono" style={{ fontSize: "15px", fontWeight: 700 }}>
                {gsoc.contributions.length} ({gsocMergedContributions} Merged)
              </div>
            </div>
            <div>
              <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>Critical Deadline</div>
              <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--rose)" }}>
                April 8 (Proposal)
              </div>
            </div>
          </div>

          <div style={{ marginTop: "auto", display: "flex", gap: "8px" }}>
            <button
              onClick={() => setActiveModal({ type: "addContribution" })}
              className="btn btn-secondary btn-sm"
              style={{ flex: 1 }}
            >
              <Plus size={14} />
              <span>Log PR / Issue</span>
            </button>
            <button
              onClick={() => setActiveTab("GSoC")}
              className="btn btn-primary btn-sm"
              style={{ flex: 1 }}
            >
              <span>View Roadmap</span>
            </button>
          </div>
        </div>

        {/* Other Goals / Projects Card */}
        <div className="glass-panel" style={{ padding: "20px", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "var(--radius-md)",
                  background: "rgba(168, 85, 247, 0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--violet)",
                }}
              >
                <Target size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: "16px", fontWeight: 700 }}>Custom Goals & Projects</h3>
                <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                  {goals.length} Active Tracks (AI/ML, RAG, OrthoTwin)
                </span>
              </div>
            </div>

            <button
              onClick={() => setActiveTab("Goals")}
              className="btn btn-ghost btn-sm"
              title="Open Goals System"
            >
              <ArrowUpRight size={16} />
            </button>
          </div>

          {/* Goals mini-list preview */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "16px", flex: 1 }}>
            {goals.slice(0, 3).map((g) => (
              <div
                key={g.id}
                style={{
                  padding: "8px 12px",
                  borderRadius: "var(--radius-sm)",
                  backgroundColor: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid var(--border-subtle)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "4px" }}>
                  <span style={{ fontWeight: 500, color: "var(--text-white)" }}>{g.name}</span>
                  <span className="mono" style={{ color: "var(--violet)" }}>{g.progress}%</span>
                </div>
                <div className="progress-bar-container" style={{ height: "4px" }}>
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${g.progress}%`, backgroundColor: "var(--violet)" }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: "auto", display: "flex", gap: "8px" }}>
            <button
              onClick={() => setActiveModal({ type: "addGoal" })}
              className="btn btn-secondary btn-sm"
              style={{ flex: 1 }}
            >
              <Plus size={14} />
              <span>New Goal</span>
            </button>
            <button
              onClick={() => setActiveTab("Goals")}
              className="btn btn-primary btn-sm"
              style={{ flex: 1 }}
            >
              <span>Manage Goals</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4. Split Command Section: Today's Priorities / Tasks & Weekly Productivity */}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "20px" }} className="dashboard-split-grid">
        {/* Left: Tasks & Priorities */}
        <div className="glass-panel" style={{ padding: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <h2 style={{ fontSize: "16px", fontWeight: 700 }}>Today's Directives & Priorities</h2>
              <span className="badge badge-cyan">{pendingTasks.length} Pending</span>
            </div>
            <button
              onClick={() => setActiveModal({ type: "addTask" })}
              className="btn btn-ghost btn-sm"
            >
              <Plus size={14} />
              <span>Add Directive</span>
            </button>
          </div>

          {/* Tasks List */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {pendingTasks.slice(0, 5).map((task) => {
              const isHigh = task.priority === "High";
              return (
                <div
                  key={task.id}
                  style={{
                    padding: "12px 14px",
                    borderRadius: "var(--radius-md)",
                    backgroundColor: "rgba(255, 255, 255, 0.03)",
                    border: isHigh
                      ? "1px solid rgba(244, 63, 94, 0.3)"
                      : "1px solid var(--border-subtle)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "12px",
                    transition: "all var(--transition-fast)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", flex: 1 }}>
                    <button
                      onClick={() => toggleTaskStatus(task.id)}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "var(--text-muted)",
                        padding: 0,
                        marginTop: "2px",
                      }}
                      title="Mark as completed"
                    >
                      <Circle size={17} />
                    </button>

                    <div>
                      <div style={{ fontSize: "13px", fontWeight: 500, color: "var(--text-white)", marginBottom: "3px" }}>
                        {task.title}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "11px", color: "var(--text-muted)" }}>
                        <span className={`badge ${task.category === "DSA" ? "badge-cyan" : task.category === "GSoC" ? "badge-amber" : "badge-violet"}`}>
                          {task.category}
                        </span>
                        <span>Due {task.dueDate}</span>
                        <span>•</span>
                        <span>{task.estimatedMins}m</span>
                      </div>
                    </div>
                  </div>

                  <span
                    className={`badge ${isHigh ? "badge-rose" : task.priority === "Medium" ? "badge-amber" : "badge-neutral"}`}
                  >
                    {task.priority}
                  </span>
                </div>
              );
            })}

            {pendingTasks.length === 0 && (
              <div style={{ textAlign: "center", padding: "30px", color: "var(--text-muted)" }}>
                <CheckCircle2 size={32} color="var(--emerald)" style={{ margin: "0 auto 8px auto" }} />
                <div>All tasks completed! Ready for new AI-planned directives.</div>
              </div>
            )}
          </div>

          {/* Recently Completed preview */}
          {completedTasks.length > 0 && (
            <div style={{ marginTop: "16px", paddingTop: "14px", borderTop: "1px solid var(--border-subtle)" }}>
              <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-muted)", marginBottom: "8px" }}>
                Recently Completed ({completedTasks.length})
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {completedTasks.slice(0, 2).map((t) => (
                  <div
                    key={t.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      fontSize: "12px",
                      color: "var(--text-muted)",
                      textDecoration: "line-through",
                    }}
                  >
                    <CheckCircle2 size={14} color="var(--emerald)" />
                    <span>{t.title}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Weekly Productivity Telemetry & Recent Check-in */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Weekly Bar Graph */}
          <div className="glass-panel" style={{ padding: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ fontSize: "15px", fontWeight: 700 }}>Weekly Telemetry</h3>
              <span className="mono" style={{ fontSize: "12px", color: "var(--emerald)" }}>
                {profile.weeklyCurrentHours}h / {profile.weeklyGoalHours}h
              </span>
            </div>

            {/* Custom SVG / CSS Bar Chart */}
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-between",
                height: "120px",
                paddingTop: "10px",
                borderBottom: "1px solid var(--border-subtle)",
                marginBottom: "8px",
              }}
            >
              {weeklyProductivity.map((item, idx) => {
                const maxH = 8; // scale up to 8 hrs
                const heightPct = Math.min(100, Math.round((item.hours / maxH) * 100));
                return (
                  <div
                    key={item.day}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "6px",
                      flex: 1,
                    }}
                  >
                    <div
                      style={{
                        width: "18px",
                        height: `${heightPct}%`,
                        minHeight: "4px",
                        backgroundColor: idx === 5 ? "var(--cyan)" : "rgba(56, 189, 248, 0.4)",
                        borderRadius: "4px 4px 0 0",
                        transition: "all var(--transition-normal)",
                      }}
                      title={`${item.day}: ${item.hours} hrs, ${item.dsaSolved} DSA solved`}
                    />
                    <span style={{ fontSize: "10px", color: "var(--text-muted)" }}>{item.day}</span>
                  </div>
                );
              })}
            </div>
            <div style={{ fontSize: "11px", color: "var(--text-secondary)", textAlign: "center" }}>
              Target: 5 hours daily deep work • Velocity is +14% vs last week
            </div>
          </div>

          {/* Recent Daily Check-in Snapshot */}
          <div className="glass-panel" style={{ padding: "18px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Sparkles size={16} color="var(--violet)" />
                <h4 style={{ fontSize: "14px", fontWeight: 600 }}>Last AI Review</h4>
              </div>
              <span className="badge badge-neutral" style={{ fontSize: "10px" }}>
                {checkIns[0]?.date || "Recent"}
              </span>
            </div>

            {checkIns[0] ? (
              <div style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                <p style={{ marginBottom: "6px" }}>
                  <strong style={{ color: "var(--emerald)" }}>Insight: </strong>
                  {checkIns[0].aiReview?.wentWell}
                </p>
                <p>
                  <strong style={{ color: "var(--amber)" }}>Next: </strong>
                  {checkIns[0].aiReview?.nextAction}
                </p>
              </div>
            ) : (
              <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                No check-in recorded yet today. Complete your first check-in to get an AI critique!
              </div>
            )}

            <button
              onClick={() => setActiveModal({ type: "dailyCheckIn" })}
              className="btn btn-secondary btn-sm"
              style={{ width: "100%", marginTop: "12px" }}
            >
              <span>Record Today's Check-in</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
