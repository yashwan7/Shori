// Realistic initial data for Shori Command Center
export const initialData = {
  profile: {
    name: "Yashwanth",
    title: "Software Engineer & Open Source Contributor",
    target: "GSoC 2027 / Tier-1 Tech",
    streak: 19,
    streakLastUpdated: "2025-03-29",
    weeklyGoalHours: 35,
    weeklyCurrentHours: 24.5,
  },

  dsa: {
    targetProblems: 250,
    currentTopic: "Graphs & Disjoint Set Union",
    topics: [
      "Arrays",
      "Strings",
      "Linked Lists",
      "Stack",
      "Queue",
      "Hashing",
      "Trees",
      "Graphs",
      "Recursion",
      "Dynamic Programming",
      "Greedy",
      "Binary Search",
      "Sorting"
    ],
    problems: [
      {
        id: "dsa-1",
        title: "Two Sum",
        topic: "Arrays",
        difficulty: "Easy",
        status: "Solved",
        revisionStatus: "Solid",
        lastPracticed: "2025-03-25",
        notes: "Hash map lookup in O(N) time and O(N) space. Watch for duplicate values.",
        link: "https://leetcode.com/problems/two-sum/",
        timeSpentMins: 15
      },
      {
        id: "dsa-2",
        title: "Longest Substring Without Repeating Characters",
        topic: "Strings",
        difficulty: "Medium",
        status: "Solved",
        revisionStatus: "Revised",
        lastPracticed: "2025-03-27",
        notes: "Sliding window with character index hash table. Left pointer moves to max(left, last_idx + 1).",
        link: "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
        timeSpentMins: 30
      },
      {
        id: "dsa-3",
        title: "LRU Cache",
        topic: "Linked Lists",
        difficulty: "Medium",
        status: "Solved",
        revisionStatus: "Needs Revision",
        lastPracticed: "2025-03-21",
        notes: "Doubly linked list combined with hash map for O(1) get and put. Re-implement dummy head/tail logic.",
        link: "https://leetcode.com/problems/lru-cache/",
        timeSpentMins: 45
      },
      {
        id: "dsa-4",
        title: "Trapping Rain Water",
        topic: "Stack",
        difficulty: "Hard",
        status: "Solved",
        revisionStatus: "Needs Revision",
        lastPracticed: "2025-03-18",
        notes: "Two-pointer approach vs Monotonic Stack. Practice two-pointer maxL / maxR boundaries.",
        link: "https://leetcode.com/problems/trapping-rain-water/",
        timeSpentMins: 55
      },
      {
        id: "dsa-5",
        title: "Course Schedule II (Topological Sort)",
        topic: "Graphs",
        difficulty: "Medium",
        status: "Solved",
        revisionStatus: "Solid",
        lastPracticed: "2025-03-28",
        notes: "Kahn's algorithm using in-degree array and BFS queue. Detects cycles if result length != numCourses.",
        link: "https://leetcode.com/problems/course-schedule-ii/",
        timeSpentMins: 35
      },
      {
        id: "dsa-6",
        title: "Number of Islands",
        topic: "Graphs",
        difficulty: "Medium",
        status: "Solved",
        revisionStatus: "Solid",
        lastPracticed: "2025-03-24",
        notes: "Standard DFS or BFS flood fill. Mark visited in-place with '0'.",
        link: "https://leetcode.com/problems/number-of-islands/",
        timeSpentMins: 20
      },
      {
        id: "dsa-7",
        title: "Coin Change",
        topic: "Dynamic Programming",
        difficulty: "Medium",
        status: "Solved",
        revisionStatus: "Needs Revision",
        lastPracticed: "2025-03-15",
        notes: "Unbounded knapsack style DP. dp[i] = min(dp[i], dp[i - coin] + 1). Initialize with infinity.",
        link: "https://leetcode.com/problems/coin-change/",
        timeSpentMins: 40
      },
      {
        id: "dsa-8",
        title: "Median of Two Sorted Arrays",
        topic: "Binary Search",
        difficulty: "Hard",
        status: "Attempted",
        revisionStatus: "Needs Revision",
        lastPracticed: "2025-03-26",
        notes: "Binary search on partition point of smaller array in O(log(min(m, n))). Re-evaluate edge conditions.",
        link: "https://leetcode.com/problems/median-of-two-sorted-arrays/",
        timeSpentMins: 60
      },
      {
        id: "dsa-9",
        title: "Binary Tree Maximum Path Sum",
        topic: "Trees",
        difficulty: "Hard",
        status: "Pending",
        revisionStatus: "Needs Revision",
        lastPracticed: "",
        notes: "Post-order traversal computing max gain from subtrees, updating global max with left + right + node.val.",
        link: "https://leetcode.com/problems/binary-tree-maximum-path-sum/",
        timeSpentMins: 0
      },
      {
        id: "dsa-10",
        title: "Find Minimum in Rotated Sorted Array",
        topic: "Binary Search",
        difficulty: "Medium",
        status: "Solved",
        revisionStatus: "Solid",
        lastPracticed: "2025-03-27",
        notes: "If nums[mid] > nums[right], pivot is on the right half. Else move right to mid.",
        link: "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/",
        timeSpentMins: 25
      },
      {
        id: "dsa-11",
        title: "Word Break",
        topic: "Dynamic Programming",
        difficulty: "Medium",
        status: "Solved",
        revisionStatus: "Revised",
        lastPracticed: "2025-03-22",
        notes: "dp[i] is true if any prefix dp[j] is true and s[j:i] in wordDict. Trie optimization available.",
        link: "https://leetcode.com/problems/word-break/",
        timeSpentMins: 35
      },
      {
        id: "dsa-12",
        title: "Kth Largest Element in an Array",
        topic: "Queue",
        difficulty: "Medium",
        status: "Solved",
        revisionStatus: "Solid",
        lastPracticed: "2025-03-20",
        notes: "Min-heap of size K or QuickSelect in O(N) average time.",
        link: "https://leetcode.com/problems/kth-largest-element-in-an-array/",
        timeSpentMins: 25
      }
    ]
  },

  gsoc: {
    targetYear: 2027,
    currentMilestone: "Orgs Shortlisting & Codebase Deep Dive (GSoC 2027 Prep)",
    milestones: [
      { id: "m-1", title: "Research repeating organizations", status: "Completed", date: "2026-08-15", desc: "Shortlisted Apache, CNCF, KDE, pgvector & OpenCV" },
      { id: "m-2", title: "Setup development environment", status: "Completed", date: "2026-09-01", desc: "Configured compilers, CMake, Docker & local build chains" },
      { id: "m-3", title: "Study targeted codebases", status: "In Progress", date: "2026-10-15", desc: "Navigating repository architecture, issue trackers & testing suites" },
      { id: "m-4", title: "First Good-First-Issue PR", status: "In Progress", date: "2026-11-20", desc: "Fix documentation, small bug fixes and missing test assertions" },
      { id: "m-5", title: "Engage with community & maintainers", status: "Not Started", date: "2026-12-15", desc: "Join Slack/Discord/Mailing lists and participate in developer discussions" },
      { id: "m-6", title: "Tackle core feature / RFC", status: "Not Started", date: "2027-01-20", desc: "Propose and implement substantial pull requests demonstrating technical mastery" },
      { id: "m-7", title: "Align with announced GSoC 2027 project ideas", status: "Not Started", date: "2027-02-28", desc: "Review official ideas list as soon as Google announces organizations" },
      { id: "m-8", title: "Draft comprehensive proposal", status: "Not Started", date: "2027-03-25", desc: "Detailed architectural roadmap, deliverable milestones, timeline & contingency plans" },
      { id: "m-9", title: "Submit GSoC 2027 Proposal", status: "Not Started", date: "2027-04-06", desc: "Final submission on the official Google Summer of Code portal before deadline" }
    ],
    organizations: [
      {
        id: "org-1",
        name: "Apache Arrow",
        techStack: ["C++", "SIMD", "CMake", "Python"],
        repoUrl: "https://github.com/apache/arrow",
        projectIdea: "SIMD Acceleration for In-Memory Compute Kernels",
        matchPercentage: 94,
        status: "Primary Focus",
        notes: "High impact project with active community and consistent GSoC participation."
      },
      {
        id: "org-2",
        name: "PostgreSQL / pgvector",
        techStack: ["C", "PostgreSQL Internals", "HNSW", "IVFFlat"],
        repoUrl: "https://github.com/pgvector/pgvector",
        projectIdea: "Parallel HNSW Graph Construction Optimizations",
        matchPercentage: 86,
        status: "Secondary Focus",
        notes: "High interest in vector search index performance. Explored codebase indexing routines."
      },
      {
        id: "org-3",
        name: "OpenCV",
        techStack: ["C++", "Computer Vision", "CUDA"],
        repoUrl: "https://github.com/opencv/opencv",
        projectIdea: "Modernized Point Cloud & 3D Feature Matching",
        matchPercentage: 78,
        status: "Explored",
        notes: "Solid recurring GSoC org; maintainer guidelines require early pull requests."
      }
    ],
    contributions: [
      {
        id: "c-1",
        type: "PR",
        title: "ARROW-18920: [C++] Vectorize ascii string lower/upper kernels with AVX2",
        org: "Apache Arrow",
        url: "https://github.com/apache/arrow/pull/41829",
        status: "Under Review",
        date: "2026-09-24",
        notes: "Benchmarked 3.4x speedup on 10MB columnar string arrays. Passing all CI except MacOS ARM64."
      },
      {
        id: "c-2",
        type: "Issue",
        title: "ARROW-18915: [C++] Memory alignment crash in ChunkedArray concatenate",
        org: "Apache Arrow",
        url: "https://github.com/apache/arrow/issues/41815",
        status: "Merged",
        date: "2026-09-14",
        notes: "Triaged with Valgrind reproducer and accepted by core team."
      },
      {
        id: "c-3",
        type: "PR",
        title: "PGV-340: Improve memory release in iterative HNSW pruning",
        org: "PostgreSQL / pgvector",
        url: "https://github.com/pgvector/pgvector/pull/340",
        status: "Merged",
        date: "2026-09-10",
        notes: "Merged by Andrew Kane. Built good goodwill with core maintainer."
      }
    ],
    deadlines: [
      { id: "d-1", title: "Organizations Announced", date: "2027-02-25", passed: false },
      { id: "d-2", title: "Contributor Applications Open", date: "2027-03-16", passed: false },
      { id: "d-3", title: "Proposal Submission Deadline", date: "2027-04-06", passed: false, critical: true },
      { id: "d-4", title: "Accepted Projects Announced", date: "2027-05-04", passed: false },
      { id: "d-5", title: "Community Bonding Period", date: "2027-05-05 to 2027-05-30", passed: false },
      { id: "d-6", title: "Coding Period Starts", date: "2027-05-31", passed: false }
    ],
    learningRequirements: [
      { id: "lr-1", text: "Master Google Benchmark & perf CPU profiling", done: true },
      { id: "lr-2", text: "AVX-512 and ARM NEON intrinsics abstraction", done: false },
      { id: "lr-3", text: "Apache Arrow MemoryPool buffer management", done: true },
      { id: "lr-4", text: "Writing bulletproof CMake integration tests", done: true }
    ]
  },

  goals: [
    {
      id: "goal-1",
      name: "Master RAG & Production Agent Architecture",
      description: "Build end-to-end multi-agent retrieval system with hybrid search, re-ranking, and evals.",
      category: "AI/ML",
      targetDate: "2025-04-30",
      progress: 68,
      notes: "Focus on LangGraph state machines, BM25 + dense vector hybrid search, and RAGAS evaluation metrics.",
      milestones: [
        { title: "Implement dense retriever with chunking strategies", completed: true },
        { title: "Add BM25 lexical retriever & reciprocal rank fusion", completed: true },
        { title: "Integrate Cross-Encoder re-ranker (Cohere / BGE)", completed: true },
        { title: "Build automated evaluation pipeline with RAGAS", completed: false },
        { title: "Deploy streaming production API on AWS/GCP", completed: false }
      ]
    },
    {
      id: "goal-2",
      name: "Build OrthoTwin (Clinical 3D Engine)",
      description: "Full-stack medical imaging viewer for orthognathic surgical planning and 3D mesh rendering.",
      category: "Projects",
      targetDate: "2025-05-15",
      progress: 52,
      notes: "Utilizing WebGPU, Three.js, and DICOM volume rendering via VTK.js.",
      milestones: [
        { title: "Parse DICOM slices & generate 3D volumetric surface", completed: true },
        { title: "Interactive measurement tools (angles, distance)", completed: true },
        { title: "WebGPU accelerated bone segmentation shader", completed: false },
        { title: "Comparative pre/post-op alignment view", completed: false }
      ]
    },
    {
      id: "goal-3",
      name: "Deepen Computer Vision & 3D Gaussian Splatting",
      description: "Understand mathematical foundations of radiance fields, NeRFs, and real-time Gaussian rasterization.",
      category: "Skills",
      targetDate: "2025-06-01",
      progress: 35,
      notes: "Reading original 3DGS paper by Kerbl et al., implementing differentiable CUDA rasterizer.",
      milestones: [
        { title: "Understand camera intrinsics, PnP and COLMAP SfM", completed: true },
        { title: "Implement basic NeRF with positional encoding in PyTorch", completed: true },
        { title: "Train and render custom 3D Gaussian scene", completed: false },
        { title: "Optimize forward pass with custom CUDA kernels", completed: false }
      ]
    },
    {
      id: "goal-4",
      name: "Final Year Capstone Project",
      description: "College major project defense, documentation, IEEE paper submission, and hardware demos.",
      category: "College",
      targetDate: "2025-05-08",
      progress: 82,
      notes: "Thesis draft completed. Need to finalize IEEE conference paper review comments.",
      milestones: [
        { title: "Literature review & system design approval", completed: true },
        { title: "System implementation & experimental evaluation", completed: true },
        { title: "IEEE manuscript submission", completed: true },
        { title: "Final PPT presentation & viva preparation", completed: false }
      ]
    }
  ],

  tasks: [
    {
      id: "task-1",
      title: "Solve 2 Binary Search & Disjoint Set Union questions",
      description: "Target LC 410 (Split Array Largest Sum) and LC 684 (Redundant Connection). Focus on edge cases.",
      category: "DSA",
      priority: "High",
      dueDate: "2025-03-30",
      estimatedMins: 75,
      status: "Todo",
      goalId: "dsa",
      notes: "Maintain time complexity notes."
    },
    {
      id: "task-2",
      title: "Address review feedback on Arrow PR #41829",
      description: "Fix clang-tidy warnings and check AVX2 alignment on 32-byte boundaries.",
      category: "GSoC",
      priority: "High",
      dueDate: "2025-03-30",
      estimatedMins: 90,
      status: "In Progress",
      goalId: "gsoc",
      notes: "Run `ctest -R arrow-compute-test` locally."
    },
    {
      id: "task-3",
      title: "Draft Section 4 (Timeline & Contingency) of GSoC Proposal",
      description: "Break the 12-week coding phase into 2-week agile sprints with concrete deliverables.",
      category: "GSoC",
      priority: "High",
      dueDate: "2025-03-31",
      estimatedMins: 60,
      status: "Todo",
      goalId: "gsoc",
      notes: "Share link on community Google Doc for mentor feedback."
    },
    {
      id: "task-4",
      title: "Implement reciprocal rank fusion (RRF) in RAG pipeline",
      description: "Combine semantic vector ranking with BM25 keyword rankings using k=60 hyperparameter.",
      category: "AI/ML",
      priority: "Medium",
      dueDate: "2025-04-01",
      estimatedMins: 45,
      status: "Todo",
      goalId: "goal-1",
      notes: "Test with ambiguous acronyms."
    },
    {
      id: "task-5",
      title: "Revise Course Schedule II & LRU Cache implementation",
      description: "Re-code both from scratch within 25 minutes without hints.",
      category: "DSA",
      priority: "Medium",
      dueDate: "2025-03-31",
      estimatedMins: 40,
      status: "Todo",
      goalId: "dsa",
      notes: "Solidify topological sorting intuition."
    },
    {
      id: "task-6",
      title: "Optimize DICOM volume bounding box intersection in OrthoTwin",
      description: "Reduce rendering overhead by clipping empty air voxels before ray marching.",
      category: "Project",
      priority: "Low",
      dueDate: "2025-04-03",
      estimatedMins: 50,
      status: "Todo",
      goalId: "goal-2",
      notes: "Benchmark FPS increase."
    },
    {
      id: "task-7",
      title: "Prepare slide deck for College Major Project Review #3",
      description: "Include system architecture, confusion matrix, and latency comparison graphs.",
      category: "College",
      priority: "Medium",
      dueDate: "2025-04-02",
      estimatedMins: 60,
      status: "Completed",
      goalId: "goal-4",
      notes: "Faculty approved the experimental results."
    }
  ],

  checkIns: [
    {
      id: "chk-1",
      date: "2025-03-29",
      categories: ["DSA", "GSoC"],
      hoursSpent: 5.5,
      accomplished: "Completed Course Schedule II on LC. Profiler showed 2.8x speedup on Arrow vector kernel.",
      pending: "Need to finish proposal timeline and review hard DP questions.",
      tomorrowPriority: "Address PR comments on Arrow and write 2 sections of GSoC proposal.",
      aiReview: {
        wentWell: "Strong dual progress on Graph topology algorithms and high-impact SIMD profiling.",
        remains: "GSoC proposal deadline is in 10 days; proposal writing requires focused blocks.",
        nextAction: "Allocate first 90 minutes of morning exclusively to GSoC proposal draft.",
        tomorrowPriority: "Arrow PR resolution + GSoC Proposal Sprint."
      }
    },
    {
      id: "chk-2",
      date: "2025-03-28",
      categories: ["AI/ML", "DSA"],
      hoursSpent: 4.0,
      accomplished: "Built LangGraph cyclic state machine for multi-step query expansion. Practiced sliding window.",
      pending: "OrthoTwin raymarching shader still has artifacting on thin bone walls.",
      tomorrowPriority: "Push GSoC PR commit and solve 2 medium graph problems.",
      aiReview: {
        wentWell: "Great execution on advanced RAG state handling and consistent daily problem solving.",
        remains: "GSoC maintainer engagement was inactive today.",
        nextAction: "Ping Apache Arrow mentor on dev mailing list regarding SIMD edge tests.",
        tomorrowPriority: "GSoC Maintainer follow-up + Graph DFS/BFS."
      }
    }
  ],

  weeklyProductivity: [
    { day: "Mon", hours: 4.5, tasksCompleted: 3, dsaSolved: 2 },
    { day: "Tue", hours: 5.0, tasksCompleted: 4, dsaSolved: 3 },
    { day: "Wed", hours: 6.2, tasksCompleted: 5, dsaSolved: 2 },
    { day: "Thu", hours: 4.8, tasksCompleted: 3, dsaSolved: 1 },
    { day: "Fri", hours: 5.5, tasksCompleted: 4, dsaSolved: 2 },
    { day: "Sat", hours: 6.0, tasksCompleted: 5, dsaSolved: 3 },
    { day: "Sun", hours: 3.5, tasksCompleted: 2, dsaSolved: 1 }
  ]
};
