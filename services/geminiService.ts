
import { GoogleGenAI } from "@google/genai";
import type { DailyLog } from '../types';

if (!process.env.API_KEY) {
  console.warn("API_KEY environment variable not set. AI Coach will not work.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

function buildPrompt(log: DailyLog): string {
  const completedStudy = log.study.filter(t => t.completed).length;
  const totalStudy = log.study.length;
  const completedWorkout = log.workout.filter(t => t.completed).length;
  const totalWorkout = log.workout.length;
  const completedHabits = log.habits.filter(t => t.completed).length;
  const totalHabits = log.habits.length;

  let prompt = `Analyze this daily log and provide a short (2-3 sentences), encouraging, and actionable piece of advice for tomorrow. Be a friendly and supportive coach.
  
  Today's log:
  - Study: ${completedStudy}/${totalStudy} tasks completed.
  - Workout: ${completedWorkout}/${totalWorkout} exercises completed.
  - Habits: ${completedHabits}/${totalHabits} completed.
  - Water: ${log.lifestyle.water.current}/${log.lifestyle.water.goal} glasses.
  - Sleep: Bedtime ${log.lifestyle.sleep.bedtime || 'not set'}, Wake-up ${log.lifestyle.sleep.wakeup || 'not set'}.
  - Screen Time: ${log.lifestyle.screenTime.hours}h ${log.lifestyle.screenTime.minutes}m.
  
  Focus on one key area for improvement or praise. Be positive and avoid being overly critical. Suggest a small, specific action for tomorrow.`;

  return prompt;
}

export async function getAiCoachSuggestion(log: DailyLog): Promise<string> {
    if (!process.env.API_KEY) {
        return "AI Coach is unavailable. Please set up your API_KEY.";
    }

    try {
        const prompt = buildPrompt(log);
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                temperature: 0.7,
                topP: 1,
                topK: 1,
                maxOutputTokens: 100,
            }
        });
        
        return response.text;
    } catch (error) {
        console.error("Error getting AI suggestion:", error);
        return "Sorry, I couldn't generate a suggestion right now. Please try again later.";
    }
}