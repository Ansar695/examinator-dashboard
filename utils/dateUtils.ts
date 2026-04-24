export const formatTimestamp = (date: Date | string) => {
  const inputDate = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diff = now.getTime() - inputDate.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  return inputDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};
