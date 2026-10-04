import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import {
  CheckSquare,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Circle,
  Play,
  Clock,
  Flame,
  AlertTriangle,
  Sparkles,
  Calendar,
  Trash2,
  Edit2,
  Loader2,
  ChevronRight,
} from 'lucide-react';
import { Task, TaskPriority, TaskDifficulty, TaskRecurrence } from '../types/index.ts';

interface TasksViewProps {
  onOpenAddTask: () => void;
}

export const TasksView: React.FC<TasksViewProps> = ({ onOpenAddTask }) => {
  const {
    tasks,
    goals,
    completeTask,
    uncompleteTask,
    deleteTask,
    setActiveFocusTask,
    setFocusModeActive,
    setActiveTab,
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<'all' | 'today' | 'upcoming' | 'high_priority' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGoalId, setSelectedGoalId] = useState<string>('all');

  const todayStr = new Date().toISOString().split('T')[0];

  const filteredTasks = tasks.filter((t) => {
    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = t.title.toLowerCase().includes(q);
      const matchDesc = t.description?.toLowerCase().includes(q);
      const matchGoal = t.goalTitle?.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchGoal) return false;
    }

    // Goal match
    if (selectedGoalId !== 'all' && t.goalId !== selectedGoalId) {
      return false;
    }

    // Tab filter
    if (activeFilter === 'today') {
      return t.dueDate === todayStr;
    }
    if (activeFilter === 'upcoming') {
      return t.dueDate > todayStr && t.status !== 'completed';
    }
    if (activeFilter === 'high_priority') {
      return (t.priority === 'High' || t.priority === 'Urgent') && t.status !== 'completed';
    }
    if (activeFilter === 'completed') {
      return t.status === 'completed';
    }

    return true;
  });

  const startTaskInFocusMode = (task: Task) => {
    setActiveFocusTask(task);
    setFocusModeActive(true);
    setActiveTab('focus');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-100">
            Actionable Tasks
          </h1>
          <p className="mt-1 text-sm text-stone-400">
            Break goals into daily, weekly, and milestone actions that sustain consistent momentum.
          </p>
        </div>
        <button
          onClick={onOpenAddTask}
          className="flex items-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-semibold text-stone-950 hover:bg-emerald-400 transition-colors shadow-md shadow-emerald-500/20"
        >
          <Plus className="h-4 w-4" />
          <span>New Task</span>
        </button>
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'All Tasks' },
            { id: 'today', label: 'Due Today' },
            { id: 'upcoming', label: 'Upcoming' },
            { id: 'high_priority', label: 'High Priority' },
            { id: 'completed', label: 'Completed' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
                activeFilter === f.id
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-stone-900 border border-stone-800 text-stone-400 hover:text-stone-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Search and Goal Dropdown */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="h-3.5 w-3.5 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-stone-800 bg-stone-900 pl-8 pr-3 py-1.5 text-xs text-stone-100 placeholder:text-stone-500 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <select
            value={selectedGoalId}
            onChange={(e) => setSelectedGoalId(e.target.value)}
            className="rounded-xl border border-stone-800 bg-stone-900 px-3 py-1.5 text-xs text-stone-300 focus:border-emerald-500 focus:outline-none max-w-xs"
          >
            <option value="all">All Goals</option>
            {goals.map((g) => (
              <option key={g.id} value={g.id}>
                {g.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="rounded-2xl border border-stone-800 bg-stone-900/40 p-12 text-center">
            <CheckSquare className="h-10 w-10 text-stone-600 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-stone-300">No matching tasks found</h3>
            <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
              {searchQuery ? 'Try adjusting your search criteria.' : 'Create a new action to get started.'}
            </p>
            <button
              onClick={onOpenAddTask}
              className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-semibold text-stone-950 hover:bg-emerald-400"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Create Task</span>
            </button>
          </div>
        ) : (
          filteredTasks.map((task) => {
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
                  {/* Complete checkbox */}
                  <button
                    onClick={() => (isCompleted ? uncompleteTask(task.id) : completeTask(task.id))}
                    className="mt-0.5 text-stone-400 hover:text-emerald-400 transition-colors cursor-pointer shrink-0"
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

                      {/* Difficulty */}
                      <span className="rounded-full bg-stone-800/70 px-2 py-0.5 text-[10px] text-stone-400">
                        {task.difficulty}
                      </span>

                      {/* Recurrence */}
                      {task.recurrence && task.recurrence !== 'none' && (
                        <span className="rounded-full bg-indigo-950/40 text-indigo-300 border border-indigo-800/40 px-2 py-0.5 text-[10px] font-medium">
                          🔄 {task.recurrence}
                        </span>
                      )}
                    </div>

                    {task.description && (
                      <p className="text-xs text-stone-400 mt-1 leading-relaxed">{task.description}</p>
                    )}

                    <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-stone-400">
                      {task.goalTitle && (
                        <span className="text-emerald-400/90 font-medium">🎯 {task.goalTitle}</span>
                      )}
                      <span>⏱️ {task.duration} min</span>
                      <span>📅 {task.dueDate === todayStr ? 'Today' : task.dueDate}</span>
                      {task.dueTime && <span>⏰ {task.dueTime}</span>}
                      <span className="text-amber-400/80 font-medium">+{task.rewardPoints || 10} XP</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  {!isCompleted ? (
                    <>
                      <button
                        onClick={() => startTaskInFocusMode(task)}
                        className="flex items-center gap-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 px-3 py-1.5 text-xs font-medium text-stone-200 transition-colors"
                        title="Start Pomodoro/Focus Session"
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
                    <span className="text-xs font-semibold text-emerald-400">✓ Done</span>
                  )}

                  <button
                    onClick={() => deleteTask(task.id)}
                    className="text-stone-500 hover:text-rose-400 p-1.5 rounded-lg transition-colors"
                    title="Delete task"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
