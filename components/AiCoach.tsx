
import React, { useState, useEffect } from 'react';
import { getAiCoachSuggestion } from '../services/geminiService';
import { DailyLog } from '../types';
import { ICONS } from '../constants';

interface AiCoachProps {
  dailyLog: DailyLog;
  onClose: () => void;
}

const AiCoach: React.FC<AiCoachProps> = ({ dailyLog, onClose }) => {
  const [suggestion, setSuggestion] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSuggestion = async () => {
      setIsLoading(true);
      const result = await getAiCoachSuggestion(dailyLog);
      setSuggestion(result);
      setIsLoading(false);
    };

    fetchSuggestion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dailyLog]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <div className="flex items-center gap-3">
            <span className="text-purple-500">{ICONS.aiCoach}</span>
            <h2 className="text-xl font-bold">AI Coach</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700" aria-label="Close">{ICONS.close}</button>
        </div>
        <div className="p-6 min-h-[150px] flex items-center justify-center">
          {isLoading ? (
            <div className="flex flex-col items-center gap-2">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Your coach is thinking...</p>
            </div>
          ) : (
            <p className="text-center text-gray-700 dark:text-gray-300 leading-relaxed">
              {suggestion}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AiCoach;