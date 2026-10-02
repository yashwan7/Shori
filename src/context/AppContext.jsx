import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { initialData } from "../data/initialData";
import {
  getSupabase,
  isSupabaseConfigured,
  getAuthSession,
  signInUser,
  signUpUser,
  signOutUser,
  signInWithOAuthProvider,
  fetchFullUserData,
  dbUpsertProfile,
  dbSaveTask,
  dbDeleteTask,
  dbSaveDsaProblem,
  dbDeleteDsaProblem,
  dbSaveGsocOrg,
  dbDeleteGsocOrg,
  dbSaveGsocContribution,
  dbDeleteGsocContribution,
  dbSaveDailyCheckin,
  dbSaveGoal,
  dbDeleteGoal,
} from "../services/supabaseClient";
import { fetchLeetCodeStats } from "../services/leetcodeService";
import { fetchGitHubUserData } from "../services/githubService";

const AppContext = createContext(null);
const STORAGE_KEY = "shori_command_center_v2";

export function AppProvider({ children }) {
  // State Initialization
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
          goals: parsed.goals && parsed.goals.length > 0 ? parsed.goals : initialData.goals,
        };
      }
    } catch (e) {
      console.warn("Failed to load initial state from localStorage:", e);
    }
    return initialData;
  });

  // Auth & Cloud States
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [dbLoading, setDbLoading] = useState(false);
  const [isCloudConnected, setIsCloudConnected] = useState(false);

  // Live Integrations
  const [leetcodeStats, setLeetcodeStats] = useState(null);
  const [githubStats, setGithubStats] = useState(null);
  const [isStatsLoading, setIsStatsLoading] = useState(false);

  // Navigation & UI States
  const [activeTab, setActiveTab] = useState(() => {
    try {
      return localStorage.getItem("shori_active_tab") || "Dashboard";
    } catch {
      return "Dashboard";
    }
  });
  const [activeModal, setActiveModal] = useState(null); // { type, data? }
  const [notification, setNotification] = useState(null);

  // Sync activeTab to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("shori_active_tab", activeTab);
    } catch (e) {
      console.error("Failed to save activeTab:", e);
    }
  }, [activeTab]);

  const stateRef = useRef(state);
  stateRef.current = state;

  const showToast = useCallback((message, type = "success") => {
    const id = Date.now();
    setNotification({ message, type, id });
    setTimeout(() => {
      setNotification((curr) => (curr?.id === id ? null : curr));
    }, 3600);
  }, []);

  // Save to localStorage as backup/cache
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {}
  }, [state]);

  // Load external stats (LeetCode & GitHub)
  const loadExternalStats = useCallback(async (lcUsername, ghUsername, force = false) => {
    const targetLc = lcUsername || stateRef.current.profile?.leetcodeUsername || "yashwanth";
    const targetGh = ghUsername || stateRef.current.profile?.githubUsername || "yashwan7";

    setIsStatsLoading(true);
    try {
      const [lc, gh] = await Promise.allSettled([
        fetchLeetCodeStats(targetLc, force),
        fetchGitHubUserData(targetGh, force),
      ]);

      if (lc.status === "fulfilled" && lc.value) {
        setLeetcodeStats(lc.value);
      }
      if (gh.status === "fulfilled" && gh.value) {
        setGithubStats(gh.value);
      }
    } catch (err) {
      console.warn("External stats fetch error:", err);
    } finally {
      setIsStatsLoading(false);
    }
  }, []);

  // Load DB data for authenticated user
  const loadUserDatabaseData = useCallback(async (userId, silent = false) => {
    if (!userId || !isSupabaseConfigured()) return;
    if (!silent) setDbLoading(true);

    try {
      const cloudData = await fetchFullUserData(userId);
      if (cloudData) {
        setState(cloudData);
        setIsCloudConnected(true);
        // Also fetch external stats for their handles
        loadExternalStats(
          cloudData.profile?.leetcodeUsername,
          cloudData.profile?.githubUsername
        );
      }
    } catch (err) {
      console.error("Failed to load user database data from Supabase:", err);
      showToast("Could not sync with Supabase: Using local data", "warning");
    } finally {
      if (!silent) setDbLoading(false);
    }
  }, [loadExternalStats, showToast]);

  // Initial Auth Check & Supabase Listener
  useEffect(() => {
    let isMounted = true;
    const supabase = getSupabase();

    async function initAuth() {
      if (!isSupabaseConfigured() || !supabase) {
        setAuthLoading(false);
        setIsCloudConnected(false);
        loadExternalStats(state.profile?.leetcodeUsername, state.profile?.githubUsername);
        return;
      }

      try {
        const { session: currentSession, user: currentUser } = await getAuthSession();
        if (isMounted) {
          setSession(currentSession);
          setUser(currentUser);
          if (currentUser) {
            setIsCloudConnected(true);
            await loadUserDatabaseData(currentUser.id);
          } else {
            setIsCloudConnected(false);
            loadExternalStats(state.profile?.leetcodeUsername, state.profile?.githubUsername);
          }
        }
      } catch (err) {
        console.error("Auth init error:", err);
      } finally {
        if (isMounted) setAuthLoading(false);
      }
    }

    initAuth();

    // Listen to Supabase auth state changes
    let subscription = null;
    if (supabase) {
      const { data } = supabase.auth.onAuthStateChange(async (event, newSession) => {
        if (!isMounted) return;
        setSession(newSession);
        setUser(newSession?.user || null);

        if (event === "SIGNED_IN" && newSession?.user) {
          setIsCloudConnected(true);
          showToast(`Welcome, ${newSession.user.user_metadata?.name || newSession.user.email}!`);
          await loadUserDatabaseData(newSession.user.id);
        } else if (event === "SIGNED_OUT") {
          setIsCloudConnected(false);
          setUser(null);
          setSession(null);
          showToast("Signed out. Switched to offline mode.", "info");
        }
      });
      subscription = data?.subscription;
    }

    return () => {
      isMounted = false;
      if (subscription) subscription.unsubscribe();
    };
  }, [loadUserDatabaseData, loadExternalStats, showToast]);

  // ==========================================================================
  // AUTH METHODS
  // ==========================================================================

  const login = async (email, password) => {
    setAuthLoading(true);
    try {
      const data = await signInUser({ email, password });
      if (data.user) {
        setUser(data.user);
        setSession(data.session);
        setIsCloudConnected(true);
        await loadUserDatabaseData(data.user.id);
        showToast("Signed in successfully!");
        return { success: true };
      }
    } catch (err) {
      showToast(err.message || "Login failed", "error");
      return { success: false, error: err.message };
    } finally {
      setAuthLoading(false);
    }
  };

  const signup = async (formData) => {
    setAuthLoading(true);
    try {
      const data = await signUpUser(formData);
      if (data.session && data.user) {
        setUser(data.user);
        setSession(data.session);
        setIsCloudConnected(true);
        await loadUserDatabaseData(data.user.id);
        showToast("Account created successfully! Workspace ready.");
        return { success: true };
      } else if (data.user) {
        // Supabase has 'Confirm email' enabled - user created but no session yet
        return {
          success: true,
          needsConfirmation: true,
          email: formData.email,
        };
      }
    } catch (err) {
      showToast(err.message || "Registration failed", "error");
      return { success: false, error: err.message };
    } finally {
      setAuthLoading(false);
    }
  };

  const loginWithOAuth = async (provider) => {
    try {
      await signInWithOAuthProvider(provider);
    } catch (err) {
      showToast(err.message || "OAuth login failed", "error");
    }
  };

  const logout = async () => {
    try {
      await signOutUser();
      setUser(null);
      setSession(null);
      setIsCloudConnected(false);
    } catch (err) {
      console.error(err);
    }
  };

  // ==========================================================================
  // TASK ACTIONS
  // ==========================================================================

  const toggleTaskStatus = (taskId) => {
    let updatedTask = null;
    setState((prev) => {
      const updatedTasks = prev.tasks.map((task) => {
        if (task.id === taskId) {
          const nextStatus = task.status === "Completed" ? "Todo" : "Completed";
          updatedTask = {
            ...task,
            status: nextStatus,
            completedAt: nextStatus === "Completed" ? new Date().toISOString() : null,
          };
          return updatedTask;
        }
        return task;
      });
      return { ...prev, tasks: updatedTasks };
    });

    if (updatedTask && user) {
      dbSaveTask(user.id, updatedTask);
    }
  };

  const addTask = (taskData) => {
    const newTask = {
      id: "task-" + Date.now(),
      status: "Todo",
      priority: "Medium",
      dueDate: new Date().toISOString().split("T")[0],
      createdAt: new Date().toISOString(),
      ...taskData,
    };

    setState((prev) => ({ ...prev, tasks: [newTask, ...prev.tasks] }));
    showToast(`Task "${newTask.title}" added`);

    if (user) {
      dbSaveTask(user.id, newTask).then((saved) => {
        if (saved?.id) {
          setState((prev) => ({
            ...prev,
            tasks: prev.tasks.map((t) => (t.id === newTask.id ? { ...t, id: saved.id } : t)),
          }));
        }
      });
    }
  };

  const updateTask = (taskId, taskData) => {
    let updated = null;
    setState((prev) => {
      const updatedTasks = prev.tasks.map((t) => {
        if (t.id === taskId) {
          updated = { ...t, ...taskData };
          return updated;
        }
        return t;
      });
      return { ...prev, tasks: updatedTasks };
    });

    showToast("Task updated");
    if (updated && user) {
      dbSaveTask(user.id, updated);
    }
  };

  const deleteTask = (taskId) => {
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((t) => t.id !== taskId),
    }));
    showToast("Task removed");

    if (user) {
      dbDeleteTask(user.id, taskId);
    }
  };

  // ==========================================================================
  // DSA ACTIONS
  // ==========================================================================

  const addDsaProblem = (problemData) => {
    const newProb = {
      id: "dsa-" + Date.now(),
      status: "Solved",
      difficulty: "Medium",
      revisionStatus: "Solid",
      lastPracticed: new Date().toISOString().split("T")[0],
      timeSpentMins: 30,
      createdAt: new Date().toISOString(),
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

    if (user) {
      dbSaveDsaProblem(user.id, newProb).then((saved) => {
        if (saved?.id) {
          setState((prev) => ({
            ...prev,
            dsa: {
              ...prev.dsa,
              problems: prev.dsa.problems.map((p) => (p.id === newProb.id ? { ...p, id: saved.id } : p)),
            },
          }));
        }
      });
    }
  };

  const updateDsaProblem = (problemId, problemData) => {
    let updated = null;
    setState((prev) => {
      const updatedProbs = prev.dsa.problems.map((p) => {
        if (p.id === problemId) {
          updated = { ...p, ...problemData };
          return updated;
        }
        return p;
      });
      return {
        ...prev,
        dsa: {
          ...prev.dsa,
          problems: updatedProbs,
        },
      };
    });

    showToast("Problem updated");
    if (updated && user) {
      dbSaveDsaProblem(user.id, updated);
    }
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

    if (user) {
      dbDeleteDsaProblem(user.id, problemId);
    }
  };

  const setDsaCurrentTopic = (currentTopic) => {
    setState((prev) => ({
      ...prev,
      dsa: { ...prev.dsa, currentTopic },
    }));
  };

  // ==========================================================================
  // GSOC ACTIONS
  // ==========================================================================

  const addGsocOrg = (orgData) => {
    const newOrg = {
      id: "org-" + Date.now(),
      matchPercentage: 80,
      techStack: [],
      createdAt: new Date().toISOString(),
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

    if (user) {
      dbSaveGsocOrg(user.id, newOrg).then((saved) => {
        if (saved?.id) {
          setState((prev) => ({
            ...prev,
            gsoc: {
              ...prev.gsoc,
              organizations: prev.gsoc.organizations.map((o) => (o.id === newOrg.id ? { ...o, id: saved.id } : o)),
            },
          }));
        }
      });
    }
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

    if (user) {
      dbDeleteGsocOrg(user.id, orgId);
    }
  };

  const addGsocContribution = (contribData) => {
    const newContrib = {
      id: "c-" + Date.now(),
      date: new Date().toISOString().split("T")[0],
      status: "Under Review",
      createdAt: new Date().toISOString(),
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

    if (user) {
      dbSaveGsocContribution(user.id, newContrib).then((saved) => {
        if (saved?.id) {
          setState((prev) => ({
            ...prev,
            gsoc: {
              ...prev.gsoc,
              contributions: prev.gsoc.contributions.map((c) => (c.id === newContrib.id ? { ...c, id: saved.id } : c)),
            },
          }));
        }
      });
    }
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

    if (user) {
      dbDeleteGsocContribution(user.id, contribId);
    }
  };

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

  const toggleLearningRequirement = (reqId) => {
    setState((prev) => ({
      ...prev,
      gsoc: {
        ...prev.gsoc,
        learningRequirements: (prev.gsoc.learningRequirements || []).map((r) =>
          r.id === reqId ? { ...r, done: !r.done } : r
        ),
      },
    }));
  };

  // ==========================================================================
  // GOALS ACTIONS
  // ==========================================================================

  const addGoal = (goalData) => {
    const newGoal = {
      id: "goal-" + Date.now(),
      progress: 0,
      milestones: [],
      createdAt: new Date().toISOString(),
      ...goalData,
    };

    setState((prev) => ({
      ...prev,
      goals: [newGoal, ...prev.goals],
    }));
    showToast(`Goal "${newGoal.name}" created`);

    if (user) {
      dbSaveGoal(user.id, newGoal).then((saved) => {
        if (saved?.id) {
          setState((prev) => ({
            ...prev,
            goals: prev.goals.map((g) => (g.id === newGoal.id ? { ...g, id: saved.id } : g)),
          }));
        }
      });
    }
  };

  const updateGoal = (goalId, goalData) => {
    let updated = null;
    setState((prev) => {
      const updatedGoals = prev.goals.map((g) => {
        if (g.id === goalId) {
          updated = { ...g, ...goalData };
          return updated;
        }
        return g;
      });
      return { ...prev, goals: updatedGoals };
    });

    showToast("Goal updated");
    if (updated && user) {
      dbSaveGoal(user.id, updated);
    }
  };

  const deleteGoal = (goalId) => {
    setState((prev) => ({
      ...prev,
      goals: prev.goals.filter((g) => g.id !== goalId),
    }));
    showToast("Goal removed");

    if (user) {
      dbDeleteGoal(user.id, goalId);
    }
  };

  const toggleGoalMilestone = (goalId, milestoneIndex) => {
    let updatedGoal = null;
    setState((prev) => {
      const updatedGoals = prev.goals.map((goal) => {
        if (goal.id !== goalId) return goal;
        const updatedMilestones = [...(goal.milestones || [])];
        updatedMilestones[milestoneIndex] = {
          ...updatedMilestones[milestoneIndex],
          completed: !updatedMilestones[milestoneIndex].completed,
        };
        const completedCount = updatedMilestones.filter((m) => m.completed).length;
        const progress = Math.round((completedCount / (updatedMilestones.length || 1)) * 100);
        updatedGoal = {
          ...goal,
          milestones: updatedMilestones,
          progress,
        };
        return updatedGoal;
      });
      return { ...prev, goals: updatedGoals };
    });

    if (updatedGoal && user) {
      dbSaveGoal(user.id, updatedGoal);
    }
  };

  // ==========================================================================
  // DAILY CHECK-IN
  // ==========================================================================

  const submitCheckIn = (checkInData, aiReview) => {
    const newCheckIn = {
      id: "chk-" + Date.now(),
      date: new Date().toISOString().split("T")[0],
      createdAt: new Date().toISOString(),
      ...checkInData,
      aiReview,
    };

    let updatedProfile = null;
    setState((prev) => {
      const newStreak = (prev.profile?.streak || 0) + 1;
      const currentHours = (prev.profile?.weeklyCurrentHours || 0) + (checkInData.hoursSpent || 0);
      updatedProfile = {
        ...prev.profile,
        streak: newStreak,
        streakLastUpdated: newCheckIn.date,
        weeklyCurrentHours: parseFloat(currentHours.toFixed(1)),
      };
      return {
        ...prev,
        profile: updatedProfile,
        checkIns: [newCheckIn, ...prev.checkIns],
      };
    });

    showToast("Daily check-in saved! Day streak updated 🔥");

    if (user) {
      dbSaveDailyCheckin(user.id, newCheckIn);
      if (updatedProfile) dbUpsertProfile(user.id, updatedProfile);
    }
  };

  // ==========================================================================
  // PROFILE & CONFIGURATION
  // ==========================================================================

  const updateProfile = (profileData) => {
    let updatedProfile = null;
    setState((prev) => {
      updatedProfile = { ...prev.profile, ...profileData };
      return {
        ...prev,
        profile: updatedProfile,
      };
    });

    showToast("Profile settings saved");

    if (user && updatedProfile) {
      dbUpsertProfile(user.id, updatedProfile);
    }

    // Refresh LeetCode / GitHub if usernames changed
    if (profileData.leetcodeUsername || profileData.githubUsername) {
      loadExternalStats(profileData.leetcodeUsername, profileData.githubUsername, true);
    }
  };

  const refreshExternalStats = () => {
    loadExternalStats(state.profile?.leetcodeUsername, state.profile?.githubUsername, true);
    showToast("Refreshing live LeetCode & GitHub stats...");
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
        user,
        session,
        authLoading,
        dbLoading,
        isCloudConnected,
        isSupabaseConfigured: isSupabaseConfigured(),
        leetcodeStats,
        githubStats,
        isStatsLoading,
        refreshExternalStats,
        activeTab,
        setActiveTab,
        activeModal,
        setActiveModal,
        notification,
        showToast,
        // Auth
        login,
        signup,
        loginWithOAuth,
        logout,
        loadUserDatabaseData,
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
