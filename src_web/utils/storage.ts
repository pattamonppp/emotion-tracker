export const STORAGE_KEYS = {
  PROFILE: 'mindfull_profile',
  HISTORY: 'mindfull_history',
  LEGACY_PROFILE: 'kinetic_vibe_profile',
  LEGACY_HISTORY: 'kinetic_vibe_history',
  LANGUAGE: 'mooca_language_pref',
  FEEDBACK: 'mooca_feedback_dataset',
} as const;

export const getStorageJSON = <T>(key: string, fallback: T): T => {
  try {
    let item = localStorage.getItem(key);
    if (!item && key === STORAGE_KEYS.PROFILE) {
      item = localStorage.getItem(STORAGE_KEYS.LEGACY_PROFILE);
    } else if (!item && key === STORAGE_KEYS.HISTORY) {
      item = localStorage.getItem(STORAGE_KEYS.LEGACY_HISTORY);
    }
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
};

export const setStorageJSON = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Quota or access error
  }
};

export const getStorageString = (key: string, fallback: string = ''): string => {
  try {
    return localStorage.getItem(key) || fallback;
  } catch {
    return fallback;
  }
};

export const setStorageString = (key: string, value: string): void => {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Quota or access error
  }
};
