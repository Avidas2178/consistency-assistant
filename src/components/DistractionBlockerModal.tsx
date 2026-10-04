import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import {
  ShieldAlert,
  Clock,
  Coffee,
  Calendar,
  X,
  Play,
  ArrowRight,
} from 'lucide-react';

export const DistractionBlockerModal: React.FC = () => {
  const {
    distractionInterventionTask,
    dismissDistractionIntervention,
    setActiveFocusTask,
    setFocusModeActive,
    setActiveTab,
    updateSettings,
    settings,
  } = useApp();

  if (!distractionInterventionTask) return null;

  const handleStartTask = () => {
    setActiveFocusTask(distractionInterventionTask);
    setFocusModeActive(true);
    setActiveTab('focus');
    dismissDistractionIntervention();
  };

  const handleTakeBreak = () => {
    dismissDistractionIntervention();
  };

  const handleDisableBlocker = () => {
    updateSettings({ distractionBlockingEnabled: false });
    dismissDistractionIntervention();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/85 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-3xl border border-rose-900/50 bg-stone-900 p-6 sm:p-8 shadow-2xl text-center space-y-6 animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={dismissDistractionIntervention}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-200 p-1"
          title="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Shield Icon */}
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20 shadow-lg shadow-rose-950/40">
          <ShieldAlert className="h-7 w-7" />
        </div>

        <div>
          <span className="text-[11px] font-semibold text-rose-400 uppercase tracking-wider">
            Distraction Intervention Shield
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-stone-100 mt-1">
            Your task isn't complete yet.
          </h2>
          <p className="text-xs text-stone-400 mt-2 max-w-sm mx-auto leading-relaxed">
            You planned to focus on high-priority work before surfing distracting feeds.
          </p>
        </div>

        {/* Intercepted Task Card */}
        <div className="rounded-2xl border border-stone-800 bg-stone-950 p-4 text-left">
          <span className="text-[10px] uppercase font-bold text-amber-400">Scheduled Objective</span>
          <h4 className="text-sm font-bold text-stone-100 mt-0.5">
            {distractionInterventionTask.title}
          </h4>
          <div className="mt-2 flex items-center gap-3 text-[11px] text-stone-400">
            <span>⏱️ {distractionInterventionTask.duration} minutes</span>
            <span>🚨 Priority: {distractionInterventionTask.priority}</span>
            <span className="text-amber-400">+{distractionInterventionTask.rewardPoints || 20} XP</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          <button
            onClick={handleStartTask}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3 text-xs font-bold text-stone-950 hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20 cursor-pointer"
          >
            <Play className="h-4 w-4 fill-stone-950" />
            <span>Start Task Now ({distractionInterventionTask.duration}m)</span>
          </button>

          <button
            onClick={handleTakeBreak}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-stone-800 py-2.5 text-xs font-semibold text-stone-300 hover:bg-stone-700 hover:text-white transition-colors cursor-pointer"
          >
            <Coffee className="h-4 w-4 text-teal-400" />
            <span>Take a 10-minute intentional break</span>
          </button>

          <div className="flex items-center justify-center gap-4 pt-2">
            <button
              onClick={dismissDistractionIntervention}
              className="text-xs text-stone-400 hover:text-stone-200 underline"
            >
              Reschedule task
            </button>
            <span className="text-stone-700">•</span>
            <button
              onClick={handleDisableBlocker}
              className="text-xs text-stone-400 hover:text-rose-400 underline"
            >
              Disable distraction shield
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
