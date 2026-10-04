import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import {
  Sparkles,
  Heart,
  Calendar,
  Clock,
  ArrowRight,
  TrendingUp,
  MessageSquare,
  HelpCircle,
  CheckCircle2,
  RefreshCw,
  Loader2,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { WeeklyReviewReport } from '../types/index.ts';

export const AICoachView: React.FC = () => {
  const {
    settings,
    goals,
    tasks,
    streak,
    rewards,
    productivityScores,
    dailyQuestions,
    weeklyReviews,
    generateWeeklyReview,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'coach' | 'weekly_review' | 'daily_questions'>('coach');
  const [isGeneratingWeekly, setIsGeneratingWeekly] = useState<boolean>(false);
  const [currentWeeklyReport, setCurrentWeeklyReport] = useState<WeeklyReviewReport | null>(
    weeklyReviews[0] || null
  );

  // Motivational message
  const [motivationQuote, setMotivationQuote] = useState<string>(
    goals[0]?.reason
      ? `Remember why you started: "${goals[0].reason}". You don't need to finish everything today—just win the next 25 minutes.`
      : 'Consistency compounds when friction is low. Focus on taking the next small step.'
  );
  const [isLoadingMotivation, setIsLoadingMotivation] = useState<boolean>(false);

  // Quick advice queries
  const [userQuery, setUserQuery] = useState<string>('');
  const [coachResponse, setCoachResponse] = useState<string>('');
  const [isThinking, setIsThinking] = useState<boolean>(false);

  const primaryGoal = goals[0];

  const handleGenerateMotivation = async () => {
    setIsLoadingMotivation(true);
    try {
      const res = await fetch('/api/ai/motivation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goalTitle: primaryGoal?.title,
          reason: primaryGoal?.reason,
          currentContext: 'Seeking steady focus and consistency',
        }),
      });
      const data = await res.json();
      if (data.quote) {
        setMotivationQuote(data.quote);
      }
    } catch (e) {
      // Keep quote
    } finally {
      setIsLoadingMotivation(false);
    }
  };

  const handleAskCoach = async (presetPrompt?: string) => {
    const question = presetPrompt || userQuery;
    if (!question.trim()) return;

    setIsThinking(true);
    setCoachResponse('');

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
          userQuestion: question,
        }),
      });
      const data = await res.json();
      setCoachResponse(
        `${data.message} \n\n🎯 Recommended next micro-action: ${data.actionableStep || 'Pick one 25-minute task from today\'s schedule.'}`
      );
    } catch (e) {
      setCoachResponse(
        `Focus on what you can control right now. For "${primaryGoal?.title || 'your goal'}", pick the single simplest action on your list and complete it in 20 focused minutes.`
      );
    } finally {
      setIsThinking(false);
      setUserQuery('');
    }
  };

  const handleGenerateWeeklyReport = async () => {
    setIsGeneratingWeekly(true);
    try {
      const report = await generateWeeklyReview();
      setCurrentWeeklyReport(report);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingWeekly(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 space-y-8 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
              <Sparkles className="h-4 w-4" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-100">
              Focus AI Coach
            </h1>
          </div>
          <p className="mt-1 text-sm text-stone-400">
            A supportive, non-judgmental accountability partner helping you follow through on what matters.
          </p>
        </div>

        {/* Coach Tabs */}
        <div className="flex items-center gap-1.5 rounded-xl bg-stone-900 p-1 border border-stone-800">
          <button
            onClick={() => setActiveTab('coach')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'coach'
                ? 'bg-emerald-600 text-white'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Daily Coaching
          </button>
          <button
            onClick={() => setActiveTab('weekly_review')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'weekly_review'
                ? 'bg-emerald-600 text-white'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Weekly Review
          </button>
          <button
            onClick={() => setActiveTab('daily_questions')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'daily_questions'
                ? 'bg-emerald-600 text-white'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Check-in History
          </button>
        </div>
      </div>

      {activeTab === 'coach' && (
        <div className="space-y-6">
          {/* Motivation Quote Grounded in User's Reason */}
          <div className="rounded-2xl border border-emerald-950/60 bg-gradient-to-br from-emerald-950/20 via-stone-900/60 to-stone-950 p-6 shadow-xl relative overflow-hidden">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                  <Heart className="h-3.5 w-3.5" />
                  <span>Your Emotional Anchor</span>
                </div>
                <blockquote className="text-sm sm:text-base font-medium text-stone-100 leading-relaxed italic">
                  "{motivationQuote}"
                </blockquote>
                <span className="text-[11px] text-stone-400 block">
                  Grounding reminder for {primaryGoal?.title || 'your key ambition'}
                </span>
              </div>

              <button
                onClick={handleGenerateMotivation}
                disabled={isLoadingMotivation}
                title="Get fresh motivation"
                className="text-stone-400 hover:text-emerald-400 p-2 rounded-xl bg-stone-900 border border-stone-800 transition-colors shrink-0"
              >
                {isLoadingMotivation ? (
                  <Loader2 className="h-4 w-4 animate-spin text-emerald-400" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Behavior Pattern Detection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-stone-800 bg-stone-900/60 p-5 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-teal-400 uppercase tracking-wider">
                <Clock className="h-3.5 w-3.5" />
                <span>Productivity Pattern Observed</span>
              </div>
              <p className="text-xs text-stone-200 leading-relaxed">
                You complete <strong>85%</strong> of your tasks when scheduled in the <strong>{settings.preferredProductivityTime}</strong>. Schedule your high-friction tasks during this window to preserve willpower.
              </p>
            </div>

            <div className="rounded-2xl border border-stone-800 bg-stone-900/60 p-5 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider">
                <TrendingUp className="h-3.5 w-3.5" />
                <span>Accountability Intensity</span>
              </div>
              <p className="text-xs text-stone-200 leading-relaxed">
                Current mode: <strong>{settings.accountabilityPreference}</strong>. AI provides proactive insights and catches unrealistic task sizing while keeping you in full control.
              </p>
            </div>
          </div>

          {/* Interactive Coaching Check-in */}
          <div className="rounded-2xl border border-stone-800 bg-stone-900/60 p-6 space-y-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-stone-100">Check-in with Consistency Coach</h3>
            </div>
            <p className="text-xs text-stone-400">
              Ask how to overcome resistance, reschedule tasks without guilt, or optimize your upcoming schedule.
            </p>

            {/* Quick Prompts */}
            <div className="flex flex-wrap gap-2 pt-1">
              {[
                'How can I protect my streak today?',
                'I feel overwhelmed by my task list',
                'Suggest a 30-minute high-focus plan',
                'Why do I procrastinate on difficult tasks?',
              ].map((q) => (
                <button
                  key={q}
                  onClick={() => handleAskCoach(q)}
                  className="rounded-xl border border-stone-800 bg-stone-950 px-3 py-1.5 text-xs text-stone-300 hover:border-emerald-500/50 hover:text-emerald-300 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Input Form */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ask your coach anything (e.g., 'How do I balance studying with rest?')"
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAskCoach()}
                className="flex-1 rounded-xl border border-stone-800 bg-stone-950 px-3 py-2.5 text-xs text-stone-100 placeholder:text-stone-500 focus:border-emerald-500 focus:outline-none"
              />
              <button
                onClick={() => handleAskCoach()}
                disabled={isThinking || !userQuery.trim()}
                className="flex items-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-semibold text-stone-950 hover:bg-emerald-400 transition-colors disabled:opacity-50"
              >
                {isThinking ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ArrowRight className="h-3.5 w-3.5" />}
                <span>Ask</span>
              </button>
            </div>

            {/* Coach Response Display */}
            {coachResponse && (
              <div className="rounded-xl border border-emerald-800/40 bg-stone-950 p-4 text-xs text-stone-200 leading-relaxed whitespace-pre-line animate-in fade-in">
                {coachResponse}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Weekly Review Tab */}
      {activeTab === 'weekly_review' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-stone-100">End-of-Week Review & Analysis</h2>
              <p className="text-xs text-stone-400 mt-0.5">
                Reflect on tasks completed, focus time, and recommendations for the coming week.
              </p>
            </div>

            <button
              onClick={handleGenerateWeeklyReport}
              disabled={isGeneratingWeekly}
              className="flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-semibold text-stone-950 hover:bg-emerald-400 transition-colors shadow-md disabled:opacity-50"
            >
              {isGeneratingWeekly ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Sparkles className="h-3.5 w-3.5" />
              )}
              <span>Generate Weekly Report</span>
            </button>
          </div>

          {currentWeeklyReport ? (
            <div className="rounded-2xl border border-stone-800 bg-stone-900/60 p-6 space-y-6 shadow-xl">
              <div className="flex items-center justify-between border-b border-stone-800 pb-4">
                <div>
                  <span className="text-[10px] uppercase font-semibold text-emerald-400">Weekly Performance</span>
                  <h3 className="text-base font-bold text-stone-100">{currentWeeklyReport.weekLabel}</h3>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-stone-100">{currentWeeklyReport.completionRate}%</span>
                  <span className="text-xs text-stone-400 block">Weekly Completion</span>
                </div>
              </div>

              {/* Summary Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-xl bg-stone-950 p-3 border border-stone-800">
                  <span className="text-[11px] text-stone-400">Tasks Finished</span>
                  <p className="text-sm font-bold text-stone-100 mt-1">
                    {currentWeeklyReport.completedTasksCount} / {currentWeeklyReport.totalTasksCount}
                  </p>
                </div>

                <div className="rounded-xl bg-stone-950 p-3 border border-stone-800">
                  <span className="text-[11px] text-stone-400">Focus Time</span>
                  <p className="text-sm font-bold text-stone-100 mt-1">
                    {Math.round(currentWeeklyReport.focusTimeMinutes / 60)} hrs {currentWeeklyReport.focusTimeMinutes % 60}m
                  </p>
                </div>

                <div className="rounded-xl bg-stone-950 p-3 border border-stone-800">
                  <span className="text-[11px] text-stone-400">Strongest Area</span>
                  <p className="text-xs font-semibold text-emerald-400 mt-1">
                    {currentWeeklyReport.strongestArea}
                  </p>
                </div>

                <div className="rounded-xl bg-stone-950 p-3 border border-stone-800">
                  <span className="text-[11px] text-stone-400">Needs Attention</span>
                  <p className="text-xs font-semibold text-amber-400 mt-1">
                    {currentWeeklyReport.needsImprovement}
                  </p>
                </div>
              </div>

              {/* Executive Summary */}
              <div>
                <h4 className="text-xs font-semibold text-stone-300 uppercase tracking-wider">Executive Summary</h4>
                <p className="text-xs sm:text-sm text-stone-200 mt-1 leading-relaxed">
                  {currentWeeklyReport.summary}
                </p>
              </div>

              {/* What Went Well & Needs Attention */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-xl bg-stone-950 p-4 border border-stone-800 space-y-2">
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>What Went Well</span>
                  </span>
                  <ul className="space-y-1.5 text-xs text-stone-300 list-disc list-inside">
                    {currentWeeklyReport.whatWentWell.map((w, idx) => (
                      <li key={idx} className="leading-relaxed">{w}</li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-xl bg-stone-950 p-4 border border-stone-800 space-y-2">
                  <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                    <AlertCircle className="h-4 w-4" />
                    <span>What Needs Attention</span>
                  </span>
                  <ul className="space-y-1.5 text-xs text-stone-300 list-disc list-inside">
                    {currentWeeklyReport.whatNeedsAttention.map((n, idx) => (
                      <li key={idx} className="leading-relaxed">{n}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* High-Leverage Recommendation */}
              <div className="rounded-xl bg-emerald-950/30 border border-emerald-800/40 p-4 text-xs text-emerald-200">
                <span className="font-bold text-emerald-400 block mb-1">
                  💡 AI Recommendation for Next Week:
                </span>
                <p className="leading-relaxed">{currentWeeklyReport.recommendation}</p>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-stone-800 bg-stone-900/40 p-12 text-center">
              <FileText className="h-10 w-10 text-stone-600 mx-auto mb-3" />
              <h3 className="text-sm font-semibold text-stone-300">No weekly review generated yet</h3>
              <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                Generate your weekly accountability review to see completed tasks, focus hours, and personalized habit guidance.
              </p>
              <button
                onClick={handleGenerateWeeklyReport}
                className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-semibold text-stone-950 hover:bg-emerald-400"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Generate Weekly Review</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Daily Questions Log Tab */}
      {activeTab === 'daily_questions' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-bold text-stone-100">Daily Accountability Check-in History</h2>
            <p className="text-xs text-stone-400 mt-0.5">
              Review your responses to: "Did you do anything productive today?"
            </p>
          </div>

          {dailyQuestions.length === 0 ? (
            <div className="rounded-2xl border border-stone-800 bg-stone-900/40 p-12 text-center text-xs text-stone-400">
              No daily check-ins recorded yet. Check-ins are prompted each evening at {settings.dailyQuestionTime}.
            </div>
          ) : (
            <div className="space-y-3">
              {dailyQuestions.map((q) => (
                <div key={q.id} className="rounded-xl border border-stone-800 bg-stone-900/60 p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-stone-300">{q.date}</span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        q.response === 'yes'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : q.response === 'not_yet'
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-stone-800 text-stone-400'
                      }`}
                    >
                      {q.response === 'yes' ? 'Yes, productive' : q.response === 'not_yet' ? 'Not yet' : 'No'}
                    </span>
                  </div>
                  {q.details && (
                    <p className="text-xs text-stone-200">
                      <strong>Accomplishment:</strong> "{q.details}"
                    </p>
                  )}
                  {q.aiResponse && (
                    <p className="text-xs text-stone-400 italic">
                      <strong>Coach Note:</strong> {q.aiResponse}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
