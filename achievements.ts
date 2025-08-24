import React from 'react';
import { DailyLog, Achievement } from './types';
import { ICONS } from './constants';
import { calculateStreaks } from './utils/statsUtils';

interface AchievementDefinition {
    id: string;
    name: string;
    description: string;
    icon: React.ReactNode;
    condition: (logs: Record<string, DailyLog>, streaks: { study: number, workout: number, habits: number }) => boolean;
}

export const ACHIEVEMENTS_LIST: AchievementDefinition[] = [
  {
    id: 'FIRST_STEP',
    name: 'First Step',
    description: 'Complete your first task.',
    icon: ICONS.star,
    condition: (logs) => Object.values(logs).some(log => 
        [...log.study, ...log.workout, ...log.habits].some(t => t.completed)
    ),
  },
  {
    id: 'PERFECT_DAY',
    name: 'Perfect Day',
    description: 'Complete all tasks and goals for a day.',
    icon: ICONS.target,
    condition: (logs) => Object.values(logs).some(log => {
        const allTasks = [...log.study, ...log.workout, ...log.habits];
        if (allTasks.length === 0) return false;
        const allTasksCompleted = allTasks.every(t => t.completed);
        const waterGoalMet = log.lifestyle.water.current >= log.lifestyle.water.goal;
        return allTasksCompleted && waterGoalMet;
    }),
  },
  {
    id: 'STUDY_STREAK_3',
    name: 'Dedicated Scholar',
    description: 'Maintain a 3-day study streak.',
    icon: ICONS.study,
    condition: (logs, streaks) => streaks.study >= 3,
  },
  {
    id: 'WORKOUT_STREAK_3',
    name: 'Fitness Fanatic',
    description: 'Maintain a 3-day workout streak.',
    icon: ICONS.workout,
    condition: (logs, streaks) => streaks.workout >= 3,
  },
  {
    id: 'HABIT_STREAK_7',
    name: 'Consistency King',
    description: 'Maintain a 7-day habit streak.',
    icon: ICONS.habits,
    condition: (logs, streaks) => streaks.habits >= 7,
  },
  {
    id: 'HYDRATION_HERO',
    name: 'Hydration Hero',
    description: 'Meet your water goal for 7 consecutive days.',
    icon: ICONS.water,
    condition: (logs) => {
        let consecutiveDays = 0;
        for (let i = 0; i < 7; i++) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateKey = date.toISOString().split('T')[0];
            const log = logs[dateKey];
            if (log && log.lifestyle.water.current >= log.lifestyle.water.goal) {
                consecutiveDays++;
            } else {
                break;
            }
        }
        return consecutiveDays >= 7;
    },
  },
];

export const checkAchievements = (logs: Record<string, DailyLog>): Achievement[] => {
    const streaks = calculateStreaks(logs, new Date());
    
    return ACHIEVEMENTS_LIST.map(ach => ({
        ...ach,
        unlocked: ach.condition(logs, streaks),
    }));
};
