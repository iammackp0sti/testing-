
import React from 'react';

interface TaskCardProps {
  title: string;
  color: 'study' | 'workout' | 'habits' | 'lifestyle';
  icon: React.ReactNode;
  children: React.ReactNode;
}

const colorClasses = {
  study: 'border-t-blue-500',
  workout: 'border-t-green-500',
  habits: 'border-t-yellow-500',
  lifestyle: 'border-t-purple-500',
};

const textClasses = {
    study: 'text-blue-500 dark:text-blue-400',
    workout: 'text-green-500 dark:text-green-400',
    habits: 'text-yellow-500 dark:text-yellow-400',
    lifestyle: 'text-purple-500 dark:text-purple-400',
}

const TaskCard: React.FC<TaskCardProps> = ({ title, color, icon, children }) => {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md border-t-4 ${colorClasses[color]}`}>
      <div className="p-4">
        <div className="flex items-center mb-3">
          <span className={`mr-3 ${textClasses[color]}`}>{icon}</span>
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">{title}</h3>
        </div>
        <div className="space-y-2">
          {children}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;