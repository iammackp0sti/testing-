
import React from 'react';
import type { Task } from '../types';
import { ICONS } from '../constants';

interface TaskItemProps {
  task: Task;
  onToggle: () => void;
  onRemove?: () => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onRemove }) => {
  return (
    <div className="flex items-center justify-between group px-3 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={onToggle}
          className="w-5 h-5 rounded text-blue-500 focus:ring-blue-500 bg-gray-200 dark:bg-gray-600 border-gray-300 dark:border-gray-500"
        />
        <span className={`ml-3 text-sm ${task.completed ? 'line-through text-gray-500 dark:text-gray-400' : ''}`}>
          {task.text}
        </span>
      </div>
      {onRemove && (
         <button onClick={onRemove} className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity" aria-label="Remove task">
            {ICONS.trash}
         </button>
      )}
    </div>
  );
};

export default TaskItem;