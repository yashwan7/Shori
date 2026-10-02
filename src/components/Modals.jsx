import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { generateDailyReview } from "../services/aiService";
import {
  X,
  CheckCircle2,
  CalendarCheck,
  Code2,
  GitBranch,
  Target,
  Sparkles,
  Flame,
  Clock,
  Send,
  Loader2,
} from "lucide-react";

import { AuthModal } from "./AuthModal";
import { DatabaseConfigModal } from "./DatabaseConfigModal";

export function Modals() {
  const { activeModal, setActiveModal } = useApp();

  if (!activeModal) return null;

  return (
    <div
      className="modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) setActiveModal(null);
      }}
    >
      {activeModal.type === "auth" && <AuthModal />}
      {activeModal.type === "databaseConfig" && <DatabaseConfigModal />}
      {activeModal.type === "addTask" && <TaskModal data={activeModal.data} />}
      {activeModal.type === "addProblem" && <DsaModal data={activeModal.data} />}
      {activeModal.type === "addGoal" && <GoalModal data={activeModal.data} />}
      {activeModal.type === "addOrg" && <OrgModal data={activeModal.data} />}
      {activeModal.type === "addContribution" && <ContributionModal data={activeModal.data} />}
      {activeModal.type === "dailyCheckIn" && <DailyCheckInModal />}
    </div>
  );
}

// 1. Task Modal (Add/Edit)
function TaskModal({ data }) {
  const { addTask, updateTask, setActiveModal, state } = useApp();
  const isEditing = Boolean(data?.id);

  const [title, setTitle] = useState(data?.title || "");
  const [description, setDescription] = useState(data?.description || "");
  const [category, setCategory] = useState(data?.category || "DSA");
  const [priority, setPriority] = useState(data?.priority || "High");
  const [dueDate, setDueDate] = useState(
    data?.dueDate || new Date().toISOString().split("T")[0]
  );
  const [estimatedMins, setEstimatedMins] = useState(data?.estimatedMins || 45);
  const [status, setStatus] = useState(data?.status || "Todo");
  const [notes, setNotes] = useState(data?.notes || "");
  const [goalId, setGoalId] = useState(data?.goalId || "dsa");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const payload = {
      title,
      description,
      category,
      priority,
      dueDate,
      estimatedMins: parseInt(estimatedMins, 10) || 30,
      status,
      notes,
      goalId,
    };

    if (isEditing) {
      updateTask(data.id, payload);
    } else {
      addTask(payload);
    }
    setActiveModal(null);
  };

  return (
    <div className="modal-content">
      <div
        style={{
          padding: "16px 20px",
          borderBottom: "1px solid var(--border-subtle)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h3 style={{ fontSize: "16px", fontWeight: 600 }}>
          {isEditing ? "Edit Task" : "Create New Priority Task"}
        </h3>
        <button
          onClick={() => setActiveModal(null)}
          className="btn btn-ghost btn-icon"
        >
          <X size={18} />
        </button>
      </div>

      <form onSubmit={handleSubmit} style={{ padding: "20px", overflowY: "auto" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div>
            <label style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "4px", display: "block" }}>
              Task Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Implement reciprocal rank fusion in RAG"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "4px", display: "block" }}>
              Description & Context
            </label>
            <textarea
              rows={2}
              placeholder="Actionable steps, test criteria, or specific requirements..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "4px", display: "block" }}>
                Category
              </label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="DSA">DSA</option>
                <option value="GSoC">GSoC</option>
                <option value="AI/ML">AI/ML</option>
                <option value="Project">Project</option>
                <option value="College">College</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "4px", display: "block" }}>
                Priority
              </label>
              <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                <option value="High">High Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="Low">Low Priority</option>
              </select>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "4px", display: "block" }}>
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>

            <div>
              <label style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "4px", display: "block" }}>
                Estimated Time (minutes)
              </label>
              <input
                type="number"
                min="5"
                step="5"
                value={estimatedMins}
                onChange={(e) => setEstimatedMins(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "4px", display: "block" }}>
                Status
              </label>
              <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="Todo">Todo</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "4px", display: "block" }}>
                Linked Goal
              </label>
              <select value={goalId} onChange={(e) => setGoalId(e.target.value)}>
                <option value="dsa">DSA Practice</option>
                <option value="gsoc">GSoC 2025</option>
                {state.goals.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "4px", display: "block" }}>
              Technical Notes / Command Reference
            </label>
            <input
              type="text"
              placeholder="e.g. Run ctest -R simd-test"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>

        <div
          style={{
            marginTop: "20px",
            display: "flex",
            justifyContent: "flex-end",
            gap: "10px",
          }}
        >
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setActiveModal(null)}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            {isEditing ? "Save Changes" : "Create Task"}
          </button>
        </div>
      </form>
    </div>
  );
}

