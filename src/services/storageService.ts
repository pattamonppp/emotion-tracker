import { safeStorage as AsyncStorage } from './safeStorage';
import { UserProfile, ShiftFeedback } from '../types';

const PROFILE_KEY = '@kinetic_vibe_profile';
const HISTORY_KEY = '@kinetic_vibe_history';

export const storageService = {
  async getProfile(defaultProfile: UserProfile): Promise<UserProfile> {
    try {
      const data = await AsyncStorage.getItem(PROFILE_KEY);
      return data ? JSON.parse(data) : defaultProfile;
    } catch {
      return defaultProfile;
    }
  },

  async saveProfile(profile: UserProfile): Promise<void> {
    try {
      await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    } catch {
      // Ignore
    }
  },

  async getHistory(): Promise<ShiftFeedback[]> {
    try {
      const data = await AsyncStorage.getItem(HISTORY_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  async saveHistory(history: ShiftFeedback[]): Promise<void> {
    try {
      await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    } catch {
      // Ignore
    }
  },
};
