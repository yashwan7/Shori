import React, { useState } from "react";
import { useApp } from "../context/AppContext";
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
} from "lucide-react";

export function SettingsPage() {
  const { state, updateProfile, resetToSampleData, importData, showToast } = useApp();
  const { profile } = state;

  const [name, setName] = useState(profile.name || "");
  const [title, setTitle] = useState(profile.title || "");
  const [target, setTarget] = useState(profile.target || "");
  const [weeklyGoalHours, setWeeklyGoalHours] = useState(profile.weeklyGoalHours || 35);

  // AI settings
  const [apiKey, setApiKey] = useState(
    () => localStorage.getItem("shori_ai_api_key") || ""
  );
  const [selectedModel, setSelectedModel] = useState(
    () => localStorage.getItem("shori_ai_model") || "gemini-1.5-flash"
  );
  const [showApiKey, setShowApiKey] = useState(false);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateProfile({
      name,
      title,
      target,
      weeklyGoalHours: parseFloat(weeklyGoalHours) || 30,
    });
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

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", maxWidth: "900px" }}>
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
            <h1 style={{ fontSize: "22px", fontWeight: 700 }}>System Settings & AI Engine</h1>
            <span className="badge badge-cyan">Configuration</span>
          </div>
          <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
            Configure your technical persona, custom Google Gemini AI keys, and local backup telemetry.
          </p>
        </div>
      </div>

      {/* 2. AI Model & API Key Configuration */}
      <div className="glass-panel" style={{ padding: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
          <Sparkles size={18} color="var(--violet)" />
          <h2 style={{ fontSize: "16px", fontWeight: 700 }}>AI Personal Planner Configuration</h2>
        </div>

        <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "16px", lineHeight: 1.5 }}>
          Shori includes an intelligent built-in reasoning engine that works offline. For advanced real-time generation powered by Google Gemini, enter your API key below or set it in <code style={{ color: "var(--cyan)" }}>.env</code> as <code style={{ color: "var(--cyan)" }}>VITE_AI_API_KEY</code>.
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
            <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px" }}>
              Stored securely in browser localStorage only. Never sent to any external tracking service.
            </div>
          </div>

          <div>
            <label style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "6px", display: "block" }}>
              Active Gemini Model
            </label>
            <select value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)}>
              <option value="gemini-1.5-flash">Gemini 1.5 Flash (Ultra-fast & Recommended)</option>
              <option value="gemini-2.0-flash">Gemini 2.0 Flash (Next-Gen High Speed)</option>
              <option value="gemini-1.5-pro">Gemini 1.5 Pro (Deep Complex Reasoning)</option>
            </select>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button type="submit" className="btn btn-ai">
              <span>Save AI Settings</span>
            </button>
          </div>
        </form>
      </div>

      {/* 3. User Profile & Target Settings */}
      <div className="glass-panel" style={{ padding: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
          <User size={18} color="var(--cyan)" />
          <h2 style={{ fontSize: "16px", fontWeight: 700 }}>Profile & Career Target</h2>
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

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button type="submit" className="btn btn-primary">
              <span>Save Profile</span>
            </button>
          </div>
        </form>
      </div>

      {/* 4. Data Persistence & Backup / Reset */}
      <div className="glass-panel" style={{ padding: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
          <Database size={18} color="var(--emerald)" />
          <h2 style={{ fontSize: "16px", fontWeight: 700 }}>Telemetry Data Management</h2>
        </div>

        <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "16px" }}>
          All your tasks, solved algorithms, GSoC milestones, and daily check-ins are saved locally. You can export a JSON backup or restore data on any machine.
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
