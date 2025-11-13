export const getNotificationColors = (color: string, isRead: boolean) => {
  const opacity = isRead ? '5' : '10';
  const colorMap: Record<string, any> = {
    emerald: {
      bg: `bg-emerald-${opacity}0 dark:bg-emerald-950/30`,
      border: 'border-emerald-200 dark:border-emerald-800',
      text: 'text-emerald-700 dark:text-emerald-300',
      icon: 'text-emerald-600 dark:text-emerald-400',
      iconBg: 'bg-emerald-100 dark:bg-emerald-900/50'
    },
    blue: {
      bg: `bg-blue-${opacity}0 dark:bg-blue-950/30`,
      border: 'border-blue-200 dark:border-blue-800',
      text: 'text-blue-700 dark:text-blue-300',
      icon: 'text-blue-600 dark:text-blue-400',
      iconBg: 'bg-blue-100 dark:bg-blue-900/50'
    },
    amber: {
      bg: `bg-amber-${opacity}0 dark:bg-amber-950/30`,
      border: 'border-amber-200 dark:border-amber-800',
      text: 'text-amber-700 dark:text-amber-300',
      icon: 'text-amber-600 dark:text-amber-400',
      iconBg: 'bg-amber-100 dark:bg-amber-900/50'
    },
    purple: {
      bg: `bg-purple-${opacity}0 dark:bg-purple-950/30`,
      border: 'border-purple-200 dark:border-purple-800',
      text: 'text-purple-700 dark:text-purple-300',
      icon: 'text-purple-600 dark:text-purple-400',
      iconBg: 'bg-purple-100 dark:bg-purple-900/50'
    },
    yellow: {
      bg: `bg-yellow-${opacity}0 dark:bg-yellow-950/30`,
      border: 'border-yellow-200 dark:border-yellow-800',
      text: 'text-yellow-700 dark:text-yellow-300',
      icon: 'text-yellow-600 dark:text-yellow-400',
      iconBg: 'bg-yellow-100 dark:bg-yellow-900/50'
    },
  };
  return colorMap[color] || colorMap.blue;
};