import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext.tsx';
import {
  CheckCircle2,
  Circle,
  Flame,
  Target,
  Sparkles,
  Clock,
  ArrowRight,
  Plus,
  Play,
  Calendar,
  AlertTriangle,
  RotateCcw,
  Shield,
  HelpCircle,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { Task } from '../types/index.ts';

interface DashboardViewProps {
  onOpenAddTask: () => void;
  onOpenDailyQuestion: () => void;
  onOpenEndOfDay: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onOpenAddTask,
  onOpenDailyQuestion,
  onOpenEndOfDay,
}) => {
  const {
    settings,
    goals,
    tasks,
    completeTask,
    uncompleteTask,
    streak,
    restartStreakToday,
    rewards,
    productivityScores,
    setActiveFocusTask,
    setActiveTab,
    setFocusModeActive,
    checkDistractionTrigger,
    dailyQuestions,
  } = useApp();

  const [aiAdvice, setAiAdvice] = useState<string>(
    'You have 2 important tasks remaining today. Starting with the navbar component while your energy is high will yield the highest return.'
  );
  const [isLoadingAdvice, setIsLoadingAdvice] = useState<boolean>(false);

  const today = new Date().toISOString().split('T')[0];
  const todayTasks = tasks.filter((t) => t.dueDate === today);
  const completedToday = todayTasks.filter((t) => t.status === 'completed');
  const remainingToday = todayTasks.filter((t) => t.status !== 'completed');

  const primaryGoal = goals[0];

  // Fetch AI accountability advice on load or refresh
  const fetchAdvice = async () => {
    setIsLoadingAdvice(true);
    try {
      const res = await fetch('/api/ai/accountability-advice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName: settings.name,
          goals,
          tasks,
          streak: streak.currentDailyStreak,
          completionRate: productivityScores.todayPercentage,
          recentCompletedCount: completedToday.length,
          recentMissedCount: 0,
        }),
      });
      const data = await res.json();
      if (data.message) {
        setAiAdvice(`${data.message} ${data.actionableStep || ''}`);
      }
    } catch (e) {
      // Keep sensible default advice
    } finally {
      setIsLoadingAdvice(false);
    }
  };

  useEffect(() => {
    fetchAdvice();
  }, [streak.currentDailyStreak, completedToday.length]);

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const hasAnsweredDailyQuestionToday = dailyQuestions.some((q) => q.date === today);

  const startTaskInFocusMode = (task: Task) => {
    setActiveFocusTask(task);
    setFocusModeActive(true);
    setActiveTab('focus');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-8 animate-in fade-in duration-200">
      {/* Top Greeting & Core Philosophy Question */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-100">
              {getTimeGreeting()}, {settings.name} 👋
            </h1>
            <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
              Lv.{rewards.levelIndex} {rewards.level}
            </span>
          </div>
          <p className="mt-1 text-sm text-stone-400">
            {todayTasks.length > 0 ? (
              <>
                You've completed{' '}
                <strong className="text-stone-200">{completedToday.length} of {todayTasks.length} tasks today</strong>.
                {remainingToday.length > 0
                  ? ` You have ${remainingToday.length} task${remainingToday.length > 1 ? 's' : ''} remaining.`
                  : ' All scheduled tasks complete! Exceptional follow-through!'}
              </>
            ) : (
              'No tasks scheduled for today yet. Add one to build momentum.'
            )}
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onOpenAddTask}
            className="flex items-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-semibold text-stone-950 hover:bg-emerald-400 transition-colors shadow-md shadow-emerald-500/20"
          >
            <Plus className="h-4 w-4" />
            <span>Add Task</span>
          </button>
          <button
            onClick={() => setActiveTab('focus')}
            className="flex items-center gap-1.5 rounded-xl bg-stone-900 border border-stone-800 px-3.5 py-2.5 text-xs font-semibold text-stone-200 hover:bg-stone-800 transition-colors"
          >
            <Clock className="h-4 w-4 text-emerald-400" />
            <span>Start Focus Session</span>
          </button>
          <button
            onClick={onOpenEndOfDay}
            title="Simulate End-of-Day Check-in"
            className="hidden sm:flex items-center gap-1.5 rounded-xl bg-stone-900 border border-stone-800 px-3 py-2.5 text-xs text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition-colors"
          >
            <span>End-of-Day Check</span>
          </button>
        </div>
      </div>

      {/* Missed Day Non-Judgmental Recovery Banner (Rule: Don't shame user) */}
      {streak.missedYesterday && (
        <div className="rounded-2xl border border-amber-800/40 bg-amber-950/20 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-amber-500/10 p-2 text-amber-400">
              <RotateCcw className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-stone-200">You missed yesterday. That's okay.</h3>
              <p className="text-xs text-stone-400 mt-0.5">
                Life happens. Momentum isn't about never falling off; it's about getting right back on track today without self-criticism.
              </p>
            </div>
          </div>
          <button
            onClick={restartStreakToday}
            className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2 text-xs font-semibold text-stone-950 hover:bg-amber-400 transition-colors shrink-0"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Restart Today</span>
          </button>
        </div>
      )}

      {/* Quick Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Today's Completion % */}
        <div className="rounded-2xl border border-stone-800 bg-stone-900/60 p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-stone-400">Today's Progress</span>
            <span className="text-xs font-bold text-emerald-400">
              {productivityScores.todayPercentage}%
            </span>
          </div>
          <p className="text-2xl font-black text-stone-100 mt-2">
            {completedToday.length} / {todayTasks.length}
          </p>
          <div className="mt-3 w-full bg-stone-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full transition-all duration-300"
              style={{ width: `${productivityScores.todayPercentage}%` }}
            />
          </div>
          <span className="text-[11px] text-stone-400 mt-2 block">
            {remainingToday.length} task{remainingToday.length === 1 ? '' : 's'} remaining
          </span>
        </div>

        {/* Current Streak */}
        <div className="rounded-2xl border border-stone-800 bg-stone-900/60 p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-stone-400">Consistency Streak</span>
            <Flame className="h-4 w-4 text-orange-500 fill-orange-500 animate-pulse" />
          </div>
          <p className="text-2xl font-black text-stone-100 mt-2">
            🔥 {streak.currentDailyStreak} <span className="text-sm font-normal text-stone-400">days</span>
          </p>
          <div className="mt-3 flex items-center gap-1.5 text-[11px] text-stone-400">
            <span>Best: {streak.longestDailyStreak} days</span>
            <span>•</span>
            <span className="text-orange-400 font-medium">Keep rolling!</span>
          </div>
        </div>

        {/* Goal Score (0 - 100) */}
        <div
          onClick={() => setActiveTab('analytics')}
          className="cursor-pointer rounded-2xl border border-stone-800 bg-stone-900/60 p-5 hover:border-emerald-500/50 transition-colors"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-stone-400">Goal Score</span>
            <Target className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-1.5 mt-2">
            <p className="text-2xl font-black text-stone-100">{productivityScores.overallScore}</p>
            <span className="text-xs text-stone-400">/ 100</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px]">
            <span className="text-emerald-400 font-medium">
              {productivityScores.overallScore >= 75
                ? '🟢 On Track'
                : productivityScores.overallScore >= 50
                ? '🟡 Needs Attention'
                : '🔴 At Risk'}
            </span>
            <span className="text-stone-400">Details →</span>
          </div>
        </div>

        {/* Experience Points & Level */}
        <div
          onClick={() => setActiveTab('analytics')}
          className="cursor-pointer rounded-2xl border border-stone-800 bg-stone-900/60 p-5 hover:border-emerald-500/50 transition-colors"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-stone-400">Accountability XP</span>
            <TrendingUp className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-stone-100 mt-2">{rewards.totalXp} XP</p>
          <div className="mt-3 flex items-center justify-between text-[11px] text-stone-400">
            <span>Next: {rewards.nextLevelXp} XP</span>
            <span className="text-emerald-400 font-medium">Level {rewards.levelIndex}</span>
          </div>
        </div>
      </div>

      {/* Main Focus Goal Banner */}
      {primaryGoal && (
        <div className="rounded-2xl border border-stone-800 bg-gradient-to-r from-stone-900 via-stone-900/90 to-stone-950 p-5 sm:p-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                <Target className="h-3.5 w-3.5" />
                <span>What Matters Today • Primary Goal</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-stone-100 mt-1">
                {primaryGoal.title}
              </h2>
              <p className="text-xs text-stone-400 mt-1 italic max-w-2xl leading-relaxed">
                "{primaryGoal.reason}"
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="text-right">
                <span className="text-xs font-semibold text-stone-200">
                  {primaryGoal.health === 'on_track' ? '🟢 On Track' : '🟡 Needs Attention'}
                </span>
                <span className="block text-[11px] text-stone-400">Goal Score: {primaryGoal.score}/100</span>
              </div>
              <button
                onClick={() => setActiveTab('goals')}
                className="flex items-center gap-1 rounded-xl bg-stone-800 px-3.5 py-2 text-xs font-medium text-stone-200 hover:bg-stone-700 transition-colors"
              >
                <span>Milestones</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Accountability Partner Advice Card */}
      <div className="rounded-2xl border border-emerald-950/60 bg-gradient-to-br from-emerald-950/20 via-stone-900/60 to-stone-950 p-5 border-l-4 border-l-emerald-500">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                  Consistency Coach Recommendation
                </h3>
                {isLoadingAdvice && (
                  <span className="text-[10px] text-stone-400 animate-pulse">refreshing...</span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-stone-200 mt-1 leading-relaxed">
                {aiAdvice}
              </p>
            </div>
          </div>
          <button
            onClick={fetchAdvice}
            title="Refresh Coach advice"
            className="text-stone-400 hover:text-stone-200 p-1 rounded-lg text-xs"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Daily Accountability Question Prompt Card (if not yet answered) */}
      {!hasAnsweredDailyQuestionToday && settings.dailyQuestionEnabled && (
        <div className="rounded-2xl border border-stone-800 bg-stone-900/60 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-indigo-500/10 p-2 text-indigo-400">
              <HelpCircle className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-indigo-400 uppercase tracking-wider">
                Daily Check-in
              </span>
              <h4 className="text-sm font-semibold text-stone-100 mt-0.5">
                "Did you do anything productive today?"
              </h4>
              <p className="text-xs text-stone-400">
                A 30-second reflection to celebrate wins or course-correct before your day ends.
              </p>
            </div>
          </div>
          <button
            onClick={onOpenDailyQuestion}
            className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors shadow-sm"
          >
            Answer Check-in
          </button>
        </div>
      )}

      {/* Task List Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-stone-100">Today's Focus Tasks</h2>
            <span className="rounded-full bg-stone-800 px-2 py-0.5 text-xs text-stone-400">
              {todayTasks.length}
            </span>
          </div>
          <button
            onClick={onOpenAddTask}
            className="flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add task</span>
          </button>
        </div>

        {todayTasks.length === 0 ? (
          <div className="rounded-2xl border border-stone-800/80 bg-stone-900/30 p-10 text-center">
            <CheckCircle2 className="h-10 w-10 text-stone-600 mx-auto mb-3" />
            <p className="text-sm font-semibold text-stone-300">No tasks on your schedule for today.</p>
            <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
              Consistency is built on one small action each day. Add an achievable micro-task to get rolling.
            </p>
            <button
              onClick={onOpenAddTask}
              className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-semibold text-stone-950 hover:bg-emerald-400 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Schedule First Task</span>
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {todayTasks.map((task) => {
              const isCompleted = task.status === 'completed';
              return (
                <div
                  key={task.id}
                  className={`group flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border p-4 transition-all ${
                    isCompleted
                      ? 'border-stone-800/50 bg-stone-900/30 opacity-75'
                      : 'border-stone-800 bg-stone-900/70 hover:border-stone-700 shadow-sm'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Complete button */}
                    <button
                      onClick={() => (isCompleted ? uncompleteTask(task.id) : completeTask(task.id))}
                      className="mt-0.5 text-stone-400 hover:text-emerald-400 transition-colors cursor-pointer"
                      title={isCompleted ? 'Mark pending' : 'Complete task (+XP)'}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-500 fill-emerald-500/20" />
                      ) : (
                        <Circle className="h-5 w-5 text-stone-600 hover:text-emerald-400" />
                      )}
                    </button>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`text-sm font-semibold ${
                            isCompleted ? 'line-through text-stone-500' : 'text-stone-100'
                          }`}
                        >
                          {task.title}
                        </span>

                        {/* Priority Badge */}
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold border ${
                            task.priority === 'High' || task.priority === 'Urgent'
                              ? 'bg-rose-950/40 text-rose-300 border-rose-800/50'
                              : task.priority === 'Medium'
                              ? 'bg-amber-950/40 text-amber-300 border-amber-800/50'
                              : 'bg-stone-800 text-stone-400 border-stone-700'
                          }`}
                        >
                          {task.priority}
                        </span>

                        {/* Category Badge */}
                        {task.category && (
                          <span className="rounded-full bg-stone-800/70 px-2 py-0.5 text-[10px] text-stone-400">
                            {task.category}
                          </span>
                        )}
                      </div>

                      {task.description && (
                        <p className="text-xs text-stone-400 mt-1 leading-relaxed">{task.description}</p>
                      )}

                      <div className="mt-2 flex items-center gap-3 text-[11px] text-stone-400">
                        {task.goalTitle && (
                          <span className="text-emerald-400/90 font-medium">🎯 {task.goalTitle}</span>
                        )}
                        <span>⏱️ {task.duration} min</span>
                        {task.dueTime && <span>⏰ {task.dueTime}</span>}
                        <span className="text-amber-400/80">+{task.rewardPoints || 10} XP</span>
                      </div>
                    </div>
                  </div>

                  {/* Right side actions */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    {!isCompleted ? (
                      <>
                        <button
                          onClick={() => startTaskInFocusMode(task)}
                          className="flex items-center gap-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 px-3 py-1.5 text-xs font-medium text-stone-200 transition-colors"
                          title="Open in Focus Mode timer"
                        >
                          <Play className="h-3.5 w-3.5 text-emerald-400 fill-emerald-400" />
                          <span>Focus</span>
                        </button>
                        <button
                          onClick={() => completeTask(task.id)}
                          className="flex items-center gap-1 rounded-xl bg-emerald-500/10 hover:bg-emerald-500 hover:text-stone-950 border border-emerald-500/30 px-3 py-1.5 text-xs font-semibold text-emerald-400 transition-all cursor-pointer"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>Complete ✓</span>
                        </button>
                      </>
                    ) : (
                      <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                        ✓ Completed
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Distraction Blocker Shield Simulation Banner */}
      {settings.distractionBlockingEnabled && (
        <div className="rounded-2xl border border-stone-800 bg-stone-900/40 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-stone-400">
          <div className="flex items-center gap-2.5">
            <Shield className="h-4 w-4 text-emerald-400" />
            <span>
              <strong className="text-stone-200">Optional Distraction Shield Active</strong> ({settings.blockedWebsites.length} sites monitored: {settings.blockedWebsites.slice(0, 3).join(', ')}...)
            </span>
          </div>
          <button
            onClick={() => checkDistractionTrigger('youtube.com')}
            className="text-[11px] text-emerald-400 hover:underline font-medium"
          >
            Test intervention screen →
          </button>
        </div>
      )}
    </div>
  );
};
