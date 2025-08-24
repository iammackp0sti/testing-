import React from 'react';
import { getDisplayDate } from '../utils/dateUtils';
import { ICONS } from '../constants';

interface HeaderProps {
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  onWeeklyView: () => void;
  onNotionSync: () => void;
  onAchievements: () => void;
  onExport: () => void;
  onImport: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  currentDate, setCurrentDate, isDarkMode, toggleDarkMode, 
  onWeeklyView, onNotionSync, onAchievements, onExport, onImport 
}) => {
  const changeDate = (days: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + days);
    setCurrentDate(newDate);
  };

  return (
    <header className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 text-transparent bg-clip-text">
          Zenith
        </h1>
        <div className="flex items-center space-x-1">
          <button onClick={onAchievements} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700" aria-label="Achievements">{ICONS.trophy}</button>
          <button onClick={onWeeklyView} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700" aria-label="Weekly View">{ICONS.calendar}</button>
          <button onClick={onExport} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700" aria-label="Export Data">{ICONS.exportData}</button>
          <button onClick={onImport} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700" aria-label="Import Data">{ICONS.importData}</button>
          <button onClick={onNotionSync} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700" aria-label="Sync to Notion">{ICONS.notion}</button>
          <button onClick={toggleDarkMode} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700" aria-label="Toggle Dark Mode">
            {isDarkMode ? ICONS.sun : ICONS.moon}
          </button>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <button onClick={() => changeDate(-1)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700" aria-label="Previous Day">{ICONS.chevronLeft}</button>
        <h2 className="text-lg font-semibold text-center">{getDisplayDate(currentDate)}</h2>
        <button onClick={() => changeDate(1)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700" aria-label="Next Day">{ICONS.chevronRight}</button>
      </div>
    </header>
  );
};

export default Header;
