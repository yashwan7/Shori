import { createClient } from "@supabase/supabase-js";
import { initialData } from "../data/initialData";

// Get configured credentials from Vite env or local storage override
export function getSupabaseCredentials() {
  const envUrl = import.meta.env.VITE_SUPABASE_URL || "";
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

  const storedUrl = typeof window !== "undefined" ? localStorage.getItem("shori_supabase_url") || "" : "";
  const storedKey = typeof window !== "undefined" ? localStorage.getItem("shori_supabase_anon_key") || "" : "";

  const url = (storedUrl || envUrl || "").trim();
  const anonKey = (storedKey || envKey || "").trim();

  const isValidUrl = url.startsWith("http://") || url.startsWith("https://");
  const isConfigured = Boolean(isValidUrl && anonKey && !url.includes("your-project-id"));

  return { url, anonKey, isConfigured };
}

let supabaseInstance = null;

export function getSupabase() {
  const { url, anonKey, isConfigured } = getSupabaseCredentials();

  if (!isConfigured) {
    return null;
  }

  if (!supabaseInstance || supabaseInstance.supabaseUrl !== url) {
    try {
      supabaseInstance = createClient(url, anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      });
    } catch (err) {
      console.error("Failed to initialize Supabase client:", err);
      return null;
    }
  }

  return supabaseInstance;
}

export function isSupabaseConfigured() {
  const { isConfigured } = getSupabaseCredentials();
  return isConfigured;
}

export function saveCustomSupabaseConfig(url, anonKey) {
  if (url) localStorage.setItem("shori_supabase_url", url.trim());
  else localStorage.removeItem("shori_supabase_url");

  if (anonKey) localStorage.setItem("shori_supabase_anon_key", anonKey.trim());
  else localStorage.removeItem("shori_supabase_anon_key");

  supabaseInstance = null; // force recreation
  return getSupabase();
}

// ============================================================================
// AUTHENTICATION API
// ============================================================================

export async function signUpUser({ email, password, name, title, target, leetcodeUsername, githubUsername }) {
  const supabase = getSupabase();
  if (!supabase) throw new Error("Supabase is not configured yet. Please provide your Supabase URL & Anon Key.");

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name: name || email.split("@")[0],
        title: title || "Software Engineer & Open Source Contributor",
        target: target || "Tier-1 Tech / GSoC",
        leetcode_username: leetcodeUsername || "yashwanth",
        github_username: githubUsername || "yashwan7",
      },
    },
  });

  if (error) throw error;
  return data;
}

export async function signInUser({ email, password }) {
  const supabase = getSupabase();
  if (!supabase) throw new Error("Supabase is not configured yet. Please provide your Supabase URL & Anon Key.");

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

export async function signInWithOAuthProvider(provider = "github") {
  const supabase = getSupabase();
  if (!supabase) throw new Error("Supabase is not configured yet.");

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: window.location.origin,
    },
  });

  if (error) throw error;
  return data;
}

export async function signOutUser() {
  const supabase = getSupabase();
  if (!supabase) return { error: null };

  const { error } = await supabase.auth.signOut();
  if (error) console.error("Sign out error:", error);
  return { error };
}

export async function getAuthSession() {
  const supabase = getSupabase();
  if (!supabase) return { session: null, user: null };

  const { data, error } = await supabase.auth.getSession();
  if (error) {
    console.error("Failed to get Supabase session:", error);
    return { session: null, user: null };
  }
  return { session: data.session, user: data.session?.user || null };
}

// ============================================================================
// DATABASE & SYNC API
// ============================================================================

/**
 * Fetch all user entities from Supabase.
 * If user has zero records (e.g. brand new user), auto-seeds default starter data!
 */
