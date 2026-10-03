import { LANG, Language } from "@/types";

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
export const formatReadableDate = (date = new Date(), lang: Language = LANG.TH): string => {
  return date.toLocaleDateString(lang === LANG.TH ? 'th-TH' : 'en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};
