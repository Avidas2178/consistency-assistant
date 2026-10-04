import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext.tsx';
import {
  Clock,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Volume2,
  VolumeX,
  Coffee,
  Sparkles,
  Flame,
  Award,
} from 'lucide-react';
import { playFocusBellSound, playCompletionSound } from '../utils/audio.ts';

export const FocusView: React.FC = () => {
  const {
    tasks,
    activeFocusTask,
    setActiveFocusTask,
    logFocusSession,
    completeTask,
    focusSessions,
    settings,
  } = useApp();

  const [mode, setMode] = useState<'focus' | 'break'>('focus');
  const [selectedTaskId, setSelectedTaskId] = useState<string>(activeFocusTask?.id || '');
  const [timerMinutes, setTimerMinutes] = useState<number>(activeFocusTask?.duration || 25);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(timerMinutes * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [completedSuccess, setCompletedSuccess] = useState<boolean>(false);

  // Synchronize when activeFocusTask changes
  useEffect(() => {
    if (activeFocusTask) {
      setSelectedTaskId(activeFocusTask.id);
      setTimerMinutes(activeFocusTask.duration || 25);
      setSecondsRemaining((activeFocusTask.duration || 25) * 60);
      setIsRunning(false);
    }
  }, [activeFocusTask?.id]);

  // Timer loop
  useEffect(() => {
    let interval: any = null;
    if (isRunning && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => prev - 1);
      }, 1000);
    } else if (isRunning && secondsRemaining === 0) {
      handleTimerFinish();
    }
    return () => clearInterval(interval);
  }, [isRunning, secondsRemaining]);

  const handleTimerFinish = () => {
    setIsRunning(false);
    playFocusBellSound(settings.soundEnabled);

    if (mode === 'focus') {
      const task = tasks.find((t) => t.id === selectedTaskId);
      logFocusSession({
        taskId: task?.id,
        taskTitle: task?.title || 'Focused Work Session',
        durationMinutes: timerMinutes,
        startedAt: new Date(Date.now() - timerMinutes * 60000).toISOString(),
        endedAt: new Date().toISOString(),
        completed: true,
      });
      setCompletedSuccess(true);
    }
  };

  const toggleRun = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = (newMin?: number) => {
    setIsRunning(false);
    const m = newMin !== undefined ? newMin : timerMinutes;
    setSecondsRemaining(m * 60);
    setCompletedSuccess(false);
  };

  const switchMode = (newMode: 'focus' | 'break') => {
    setMode(newMode);
    const min = newMode === 'break' ? 5 : timerMinutes;
    setTimerMinutes(min);
    resetTimer(min);
  };

  const handleTaskComplete = () => {
    if (selectedTaskId) {
      completeTask(selectedTaskId);
    }
    handleTimerFinish();
  };

  const currentTask = tasks.find((t) => t.id === selectedTaskId);
  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const totalSeconds = timerMinutes * 60;
  const progressPercent = totalSeconds > 0 ? Math.round(((totalSeconds - secondsRemaining) / totalSeconds) * 100) : 0;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto">
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/20 mb-3">
          <Clock className="h-3.5 w-3.5" />
          <span>Deep Focus Mode</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-100">
          Uninterrupted Action
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-stone-400">
          Protect your attention. Silence notifications, isolate your task, and win one session at a time.
        </p>
      </div>

      {/* Main Focus Container */}
      <div className="rounded-3xl border border-stone-800 bg-stone-900/70 p-6 sm:p-10 shadow-2xl backdrop-blur-md text-center max-w-2xl mx-auto space-y-8">
        {/* Mode Switcher */}
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => switchMode('focus')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              mode === 'focus'
                ? 'bg-emerald-500 text-stone-950 shadow-md shadow-emerald-500/25'
                : 'bg-stone-800 text-stone-400 hover:text-stone-200'
            }`}
          >
            <Clock className="h-3.5 w-3.5" />
            <span>Focus Session ({timerMinutes}m)</span>
          </button>

          <button
            onClick={() => switchMode('break')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              mode === 'break'
                ? 'bg-teal-500 text-stone-950 shadow-md shadow-teal-500/25'
                : 'bg-stone-800 text-stone-400 hover:text-stone-200'
            }`}
          >
            <Coffee className="h-3.5 w-3.5" />
            <span>Short Break (5m)</span>
          </button>
        </div>

        {/* Task Selector */}
        {mode === 'focus' && (
          <div className="max-w-md mx-auto">
            <label className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider block mb-1">
              Active Focus Task
            </label>
            <select
              value={selectedTaskId}
              onChange={(e) => {
                const tId = e.target.value;
                setSelectedTaskId(tId);
                const t = tasks.find((item) => item.id === tId);
                if (t?.duration) {
                  setTimerMinutes(t.duration);
                  resetTimer(t.duration);
                }
              }}
              className="w-full rounded-xl border border-stone-800 bg-stone-950 px-3 py-2 text-xs font-medium text-stone-200 focus:border-emerald-500 focus:outline-none"
            >
              <option value="">General Focus Session (No specific task)</option>
              {tasks
                .filter((t) => t.status !== 'completed')
                .map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title} ({t.duration}m) — {t.priority}
                  </option>
                ))}
            </select>
          </div>
        )}

        {/* Big Circular Countdown Display */}
        <div className="relative flex flex-col items-center justify-center my-6">
          <div className="text-6xl sm:text-7xl font-mono font-black tracking-tight text-stone-100 select-none">
            {timeFormatted}
          </div>
          <span className="text-xs text-stone-400 mt-2 font-medium">
            {isRunning ? (mode === 'focus' ? '🎯 Stay locked in' : '☕ Breathe and stretch') : 'Paused'}
          </span>

          {/* Progress bar */}
          <div className="w-64 sm:w-80 bg-stone-800 h-2 rounded-full overflow-hidden mt-6">
            <div
              className={`h-full transition-all duration-500 ${
                mode === 'focus' ? 'bg-emerald-500' : 'bg-teal-400'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Completion Success Celebration Banner */}
        {completedSuccess && (
          <div className="rounded-2xl border border-emerald-500/40 bg-emerald-950/40 p-4 text-emerald-300 text-xs font-semibold animate-in zoom-in-95">
            🎉 Focus session completed! +15 XP added to your consistency level.
          </div>
        )}

        {/* Control Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={toggleRun}
            className={`flex items-center gap-2 rounded-2xl px-7 py-3 text-sm font-bold shadow-lg transition-all cursor-pointer ${
              isRunning
                ? 'bg-amber-500 text-stone-950 hover:bg-amber-400 shadow-amber-500/20'
                : 'bg-emerald-500 text-stone-950 hover:bg-emerald-400 shadow-emerald-500/25'
            }`}
          >
            {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-stone-950" />}
            <span>{isRunning ? 'Pause' : 'Start Focus'}</span>
          </button>

          <button
            onClick={() => resetTimer()}
            className="flex items-center gap-1.5 rounded-2xl bg-stone-800 hover:bg-stone-700 px-4 py-3 text-xs font-semibold text-stone-300 transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Reset</span>
          </button>

          {mode === 'focus' && currentTask && currentTask.status !== 'completed' && (
            <button
              onClick={handleTaskComplete}
              className="flex items-center gap-1.5 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500 hover:text-stone-950 border border-emerald-500/30 px-4 py-3 text-xs font-semibold text-emerald-400 transition-all cursor-pointer"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>Complete Task & End</span>
            </button>
          )}
        </div>

        {/* Quick interval presets */}
        <div className="flex items-center justify-center gap-2 pt-2 border-t border-stone-800/80">
          <span className="text-[11px] text-stone-500">Preset blocks:</span>
          {[15, 25, 45, 60].map((m) => (
            <button
              key={m}
              onClick={() => {
                setTimerMinutes(m);
                resetTimer(m);
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                timerMinutes === m
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              {m}m
            </button>
          ))}
        </div>
      </div>

      {/* Focus Session History */}
      <div className="rounded-2xl border border-stone-800 bg-stone-900/50 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-stone-100">Focus Session Log</h3>
          </div>
          <span className="text-xs text-stone-400">
            {focusSessions.length} sessions logged
          </span>
        </div>

        {focusSessions.length === 0 ? (
          <p className="text-xs text-stone-500 text-center py-4">
            No focus sessions logged yet. Complete your first session above to earn focus XP!
          </p>
        ) : (
          <div className="divide-y divide-stone-800/60">
            {focusSessions.slice(0, 5).map((s) => (
              <div key={s.id} className="py-2.5 flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-stone-200">{s.taskTitle}</span>
                  <span className="text-[11px] text-stone-400 block mt-0.5">
                    {new Date(s.endedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(s.endedAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-semibold text-emerald-400">{s.durationMinutes} minutes</span>
                  <span className="text-[10px] text-amber-400 block">+15 XP</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
