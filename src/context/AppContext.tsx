import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Goal,
  Milestone,
  Task,
  TaskCompletion,
  FocusSession,
  StreakData,
  RewardState,
  NotificationItem,
  UserSettings,
  DailyQuestionEntry,
  WeeklyReviewReport,
  ProductivityScoreBreakdown,
} from '../types/index.ts';
import { playCompletionSound, playFocusBellSound } from '../utils/audio.ts';

const STORAGE_KEY = 'consistency_assistant_state_v1';

const INITIAL_SETTINGS: UserSettings = {
  name: 'Victor',
  email: 'adebiyivic26@gmail.com',
  timezone: 'America/Los_Angeles',
  preferredProductivityTime: 'Evening',
  dayEndTime: '23:00',
  weekEndDay: 'Sunday',
  accountabilityPreference: 'AI Coach',
  enableNotifications: true,
  reminderFrequency: 'normal',
  quietHoursEnabled: false,
  quietHoursStart: '22:00',
  quietHoursEnd: '07:00',
  dailyQuestionEnabled: true,
  dailyQuestionTime: '19:00',
  motivationalMessagesEnabled: true,
  distractionBlockingEnabled: true,
  distractionTrigger: 'high_priority_remaining',
  blockedWebsites: ['youtube.com', 'tiktok.com', 'instagram.com', 'x.com', 'reddit.com', 'netflix.com'],
  soundEnabled: true,
  darkMode: true,
  reducedMotion: false,
};

const getTodayString = () => new Date().toISOString().split('T')[0];

const INITIAL_GOALS: Goal[] = [
  {
    id: 'goal-1',
    title: 'Become a Frontend Developer',
    description: 'Master modern frontend engineering, React ecosystem, and build high-quality portfolio projects.',
    reason: 'I want to become a frontend developer so I can secure a high-impact remote job, build software people love, and support my family.',
    category: 'Career',
    deadlineType: 'specific_date',
    deadlineDate: '2026-12-31',
    commitmentLevel: 'Very Serious',
    health: 'on_track',
    healthReason: 'Consistently hitting 85%+ weekly tasks and progressing through milestone 3.',
    score: 84,
    status: 'active',
    createdAt: '2026-09-01T00:00:00.000Z',
    milestones: [
      {
        id: 'm-1',
        goalId: 'goal-1',
        title: 'HTML & Modern CSS Fundamentals',
        description: 'Semantic markup, Flexbox, Grid, CSS animations, and accessibility.',
        order: 1,
        status: 'completed',
      },
      {
        id: 'm-2',
        goalId: 'goal-1',
        title: 'JavaScript Deep Dive & Asynchronous Programming',
        description: 'Closures, Promises, Event Loop, DOM APIs, and ES6+ features.',
        order: 2,
        status: 'completed',
      },
      {
        id: 'm-3',
        goalId: 'goal-1',
        title: 'React 19 & Component Architecture',
        description: 'Hooks, Suspense, Server Components principles, and state management.',
        order: 3,
        status: 'in_progress',
      },
      {
        id: 'm-4',
        goalId: 'goal-1',
        title: 'TypeScript & Next.js/Vite Tooling',
        description: 'Static type safety, module federation, and build optimizations.',
        order: 4,
        status: 'pending',
      },
      {
        id: 'm-5',
        goalId: 'goal-1',
        title: '3 Production Portfolio Projects',
        description: 'Full-featured web applications deployed with live URLs and GitHub source.',
        order: 5,
        status: 'pending',
      },
      {
        id: 'm-6',
        goalId: 'goal-1',
        title: 'Interview Preparation & Opportunities Outreach',
        description: 'Technical interview practice, resume polish, and applications.',
        order: 6,
        status: 'pending',
      },
    ],
  },
  {
    id: 'goal-2',
    title: 'Exercise & Physical Stamina Routine',
    description: 'Build sustainable endurance, cardiovascular health, and core strength.',
    reason: 'To maintain high physical energy, focus clearly during coding sessions, and live a vibrant, healthy life.',
    category: 'Health & Fitness',
    deadlineType: 'monthly',
    commitmentLevel: 'Serious',
    health: 'needs_attention',
    healthReason: 'Missed 2 workout sessions earlier in the week due to work deadlines.',
    score: 64,
    status: 'active',
    createdAt: '2026-09-10T00:00:00.000Z',
    milestones: [
      {
        id: 'm-201',
        goalId: 'goal-2',
        title: 'Establish 4x weekly training consistency',
        description: 'At least 30 minutes of intentional cardio or strength.',
        order: 1,
        status: 'in_progress',
      },
      {
        id: 'm-202',
        goalId: 'goal-2',
        title: 'Reach 5km continuous running benchmark',
        description: 'Maintain steady pace under 28 minutes.',
        order: 2,
        status: 'pending',
      },
    ],
  },
];

