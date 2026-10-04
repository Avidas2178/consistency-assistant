import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import {
  Moon,
  Clock,
  Play,
  Calendar,
  X,
  CheckCircle2,
  BellOff,
  SkipForward,
} from 'lucide-react';

interface EndOfDayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EndOfDayModal: React.FC<EndOfDayModalProps> = ({ isOpen, onClose }) => {
  const { tasks, updateTask, setActiveFocusTask, setFocusModeActive, setActiveTab, updateSettings } = useApp();

  if (!isOpen) return null;

  const incompleteImportantTasks = tasks.filter(
    (t) => (t.priority === 'High' || t.priority === 'Urgent') && t.status === 'pending'
  );

  const targetTask = incompleteImportantTasks[0] || tasks.find((t) => t.status === 'pending');

  const handleStartTask = () => {
    if (targetTask) {
      setActiveFocusTask(targetTask);
      setFocusModeActive(true);
      setActiveTab('focus');
    }
    onClose();
  };

  const handleReschedule = () => {
    if (targetTask) {
      const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
      updateTask(targetTask.id, { dueDate: tomorrow, status: 'rescheduled' });
    }
    onClose();
  };

  const handleMarkSkipped = () => {
    if (targetTask) {
      updateTask(targetTask.id, { status: 'skipped' });
    }
    onClose();
  };

  const handleDisableReminders = () => {
    updateSettings({ enableNotifications: false });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/80 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-md rounded-3xl border border-stone-800 bg-stone-900 p-6 sm:p-8 shadow-2xl space-y-6 text-center animate-in fade-in zoom-in-95 duration-150">
        <button onClick={onClose} className="absolute top-4 right-4 text-stone-400 hover:text-stone-200 p-1">
          <X className="h-4 w-4" />
        </button>

        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
          <Moon className="h-6 w-6" />
        </div>

        <div>
          <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider">
            End-of-Day Accountability Check
          </span>
          <h2 className="text-xl font-bold text-stone-100 mt-1">
            Your day is almost over.
          </h2>
          <p className="text-xs text-stone-400 mt-1.5 leading-relaxed">
            {incompleteImportantTasks.length > 0 ? (
              <>
                You still have <strong className="text-stone-200">{incompleteImportantTasks.length} important task{incompleteImportantTasks.length > 1 ? 's' : ''}</strong> remaining. Do you want to complete one now before bed?
              </>
            ) : (
              'All key tasks completed! Take time to wind down and prepare for tomorrow.'
            )}
          </p>
        </div>

        {targetTask && (
          <div className="rounded-xl border border-stone-800 bg-stone-950 p-3.5 text-left">
            <span className="text-[10px] uppercase font-bold text-amber-400">{targetTask.priority} Priority</span>
            <p className="text-xs font-bold text-stone-100 mt-0.5">{targetTask.title}</p>
            <span className="text-[11px] text-stone-400 mt-1 block">⏱️ {targetTask.duration} minutes estimated</span>
          </div>
        )}

        {/* Options */}
        <div className="space-y-2 pt-2">
          {targetTask && targetTask.status === 'pending' && (
            <button
              onClick={handleStartTask}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3 text-xs font-bold text-stone-950 hover:bg-emerald-400 transition-colors shadow-md shadow-emerald-500/20 cursor-pointer"
            >
              <Play className="h-3.5 w-3.5 fill-stone-950" />
              <span>Start Task Now ({targetTask.duration}m)</span>
            </button>
          )}

          {targetTask && targetTask.status === 'pending' && (
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleReschedule}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 py-2.5 text-xs font-semibold text-stone-300 transition-colors cursor-pointer"
              >
                <Calendar className="h-3.5 w-3.5 text-teal-400" />
                <span>Reschedule to tomorrow</span>
              </button>

              <button
                onClick={handleMarkSkipped}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 py-2.5 text-xs font-semibold text-stone-400 hover:text-stone-300 transition-colors cursor-pointer"
              >
                <SkipForward className="h-3.5 w-3.5" />
                <span>Mark as skipped</span>
              </button>
            </div>
          )}

          <div className="pt-2">
            <button
              onClick={handleDisableReminders}
              className="text-xs text-stone-500 hover:text-stone-300 flex items-center justify-center gap-1.5 mx-auto"
            >
              <BellOff className="h-3.5 w-3.5" />
              <span>Disable end-of-day reminders</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