export async function fetchFullUserData(userId) {
  const supabase = getSupabase();
  if (!supabase || !userId) return null;

  try {
    // 1. Profile
    let { data: profileData, error: profileErr } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (profileErr && profileErr.code !== "PGRST116") {
      console.warn("Profile fetch error:", profileErr);
    }

    // If profile doesn't exist yet, create default
    if (!profileData) {
      const defaultProf = {
        id: userId,
        name: "Engineer",
        title: "Software Engineer & Open Source Contributor",
        target: "GSoC 2025 / Tier-1 Tech",
        streak: 1,
        streak_last_date: new Date().toISOString().split("T")[0],
        weekly_goal_hours: 35,
        weekly_current_hours: 0,
        leetcode_username: "yashwanth",
        github_username: "yashwan7",
      };
      await supabase.from("profiles").upsert(defaultProf);
      profileData = defaultProf;
    }

    // 2. Parallel queries for all collections
    const [tasksRes, dsaRes, gsocOrgsRes, gsocContribsRes, gsocMilestonesRes, checkInsRes, goalsRes] =
      await Promise.all([
        supabase.from("tasks").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
        supabase.from("dsa_problems").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
        supabase.from("gsoc_organizations").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
        supabase.from("gsoc_contributions").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
        supabase.from("gsoc_milestones").select("*").eq("user_id", userId).order("created_at", { ascending: true }),
        supabase.from("daily_checkins").select("*").eq("user_id", userId).order("date", { ascending: false }),
        supabase.from("goals").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
      ]);

    // Check if new user with empty data; if totally empty, seed starter workspace
    const hasData =
      (tasksRes.data && tasksRes.data.length > 0) ||
      (dsaRes.data && dsaRes.data.length > 0) ||
      (gsocOrgsRes.data && gsocOrgsRes.data.length > 0);

    if (!hasData) {
      console.log("Seeding initial workspace records for user:", userId);
      return await seedNewUserWorkspace(userId, profileData);
    }

    // Transform DB snake_case records into frontend schema
    const tasks = (tasksRes.data || []).map((t) => ({
      id: t.id,
      title: t.title,
      description: t.description || "",
      category: t.category || "DSA",
      priority: t.priority || "Medium",
      status: t.status || "Todo",
      dueDate: t.due_date || new Date().toISOString().split("T")[0],
      estimatedMins: t.estimated_mins || 30,
      goalId: t.goal_id || "dsa",
      notes: t.notes || "",
      completedAt: t.completed_at,
      createdAt: t.created_at,
    }));

    const dsaProblems = (dsaRes.data || []).map((p) => ({
      id: p.id,
      title: p.title,
      topic: p.topic || "Arrays",
      difficulty: p.difficulty || "Medium",
      status: p.status || "Solved",
      revisionStatus: p.revision_status || "Solid",
      link: p.link || "",
      notes: p.notes || "",
      timeSpentMins: p.time_spent_mins || 30,
      lastPracticed: p.last_practiced || new Date().toISOString().split("T")[0],
      createdAt: p.created_at,
    }));

    const organizations = (gsocOrgsRes.data || []).map((o) => ({
      id: o.id,
      name: o.name,
      techStack: o.tech_stack || [],
      repoUrl: o.repo_url || "",
      projectIdea: o.project_idea || "",
      matchPercentage: o.match_percentage || 80,
      status: o.status || "Shortlisted",
      notes: o.notes || "",
      createdAt: o.created_at,
    }));

    const contributions = (gsocContribsRes.data || []).map((c) => ({
      id: c.id,
      orgId: c.org_id,
      org: c.org_name || "Open Source",
      title: c.title,
      type: c.type || "PR",
      url: c.url || "",
      status: c.status || "Under Review",
      date: c.date || new Date().toISOString().split("T")[0],
      notes: c.notes || "",
      createdAt: c.created_at,
    }));

    const milestones =
      gsocMilestonesRes.data && gsocMilestonesRes.data.length > 0
        ? gsocMilestonesRes.data.map((m) => ({
            id: m.id,
            title: m.title,
            status: m.status,
            date: m.date,
            desc: m.desc_text,
          }))
        : initialData.gsoc.milestones;

    const checkIns = (checkInsRes.data || []).map((c) => ({
      id: c.id,
      date: c.date,
      mood: c.mood || "Good",
      hoursSpent: parseFloat(c.hours_spent) || 0,
      problemsSolved: c.problems_solved || 0,
      categories: c.categories || ["DSA", "GSoC"],
      accomplished: c.accomplished || "",
      pending: c.pending || "",
      tomorrowPriority: c.tomorrow_priority || "",
      reflection: c.reflection || "",
      blockers: c.blockers || "",
      wins: c.wins || "",
      notes: c.notes || "",
      aiReview: c.ai_review || null,
    }));

    const goals = (goalsRes.data || []).map((g) => ({
      id: g.id,
      name: g.name,
      description: g.description || "",
      category: g.category || "AI/ML",
      targetDate: g.target_date || new Date().toISOString().split("T")[0],
      progress: g.progress || 0,
      notes: g.notes || "",
      milestones: g.milestones || [],
      createdAt: g.created_at,
    }));

    return {
      profile: {
        name: profileData.name || "Engineer",
        title: profileData.title || "Software Engineer",
        target: profileData.target || "Tier-1 Tech / GSoC",
        streak: profileData.streak || 0,
        streakLastUpdated: profileData.streak_last_date || new Date().toISOString().split("T")[0],
        weeklyGoalHours: Number(profileData.weekly_goal_hours) || 35,
        weeklyCurrentHours: Number(profileData.weekly_current_hours) || 0,
        leetcodeUsername: profileData.leetcode_username || "yashwanth",
        githubUsername: profileData.github_username || "yashwan7",
        avatarUrl: profileData.avatar_url || "",
      },
      dsa: {
        ...initialData.dsa,
        problems: dsaProblems,
      },
      gsoc: {
        ...initialData.gsoc,
        organizations,
        contributions,
        milestones,
      },
      goals: goals.length > 0 ? goals : initialData.goals,
      tasks,
      checkIns,
      weeklyProductivity: initialData.weeklyProductivity,
    };
  } catch (err) {
    console.error("Error in fetchFullUserData:", err);
    throw err;
  }
}

