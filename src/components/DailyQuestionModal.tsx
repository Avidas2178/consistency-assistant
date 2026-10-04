import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import {
  HelpCircle,
  CheckCircle2,
  Clock,
  X,
  Sparkles,
  ArrowRight,
  Play,
  Loader2,
} from 'lucide-react';

interface DailyQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DailyQuestionModal: React.FC<DailyQuestionModalProps> = ({ isOpen, onClose }) => {
  const { submitDailyQuestion, setActiveTab, tasks, setActiveFocusTask, setFocusModeActive } = useApp();

  const [step, setStep] = useState<'initial' | 'details' | 'result'>('initial');
  const [choice, setChoice] = useState<'yes' | 'not_yet' | 'no'>('yes');
  const [details, setDetails] = useState('');
  const [aiFeedback, setAiFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSelectChoice = async (selected: 'yes' | 'not_yet' | 'no') => {
    setChoice(selected);
    if (selected === 'yes') {
      setStep('details');
    } else {
      setIsSubmitting(true);
      const feedback = await submitDailyQuestion(selected);
      setAiFeedback(feedback);
      setIsSubmitting(false);
      setStep('result');
    }
  };

  const handleDetailsSubmit = async () => {
    setIsSubmitting(true);
    const feedback = await submitDailyQuestion('yes', details);
    setAiFeedback(feedback);
    setIsSubmitting(false);
    setStep('result');
  };

  const handleStartQuickTask = () => {
    const pending = tasks.find((t) => t.status === 'pending');
    if (pending) {
      setActiveFocusTask(pending);
      setFocusModeActive(true);
      setActiveTab('focus');
    } else {
      setActiveTab('tasks');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/80 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-md rounded-3xl border border-stone-800 bg-stone-900 p-6 sm:p-8 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-200 p-1"
        >
          <X className="h-4 w-4" />
        </button>

        {step === 'initial' && (
          <div className="text-center space-y-6">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <HelpCircle className="h-6 w-6" />
            </div>

            <div>
              <span className="text-[11px] font-semibold text-indigo-400 uppercase tracking-wider">
                Daily Accountability Reflection
              </span>
              <h2 className="text-xl font-bold text-stone-100 mt-1">
                "Did you do anything productive today?"
              </h2>
              <p className="text-xs text-stone-400 mt-1.5">
                Answer honestly without judgment. Consistency is built on self-awareness.
              </p>
            </div>

            <div className="space-y-2.5">
              <button
                onClick={() => handleSelectChoice('yes')}
                disabled={isSubmitting}
                className="flex w-full items-center justify-between rounded-xl bg-emerald-500/10 hover:bg-emerald-500 hover:text-stone-950 border border-emerald-500/30 p-3.5 text-xs font-semibold text-emerald-400 transition-all cursor-pointer"
              >
                <span>Yes, I made meaningful progress</span>
                <CheckCircle2 className="h-4 w-4" />
              </button>

              <button
                onClick={() => handleSelectChoice('not_yet')}
                disabled={isSubmitting}
                className="flex w-full items-center justify-between rounded-xl bg-amber-500/10 hover:bg-amber-500 hover:text-stone-950 border border-amber-500/30 p-3.5 text-xs font-semibold text-amber-300 transition-all cursor-pointer"
              >
                <span>Not yet (There's still time today)</span>
                <Clock className="h-4 w-4" />
              </button>

              <button
                onClick={() => handleSelectChoice('no')}
                disabled={isSubmitting}
                className="flex w-full items-center justify-between rounded-xl bg-stone-800 hover:bg-stone-700 p-3.5 text-xs font-semibold text-stone-300 transition-all cursor-pointer"
              >
                <span>I don't think so</span>
                <span>→</span>
              </button>
            </div>
          </div>
        )}

        {step === 'details' && (
          <div className="space-y-4">
            <div>
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                Celebrate Your Win
              </span>
              <h3 className="text-lg font-bold text-stone-100 mt-1">
                What did you accomplish today?
              </h3>
              <p className="text-xs text-stone-400 mt-1">
                Naming your accomplishment cements your productive identity.
              </p>
            </div>

            <textarea
              rows={3}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="e.g. Completed React 19 tutorial and built a responsive navbar with clean code."
              className="w-full rounded-xl border border-stone-800 bg-stone-950 p-3 text-xs text-stone-100 focus:border-emerald-500 focus:outline-none"
              autoFocus
            />

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setStep('initial')}
                className="text-xs text-stone-400 hover:text-stone-200"
              >
                Back
              </button>
              <button
                onClick={handleDetailsSubmit}
                disabled={isSubmitting || !details.trim()}
                className="flex items-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-semibold text-stone-950 hover:bg-emerald-400 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Sparkles className="h-3.5 w-3.5" />
                )}
                <span>Log Accomplishment</span>
              </button>
            </div>
          </div>
        )}

        {step === 'result' && (
          <div className="text-center space-y-5">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Sparkles className="h-6 w-6" />
            </div>

            <div>
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                Coach Feedback
              </span>
              <p className="text-xs sm:text-sm text-stone-200 mt-2 leading-relaxed bg-stone-950 p-4 rounded-xl border border-stone-800 text-left italic">
                "{aiFeedback}"
              </p>
            </div>

            <div className="space-y-2 pt-2">
              {choice === 'not_yet' && (
                <button
                  onClick={handleStartQuickTask}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 py-2.5 text-xs font-semibold text-stone-950 hover:bg-emerald-400 transition-colors cursor-pointer"
                >
                  <Play className="h-3.5 w-3.5 fill-stone-950" />
                  <span>Start a 15-Minute Task</span>
                </button>
              )}
              <button
                onClick={onClose}
                className="flex w-full items-center justify-center gap-1 rounded-xl bg-stone-800 py-2.5 text-xs font-semibold text-stone-300 hover:bg-stone-700 hover:text-white transition-colors cursor-pointer"
              >
                <span>Close Reflection</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
