import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  Plus,
  Trash2,
  Calendar,
  Clock,
  Compass,
  Heart,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import { GoalCategory, CommitmentLevel, AccountabilityPreference, PreferredTime } from '../types/index.ts';

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: (data: any) => void;
  onCancel?: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onComplete, onCancel }) => {
  const [step, setStep] = useState<number>(1);
  const totalSteps = 8;

  // Form State
  const [name, setName] = useState<string>('Victor');
  const [goalTitle, setGoalTitle] = useState<string>('Learn frontend development');
  const [reason, setReason] = useState<string>(
    'I want to secure a high-impact remote job, build software people love, and support my family.'
  );
  const [category, setCategory] = useState<GoalCategory>('Career');
  const [deadlineType, setDeadlineType] = useState<any>('monthly');
  const [specificDate, setSpecificDate] = useState<string>('');
  const [commitmentLevel, setCommitmentLevel] = useState<CommitmentLevel>('Very Serious');
  const [preferredTime, setPreferredTime] = useState<PreferredTime>('Evening');
  const [accountabilityPreference, setAccountabilityPreference] = useState<AccountabilityPreference>('AI Coach');

  // AI Breakdown Step
  const [isGeneratingBreakdown, setIsGeneratingBreakdown] = useState<boolean>(false);
  const [showBreakdownReview, setShowBreakdownReview] = useState<boolean>(false);
  const [milestones, setMilestones] = useState<Array<{ title: string; description: string }>>([]);
  const [newMilestoneTitle, setNewMilestoneTitle] = useState<string>('');
  const [coachingTip, setCoachingTip] = useState<string>('');

  if (!isOpen) return null;

  const categories: GoalCategory[] = [
    'Career',
    'Education',
    'Business',
    'Health & Fitness',
    'Finance',
    'Personal Development',
    'Creativity',
    'Relationships',
    'Faith/Spirituality',
    'Other',
  ];

  const goalExamples = [
    'Learn frontend development',
    'Exercise consistently',
    'Pass my certification exams',
    'Build and launch my SaaS',
    'Read 24 books this year',
    'Learn UI/UX design',
    'Save $10,000 emergency fund',
  ];

  const handleNext = async () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // Step 8 complete -> Trigger AI Goal Breakdown!
      setIsGeneratingBreakdown(true);
      setShowBreakdownReview(true);

      try {
        const response = await fetch('/api/ai/breakdown-goal', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            goalTitle,
            reason,
            category,
            deadlineType,
            commitmentLevel,
          }),
        });

        const data = await response.json();
        if (data.milestones && data.milestones.length > 0) {
          setMilestones(
            data.milestones.map((m: any) => ({
              title: m.title,
              description: m.description || '',
            }))
          );
        } else {
          // Fallback initial milestones
          setMilestones([
            { title: 'HTML & Modern CSS Fundamentals', description: 'Layouts, responsiveness, and clean markup.' },
            { title: 'JavaScript & Async Programming', description: 'Core syntax, async/await, and DOM manipulation.' },
            { title: 'React 19 & State Architecture', description: 'Components, hooks, and modern frontend patterns.' },
            { title: 'Portfolio Project Execution', description: 'Build and deploy real-world apps with source code.' },
          ]);
        }
        if (data.coachingTip) {
          setCoachingTip(data.coachingTip);
        }
      } catch (err) {
        setMilestones([
          { title: 'Phase 1: Fundamentals & Core Concepts', description: 'Mastering the non-negotiables.' },
          { title: 'Phase 2: Project Practice', description: 'Applying skills to real deliverables.' },
          { title: 'Phase 3: Portfolio & Execution', description: 'Polishing and sharing your work.' },
        ]);
      } finally {
        setIsGeneratingBreakdown(false);
      }
    }
  };

  const handlePrev = () => {
    if (showBreakdownReview) {
      setShowBreakdownReview(false);
    } else if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleAddMilestone = () => {
    if (!newMilestoneTitle.trim()) return;
    setMilestones([...milestones, { title: newMilestoneTitle.trim(), description: 'Custom milestone' }]);
    setNewMilestoneTitle('');
  };

  const handleDeleteMilestone = (idx: number) => {
    setMilestones(milestones.filter((_, i) => i !== idx));
  };

  const handleFinalSubmit = () => {
    onComplete({
      name,
      goalTitle,
      reason,
      category,
      deadlineType: specificDate ? 'specific_date' : deadlineType,
      deadlineDate: specificDate,
      commitmentLevel,
      preferredTime,
      accountabilityPreference,
      milestones,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/80 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-xl rounded-2xl border border-stone-800 bg-stone-900 p-6 sm:p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Progress Bar */}
        {!showBreakdownReview && (
          <div className="mb-6">
            <div className="flex items-center justify-between text-xs text-stone-400 mb-2">
              <span className="font-medium text-emerald-400">Step {step} of {totalSteps}</span>
              <span>{Math.round((step / totalSteps) * 100)}% completed</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-stone-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300"
                style={{ width: `${(step / totalSteps) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Step Contents */}
        {!showBreakdownReview ? (
          <div>
            {/* Step 1: Name */}
            {step === 1 && (
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-stone-100">What's your name?</h3>
                <p className="text-xs text-stone-400 mt-1">We'll use this to personalize your accountability coaching.</p>
                <div className="mt-6">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name (e.g., Victor)"
                    className="w-full rounded-xl border border-stone-800 bg-stone-950 px-4 py-3 text-stone-100 placeholder:text-stone-600 focus:border-emerald-500 focus:outline-none text-base"
                    autoFocus
                  />
                </div>
              </div>
            )}

            {/* Step 2: Main Goal */}
            {step === 2 && (
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-stone-100">
                  What are you currently trying to achieve?
                </h3>
                <p className="text-xs text-stone-400 mt-1">
                  Name the primary goal you want to follow through on without dropping off.
                </p>
                <div className="mt-4">
                  <input
                    type="text"
                    value={goalTitle}
                    onChange={(e) => setGoalTitle(e.target.value)}
                    placeholder="e.g. Learn frontend development"
                    className="w-full rounded-xl border border-stone-800 bg-stone-950 px-4 py-3 text-stone-100 placeholder:text-stone-600 focus:border-emerald-500 focus:outline-none text-base"
                    autoFocus
                  />
                </div>
                <div className="mt-4">
                  <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
                    Quick suggestions:
                  </span>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {goalExamples.map((ex) => (
                      <button
                        key={ex}
                        type="button"
                        onClick={() => setGoalTitle(ex)}
                        className="rounded-lg border border-stone-800 bg-stone-950 px-2.5 py-1 text-xs text-stone-300 hover:border-emerald-500/50 hover:text-emerald-400 transition-colors"
                      >
                        {ex}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Why */}
            {step === 3 && (
              <div>
                <div className="flex items-center gap-2 text-emerald-400 mb-1">
                  <Heart className="h-4 w-4" />
                  <span className="text-xs font-semibold uppercase tracking-wider">The Motivation Anchor</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-stone-100">Why is this goal important to you?</h3>
                <p className="text-xs text-stone-400 mt-1">
                  When motivation dips or life gets busy, your AI coach will remind you of this exact reason.
                </p>
                <div className="mt-6">
                  <textarea
                    rows={4}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="e.g. I want to build the skills that can help me land a remote job, gain financial freedom, and support my family."
                    className="w-full rounded-xl border border-stone-800 bg-stone-950 p-4 text-stone-100 placeholder:text-stone-600 focus:border-emerald-500 focus:outline-none text-sm leading-relaxed"
                  />
                </div>
              </div>
            )}

            {/* Step 4: Category */}
            {step === 4 && (
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-stone-100">Select Goal Category</h3>
                <p className="text-xs text-stone-400 mt-1">Categorizing your goal helps organize your weekly reviews.</p>
                <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`flex items-center justify-between rounded-xl p-3 text-xs font-medium border text-left transition-all ${
                        category === cat
                          ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300 shadow-sm'
                          : 'border-stone-800 bg-stone-950/60 text-stone-300 hover:border-stone-700'
                      }`}
                    >
                      <span>{cat}</span>
                      {category === cat && <Check className="h-3.5 w-3.5 text-emerald-400" />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 5: Deadline */}
            {step === 5 && (
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-stone-100">What is your target deadline?</h3>
                <p className="text-xs text-stone-400 mt-1">
                  Deadlines create healthy urgency. Choose a pacing structure that fits your reality.
                </p>
                <div className="mt-6 space-y-2.5">
                  {[
                    { id: 'none', label: 'No hard deadline (Continuous habit)' },
                    { id: 'weekly', label: 'Weekly milestone goal' },
                    { id: 'monthly', label: 'Monthly objective (30–60 days)' },
                    { id: 'yearly', label: 'Yearly vision (Quarterly benchmarks)' },
                    { id: 'specific_date', label: 'Specific target date' },
                  ].map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => setDeadlineType(d.id)}
                      className={`flex w-full items-center justify-between rounded-xl p-3 text-xs font-medium border text-left transition-all ${
                        deadlineType === d.id
                          ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300'
                          : 'border-stone-800 bg-stone-950/60 text-stone-300 hover:border-stone-700'
                      }`}
                    >
                      <span>{d.label}</span>
                      {deadlineType === d.id && <Check className="h-3.5 w-3.5 text-emerald-400" />}
                    </button>
                  ))}
                </div>

                {deadlineType === 'specific_date' && (
                  <div className="mt-4">
                    <input
                      type="date"
                      value={specificDate}
                      onChange={(e) => setSpecificDate(e.target.value)}
                      className="w-full rounded-xl border border-stone-800 bg-stone-950 px-4 py-2.5 text-xs text-stone-100 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Step 6: Commitment Level */}
            {step === 6 && (
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-stone-100">How serious are you about this goal?</h3>
                <p className="text-xs text-stone-400 mt-1">
                  Be honest with yourself. This shapes how strictly your schedule is weighted.
                </p>
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { id: 'Casual', desc: '1–2 sessions a week. Low pressure exploration.' },
                    { id: 'Moderate', desc: '3–4 focused sessions. Steady, reliable progress.' },
                    { id: 'Serious', desc: '5 sessions a week. High priority in your routine.' },
                    { id: 'Very Serious', desc: 'Daily non-negotiable priority. Relentless execution.' },
                  ].map((lvl) => (
                    <button
                      key={lvl.id}
                      type="button"
                      onClick={() => setCommitmentLevel(lvl.id as CommitmentLevel)}
                      className={`rounded-xl p-4 text-left border transition-all ${
                        commitmentLevel === lvl.id
                          ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300'
                          : 'border-stone-800 bg-stone-950/60 text-stone-300 hover:border-stone-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm">{lvl.id}</span>
                        {commitmentLevel === lvl.id && <Check className="h-3.5 w-3.5 text-emerald-400" />}
                      </div>
                      <p className="mt-1 text-xs text-stone-400">{lvl.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 7: Preferred Productivity Time */}
            {step === 7 && (
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-stone-100">
                  When do you do your most focused work?
                </h3>
                <p className="text-xs text-stone-400 mt-1">
                  We'll suggest scheduling high-cognitive tasks during your peak energy hours.
                </p>
                <div className="mt-6 grid grid-cols-2 gap-3">
                  {[
                    { id: 'Morning', label: 'Morning (6 AM - 12 PM)', icon: '🌅' },
                    { id: 'Afternoon', label: 'Afternoon (12 PM - 5 PM)', icon: '☀️' },
                    { id: 'Evening', label: 'Evening (5 PM - 10 PM)', icon: '🌙' },
                    { id: 'Custom schedule', label: 'Flexible / Shift schedule', icon: '⏱️' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setPreferredTime(t.id as PreferredTime)}
                      className={`flex flex-col rounded-xl p-4 text-left border transition-all ${
                        preferredTime === t.id
                          ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300'
                          : 'border-stone-800 bg-stone-950/60 text-stone-300 hover:border-stone-700'
                      }`}
                    >
                      <span className="text-xl mb-1">{t.icon}</span>
                      <span className="font-semibold text-xs text-stone-100">{t.id}</span>
                      <span className="text-[11px] text-stone-400 mt-0.5">{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 8: Accountability Preference */}
            {step === 8 && (
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-stone-100">How should we keep you accountable?</h3>
                <p className="text-xs text-stone-400 mt-1">
                  Choose the communication style of your assistant. You can change this anytime in settings.
                </p>
                <div className="mt-6 space-y-3">
                  {[
                    {
                      id: 'Gentle',
                      desc: 'Quiet nudges, zero pressure. Ideal if you are prone to overwhelm.',
                    },
                    {
                      id: 'Balanced',
                      desc: 'Regular daily check-ins with clear, supportive reminders.',
                    },
                    {
                      id: 'Strict',
                      desc: 'Direct accountability questions, assertive reminders, and firm streak alerts.',
                    },
                    {
                      id: 'AI Coach',
                      desc: 'Intelligent proactive partner that analyzes completion patterns and recommends habit tweaks.',
                    },
                  ].map((acc) => (
                    <button
                      key={acc.id}
                      type="button"
                      onClick={() => setAccountabilityPreference(acc.id as AccountabilityPreference)}
                      className={`flex w-full items-start justify-between rounded-xl p-4 text-left border transition-all ${
                        accountabilityPreference === acc.id
                          ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300'
                          : 'border-stone-800 bg-stone-950/60 text-stone-300 hover:border-stone-700'
                      }`}
                    >
                      <div>
                        <span className="font-semibold text-sm text-stone-100">{acc.id}</span>
                        <p className="text-xs text-stone-400 mt-1">{acc.desc}</p>
                      </div>
                      {accountabilityPreference === acc.id && (
                        <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="mt-8 flex items-center justify-between border-t border-stone-800/80 pt-4">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="flex items-center gap-1.5 text-xs text-stone-400 hover:text-stone-200 px-3 py-2 rounded-lg"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Back</span>
                </button>
              ) : (
                <div></div>
              )}

              <button
                type="button"
                onClick={handleNext}
                disabled={step === 2 && !goalTitle.trim()}
                className="flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-xs font-semibold text-stone-950 hover:bg-emerald-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>{step === totalSteps ? 'Generate AI Roadmap' : 'Continue'}</span>
                {step === totalSteps ? <Sparkles className="h-3.5 w-3.5" /> : <ArrowRight className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>
        ) : (
          /* Step 9: AI Roadmap Review */
          <div>
            <div className="flex items-center gap-2 text-emerald-400 mb-2">
              <Sparkles className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">AI Goal Breakdown</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-stone-100">Review Your Action Roadmap</h3>
            <p className="text-xs text-stone-400 mt-1">
              AI structured your goal into sequential milestones. You have complete control to accept, edit, or customize.
            </p>

            {isGeneratingBreakdown ? (
              <div className="py-16 text-center">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-500 mx-auto mb-3" />
                <p className="text-sm font-semibold text-stone-200">Analyzing goal: "{goalTitle}"...</p>
                <p className="text-xs text-stone-400 mt-1">Structuring milestones and actionable tasks...</p>
              </div>
            ) : (
              <div className="mt-4">
                {coachingTip && (
                  <div className="mb-4 rounded-xl bg-emerald-950/30 border border-emerald-800/40 p-3 text-xs text-emerald-300">
                    💡 <span className="font-semibold">Coaching Note:</span> {coachingTip}
                  </div>
                )}

                <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                  {milestones.map((m, idx) => (
                    <div
                      key={idx}
                      className="flex items-start justify-between gap-3 rounded-xl border border-stone-800 bg-stone-950 p-3"
                    >
                      <div className="flex items-start gap-2.5">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-[11px] font-bold text-emerald-400">
                          {idx + 1}
                        </span>
                        <div>
                          <p className="text-xs font-semibold text-stone-200">{m.title}</p>
                          {m.description && <p className="text-[11px] text-stone-400 mt-0.5">{m.description}</p>}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteMilestone(idx)}
                        className="text-stone-500 hover:text-red-400 transition-colors p-1"
                        title="Remove milestone"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add Custom Milestone */}
                <div className="mt-3 flex gap-2">
                  <input
                    type="text"
                    value={newMilestoneTitle}
                    onChange={(e) => setNewMilestoneTitle(e.target.value)}
                    placeholder="Add an extra milestone..."
                    className="flex-1 rounded-xl border border-stone-800 bg-stone-950 px-3 py-2 text-xs text-stone-200 focus:border-emerald-500 focus:outline-none"
                    onKeyDown={(e) => e.key === 'Enter' && handleAddMilestone()}
                  />
                  <button
                    type="button"
                    onClick={handleAddMilestone}
                    className="flex items-center gap-1 rounded-xl bg-stone-800 hover:bg-stone-700 px-3 py-2 text-xs font-medium text-stone-200 transition-colors"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add</span>
                  </button>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-stone-800/80 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowBreakdownReview(false)}
                    className="text-xs text-stone-400 hover:text-stone-200"
                  >
                    Back to questions
                  </button>

                  <button
                    type="button"
                    onClick={handleFinalSubmit}
                    className="flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-xs font-semibold text-stone-950 hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Accept Plan & Enter Dashboard</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
