
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { DailyLog, Task, Habit, Section, WorkoutType } from './types';
import { getFormattedDate, getDayOfWeek } from './utils/dateUtils';
import { DEFAULT_WORKOUT_SCHEDULE, ICONS } from './constants';
import Header from './components/Header';
import ProgressBar from './components/ProgressBar';
import TaskCard from './components/TaskCard';
import TaskItem from './components/TaskItem';
import WeeklyView from './components/WeeklyView';
import AiCoach from './components/AiCoach';

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useLocalStorage<boolean>('darkMode', false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [logs, setLogs] = useLocalStorage<Record<string, DailyLog>>('dailyLogs', {});
  const [isWeeklyViewOpen, setIsWeeklyViewOpen] = useState(false);
  const [isAiCoachOpen, setIsAiCoachOpen] = useState(false);

  const dateKey = useMemo(() => getFormattedDate(currentDate), [currentDate]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  const currentLog = useMemo((): DailyLog => {
    if (logs[dateKey]) {
      return logs[dateKey];
    }
    const dayOfWeek = getDayOfWeek(currentDate) as WorkoutType;
    const workoutForToday = DEFAULT_WORKOUT_SCHEDULE[dayOfWeek] || [];
    return {
      study: [],
      workout: workoutForToday.map(ex => ({ id: crypto.randomUUID(), text: ex, completed: false })),
      habits: [
        { id: crypto.randomUUID(), text: "Meditate for 10 minutes", completed: false },
        { id: crypto.randomUUID(), text: "Journal for 5 minutes", completed: false },
      ],
      lifestyle: {
        water: { current: 0, goal: 8 },
        sleep: { bedtime: '', wakeup: '' },
        screenTime: { hours: 0, minutes: 0 },
      },
    };
  }, [logs, dateKey, currentDate]);

  const updateLog = useCallback((newLogData: Partial<DailyLog>) => {
    setLogs(prevLogs => ({
      ...prevLogs,
      [dateKey]: {
        ...currentLog,
        ...newLogData,
        lifestyle: {
          ...currentLog.lifestyle,
          ...(newLogData.lifestyle || {}),
        }
      },
    }));
  }, [dateKey, currentLog, setLogs]);

  const handleTaskToggle = (section: Section, id: string) => {
    const sectionTasks = currentLog[section] as Task[];
    const updatedTasks = sectionTasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    updateLog({ [section]: updatedTasks });
  };
  
  const handleAddTask = (section: 'study' | 'habits', text: string) => {
    if (!text.trim()) return;
    const newTask = { id: crypto.randomUUID(), text, completed: false };
    const sectionTasks = currentLog[section] as (Task[] | Habit[]);
    updateLog({ [section]: [...sectionTasks, newTask] });
  };

  const handleRemoveTask = (section: 'study' | 'habits', id: string) => {
    const sectionTasks = currentLog[section] as (Task[] | Habit[]);
    updateLog({ [section]: sectionTasks.filter(task => task.id !== id) });
  };

  const handleWaterChange = (amount: number) => {
    const newWaterCount = Math.max(0, currentLog.lifestyle.water.current + amount);
    updateLog({ lifestyle: { ...currentLog.lifestyle, water: { ...currentLog.lifestyle.water, current: newWaterCount } } });
  };

  const handleLifestyleChange = <K extends keyof DailyLog['lifestyle']>(
    key: K,
    value: DailyLog['lifestyle'][K]
  ) => {
    updateLog({ lifestyle: { ...currentLog.lifestyle, [key]: value } });
  };

  const allTasks = [
    ...currentLog.study,
    ...currentLog.workout,
    ...currentLog.habits,
    { id: 'water', completed: currentLog.lifestyle.water.current >= currentLog.lifestyle.water.goal },
    { id: 'sleep', completed: !!currentLog.lifestyle.sleep.bedtime && !!currentLog.lifestyle.sleep.wakeup },
  ];
  const completedTasks = allTasks.filter(task => task.completed).length;
  const progress = allTasks.length > 0 ? (completedTasks / allTasks.length) * 100 : 0;
  
  const handleNotionSync = () => {
    const dataForNotion = {
      date: dateKey,
      study: `${currentLog.study.filter(t => t.completed).length}/${currentLog.study.length} tasks completed`,
      workout: `${currentLog.workout.filter(t => t.completed).length}/${currentLog.workout.length} exercises completed`,
      habits: `${currentLog.habits.filter(t => t.completed).length}/${currentLog.habits.length} habits completed`,
      water: `${currentLog.lifestyle.water.current}/${currentLog.lifestyle.water.goal} glasses`,
      sleep: `Bed: ${currentLog.lifestyle.sleep.bedtime || 'N/A'}, Wake: ${currentLog.lifestyle.sleep.wakeup || 'N/A'}`,
      screenTime: `${currentLog.lifestyle.screenTime.hours}h ${currentLog.lifestyle.screenTime.minutes}m`,
    };
    
    console.log("--- Syncing to Notion ---");
    console.log(JSON.stringify(dataForNotion, null, 2));
    alert("Data prepared for Notion sync. Check the console for the data payload. In a real app, this would be sent to a Notion API endpoint.");
  };

  return (
    <div className="min-h-screen font-sans text-gray-800 dark:text-gray-200">
      <div className="container mx-auto max-w-2xl p-4 pb-20">
        <Header 
          currentDate={currentDate} 
          setCurrentDate={setCurrentDate} 
          isDarkMode={isDarkMode} 
          toggleDarkMode={toggleDarkMode} 
          onWeeklyView={() => setIsWeeklyViewOpen(true)}
          onNotionSync={handleNotionSync}
        />
        
        <main>
          <ProgressBar progress={progress} />
          
          <div className="space-y-6 mt-6">
            <TaskCard title="Study" color="study" icon={ICONS.study}>
                {currentLog.study.map(task => (
                    <TaskItem key={task.id} task={task} onToggle={() => handleTaskToggle('study', task.id)} onRemove={() => handleRemoveTask('study', task.id)} />
                ))}
                <NewTaskInput onAddTask={(text) => handleAddTask('study', text)} />
            </TaskCard>

            <TaskCard title="Workout" color="workout" icon={ICONS.workout}>
              {currentLog.workout.length > 0 ? currentLog.workout.map(task => (
                <TaskItem key={task.id} task={task} onToggle={() => handleTaskToggle('workout', task.id)} />
              )) : <p className="text-sm text-gray-500 dark:text-gray-400 px-3 py-2">Rest day! 🧘</p>}
            </TaskCard>

            <TaskCard title="Habits" color="habits" icon={ICONS.habits}>
               {currentLog.habits.map(task => (
                  <TaskItem key={task.id} task={task} onToggle={() => handleTaskToggle('habits', task.id)} onRemove={() => handleRemoveTask('habits', task.id)} />
                ))}
                <NewTaskInput onAddTask={(text) => handleAddTask('habits', text)} />
            </TaskCard>

            <TaskCard title="Lifestyle" color="lifestyle" icon={ICONS.lifestyle}>
              <WaterTracker 
                current={currentLog.lifestyle.water.current}
                goal={currentLog.lifestyle.water.goal}
                onUpdate={handleWaterChange}
              />
              <SleepTracker 
                sleepData={currentLog.lifestyle.sleep}
                onUpdate={(value) => handleLifestyleChange('sleep', value)}
              />
              <ScreenTimeTracker
                screenTimeData={currentLog.lifestyle.screenTime}
                onUpdate={(value) => handleLifestyleChange('screenTime', value)}
              />
            </TaskCard>
          </div>
        </main>
        
        <button
          onClick={() => setIsAiCoachOpen(true)}
          className="fixed bottom-6 right-6 bg-gradient-to-br from-purple-600 to-blue-500 text-white p-4 rounded-full shadow-lg hover:scale-105 transform transition-transform duration-200"
          aria-label="Open AI Coach"
        >
          {ICONS.aiCoach}
        </button>
      </div>

      {isWeeklyViewOpen && <WeeklyView logs={logs} onClose={() => setIsWeeklyViewOpen(false)} />}
      {isAiCoachOpen && <AiCoach dailyLog={currentLog} onClose={() => setIsAiCoachOpen(false)} />}
    </div>
  );
};

const NewTaskInput: React.FC<{ onAddTask: (text: string) => void }> = ({ onAddTask }) => {
  const [text, setText] = useState('');
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddTask(text);
    setText('');
  };
  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 px-3 pt-2">
      <input 
        type="text" 
        value={text} 
        onChange={(e) => setText(e.target.value)} 
        placeholder="Add a new task..."
        className="flex-grow bg-transparent border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 py-1 text-sm"
      />
      <button type="submit" className="text-gray-500 hover:text-blue-500 dark:hover:text-blue-400" aria-label="Add task">{ICONS.add}</button>
    </form>
  );
};

