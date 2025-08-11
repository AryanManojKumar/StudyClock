// Time formatting utilities
export const formatTime = (ms) => {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  return [hours, minutes, seconds]
    .map(unit => unit.toString().padStart(2, '0'))
    .join(':');
};

export const formatDuration = (ms) => {
  const totalMinutes = Math.floor(ms / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

export const formatDateTime = (date, options = {}) => {
  return new Date(date).toLocaleString('en-US', {
    hour12: false,
    ...options
  });
};

export const isProductiveHour = (hour = new Date().getHours()) => {
  return hour >= 8 && hour <= 22; // 8 AM to 10 PM
};