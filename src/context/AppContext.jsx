import React, { createContext, useContext, useState, useEffect } from "react";
import { initialData } from "../data/initialData";

const AppContext = createContext(null);
const STORAGE_KEY = "shori_command_center_v1";

export function AppProvider({ children }) {
  const [state, setState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure core structures exist
        const mergedGsoc = { ...initialData.gsoc, ...(parsed.gsoc || {}) };
        if (mergedGsoc.targetYear === 2025) {
          mergedGsoc.targetYear = 2027;
          mergedGsoc.deadlines = initialData.gsoc.deadlines;
          mergedGsoc.milestones = initialData.gsoc.milestones;
          mergedGsoc.currentMilestone = initialData.gsoc.currentMilestone;
        }
        const mergedProfile = { ...initialData.profile, ...(parsed.profile || {}) };
        if (mergedProfile.target && mergedProfile.target.includes("2025")) {
          mergedProfile.target = mergedProfile.target.replace("2025", "2027");
        }

        return {
          ...initialData,
          ...parsed,
          profile: mergedProfile,
          dsa: { ...initialData.dsa, ...(parsed.dsa || {}) },
          gsoc: mergedGsoc,
        };
      }
    } catch (e) {
      console.error("Failed to load state from localStorage:", e);
    }
    return initialData;
  });

  const [activeTab, setActiveTab] = useState(() => {
    try {
      return localStorage.getItem("shori_active_tab") || "Dashboard";
    } catch {
      return "Dashboard";
    }
  });
  const [activeModal, setActiveModal] = useState(null); // { type: 'addTask' | 'addProblem' | ..., data?: any }
  const [notification, setNotification] = useState(null);

  // Sync activeTab to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("shori_active_tab", activeTab);
    } catch (e) {
      console.error("Failed to save activeTab:", e);
    }
  }, [activeTab]);

  // Sync state changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error("Failed to save state to localStorage:", e);
    }
  }, [state]);

  const showToast = (message, type = "success") => {
    setNotification({ message, type, id: Date.now() });
    setTimeout(() => {
      setNotification((curr) => (curr?.id === notification?.id ? null : curr));
    }, 3200);
  };

  // Task Actions
  const toggleTaskStatus = (taskId) => {
    setState((prev) => {
      const updatedTasks = prev.tasks.map((task) => {
        if (task.id === taskId) {
          const nextStatus = task.status === "Completed" ? "Todo" : "Completed";
          return { ...task, status: nextStatus };
        }
        return task;
      });
      return { ...prev, tasks: updatedTasks };
    });
  };

  const addTask = (taskData) => {
    const newTask = {
      id: "task-" + Date.now(),
      status: "Todo",
      priority: "Medium",
      dueDate: new Date().toISOString().split("T")[0],
      ...taskData,
    };
    setState((prev) => ({ ...prev, tasks: [newTask, ...prev.tasks] }));
    showToast(`Task "${newTask.title}" added`);
  };

  const updateTask = (taskId, taskData) => {
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) => (t.id === taskId ? { ...t, ...taskData } : t)),
    }));
    showToast("Task updated");
  };

  const deleteTask = (taskId) => {
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((t) => t.id !== taskId),
    }));
    showToast("Task removed");
  };

  // DSA Actions
  const addDsaProblem = (problemData) => {
    const newProb = {
      id: "dsa-" + Date.now(),
      status: "Solved",
      difficulty: "Medium",
      revisionStatus: "Solid",
      lastPracticed: new Date().toISOString().split("T")[0],
      timeSpentMins: 30,
      ...problemData,
    };
    setState((prev) => ({
      ...prev,
      dsa: {
        ...prev.dsa,
        problems: [newProb, ...prev.dsa.problems],
      },
    }));
    showToast(`DSA problem "${newProb.title}" recorded`);
  };

  const updateDsaProblem = (problemId, problemData) => {
    setState((prev) => ({
      ...prev,
      dsa: {
        ...prev.dsa,
        problems: prev.dsa.problems.map((p) =>
          p.id === problemId ? { ...p, ...problemData } : p
        ),
      },
    }));
    showToast("Problem updated");
  };

  const deleteDsaProblem = (problemId) => {
    setState((prev) => ({
      ...prev,
      dsa: {
        ...prev.dsa,
        problems: prev.dsa.problems.filter((p) => p.id !== problemId),
      },
    }));
    showToast("Problem deleted");
  };

  const setDsaCurrentTopic = (currentTopic) => {
    setState((prev) => ({
      ...prev,
      dsa: { ...prev.dsa, currentTopic },
    }));
  };

  // GSoC Actions
  const updateGsocMilestoneStatus = (milestoneId, nextStatus) => {
    setState((prev) => ({
      ...prev,
      gsoc: {
        ...prev.gsoc,
        milestones: prev.gsoc.milestones.map((m) =>
          m.id === milestoneId ? { ...m, status: nextStatus } : m
        ),
      },
    }));
    showToast(`Milestone updated to ${nextStatus}`);
  };

  const addGsocMilestone = (milestoneData) => {
    const newM = {
      id: "m-" + Date.now(),
      status: "Not Started",
      date: new Date().toISOString().split("T")[0],
      ...milestoneData,
    };
    setState((prev) => ({
      ...prev,
      gsoc: {
        ...prev.gsoc,
        milestones: [...prev.gsoc.milestones, newM],
      },
    }));
    showToast(`Milestone added`);
  };

  const addGsocOrg = (orgData) => {
    const newOrg = {
      id: "org-" + Date.now(),
      matchPercentage: 80,
      techStack: [],
      ...orgData,
    };
    setState((prev) => ({
      ...prev,
      gsoc: {
        ...prev.gsoc,
        organizations: [newOrg, ...prev.gsoc.organizations],
      },
    }));
    showToast(`Organization "${newOrg.name}" added`);
  };

  const deleteGsocOrg = (orgId) => {
    setState((prev) => ({
      ...prev,
      gsoc: {
        ...prev.gsoc,
        organizations: prev.gsoc.organizations.filter((o) => o.id !== orgId),
      },
    }));
    showToast("Organization removed");
  };

  const addGsocContribution = (contribData) => {
    const newContrib = {
      id: "c-" + Date.now(),
      date: new Date().toISOString().split("T")[0],
      status: "Under Review",
      ...contribData,
    };
    setState((prev) => ({
      ...prev,
      gsoc: {
        ...prev.gsoc,
        contributions: [newContrib, ...prev.gsoc.contributions],
      },
    }));
    showToast(`Contribution logged`);
  };

  const deleteGsocContribution = (contribId) => {
    setState((prev) => ({
      ...prev,
      gsoc: {
        ...prev.gsoc,
        contributions: prev.gsoc.contributions.filter((c) => c.id !== contribId),
      },
    }));
    showToast("Contribution removed");
  };

  const toggleLearningRequirement = (reqId) => {
    setState((prev) => ({
      ...prev,
      gsoc: {
        ...prev.gsoc,
        learningRequirements: prev.gsoc.learningRequirements.map((r) =>
          r.id === reqId ? { ...r, done: !r.done } : r
        ),
      },
    }));
  };

  // Goals Actions
  const addGoal = (goalData) => {
    const newGoal = {
      id: "goal-" + Date.now(),
      progress: 0,
      milestones: [],
      ...goalData,
    };
    setState((prev) => ({
      ...prev,
      goals: [newGoal, ...prev.goals],
    }));
    showToast(`Goal "${newGoal.name}" created`);
  };

  const updateGoal = (goalId, goalData) => {
    setState((prev) => ({
      ...prev,
      goals: prev.goals.map((g) => (g.id === goalId ? { ...g, ...goalData } : g)),
    }));
    showToast("Goal updated");
  };

  const deleteGoal = (goalId) => {
    setState((prev) => ({
      ...prev,
      goals: prev.goals.filter((g) => g.id !== goalId),
    }));
    showToast("Goal removed");
  };

  const toggleGoalMilestone = (goalId, milestoneIndex) => {
    setState((prev) => ({
      ...prev,
      goals: prev.goals.map((goal) => {
        if (goal.id !== goalId) return goal;
        const updatedMilestones = [...goal.milestones];
        updatedMilestones[milestoneIndex] = {
          ...updatedMilestones[milestoneIndex],
          completed: !updatedMilestones[milestoneIndex].completed,
        };
        const completedCount = updatedMilestones.filter((m) => m.completed).length;
        const progress = Math.round(
          (completedCount / (updatedMilestones.length || 1)) * 100
        );
        return {
          ...goal,
          milestones: updatedMilestones,
          progress,
        };
      }),
    }));
  };

  // Daily Check-In Action
  const submitCheckIn = (checkInData, aiReview) => {
    const newCheckIn = {
      id: "chk-" + Date.now(),
      date: new Date().toISOString().split("T")[0],
      ...checkInData,
      aiReview,
    };
    setState((prev) => {
      const newStreak = (prev.profile?.streak || 0) + 1;
      return {
        ...prev,
        profile: {
          ...prev.profile,
          streak: newStreak,
          streakLastUpdated: newCheckIn.date,
        },
        checkIns: [newCheckIn, ...prev.checkIns],
      };
    });
    showToast("Daily check-in saved! Day streak updated 🔥");
  };

  // Profile and Data Actions
  const updateProfile = (profileData) => {
    setState((prev) => ({
      ...prev,
      profile: { ...prev.profile, ...profileData },
    }));
    showToast("Profile settings saved");
  };

  const resetToSampleData = () => {
    setState(initialData);
    localStorage.removeItem(STORAGE_KEY);
    showToast("Reset to sample command center data");
  };

  const importData = (importedJson) => {
    try {
      const parsed = JSON.parse(importedJson);
      setState(parsed);
      showToast("Data imported successfully");
      return true;
    } catch (e) {
      showToast("Invalid JSON file", "error");
      return false;
    }
  };

  return (
    <AppContext.Provider
      value={{
        state,
        activeTab,
        setActiveTab,
        activeModal,
        setActiveModal,
        notification,
        showToast,
        // Tasks
        toggleTaskStatus,
        addTask,
        updateTask,
        deleteTask,
        // DSA
        addDsaProblem,
        updateDsaProblem,
        deleteDsaProblem,
        setDsaCurrentTopic,
        // GSoC
        updateGsocMilestoneStatus,
        addGsocMilestone,
        addGsocOrg,
        deleteGsocOrg,
        addGsocContribution,
        deleteGsocContribution,
        toggleLearningRequirement,
        // Goals
        addGoal,
        updateGoal,
        deleteGoal,
        toggleGoalMilestone,
        // Check-in
        submitCheckIn,
        // Profile & system
        updateProfile,
        resetToSampleData,
        importData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