const INITIAL_TASKS: Task[] = [
  {
    id: 'task-1',
    goalId: 'goal-1',
    goalTitle: 'Become a Frontend Developer',
    milestoneId: 'm-3',
    title: 'Build navbar & interactive mobile drawer component',
    description: 'Create responsive navigation with smooth transitions and keyboard focus trapping.',
    priority: 'High',
    duration: 45,
    dueDate: getTodayString(),
    dueTime: '20:00',
    recurrence: 'none',
    difficulty: 'Medium',
    category: 'Career',
    reminder: true,
    rewardPoints: 20,
    status: 'pending',
    createdAt: '2026-10-01T10:00:00.000Z',
  },
  {
    id: 'task-2',
    goalId: 'goal-1',
    goalTitle: 'Become a Frontend Developer',
    milestoneId: 'm-3',
    title: 'Read React 19 Actions & useOptimistic documentation',
    description: 'Understand the new async state transition paradigm.',
    priority: 'Medium',
    duration: 25,
    dueDate: getTodayString(),
    dueTime: '18:00',
    recurrence: 'none',
    difficulty: 'Easy',
    category: 'Career',
    reminder: false,
    rewardPoints: 10,
    status: 'completed',
    completedAt: '2026-10-04T09:15:00.000Z',
    createdAt: '2026-10-01T10:00:00.000Z',
  },
  {
    id: 'task-3',
    goalId: 'goal-1',
    goalTitle: 'Become a Frontend Developer',
    milestoneId: 'm-3',
    title: 'Practice CSS Grid auto-fit and auto-fill layouts',
    description: 'Build 3 responsive dashboard card variants without media queries.',
    priority: 'Medium',
    duration: 30,
    dueDate: getTodayString(),
    dueTime: '17:00',
    recurrence: 'none',
    difficulty: 'Medium',
    category: 'Career',
    reminder: false,
    rewardPoints: 10,
    status: 'completed',
    completedAt: '2026-10-04T10:30:00.000Z',
    createdAt: '2026-10-01T10:00:00.000Z',
  },
  {
    id: 'task-4',
    goalId: 'goal-2',
    goalTitle: 'Exercise & Physical Stamina Routine',
    milestoneId: 'm-201',
    title: '30-minute high-intensity cardio & core workout',
    description: 'Interval running + 10 minute core circuit at the gym or park.',
    priority: 'High',
    duration: 30,
    dueDate: getTodayString(),
    dueTime: '21:30',
    recurrence: 'daily',
    difficulty: 'Medium',
    category: 'Health & Fitness',
    reminder: true,
    rewardPoints: 20,
    status: 'pending',
    createdAt: '2026-10-01T10:00:00.000Z',
  },
  {
    id: 'task-5',
    goalId: 'goal-1',
    goalTitle: 'Become a Frontend Developer',
    milestoneId: 'm-3',
    title: 'Study JavaScript event delegation & propagation',
    description: 'Quick 20-minute recap of capture vs bubble phases.',
    priority: 'Low',
    duration: 20,
    dueDate: getTodayString(),
    dueTime: '16:00',
    recurrence: 'none',
    difficulty: 'Easy',
    category: 'Career',
    reminder: false,
    rewardPoints: 10,
    status: 'completed',
    completedAt: '2026-10-04T11:45:00.000Z',
    createdAt: '2026-10-01T10:00:00.000Z',
  },
  {
    id: 'task-6',
    title: 'Review weekly budget and expenses',
    description: 'Track spending against monthly targets in spreadsheet.',
    priority: 'Low',
    duration: 15,
    dueDate: getTodayString(),
    dueTime: '22:00',
    recurrence: 'weekly',
    difficulty: 'Easy',
    category: 'Finance',
    reminder: false,
    rewardPoints: 10,
    status: 'pending',
    createdAt: '2026-10-01T10:00:00.000Z',
  },
];

