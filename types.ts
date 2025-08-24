
export interface Task {
  id: string;
  text: string;
  completed: boolean;
}

export type Habit = Task;

export interface Lifestyle {
  water: {
    current: number;
    goal: number;
  };
  sleep: {
    bedtime: string;
    wakeup: string;
  };
  screenTime: {
    hours: number;
    minutes: number;
  };
}

export interface DailyLog {
  study: Task[];
  workout: Task[];
  habits: Habit[];
  lifestyle: Lifestyle;
}

export type Section = 'study' | 'workout' | 'habits';

export type WorkoutType = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';