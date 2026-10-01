import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  CheckSquare,
  Plus,
  Search,
  Filter,
  Circle,
  CheckCircle2,
  Clock,
  Calendar,
  Edit2,
  Trash2,
  AlertCircle,
  Tag,
  ArrowUpDown,
} from "lucide-react";

export function TasksPage() {
  const { state, toggleTaskStatus, deleteTask, setActiveModal } = useApp();
  const { tasks, goals } = state;

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPriority, setSelectedPriority] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [sortBy, setSortBy] = useState("priority"); // 'priority' | 'dueDate' | 'title'

  const categories = ["All", "DSA", "GSoC", "AI/ML", "Project", "College", "Other"];

  // Filtering
  const filteredTasks = tasks.filter((t) => {
    if (selectedCategory !== "All" && t.category !== selectedCategory) return false;
    if (selectedPriority !== "All" && t.priority !== selectedPriority) return false;
    if (selectedStatus !== "All" && t.status !== selectedStatus) return false;
    if (
      searchQuery.trim() &&
      !t.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !(t.description || "").toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  // Sorting
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === "priority") {
      const pMap = { High: 3, Medium: 2, Low: 1 };
      return (pMap[b.priority] || 0) - (pMap[a.priority] || 0);
    }
    if (sortBy === "dueDate") {
      return new Date(a.dueDate || "2099-01-01") - new Date(b.dueDate || "2099-01-01");
    }
    return a.title.localeCompare(b.title);
  });

  const pendingCount = tasks.filter((t) => t.status !== "Completed").length;
  const completedCount = tasks.filter((t) => t.status === "Completed").length;

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
              <CheckSquare size={20} />
            </div>
            <h1 style={{ fontSize: "22px", fontWeight: 700 }}>Task Execution Engine</h1>
            <span className="badge badge-cyan">{pendingCount} Active Operations</span>
          </div>
          <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
            High-leverage engineering tasks synced with your DSA topics, GSoC PRs, and custom goals.
          </p>
        </div>

        <button
          onClick={() => setActiveModal({ type: "addTask" })}
          className="btn btn-primary"
        >
          <Plus size={16} />
          <span>Create Task</span>
        </button>
      </div>

      {/* 2. Controls & Filters */}
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
            placeholder="Search tasks, descriptions, notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: "100%", maxWidth: "340px" }}
          />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{ width: "auto" }}
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                Category: {c}
              </option>
            ))}
          </select>

          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            style={{ width: "auto" }}
          >
            <option value="All">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            style={{ width: "auto" }}
          >
            <option value="All">All Statuses</option>
            <option value="Todo">Todo</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{ width: "auto" }}
          >
            <option value="priority">Sort: Priority</option>
            <option value="dueDate">Sort: Due Date</option>
            <option value="title">Sort: Title</option>
          </select>
        </div>
      </div>

      {/* 3. Task List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {sortedTasks.map((task) => {
          const isCompleted = task.status === "Completed";
          const isHigh = task.priority === "High";

          const categoryBadge =
            task.category === "DSA"
              ? "badge-cyan"
              : task.category === "GSoC"
              ? "badge-amber"
              : "badge-violet";

          return (
            <div
              key={task.id}
              className="glass-panel"
              style={{
                padding: "16px 20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "16px",
                borderLeft: isHigh
                  ? "3px solid var(--rose)"
                  : task.priority === "Medium"
                  ? "3px solid var(--amber)"
                  : "3px solid var(--cyan)",
                opacity: isCompleted ? 0.65 : 1,
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", gap: "14px", flex: 1 }}>
                <button
                  onClick={() => toggleTaskStatus(task.id)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    marginTop: "3px",
                    color: isCompleted ? "var(--emerald)" : "var(--text-muted)",
                  }}
                  title={isCompleted ? "Mark as Todo" : "Mark as Completed"}
                >
                  {isCompleted ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                </button>

                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: 600,
                      color: isCompleted ? "var(--text-muted)" : "var(--text-white)",
                      textDecoration: isCompleted ? "line-through" : "none",
                      marginBottom: "4px",
                    }}
                  >
                    {task.title}
                  </div>

                  {task.description && (
                    <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "8px", lineHeight: 1.4 }}>
                      {task.description}
                    </div>
                  )}

                  <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", fontSize: "11px", color: "var(--text-muted)" }}>
                    <span className={`badge ${categoryBadge}`}>{task.category}</span>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                      <Calendar size={12} />
                      Due {task.dueDate}
                    </span>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                      <Clock size={12} />
                      {task.estimatedMins} mins
                    </span>
                    {task.notes && (
                      <span style={{ color: "var(--cyan)", fontStyle: "italic" }}>
                        Note: {task.notes}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span
                  className={`badge ${task.priority === "High" ? "badge-rose" : task.priority === "Medium" ? "badge-amber" : "badge-neutral"}`}
                >
                  {task.priority}
                </span>

                <span
                  className={`badge ${task.status === "Completed" ? "badge-emerald" : task.status === "In Progress" ? "badge-amber" : "badge-neutral"}`}
                >
                  {task.status}
                </span>

                <div style={{ display: "inline-flex", gap: "4px" }}>
                  <button
                    onClick={() => setActiveModal({ type: "addTask", data: task })}
                    className="btn btn-ghost btn-icon"
                    title="Edit Task"
                  >
                    <Edit2 size={15} />
                  </button>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="btn btn-ghost btn-icon"
                    style={{ color: "var(--rose)" }}
                    title="Delete Task"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {sortedTasks.length === 0 && (
          <div className="glass-panel" style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>
            No tasks found matching filter criteria. Click "Create Task" to add directives.
          </div>
        )}
      </div>
    </div>
  );
}