const INITIAL_STREAK: StreakData = {
  currentDailyStreak: 8,
  longestDailyStreak: 14,
  weeklyStreak: 3,
  lastActiveDate: getTodayString(),
  missedYesterday: false,
};

const LEVELS = [
  { name: 'Beginner', minXp: 0, maxXp: 149 },
  { name: 'Starter', minXp: 150, maxXp: 349 },
  { name: 'Consistent', minXp: 350, maxXp: 699 },
  { name: 'Focused', minXp: 700, maxXp: 1199 },
  { name: 'Disciplined', minXp: 1200, maxXp: 1899 },
  { name: 'High Performer', minXp: 1900, maxXp: 2799 },
  { name: 'Goal Crusher', minXp: 2800, maxXp: 99999 },
];

function calculateRewardState(totalXp: number, existingAchievements?: any[]): RewardState {
  let levelIndex = 0;
  for (let i = 0; i < LEVELS.length; i++) {
    if (totalXp >= LEVELS[i].minXp) {
      levelIndex = i;
    }
  }

  const currentLevel = LEVELS[levelIndex];
  const nextLevel = LEVELS[Math.min(levelIndex + 1, LEVELS.length - 1)];

  const achievements = existingAchievements || [
    {
      id: 'ach-1',
      title: 'First Step Taken',
      description: 'Completed your very first task on Consistency Assistant.',
      icon: '🎯',
      unlockedAt: '2026-09-02T10:00:00.000Z',
      progress: 100,
    },
    {
      id: 'ach-2',
      title: '7-Day Streak Master',
      description: 'Followed through for 7 consecutive days without skipping.',
      icon: '🔥',
      unlockedAt: '2026-10-03T18:00:00.000Z',
      progress: 100,
    },
    {
      id: 'ach-3',
      title: 'Deep Focus Pioneer',
      description: 'Completed a 45+ minute uninterrupted focus session.',
      icon: '⚡',
      unlockedAt: '2026-10-02T16:00:00.000Z',
      progress: 100,
    },
    {
      id: 'ach-4',
      title: 'Milestone Finisher',
      description: 'Completed a full goal milestone roadmap step.',
      icon: '🏆',
      unlockedAt: '2026-09-20T14:00:00.000Z',
      progress: 100,
    },
    {
      id: 'ach-5',
      title: 'Century Club (100 Tasks)',
      description: 'Complete 100 verified tasks.',
      icon: '💎',
      progress: 38,
    },
  ];

  return {
    totalXp,
    level: currentLevel.name,
    levelIndex: levelIndex + 1,
    currentLevelXp: totalXp - currentLevel.minXp,
    nextLevelXp: nextLevel.minXp - currentLevel.minXp,
    achievements,
  };
}

