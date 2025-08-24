
import { ICONS as IconComponents } from './components/icons';
import type { WorkoutType } from './types';

export const DEFAULT_WORKOUT_SCHEDULE: Record<WorkoutType, string[]> = {
  Monday: ['Bench Press: 3x5', 'Overhead Press: 3x8', 'Incline Dumbbell Press: 3x10', 'Tricep Pushdowns: 3x12', 'Lateral Raises: 3x15'],
  Tuesday: ['Squats: 3x5', 'Romanian Deadlifts: 3x8', 'Leg Press: 3x10', 'Leg Curls: 3x12', 'Calf Raises: 4x15'],
  Wednesday: ['Pull-ups: 3xAMRAP', 'Barbell Rows: 3x8', 'Lat Pulldowns: 3x10', 'Bicep Curls: 3x12', 'Face Pulls: 3x15'],
  Thursday: [],
  Friday: ['Deadlifts: 1x5', 'Overhead Press: 3x5', 'Dumbbell Rows: 3x8', 'Chest Dips: 3xAMRAP', 'Hammer Curls: 3x12'],
  Saturday: ['Cardio & Abs: 30-min run', 'Plank: 3x60s', 'Leg Raises: 3x15', 'Cable Crunches: 3x20'],
  Sunday: [],
};

export const ICONS = IconComponents;