/**
 * Format total seconds into mm:ss
 */
export const formatSeconds = (totalSeconds: number): string => {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Format timestamp into HH:MM:SS
 */
export const getCurrentTimeString = (date = new Date()): string => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

/**
 * Format full date into Thai/English readable date string
 */
export const formatReadableDate = (date = new Date(), lang: 'th' | 'en' = 'th'): string => {
  return date.toLocaleDateString(lang === 'th' ? 'th-TH' : 'en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};
