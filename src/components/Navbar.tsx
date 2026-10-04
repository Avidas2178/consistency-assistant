import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import {
  Flame,
  Award,
  Bell,
  CheckCircle2,
  Clock,
  LayoutDashboard,
  Target,
  CheckSquare,
  Sparkles,
  BarChart3,
  Settings,
  ShieldAlert,
  Moon,
  Sun,
  Globe,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    settings,
    updateSettings,
    streak,
    rewards,
    notifications,
    markNotificationAsRead,
    clearNotifications,
    activeTab,
    setActiveTab,
    focusModeActive,
    setFocusModeActive,
    setShowLandingPage,
    tasks,
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'focus', label: 'Focus', icon: Clock },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'ai-coach', label: 'AI Coach', icon: Sparkles },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const pendingImportantTasks = tasks.filter(
    (t) => (t.priority === 'High' || t.priority === 'Urgent') && t.status === 'pending'
  ).length;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-stone-800 bg-stone-950/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setActiveTab('dashboard');
              setShowLandingPage(false);
            }}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 text-stone-950 shadow-md shadow-emerald-950/40">
              <CheckCircle2 className="h-5 w-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold tracking-tight text-stone-100 text-base group-hover:text-emerald-400 transition-colors">
                  Consistency Assistant
                </span>
                <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400 border border-emerald-500/20">
                  AI Active
                </span>
              </div>
              <p className="text-[11px] text-stone-400 hidden sm:block">
                "Are you actually doing what you said you wanted to do?"
              </p>
            </div>
          </button>
        </div>

        {/* Center Nav tabs for Desktop */}
        <nav className="hidden lg:flex items-center gap-1 rounded-full bg-stone-900/80 p-1 border border-stone-800/80">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setShowLandingPage(false);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-900/50'
                    : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right side stats & quick actions */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Landing page link */}
          <button
            onClick={() => setShowLandingPage(true)}
            title="View Landing Page"
            className="hidden md:flex items-center gap-1.5 text-xs text-stone-400 hover:text-stone-200 px-2.5 py-1.5 rounded-lg hover:bg-stone-900 transition-colors border border-stone-800"
          >
            <Globe className="h-3.5 w-3.5 text-stone-400" />
            <span>Landing Page</span>
          </button>

          {/* Streak Badge */}
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
              streak.missedYesterday
                ? 'bg-amber-950/40 text-amber-300 border-amber-800/50'
                : 'bg-orange-950/40 text-orange-400 border-orange-800/50'
            }`}
            title={`${streak.currentDailyStreak} days consistency streak!`}
          >
            <Flame className="h-3.5 w-3.5 text-orange-500 fill-orange-500 animate-pulse" />
            <span>{streak.currentDailyStreak}d</span>
          </div>

          {/* XP & Level Badge */}
          <div
            onClick={() => setActiveTab('analytics')}
            className="cursor-pointer hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-950/40 text-emerald-400 border border-emerald-800/50 hover:bg-emerald-900/40 transition-colors"
            title={`${rewards.level} (${rewards.totalXp} XP)`}
          >
            <Award className="h-3.5 w-3.5 text-emerald-400" />
            <span>Lv.{rewards.levelIndex} {rewards.level}</span>
          </div>

          {/* Focus Mode button */}
          <button
            onClick={() => {
              setActiveTab('focus');
              setShowLandingPage(false);
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
              focusModeActive
                ? 'bg-amber-500 text-stone-950 font-bold shadow-md shadow-amber-950/40 animate-pulse'
                : 'bg-stone-900 text-stone-300 hover:text-white hover:bg-stone-800 border border-stone-800'
            }`}
          >
            <Clock className="h-3.5 w-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Focus</span>
          </button>

          {/* Notifications bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-full text-stone-400 hover:text-stone-100 hover:bg-stone-900 transition-colors"
              title="Notifications"
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-stone-900 border border-stone-800 shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="flex items-center justify-between pb-2 border-b border-stone-800 px-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-stone-200">Accountability Alerts</span>
                    {unreadCount > 0 && (
                      <span className="rounded-full bg-emerald-500/20 px-1.5 py-0.2 text-[10px] text-emerald-400 font-medium">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {notifications.length > 0 && (
                    <button
                      onClick={clearNotifications}
                      className="text-[11px] text-stone-400 hover:text-stone-200"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-stone-800/60 py-1">
                  {notifications.length === 0 ? (
                    <div className="py-6 text-center text-xs text-stone-400">
                      No notifications yet. You're all caught up!
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationAsRead(n.id)}
                        className={`p-2.5 rounded-lg transition-colors cursor-pointer text-left ${
                          n.read ? 'opacity-65 hover:bg-stone-800/40' : 'bg-stone-800/50 hover:bg-stone-800/80'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-xs font-semibold text-stone-200">{n.title}</p>
                          <span className="text-[10px] text-stone-400 whitespace-nowrap">
                            {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-400 mt-0.5 leading-relaxed">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User profile avatar */}
          <div
            onClick={() => setActiveTab('settings')}
            className="cursor-pointer flex h-8 w-8 items-center justify-center rounded-full bg-stone-800 text-stone-200 text-xs font-semibold border border-stone-700 hover:border-emerald-500 transition-colors"
            title={`${settings.name} (${settings.email})`}
          >
            {settings.name.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>

      {/* Mobile Nav Bar */}
      <div className="lg:hidden flex items-center justify-around border-t border-stone-800/80 bg-stone-950 px-2 py-1.5 overflow-x-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setShowLandingPage(false);
              }}
              className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-lg text-[10px] font-medium transition-colors ${
                isActive ? 'text-emerald-400 font-semibold' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
