import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
if (apiKey) {
  try {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI client:', err);
  }
}

// Data persistence file path
const DATA_FILE = path.resolve(__dirname, 'server-data.json');

// Helper to read data
function getPersistedData() {
  if (fs.existsSync(DATA_FILE)) {
    try {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(raw);
    } catch (e) {
      console.error('Error reading server data:', e);
    }
  }
  return null;
}

// Helper to write data
function savePersistedData(data: any) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (e) {
    console.error('Error writing server data:', e);
    return false;
  }
}

// Data persistence routes
app.get('/api/data', (_req, res) => {
  const data = getPersistedData();
  res.json({ success: true, data });
});

app.post('/api/sync', (req, res) => {
  const success = savePersistedData(req.body);
  res.json({ success });
});

// AI 1: Goal Breakdown Roadmap
app.post('/api/ai/breakdown-goal', async (req, res) => {
  const { goalTitle, reason, category, deadlineType, commitmentLevel } = req.body;

  const fallbackRoadmap = {
    overview: `A balanced roadmap to accomplish "${goalTitle}" with a ${commitmentLevel || 'Serious'} commitment level.`,
    milestones: [
      {
        title: 'Phase 1: Foundation & Core Principles',
        description: 'Master the non-negotiable fundamentals and establish a daily learning rhythm.',
        order: 1,
        suggestedTasks: [
          {
            title: `Review foundational concepts for ${goalTitle}`,
            description: 'Identify top 3 primary resources and set up workspace.',
            priority: 'High',
            duration: 45,
            difficulty: 'Easy',
          },
          {
            title: 'Complete initial assessment and note-taking',
            description: 'Draft notes on core principles and bookmark reference docs.',
            priority: 'Medium',
            duration: 30,
            difficulty: 'Medium',
          },
        ],
      },
      {
        title: 'Phase 2: Deliberate Practice & Mini-Projects',
        description: 'Apply the basics into real-world scenarios or concrete exercises.',
        order: 2,
        suggestedTasks: [
          {
            title: 'Build first practical exercise or application',
            description: 'Synthesize chapter 1-3 learnings into an actual project.',
            priority: 'High',
            duration: 60,
            difficulty: 'Medium',
          },
          {
            title: 'Troubleshoot bottlenecks and review mistakes',
            description: 'Document tricky points and seek solutions.',
            priority: 'Medium',
            duration: 30,
            difficulty: 'Medium',
          },
        ],
      },
      {
        title: 'Phase 3: Real-World Execution & Mastery',
        description: 'Consolidate accomplishments, build a comprehensive outcome, and evaluate progress.',
        order: 3,
        suggestedTasks: [
          {
            title: 'Execute capstone project or comprehensive milestone',
            description: 'Bring all pieces together into a tangible deliverable.',
            priority: 'High',
            duration: 90,
            difficulty: 'Hard',
          },
          {
            title: 'Review results against original goal criteria',
            description: 'Evaluate performance, celebrate wins, and define next iteration.',
            priority: 'Medium',
            duration: 30,
            difficulty: 'Easy',
          },
        ],
      },
    ],
    coachingTip: `Remember: "${reason || 'Your deeper why'}" is your compass. Small daily consistency always beats sporadic marathon sessions.`,
  };

  if (!aiClient) {
    return res.json(fallbackRoadmap);
  }

  try {
    const prompt = `You are an expert productivity coach and system architect for Consistency Assistant.
The user wants to achieve:
Goal: "${goalTitle}"
Category: "${category || 'General'}"
Why it matters: "${reason || 'Personal growth'}"
Commitment: "${commitmentLevel || 'Serious'}"
Deadline: "${deadlineType || 'flexible'}"

Break this goal down into 3 to 5 clear, sequential milestones. For each milestone, provide 2 to 3 actionable, specific starter tasks (duration between 20 and 60 minutes).
Include an encouraging coaching tip that subtly connects to their "Why".

Respond ONLY with valid JSON in this exact structure:
{
  "overview": "Short motivational summary",
  "milestones": [
    {
      "title": "Milestone title",
      "description": "Milestone description",
      "order": 1,
      "suggestedTasks": [
        {
          "title": "Actionable task name",
          "description": "Short instruction",
          "priority": "High" | "Medium" | "Low",
          "duration": 45,
          "difficulty": "Easy" | "Medium" | "Hard"
        }
      ]
    }
  ],
  "coachingTip": "Encouraging coaching advice connecting to their why"
}`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text?.trim() || '';
    const parsed = JSON.parse(text);
    return res.json(parsed);
  } catch (error) {
    console.error('Error generating goal breakdown:', error);
    return res.json(fallbackRoadmap);
  }
});

