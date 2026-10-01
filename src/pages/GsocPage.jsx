import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  GitBranch,
  Plus,
  CheckCircle2,
  Clock,
  ExternalLink,
  Calendar,
  AlertCircle,
  FolderGit2,
  GitPullRequest,
  CheckSquare,
  Square,
  ChevronRight,
  TrendingUp,
  Trash2,
} from "lucide-react";

export function GsocPage() {
  const {
    state,
    updateGsocMilestoneStatus,
    addGsocMilestone,
    deleteGsocOrg,
    deleteGsocContribution,
    toggleLearningRequirement,
    setActiveModal,
  } = useApp();

  const { gsoc } = state;
  const [activeTabSub, setActiveTabSub] = useState("roadmap"); // 'roadmap' | 'orgs' | 'contributions' | 'deadlines'
  const [newMilestoneTitle, setNewMilestoneTitle] = useState("");

  const completedMilestones = gsoc.milestones.filter((m) => m.status === "Completed").length;
  const totalMilestones = gsoc.milestones.length;
  const roadmapPct = Math.round((completedMilestones / (totalMilestones || 1)) * 100);

  const mergedCount = gsoc.contributions.filter((c) => c.status === "Merged").length;
  const underReviewCount = gsoc.contributions.filter((c) => c.status === "Under Review").length;

  const handleAddMilestone = (e) => {
    e.preventDefault();
    if (!newMilestoneTitle.trim()) return;
    addGsocMilestone({
      title: newMilestoneTitle.trim(),
      desc: "Custom contributor milestone",
    });
    setNewMilestoneTitle("");
  };

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
                background: "rgba(245, 158, 11, 0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--amber)",
              }}
            >
              <GitBranch size={20} />
            </div>
            <h1 style={{ fontSize: "22px", fontWeight: 700 }}>Google Summer of Code {gsoc.targetYear}</h1>
            <span className="badge badge-amber">{roadmapPct}% Roadmap Ready</span>
          </div>
          <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
            Current Focus Phase: <strong style={{ color: "var(--text-white)" }}>{gsoc.currentMilestone}</strong>
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button
            onClick={() => setActiveModal({ type: "addContribution" })}
            className="btn btn-secondary"
          >
            <GitPullRequest size={15} />
            <span>Log PR / Issue</span>
          </button>
          <button
            onClick={() => setActiveModal({ type: "addOrg" })}
            className="btn btn-primary"
          >
            <Plus size={15} />
            <span>Add Organization</span>
          </button>
        </div>
      </div>

      {/* 2. Top Stats strip */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
        <div className="glass-panel" style={{ padding: "18px" }}>
          <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "4px" }}>
            Milestones Completed
          </div>
          <div className="mono" style={{ fontSize: "24px", fontWeight: 800, color: "var(--amber)" }}>
            {completedMilestones} / {totalMilestones}
          </div>
          <div className="progress-bar-container" style={{ marginTop: "10px" }}>
            <div
              className="progress-bar-fill"
              style={{ width: `${roadmapPct}%`, backgroundColor: "var(--amber)" }}
            />
          </div>
        </div>

        <div className="glass-panel" style={{ padding: "18px" }}>
          <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "4px" }}>
            Organizations Tracked
          </div>
          <div className="mono" style={{ fontSize: "24px", fontWeight: 800, color: "var(--cyan)" }}>
            {gsoc.organizations.length}
          </div>
          <div style={{ fontSize: "11px", color: "var(--text-secondary)", marginTop: "6px" }}>
            Top: {gsoc.organizations[0]?.name || "None"}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: "18px" }}>
          <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "4px" }}>
            Contributions
          </div>
          <div className="mono" style={{ fontSize: "24px", fontWeight: 800, color: "var(--emerald)" }}>
            {gsoc.contributions.length}
          </div>
          <div style={{ fontSize: "11px", color: "var(--text-secondary)", marginTop: "6px" }}>
            {mergedCount} Merged • {underReviewCount} Under Review
          </div>
        </div>

        <div className="glass-panel" style={{ padding: "18px" }}>
          <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "4px" }}>
            Critical Proposal Due
          </div>
          <div style={{ fontSize: "18px", fontWeight: 800, color: "var(--rose)", marginTop: "4px" }}>
            April 8, 2025
          </div>
          <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "6px" }}>
            18:00 UTC hard cutoff
          </div>
        </div>
      </div>

      {/* 3. Section Selector Tabs */}
      <div style={{ display: "flex", gap: "8px", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "12px" }}>
        <button
          onClick={() => setActiveTabSub("roadmap")}
          className={`btn ${activeTabSub === "roadmap" ? "btn-primary" : "btn-secondary"}`}
        >
          <span>Preparation Roadmap</span>
        </button>
        <button
          onClick={() => setActiveTabSub("orgs")}
          className={`btn ${activeTabSub === "orgs" ? "btn-primary" : "btn-secondary"}`}
        >
          <span>Organizations & Projects ({gsoc.organizations.length})</span>
        </button>
        <button
          onClick={() => setActiveTabSub("contributions")}
          className={`btn ${activeTabSub === "contributions" ? "btn-primary" : "btn-secondary"}`}
        >
          <span>Contributions & PRs ({gsoc.contributions.length})</span>
        </button>
        <button
          onClick={() => setActiveTabSub("deadlines")}
          className={`btn ${activeTabSub === "deadlines" ? "btn-primary" : "btn-secondary"}`}
        >
          <span>Timeline & Learning Requirements</span>
        </button>
      </div>

      {/* 4. Tab Sub-Views */}

      {/* Sub-view A: Roadmap Milestones */}
      {activeTabSub === "roadmap" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div className="glass-panel" style={{ padding: "20px" }}>
            <h2 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "16px" }}>
              GSoC Step-by-Step Preparation Roadmap
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {gsoc.milestones.map((milestone, idx) => {
                const isCompleted = milestone.status === "Completed";
                const isInProgress = milestone.status === "In Progress";

                return (
                  <div
                    key={milestone.id}
                    style={{
                      padding: "14px 16px",
                      borderRadius: "var(--radius-md)",
                      backgroundColor: isCompleted
                        ? "rgba(16, 185, 129, 0.05)"
                        : isInProgress
                        ? "rgba(245, 158, 11, 0.05)"
                        : "rgba(255, 255, 255, 0.02)",
                      border: isCompleted
                        ? "1px solid rgba(16, 185, 129, 0.25)"
                        : isInProgress
                        ? "1px solid rgba(245, 158, 11, 0.25)"
                        : "1px solid var(--border-subtle)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "14px",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div
                        style={{
                          width: "28px",
                          height: "28px",
                          borderRadius: "50%",
                          background: isCompleted
                            ? "var(--emerald)"
                            : isInProgress
                            ? "var(--amber)"
                            : "rgba(255, 255, 255, 0.1)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#fff",
                          fontSize: "12px",
                          fontWeight: 700,
                        }}
                      >
                        {isCompleted ? <CheckCircle2 size={16} /> : idx + 1}
                      </div>

                      <div>
                        <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-white)" }}>
                          {milestone.title}
                        </div>
                        {milestone.desc && (
                          <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "2px" }}>
                            {milestone.desc}
                          </div>
                        )}
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <select
                        value={milestone.status}
                        onChange={(e) => updateGsocMilestoneStatus(milestone.id, e.target.value)}
                        style={{
                          width: "auto",
                          padding: "4px 10px",
                          fontSize: "12px",
                          color: isCompleted ? "var(--emerald)" : isInProgress ? "var(--amber)" : "var(--text-secondary)",
                          borderColor: isCompleted
                            ? "rgba(16, 185, 129, 0.3)"
                            : isInProgress
                            ? "rgba(245, 158, 11, 0.3)"
                            : "var(--border-subtle)",
                        }}
                      >
                        <option value="Not Started">Not Started</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Add Custom Milestone */}
            <form onSubmit={handleAddMilestone} style={{ marginTop: "18px", display: "flex", gap: "10px" }}>
              <input
                type="text"
                placeholder="Add customized GSoC milestone..."
                value={newMilestoneTitle}
                onChange={(e) => setNewMilestoneTitle(e.target.value)}
              />
              <button type="submit" className="btn btn-secondary">
                <Plus size={15} />
                <span>Add Milestone</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Sub-view B: Organizations & Projects */}
      {activeTabSub === "orgs" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "18px" }}>
          {gsoc.organizations.map((org) => (
            <div key={org.id} className="glass-panel" style={{ padding: "20px", display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                <div>
                  <h3 style={{ fontSize: "16px", fontWeight: 700 }}>{org.name}</h3>
                  <span className="badge badge-amber" style={{ marginTop: "4px" }}>
                    {org.status}
                  </span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  {org.repoUrl && (
                    <a
                      href={org.repoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-ghost btn-icon"
                      title="Open GitHub Repo"
                    >
                      <ExternalLink size={16} />
                    </a>
                  )}
                  <button
                    onClick={() => deleteGsocOrg(org.id)}
                    className="btn btn-ghost btn-icon"
                    style={{ color: "var(--rose)" }}
                    title="Remove Organization"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div style={{ marginBottom: "12px" }}>
                <div style={{ fontSize: "11px", color: "var(--text-muted)", marginBottom: "4px" }}>Project Focus</div>
                <div style={{ fontSize: "13px", fontWeight: 500, color: "var(--text-white)" }}>
                  {org.projectIdea || "General open source issues & performance"}
                </div>
              </div>

              {/* Tech Stack Tags */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "14px" }}>
                {org.techStack?.map((tech) => (
                  <span key={tech} className="badge badge-neutral" style={{ fontSize: "10px" }}>
                    {tech}
                  </span>
                ))}
              </div>

              {/* Skill Match bar */}
              <div style={{ marginTop: "auto", paddingTop: "12px", borderTop: "1px solid var(--border-subtle)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", marginBottom: "4px" }}>
                  <span style={{ color: "var(--text-secondary)" }}>Skills Match</span>
                  <span className="mono" style={{ color: "var(--cyan)", fontWeight: 600 }}>
                    {org.matchPercentage}%
                  </span>
                </div>
                <div className="progress-bar-container" style={{ height: "4px" }}>
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${org.matchPercentage}%`, backgroundColor: "var(--cyan)" }}
                  />
                </div>
              </div>
            </div>
          ))}

          {/* Add Org Card */}
          <div
            onClick={() => setActiveModal({ type: "addOrg" })}
            className="glass-panel"
            style={{
              padding: "30px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              borderStyle: "dashed",
              borderColor: "var(--border-medium)",
              minHeight: "180px",
            }}
          >
            <Plus size={28} color="var(--amber)" style={{ marginBottom: "8px" }} />
            <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-white)" }}>
              Explore Another Organization
            </div>
            <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px" }}>
              Add Apache, Linux Foundation, NumFOCUS or CNCF
            </div>
          </div>
        </div>
      )}

      {/* Sub-view C: Contributions & PRs */}
      {activeTabSub === "contributions" && (
        <div className="glass-panel" style={{ padding: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h2 style={{ fontSize: "16px", fontWeight: 700 }}>Open Source Contributions & PR Telemetry</h2>
            <button
              onClick={() => setActiveModal({ type: "addContribution" })}
              className="btn btn-primary btn-sm"
            >
              <Plus size={14} />
              <span>Log Contribution</span>
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {gsoc.contributions.map((c) => {
              const statusBadge =
                c.status === "Merged"
                  ? "badge-emerald"
                  : c.status === "Under Review"
                  ? "badge-amber"
                  : "badge-cyan";

              return (
                <div
                  key={c.id}
                  style={{
                    padding: "14px 16px",
                    borderRadius: "var(--radius-md)",
                    backgroundColor: "rgba(255, 255, 255, 0.02)",
                    border: "1px solid var(--border-subtle)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "14px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", flex: 1 }}>
                    <div
                      style={{
                        padding: "6px 8px",
                        borderRadius: "var(--radius-sm)",
                        background: c.type === "PR" ? "rgba(99, 102, 241, 0.15)" : "rgba(245, 158, 11, 0.15)",
                        color: c.type === "PR" ? "var(--indigo)" : "var(--amber)",
                        fontSize: "11px",
                        fontWeight: 700,
                      }}
                    >
                      {c.type}
                    </div>

                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-white)" }}>
                          {c.title}
                        </span>
                        {c.url && (
                          <a
                            href={c.url}
                            target="_blank"
                            rel="noreferrer"
                            style={{ color: "var(--text-muted)" }}
                          >
                            <ExternalLink size={14} />
                          </a>
                        )}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "11px", color: "var(--text-muted)", marginTop: "4px" }}>
                        <span style={{ color: "var(--text-primary)" }}>{c.org}</span>
                        <span>•</span>
                        <span>{c.date}</span>
                      </div>
                      {c.notes && (
                        <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "4px" }}>
                          {c.notes}
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span className={`badge ${statusBadge}`}>{c.status}</span>
                    <button
                      onClick={() => deleteGsocContribution(c.id)}
                      className="btn btn-ghost btn-icon"
                      style={{ color: "var(--rose)" }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Sub-view D: Timeline & Learning Requirements */}
      {activeTabSub === "deadlines" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }} className="gsoc-split-grid">
          {/* Deadlines list */}
          <div className="glass-panel" style={{ padding: "20px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "16px" }}>
              Official GSoC 2025 Calendar
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {gsoc.deadlines.map((d) => (
                <div
                  key={d.id}
                  style={{
                    padding: "12px 14px",
                    borderRadius: "var(--radius-md)",
                    backgroundColor: d.critical ? "rgba(244, 63, 94, 0.08)" : "rgba(255, 255, 255, 0.02)",
                    border: d.critical ? "1px solid rgba(244, 63, 94, 0.3)" : "1px solid var(--border-subtle)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: 600, color: d.critical ? "var(--rose)" : "var(--text-white)" }}>
                      {d.title}
                    </div>
                    <div className="mono" style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>
                      {d.date}
                    </div>
                  </div>
                  {d.passed ? (
                    <span className="badge badge-emerald">Passed</span>
                  ) : d.critical ? (
                    <span className="badge badge-rose">Critical Action</span>
                  ) : (
                    <span className="badge badge-cyan">Upcoming</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Learning Requirements checklist */}
          <div className="glass-panel" style={{ padding: "20px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "16px" }}>
              Technical Learning Requirements
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {gsoc.learningRequirements.map((req) => (
                <div
                  key={req.id}
                  onClick={() => toggleLearningRequirement(req.id)}
                  style={{
                    padding: "12px 14px",
                    borderRadius: "var(--radius-md)",
                    backgroundColor: "rgba(255, 255, 255, 0.02)",
                    border: "1px solid var(--border-subtle)",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    cursor: "pointer",
                  }}
                >
                  {req.done ? (
                    <CheckSquare size={18} color="var(--emerald)" />
                  ) : (
                    <Square size={18} color="var(--text-muted)" />
                  )}
                  <span
                    style={{
                      fontSize: "13px",
                      color: req.done ? "var(--text-muted)" : "var(--text-white)",
                      textDecoration: req.done ? "line-through" : "none",
                    }}
                  >
                    {req.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
