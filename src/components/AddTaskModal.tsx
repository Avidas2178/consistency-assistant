import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import {
  X,
  Sparkles,
  AlertTriangle,
  Clock,
  Calendar,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { TaskPriority, TaskDifficulty, TaskRecurrence, GoalCategory } from '../types/index.ts';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddTaskModal: React.FC<AddTaskModalProps> = ({ isOpen, onClose }) => {
  const { goals, addTask, tasks } = useApp();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [goalId, setGoalId] = useState(goals[0]?.id || '');
  const [priority, setPriority] = useState<TaskPriority>('Medium');
  const [duration, setDuration] = useState<number>(45);
  const [dueDate, setDueDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [dueTime, setDueTime] = useState<string>('20:00');
  const [recurrence, setRecurrence] = useState<TaskRecurrence>('none');
  const [difficulty, setDifficulty] = useState<TaskDifficulty>('Medium');
  const [category, setCategory] = useState<GoalCategory>('Career');
  const [reminder, setReminder] = useState<boolean>(true);

  // AI suggestion state
  const [isCheckingPlan, setIsCheckingPlan] = useState<boolean>(false);
  const [aiSuggestion, setAiSuggestion] = useState<{
    isUnrealistic: boolean;
    suggestion: string;
    recommendedDuration: number;
    reasoning: string;
  } | null>(null);

  if (!isOpen) return null;

  const selectedGoal = goals.find((g) => g.id === goalId);

  const calculateDailyLoad = (targetDate: string) => {
    return tasks
      .filter((t) => t.dueDate === targetDate && t.status !== 'completed')
      .reduce((acc, t) => acc + (t.duration || 30), 0);
  };

  const handleSmartCheck = async () => {
    if (!title.trim()) return;
    const dailyLoad = calculateDailyLoad(dueDate);
    setIsCheckingPlan(true);

    try {
      const res = await fetch('/api/ai/suggest-task-adjustment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskTitle: title,
          duration: Number(duration),
          priority,
          dailyLoadMinutes: dailyLoad,
          existingTasksCount: tasks.filter((t) => t.dueDate === dueDate).length,
        }),
      });
      const data = await res.json();
      if (data.isUnrealistic) {
        setAiSuggestion(data);
      } else {
        // Safe to create immediately
        finalizeCreate();
      }
    } catch (e) {
      finalizeCreate();
    } finally {
      setIsCheckingPlan(false);
    }
  };

  const finalizeCreate = (customDuration?: number) => {
    const finalDuration = customDuration !== undefined ? customDuration : duration;
    const rewardPoints = priority === 'High' || priority === 'Urgent' ? 20 : 10;

    addTask({
      goalId: goalId || undefined,
      goalTitle: selectedGoal?.title,
      title: title.trim(),
      description: description.trim(),
      priority,
      duration: Number(finalDuration),
      dueDate,
      dueTime,
      recurrence,
      difficulty,
      category: selectedGoal?.category || category,
      reminder,
      rewardPoints,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/80 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-2xl border border-stone-800 bg-stone-900 p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-stone-800 pb-3">
          <h3 className="text-base font-bold text-stone-100">Schedule Actionable Task</h3>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-200 p-1">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* AI Overload Intervention Banner */}
        {aiSuggestion && aiSuggestion.isUnrealistic && (
          <div className="rounded-xl border border-amber-800/60 bg-amber-950/30 p-4 space-y-3">
            <div className="flex items-start gap-2.5">
              <Sparkles className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                  AI Smart Task Sizing
                </span>
                <p className="text-xs text-stone-200 mt-1 leading-relaxed">
                  "{aiSuggestion.suggestion}"
                </p>
                <p className="text-[11px] text-amber-400/80 mt-1">{aiSuggestion.reasoning}</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-amber-900/40">
              <button
                type="button"
                onClick={() => finalizeCreate(duration)}
                className="text-xs text-stone-300 hover:text-stone-100 px-3 py-1.5 rounded-lg"
              >
                Keep my original plan ({duration}m)
              </button>
              <button
                type="button"
                onClick={() => finalizeCreate(aiSuggestion.recommendedDuration)}
                className="rounded-xl bg-amber-500 px-3.5 py-1.5 text-xs font-semibold text-stone-950 hover:bg-amber-400 shadow-sm"
              >
                Accept suggestion ({aiSuggestion.recommendedDuration}m)
              </button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {/* Title */}
          <div>
            <label className="text-xs font-semibold text-stone-300">Task Title</label>
            <input
              type="text"
              placeholder="e.g. Study JavaScript Closures & Event Loop"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 w-full rounded-xl border border-stone-800 bg-stone-950 px-3 py-2 text-xs text-stone-100 focus:border-emerald-500 focus:outline-none"
              autoFocus
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-semibold text-stone-300">Description (Optional)</label>
            <input
              type="text"
              placeholder="e.g. Complete chapter 4 exercises and take markdown notes"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 w-full rounded-xl border border-stone-800 bg-stone-950 px-3 py-2 text-xs text-stone-100 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {/* Connect to Goal */}
          <div>
            <label className="text-xs font-semibold text-stone-300">Connect to Goal</label>
            <select
              value={goalId}
              onChange={(e) => setGoalId(e.target.value)}
              className="mt-1 w-full rounded-xl border border-stone-800 bg-stone-950 px-3 py-2 text-xs text-stone-100 focus:border-emerald-500 focus:outline-none"
            >
              <option value="">Independent Task (No goal)</option>
              {goals.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.title}
                </option>
              ))}
            </select>
          </div>

          {/* Duration & Priority */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-stone-300">Estimated Duration (Minutes)</label>
              <input
                type="number"
                min="5"
                max="720"
                step="5"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="mt-1 w-full rounded-xl border border-stone-800 bg-stone-950 px-3 py-2 text-xs text-stone-100 focus:border-emerald-500 focus:outline-none"
              />
              <span className="text-[10px] text-stone-500 mt-0.5 block">Recommended: 25–60 min blocks</span>
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-300">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="mt-1 w-full rounded-xl border border-stone-800 bg-stone-950 px-3 py-2 text-xs text-stone-100 focus:border-emerald-500 focus:outline-none"
              >
                <option value="Low">Low (+10 XP)</option>
                <option value="Medium">Medium (+10 XP)</option>
                <option value="High">High (+20 XP)</option>
                <option value="Urgent">Urgent (+20 XP)</option>
              </select>
            </div>
          </div>

          {/* Due Date & Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-stone-300">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="mt-1 w-full rounded-xl border border-stone-800 bg-stone-950 px-3 py-2 text-xs text-stone-100 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-300">Due Time</label>
              <input
                type="time"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                className="mt-1 w-full rounded-xl border border-stone-800 bg-stone-950 px-3 py-2 text-xs text-stone-100 focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Recurrence & Difficulty */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-stone-300">Recurrence</label>
              <select
                value={recurrence}
                onChange={(e) => setRecurrence(e.target.value as TaskRecurrence)}
                className="mt-1 w-full rounded-xl border border-stone-800 bg-stone-950 px-3 py-2 text-xs text-stone-100 focus:border-emerald-500 focus:outline-none"
              >
                <option value="none">One-time Task</option>
                <option value="daily">Daily</option>
                <option value="weekdays">Weekdays (Mon-Fri)</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-300">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as TaskDifficulty)}
                className="mt-1 w-full rounded-xl border border-stone-800 bg-stone-950 px-3 py-2 text-xs text-stone-100 focus:border-emerald-500 focus:outline-none"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>
        </div>

        {/* Footer buttons */}
        <div className="flex items-center justify-between border-t border-stone-800 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-stone-400 hover:text-stone-200"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSmartCheck}
            disabled={!title.trim() || isCheckingPlan}
            className="flex items-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-semibold text-stone-950 hover:bg-emerald-400 transition-colors disabled:opacity-50"
          >
            {isCheckingPlan ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <CheckCircle2 className="h-3.5 w-3.5" />
            )}
            <span>Save & Schedule</span>
          </button>
        </div>
      </div>
    </div>
  );
};