// AI 2: Smart Task Feasibility & Adjustment Suggestion
app.post('/api/ai/suggest-task-adjustment', async (req, res) => {
  const { taskTitle, duration, priority, dailyLoadMinutes, existingTasksCount } = req.body;

  const durationNum = Number(duration) || 30;
  const isHighLoad = durationNum >= 240 || (dailyLoadMinutes && dailyLoadMinutes + durationNum > 480);

  const fallback = {
    isUnrealistic: isHighLoad,
    suggestion: isHighLoad
      ? `Scheduling ${durationNum} minutes in one sitting can lead to cognitive fatigue. Based on high-performance habit research, starting with a focused 45–60 minute block with a short break yields higher retention and consistency.`
      : `This task fits comfortably into your daily rhythm. Keep your phone in another room to maximize focus.`,
    recommendedDuration: isHighLoad ? Math.min(60, Math.round(durationNum / 3)) : durationNum,
    reasoning: isHighLoad
      ? 'Consistency compounds when friction is low. Smaller daily wins prevent procrastination.'
      : 'Healthy task sizing sustains consistent momentum.',
  };

  if (!aiClient || !isHighLoad) {
    return res.json(fallback);
  }

  try {
    const prompt = `The user wants to schedule a task: "${taskTitle}" for ${durationNum} minutes (Priority: ${priority || 'Medium'}).
Current daily load already planned: ${dailyLoadMinutes || 0} minutes across ${existingTasksCount || 0} tasks.

Assess if this plan is overly ambitious or unrealistic.
If it is excessive (e.g. 4+ hours for a single session, or 8+ hours total daily load), recommend a realistic, gradual alternative that preserves consistency.
Respond ONLY in valid JSON:
{
  "isUnrealistic": boolean,
  "suggestion": "Empathetic, clear coaching advice",
  "recommendedDuration": number,
  "reasoning": "Scientific or behavioral explanation"
}`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text?.trim() || '{}');
    return res.json(parsed);
  } catch (err) {
    console.error('Error checking task feasibility:', err);
    return res.json(fallback);
  }
});

// AI 3: Accountability Assistant Advice
app.post('/api/ai/accountability-advice', async (req, res) => {
  const { userName, goals, tasks, streak, completionRate, recentCompletedCount, recentMissedCount } = req.body;

  const primaryGoal = goals?.[0];
  const goalTitle = primaryGoal?.title || 'your key goal';
  const reason = primaryGoal?.reason || 'your personal aspirations';

  const fallback = {
    greeting: `Hey ${userName || 'there'}, let's look at your progress.`,
    message: recentMissedCount > 1
      ? `I noticed a couple of tasks were missed recently. That is completely normal—momentum fluctuates. Remember why you started: ${reason}. You don't need to do everything today; just pick one 20-minute action.`
      : `You're maintaining a solid rhythm with a ${streak || 1}-day streak! Your follow-through is building genuine momentum toward "${goalTitle}".`,
    actionableStep: tasks?.find((t: any) => t.status === 'pending')
      ? `Tackle "${tasks.find((t: any) => t.status === 'pending')?.title}" next for a quick win.`
      : `Take 5 minutes to review tomorrow's plan before ending your session.`,
    patternNoticed: recentCompletedCount > 3
      ? 'You tend to complete tasks with higher velocity when they are scheduled in focused 30-45 minute blocks.'
      : 'Scheduling tasks with clear time blocks improves completion rate by up to 2x.',
  };

  if (!aiClient) {
    return res.json(fallback);
  }

  try {
    const prompt = `You are Focus AI (Consistency Coach) for Consistency Assistant.
User: ${userName || 'User'}
Primary Goal: "${goalTitle}"
Why they care: "${reason}"
Current Streak: ${streak || 0} days
Today's Completion Rate: ${completionRate || 0}%
Recent Completed: ${recentCompletedCount || 0}
Recent Missed: ${recentMissedCount || 0}
Pending tasks: ${JSON.stringify(tasks?.slice(0, 4).map((t: any) => t.title) || [])}

Provide supportive, non-judgmental, hyper-actionable accountability coaching.
Do NOT sound robotic or preachy. Be a supportive partner asking "Are you actually doing what you said you wanted to do?" in an encouraging way.
Respond ONLY with JSON:
{
  "greeting": "Personal greeting",
  "message": "Empathetic insight connecting to their why",
  "actionableStep": "One concrete small action to take right now",
  "patternNoticed": "A behavioral observation about their productivity"
}`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' },
    });

    const parsed = JSON.parse(response.text?.trim() || '{}');
    return res.json(parsed);
  } catch (err) {
    console.error('Error generating accountability advice:', err);
    return res.json(fallback);
  }
});