/**
 * Seeds a fresh user workspace with high-grade initial templates
 */
export async function seedNewUserWorkspace(userId, profileData = {}) {
  const supabase = getSupabase();
  if (!supabase || !userId) return initialData;

  try {
    // 1. Seed Tasks
    const taskInserts = initialData.tasks.map((t) => ({
      user_id: userId,
      title: t.title,
      description: t.description || "",
      category: t.category || "DSA",
      priority: t.priority || "Medium",
      status: t.status || "Todo",
      due_date: t.dueDate || new Date().toISOString().split("T")[0],
      estimated_mins: t.estimatedMins || 30,
      goal_id: t.goalId || "dsa",
      notes: t.notes || "",
    }));

    // 2. Seed DSA
    const dsaInserts = initialData.dsa.problems.map((p) => ({
      user_id: userId,
      title: p.title,
      topic: p.topic || "Arrays",
      difficulty: p.difficulty || "Medium",
      status: p.status || "Solved",
      revision_status: p.revisionStatus || "Solid",
      link: p.link || "",
      notes: p.notes || "",
      time_spent_mins: p.timeSpentMins || 30,
      last_practiced: p.lastPracticed || new Date().toISOString().split("T")[0],
    }));

    // 3. Seed GSoC Orgs
    const orgInserts = initialData.gsoc.organizations.map((o) => ({
      user_id: userId,
      name: o.name,
      tech_stack: o.techStack || [],
      repo_url: o.repoUrl || "",
      project_idea: o.projectIdea || "",
      match_percentage: o.matchPercentage || 80,
      status: o.status || "Shortlisted",
      notes: o.notes || "",
    }));

    // 4. Seed Goals
    const goalInserts = initialData.goals.map((g) => ({
      user_id: userId,
      name: g.name,
      description: g.description || "",
      category: g.category || "AI/ML",
      target_date: g.targetDate || new Date().toISOString().split("T")[0],
      progress: g.progress || 0,
      notes: g.notes || "",
      milestones: g.milestones || [],
    }));

    // 5. Seed CheckIns
    const checkinInserts = initialData.checkIns.map((c) => ({
      user_id: userId,
      date: c.date,
      mood: "Good",
      hours_spent: c.hoursSpent || 4,
      problems_solved: 2,
      categories: c.categories || ["DSA", "GSoC"],
      accomplished: c.accomplished || "",
      pending: c.pending || "",
      tomorrow_priority: c.tomorrowPriority || "",
      ai_review: c.aiReview || {},
    }));

    await Promise.allSettled([
      supabase.from("tasks").insert(taskInserts),
      supabase.from("dsa_problems").insert(dsaInserts),
      supabase.from("gsoc_organizations").insert(orgInserts),
      supabase.from("goals").insert(goalInserts),
      supabase.from("daily_checkins").insert(checkinInserts),
    ]);

    // Return fresh structured data
    return await fetchFullUserData(userId);
  } catch (err) {
    console.warn("Seeding notice:", err);
    return initialData;
  }
}

