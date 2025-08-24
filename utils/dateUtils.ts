
export const getFormattedDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const getDayOfWeek = (date: Date): string => {
  return date.toLocaleDateString('en-US', { weekday: 'long' });
};

export const getDisplayDate = (date: Date): string => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (getFormattedDate(date) === getFormattedDate(today)) return 'Today';
    if (getFormattedDate(date) === getFormattedDate(yesterday)) return 'Yesterday';
    if (getFormattedDate(date) === getFormattedDate(tomorrow)) return 'Tomorrow';

    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
};