import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  X,
  Lock,
  Mail,
  User,
  Target,
  Sparkles,
  ArrowRight,
  Globe,
  Loader2,
  Database,
  CheckCircle2,
  ShieldAlert,
  AlertTriangle,
  Eye,
  EyeOff,
} from "lucide-react";
import { GithubIcon } from "./GithubIcon";

export function AuthModal() {
  const { login, signup, loginWithOAuth, setActiveModal, isSupabaseConfigured, showToast } = useApp();

  const [mode, setMode] = useState("signin"); // "signin" | "signup"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [title, setTitle] = useState("Software Engineer & Open Source Contributor");
  const [targetRole, setTargetRole] = useState("Tier-1 Tech / GSoC 2025");
  const [leetcodeUsername, setLeetcodeUsername] = useState("");
  const [githubUsername, setGithubUsername] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!isSupabaseConfigured) {
      setErrorMsg("Supabase is not configured yet. Click 'Configure Database' below or use Demo Mode.");
      return;
    }

    if (!email || !password) {
      setErrorMsg("Please enter both email and password.");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    try {
      if (mode === "signin") {
        const res = await login(email, password);
        if (res.success) {
          setActiveModal(null);
        } else {
          setErrorMsg(res.error || "Invalid credentials.");
        }
      } else {
        const res = await signup({
          email,
          password,
          name: name || email.split("@")[0],
          title,
          target: targetRole,
          leetcodeUsername: leetcodeUsername || "yashwanth",
          githubUsername: githubUsername || "yashwan7",
        });
        if (res.success) {
          setActiveModal(null);
        } else {
          setErrorMsg(res.error || "Sign up failed.");
        }
      }
    } catch (err) {
      setErrorMsg(err.message || "An unexpected authentication error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-content" style={{ maxWidth: "480px" }}>
      {/* Header */}
      <div
        style={{
          padding: "20px 24px",
          borderBottom: "1px solid var(--border-subtle)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "linear-gradient(90deg, rgba(56, 189, 248, 0.1), transparent)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "var(--radius-sm)",
              background: "linear-gradient(135deg, #0284c7 0%, #7c3aed 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
            }}
          >
            <Lock size={16} />
          </div>
          <div>
            <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-white)" }}>
              {mode === "signin" ? "Sign In to Shori Command" : "Create Shori Account"}
            </h3>
            <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
              Persistent PostgreSQL cloud sync with zero refresh loss
            </div>
          </div>
        </div>

        <button
          onClick={() => setActiveModal(null)}
          className="btn btn-ghost btn-icon"
          aria-label="Close modal"
        >
          <X size={18} />
        </button>
      </div>

      {/* Supabase Status Banner */}
      {!isSupabaseConfigured && (
        <div
          style={{
            margin: "16px 24px 0 24px",
            padding: "12px 14px",
            borderRadius: "var(--radius-md)",
            background: "rgba(245, 158, 11, 0.12)",
            border: "1px solid rgba(245, 158, 11, 0.3)",
            display: "flex",
            alignItems: "flex-start",
            gap: "10px",
          }}
        >
          <ShieldAlert size={18} color="var(--amber)" style={{ flexShrink: 0, marginTop: "2px" }} />
          <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
            <strong style={{ color: "var(--amber)" }}>Supabase Not Connected:</strong> You are currently in offline guest mode.
            <button
              onClick={() => setActiveModal({ type: "databaseConfig" })}
              style={{
                display: "inline-block",
                marginLeft: "6px",
                color: "var(--cyan)",
                background: "none",
                border: "none",
                padding: 0,
                textDecoration: "underline",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Connect Cloud Database
            </button>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ padding: "24px" }}>
        {errorMsg && (
          <div
            style={{
              padding: "12px 14px",
              borderRadius: "var(--radius-sm)",
              backgroundColor: "rgba(244, 63, 94, 0.15)",
              border: "1px solid rgba(244, 63, 94, 0.3)",
              color: "var(--rose)",
              fontSize: "12px",
              marginBottom: "16px",
              display: "flex",
              flexDirection: "column",
              gap: "6px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 600 }}>
              <AlertTriangle size={15} style={{ flexShrink: 0 }} />
              <span>{errorMsg}</span>
            </div>
            {errorMsg.toLowerCase().includes("invalid path") && (
              <div style={{ fontSize: "11px", color: "var(--text-secondary)", lineHeight: 1.5, marginTop: "2px" }}>
                💡 <strong>How to fix:</strong> Your Supabase Project URL is misconfigured. It must be in the format:{" "}
                <code style={{ color: "var(--cyan)", background: "rgba(0,0,0,0.3)", padding: "1px 5px", borderRadius: "3px" }}>
                  https://[your-project-ref].supabase.co
                </code>
                {" "}(copied from Supabase <strong>Project Settings &rarr; API &rarr; Project URL</strong>, NOT your browser dashboard URL).
                <button
                  type="button"
                  onClick={() => setActiveModal({ type: "databaseConfig" })}
                  style={{
                    display: "block",
                    marginTop: "6px",
                    color: "var(--cyan)",
                    background: "none",
                    border: "none",
                    padding: 0,
                    textDecoration: "underline",
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  &rarr; Click here to open Database Settings and paste correct URL
                </button>
              </div>
            )}
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {/* Sign Up Fields */}
          {mode === "signup" && (
            <>
              <div>
                <label style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "4px", display: "block" }}>
                  Your Full Name
                </label>
                <div style={{ position: "relative" }}>
                  <User size={15} color="var(--text-muted)" style={{ position: "absolute", left: "10px", top: "12px" }} />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Yashwanth"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{ paddingLeft: "34px" }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "4px", display: "block" }}>
                    LeetCode Handle
                  </label>
                  <input
                    type="text"
                    placeholder="yashwanth"
                    value={leetcodeUsername}
                    onChange={(e) => setLeetcodeUsername(e.target.value)}
                  />
                </div>

                <div>
                  <label style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "4px", display: "block" }}>
                    GitHub Username
                  </label>
                  <input
                    type="text"
                    placeholder="yashwan7"
                    value={githubUsername}
                    onChange={(e) => setGithubUsername(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "4px", display: "block" }}>
                  Target Goal
                </label>
                <input
                  type="text"
                  placeholder="GSoC 2025 / Tier-1 Tech"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                />
              </div>
            </>
          )}

          {/* Email */}
          <div>
            <label style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "4px", display: "block" }}>
              Email Address
            </label>
            <div style={{ position: "relative" }}>
              <Mail size={15} color="var(--text-muted)" style={{ position: "absolute", left: "10px", top: "12px" }} />
              <input
                type="email"
                required
                placeholder="engineer@command.io"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ paddingLeft: "34px" }}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "4px", display: "block" }}>
              Password
            </label>
            <div style={{ position: "relative" }}>
              <Lock size={15} color="var(--text-muted)" style={{ position: "absolute", left: "10px", top: "12px" }} />
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: "34px", paddingRight: "36px" }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
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
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary"
          style={{ width: "100%", marginTop: "20px", padding: "12px" }}
        >
          {loading ? (
            <>
              <Loader2 size={16} className="spin" />
              <span>Authenticating...</span>
            </>
          ) : (
            <>
              <span>{mode === "signin" ? "Sign In" : "Create Account"}</span>
              <ArrowRight size={15} />
            </>
          )}
        </button>

        {/* OAuth Buttons */}
        {isSupabaseConfigured && (
          <div style={{ marginTop: "16px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                margin: "14px 0",
              }}
            >
              <div style={{ flex: 1, height: "1px", backgroundColor: "var(--border-subtle)" }} />
              <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>OR</span>
              <div style={{ flex: 1, height: "1px", backgroundColor: "var(--border-subtle)" }} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <button
                type="button"
                onClick={() => loginWithOAuth("github")}
                className="btn btn-secondary btn-sm"
                style={{ justifyContent: "center" }}
              >
                <GithubIcon size={15} />
                <span>GitHub</span>
              </button>
              <button
                type="button"
                onClick={() => loginWithOAuth("google")}
                className="btn btn-secondary btn-sm"
                style={{ justifyContent: "center" }}
              >
                <Globe size={15} />
                <span>Google</span>
              </button>
            </div>
          </div>
        )}

        {/* Mode Switcher */}
        <div style={{ marginTop: "20px", textAlign: "center", fontSize: "12px", color: "var(--text-secondary)" }}>
          {mode === "signin" ? (
            <>
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("signup");
                  setErrorMsg("");
                }}
                style={{
                  color: "var(--cyan)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: 600,
                  padding: 0,
                }}
              >
                Register here
              </button>
            </>
          ) : (
            <>
              Already registered?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("signin");
                  setErrorMsg("");
                }}
                style={{
                  color: "var(--cyan)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: 600,
                  padding: 0,
                }}
              >
                Sign In
              </button>
            </>
          )}
        </div>

        {/* Quick Demo Mode button */}
        <div style={{ marginTop: "14px", textAlign: "center" }}>
          <button
            type="button"
            onClick={() => {
              showToast("Switched to offline Demo Mode.");
              setActiveModal(null);
            }}
            style={{
              fontSize: "11px",
              color: "var(--text-muted)",
              background: "none",
              border: "none",
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            Explore in Guest / Demo Mode
          </button>
        </div>
      </form>
    </div>
  );
}
