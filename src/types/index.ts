export type GoalCategory =
  | 'Education'
  | 'Career'
  | 'Business'
  | 'Health & Fitness'
  | 'Finance'
  | 'Personal Development'
  | 'Creativity'
  | 'Relationships'
  | 'Faith/Spirituality'
  | 'Other';

export type GoalHealth = 'on_track' | 'needs_attention' | 'at_risk';

export type CommitmentLevel = 'Casual' | 'Moderate' | 'Serious' | 'Very Serious';

export type AccountabilityPreference = 'Gentle' | 'Balanced' | 'Strict' | 'AI Coach';

export type PreferredTime = 'Morning' | 'Afternoon' | 'Evening' | 'Custom schedule';

export interface Milestone {
  id: string;
  goalId: string;
  title: string;
  description: string;
  order: number;
  status: 'pending' | 'in_progress' | 'completed';
}

export interface Goal {
  id: string;
  title: string;
  description?: string;
  reason: string; // "Why" - used for AI motivation
  category: GoalCategory;
  deadlineType: 'none' | 'specific_date' | 'weekly' | 'monthly' | 'yearly';
  deadlineDate?: string;
  commitmentLevel: CommitmentLevel;
  health: GoalHealth;
  healthReason: string;
  score: number; // 0 - 100
  status: 'active' | 'completed' | 'paused' | 'archived';
  milestones: Milestone[];
  createdAt: string;
}

export type TaskPriority = 'Low' | 'Medium' | 'High' | 'Urgent';
export type TaskRecurrence = 'none' | 'daily' | 'weekdays' | 'weekly' | 'monthly';
export type TaskDifficulty = 'Easy' | 'Medium' | 'Hard';
export type TaskStatus = 'pending' | 'completed' | 'in_progress' | 'rescheduled' | 'skipped';

export interface Task {
  id: string;
  goalId?: string;
  goalTitle?: string;
  milestoneId?: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  duration: number; // minutes
  dueDate: string; // YYYY-MM-DD
  dueTime: string; // HH:mm
  recurrence: TaskRecurrence;
  difficulty: TaskDifficulty;
  category: GoalCategory;
  reminder: boolean;
  rewardPoints: number;
  status: TaskStatus;
  completedAt?: string;
  createdAt: string;
}

export interface TaskCompletion {
  id: string;
  taskId: string;
  taskTitle: string;
  completedAt: string;
  pointsEarned: number;
  onTime: boolean;
}

export interface FocusSession {
  id: string;
  taskId?: string;
  taskTitle: string;
  durationMinutes: number;
  startedAt: string;
  endedAt: string;
  completed: boolean;
}

export interface StreakData {
  currentDailyStreak: number;
  longestDailyStreak: number;
  weeklyStreak: number;
  lastActiveDate?: string;
  missedYesterday: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  progress: number; // 0 - 100
}

export interface RewardState {
  totalXp: number;
  level: string;
  levelIndex: number;
  currentLevelXp: number;
  nextLevelXp: number;
  achievements: Achievement[];
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'task' | 'streak' | 'accountability' | 'eod' | 'reward' | 'system';
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

export interface UserSettings {
  name: string;
  email: string;
  timezone: string;
  preferredProductivityTime: PreferredTime;
  dayEndTime: string; // e.g. "23:00"
  weekEndDay: 'Sunday' | 'Saturday';
  accountabilityPreference: AccountabilityPreference;
  enableNotifications: boolean;
  reminderFrequency: 'low' | 'normal' | 'high';
  quietHoursEnabled: boolean;
  quietHoursStart: string; // "22:00"
  quietHoursEnd: string; // "07:00"
  dailyQuestionEnabled: boolean;
  dailyQuestionTime: string; // "19:00"
  motivationalMessagesEnabled: boolean;
  distractionBlockingEnabled: boolean;
  distractionTrigger: 'high_priority_remaining' | 'focus_mode_active' | 'always_during_work';
  blockedWebsites: string[];
  soundEnabled: boolean;
  darkMode: boolean;
  reducedMotion: boolean;
}

export interface DailyQuestionEntry {
  id: string;
  date: string;
  response: 'yes' | 'not_yet' | 'no';
  details?: string;
  aiResponse?: string;
  timestamp: string;
}

export interface WeeklyReviewReport {
  id: string;
  weekLabel: string;
  weekStartDate: string;
  weekEndDate: string;
  completionRate: number;
  completedTasksCount: number;
  totalTasksCount: number;
  focusTimeMinutes: number;
  streakDays: number;
  strongestArea: string;
  needsImprovement: string;
  summary: string;
  whatWentWell: string[];
  whatNeedsAttention: string[];
  recommendation: string;
  createdAt: string;
}

export interface ProductivityScoreBreakdown {
  overallScore: number;
  taskCompletionScore: number;
  consistencyScore: number;
  deadlineAdherenceScore: number;
  milestoneProgressScore: number;
  todayTasksCompleted: number;
  todayTasksTotal: number;
  todayPercentage: number;
}