// 2. DSA Problem Modal
function DsaModal({ data }) {
  const { addDsaProblem, updateDsaProblem, setActiveModal, state } = useApp();
  const isEditing = Boolean(data?.id);

  const [title, setTitle] = useState(data?.title || "");
  const [topic, setTopic] = useState(data?.topic || state.dsa.currentTopic || "Arrays");
  const [difficulty, setDifficulty] = useState(data?.difficulty || "Medium");
  const [status, setStatus] = useState(data?.status || "Solved");
  const [revisionStatus, setRevisionStatus] = useState(data?.revisionStatus || "Needs Revision");
  const [link, setLink] = useState(data?.link || "");
  const [timeSpentMins, setTimeSpentMins] = useState(data?.timeSpentMins || 30);
  const [notes, setNotes] = useState(data?.notes || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const payload = {
      title,
      topic,
      difficulty,
      status,
      revisionStatus,
      link,
      timeSpentMins: parseInt(timeSpentMins, 10) || 20,
      notes,
      lastPracticed: new Date().toISOString().split("T")[0],
    };

    if (isEditing) {
      updateDsaProblem(data.id, payload);
    } else {
      addDsaProblem(payload);
    }
    setActiveModal(null);
  };

  return (
    <div className="modal-content">
      <div
        style={{
          padding: "16px 20px",
          borderBottom: "1px solid var(--border-subtle)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h3 style={{ fontSize: "16px", fontWeight: 600 }}>
          {isEditing ? "Edit DSA Problem" : "Record DSA Problem"}
        </h3>
        <button
          onClick={() => setActiveModal(null)}
          className="btn btn-ghost btn-icon"
        >
          <X size={18} />
        </button>
      </div>

      <form onSubmit={handleSubmit} style={{ padding: "20px", overflowY: "auto" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div>
            <label style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "4px", display: "block" }}>
              Problem Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Rotting Oranges (BFS Multi-source)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "4px", display: "block" }}>
                Topic / Category
              </label>
              <select value={topic} onChange={(e) => setTopic(e.target.value)}>
                {state.dsa.topics.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "4px", display: "block" }}>
                Difficulty
              </label>
              <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "4px", display: "block" }}>
                Solve Status
              </label>
              <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="Solved">Solved</option>
                <option value="Attempted">Attempted</option>
                <option value="Pending">Pending</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "4px", display: "block" }}>
                Revision Status
              </label>
              <select
                value={revisionStatus}
                onChange={(e) => setRevisionStatus(e.target.value)}
              >
                <option value="Needs Revision">Needs Revision</option>
                <option value="Revised">Revised</option>
                <option value="Solid">Solid</option>
              </select>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "12px" }}>
            <div>
              <label style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "4px", display: "block" }}>
                LeetCode / Platform URL
              </label>
              <input
                type="url"
                placeholder="https://leetcode.com/problems/..."
                value={link}
                onChange={(e) => setLink(e.target.value)}
              />
            </div>

            <div>
              <label style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "4px", display: "block" }}>
                Time (Mins)
              </label>
              <input
                type="number"
                min="0"
                value={timeSpentMins}
                onChange={(e) => setTimeSpentMins(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "4px", display: "block" }}>
              Key Takeaway, Approach & Edge Cases
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Time complexity O(V+E), space O(V). Edge case: empty grid or isolated nodes."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>

        <div
          style={{
            marginTop: "20px",
            display: "flex",
            justifyContent: "flex-end",
            gap: "10px",
          }}
        >
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setActiveModal(null)}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            {isEditing ? "Update Problem" : "Add Problem"}
          </button>
        </div>
      </form>
    </div>
  );
}

