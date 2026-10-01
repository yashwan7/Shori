import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  Sparkles,
  Plus,
  CalendarCheck,
  Search,
  Bell,
  Menu,
  X,
  Target,
  Flame,
} from "lucide-react";

export function Header({ onToggleMobileMenu, isMobileMenuOpen }) {
  const { state, setActiveModal, setActiveTab } = useApp();
  const [searchQuery, setSearchQuery] = useState("");

  const todayStr = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <header
      style={{
        height: "var(--header-height)",
        backgroundColor: "rgba(12, 17, 28, 0.8)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
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
              <span className="status-live-dot" />
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

      {/* Center: Search & Filter bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          maxWidth: "340px",
          width: "100%",
          position: "relative",
          margin: "0 16px",
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

      {/* Right: Action Buttons */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
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

        {/* Profile Avatar Pill */}
        <div
          onClick={() => setActiveTab("Settings")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "4px 8px",
            background: "rgba(255, 255, 255, 0.05)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-full)",
            cursor: "pointer",
            marginLeft: "6px",
          }}
          title="Account & System Settings"
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
            {state.profile?.name ? state.profile.name[0] : "Y"}
          </div>
          <span style={{ fontSize: "12px", fontWeight: 500, color: "var(--text-white)" }}>
            {state.profile?.name}
          </span>
        </div>
      </div>
    </header>
  );
}
