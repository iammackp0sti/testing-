import React from 'react';
import { Achievement } from '../types';
import { ICONS } from '../constants';

interface AchievementsViewProps {
  unlockedAchievements: Achievement[];
  onClose: () => void;
}

const AchievementsView: React.FC<AchievementsViewProps> = ({ unlockedAchievements, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50 animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <div className="flex items-center gap-3">
             <span className="text-yellow-500">{ICONS.trophy}</span>
             <h2 className="text-2xl font-bold">Achievements</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">{ICONS.close}</button>
        </div>
        <div className="p-6 overflow-y-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {unlockedAchievements.map(ach => (
              <div 
                key={ach.id} 
                className={`flex flex-col items-center text-center p-4 rounded-lg border-2 transition-all duration-300 ${
                  ach.unlocked 
                    ? 'border-yellow-400 bg-yellow-50 dark:bg-yellow-900/50 shadow-md' 
                    : 'border-gray-200 dark:border-gray-700 opacity-60'
                }`}
              >
                <div className={`text-4xl mb-2 ${ach.unlocked ? 'text-yellow-500' : 'text-gray-400'}`}>
                  {ach.icon}
                </div>
                <h4 className="font-bold text-sm text-gray-800 dark:text-gray-100">{ach.name}</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{ach.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AchievementsView;
