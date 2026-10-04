import React, { useState } from 'react';
import {
  CheckCircle2,
  ArrowRight,
  Flame,
  Sparkles,
  ShieldCheck,
  Clock,
  BarChart3,
  Award,
  ChevronDown,
  Target,
  BrainCircuit,
  BellRing,
  HelpCircle,
} from 'lucide-react';

interface LandingPageProps {
  onStartOnboarding: () => void;
  onOpenDashboard: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStartOnboarding, onOpenDashboard }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How is Consistency Assistant different from ordinary to-do apps?',
      a: 'Traditional to-do apps are passive lists that grow into graveyards of uncompleted items. Consistency Assistant is built around one fundamental question: "Are you actually doing what you said you wanted to do?" It bridges your deep "Why" to daily micro-actions, uses AI to catch unrealistic overload, monitors streaks without toxic shaming, and provides supportive accountability.',
    },
    {
      q: 'What is the Goal Score and how is it calculated?',
      a: 'The Goal Score (0-100) is a transparent index calculated from four weighted dimensions: Task Completion (35%), Daily Consistency & Streak (25%), Deadline Adherence (20%), and Milestone Progress (20%). It eliminates arbitrary ratings and reveals exactly where your momentum is accelerating or needs support.',
    },
    {
      q: 'Does the distraction blocker secretly inspect or restrict my device?',
      a: 'Never. The distraction-control feature is 100% user-directed, optional, and transparent. You select which specific sites trigger an intervention (like YouTube or social feeds) when important tasks remain unfinished. It provides a helpful reminder screen with one-click options to resume, take a break, or turn it off.',
    },
    {
      q: 'What happens if I miss a day or break a streak?',
      a: 'Life happens. We follow our core philosophy: "Make consistency easier, not perfection mandatory." You are never shamed. The AI coach asks what obstacles arose and gives you a one-click "Restart today" option with a micro-task to re-ignite momentum immediately.',
    },
    {
      q: 'Can I customize the intensity of AI accountability?',
      a: 'Yes. You can choose from Gentle, Balanced, Strict, or AI Coach mode, or turn automated check-ins and coaching off entirely in Settings. Every automated feature has clear ON/OFF switches.',
    },
  ];

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 selection:bg-emerald-500 selection:text-stone-950">
      {/* Top Banner */}
      <div className="border-b border-stone-800 bg-stone-900/60 py-2 px-4 text-center text-xs text-stone-300">
        <span className="font-semibold text-emerald-400">Consistency Assistant v1.0</span> — Turn high ambitions into relentless daily follow-through.
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 sm:pt-24 sm:pb-32">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_50%_at_50%_0%,rgba(16,185,129,0.12),rgba(12,10,9,0))]" />
        
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-3.5 py-1 text-xs font-medium text-emerald-400 mb-6 backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5" />
            <span>AI-Powered Follow-Through Engine</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-stone-100 max-w-4xl mx-auto leading-[1.12]">
            Stop Setting Goals. <br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500 bg-clip-text text-transparent">
              Start Following Through.
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-xl text-stone-300 max-w-2xl mx-auto leading-relaxed font-normal">
            An intelligent productivity and accountability assistant that helps you turn goals into consistent daily action, protect focus, and measure genuine progress.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onStartOnboarding}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-3.5 text-sm font-semibold text-stone-950 shadow-lg shadow-emerald-500/25 hover:bg-emerald-400 transition-all cursor-pointer"
            >
              <span>Start Staying Consistent</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={onOpenDashboard}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-stone-900 border border-stone-800 px-6 py-3.5 text-sm font-semibold text-stone-200 hover:bg-stone-800 transition-all cursor-pointer"
            >
              <span>See How It Works</span>
            </button>
          </div>

          {/* Interactive Mockup Preview Card */}
          <div className="mt-14 rounded-2xl border border-stone-800 bg-stone-900/80 p-4 sm:p-6 shadow-2xl backdrop-blur-md text-left max-w-3xl mx-auto">
            <div className="flex items-center justify-between border-b border-stone-800/80 pb-4">
              <div className="flex items-center gap-2.5">
                <span className="flex h-3 w-3 rounded-full bg-emerald-500"></span>
                <span className="text-xs font-semibold text-stone-300">Live Daily Accountability System</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-stone-400">
                <Flame className="h-4 w-4 text-orange-400" />
                <span className="font-semibold text-stone-200">8-Day Streak</span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-xl bg-stone-950/70 p-3 border border-stone-800/80">
                <span className="text-[11px] text-stone-400">Today's Focus</span>
                <p className="text-sm font-semibold text-stone-100 mt-1">4 of 6 Tasks Done</p>
                <div className="mt-2 w-full bg-stone-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[67%]"></div>
                </div>
              </div>

              <div className="rounded-xl bg-stone-950/70 p-3 border border-stone-800/80">
                <span className="text-[11px] text-stone-400">Goal Score</span>
                <p className="text-sm font-semibold text-stone-100 mt-1">84 / 100</p>
                <span className="text-[10px] text-emerald-400">🟢 On Track (High Adherence)</span>
              </div>

              <div className="rounded-xl bg-stone-950/70 p-3 border border-stone-800/80">
                <span className="text-[11px] text-stone-400">Accountability Partner</span>
                <p className="text-xs text-stone-300 mt-1 leading-snug">
                  "Navbar task due at 8 PM. Start now while mental energy is high."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: How It Works */}
      <section className="py-20 border-t border-stone-800/80 bg-stone-900/30">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-100">
              How Consistency Assistant Works
            </h2>
            <p className="mt-3 text-sm sm:text-base text-stone-400">
              A friction-free framework designed to eliminate decision fatigue and build durable follow-through habits.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="rounded-xl border border-stone-800 bg-stone-900/50 p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 font-bold mb-4">
                1
              </div>
              <h3 className="text-base font-semibold text-stone-100">Define Your "Why"</h3>
              <p className="text-xs text-stone-400 mt-2 leading-relaxed">
                Connect each goal to an emotional reason that matters. When motivation wanes, the AI draws upon this exact anchor.
              </p>
            </div>

            <div className="rounded-xl border border-stone-800 bg-stone-900/50 p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-500/10 text-teal-400 font-bold mb-4">
                2
              </div>
              <h3 className="text-base font-semibold text-stone-100">AI Goal Roadmap</h3>
              <p className="text-xs text-stone-400 mt-2 leading-relaxed">
                The AI turns vague ambitions into concrete milestones and actionable 25–45 minute micro-tasks. You keep full editing control.
              </p>
            </div>

            <div className="rounded-xl border border-stone-800 bg-stone-900/50 p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 font-bold mb-4">
                3
              </div>
              <h3 className="text-base font-semibold text-stone-100">Daily Execution</h3>
              <p className="text-xs text-stone-400 mt-2 leading-relaxed">
                Focus on today's schedule with integrated countdown timers, optional distraction barriers, and clean one-tap completions.
              </p>
            </div>

            <div className="rounded-xl border border-stone-800 bg-stone-900/50 p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 font-bold mb-4">
                4
              </div>
              <h3 className="text-base font-semibold text-stone-100">Accountability Loop</h3>
              <p className="text-xs text-stone-400 mt-2 leading-relaxed">
                Receive end-of-day check-ins, transparent score reviews, and weekly habit insights to refine your schedule next week.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Goal -> Task -> Action -> Progress */}
      <section className="py-20 border-t border-stone-800/80">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <span className="text-xs font-semibold text-emerald-400 tracking-wider uppercase">
                The Productive Cycle
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-100 mt-2">
                From Big Vision to Done in 4 Steps
              </h2>
              <p className="text-sm text-stone-400 mt-3 leading-relaxed">
                Most people fail because of a chasm between grand plans and what to do at 7:30 PM on a Tuesday. We close that gap.
              </p>

              <div className="mt-6 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-stone-200">Goal</h4>
                    <p className="text-xs text-stone-400">"Become a Frontend Developer within 6 months"</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-stone-200">Plan & Milestones</h4>
                    <p className="text-xs text-stone-400">HTML/CSS → JavaScript → React Architecture → Capstone Portfolio</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-stone-200">Task & Focus Action</h4>
                    <p className="text-xs text-stone-400">"Build navbar component — 45 min focus timer"</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-stone-200">Reflection & Compounding Score</h4>
                    <p className="text-xs text-stone-400">+20 XP earned, 8-day streak extended, Goal Score rises to 84.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-stone-800 bg-stone-900/60 p-6 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-stone-800">
                <span className="text-xs font-semibold text-stone-300">Focus AI Coach Live Analysis</span>
                <span className="text-[10px] text-emerald-400 font-medium">Non-Judgmental Partner</span>
              </div>
              <div className="mt-4 rounded-xl bg-stone-950 p-4 border border-stone-800">
                <p className="text-xs text-stone-300 leading-relaxed italic">
                  "You've been completing 90% of your tasks between 7 PM and 9 PM. Let's protect that window for your high-priority coding objectives."
                </p>
                <div className="mt-3 flex items-center justify-between text-[11px] text-stone-400 pt-2 border-t border-stone-800/80">
                  <span>Recommendation Accepted</span>
                  <span className="text-emerald-400 font-semibold">+15 XP Momentum</span>
                </div>
              </div>

              <div className="mt-4 rounded-xl bg-stone-950 p-4 border border-stone-800">
                <span className="text-[10px] text-stone-400 uppercase font-semibold">Smart Task Sizing Detection</span>
                <p className="text-xs text-stone-200 mt-1">
                  Scheduled "Study 8 hours"? AI suggests: "That's ambitious. Let's do 2 focused hours to prevent burnout and ensure 100% follow-through."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4 & 5: Smart Reminders, Focus Mode & Distraction Interventions */}
      <section className="py-20 border-t border-stone-800/80 bg-stone-900/20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-semibold text-emerald-400 tracking-wider uppercase">User-In-Control</span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-100 mt-2">
              Deep Focus Without Distraction
            </h2>
            <p className="mt-3 text-sm text-stone-400">
              Features built to protect your willpower. Everything is strictly optional and easy to turn off at any moment.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-stone-800 bg-stone-900/50 p-5">
              <Clock className="h-7 w-7 text-emerald-400 mb-3" />
              <h3 className="text-base font-semibold text-stone-100">Integrated Focus Timer</h3>
              <p className="text-xs text-stone-400 mt-2 leading-relaxed">
                Dedicated distraction-free workspace with audio chimes, customizable intervals, and focus session logs.
              </p>
            </div>

            <div className="rounded-2xl border border-stone-800 bg-stone-900/50 p-5">
              <ShieldCheck className="h-7 w-7 text-teal-400 mb-3" />
              <h3 className="text-base font-semibold text-stone-100">Optional Distraction Shield</h3>
              <p className="text-xs text-stone-400 mt-2 leading-relaxed">
                Configure your trigger sites. If high-priority tasks are incomplete, an intervention card prompts you to follow through.
              </p>
            </div>

            <div className="rounded-2xl border border-stone-800 bg-stone-900/50 p-5">
              <BellRing className="h-7 w-7 text-amber-400 mb-3" />
              <h3 className="text-base font-semibold text-stone-100">Quiet Hours & Smart Reminders</h3>
              <p className="text-xs text-stone-400 mt-2 leading-relaxed">
                Set quiet hours so reminders never interrupt your sleep or personal time. Choose gentle, balanced, or strict pacing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 6 & 7: Transparent Analytics & Goal Score */}
      <section className="py-20 border-t border-stone-800/80">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="rounded-2xl border border-stone-800 bg-stone-900/60 p-6">
              <h3 className="text-base font-semibold text-stone-100">Transparent Goal Score (0–100)</h3>
              <p className="text-xs text-stone-400 mt-1">We show the math behind every single point:</p>

              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-300">Task Completion Rate (35%)</span>
                  <span className="font-semibold text-emerald-400">90%</span>
                </div>
                <div className="w-full bg-stone-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[90%]"></div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-300">Daily Consistency & Streak (25%)</span>
                  <span className="font-semibold text-emerald-400">82%</span>
                </div>
                <div className="w-full bg-stone-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[82%]"></div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-300">Deadline Adherence (20%)</span>
                  <span className="font-semibold text-emerald-400">78%</span>
                </div>
                <div className="w-full bg-stone-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[78%]"></div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-300">Milestone Progress (20%)</span>
                  <span className="font-semibold text-emerald-400">85%</span>
                </div>
                <div className="w-full bg-stone-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[85%]"></div>
                </div>
              </div>

              <div className="mt-6 p-3 rounded-xl bg-stone-950 border border-stone-800 text-center">
                <span className="text-xs text-stone-400">Composite Score</span>
                <p className="text-2xl font-black text-stone-100 mt-0.5">84 / 100</p>
                <span className="text-[11px] text-emerald-400 font-medium">🟢 On Track • Sustainable Pace</span>
              </div>
            </div>

            <div>
              <span className="text-xs font-semibold text-emerald-400 tracking-wider uppercase">
                Analytics & Insights
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-100 mt-2">
                Measure Follow-Through, Not Just Intention
              </h2>
              <p className="text-sm text-stone-400 mt-3 leading-relaxed">
                Review your daily, weekly, and monthly consistency. Identify which hours of the day generate your best work, and catch slipping habits early.
              </p>
              <div className="mt-6 flex flex-col gap-3">
                <div className="flex items-center gap-3 text-xs text-stone-300">
                  <BarChart3 className="h-4 w-4 text-emerald-400" />
                  <span>Weekly automated reviews summarizing wins and weak spots.</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-stone-300">
                  <Award className="h-4 w-4 text-emerald-400" />
                  <span>XP levels from Beginner to Goal Crusher to reward follow-through.</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-stone-300">
                  <HelpCircle className="h-4 w-4 text-emerald-400" />
                  <span>Daily question check-in: "Did you do anything productive today?"</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 8: Testimonials / User Evidence */}
      <section className="py-20 border-t border-stone-800/80 bg-stone-900/30">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-100">
            Built for Follow-Through
          </h2>
          <p className="mt-2 text-sm text-stone-400">
            Real frameworks that help ambitious people stay consistent when motivation drops.
          </p>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-5">
              <p className="text-xs text-stone-300 leading-relaxed">
                "The 'Why' anchor is brilliant. Whenever I feel like skipping evening practice, the coach reminds me of my goal to land a remote role and support my family."
              </p>
              <div className="mt-4 pt-3 border-t border-stone-800/60 flex items-center justify-between text-[11px] text-stone-400">
                <span className="font-semibold text-stone-200">Victor A.</span>
                <span>Frontend Engineer</span>
              </div>
            </div>

            <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-5">
              <p className="text-xs text-stone-300 leading-relaxed">
                "Other apps punish you when you miss a day. Here, the AI coach offers a warm restart prompt that got me right back on track the very next morning."
              </p>
              <div className="mt-4 pt-3 border-t border-stone-800/60 flex items-center justify-between text-[11px] text-stone-400">
                <span className="font-semibold text-stone-200">Sarah K.</span>
                <span>Startup Founder</span>
              </div>
            </div>

            <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-5">
              <p className="text-xs text-stone-300 leading-relaxed">
                "The Goal Score calculation makes sense. It doesn't feel like arbitrary gamification; it genuinely shows whether I'm sticking to my promises."
              </p>
              <div className="mt-4 pt-3 border-t border-stone-800/60 flex items-center justify-between text-[11px] text-stone-400">
                <span className="font-semibold text-stone-200">Marcus T.</span>
                <span>Graduate Student</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 10: FAQ */}
      <section className="py-20 border-t border-stone-800/80">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-100">
              Frequently Asked Questions
            </h2>
            <p className="mt-2 text-sm text-stone-400">
              Everything you need to know about Consistency Assistant.
            </p>
          </div>

          <div className="mt-10 divide-y divide-stone-800 border-y border-stone-800">
            {faqs.map((faq, idx) => (
              <div key={idx} className="py-4">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="flex w-full items-center justify-between text-left text-sm font-semibold text-stone-200 hover:text-emerald-400 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 transform transition-transform duration-200 ${
                      openFaq === idx ? 'rotate-180 text-emerald-400' : 'text-stone-500'
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <p className="mt-3 text-xs text-stone-400 leading-relaxed pr-6">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 11: Final CTA */}
      <section className="py-20 border-t border-stone-800/80 bg-gradient-to-b from-stone-900/40 to-stone-950">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-stone-100">
            Are you ready to actually follow through?
          </h2>
          <p className="mt-4 text-sm sm:text-base text-stone-400 max-w-xl mx-auto">
            Take 2 minutes to define what matters, break it into manageable steps, and let intelligent accountability support your consistency.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onStartOnboarding}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-7 py-4 text-sm font-semibold text-stone-950 shadow-lg shadow-emerald-500/25 hover:bg-emerald-400 transition-all cursor-pointer"
            >
              <span>Get Started Now — It's Free</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={onOpenDashboard}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-stone-900 border border-stone-800 px-6 py-4 text-sm font-semibold text-stone-200 hover:bg-stone-800 transition-all cursor-pointer"
            >
              <span>Explore Dashboard</span>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-stone-800/80 py-8 px-4 text-center text-xs text-stone-400">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
          <span className="font-semibold text-stone-300">Consistency Assistant</span>
        </div>
        <p>"Are you actually doing what you said you wanted to do?"</p>
      </footer>
    </div>
  );
};
