import React, { useState, useRef, useEffect } from "react";
import { useApp } from "../context/AppContext";
import {
  Sparkles,
  Plus,
  CalendarCheck,
  Search,
  Menu,
  X,
  Database,
  User,
  LogOut,
  LogIn,
  ShieldCheck,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  ChevronDown,
} from "lucide-react";

export function Header({ onToggleMobileMenu, isMobileMenuOpen }) {
  const {
    state,
    user,
    logout,
    isCloudConnected,
    isSupabaseConfigured,
    dbLoading,
    refreshExternalStats,
    isStatsLoading,
    setActiveModal,
    setActiveTab,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState("");
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  const todayStr = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  // Close user menu when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header
      style={{
        height: "var(--header-height)",
        backgroundColor: "rgba(12, 17, 28, 0.85)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        borderBottom: "1px solid var(--border-subtle)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        position: "sticky",
        top: 0,
        zIndex: 40,
      }}
    >
      {/* Left: Mobile Toggle & Date Indicator */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <button
          className="btn btn-ghost btn-icon mobile-menu-btn"
          onClick={onToggleMobileMenu}
          aria-label="Toggle Navigation"
          style={{ display: "none" }}
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span className={`status-live-dot ${isCloudConnected ? "live-green" : "live-amber"}`} />
              <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-white)" }}>
                {todayStr}
              </span>
            </div>
            <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
              Target: <span style={{ color: "var(--cyan)" }}>{state.profile?.target}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Center: Search & Cloud Sync Status Badge */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1, justifyContent: "center", maxWidth: "600px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            maxWidth: "320px",
            width: "100%",
            position: "relative",
          }}
          className="header-search-box"
        >
          <Search
            size={15}
            color="var(--text-muted)"
            style={{ position: "absolute", left: "10px", pointerEvents: "none" }}
          />
          <input
            type="text"
            placeholder="Jump to task, algorithm or org..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && searchQuery.trim()) {
                setActiveTab("Tasks");
              }
            }}
            style={{
              paddingLeft: "32px",
              fontSize: "12px",
              height: "34px",
              backgroundColor: "rgba(255, 255, 255, 0.04)",
              border: "1px solid var(--border-subtle)",
            }}
          />
        </div>

        {/* Database Status Pill */}
        {isCloudConnected ? (
          <div
            onClick={() => setActiveModal({ type: "databaseConfig" })}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "4px 10px",
              borderRadius: "var(--radius-full)",
              background: "rgba(16, 185, 129, 0.12)",
              border: "1px solid rgba(16, 185, 129, 0.3)",
              color: "var(--emerald)",
              fontSize: "11px",
              fontWeight: 600,
              cursor: "pointer",
            }}
            title="Connected to Supabase PostgreSQL (Click to view database settings)"
          >
            <Database size={12} />
            <span>Cloud Synced</span>
          </div>
        ) : (
          <button
            onClick={() => setActiveModal({ type: isSupabaseConfigured ? "auth" : "databaseConfig" })}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "4px 10px",
              borderRadius: "var(--radius-full)",
              background: "rgba(245, 158, 11, 0.12)",
              border: "1px solid rgba(245, 158, 11, 0.3)",
              color: "var(--amber)",
              fontSize: "11px",
              fontWeight: 600,
              cursor: "pointer",
            }}
            title="Click to connect Supabase or Sign In"
          >
            <AlertCircle size={12} />
            <span>{isSupabaseConfigured ? "Guest Mode (Sign In)" : "Connect Supabase"}</span>
          </button>
        )}
      </div>

      {/* Right: Action Buttons & Auth / Profile */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <button
          onClick={refreshExternalStats}
          disabled={isStatsLoading}
          className="btn btn-ghost btn-icon"
          title="Refresh live LeetCode & GitHub data"
          style={{ width: "32px", height: "32px" }}
        >
          <RefreshCw size={15} className={isStatsLoading ? "spin" : ""} />
        </button>

        <button
          onClick={() => setActiveTab("AI Planner")}
          className="btn btn-ai btn-sm"
          title="Open AI Command Advisor"
        >
          <Sparkles size={14} />
          <span>Ask AI</span>
        </button>

        <button
          onClick={() => setActiveModal({ type: "addTask" })}
          className="btn btn-primary btn-sm"
        >
          <Plus size={14} />
          <span>New Task</span>
        </button>

        <button
          onClick={() => setActiveModal({ type: "dailyCheckIn" })}
          className="btn btn-secondary btn-sm"
        >
          <CalendarCheck size={14} />
          <span>Check-in</span>
        </button>

        {/* User Profile / Auth Button */}
        {user ? (
          <div style={{ position: "relative" }} ref={userMenuRef}>
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "4px 10px 4px 6px",
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-full)",
                cursor: "pointer",
                color: "var(--text-white)",
              }}
            >
              <div
                style={{
                  width: "26px",
                  height: "26px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "12px",
                  fontWeight: 700,
                  color: "#fff",
                }}
              >
                {state.profile?.name ? state.profile.name[0].toUpperCase() : user.email ? user.email[0].toUpperCase() : "U"}
              </div>
              <span style={{ fontSize: "12px", fontWeight: 500, maxWidth: "100px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {state.profile?.name || user.email?.split("@")[0]}
              </span>
              <ChevronDown size={14} color="var(--text-muted)" />
            </button>

            {/* Dropdown Menu */}
            {isUserMenuOpen && (
              <div
                className="glass-panel-elevated"
                style={{
                  position: "absolute",
                  right: 0,
                  top: "100%",
                  marginTop: "8px",
                  width: "220px",
                  padding: "8px",
                  borderRadius: "var(--radius-md)",
                  zIndex: 100,
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                }}
              >
                <div style={{ padding: "8px 10px", borderBottom: "1px solid var(--border-subtle)" }}>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-white)" }}>
                    {state.profile?.name || "User"}
                  </div>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {user.email}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setActiveTab("Settings");
                    setIsUserMenuOpen(false);
                  }}
                  className="btn btn-ghost btn-sm"
                  style={{ justifyContent: "flex-start", width: "100%" }}
                >
                  <User size={14} />
                  <span>Profile & Settings</span>
                </button>

                <button
                  onClick={() => {
                    setActiveModal({ type: "databaseConfig" });
                    setIsUserMenuOpen(false);
                  }}
                  className="btn btn-ghost btn-sm"
                  style={{ justifyContent: "flex-start", width: "100%" }}
                >
                  <Database size={14} />
                  <span>Database Settings</span>
                </button>

                <div style={{ height: "1px", backgroundColor: "var(--border-subtle)", margin: "4px 0" }} />

                <button
                  onClick={() => {
                    logout();
                    setIsUserMenuOpen(false);
                  }}
                  className="btn btn-ghost btn-sm"
                  style={{ justifyContent: "flex-start", width: "100%", color: "var(--rose)" }}
                >
                  <LogOut size={14} />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => setActiveModal({ type: "auth" })}
            className="btn btn-secondary btn-sm"
            style={{ borderColor: "rgba(56, 189, 248, 0.4)", color: "var(--cyan)" }}
          >
            <LogIn size={14} />
            <span>Sign In / Register</span>
          </button>
        )}
      </div>
    </header>
  );
}
