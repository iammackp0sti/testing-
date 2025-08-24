import React, { useMemo } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DailyLog } from '../types';
import { getFormattedDate } from '../utils/dateUtils';
import { ICONS } from '../constants';

interface WeeklyViewProps {
  logs: Record<string, DailyLog>;
  onClose: () => void;
}

const WeeklyView: React.FC<WeeklyViewProps> = ({ logs, onClose }) => {
  const chartData = useMemo(() => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateKey = getFormattedDate(date);
      const log = logs[dateKey];

      let studyPercent = 0;
      let workoutPercent = 0;
      let habitsPercent = 0;
      let waterIntake = 0;

      if (log) {
        const totalStudy = log.study.length;
        if (totalStudy > 0) {
            studyPercent = (log.study.filter(t => t.completed).length / totalStudy) * 100;
        }
        const totalWorkout = log.workout.length;
        if (totalWorkout > 0) {
            workoutPercent = (log.workout.filter(t => t.completed).length / totalWorkout) * 100;
        }
        const totalHabits = log.habits.length;
        if (totalHabits > 0) {
            habitsPercent = (log.habits.filter(t => t.completed).length / totalHabits) * 100;
        }
        waterIntake = log.lifestyle.water.current;
      }
      
      data.push({
        name: date.toLocaleDateString('en-US', { weekday: 'short' }),
        Study: Math.round(studyPercent),
        Workout: Math.round(workoutPercent),
        Habits: Math.round(habitsPercent),
        "Water Intake": waterIntake,
      });
    }
    return data;
  }, [logs]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h2 className="text-2xl font-bold">Weekly Overview</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">{ICONS.close}</button>
        </div>
        <div className="p-6 overflow-y-auto">
          <h3 className="text-lg font-semibold mb-4">Completion Percentage (%)</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(128, 128, 128, 0.2)" />
                <XAxis dataKey="name" tick={{ fill: 'currentColor' }} />
                <YAxis tick={{ fill: 'currentColor' }} />
                <Tooltip 
                    contentStyle={{ 
                        backgroundColor: 'rgba(31, 41, 55, 0.8)', 
                        borderColor: '#4B5563',
                        borderRadius: '0.5rem'
                    }} 
                    labelStyle={{ color: '#F9FAFB' }}
                />
                <Legend />
                <Bar dataKey="Study" fill="#3B82F6" />
                <Bar dataKey="Workout" fill="#22C55E" />
                <Bar dataKey="Habits" fill="#F59E0B" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <h3 className="text-lg font-semibold mt-8 mb-4">Water Intake (glasses)</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(128, 128, 128, 0.2)" />
                    <XAxis dataKey="name" tick={{ fill: 'currentColor' }} />
                    <YAxis tick={{ fill: 'currentColor' }} />
                    <Tooltip 
                        contentStyle={{ 
                            backgroundColor: 'rgba(31, 41, 55, 0.8)', 
                            borderColor: '#4B5563',
                            borderRadius: '0.5rem'
                        }} 
                        labelStyle={{ color: '#F9FAFB' }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="Water Intake" stroke="#38BDF8" strokeWidth={2} />
                </LineChart>
            </ResponsiveContainer>
          </div>

        </div>
      </div>
    </div>
  );
};

export default WeeklyView;
