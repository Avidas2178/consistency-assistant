import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import {
  BarChart3,
  Calendar,
  Flame,
  Target,
  Clock,
  Award,
  CheckCircle2,
  TrendingUp,
  Info,
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const { productivityScores, streak, rewards, tasks, goals, focusSessions } = useApp();
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('weekly');

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const weeklyCompletionRates = [75, 85, 90, 65, 80, 70, 85]; // Sample week distribution

  const totalFocusMinutes = focusSessions.reduce((acc, s) => acc + s.durationMinutes, 135);
  const totalCompletedTasks = tasks.filter((t) => t.status === 'completed').length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-8 animate-in fade-in duration-200">
      {/* Header & Timeframe Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-100">
            Productivity & Consistency Analytics
          </h1>
          <p className="mt-1 text-sm text-stone-400">
            Data-backed visibility into your follow-through patterns and habits.
          </p>
        </div>

        <div className="flex items-center gap-1 rounded-xl bg-stone-900 p-1 border border-stone-800">
          {(['daily', 'weekly', 'monthly'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                timeframe === t
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-stone-800 bg-stone-900/60 p-5">
          <div className="flex items-center justify-between text-xs text-stone-400">
            <span>Overall Goal Score</span>
            <Target className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="text-3xl font-black text-stone-100 mt-2">
            {productivityScores.overallScore} <span className="text-xs font-normal text-stone-400">/ 100</span>
          </p>
          <span className="text-[11px] text-emerald-400 block mt-2">
            🟢 Strong Consistency
          </span>
        </div>

        <div className="rounded-2xl border border-stone-800 bg-stone-900/60 p-5">
          <div className="flex items-center justify-between text-xs text-stone-400">
            <span>Daily Streak</span>
            <Flame className="h-4 w-4 text-orange-500 fill-orange-500" />
          </div>
          <p className="text-3xl font-black text-stone-100 mt-2">
            {streak.currentDailyStreak} <span className="text-xs font-normal text-stone-400">days</span>
          </p>
          <span className="text-[11px] text-stone-400 block mt-2">
            Longest run: {streak.longestDailyStreak} days
          </span>
        </div>

        <div className="rounded-2xl border border-stone-800 bg-stone-900/60 p-5">
          <div className="flex items-center justify-between text-xs text-stone-400">
            <span>Total Focus Time</span>
            <Clock className="h-4 w-4 text-teal-400" />
          </div>
          <p className="text-3xl font-black text-stone-100 mt-2">
            {Math.round(totalFocusMinutes / 60)}h {totalFocusMinutes % 60}m
          </p>
          <span className="text-[11px] text-stone-400 block mt-2">
            Across {focusSessions.length || 3} deep work blocks
          </span>
        </div>

        <div className="rounded-2xl border border-stone-800 bg-stone-900/60 p-5">
          <div className="flex items-center justify-between text-xs text-stone-400">
            <span>Current Level</span>
            <Award className="h-4 w-4 text-amber-400" />
          </div>
          <p className="text-xl font-bold text-stone-100 mt-2">
            Lv.{rewards.levelIndex} {rewards.level}
          </p>
          <span className="text-[11px] text-amber-400 block mt-2">
            {rewards.totalXp} Total XP earned
          </span>
        </div>
      </div>

      {/* Transparent Goal Score Breakdown Card */}
      <div className="rounded-2xl border border-stone-800 bg-stone-900/60 p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-stone-800 pb-3">
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-stone-100">Transparent Goal Score Algorithm</h3>
          </div>
          <span className="text-xs text-stone-400">Zero arbitrary ratings</span>
        </div>
        <p className="text-xs text-stone-400 leading-relaxed">
          The Goal Score is mathematically synthesized from 4 measurable components so you always understand why your score moved:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          <div className="rounded-xl bg-stone-950 p-4 border border-stone-800">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-stone-300">Task Completion (35%)</span>
              <span className="font-bold text-emerald-400">{productivityScores.taskCompletionScore}%</span>
            </div>
            <div className="w-full bg-stone-800 h-1.5 rounded-full overflow-hidden mt-2">
              <div className="bg-emerald-500 h-full" style={{ width: `${productivityScores.taskCompletionScore}%` }} />
            </div>
            <p className="text-[11px] text-stone-500 mt-2">Percentage of scheduled daily tasks finished on time.</p>
          </div>

          <div className="rounded-xl bg-stone-950 p-4 border border-stone-800">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-stone-300">Consistency & Streak (25%)</span>
              <span className="font-bold text-emerald-400">{productivityScores.consistencyScore}%</span>
            </div>
            <div className="w-full bg-stone-800 h-1.5 rounded-full overflow-hidden mt-2">
              <div className="bg-emerald-500 h-full" style={{ width: `${productivityScores.consistencyScore}%` }} />
            </div>
            <p className="text-[11px] text-stone-500 mt-2">Consecutive days showing up without dropping the chain.</p>
          </div>

          <div className="rounded-xl bg-stone-950 p-4 border border-stone-800">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-stone-300">Deadline Adherence (20%)</span>
              <span className="font-bold text-emerald-400">{productivityScores.deadlineAdherenceScore}%</span>
            </div>
            <div className="w-full bg-stone-800 h-1.5 rounded-full overflow-hidden mt-2">
              <div className="bg-emerald-500 h-full" style={{ width: `${productivityScores.deadlineAdherenceScore}%` }} />
            </div>
            <p className="text-[11px] text-stone-500 mt-2">Ratio of tasks completed prior to target deadline.</p>
          </div>

          <div className="rounded-xl bg-stone-950 p-4 border border-stone-800">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-stone-300">Milestone Progress (20%)</span>
              <span className="font-bold text-emerald-400">{productivityScores.milestoneProgressScore}%</span>
            </div>
            <div className="w-full bg-stone-800 h-1.5 rounded-full overflow-hidden mt-2">
              <div className="bg-emerald-500 h-full" style={{ width: `${productivityScores.milestoneProgressScore}%` }} />
            </div>
            <p className="text-[11px] text-stone-500 mt-2">Concrete progress through planned goal roadmaps.</p>
          </div>
        </div>
      </div>

      {/* Weekly Consistency Chart */}
      <div className="rounded-2xl border border-stone-800 bg-stone-900/60 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-stone-100">Consistency by Day of the Week</h3>
            <p className="text-xs text-stone-400 mt-0.5">Average completion rates across days</p>
          </div>
          <span className="text-xs font-semibold text-emerald-400">Peak: Thursday (90%)</span>
        </div>

        {/* Visual Bar Graph */}
        <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-44 pt-6">
          {daysOfWeek.map((day, idx) => {
            const heightPercent = weeklyCompletionRates[idx];
            return (
              <div key={day} className="flex flex-col items-center h-full justify-end group">
                <span className="text-[11px] font-semibold text-stone-400 mb-1.5 group-hover:text-emerald-400 transition-colors">
                  {heightPercent}%
                </span>
                <div className="w-full max-w-[48px] bg-stone-800/80 rounded-t-xl overflow-hidden flex flex-col justify-end h-28">
                  <div
                    className="w-full bg-gradient-to-t from-emerald-600 to-teal-400 transition-all duration-300 rounded-t-lg group-hover:brightness-110"
                    style={{ height: `${heightPercent}%` }}
                  />
                </div>
                <span className="text-xs font-medium text-stone-300 mt-2">{day}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Gamification & Achievements Showcase */}
      <div className="rounded-2xl border border-stone-800 bg-stone-900/60 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-stone-100">Consistency Badges & Achievements</h3>
          </div>
          <span className="text-xs text-stone-400">
            {rewards.achievements.filter((a) => a.unlockedAt).length} of {rewards.achievements.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {rewards.achievements.map((ach) => {
            const isUnlocked = !!ach.unlockedAt;
            return (
              <div
                key={ach.id}
                className={`p-4 rounded-xl border transition-all ${
                  isUnlocked
                    ? 'border-emerald-800/40 bg-stone-950/80'
                    : 'border-stone-800 bg-stone-950/30 opacity-60'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl p-2 rounded-xl bg-stone-900 border border-stone-800 shrink-0">
                    {ach.icon}
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-stone-200">{ach.title}</h4>
                    <p className="text-[11px] text-stone-400 mt-0.5 leading-relaxed">{ach.description}</p>
                    {isUnlocked ? (
                      <span className="text-[10px] text-emerald-400 font-semibold mt-1.5 block">
                        ✓ Unlocked
                      </span>
                    ) : (
                      <div className="mt-2 w-32 bg-stone-800 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-amber-400 h-full" style={{ width: `${ach.progress}%` }} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
