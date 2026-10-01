import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  Target,
  Plus,
  Calendar,
  CheckSquare,
  Square,
  Edit2,
  Trash2,
  Layers,
  Sparkles,
} from "lucide-react";

export function GoalsPage() {
  const { state, deleteGoal, toggleGoalMilestone, setActiveModal } = useApp();
  const { goals } = state;
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "AI/ML", "Projects", "Skills", "College", "Certifications"];

  const filteredGoals = goals.filter((g) => {
    if (selectedCategory !== "All" && g.category !== selectedCategory) return false;
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
                background: "rgba(168, 85, 247, 0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--violet)",
              }}
            >
              <Target size={20} />
            </div>
            <h1 style={{ fontSize: "22px", fontWeight: 700 }}>Custom Technical Goals & Projects</h1>
            <span className="badge badge-violet">{goals.length} Active Tracks</span>
          </div>
          <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
            High-leverage engineering tracks (RAG, OrthoTwin, Computer Vision, College Capstone)
          </p>
        </div>

        <button
          onClick={() => setActiveModal({ type: "addGoal" })}
          className="btn btn-primary"
        >
          <Plus size={16} />
          <span>New Technical Goal</span>
        </button>
      </div>

      {/* 2. Category Selector */}
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`btn btn-sm ${selectedCategory === cat ? "btn-primary" : "btn-secondary"}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 3. Goals Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "20px" }}>
        {filteredGoals.map((goal) => {
          const completedMilestones = (goal.milestones || []).filter((m) => m.completed).length;
          const totalMilestones = (goal.milestones || []).length;

          return (
            <div
              key={goal.id}
              className="glass-panel"
              style={{
                padding: "22px",
                display: "flex",
                flexDirection: "column",
                position: "relative",
              }}
            >
              {/* Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                <div>
                  <span className="badge badge-violet" style={{ marginBottom: "6px" }}>
                    {goal.category}
                  </span>
                  <h3 style={{ fontSize: "17px", fontWeight: 700, color: "var(--text-white)" }}>
                    {goal.name}
                  </h3>
                </div>

                <div style={{ display: "flex", gap: "4px" }}>
                  <button
                    onClick={() => setActiveModal({ type: "addGoal", data: goal })}
                    className="btn btn-ghost btn-icon"
                    title="Edit Goal"
                  >
                    <Edit2 size={15} />
                  </button>
                  <button
                    onClick={() => deleteGoal(goal.id)}
                    className="btn btn-ghost btn-icon"
                    style={{ color: "var(--rose)" }}
                    title="Delete Goal"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              {/* Description */}
              {goal.description && (
                <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "16px", lineHeight: 1.5 }}>
                  {goal.description}
                </p>
              )}

              {/* Progress bar */}
              <div style={{ marginBottom: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "6px" }}>
                  <span style={{ color: "var(--text-muted)" }}>Execution Progress</span>
                  <span className="mono" style={{ fontWeight: 700, color: "var(--violet)" }}>
                    {goal.progress}%
                  </span>
                </div>
                <div className="progress-bar-container">
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${goal.progress}%`, backgroundColor: "var(--violet)" }}
                  />
                </div>
              </div>

              {/* Milestones Checklist */}
              <div style={{ marginBottom: "16px", flex: 1 }}>
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    color: "var(--text-muted)",
                    marginBottom: "8px",
                  }}
                >
                  Deliverables ({completedMilestones}/{totalMilestones})
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  {(goal.milestones || []).map((m, idx) => (
                    <div
                      key={idx}
                      onClick={() => toggleGoalMilestone(goal.id, idx)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "6px 8px",
                        borderRadius: "var(--radius-sm)",
                        backgroundColor: "rgba(255, 255, 255, 0.02)",
                        cursor: "pointer",
                        fontSize: "12px",
                      }}
                    >
                      {m.completed ? (
                        <CheckSquare size={15} color="var(--emerald)" />
                      ) : (
                        <Square size={15} color="var(--text-muted)" />
                      )}
                      <span
                        style={{
                          color: m.completed ? "var(--text-muted)" : "var(--text-primary)",
                          textDecoration: m.completed ? "line-through" : "none",
                        }}
                      >
                        {m.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Meta details footer */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingTop: "12px",
                  borderTop: "1px solid var(--border-subtle)",
                  fontSize: "11px",
                  color: "var(--text-muted)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <Calendar size={13} />
                  <span>Target: {goal.targetDate || "Continuous"}</span>
                </div>

                {goal.notes && (
                  <span title={goal.notes} style={{ color: "var(--cyan)", cursor: "help" }}>
                    Notes available
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