// 3. Goal Modal
function GoalModal({ data }) {
  const { addGoal, updateGoal, setActiveModal } = useApp();
  const isEditing = Boolean(data?.id);

  const [name, setName] = useState(data?.name || "");
  const [description, setDescription] = useState(data?.description || "");
  const [category, setCategory] = useState(data?.category || "AI/ML");
  const [targetDate, setTargetDate] = useState(
    data?.targetDate || new Date().toISOString().split("T")[0]
  );
  const [progress, setProgress] = useState(data?.progress || 0);
  const [notes, setNotes] = useState(data?.notes || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const payload = {
      name,
      description,
      category,
      targetDate,
      progress: parseInt(progress, 10) || 0,
      notes,
      milestones: data?.milestones || [
        { title: "Initial research and architecture RFC", completed: true },
        { title: "Core MVP prototype implementation", completed: false },
        { title: "Benchmarking and performance profiling", completed: false },
        { title: "Final documentation and public showcase", completed: false },
      ],
    };

    if (isEditing) {
      updateGoal(data.id, payload);
    } else {
      addGoal(payload);
    }
    setActiveModal(null);
  };

  return (
    <div className="modal-content">
      <div
        style={{
          padding: "16px 20px",
          borderBottom: "1px solid var(--border-subtle)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h3 style={{ fontSize: "16px", fontWeight: 600 }}>
          {isEditing ? "Edit Goal" : "Create Technical Goal / Project"}
        </h3>
        <button
          onClick={() => setActiveModal(null)}
          className="btn btn-ghost btn-icon"
        >
          <X size={18} />
        </button>
      </div>

      <form onSubmit={handleSubmit} style={{ padding: "20px", overflowY: "auto" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div>
            <label style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "4px", display: "block" }}>
              Goal Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Master RAG, Build OrthoTwin, Finish College Project"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "4px", display: "block" }}>
              Description
            </label>
            <textarea
              rows={2}
              placeholder="What is the high-level objective and expected deliverable?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "4px", display: "block" }}>
                Category
              </label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="AI/ML">AI / ML</option>
                <option value="Projects">Projects</option>
                <option value="Skills">Skills</option>
                <option value="College">College</option>
                <option value="Certifications">Certifications</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "4px", display: "block" }}>
                Target Date
              </label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "4px", display: "block" }}>
              Current Progress ({progress}%)
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={(e) => setProgress(e.target.value)}
            />
          </div>

          <div>
            <label style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "4px", display: "block" }}>
              Notes & Technical References
            </label>
            <input
              type="text"
              placeholder="Key papers, repos, libraries to explore..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>

        <div
          style={{
            marginTop: "20px",
            display: "flex",
            justifyContent: "flex-end",
            gap: "10px",
          }}
        >
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setActiveModal(null)}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            {isEditing ? "Save Changes" : "Create Goal"}
          </button>
        </div>
      </form>
    </div>
  );
}

// 4. GSoC Org Modal
function OrgModal() {
  const { addGsocOrg, setActiveModal } = useApp();
  const [name, setName] = useState("");
  const [techStackStr, setTechStackStr] = useState("");
  const [repoUrl, setRepoUrl] = useState("");
  const [projectIdea, setProjectIdea] = useState("");
  const [matchPercentage, setMatchPercentage] = useState(85);
  const [notes, setNotes] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    addGsocOrg({
      name,
      techStack: techStackStr.split(",").map((s) => s.trim()).filter(Boolean),
      repoUrl,
      projectIdea,
      matchPercentage: parseInt(matchPercentage, 10) || 80,
      status: "Exploring",
      notes,
    });
    setActiveModal(null);
  };

  return (
    <div className="modal-content">
      <div
        style={{
          padding: "16px 20px",
          borderBottom: "1px solid var(--border-subtle)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h3 style={{ fontSize: "16px", fontWeight: 600 }}>Add GSoC Organization</h3>
        <button
          onClick={() => setActiveModal(null)}
          className="btn btn-ghost btn-icon"
        >
          <X size={18} />
        </button>
      </div>

      <form onSubmit={handleSubmit} style={{ padding: "20px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div>
            <label style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "4px", display: "block" }}>
              Organization Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Apache Arrow, pgvector, LLVM"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "4px", display: "block" }}>
              Tech Stack (comma separated)
            </label>
            <input
              type="text"
              placeholder="C++, SIMD, CMake, Python"
              value={techStackStr}
              onChange={(e) => setTechStackStr(e.target.value)}
            />
          </div>

          <div>
            <label style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "4px", display: "block" }}>
              Repository URL
            </label>
            <input
              type="url"
              placeholder="https://github.com/..."
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
            />
          </div>

          <div>
            <label style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "4px", display: "block" }}>
              Project Idea
            </label>
            <input
              type="text"
              placeholder="e.g. SIMD Acceleration for In-Memory Compute Kernels"
              value={projectIdea}
              onChange={(e) => setProjectIdea(e.target.value)}
            />
          </div>

          <div>
            <label style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "4px", display: "block" }}>
              Skills Match % ({matchPercentage}%)
            </label>
            <input
              type="range"
              min="10"
              max="100"
              value={matchPercentage}
              onChange={(e) => setMatchPercentage(e.target.value)}
            />
          </div>

          <div>
            <label style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "4px", display: "block" }}>
              Notes & Mentors
            </label>
            <input
              type="text"
              placeholder="Key maintainers, communication channels..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>

        <div
          style={{
            marginTop: "20px",
            display: "flex",
            justifyContent: "flex-end",
            gap: "10px",
          }}
        >
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setActiveModal(null)}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            Save Organization
          </button>
        </div>
      </form>
    </div>
  );
}

