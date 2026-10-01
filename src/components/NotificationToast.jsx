import React from "react";
import { useApp } from "../context/AppContext";
import { CheckCircle2, AlertCircle, X } from "lucide-react";

export function NotificationToast() {
  const { notification } = useApp();

  if (!notification) return null;

  const isError = notification.type === "error";

  return (
    <div
      style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        zIndex: 2000,
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "12px 18px",
        borderRadius: "var(--radius-md)",
        backgroundColor: isError ? "#1e1014" : "#0d1b1e",
        border: `1px solid ${isError ? "rgba(244, 63, 94, 0.4)" : "rgba(16, 185, 129, 0.4)"}`,
        boxShadow: isError ? "var(--rose-glow)" : "var(--emerald-glow)",
        color: "#ffffff",
        animation: "scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards",
      }}
    >
      {isError ? (
        <AlertCircle size={18} color="var(--rose)" />
      ) : (
        <CheckCircle2 size={18} color="var(--emerald)" />
      )}
      <span style={{ fontSize: "13px", fontWeight: 500 }}>
        {notification.message}
      </span>
    </div>
  );
}
