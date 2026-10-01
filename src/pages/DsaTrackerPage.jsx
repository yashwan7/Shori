import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  Code2,
  Plus,
  Search,
  Filter,
  Flame,
  CheckCircle2,
  RotateCw,
  ExternalLink,
  Edit2,
  Trash2,
  AlertCircle,
  Clock,
  BookOpen,
  Check,
} from "lucide-react";

export function DsaTrackerPage() {
  const { state, addDsaProblem, deleteDsaProblem, setActiveModal, setDsaCurrentTopic } = useApp();
  const { dsa, profile } = state;

  const [selectedTopic, setSelectedTopic] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedRevision, setSelectedRevision] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Metrics
  const totalProblems = dsa.problems.length;
  const solvedProblems = dsa.problems.filter((p) => p.status === "Solved");
  const attemptedProblems = dsa.problems.filter((p) => p.status === "Attempted");
  const pendingProblems = dsa.problems.filter((p) => p.status === "Pending");

  const easySolved = solvedProblems.filter((p) => p.difficulty === "Easy").length;
  const mediumSolved = solvedProblems.filter((p) => p.difficulty === "Medium").length;
  const hardSolved = solvedProblems.filter((p) => p.difficulty === "Hard").length;

  const needsRevisionCount = dsa.problems.filter(
    (p) => p.revisionStatus === "Needs Revision"
  ).length;

  // Filtered problems list
  const filteredProblems = dsa.problems.filter((p) => {
    if (selectedTopic !== "All" && p.topic !== selectedTopic) return false;
    if (selectedDifficulty !== "All" && p.difficulty !== selectedDifficulty) return false;
    if (selectedStatus !== "All" && p.status !== selectedStatus) return false;
    if (selectedRevision !== "All" && p.revisionStatus !== selectedRevision) return false;
    if (
      searchQuery.trim() &&
      !p.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !p.notes.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
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
              <Code2 size={20} />
            </div>
            <h1 style={{ fontSize: "22px", fontWeight: 700 }}>DSA Command Center</h1>
            <span className="badge badge-cyan">{solvedProblems.length} Solved</span>
          </div>
          <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
            Current target topic:{" "}
            <strong style={{ color: "var(--text-white)" }}>{dsa.currentTopic}</strong> • Target:{" "}
            <strong style={{ color: "var(--cyan)" }}>{dsa.targetProblems} problems</strong>
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {/* Quick Streak Badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 14px",
              borderRadius: "var(--radius-md)",
              backgroundColor: "rgba(245, 158, 11, 0.12)",
              border: "1px solid rgba(245, 158, 11, 0.25)",
              color: "var(--amber)",
            }}
          >
            <Flame size={18} />
            <span style={{ fontSize: "13px", fontWeight: 700 }}>
              {profile.streak} Day Practice Streak
            </span>
          </div>

          <button
            onClick={() => setActiveModal({ type: "addProblem" })}
            className="btn btn-primary"
          >
            <Plus size={16} />
            <span>Record Problem</span>
          </button>
        </div>
      </div>

      {/* 2. Visual Progress Cards: Difficulty Distribution & Revision Status */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px" }}>
        {/* Total Solved Card */}
        <div className="glass-panel" style={{ padding: "18px" }}>
          <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "4px" }}>
            Total Solved / Target
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginBottom: "12px" }}>
            <span className="mono" style={{ fontSize: "26px", fontWeight: 800, color: "var(--cyan)" }}>
              {solvedProblems.length}
            </span>
            <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
              / {dsa.targetProblems} ({Math.round((solvedProblems.length / dsa.targetProblems) * 100)}%)
            </span>
          </div>
          <div className="progress-bar-container">
            <div
              className="progress-bar-fill"
              style={{
                width: `${Math.min(100, (solvedProblems.length / dsa.targetProblems) * 100)}%`,
                backgroundColor: "var(--cyan)",
              }}
            />
          </div>
        </div>

        {/* Difficulty Breakdown Card */}
        <div className="glass-panel" style={{ padding: "18px" }}>
          <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "8px" }}>
            Difficulty Distribution
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "12px" }}>
              <span style={{ color: "var(--emerald)" }}>Easy ({easySolved})</span>
              <span style={{ color: "var(--amber)" }}>Medium ({mediumSolved})</span>
              <span style={{ color: "var(--rose)" }}>Hard ({hardSolved})</span>
            </div>
            {/* Split bar */}
            <div style={{ display: "flex", height: "8px", borderRadius: "var(--radius-full)", overflow: "hidden", gap: "2px" }}>
              <div style={{ flex: easySolved || 1, backgroundColor: "var(--emerald)" }} title={`Easy: ${easySolved}`} />
              <div style={{ flex: mediumSolved || 1, backgroundColor: "var(--amber)" }} title={`Medium: ${mediumSolved}`} />
              <div style={{ flex: hardSolved || 1, backgroundColor: "var(--rose)" }} title={`Hard: ${hardSolved}`} />
            </div>
          </div>
        </div>

        {/* Revision Queue Card */}
        <div className="glass-panel" style={{ padding: "18px" }}>
          <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "4px" }}>
            Spaced Repetition Queue
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginBottom: "8px" }}>
            <span className="mono" style={{ fontSize: "26px", fontWeight: 800, color: needsRevisionCount > 0 ? "var(--amber)" : "var(--emerald)" }}>
              {needsRevisionCount}
            </span>
            <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
              flagged for review
            </span>
          </div>
          <div style={{ fontSize: "11px", color: "var(--text-secondary)" }}>
            {needsRevisionCount > 0
              ? "Revising tricky algorithms cements intuition before technical interviews."
              : "All solved problems are solid or currently reviewed."}
          </div>
        </div>

        {/* Status Distribution Card */}
        <div className="glass-panel" style={{ padding: "18px" }}>
          <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "6px" }}>
            Attempt Status
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "8px" }}>
            <div style={{ textAlign: "center" }}>
              <div className="mono" style={{ fontSize: "18px", fontWeight: 700, color: "var(--emerald)" }}>
                {solvedProblems.length}
              </div>
              <div style={{ fontSize: "10px", color: "var(--text-muted)" }}>Solved</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div className="mono" style={{ fontSize: "18px", fontWeight: 700, color: "var(--amber)" }}>
                {attemptedProblems.length}
              </div>
              <div style={{ fontSize: "10px", color: "var(--text-muted)" }}>Attempted</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div className="mono" style={{ fontSize: "18px", fontWeight: 700, color: "var(--text-muted)" }}>
                {pendingProblems.length}
              </div>
              <div style={{ fontSize: "10px", color: "var(--text-muted)" }}>Pending</div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Topic Selection Pill Strip */}
      <div className="glass-panel" style={{ padding: "16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
          <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", textTransform: "uppercase" }}>
            DSA Topics & Categories
          </div>
          <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
            Click topic to filter list or double-click to set as current focus
          </div>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          <button
            onClick={() => setSelectedTopic("All")}
            className={`btn btn-sm ${selectedTopic === "All" ? "btn-primary" : "btn-secondary"}`}
          >
            All Topics ({totalProblems})
          </button>

          {dsa.topics.map((t) => {
            const count = dsa.problems.filter((p) => p.topic === t).length;
            const isSelected = selectedTopic === t;
            const isCurrentFocus = dsa.currentTopic === t;
            return (
              <button
                key={t}
                onClick={() => setSelectedTopic(t)}
                onDoubleClick={() => setDsaCurrentTopic(t)}
                className={`btn btn-sm ${isSelected ? "btn-primary" : "btn-secondary"}`}
                style={{
                  borderColor: isCurrentFocus ? "var(--cyan)" : undefined,
                  boxShadow: isCurrentFocus ? "0 0 10px rgba(56, 189, 248, 0.25)" : undefined,
                }}
                title={isCurrentFocus ? "Current Focus Topic" : "Click to filter, double click to set focus"}
              >
                <span>{t}</span>
                <span style={{ fontSize: "10px", opacity: 0.8 }}>({count})</span>
                {isCurrentFocus && <span className="status-live-dot" style={{ width: "6px", height: "6px" }} />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Filter & Search Controls */}
      <div
        className="glass-panel"
        style={{
          padding: "16px 20px",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1, minWidth: "260px" }}>
          <Search size={16} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Search problems, patterns, or notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: "100%", maxWidth: "340px" }}
          />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          {/* Difficulty filter */}
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            style={{ width: "auto" }}
          >
            <option value="All">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>

          {/* Status filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            style={{ width: "auto" }}
          >
            <option value="All">All Statuses</option>
            <option value="Solved">Solved</option>
            <option value="Attempted">Attempted</option>
            <option value="Pending">Pending</option>
          </select>

          {/* Revision filter */}
          <select
            value={selectedRevision}
            onChange={(e) => setSelectedRevision(e.target.value)}
            style={{ width: "auto" }}
          >
            <option value="All">All Revision</option>
            <option value="Needs Revision">Needs Revision</option>
            <option value="Revised">Revised</option>
            <option value="Solid">Solid</option>
          </select>
        </div>
      </div>

      {/* 5. Problems Table */}
      <div className="glass-panel" style={{ overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr
                style={{
                  borderBottom: "1px solid var(--border-medium)",
                  backgroundColor: "rgba(255, 255, 255, 0.02)",
                  fontSize: "12px",
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                }}
              >
                <th style={{ padding: "14px 18px" }}>Problem</th>
                <th style={{ padding: "14px 18px" }}>Topic</th>
                <th style={{ padding: "14px 18px" }}>Difficulty</th>
                <th style={{ padding: "14px 18px" }}>Status</th>
                <th style={{ padding: "14px 18px" }}>Revision</th>
                <th style={{ padding: "14px 18px" }}>Last Practiced</th>
                <th style={{ padding: "14px 18px", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProblems.map((prob) => {
                const diffBadgeClass =
                  prob.difficulty === "Easy"
                    ? "badge-emerald"
                    : prob.difficulty === "Medium"
                    ? "badge-amber"
                    : "badge-rose";

                const revBadgeClass =
                  prob.revisionStatus === "Needs Revision"
                    ? "badge-amber"
                    : prob.revisionStatus === "Revised"
                    ? "badge-cyan"
                    : "badge-emerald";

                return (
                  <tr
                    key={prob.id}
                    style={{
                      borderBottom: "1px solid var(--border-subtle)",
                      transition: "background var(--transition-fast)",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.02)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "transparent")
                    }
                  >
                    <td style={{ padding: "14px 18px" }}>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-white)" }}>
                            {prob.title}
                          </span>
                          {prob.link && (
                            <a
                              href={prob.link}
                              target="_blank"
                              rel="noreferrer"
                              style={{ color: "var(--text-muted)", display: "inline-flex" }}
                              title="Open in LeetCode"
                            >
                              <ExternalLink size={14} />
                            </a>
                          )}
                        </div>
                        {prob.notes && (
                          <div
                            style={{
                              fontSize: "12px",
                              color: "var(--text-secondary)",
                              marginTop: "4px",
                              maxWidth: "460px",
                              lineHeight: 1.4,
                            }}
                          >
                            {prob.notes}
                          </div>
                        )}
                      </div>
                    </td>

                    <td style={{ padding: "14px 18px" }}>
                      <span className="badge badge-neutral">{prob.topic}</span>
                    </td>

                    <td style={{ padding: "14px 18px" }}>
                      <span className={`badge ${diffBadgeClass}`}>{prob.difficulty}</span>
                    </td>

                    <td style={{ padding: "14px 18px" }}>
                      <span
                        className={`badge ${prob.status === "Solved" ? "badge-emerald" : prob.status === "Attempted" ? "badge-amber" : "badge-neutral"}`}
                      >
                        {prob.status}
                      </span>
                    </td>

                    <td style={{ padding: "14px 18px" }}>
                      <span className={`badge ${revBadgeClass}`}>{prob.revisionStatus}</span>
                    </td>

                    <td style={{ padding: "14px 18px", fontSize: "12px", color: "var(--text-muted)" }}>
                      {prob.lastPracticed || "Not logged"}
                    </td>

                    <td style={{ padding: "14px 18px", textAlign: "right" }}>
                      <div style={{ display: "inline-flex", gap: "6px" }}>
                        <button
                          onClick={() => setActiveModal({ type: "addProblem", data: prob })}
                          className="btn btn-ghost btn-icon"
                          title="Edit Problem"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => deleteDsaProblem(prob.id)}
                          className="btn btn-ghost btn-icon"
                          style={{ color: "var(--rose)" }}
                          title="Delete Problem"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredProblems.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>
                    No problems matching filter criteria. Click "Record Problem" to add one!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
