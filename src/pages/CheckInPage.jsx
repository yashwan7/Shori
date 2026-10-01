import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { generateDailyReview } from "../services/aiService";
import {
  CalendarCheck,
  Send,
  Sparkles,
  Flame,
  Clock,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Loader2,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

export function CheckInPage() {
  const { state, submitCheckIn, showToast } = useApp();
  const { checkIns, profile } = state;

  const [accomplished, setAccomplished] = useState("");
  const [selectedCategories, setSelectedCategories] = useState(["DSA", "GSoC"]);
  const [hours, setHours] = useState("4.5");
  const [pending, setPending] = useState("");
  const [tomorrowPriority, setTomorrowPriority] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeReview, setActiveReview] = useState(null);

  const availableCategories = ["DSA", "GSoC", "AI/ML", "Project", "College", "Other"];

  const toggleCategory = (cat) => {
    if (selectedCategories.includes(cat)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== cat));
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  const handleSubmit = async (e) => {
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
      const review = await generateDailyReview(state, checkInData);
      setActiveReview(review);
      submitCheckIn(checkInData, review);
      setAccomplished("");
      setPending("");
      setTomorrowPriority("");
    } catch (err) {
      console.error(err);
      showToast("Check-in failed", "error");
    } finally {
      setIsSubmitting(false);
    }
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
                background: "rgba(16, 185, 129, 0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--emerald)",
              }}
            >
              <CalendarCheck size={20} />
            </div>
            <h1 style={{ fontSize: "22px", fontWeight: 700 }}>Daily Check-In & AI Review</h1>
            <span className="badge badge-emerald">Daily Ritual</span>
          </div>
          <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
            Log your daily output, keep your streak alive, and receive instantaneous tactical critique from Shori AI.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 16px",
            borderRadius: "var(--radius-md)",
            background: "rgba(245, 158, 11, 0.12)",
            border: "1px solid rgba(245, 158, 11, 0.25)",
            color: "var(--amber)",
          }}
        >
          <Flame size={20} />
          <div>
            <div style={{ fontSize: "14px", fontWeight: 800 }}>{profile.streak} Days</div>
            <div style={{ fontSize: "10px" }}>Current Active Streak</div>
          </div>
        </div>
      </div>

      {/* 2. Check-In Form & Realtime AI Review Container */}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "20px" }} className="checkin-split-grid">
        {/* Form Container */}
        <div className="glass-panel" style={{ padding: "24px" }}>
          <h2 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "18px" }}>
            Today's Telemetry Entry
          </h2>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* Question 1: What did you accomplish today? */}
            <div>
              <label style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-white)", marginBottom: "6px", display: "block" }}>
                1. What did you accomplish today? *
              </label>
              <textarea
                rows={3}
                required
                placeholder="e.g. Solved 2 graph questions, refactored Arrow memory alignment bug, finalized proposal section 4..."
                value={accomplished}
                onChange={(e) => setAccomplished(e.target.value)}
              />
            </div>

            {/* Question 2: What did you work on? */}
            <div>
              <label style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-white)", marginBottom: "6px", display: "block" }}>
                2. What categories did you work on?
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
                      }}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Question 3: How much time did you spend? */}
            <div>
              <label style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-white)", marginBottom: "6px", display: "block" }}>
                3. How much deep-work time did you spend? (Hours)
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
                  Deep concentration hours
                </span>
              </div>
            </div>

            {/* Question 4: What is still pending? */}
            <div>
              <label style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-white)", marginBottom: "6px", display: "block" }}>
                4. What is still pending or needs unblocking?
              </label>
              <input
                type="text"
                placeholder="e.g. Clang-tidy compilation warning on ARM64, Trapping Rain Water DP edge case..."
                value={pending}
                onChange={(e) => setPending(e.target.value)}
              />
            </div>

            {/* Question 5: What should be tomorrow's priority? */}
            <div>
              <label style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-white)", marginBottom: "6px", display: "block" }}>
                5. What should be tomorrow's priority?
              </label>
              <input
                type="text"
                placeholder="e.g. Merge Arrow SIMD PR and write 2 pages of proposal..."
                value={tomorrowPriority}
                onChange={(e) => setTomorrowPriority(e.target.value)}
              />
            </div>

            <div style={{ marginTop: "10px" }}>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-ai"
                style={{ width: "100%", padding: "12px" }}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="spin" />
                    <span>Analyzing check-in with AI...</span>
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    <span>Submit Check-In & Generate AI Review</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Live / Most Recent AI Daily Review */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div
            className="glass-panel"
            style={{
              padding: "20px",
              background: "linear-gradient(135deg, rgba(168, 85, 247, 0.12), rgba(16, 23, 38, 0.8))",
              border: "1px solid rgba(168, 85, 247, 0.3)",
              boxShadow: "var(--shadow-glow-violet)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
              <Sparkles size={18} color="var(--violet)" />
              <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-white)" }}>
                AI Tactical Review
              </h3>
            </div>

            {activeReview || checkIns[0]?.aiReview ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "13px" }}>
                <div style={{ padding: "10px", borderRadius: "var(--radius-sm)", backgroundColor: "rgba(16, 185, 129, 0.08)", border: "1px solid rgba(16, 185, 129, 0.2)" }}>
                  <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--emerald)", textTransform: "uppercase" }}>
                    What Went Well
                  </div>
                  <div style={{ color: "var(--text-white)", marginTop: "3px" }}>
                    {(activeReview || checkIns[0].aiReview).wentWell}
                  </div>
                </div>

                <div style={{ padding: "10px", borderRadius: "var(--radius-sm)", backgroundColor: "rgba(245, 158, 11, 0.08)", border: "1px solid rgba(245, 158, 11, 0.2)" }}>
                  <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--amber)", textTransform: "uppercase" }}>
                    What Remains / Friction Points
                  </div>
                  <div style={{ color: "var(--text-white)", marginTop: "3px" }}>
                    {(activeReview || checkIns[0].aiReview).remains}
                  </div>
                </div>

                <div style={{ padding: "10px", borderRadius: "var(--radius-sm)", backgroundColor: "rgba(56, 189, 248, 0.08)", border: "1px solid rgba(56, 189, 248, 0.2)" }}>
                  <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--cyan)", textTransform: "uppercase" }}>
                    Suggested Next Action
                  </div>
                  <div style={{ color: "var(--text-white)", marginTop: "3px" }}>
                    {(activeReview || checkIns[0].aiReview).nextAction}
                  </div>
                </div>

                <div style={{ padding: "10px", borderRadius: "var(--radius-sm)", backgroundColor: "rgba(168, 85, 247, 0.08)", border: "1px solid rgba(168, 85, 247, 0.2)" }}>
                  <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--violet)", textTransform: "uppercase" }}>
                    Tomorrow's Priority
                  </div>
                  <div style={{ color: "var(--text-white)", marginTop: "3px" }}>
                    {(activeReview || checkIns[0].aiReview).tomorrowPriority}
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ color: "var(--text-muted)", fontSize: "13px" }}>
                Submit today's check-in to get an actionable AI review of what went well, what remains, and your exact next priority.
              </div>
            )}
          </div>

          {/* Quick Streak info card */}
          <div className="glass-panel" style={{ padding: "18px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
              <Flame size={16} color="var(--amber)" />
              <h4 style={{ fontSize: "14px", fontWeight: 600 }}>Streak Consistency</h4>
            </div>
            <p style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
              Check-ins feed directly into the AI Planner. The AI remembers what you were blocked on yesterday to keep tomorrow's plan sharp and realistic.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Check-In History Log */}
      <div className="glass-panel" style={{ padding: "20px" }}>
        <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "16px" }}>
          Past Check-In Telemetry ({checkIns.length})
        </h3>

        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {checkIns.map((item) => (
            <div
              key={item.id}
              style={{
                padding: "16px",
                borderRadius: "var(--radius-md)",
                backgroundColor: "rgba(255, 255, 255, 0.02)",
                border: "1px solid var(--border-subtle)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span className="mono" style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-white)" }}>
                    {item.date}
                  </span>
                  <span className="badge badge-cyan">{item.hoursSpent} Hours</span>
                </div>

                <div style={{ display: "flex", gap: "6px" }}>
                  {(item.categories || []).map((cat) => (
                    <span key={cat} className="badge badge-neutral" style={{ fontSize: "10px" }}>
                      {cat}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ fontSize: "13px", color: "var(--text-primary)", marginBottom: "8px" }}>
                <strong>Accomplished: </strong> {item.accomplished}
              </div>

              {item.aiReview && (
                <div
                  style={{
                    backgroundColor: "rgba(168, 85, 247, 0.06)",
                    border: "1px solid rgba(168, 85, 247, 0.2)",
                    borderRadius: "var(--radius-sm)",
                    padding: "10px 12px",
                    fontSize: "12px",
                    color: "var(--text-secondary)",
                  }}
                >
                  <strong style={{ color: "var(--violet)" }}>AI Critique: </strong>
                  {item.aiReview.wentWell} • <span style={{ color: "var(--amber)" }}>{item.aiReview.nextAction}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