// AI 4: Daily Accountability Question Response
app.post('/api/ai/daily-question-response', async (req, res) => {
  const { response: userChoice, details, goalTitle, reason } = req.body;

  let fallbackMessage = '';
  let nextAction = '';

  if (userChoice === 'yes') {
    fallbackMessage = `Well done! Recognizing progress reinforces identity. ${details ? `Celebrating: "${details}"!` : ''} Every completed action is evidence of who you are becoming.`;
    nextAction = 'Log this win and take a brief moment to celebrate your consistency.';
  } else if (userChoice === 'not_yet') {
    fallbackMessage = `You still have hours left in the day! A 15-minute micro-session on "${goalTitle || 'your goal'}" will protect your streak and give you momentum.`;
    nextAction = 'Start a 15-minute Focus Session on your simplest remaining task.';
  } else {
    fallbackMessage = `That's okay. Some days are about recovery or handling unexpected life events. Don't judge yourself. Tomorrow is a clean slate to recommit to: "${reason || 'your goals'}".`;
    nextAction = 'Set up one easy task for tomorrow morning so you start with immediate momentum.';
  }

  if (!aiClient) {
    return res.json({ message: fallbackMessage, nextAction });
  }

  try {
    const prompt = `The user answered the daily accountability check-in:
Question: "Did you do anything productive today?"
User Answer: "${userChoice}" (${userChoice === 'yes' ? 'Accomplished: ' + details : 'Not yet or no'})
Goal: "${goalTitle || 'Key Goal'}"
Why: "${reason || 'Growth'}"

Provide a warm, supportive response (2-3 sentences) and 1 practical micro-step.
Respond ONLY in JSON:
{
  "message": "Supportive feedback",
  "nextAction": "1 clear next step"
}`;

    const resAi = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' },
    });

    const parsed = JSON.parse(resAi.text?.trim() || '{}');
    return res.json(parsed);
  } catch (err) {
    console.error('Error generating daily question response:', err);
    return res.json({ message: fallbackMessage, nextAction });
  }
});

// AI 5: Weekly Review Generation
app.post('/api/ai/weekly-review', async (req, res) => {
  const { completionRate, completedCount, totalCount, focusTimeMinutes, streak, strongestArea, needsImprovement } = req.body;

  const fallback = {
    summary: `You wrapped up the week with a ${completionRate || 0}% task completion rate, finishing ${completedCount || 0} out of ${totalCount || 0} planned items and logging ${Math.round((focusTimeMinutes || 0) / 60)} hours of deep focus.`,
    whatWentWell: [
      `Maintained a solid ${streak || 1}-day consistency streak.`,
      `Demonstrated consistent focus in ${strongestArea || 'Core Learning'}.`,
      `Protected dedicated focus blocks for priority objectives.`,
    ],
    whatNeedsAttention: [
      `${needsImprovement || 'Secondary habits'} were deferred during peak busy hours.`,
      `Energy dipped slightly on late evening sessions.`,
    ],
    recommendation: `Try front-loading your most demanding tasks before 2 PM. You follow through at nearly double the rate when you begin early.`,
  };

  if (!aiClient) {
    return res.json(fallback);
  }

  try {
    const prompt = `Analyze this user's weekly consistency performance:
Completion Rate: ${completionRate}%
Tasks: ${completedCount}/${totalCount} completed
Deep Focus Time: ${focusTimeMinutes} minutes
Streak: ${streak} days
Strongest Area: ${strongestArea || 'Primary Tasks'}
Struggling Area: ${needsImprovement || 'Secondary Tasks'}

Generate an insightful, uplifting weekly review report.
Respond ONLY in JSON:
{
  "summary": "1-2 sentence executive summary",
  "whatWentWell": ["win 1", "win 2", "win 3"],
  "whatNeedsAttention": ["area to improve 1", "area to improve 2"],
  "recommendation": "1 specific high-leverage recommendation for next week"
}`;

    const resAi = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' },
    });

    const parsed = JSON.parse(resAi.text?.trim() || '{}');
    return res.json(parsed);
  } catch (err) {
    console.error('Error generating weekly review:', err);
    return res.json(fallback);
  }
});

// AI 6: Personalized Motivation
app.post('/api/ai/motivation', async (req, res) => {
  const { goalTitle, reason, currentContext } = req.body;

  const fallbackQuote = reason
    ? `Remember why you started: ${reason}. You don't need to finish everything today—just win the next 25 minutes.`
    : `Progress is not built in rare bursts of motivation, but in quiet daily decisions to show up.`;

  if (!aiClient) {
    return res.json({ quote: fallbackQuote, author: 'Focus AI' });
  }

  try {
    const prompt = `Generate a short, deeply resonant motivational message for a user working on:
Goal: "${goalTitle || 'Personal growth'}"
Their Core Reason: "${reason || 'To create a better life'}"
Context: "${currentContext || 'Facing resistance or feeling overwhelmed'}"

Rules:
- Directly weave in their reason naturally.
- Emphasize taking the next small step rather than striving for perfection.
- Maximum 2 sentences.
Respond ONLY in JSON:
{
  "quote": "Personalized motivational statement",
  "author": "Consistency Coach"
}`;

    const resAi = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' },
    });

    const parsed = JSON.parse(resAi.text?.trim() || '{}');
    return res.json(parsed);
  } catch (err) {
    console.error('Error generating motivation:', err);
    return res.json({ quote: fallbackQuote, author: 'Focus AI' });
  }
});

// Vite middleware in dev or static files in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Consistency Assistant server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
