import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import {
  Target,
  Plus,
  Sparkles,
  CheckCircle2,
  Circle,
  Clock,
  Trash2,
  Edit2,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  HelpCircle,
  Loader2,
  Heart,
} from 'lucide-react';
import { Goal, GoalCategory, Milestone } from '../types/index.ts';

export const GoalsView: React.FC = () => {
  const { goals, addGoal, updateGoal, deleteGoal, addMilestone, updateMilestone, deleteMilestone, tasks } = useApp();

  const [expandedGoalId, setExpandedGoalId] = useState<string | null>(goals[0]?.id || null);
  const [showAddGoalModal, setShowAddGoalModal] = useState<boolean>(false);
  const [isAiBreakingDown, setIsAiBreakingDown] = useState<boolean>(false);

  // New Goal Form State
  const [newTitle, setNewTitle] = useState('');
  const [newReason, setNewReason] = useState('');
  const [newCategory, setNewCategory] = useState<GoalCategory>('Career');
  const [newDeadlineType, setNewDeadlineType] = useState<any>('monthly');
  const [newCommitment, setNewCommitment] = useState<any>('Serious');

  // New Milestone Form State
  const [newMilestoneTitle, setNewMilestoneTitle] = useState('');
  const [newMilestoneDesc, setNewMilestoneDesc] = useState('');
  const [addingToGoalId, setAddingToGoalId] = useState<string | null>(null);

  const handleCreateGoal = async (useAiBreakdown = false) => {
    if (!newTitle.trim() || !newReason.trim()) return;

    let generatedMilestones: any[] = [];
    if (useAiBreakdown) {
      setIsAiBreakingDown(true);
      try {
        const res = await fetch('/api/ai/breakdown-goal', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            goalTitle: newTitle,
            reason: newReason,
            category: newCategory,
            deadlineType: newDeadlineType,
            commitmentLevel: newCommitment,
          }),
        });
        const data = await res.json();
        if (data.milestones) {
          generatedMilestones = data.milestones.map((m: any, idx: number) => ({
            id: 'm-' + Date.now() + '-' + idx,
            title: m.title,
            description: m.description || '',
            order: idx + 1,
            status: idx === 0 ? 'in_progress' : 'pending',
          }));
        }
      } catch (e) { }
      setIsAiBreakingDown(false);
    }

    const created = addGoal(
      {
        title: newTitle,
        reason: newReason,
        category: newCategory,
        deadlineType: newDeadlineType,
        commitmentLevel: newCommitment,
        status: 'active',
      },
      generatedMilestones.length > 0 ? generatedMilestones : undefined
    );

    setExpandedGoalId(created.id);
    setShowAddGoalModal(false);
    setNewTitle('');
    setNewReason('');
  };

  const handleAiBreakdownExisting = async (goal: Goal) => {
    setIsAiBreakingDown(true);
    try {
      const res = await fetch('/api/ai/breakdown-goal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goalTitle: goal.title,
          reason: goal.reason,
          category: goal.category,
          deadlineType: goal.deadlineType,
          commitmentLevel: goal.commitmentLevel,
        }),
      });
      const data = await res.json();
      if (data.milestones && data.milestones.length > 0) {
        data.milestones.forEach((m: any, idx: number) => {
          addMilestone(goal.id, {
            title: m.title,
            description: m.description || '',
            order: (goal.milestones?.length || 0) + idx + 1,
            status: 'pending',
          });
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAiBreakingDown(false);
    }
  };

  const handleAddSingleMilestone = (goalId: string) => {
    if (!newMilestoneTitle.trim()) return;
    const currentGoal = goals.find((g) => g.id === goalId);
    addMilestone(goalId, {
      title: newMilestoneTitle.trim(),
      description: newMilestoneDesc.trim(),
      order: (currentGoal?.milestones?.length || 0) + 1,
      status: 'pending',
    });
    setNewMilestoneTitle('');
    setNewMilestoneDesc('');
    setAddingToGoalId(null);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-100">
            Meaningful Goals & Milestones
          </h1>
          <p className="mt-1 text-sm text-stone-400">
            Every goal is tied to your emotional "Why" and broken down into actionable steps.
          </p>
        </div>
        <button
          onClick={() => setShowAddGoalModal(true)}
          className="flex items-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-semibold text-stone-950 hover:bg-emerald-400 transition-colors shadow-md shadow-emerald-500/20"
        >
          <Plus className="h-4 w-4" />
          <span>New Goal</span>
        </button>
      </div>

      {/* Goals List */}
      <div className="space-y-6">
        {goals.map((goal) => {
          const isExpanded = expandedGoalId === goal.id;
          const completedMilestones = goal.milestones?.filter((m) => m.status === 'completed') || [];
          const totalMilestones = goal.milestones?.length || 0;
          const milestonePercent = totalMilestones > 0 ? Math.round((completedMilestones.length / totalMilestones) * 100) : 0;
          const goalTasks = tasks.filter((t) => t.goalId === goal.id);

          return (
            <div
              key={goal.id}
              className="rounded-2xl border border-stone-800 bg-stone-900/60 shadow-xl overflow-hidden transition-all"
            >
              {/* Goal Card Header */}
              <div className="p-5 sm:p-6 border-b border-stone-800/80">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400 border border-emerald-500/20">
                        {goal.category}
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold border ${
                          goal.health === 'on_track'
                            ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800/50'
                            : goal.health === 'needs_attention'
                            ? 'bg-amber-950/40 text-amber-300 border-amber-800/50'
                            : 'bg-rose-950/40 text-rose-300 border-rose-800/50'
                        }`}
                      >
                        {goal.health === 'on_track'
                          ? '🟢 On Track'
                          : goal.health === 'needs_attention'
                          ? '🟡 Needs Attention'
                          : '🔴 At Risk'}
                      </span>
                      <span className="text-xs text-stone-400">
                        Commitment: <strong>{goal.commitmentLevel}</strong>
                      </span>
                    </div>

                    <h2 className="text-xl font-bold text-stone-100 mt-2">{goal.title}</h2>

                    {/* Emotional Reason ("Why") */}
                    <div className="mt-2 flex items-start gap-2 text-xs text-stone-300 bg-stone-950/60 p-3 rounded-xl border border-stone-800/70">
                      <Heart className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                      <p className="leading-relaxed">
                        <strong className="text-emerald-400">Why this matters:</strong> "{goal.reason}"
                      </p>
                    </div>

                    {/* AI Health explanation */}
                    <p className="mt-2 text-xs text-stone-400 flex items-center gap-1.5">
                      <AlertCircle className="h-3.5 w-3.5 text-stone-500" />
                      <span>{goal.healthReason}</span>
                    </p>
                  </div>

                  {/* Goal Score & Actions */}
                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right">
                      <span className="text-xs text-stone-400 block">Goal Score</span>
                      <span className="text-2xl font-black text-stone-100">{goal.score}</span>
                      <span className="text-[11px] text-stone-400 block">
                        {completedMilestones.length}/{totalMilestones} Milestones
                      </span>
                    </div>

                    <button
                      onClick={() => setExpandedGoalId(isExpanded ? null : goal.id)}
                      className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors"
                    >
                      {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-4 w-full bg-stone-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full transition-all duration-300"
                    style={{ width: `${milestonePercent}%` }}
                  />
                </div>
              </div>

              {/* Milestones Roadmap Panel */}
              {isExpanded && (
                <div className="p-5 sm:p-6 bg-stone-950/40 space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-stone-200">Milestone Roadmap</h3>
                      <span className="rounded-full bg-stone-800 px-2 py-0.5 text-xs text-stone-400">
                        {totalMilestones} steps
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleAiBreakdownExisting(goal)}
                        disabled={isAiBreakingDown}
                        className="flex items-center gap-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1.5 text-xs font-semibold transition-all disabled:opacity-50"
                      >
                        {isAiBreakingDown ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Sparkles className="h-3.5 w-3.5" />
                        )}
                        <span>AI Expand Milestones</span>
                      </button>

                      <button
                        onClick={() => setAddingToGoalId(goal.id)}
                        className="flex items-center gap-1 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 px-3 py-1.5 text-xs font-medium transition-colors"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>Add Milestone</span>
                      </button>
                    </div>
                  </div>

                  {/* Milestones List */}
                  {goal.milestones && goal.milestones.length > 0 ? (
                    <div className="space-y-3">
                      {goal.milestones.map((m, idx) => {
                        const isDone = m.status === 'completed';
                        const inProg = m.status === 'in_progress';
                        return (
                          <div
                            key={m.id}
                            className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border transition-all ${
                              isDone
                                ? 'bg-stone-900/30 border-stone-800/40 opacity-80'
                                : inProg
                                ? 'bg-emerald-950/20 border-emerald-800/40'
                                : 'bg-stone-900/60 border-stone-800'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <button
                                onClick={() =>
                                  updateMilestone(goal.id, m.id, {
                                    status: isDone ? 'pending' : 'completed',
                                  })
                                }
                                className="mt-0.5 cursor-pointer text-stone-400 hover:text-emerald-400"
                              >
                                {isDone ? (
                                  <CheckCircle2 className="h-5 w-5 text-emerald-400 fill-emerald-400/20" />
                                ) : (
                                  <Circle className="h-5 w-5 text-stone-600" />
                                )}
                              </button>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-bold text-stone-500">#{idx + 1}</span>
                                  <h4
                                    className={`text-sm font-semibold ${
                                      isDone ? 'line-through text-stone-500' : 'text-stone-100'
                                    }`}
                                  >
                                    {m.title}
                                  </h4>
                                  <span
                                    className={`rounded-full px-2 py-0.2 text-[10px] font-medium ${
                                      isDone
                                        ? 'bg-emerald-500/20 text-emerald-400'
                                        : inProg
                                        ? 'bg-amber-500/20 text-amber-300'
                                        : 'bg-stone-800 text-stone-400'
                                    }`}
                                  >
                                    {isDone ? 'Completed' : inProg ? 'In Progress' : 'Pending'}
                                  </span>
                                </div>
                                {m.description && (
                                  <p className="text-xs text-stone-400 mt-1">{m.description}</p>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-2 self-end sm:self-center">
                              {!isDone && (
                                <button
                                  onClick={() =>
                                    updateMilestone(goal.id, m.id, {
                                      status: inProg ? 'pending' : 'in_progress',
                                    })
                                  }
                                  className="text-xs text-stone-400 hover:text-stone-200 px-2 py-1 rounded bg-stone-800"
                                >
                                  {inProg ? 'Mark pending' : 'Set In-Progress'}
                                </button>
                              )}
                              <button
                                onClick={() => deleteMilestone(goal.id, m.id)}
                                className="text-stone-500 hover:text-rose-400 p-1 rounded"
                                title="Delete milestone"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-xs text-stone-400">
                      No milestones created yet. Use AI Breakdown or add your first step.
                    </div>
                  )}

                  {/* Add Milestone Inline Form */}
                  {addingToGoalId === goal.id && (
                    <div className="rounded-xl border border-stone-800 bg-stone-900 p-4 space-y-3">
                      <h4 className="text-xs font-semibold text-stone-200">New Milestone</h4>
                      <input
                        type="text"
                        placeholder="Milestone title (e.g. Master CSS Flexbox & Grid)"
                        value={newMilestoneTitle}
                        onChange={(e) => setNewMilestoneTitle(e.target.value)}
                        className="w-full rounded-xl border border-stone-800 bg-stone-950 px-3 py-2 text-xs text-stone-100 focus:border-emerald-500 focus:outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Description (optional)"
                        value={newMilestoneDesc}
                        onChange={(e) => setNewMilestoneDesc(e.target.value)}
                        className="w-full rounded-xl border border-stone-800 bg-stone-950 px-3 py-2 text-xs text-stone-100 focus:border-emerald-500 focus:outline-none"
                      />
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setAddingToGoalId(null)}
                          className="text-xs text-stone-400 hover:text-stone-200 px-3 py-1.5"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleAddSingleMilestone(goal.id)}
                          className="rounded-xl bg-emerald-500 px-3.5 py-1.5 text-xs font-semibold text-stone-950 hover:bg-emerald-400"
                        >
                          Add Step
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Associated Tasks Summary */}
                  <div className="pt-4 border-t border-stone-800/80">
                    <span className="text-xs text-stone-400">
                      Connected Tasks: <strong className="text-stone-200">{goalTasks.length} total</strong> ({goalTasks.filter(t => t.status === 'completed').length} completed)
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Goal Modal */}
      {showAddGoalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/80 p-4 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-2xl border border-stone-800 bg-stone-900 p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-stone-100">Create New Goal</h3>

            <div>
              <label className="text-xs font-semibold text-stone-300">Goal Title</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Master Full-Stack Web Development"
                className="mt-1 w-full rounded-xl border border-stone-800 bg-stone-950 px-3 py-2 text-xs text-stone-100 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-300 flex items-center gap-1.5">
                <Heart className="h-3.5 w-3.5 text-emerald-400" />
                <span>Why does this goal matter to you? (Emotional Anchor)</span>
              </label>
              <textarea
                rows={3}
                value={newReason}
                onChange={(e) => setNewReason(e.target.value)}
                placeholder="e.g. To earn enough to support my family, work remotely with autonomy, and build things that help people."
                className="mt-1 w-full rounded-xl border border-stone-800 bg-stone-950 p-3 text-xs text-stone-100 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-stone-300">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as GoalCategory)}
                  className="mt-1 w-full rounded-xl border border-stone-800 bg-stone-950 px-3 py-2 text-xs text-stone-100 focus:border-emerald-500 focus:outline-none"
                >
                  <option value="Career">Career</option>
                  <option value="Education">Education</option>
                  <option value="Business">Business</option>
                  <option value="Health & Fitness">Health & Fitness</option>
                  <option value="Finance">Finance</option>
                  <option value="Personal Development">Personal Development</option>
                  <option value="Creativity">Creativity</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-300">Commitment Level</label>
                <select
                  value={newCommitment}
                  onChange={(e) => setNewCommitment(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-stone-800 bg-stone-950 px-3 py-2 text-xs text-stone-100 focus:border-emerald-500 focus:outline-none"
                >
                  <option value="Casual">Casual</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Serious">Serious</option>
                  <option value="Very Serious">Very Serious</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-stone-800/80 pt-4">
              <button
                type="button"
                onClick={() => setShowAddGoalModal(false)}
                className="text-xs text-stone-400 hover:text-stone-200"
              >
                Cancel
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCreateGoal(true)}
                  disabled={isAiBreakingDown || !newTitle.trim()}
                  className="flex items-center gap-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 px-3.5 py-2 text-xs font-medium text-emerald-400 transition-colors"
                >
                  {isAiBreakingDown ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
                  <span>Auto-Breakdown with AI</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleCreateGoal(false)}
                  disabled={!newTitle.trim()}
                  className="rounded-xl bg-emerald-500 px-4 py-2 text-xs font-semibold text-stone-950 hover:bg-emerald-400 transition-colors"
                >
                  Save Goal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