// ============================================================================
// INDIVIDUAL CRUD HELPERS FOR INSTANT SYNC
// ============================================================================

export async function dbUpsertProfile(userId, profile) {
  const supabase = getSupabase();
  if (!supabase || !userId) return;

  const payload = {
    id: userId,
    name: profile.name,
    title: profile.title,
    target: profile.target,
    streak: profile.streak,
    streak_last_date: profile.streakLastUpdated,
    weekly_goal_hours: profile.weeklyGoalHours,
    weekly_current_hours: profile.weeklyCurrentHours,
    leetcode_username: profile.leetcodeUsername,
    github_username: profile.githubUsername,
    avatar_url: profile.avatarUrl,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase.from("profiles").upsert(payload);
  if (error) console.error("Error upserting profile:", error);
}

export async function dbSaveTask(userId, task) {
  const supabase = getSupabase();
  if (!supabase || !userId) return;

  const payload = {
    user_id: userId,
    title: task.title,
    description: task.description || "",
    category: task.category || "DSA",
    priority: task.priority || "Medium",
    status: task.status || "Todo",
    due_date: task.dueDate || new Date().toISOString().split("T")[0],
    estimated_mins: task.estimatedMins || 30,
    goal_id: task.goalId || "dsa",
    notes: task.notes || "",
    completed_at: task.status === "Completed" ? new Date().toISOString() : null,
    updated_at: new Date().toISOString(),
  };

  // If already a valid UUID in Supabase
  if (task.id && !task.id.startsWith("task-")) {
    payload.id = task.id;
  }

  const { data, error } = await supabase.from("tasks").upsert(payload).select().single();
  if (error) console.error("Error saving task:", error);
  return data;
}

export async function dbDeleteTask(userId, taskId) {
  const supabase = getSupabase();
  if (!supabase || !userId || taskId.startsWith("task-")) return;

  const { error } = await supabase.from("tasks").delete().eq("id", taskId).eq("user_id", userId);
  if (error) console.error("Error deleting task:", error);
}

export async function dbSaveDsaProblem(userId, prob) {
  const supabase = getSupabase();
  if (!supabase || !userId) return;

  const payload = {
    user_id: userId,
    title: prob.title,
    topic: prob.topic || "Arrays",
    difficulty: prob.difficulty || "Medium",
    status: prob.status || "Solved",
    revision_status: prob.revisionStatus || "Solid",
    link: prob.link || "",
    notes: prob.notes || "",
    time_spent_mins: prob.timeSpentMins || 30,
    last_practiced: prob.lastPracticed || new Date().toISOString().split("T")[0],
    updated_at: new Date().toISOString(),
  };

  if (prob.id && !prob.id.startsWith("dsa-")) {
    payload.id = prob.id;
  }

  const { data, error } = await supabase.from("dsa_problems").upsert(payload).select().single();
  if (error) console.error("Error saving DSA problem:", error);
  return data;
}

export async function dbDeleteDsaProblem(userId, probId) {
  const supabase = getSupabase();
  if (!supabase || !userId || probId.startsWith("dsa-")) return;

  const { error } = await supabase.from("dsa_problems").delete().eq("id", probId).eq("user_id", userId);
  if (error) console.error("Error deleting DSA problem:", error);
}

export async function dbSaveGsocOrg(userId, org) {
  const supabase = getSupabase();
  if (!supabase || !userId) return;

  const payload = {
    user_id: userId,
    name: org.name,
    tech_stack: org.techStack || [],
    repo_url: org.repoUrl || "",
    project_idea: org.projectIdea || "",
    match_percentage: org.matchPercentage || 80,
    status: org.status || "Shortlisted",
    notes: org.notes || "",
    updated_at: new Date().toISOString(),
  };

  if (org.id && !org.id.startsWith("org-")) {
    payload.id = org.id;
  }

  const { data, error } = await supabase.from("gsoc_organizations").upsert(payload).select().single();
  if (error) console.error("Error saving GSoC org:", error);
  return data;
}

export async function dbDeleteGsocOrg(userId, orgId) {
  const supabase = getSupabase();
  if (!supabase || !userId || orgId.startsWith("org-")) return;

  const { error } = await supabase.from("gsoc_organizations").delete().eq("id", orgId).eq("user_id", userId);
  if (error) console.error("Error deleting GSoC org:", error);
}

export async function dbSaveGsocContribution(userId, contrib) {
  const supabase = getSupabase();
  if (!supabase || !userId) return;

  const payload = {
    user_id: userId,
    org_id: contrib.orgId && !contrib.orgId.startsWith("org-") ? contrib.orgId : null,
    org_name: contrib.org || "",
    title: contrib.title,
    type: contrib.type || "PR",
    pr_number: contrib.prNumber || "",
    url: contrib.url || "",
    status: contrib.status || "Under Review",
    date: contrib.date || new Date().toISOString().split("T")[0],
    notes: contrib.notes || "",
    updated_at: new Date().toISOString(),
  };

  if (contrib.id && !contrib.id.startsWith("c-")) {
    payload.id = contrib.id;
  }

  const { data, error } = await supabase.from("gsoc_contributions").upsert(payload).select().single();
  if (error) console.error("Error saving contribution:", error);
  return data;
}

export async function dbDeleteGsocContribution(userId, contribId) {
  const supabase = getSupabase();
  if (!supabase || !userId || contribId.startsWith("c-")) return;

  const { error } = await supabase.from("gsoc_contributions").delete().eq("id", contribId).eq("user_id", userId);
  if (error) console.error("Error deleting contribution:", error);
}

export async function dbSaveDailyCheckin(userId, checkIn) {
  const supabase = getSupabase();
  if (!supabase || !userId) return;

  const payload = {
    user_id: userId,
    date: checkIn.date || new Date().toISOString().split("T")[0],
    mood: checkIn.mood || "Good",
    hours_spent: checkIn.hoursSpent || 0,
    problems_solved: checkIn.problemsSolved || 0,
    categories: checkIn.categories || ["DSA", "GSoC"],
    accomplished: checkIn.accomplished || "",
    pending: checkIn.pending || "",
    tomorrow_priority: checkIn.tomorrowPriority || "",
    reflection: checkIn.reflection || "",
    blockers: checkIn.blockers || "",
    wins: checkIn.wins || "",
    notes: checkIn.notes || "",
    ai_review: checkIn.aiReview || {},
  };

  if (checkIn.id && !checkIn.id.startsWith("chk-")) {
    payload.id = checkIn.id;
  }

  const { data, error } = await supabase.from("daily_checkins").upsert(payload, { onConflict: "user_id, date" }).select().single();
  if (error) console.error("Error saving daily checkin:", error);
  return data;
}

export async function dbSaveGoal(userId, goal) {
  const supabase = getSupabase();
  if (!supabase || !userId) return;

  const payload = {
    user_id: userId,
    name: goal.name,
    description: goal.description || "",
    category: goal.category || "AI/ML",
    target_date: goal.targetDate || new Date().toISOString().split("T")[0],
    progress: goal.progress || 0,
    notes: goal.notes || "",
    milestones: goal.milestones || [],
    updated_at: new Date().toISOString(),
  };

  if (goal.id && !goal.id.startsWith("goal-")) {
    payload.id = goal.id;
  }

  const { data, error } = await supabase.from("goals").upsert(payload).select().single();
  if (error) console.error("Error saving goal:", error);
  return data;
}

export async function dbDeleteGoal(userId, goalId) {
  const supabase = getSupabase();
  if (!supabase || !userId || goalId.startsWith("goal-")) return;

  const { error } = await supabase.from("goals").delete().eq("id", goalId).eq("user_id", userId);
  if (error) console.error("Error deleting goal:", error);
}