interface AppContextType {
  settings: UserSettings;
  updateSettings: (newSettings: Partial<UserSettings>) => void;
  goals: Goal[];
  addGoal: (goal: Omit<Goal, 'id' | 'createdAt' | 'score' | 'health' | 'healthReason' | 'milestones'>, customMilestones?: Milestone[]) => Goal;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  addMilestone: (goalId: string, milestone: Omit<Milestone, 'id' | 'goalId'>) => void;
  updateMilestone: (goalId: string, milestoneId: string, updates: Partial<Milestone>) => void;
  deleteMilestone: (goalId: string, milestoneId: string) => void;

  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'status'>) => Task;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  completeTask: (id: string) => void;
  uncompleteTask: (id: string) => void;

  completions: TaskCompletion[];
  focusSessions: FocusSession[];
  logFocusSession: (session: Omit<FocusSession, 'id'>) => void;

  streak: StreakData;
  restartStreakToday: () => void;
  rewards: RewardState;

  notifications: NotificationItem[];
  markNotificationAsRead: (id: string) => void;
  addNotification: (item: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => void;
  clearNotifications: () => void;

  dailyQuestions: DailyQuestionEntry[];
  submitDailyQuestion: (response: 'yes' | 'not_yet' | 'no', details?: string) => Promise<string>;

  weeklyReviews: WeeklyReviewReport[];
  generateWeeklyReview: () => Promise<WeeklyReviewReport>;

  productivityScores: ProductivityScoreBreakdown;
  activeFocusTask: Task | null;
  setActiveFocusTask: (task: Task | null) => void;
  focusModeActive: boolean;
  setFocusModeActive: (active: boolean) => void;

  // Interstitial distraction trigger simulation
  distractionInterventionTask: Task | null;
  dismissDistractionIntervention: () => void;
  checkDistractionTrigger: (domain: string) => boolean;

  // Onboarding & navigation
  hasCompletedOnboarding: boolean;
  completeOnboarding: (data: {
    name: string;
    goalTitle: string;
    reason: string;
    category: any;
    deadlineType: any;
    commitmentLevel: any;
    preferredTime: any;
    accountabilityPreference: any;
    milestones?: any[];
  }) => void;
  resetAllData: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  showLandingPage: boolean;
  setShowLandingPage: (show: boolean) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<UserSettings>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          return { ...INITIAL_SETTINGS, ...JSON.parse(saved).settings };
        } catch (e) { }
      }
    }
    return INITIAL_SETTINGS;
  });

  const [goals, setGoals] = useState<Goal[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          return JSON.parse(saved).goals || INITIAL_GOALS;
        } catch (e) { }
      }
    }
    return INITIAL_GOALS;
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          return JSON.parse(saved).tasks || INITIAL_TASKS;
        } catch (e) { }
      }
    }
    return INITIAL_TASKS;
  });

  const [completions, setCompletions] = useState<TaskCompletion[]>([]);
  const [focusSessions, setFocusSessions] = useState<FocusSession[]>([]);
  const [streak, setStreak] = useState<StreakData>(INITIAL_STREAK);
  const [totalXp, setTotalXp] = useState<number>(780);
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      title: '🔥 8-Day Streak Active!',
      message: 'You have completed key tasks for 8 days in a row. Keep the momentum alive today.',
      type: 'streak',
      timestamp: new Date().toISOString(),
      read: false,
    },
    {
      id: 'notif-2',
      title: '⏰ High Priority Task Scheduled',
      message: '"Build navbar component" is due at 8:00 PM.',
      type: 'task',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      read: false,
    },
  ]);
  const [dailyQuestions, setDailyQuestions] = useState<DailyQuestionEntry[]>([]);
  const [weeklyReviews, setWeeklyReviews] = useState<WeeklyReviewReport[]>([]);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [showLandingPage, setShowLandingPage] = useState<boolean>(false);

  // Focus mode
  const [activeFocusTask, setActiveFocusTask] = useState<Task | null>(null);
  const [focusModeActive, setFocusModeActive] = useState<boolean>(false);
  const [distractionInterventionTask, setDistractionInterventionTask] = useState<Task | null>(null);

  // Sync state to LocalStorage and Server
  useEffect(() => {
    const bundle = {
      settings,
      goals,
      tasks,
      completions,
      focusSessions,
      streak,
      totalXp,
      hasCompletedOnboarding,
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bundle));
      // Asynchronously sync to backend persistence endpoint
      fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bundle),
      }).catch(() => { });
    } catch (e) { }
  }, [settings, goals, tasks, completions, focusSessions, streak, totalXp, hasCompletedOnboarding]);

  // Dynamic Goal and Productivity Score Calculation
  const productivityScores: ProductivityScoreBreakdown = React.useMemo(() => {
    const today = getTodayString();
    const todayTasks = tasks.filter((t) => t.dueDate === today);
    const todayCompleted = todayTasks.filter((t) => t.status === 'completed');

    const todayPercentage = todayTasks.length > 0
      ? Math.round((todayCompleted.length / todayTasks.length) * 100)
      : 100;

    // Task completion weight: 35%
    const taskScore = Math.min(100, todayPercentage);

    // Consistency / Streak weight: 25%
    const streakScore = Math.min(100, Math.round((streak.currentDailyStreak / 10) * 100));

    // Deadline adherence: 20%
    const deadlineScore = 88;

    // Milestone progress: 20%
    let totalMilestones = 0;
    let completedMilestones = 0;
    goals.forEach((g) => {
      g.milestones?.forEach((m) => {
        totalMilestones++;
        if (m.status === 'completed') completedMilestones++;
      });
    });
    const milestoneScore = totalMilestones > 0
      ? Math.round((completedMilestones / totalMilestones) * 100)
      : 80;

    const overallScore = Math.round(
      taskScore * 0.35 +
      streakScore * 0.25 +
      deadlineScore * 0.20 +
      milestoneScore * 0.20
    );

    return {
      overallScore: Math.max(10, Math.min(100, overallScore)),
      taskCompletionScore: taskScore,
      consistencyScore: streakScore,
      deadlineAdherenceScore: deadlineScore,
      milestoneProgressScore: milestoneScore,
      todayTasksCompleted: todayCompleted.length,
      todayTasksTotal: todayTasks.length,
      todayPercentage,
    };
  }, [tasks, streak, goals]);

  // Recalculate goal scores and health dynamically
  useEffect(() => {
    setGoals((prevGoals) =>
      prevGoals.map((g) => {
        const goalTasks = tasks.filter((t) => t.goalId === g.id);
        const goalCompleted = goalTasks.filter((t) => t.status === 'completed');
        const goalRate = goalTasks.length > 0 ? (goalCompleted.length / goalTasks.length) * 100 : 80;

        let newHealth: 'on_track' | 'needs_attention' | 'at_risk' = 'on_track';
        let healthReason = 'Progressing solidly on planned milestones.';

        if (goalRate < 50 && goalTasks.length >= 2) {
          newHealth = 'at_risk';
          healthReason = 'Multiple tasks pending or overdue this week.';
        } else if (goalRate < 75 && goalTasks.length >= 2) {
          newHealth = 'needs_attention';
          healthReason = 'Pace is slightly below target for this week.';
        }

        const calculatedScore = Math.round(goalRate * 0.5 + productivityScores.consistencyScore * 0.3 + 15);
        return {
          ...g,
          health: newHealth,
          healthReason,
          score: Math.min(100, calculatedScore),
        };
      })
    );
  }, [tasks.length, tasks.map(t => t.status).join(',')]);

  const rewards = React.useMemo(() => calculateRewardState(totalXp), [totalXp]);

  const updateSettings = (newSettings: Partial<UserSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const addNotification = (item: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => {
    const notif: NotificationItem = {
      ...item,
      id: 'notif-' + Date.now(),
      timestamp: new Date().toISOString(),
      read: false,
    };
    setNotifications((prev) => [notif, ...prev]);

    // Native browser notification if supported and allowed
    if (settings.enableNotifications && typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        try {
          new Notification(item.title, { body: item.message, icon: '/favicon.ico' });
        } catch (e) { }
      }
    }
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const completeTask = (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task || task.status === 'completed') return;

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#10b981', '#3b82f6', '#6366f1', '#f59e0b'],
      });
    } catch (e) { }

    // Audio chime
    if (settings.soundEnabled) {
      playCompletionSound(true);
    }

    // Award XP: base 10 XP + priority bonuses
    let xpGain = task.rewardPoints || 10;
    if (task.priority === 'High' || task.priority === 'Urgent') {
      xpGain += 10;
    }

    setTotalXp((prev) => prev + xpGain);

    // Update task
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
            ...t,
            status: 'completed',
            completedAt: new Date().toISOString(),
          }
          : t
      )
    );

    // Record completion event
    const completionRecord: TaskCompletion = {
      id: 'comp-' + Date.now(),
      taskId: task.id,
      taskTitle: task.title,
      completedAt: new Date().toISOString(),
      pointsEarned: xpGain,
      onTime: true,
    };
    setCompletions((prev) => [completionRecord, ...prev]);

    // Update streak if needed
    setStreak((prev) => ({
      ...prev,
      lastActiveDate: getTodayString(),
      missedYesterday: false,
    }));

    addNotification({
      title: '✓ Task Completed!',
      message: `Completed "${task.title}". +${xpGain} XP earned!`,
      type: 'reward',
    });
  };

  const uncompleteTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, status: 'pending', completedAt: undefined }
          : t
      )
    );
  };

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'status'>): Task => {
    const newTask: Task = {
      ...taskData,
      id: 'task-' + Date.now(),
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [newTask, ...prev]);
    addNotification({
      title: 'New Task Created',
      message: `"${newTask.title}" added to your focus schedule.`,
      type: 'task',
    });
    return newTask;
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const addGoal = (
    goalData: Omit<Goal, 'id' | 'createdAt' | 'score' | 'health' | 'healthReason' | 'milestones'>,
    customMilestones?: Milestone[]
  ): Goal => {
    const newGoalId = 'goal-' + Date.now();
    const newGoal: Goal = {
      ...goalData,
      id: newGoalId,
      score: 80,
      health: 'on_track',
      healthReason: 'Initial milestones outlined. Ready to begin.',
      status: 'active',
      milestones: customMilestones || [],
      createdAt: new Date().toISOString(),
    };
    setGoals((prev) => [newGoal, ...prev]);
    return newGoal;
  };

  const updateGoal = (id: string, updates: Partial<Goal>) => {
    setGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, ...updates } : g))
    );
  };

  const deleteGoal = (id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  };

  const addMilestone = (goalId: string, milestoneData: Omit<Milestone, 'id' | 'goalId'>) => {
    const newMilestone: Milestone = {
      ...milestoneData,
      id: 'm-' + Date.now(),
      goalId,
    };
    setGoals((prev) =>
      prev.map((g) =>
        g.id === goalId
          ? { ...g, milestones: [...g.milestones, newMilestone] }
          : g
      )
    );
  };

  const updateMilestone = (goalId: string, milestoneId: string, updates: Partial<Milestone>) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id !== goalId) return g;
        const updatedMilestones = g.milestones.map((m) =>
          m.id === milestoneId ? { ...m, ...updates } : m
        );
        return { ...g, milestones: updatedMilestones };
      })
    );
  };

  const deleteMilestone = (goalId: string, milestoneId: string) => {
    setGoals((prev) =>
      prev.map((g) =>
        g.id === goalId
          ? { ...g, milestones: g.milestones.filter((m) => m.id !== milestoneId) }
          : g
      )
    );
  };

  const logFocusSession = (sessionData: Omit<FocusSession, 'id'>) => {
    const session: FocusSession = {
      ...sessionData,
      id: 'focus-' + Date.now(),
    };
    setFocusSessions((prev) => [session, ...prev]);
    setTotalXp((prev) => prev + 15); // +15 XP for focus session

    if (settings.soundEnabled) {
      playFocusBellSound(true);
    }

    addNotification({
      title: '🎉 Focus Session Logged!',
      message: `Completed ${sessionData.durationMinutes} minutes of uninterrupted focus! (+15 XP)`,
      type: 'reward',
    });
  };

  const restartStreakToday = () => {
    setStreak((prev) => ({
      ...prev,
      currentDailyStreak: 1,
      missedYesterday: false,
      lastActiveDate: getTodayString(),
    }));
    addNotification({
      title: 'Streak Re-ignited!',
      message: "You're back in the game! One action today keeps the momentum rolling.",
      type: 'streak',
    });
  };

  const submitDailyQuestion = async (
    userChoice: 'yes' | 'not_yet' | 'no',
    details?: string
  ): Promise<string> => {
    const primaryGoal = goals[0];
    let aiResponseText = '';

    try {
      const res = await fetch('/api/ai/daily-question-response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          response: userChoice,
          details,
          goalTitle: primaryGoal?.title,
          reason: primaryGoal?.reason,
        }),
      });
      const data = await res.json();
      aiResponseText = data.message || '';
    } catch (e) {
      aiResponseText =
        userChoice === 'yes'
          ? 'Fantastic follow-through! Consistent wins compound over time.'
          : 'You still have time today to take one small meaningful step forward.';
    }

    const entry: DailyQuestionEntry = {
      id: 'dq-' + Date.now(),
      date: getTodayString(),
      response: userChoice,
      details,
      aiResponse: aiResponseText,
      timestamp: new Date().toISOString(),
    };

    setDailyQuestions((prev) => [entry, ...prev]);
    return aiResponseText;
  };

  const generateWeeklyReview = async (): Promise<WeeklyReviewReport> => {
    const completedTasksCount = tasks.filter((t) => t.status === 'completed').length;
    const totalTasksCount = tasks.length;
    const completionRate = totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 80;
    const focusTotalMin = focusSessions.reduce((acc, s) => acc + s.durationMinutes, 135);

    try {
      const res = await fetch('/api/ai/weekly-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          completionRate,
          completedCount: completedTasksCount,
          totalCount: totalTasksCount,
          focusTimeMinutes: focusTotalMin,
          streak: streak.currentDailyStreak,
          strongestArea: 'Career & Learning',
          needsImprovement: 'Exercise & Physical Health',
        }),
      });
      const data = await res.json();
      const report: WeeklyReviewReport = {
        id: 'wr-' + Date.now(),
        weekLabel: 'Week of ' + new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        weekStartDate: new Date(Date.now() - 6 * 86400000).toISOString().split('T')[0],
        weekEndDate: getTodayString(),
        completionRate,
        completedTasksCount,
        totalTasksCount,
        focusTimeMinutes: focusTotalMin,
        streakDays: streak.currentDailyStreak,
        strongestArea: 'Frontend Development & Core Logic',
        needsImprovement: 'Late Evening Workouts',
        summary: data.summary,
        whatWentWell: data.whatWentWell || [],
        whatNeedsAttention: data.whatNeedsAttention || [],
        recommendation: data.recommendation,
        createdAt: new Date().toISOString(),
      };
      setWeeklyReviews((prev) => [report, ...prev]);
      return report;
    } catch (e) {
      const fallbackReport: WeeklyReviewReport = {
        id: 'wr-' + Date.now(),
        weekLabel: 'Current Week',
        weekStartDate: new Date(Date.now() - 6 * 86400000).toISOString().split('T')[0],
        weekEndDate: getTodayString(),
        completionRate,
        completedTasksCount,
        totalTasksCount,
        focusTimeMinutes: focusTotalMin,
        streakDays: streak.currentDailyStreak,
        strongestArea: 'Frontend Development',
        needsImprovement: 'Evening Routines',
        summary: `Strong ${completionRate}% weekly completion rate. You executed priority learning objectives.`,
        whatWentWell: ['Maintained consistent 8-day streak', 'Completed React 19 milestones', 'Dedicated focus sessions logged'],
        whatNeedsAttention: ['Evening tasks occasionally pushed back', 'Workout routines skipped twice'],
        recommendation: 'Schedule your highest-friction task before 2 PM when mental bandwidth is highest.',
        createdAt: new Date().toISOString(),
      };
      setWeeklyReviews((prev) => [fallbackReport, ...prev]);
      return fallbackReport;
    }
  };

  const checkDistractionTrigger = (domain: string): boolean => {
    if (!settings.distractionBlockingEnabled) return false;
    const isBlocked = settings.blockedWebsites.some((site) =>
      domain.toLowerCase().includes(site.toLowerCase())
    );
    if (!isBlocked) return false;

    // Check if high-priority task is pending
    const highPriorityPending = tasks.find(
      (t) => (t.priority === 'High' || t.priority === 'Urgent') && t.status === 'pending'
    );

    if (highPriorityPending) {
      setDistractionInterventionTask(highPriorityPending);
      return true;
    }
    return false;
  };

  const dismissDistractionIntervention = () => {
    setDistractionInterventionTask(null);
  };

  const completeOnboarding = (data: {
    name: string;
    goalTitle: string;
    reason: string;
    category: any;
    deadlineType: any;
    commitmentLevel: any;
    preferredTime: any;
    accountabilityPreference: any;
    milestones?: any[];
  }) => {
    setSettings((prev) => ({
      ...prev,
      name: data.name || prev.name,
      preferredProductivityTime: data.preferredTime || prev.preferredProductivityTime,
      accountabilityPreference: data.accountabilityPreference || prev.accountabilityPreference,
    }));

    if (data.goalTitle) {
      const goalMilestones: Milestone[] = (data.milestones || []).map((m, idx) => ({
        id: 'm-onb-' + idx,
        goalId: 'goal-user-1',
        title: m.title || m,
        description: m.description || 'Milestone step toward ' + data.goalTitle,
        order: idx + 1,
        status: idx === 0 ? 'in_progress' : 'pending',
      }));

      const newGoal: Goal = {
        id: 'goal-user-1',
        title: data.goalTitle,
        reason: data.reason,
        category: data.category || 'Career',
        deadlineType: data.deadlineType || 'specific_date',
        commitmentLevel: data.commitmentLevel || 'Serious',
        health: 'on_track',
        healthReason: 'Initial goal roadmapped. Ready for consistent execution.',
        score: 80,
        status: 'active',
        createdAt: new Date().toISOString(),
        milestones: goalMilestones.length > 0 ? goalMilestones : [
          {
            id: 'm-1',
            goalId: 'goal-user-1',
            title: 'Phase 1: Core Fundamentals & Habit Building',
            description: 'Establish daily momentum and master primary tools.',
            order: 1,
            status: 'in_progress',
          },
          {
            id: 'm-2',
            goalId: 'goal-user-1',
            title: 'Phase 2: Project Execution & Deliberate Practice',
            description: 'Apply concepts to real-world deliverables.',
            order: 2,
            status: 'pending',
          },
        ],
      };
      setGoals([newGoal]);
    }

    setHasCompletedOnboarding(true);
    setShowLandingPage(false);
    setActiveTab('dashboard');
  };

  const resetAllData = () => {
    localStorage.removeItem(STORAGE_KEY);
    setSettings(INITIAL_SETTINGS);
    setGoals(INITIAL_GOALS);
    setTasks(INITIAL_TASKS);
    setStreak(INITIAL_STREAK);
    setTotalXp(780);
    setCompletions([]);
    setFocusSessions([]);
    setNotifications([]);
    setDailyQuestions([]);
    setWeeklyReviews([]);
  };

  return (
    <AppContext.Provider
      value={{
        settings,
        updateSettings,
        goals,
        addGoal,
        updateGoal,
        deleteGoal,
        addMilestone,
        updateMilestone,
        deleteMilestone,
        tasks,
        addTask,
        updateTask,
        deleteTask,
        completeTask,
        uncompleteTask,
        completions,
        focusSessions,
        logFocusSession,
        streak,
        restartStreakToday,
        rewards,
        notifications,
        markNotificationAsRead,
        addNotification,
        clearNotifications,
        dailyQuestions,
        submitDailyQuestion,
        weeklyReviews,
        generateWeeklyReview,
        productivityScores,
        activeFocusTask,
        setActiveFocusTask,
        focusModeActive,
        setFocusModeActive,
        distractionInterventionTask,
        dismissDistractionIntervention,
        checkDistractionTrigger,
        hasCompletedOnboarding,
        completeOnboarding,
        resetAllData,
        activeTab,
        setActiveTab,
        showLandingPage,
        setShowLandingPage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