const WaterTracker: React.FC<{ current: number; goal: number; onUpdate: (amount: number) => void }> = ({ current, goal, onUpdate }) => {
  return (
    <div className="flex items-center justify-between px-3 py-2">
      <div className="flex items-center gap-2">
        {ICONS.water}
        <span className="text-sm">Water Intake</span>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={() => onUpdate(-1)} className="p-1 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600">{ICONS.minus}</button>
        <span className="text-sm font-semibold w-12 text-center">{current} / {goal}</span>
        <button onClick={() => onUpdate(1)} className="p-1 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600">{ICONS.plus}</button>
      </div>
    </div>
  );
};

const SleepTracker: React.FC<{ sleepData: DailyLog['lifestyle']['sleep']; onUpdate: (value: DailyLog['lifestyle']['sleep']) => void }> = ({ sleepData, onUpdate }) => {
  return (
    <div className="flex items-center justify-between px-3 py-2">
       <div className="flex items-center gap-2">
        {ICONS.sleep}
        <span className="text-sm">Sleep</span>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <label htmlFor="bedtime">Bed:</label>
        <input type="time" id="bedtime" value={sleepData.bedtime} onChange={(e) => onUpdate({...sleepData, bedtime: e.target.value})} className="bg-gray-200 dark:bg-gray-700 rounded-md p-1 w-24" />
        <label htmlFor="wakeup">Wake:</label>
        <input type="time" id="wakeup" value={sleepData.wakeup} onChange={(e) => onUpdate({...sleepData, wakeup: e.target.value})} className="bg-gray-200 dark:bg-gray-700 rounded-md p-1 w-24" />
      </div>
    </div>
  );
};

const ScreenTimeTracker: React.FC<{ screenTimeData: DailyLog['lifestyle']['screenTime']; onUpdate: (value: DailyLog['lifestyle']['screenTime']) => void }> = ({ screenTimeData, onUpdate }) => {
  return (
    <div className="flex items-center justify-between px-3 py-2">
       <div className="flex items-center gap-2">
        {ICONS.screenTime}
        <span className="text-sm">Screen Time</span>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <input 
          type="number" 
          value={screenTimeData.hours} 
          onChange={(e) => onUpdate({...screenTimeData, hours: parseInt(e.target.value, 10) || 0})}
          className="bg-gray-200 dark:bg-gray-700 rounded-md p-1 w-14 text-center"
          min="0"
        />
        <span>h</span>
        <input 
          type="number" 
          value={screenTimeData.minutes} 
          onChange={(e) => onUpdate({...screenTimeData, minutes: parseInt(e.target.value, 10) || 0})}
          className="bg-gray-200 dark:bg-gray-700 rounded-md p-1 w-14 text-center"
          min="0"
          max="59"
        />
        <span>m</span>
      </div>
    </div>
  );
};

export default App;