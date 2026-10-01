// AI Service for Shori Command Center
// Supports Gemini API via VITE_AI_API_KEY / LocalStorage settings,
// with an intelligent local reasoning engine fallback.

export async function generateDailyPlan(state, customPrompt = "") {
  const apiKey = getApiKey();
  const contextSummary = buildContextSummary(state);

  if (apiKey) {
    try {
      const response = await callGeminiApi(
        apiKey,
        `You are the technical career mentor and personal planner for an ambitious software engineer.
Context on user's current progress:
${contextSummary}

${customPrompt ? `User's specific query / request: "${customPrompt}"` : "Task: Generate a high-impact personalized daily plan with specific time estimates and technical rationale (WHY) for each item. Balance DSA mastery, GSoC open-source milestones, and high-priority project deliverables."}

Respond in clean JSON format with the following structure:
{
  "summary": "Short 1-2 sentence executive assessment of where user stands today",
  "recommendedHours": 5.5,
  "plan": [
    {
      "category": "DSA" | "GSoC" | "AI/ML" | "Project" | "College",
      "title": "Exact task to do",
      "durationMins": 60,
      "why": "Specific technical reason why this is critical today based on deadlines, revision status, or velocity",
      "priority": "High" | "Medium"
    }
  ],
  "focusQuote": "A sharp, inspiring quote on technical discipline and mastery",
  "warningOrAdvice": "A strategic advisory note regarding upcoming deadlines or neglected areas"
}
`
      );

      const parsed = extractJsonFromResponse(response);
      if (parsed && parsed.plan && parsed.plan.length > 0) {
        return parsed;
      }
    } catch (err) {
      console.warn("Gemini API call failed, falling back to local reasoning engine:", err);
    }
  }

  // Fallback to intelligent local reasoning engine
  return generateLocalIntelligentPlan(state, customPrompt);
}

export async function askAiQuestion(state, question) {
  const apiKey = getApiKey();
  const contextSummary = buildContextSummary(state);

  if (apiKey) {
    try {
      const response = await callGeminiApi(
        apiKey,
        `You are Shori AI, an elite technical mentor analyzing the user's career command center.
Current System Context:
${contextSummary}

User question: "${question}"

Provide a crisp, actionable, and analytical response with technical insight. Include bullet points, specific recommendations citing their actual tasks/DSA topics/GSoC milestones, and immediate next actions. Keep markdown clean.`
      );
      return response;
    } catch (err) {
      console.warn("Gemini API call failed, using intelligent local advisor:", err);
    }
  }

  return generateLocalAdvisorResponse(state, question);
}

export async function generateDailyReview(state, checkInData) {
  const apiKey = getApiKey();
  const contextSummary = buildContextSummary(state);

  if (apiKey) {
    try {
      const response = await callGeminiApi(
        apiKey,
        `You are an AI technical mentor reviewing today's check-in for an ambitious developer.
Context:
${contextSummary}

Today's Check-in:
- Accomplished: ${checkInData.accomplished}
- Categories: ${checkInData.categories.join(", ")}
- Time Spent: ${checkInData.hoursSpent} hours
- Still Pending: ${checkInData.pending}
- Tomorrow's Priority: ${checkInData.tomorrowPriority}

Provide a concise, practical critique. Respond with JSON:
{
  "wentWell": "1-2 sentences on what went well",
  "remains": "1-2 sentences on what remains or bottlenecks",
  "nextAction": "Exact immediate action to unblock tomorrow",
  "tomorrowPriority": "Sharpened focus for tomorrow"
}
`
      );

      const parsed = extractJsonFromResponse(response);
      if (parsed && parsed.wentWell) {
        return parsed;
      }
    } catch (err) {
      console.warn("Gemini API call failed for review, using local synthesizer:", err);
    }
  }

  return generateLocalReview(state, checkInData);
}

// Helpers
function getApiKey() {
  const localKey = localStorage.getItem("shori_ai_api_key");
  if (localKey && localKey.trim()) return localKey.trim();
  const envKey = import.meta.env.VITE_AI_API_KEY;
  if (envKey && envKey.trim() && envKey !== "your_api_key_here") return envKey.trim();
  return null;
}

async function callGeminiApi(apiKey, prompt) {
  const preferredModel = localStorage.getItem("shori_ai_model") || "gemini-3.5-flash";
  const fallbackModels = [preferredModel, "gemini-flash-lite-latest", "gemini-3.5-flash", "gemini-3.8-flash"];
  // Deduplicate
  const modelsToTry = [...new Set(fallbackModels)];

  let lastError = null;

  for (const model of modelsToTry) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 1600,
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errMessage = errorData.error?.message || `HTTP ${response.status}`;
        lastError = new Error(errMessage);
        // Try next fallback if 503 or 404
        if (response.status === 503 || response.status === 404) {
          continue;
        }
        throw lastError;
      }

      const data = await response.json();
      const parts = data.candidates?.[0]?.content?.parts || [];
      // Get the text from the non-thought part or concatenate
      const textPart = parts.find((p) => p.text && !p.thought) || parts[0];
      const text = textPart?.text;
      if (!text) throw new Error("Empty response from AI model");
      return text;
    } catch (err) {
      lastError = err;
      // If error is network or retryable, continue to next model
    }
  }

  throw lastError || new Error("Failed to contact Gemini API");
}

function extractJsonFromResponse(text) {
  try {
    const clean = text.replace(/```json/gi, "").replace(/```/g, "").trim();
    return JSON.parse(clean);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch {
        return null;
      }
    }
    return null;
  }
}

function buildContextSummary(state) {
  const { dsa, gsoc, goals, tasks, checkIns } = state;
  const dsaSolved = dsa.problems.filter(p => p.status === "Solved").length;
  const dsaTotal = dsa.problems.length;
  const dsaNeedRevision = dsa.problems.filter(p => p.revisionStatus === "Needs Revision").map(p => p.title);
  
  const gsocCompletedMilestones = gsoc.milestones.filter(m => m.status === "Completed").length;
  const gsocPendingPRs = gsoc.contributions.filter(c => c.status === "Under Review" || c.status === "Open");
  
  const pendingTasks = tasks.filter(t => t.status !== "Completed");
  const recentCheckIn = checkIns[0];

  return `
- User Profile: ${state.profile?.name}, Day Streak: ${state.profile?.streak} days.
- DSA Status: ${dsaSolved}/${dsaTotal} problems solved. Current topic: "${dsa.currentTopic}". Needs revision: [${dsaNeedRevision.join(", ")}].
- GSoC Status: Milestone ${gsocCompletedMilestones}/${gsoc.milestones.length}. Focus org: Apache Arrow. Current milestone: "${gsoc.currentMilestone}". Active PRs: ${gsocPendingPRs.map(p => p.title).join("; ")}.
- Active Goals: ${goals.map(g => `${g.name} (${g.progress}%)`).join(", ")}.
- High Priority Pending Tasks: ${pendingTasks.filter(t => t.priority === "High").map(t => t.title).join("; ")}.
- Last Check-in Accomplishment: "${recentCheckIn ? recentCheckIn.accomplished : "None"}".
- Last Check-in Pending: "${recentCheckIn ? recentCheckIn.pending : "None"}".
`;
}

// Built-in intelligent reasoning engine when no external API key is active
function generateLocalIntelligentPlan(state, customPrompt = "") {
  const { dsa, gsoc, tasks, goals } = state;
  const needsRevision = dsa.problems.filter(p => p.revisionStatus === "Needs Revision");
  const revProblem = needsRevision[0] || dsa.problems[0];
  const pendingTasks = tasks.filter(t => t.status !== "Completed");
  const gsocTask = pendingTasks.find(t => t.category === "GSoC") || {
    title: "Draft Section 4 (Timeline & Contingency) of GSoC Proposal",
    estimatedMins: 75
  };
  const dsaTask = pendingTasks.find(t => t.category === "DSA") || {
    title: `Solve 2 problems on ${dsa.currentTopic}`,
    estimatedMins: 60
  };
  const projectGoal = goals.find(g => g.category === "AI/ML" || g.category === "Projects") || goals[0];

  return {
    summary: `Prioritizing critical GSoC proposal deadlines alongside topological graph algorithms and RAG retrieval accuracy.`,
    recommendedHours: 5.5,
    plan: [
      {
        category: "GSoC",
        title: gsocTask.title,
        durationMins: gsocTask.estimatedMins || 75,
        why: "GSoC proposal submission deadline is in under 10 days. Securing detailed timeline & maintainer feedback now is decisive for acceptance.",
        priority: "High"
      },
      {
        category: "DSA",
        title: dsaTask.title,
        durationMins: dsaTask.estimatedMins || 60,
        why: `Keep high problem-solving momentum on "${dsa.currentTopic}". Solving 2 problems daily cements pattern recognition for technical interviews.`,
        priority: "High"
      },
      {
        category: "DSA",
        title: `Revise: ${revProblem.title} (${revProblem.topic})`,
        durationMins: 30,
        why: `Marked as "${revProblem.revisionStatus}". Re-implementing the core algorithm without hints prevents decay in spatial/temporal complexity retention.`,
        priority: "Medium"
      },
      {
        category: projectGoal.category,
        title: `Progress on ${projectGoal.name}: Key milestone delivery`,
        durationMins: 60,
        why: `Current progress is at ${projectGoal.progress}%. Completing this builds hands-on portfolio depth that sets you apart.`,
        priority: "Medium"
      }
    ],
    focusQuote: "Speed comes from clarity of thought, not rushing. Execute the high-leverage work before the day fragments.",
    warningOrAdvice: "Maintainer sync windows close over the weekend. Push your PR fixes and proposal drafts early to receive feedback before the final rush."
  };
}

function generateLocalAdvisorResponse(state, question) {
  const q = question.toLowerCase();
  const { dsa, gsoc, tasks, goals } = state;

  if (q.includes("focus") || q.includes("today") || q.includes("start")) {
    return `### 🎯 High-Impact Focus for Today

1. **GSoC Proposal Draft (Deep Work Block: 90 mins)**
   - **Why**: You are in the critical proposal drafting phase for **${gsoc.organizations[0]?.name || "Apache Arrow"}**. Reviewers prioritize proposals that have concrete 2-week agile breakdown sprints and verified build steps.
   - **Action**: Finalize the Architecture & Deliverables section.

2. **DSA Core Topic: ${dsa.currentTopic} (60 mins)**
   - **Why**: Maintaining consistency on complex structures ensures interview confidence.
   - **Action**: Solve 2 targeted medium problems.

3. **PR Resolution (30-45 mins)**
   - **Why**: There is an active PR under review. Quick turnaround on reviewer comments signals professional readiness to mentors.`;
  }

  if (q.includes("behind") || q.includes("falling behind") || q.includes("delay")) {
    const revisionCount = dsa.problems.filter(p => p.revisionStatus === "Needs Revision").length;
    return `### ⚠️ Bottleneck & Lag Analysis

Based on your current telemetry:

* **DSA Revision Backlog**: You have **${revisionCount} problems** marked as *Needs Revision* (including *Trapping Rain Water* and *LRU Cache*). Without spaced repetition within 7 days, retention drops by ~60%.
* **GSoC Milestone Velocity**: Milestone **"Submit PR"** and **"Prepare proposal"** are overlapping. The proposal deadline on **April 8** is hard; avoid spending excess hours tweaking secondary code at the expense of your written proposal.
* **Project Pacing**: *${goals[1]?.name}* is at ${goals[1]?.progress}%, slightly behind your target milestone for this month.`;
  }

  if (q.includes("revise") || q.includes("revision") || q.includes("spaced repetition")) {
    const needsRev = dsa.problems.filter(p => p.revisionStatus === "Needs Revision");
    return `### 🔄 Recommended Revision Queue

Here are the highest-value concepts needing immediate re-practice:

1. **${needsRev[0]?.title || "LRU Cache"}** (*${needsRev[0]?.topic || "Linked Lists"}*)
   - *Key takeaway*: Doubly linked list with pseudo head/tail + hash map for O(1) mutations.
2. **${needsRev[1]?.title || "Trapping Rain Water"}** (*${needsRev[1]?.topic || "Stack"}*)
   - *Key takeaway*: Two pointers with \`maxLeft\` and \`maxRight\` vs monotonic stack boundary.
3. **${needsRev[2]?.title || "Coin Change"}** (*${needsRev[2]?.topic || "Dynamic Programming"}*)
   - *Key takeaway*: Unbounded knapsack DP transition \`dp[i] = min(dp[i], dp[i - c] + 1)\`.

*Tip: Spend 20 minutes writing the solution on a blank file with no autocomplete.*`;
  }

  if (q.includes("gsoc") || q.includes("open source") || q.includes("time on gsoc")) {
    const prCount = gsoc.contributions.length;
    return `### 🚀 GSoC Health Check & Time Allocation

* **Contributions**: **${prCount} logged contributions** (${gsoc.contributions.filter(c => c.status === "Merged").length} merged). That gives you strong credibility with mentors!
* **Target Org**: **${gsoc.organizations[0]?.name}** (${gsoc.organizations[0]?.matchPercentage}% match).
* **Are you spending enough time?**:
  - Right now, you are logging ~8-10 hours/week on GSoC.
  - **Recommendation**: For the next 10 days leading to the proposal deadline, **increase GSoC time to 15 hours/week** (divert 1 hour daily from secondary side projects). A rock-solid proposal is what converts your contributions into an accepted slot!`;
  }

  if (q.includes("7 days") || q.includes("plan my next") || q.includes("week")) {
    return `### 📅 7-Day High-Leverage Strategic Plan

* **Days 1-2 (GSoC Proposal Sprint)**:
  - Complete draft of background, benchmarks, and weekly milestones.
  - Send preliminary draft link to Apache Arrow mentors for feedback.
* **Days 3-4 (DSA Breadth & PR Polish)**:
  - Solve 4 Graph problems (Dijkstra, Bellman-Ford, Kruskal's MST).
  - Address all clang-tidy and CI checks on Arrow PR #41829.
* **Days 5-6 (Project Delivery - RAG & OrthoTwin)**:
  - Complete RRF re-ranking module in RAG pipeline.
  - Integrate VTK volume rendering shader optimization.
* **Day 7 (Weekly Review & Final Polish)**:
  - Full revision of all 4 flagged DSA problems.
  - Incorporate mentor feedback into final GSoC proposal PDF.`;
  }

  // General response
  return `### 💡 Strategic Guidance

Looking at your active workspace:
- **DSA solved**: ${dsa.problems.filter(p => p.status === "Solved").length} problems.
- **Top priority pending**: "${tasks.find(t => t.priority === "High" && t.status !== "Completed")?.title || "Complete core milestones"}".
- **Primary recommendation**: Guard your 90-minute morning deep work block for GSoC proposal writing and SIMD benchmarks. Leave DSA revision and secondary tasks for the afternoon.`;
}

function generateLocalReview(state, checkInData) {
  const hours = parseFloat(checkInData.hoursSpent) || 0;
  const cats = checkInData.categories || [];

  let wentWell = `Strong focus today logging ${hours} productive hours across ${cats.join(" & ") || "core areas"}.`;
  if (cats.includes("DSA") && cats.includes("GSoC")) {
    wentWell += " You maintained simultaneous progress across algorithmic problem solving and open-source contributions.";
  }

  let remains = checkInData.pending 
    ? `Pending bottleneck: "${checkInData.pending}". Keep this scoped to avoid spillover.`
    : "No major blockers flagged.";

  let nextAction = "Schedule a 45-minute focused block first thing tomorrow to tackle the highest friction item.";
  if (cats.includes("GSoC")) {
    nextAction = "Verify if maintainers have left comments on your open pull request or issue threads.";
  }

  let tomorrowPriority = checkInData.tomorrowPriority || "Execute on high-priority task backlog.";

  return {
    wentWell,
    remains,
    nextAction,
    tomorrowPriority
  };
}
