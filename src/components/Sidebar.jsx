import React from "react";
import { useApp } from "../context/AppContext";
import {
  LayoutDashboard,
  Code2,
  GitBranch,
  Target,
  CheckSquare,
  BarChart3,
  CalendarCheck,
  Sparkles,
  Settings,
  Flame,
  Zap,
} from "lucide-react";

export function Sidebar() {
  const { activeTab, setActiveTab, state, setActiveModal } = useApp();
  const streak = state.profile?.streak || 0;
  const pendingTasks = state.tasks.filter((t) => t.status !== "Completed").length;
  const revisionCount = state.dsa.problems.filter(
    (p) => p.revisionStatus === "Needs Revision"
  ).length;

  const navItems = [
    { id: "Dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "DSA", label: "DSA Tracker", icon: Code2, badge: revisionCount > 0 ? `${revisionCount} rev` : null, badgeColor: "badge-amber" },
    { id: "GSoC", label: "GSoC 2027", icon: GitBranch, highlight: true },
    { id: "Goals", label: "Other Goals", icon: Target, badge: state.goals.length },
    { id: "Tasks", label: "Task Engine", icon: CheckSquare, badge: pendingTasks, badgeColor: "badge-cyan" },
    { id: "Analytics", label: "Analytics", icon: BarChart3 },
    { id: "Daily Check-in", label: "Daily Check-in", icon: CalendarCheck, badge: "Daily", badgeColor: "badge-emerald" },
    { id: "AI Planner", label: "AI Planner", icon: Sparkles, badge: "Smart", badgeColor: "badge-violet" },
    { id: "Settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside
      style={{
        width: "var(--sidebar-width)",
        backgroundColor: "var(--bg-sidebar)",
        borderRight: "1px solid var(--border-subtle)",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        height: "100vh",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      {/* Brand Header */}
      <div
        style={{
          padding: "20px 20px 16px 20px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          borderBottom: "1px solid var(--border-subtle)",
        }}
      >
        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "var(--radius-md)",
            background: "linear-gradient(135deg, #0284c7 0%, #7c3aed 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "var(--shadow-glow-cyan)",
          }}
        >
          <Zap size={20} color="#ffffff" />
        </div>
        <div>
          <div
            style={{
              fontSize: "16px",
              fontWeight: 700,
              letterSpacing: "0.04em",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <span>SHORI</span>
            <span
              style={{
                fontSize: "10px",
                padding: "1px 5px",
                background: "rgba(56, 189, 248, 0.15)",
                color: "var(--cyan)",
                borderRadius: "4px",
                border: "1px solid rgba(56, 189, 248, 0.3)",
              }}
            >
              v2.0
            </span>
          </div>
          <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
            Command Center
          </div>
        </div>
      </div>

      {/* Streak & Velocity Banner */}
      <div style={{ padding: "14px 16px 8px 16px" }}>
        <div
          style={{
            background: "linear-gradient(135deg, rgba(245, 158, 11, 0.12), rgba(244, 63, 94, 0.08))",
            border: "1px solid rgba(245, 158, 11, 0.25)",
            borderRadius: "var(--radius-md)",
            padding: "10px 12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "var(--radius-full)",
                background: "rgba(245, 158, 11, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Flame size={18} color="#f59e0b" />
            </div>
            <div>
              <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-white)" }}>
                {streak} Day Streak
              </div>
              <div style={{ fontSize: "10px", color: "var(--text-secondary)" }}>
                Consecutive momentum
              </div>
            </div>
          </div>
          <span className="status-live-dot" title="Active today" />
        </div>
      </div>

      {/* Navigation List */}
      <nav
        style={{
          flex: 1,
          padding: "12px 10px",
          display: "flex",
          flexDirection: "column",
          gap: "4px",
          overflowY: "auto",
        }}
      >
        <div
          style={{
            fontSize: "10px",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            color: "var(--text-subtle)",
            padding: "6px 10px 4px 10px",
          }}
        >
          Navigation
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "9px 12px",
                borderRadius: "var(--radius-md)",
                backgroundColor: isActive ? "var(--cyan-subtle)" : "transparent",
                color: isActive ? "var(--cyan)" : "var(--text-secondary)",
                border: isActive
                  ? "1px solid rgba(56, 189, 248, 0.3)"
                  : "1px solid transparent",
                cursor: "pointer",
                transition: "all var(--transition-fast)",
                width: "100%",
                textAlign: "left",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.04)";
                  e.currentTarget.style.color = "var(--text-white)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "var(--text-secondary)";
                }
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Icon size={17} color={isActive ? "var(--cyan)" : "currentColor"} />
                <span
                  style={{
                    fontSize: "13px",
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? "var(--text-white)" : "inherit",
                  }}
                >
                  {item.label}
                </span>
              </div>

              {item.badge && (
                <span
                  className={`badge ${item.badgeColor || "badge-neutral"}`}
                  style={{ fontSize: "10px", padding: "1px 6px" }}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Quick Launch Action Button in Sidebar */}
      <div style={{ padding: "16px", borderTop: "1px solid var(--border-subtle)" }}>
        <button
          onClick={() => setActiveModal({ type: "dailyCheckIn" })}
          className="btn btn-ai"
          style={{ width: "100%", fontSize: "12px", padding: "10px" }}
        >
          <CalendarCheck size={16} />
          <span>Complete Check-In</span>
        </button>
      </div>
    </aside>
  );
}