// 5. GSoC Contribution Modal
function ContributionModal() {
  const { addGsocContribution, setActiveModal, state } = useApp();
  const [title, setTitle] = useState("");
  const [type, setType] = useState("PR");
  const [org, setOrg] = useState(state.gsoc.organizations[0]?.name || "Apache Arrow");
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState("Under Review");
  const [notes, setNotes] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    addGsocContribution({
      title,
      type,
      org,
      url,
      status,
      notes,
    });
    setActiveModal(null);
  };

  return (
    <div className="modal-content">
      <div
        style={{
          padding: "16px 20px",
          borderBottom: "1px solid var(--border-subtle)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h3 style={{ fontSize: "16px", fontWeight: 600 }}>Log Open Source Contribution</h3>
        <button
          onClick={() => setActiveModal(null)}
          className="btn btn-ghost btn-icon"
        >
          <X size={18} />
        </button>
      </div>

      <form onSubmit={handleSubmit} style={{ padding: "20px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div>
            <label style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "4px", display: "block" }}>
              Contribution Title / Issue Summary *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. PR #41829: Vectorize ascii string lower/upper kernels"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "4px", display: "block" }}>
                Type
              </label>
              <select value={type} onChange={(e) => setType(e.target.value)}>
                <option value="PR">Pull Request (PR)</option>
                <option value="Issue">Issue / Bug Report</option>
                <option value="Discussion">Mailing List / Discussion</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "4px", display: "block" }}>
                Organization
              </label>
              <input
                type="text"
                placeholder="Apache Arrow"
                value={org}
                onChange={(e) => setOrg(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "12px" }}>
            <div>
              <label style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "4px", display: "block" }}>
                GitHub / PR URL
              </label>
              <input
                type="url"
                placeholder="https://github.com/..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>

            <div>
              <label style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "4px", display: "block" }}>
                Status
              </label>
              <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="Under Review">Under Review</option>
                <option value="Merged">Merged</option>
                <option value="Open">Open</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "4px", display: "block" }}>
              Technical Details & Benchmark Results
            </label>
            <textarea
              rows={2}
              placeholder="e.g. 3.4x speedup with AVX2. Tested across 10MB test arrays."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>

        <div
          style={{
            marginTop: "20px",
            display: "flex",
            justifyContent: "flex-end",
            gap: "10px",
          }}
        >
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setActiveModal(null)}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            Record Contribution
          </button>
        </div>
      </form>
    </div>
  );
}

