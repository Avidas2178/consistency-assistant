import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext.tsx';
import { Navbar } from './components/Navbar.tsx';
import { LandingPage } from './components/LandingPage.tsx';
import { OnboardingModal } from './components/OnboardingModal.tsx';
import { DashboardView } from './components/DashboardView.tsx';
import { GoalsView } from './components/GoalsView.tsx';
import { TasksView } from './components/TasksView.tsx';
import { FocusView } from './components/FocusView.tsx';
import { AnalyticsView } from './components/AnalyticsView.tsx';
import { AICoachView } from './components/AICoachView.tsx';
import { SettingsView } from './components/SettingsView.tsx';
import { AddTaskModal } from './components/AddTaskModal.tsx';
import { DailyQuestionModal } from './components/DailyQuestionModal.tsx';
import { EndOfDayModal } from './components/EndOfDayModal.tsx';
import { DistractionBlockerModal } from './components/DistractionBlockerModal.tsx';

function MainApp() {
  const {
    activeTab,
    hasCompletedOnboarding,
    completeOnboarding,
    showLandingPage,
    setShowLandingPage,
  } = useApp();

  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [isDailyQuestionOpen, setIsDailyQuestionOpen] = useState(false);
  const [isEndOfDayOpen, setIsEndOfDayOpen] = useState(false);

  // If user navigated to landing page
  if (showLandingPage) {
    return (
      <>
        <LandingPage
          onStartOnboarding={() => {
            setShowLandingPage(false);
            setIsOnboardingOpen(true);
          }}
          onOpenDashboard={() => setShowLandingPage(false)}
        />
        <OnboardingModal
          isOpen={isOnboardingOpen}
          onComplete={(data) => {
            completeOnboarding(data);
            setIsOnboardingOpen(false);
          }}
          onCancel={() => setIsOnboardingOpen(false)}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-stone-950">
      <Navbar />

      <main className="flex-1 pb-16">
        {activeTab === 'dashboard' && (
          <DashboardView
            onOpenAddTask={() => setIsAddTaskOpen(true)}
            onOpenDailyQuestion={() => setIsDailyQuestionOpen(true)}
            onOpenEndOfDay={() => setIsEndOfDayOpen(true)}
          />
        )}
        {activeTab === 'goals' && <GoalsView />}
        {activeTab === 'tasks' && <TasksView onOpenAddTask={() => setIsAddTaskOpen(true)} />}
        {activeTab === 'focus' && <FocusView />}
        {activeTab === 'analytics' && <AnalyticsView />}
        {activeTab === 'ai-coach' && <AICoachView />}
        {activeTab === 'settings' && <SettingsView />}
      </main>

      {/* Global Modals */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onComplete={(data) => {
          completeOnboarding(data);
          setIsOnboardingOpen(false);
        }}
        onCancel={() => setIsOnboardingOpen(false)}
      />

      <AddTaskModal
        isOpen={isAddTaskOpen}
        onClose={() => setIsAddTaskOpen(false)}
      />

      <DailyQuestionModal
        isOpen={isDailyQuestionOpen}
        onClose={() => setIsDailyQuestionOpen(false)}
      />

      <EndOfDayModal
        isOpen={isEndOfDayOpen}
        onClose={() => setIsEndOfDayOpen(false)}
      />

      <DistractionBlockerModal />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
