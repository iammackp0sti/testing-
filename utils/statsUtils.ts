import { DailyLog, WorkoutType } from '../types';
import { getFormattedDate } from './dateUtils';
import { DEFAULT_WORKOUT_SCHEDULE } from '../constants';

export const calculateStreaks = (logs: Record<string, DailyLog>, today: Date) => {
    const streaks = { study: 0, workout: 0, habits: 0 };
    const categories: ('study' | 'workout' | 'habits')[] = ['study', 'workout', 'habits'];

    for (const category of categories) {
        let currentStreak = 0;
        let dateToCheck = new Date(today);

        // If today has no tasks for the category, start the check from yesterday to preserve the streak.
        const todayKey = getFormattedDate(dateToCheck);
        const todayLog = logs[todayKey];
        if (!todayLog || !todayLog[category] || todayLog[category].length === 0) {
            dateToCheck.setDate(dateToCheck.getDate() - 1);
        }

        // eslint-disable-next-line no-constant-condition
        while (true) {
            const dateKey = getFormattedDate(dateToCheck);
            const log = logs[dateKey];

            if (category === 'workout') {
                const dayOfWeek = dateToCheck.toLocaleDateString('en-US', { weekday: 'long' }) as WorkoutType;
                const workoutForDay = DEFAULT_WORKOUT_SCHEDULE[dayOfWeek] || [];
                const isRestDay = workoutForDay.length === 0 || workoutForDay[0] === 'Rest';
                if (isRestDay) {
                    dateToCheck.setDate(dateToCheck.getDate() - 1);
                    continue; // Skip rest days without breaking streak
                }
            }
            
            // A day breaks the streak if it has tasks, but none are completed.
            if (log && log[category] && log[category].length > 0) {
                if (log[category].some(task => task.completed)) {
                    currentStreak++;
                } else {
                    break; // Streak broken: tasks existed but none were done.
                }
            } else {
                // A day without a log or without tasks for the category also breaks the streak.
                break;
            }
            
            dateToCheck.setDate(dateToCheck.getDate() - 1);
        }
        streaks[category] = currentStreak;
    }
    return streaks;
};
