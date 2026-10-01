import React, { useState } from "react";
import { AppProvider, useApp } from "./context/AppContext";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { NotificationToast } from "./components/NotificationToast";
import { Modals } from "./components/Modals";

import { DashboardPage } from "./pages/DashboardPage";
import { DsaTrackerPage } from "./pages/DsaTrackerPage";
import { GsocPage } from "./pages/GsocPage";
import { GoalsPage } from "./pages/GoalsPage";
import { TasksPage } from "./pages/TasksPage";
import { AnalyticsPage } from "./pages/AnalyticsPage";
import { CheckInPage } from "./pages/CheckInPage";
import { AiPlannerPage } from "./pages/AiPlannerPage";
import { SettingsPage } from "./pages/SettingsPage";

function MainContent() {
  const { activeTab } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const renderActivePage = () => {
    switch (activeTab) {
      case "Dashboard":
        return <DashboardPage />;
      case "DSA":
        return <DsaTrackerPage />;
      case "GSoC":
        return <GsocPage />;
      case "Goals":
        return <GoalsPage />;
      case "Tasks":
        return <TasksPage />;
      case "Analytics":
        return <AnalyticsPage />;
      case "Daily Check-in":
        return <CheckInPage />;
      case "AI Planner":
        return <AiPlannerPage />;
      case "Settings":
        return <SettingsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div style={{ display: "flex", width: "100%", minHeight: "100vh", position: "relative" }}>
      {/* Desktop & Mobile Sidebar */}
      <div
        className={`sidebar-wrapper ${isMobileMenuOpen ? "mobile-open" : ""}`}
        onClick={(e) => {
          if (e.target === e.currentTarget && isMobileMenuOpen) {
            setIsMobileMenuOpen(false);
          }
        }}
      >
        <Sidebar />
      </div>

      {/* Main Workspace Area */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          backgroundColor: "var(--bg-app)",
        }}
      >
        <Header
          onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          isMobileMenuOpen={isMobileMenuOpen}
        />

        <main
          style={{
            flex: 1,
            padding: "28px 32px",
            maxWidth: "1440px",
            width: "100%",
            margin: "0 auto",
          }}
          className="main-container"
        >
          {renderActivePage()}
        </main>
      </div>

      {/* Global Modals & Notifications */}
      <Modals />
      <NotificationToast />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