// 6. Dedicated Daily Check-In Modal (All 5 questions + AI Review Synthesis)
function DailyCheckInModal() {
  const { state, submitCheckIn, setActiveModal } = useApp();

  const [accomplished, setAccomplished] = useState("");
  const [selectedCategories, setSelectedCategories] = useState(["DSA", "GSoC"]);
  const [hours, setHours] = useState("4.5");
  const [pending, setPending] = useState("");
  const [tomorrowPriority, setTomorrowPriority] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviewResult, setReviewResult] = useState(null);

  const availableCategories = ["DSA", "GSoC", "AI/ML", "Project", "College", "Other"];

  const toggleCategory = (cat) => {
    if (selectedCategories.includes(cat)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== cat));
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  const handleSaveCheckIn = async (e) => {
    e.preventDefault();
    if (!accomplished.trim()) return;

    setIsSubmitting(true);
    const checkInData = {
      accomplished,
      categories: selectedCategories,
      hoursSpent: parseFloat(hours) || 0,
      pending,
      tomorrowPriority,
    };

    try {
      const aiReview = await generateDailyReview(state, checkInData);
      setReviewResult(aiReview);
      submitCheckIn(checkInData, aiReview);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-content" style={{ maxWidth: "680px" }}>
      <div
        style={{
          padding: "16px 20px",
          borderBottom: "1px solid var(--border-subtle)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "linear-gradient(90deg, rgba(168, 85, 247, 0.1), transparent)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "var(--radius-sm)",
              background: "rgba(168, 85, 247, 0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CalendarCheck size={18} color="var(--violet)" />
          </div>
          <div>
            <h3 style={{ fontSize: "16px", fontWeight: 700 }}>Daily Command Check-In</h3>
            <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
              Streak Velocity & Telemetry Synchronization
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

      {!reviewResult ? (
        <form onSubmit={handleSaveCheckIn} style={{ padding: "20px", overflowY: "auto" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* Question 1 */}
            <div>
              <label style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-white)", marginBottom: "6px", display: "block" }}>
                1. What did you accomplish today? *
              </label>
              <textarea
                rows={2}
                required
                placeholder="e.g. Solved Course Schedule II, benchmarked Arrow AVX2 kernel, drafted 2 proposal pages..."
                value={accomplished}
                onChange={(e) => setAccomplished(e.target.value)}
              />
            </div>

            {/* Question 2 */}
            <div>
              <label style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-white)", marginBottom: "6px", display: "block" }}>
                2. What did you work on? (Select categories)
              </label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {availableCategories.map((cat) => {
                  const isSelected = selectedCategories.includes(cat);
                  return (
                    <button
                      type="button"
                      key={cat}
                      onClick={() => toggleCategory(cat)}
                      style={{
                        padding: "6px 14px",
                        borderRadius: "var(--radius-full)",
                        fontSize: "12px",
                        fontWeight: 500,
                        cursor: "pointer",
                        border: isSelected
                          ? "1px solid rgba(56, 189, 248, 0.5)"
                          : "1px solid var(--border-subtle)",
                        background: isSelected
                          ? "rgba(56, 189, 248, 0.15)"
                          : "rgba(255, 255, 255, 0.04)",
                        color: isSelected ? "var(--cyan)" : "var(--text-secondary)",
                        transition: "all var(--transition-fast)",
                      }}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Question 3 */}
            <div>
              <label style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-white)", marginBottom: "6px", display: "block" }}>
                3. How much time did you spend? (Hours)
              </label>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Clock size={16} color="var(--text-muted)" />
                <input
                  type="number"
                  step="0.5"
                  min="0.5"
                  max="24"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  style={{ maxWidth: "160px" }}
                />
                <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                  Total productive deep work
                </span>
              </div>
            </div>

            {/* Question 4 */}
            <div>
              <label style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-white)", marginBottom: "6px", display: "block" }}>
                4. What is still pending or blocked?
              </label>
              <input
                type="text"
                placeholder="e.g. Clang-tidy warning on Mac M1, Trapping Rain Water edge case..."
                value={pending}
                onChange={(e) => setPending(e.target.value)}
              />
            </div>

            {/* Question 5 */}
            <div>
              <label style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-white)", marginBottom: "6px", display: "block" }}>
                5. What should be tomorrow's priority?
              </label>
              <input
                type="text"
                placeholder="e.g. Finalize GSoC section 4 and solve 2 DP questions..."
                value={tomorrowPriority}
                onChange={(e) => setTomorrowPriority(e.target.value)}
              />
            </div>
          </div>

          <div
            style={{
              marginTop: "24px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--amber)", fontSize: "12px" }}>
              <Flame size={15} />
              <span>Submitting maintains your streak!</span>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setActiveModal(null)}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-ai"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="spin" />
                    <span>Analyzing with AI...</span>
                  </>
                ) : (
                  <>
                    <Send size={15} />
                    <span>Submit & Get AI Review</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      ) : (
        /* Section 7: AI-Based Daily Review Display */
        <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
          <div
            style={{
              background: "linear-gradient(135deg, rgba(168, 85, 247, 0.15), rgba(56, 189, 248, 0.08))",
              border: "1px solid rgba(168, 85, 247, 0.3)",
              borderRadius: "var(--radius-lg)",
              padding: "18px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
              <Sparkles size={18} color="var(--violet)" />
              <h4 style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-white)" }}>
                AI Telemetry Review
              </h4>
              <span className="badge badge-emerald" style={{ marginLeft: "auto" }}>
                Check-in Saved
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "13px" }}>
              <div>
                <strong style={{ color: "var(--emerald)" }}>What went well: </strong>
                <span style={{ color: "var(--text-primary)" }}>{reviewResult.wentWell}</span>
              </div>
              <div>
                <strong style={{ color: "var(--amber)" }}>What remains: </strong>
                <span style={{ color: "var(--text-primary)" }}>{reviewResult.remains}</span>
              </div>
              <div>
                <strong style={{ color: "var(--cyan)" }}>Suggested Next Action: </strong>
                <span style={{ color: "var(--text-primary)" }}>{reviewResult.nextAction}</span>
              </div>
              <div>
                <strong style={{ color: "var(--violet)" }}>Tomorrow's Priority: </strong>
                <span style={{ color: "var(--text-primary)" }}>{reviewResult.tomorrowPriority}</span>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              onClick={() => setActiveModal(null)}
              className="btn btn-primary"
            >
              Continue to Command Center
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
