import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import {
  Settings,
  User,
  Bell,
  Shield,
  Clock,
  Sparkles,
  Download,
  RotateCcw,
  Check,
  Plus,
  Trash2,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { AccountabilityPreference, PreferredTime } from '../types/index.ts';

export const SettingsView: React.FC = () => {
  const { settings, updateSettings, resetAllData, goals, tasks, streak, rewards, focusSessions } = useApp();

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [newSiteInput, setNewSiteInput] = useState('');

  const handleToggle = (key: keyof typeof settings) => {
    updateSettings({ [key]: !settings[key] });
    triggerSaveAlert();
  };

  const triggerSaveAlert = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleAddWebsite = () => {
    if (!newSiteInput.trim()) return;
    const clean = newSiteInput.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '');
    if (!settings.blockedWebsites.includes(clean)) {
      updateSettings({ blockedWebsites: [...settings.blockedWebsites, clean] });
    }
    setNewSiteInput('');
    triggerSaveAlert();
  };

  const handleRemoveWebsite = (site: string) => {
    updateSettings({
      blockedWebsites: settings.blockedWebsites.filter((s) => s !== site),
    });
    triggerSaveAlert();
  };

  const handleExportData = () => {
    const dataBundle = {
      settings,
      goals,
      tasks,
      streak,
      rewards,
      focusSessions,
      exportedAt: new Date().toISOString(),
    };
    const jsonStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(dataBundle, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonStr);
    downloadAnchor.setAttribute('download', `consistency_assistant_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-100">
            Settings & Control Center
          </h1>
          <p className="mt-1 text-sm text-stone-400">
            Total control over every automation, notification, and accountability preference.
          </p>
        </div>
        {savedSuccess && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/20 animate-in fade-in">
            <Check className="h-3.5 w-3.5" />
            <span>Preferences Saved</span>
          </span>
        )}
      </div>

      <div className="space-y-6">
        {/* Section 1: Profile */}
        <div className="rounded-2xl border border-stone-800 bg-stone-900/60 p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-stone-800 pb-3">
            <User className="h-4 w-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-stone-100">User Profile & Schedule</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-stone-300">Name</label>
              <input
                type="text"
                value={settings.name}
                onChange={(e) => {
                  updateSettings({ name: e.target.value });
                  triggerSaveAlert();
                }}
                className="mt-1 w-full rounded-xl border border-stone-800 bg-stone-950 px-3 py-2 text-xs text-stone-100 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-300">Email</label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => {
                  updateSettings({ email: e.target.value });
                  triggerSaveAlert();
                }}
                className="mt-1 w-full rounded-xl border border-stone-800 bg-stone-950 px-3 py-2 text-xs text-stone-100 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-300">Timezone</label>
              <input
                type="text"
                value={settings.timezone}
                onChange={(e) => {
                  updateSettings({ timezone: e.target.value });
                  triggerSaveAlert();
                }}
                className="mt-1 w-full rounded-xl border border-stone-800 bg-stone-950 px-3 py-2 text-xs text-stone-100 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-300">Peak Productivity Time</label>
              <select
                value={settings.preferredProductivityTime}
                onChange={(e) => {
                  updateSettings({ preferredProductivityTime: e.target.value as PreferredTime });
                  triggerSaveAlert();
                }}
                className="mt-1 w-full rounded-xl border border-stone-800 bg-stone-950 px-3 py-2 text-xs text-stone-100 focus:border-emerald-500 focus:outline-none"
              >
                <option value="Morning">Morning (6 AM - 12 PM)</option>
                <option value="Afternoon">Afternoon (12 PM - 5 PM)</option>
                <option value="Evening">Evening (5 PM - 10 PM)</option>
                <option value="Custom schedule">Custom schedule</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Accountability Style (Rule: Complete ON/OFF controls) */}
        <div className="rounded-2xl border border-stone-800 bg-stone-900/60 p-6 space-y-5">
          <div className="flex items-center gap-2 border-b border-stone-800 pb-3">
            <Sparkles className="h-4 w-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-stone-100">Accountability Preferences</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-stone-300">AI Coaching Intensity</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-2">
                {(['Gentle', 'Balanced', 'Strict', 'AI Coach'] as AccountabilityPreference[]).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => {
                      updateSettings({ accountabilityPreference: mode });
                      triggerSaveAlert();
                    }}
                    className={`p-3 rounded-xl text-left border transition-all ${
                      settings.accountabilityPreference === mode
                        ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300'
                        : 'border-stone-800 bg-stone-950 text-stone-400 hover:border-stone-700'
                    }`}
                  >
                    <span className="text-xs font-bold block">{mode}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Daily Question Toggle */}
            <div className="flex items-center justify-between pt-2">
              <div>
                <span className="text-xs font-semibold text-stone-200">Daily Accountability Check-in</span>
                <p className="text-[11px] text-stone-400">
                  Prompt: "Did you do anything productive today?" at {settings.dailyQuestionTime}.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleToggle('dailyQuestionEnabled')}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                  settings.dailyQuestionEnabled ? 'bg-emerald-500' : 'bg-stone-800'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    settings.dailyQuestionEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Motivational Messages Toggle */}
            <div className="flex items-center justify-between pt-2 border-t border-stone-800/80">
              <div>
                <span className="text-xs font-semibold text-stone-200">Personalized Motivational Quotes</span>
                <p className="text-[11px] text-stone-400">
                  Subtly weaved from your stated "Why" when resistance or missed tasks occur.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleToggle('motivationalMessagesEnabled')}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                  settings.motivationalMessagesEnabled ? 'bg-emerald-500' : 'bg-stone-800'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    settings.motivationalMessagesEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Section 3: Notifications & Quiet Hours */}
        <div className="rounded-2xl border border-stone-800 bg-stone-900/60 p-6 space-y-5">
          <div className="flex items-center gap-2 border-b border-stone-800 pb-3">
            <Bell className="h-4 w-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-stone-100">Smart Reminders & Quiet Hours</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-stone-200">Smart Task & Streak Reminders</span>
                <p className="text-[11px] text-stone-400">
                  Upcoming deadlines, task start nudges, and inactivity alerts.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleToggle('enableNotifications')}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                  settings.enableNotifications ? 'bg-emerald-500' : 'bg-stone-800'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    settings.enableNotifications ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Sound Chimes Toggle */}
            <div className="flex items-center justify-between pt-2 border-t border-stone-800/80">
              <div>
                <span className="text-xs font-semibold text-stone-200">Completion Chimes & Audio Bells</span>
                <p className="text-[11px] text-stone-400">
                  Subtle synthesized audio feedback on task complete and focus session end.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleToggle('soundEnabled')}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                  settings.soundEnabled ? 'bg-emerald-500' : 'bg-stone-800'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    settings.soundEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Quiet Hours */}
            <div className="flex items-center justify-between pt-2 border-t border-stone-800/80">
              <div>
                <span className="text-xs font-semibold text-stone-200">Quiet Hours</span>
                <p className="text-[11px] text-stone-400">
                  Mute all audible reminders between {settings.quietHoursStart} and {settings.quietHoursEnd}.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleToggle('quietHoursEnabled')}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                  settings.quietHoursEnabled ? 'bg-emerald-500' : 'bg-stone-800'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    settings.quietHoursEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Section 4: Optional Distraction Blocking */}
        <div className="rounded-2xl border border-stone-800 bg-stone-900/60 p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-stone-800 pb-3">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-stone-100">Optional Distraction Control</h3>
            </div>
            <button
              type="button"
              onClick={() => handleToggle('distractionBlockingEnabled')}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                settings.distractionBlockingEnabled ? 'bg-emerald-500' : 'bg-stone-800'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  settings.distractionBlockingEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <p className="text-xs text-stone-400 leading-relaxed">
            When high-priority tasks remain unfinished, you can configure an intervention prompt before visiting distracting sites. This feature never secretly blocks anything and can be disabled instantly with one click.
          </p>

          <div className="space-y-3 pt-1">
            <label className="text-xs font-semibold text-stone-300">Configured Distraction Sites</label>
            <div className="flex flex-wrap gap-2">
              {settings.blockedWebsites.map((site) => (
                <div
                  key={site}
                  className="flex items-center gap-1.5 rounded-lg border border-stone-800 bg-stone-950 px-2.5 py-1 text-xs text-stone-300"
                >
                  <span>{site}</span>
                  <button
                    onClick={() => handleRemoveWebsite(site)}
                    className="text-stone-500 hover:text-rose-400 ml-1"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2 max-w-sm pt-1">
              <input
                type="text"
                placeholder="Add domain (e.g. reddit.com)"
                value={newSiteInput}
                onChange={(e) => setNewSiteInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddWebsite()}
                className="flex-1 rounded-xl border border-stone-800 bg-stone-950 px-3 py-1.5 text-xs text-stone-200 focus:border-emerald-500 focus:outline-none"
              />
              <button
                onClick={handleAddWebsite}
                className="rounded-xl bg-stone-800 hover:bg-stone-700 px-3 py-1.5 text-xs font-medium text-stone-200"
              >
                Add Site
              </button>
            </div>
          </div>
        </div>

        {/* Section 5: Data Export & Reset */}
        <div className="rounded-2xl border border-stone-800 bg-stone-900/60 p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-stone-800 pb-3">
            <Download className="h-4 w-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-stone-100">Data Portability & Privacy</h3>
          </div>

          <p className="text-xs text-stone-400">
            You own 100% of your data. Export your goals, task completions, and streaks as JSON anytime, or reset your local store.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={handleExportData}
              className="flex items-center gap-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 px-4 py-2 text-xs font-semibold text-stone-200 transition-colors"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export All Data (JSON)</span>
            </button>

            <button
              onClick={() => {
                if (window.confirm('Reset all demo goals and tasks back to initial onboarding state?')) {
                  resetAllData();
                }
              }}
              className="flex items-center gap-1.5 rounded-xl border border-rose-900/40 bg-rose-950/20 hover:bg-rose-950/40 px-4 py-2 text-xs font-semibold text-rose-300 transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset Data</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
