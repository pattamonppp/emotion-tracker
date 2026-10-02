import { useState, useCallback } from 'react';
import { UserProfile } from '../types';

const PROFILE_KEY = 'mooca_user_profile';

const DEFAULT_PROFILE: UserProfile = {
  name: 'Pattamon',
  ageBracket: 'working',
  goal: 'exam',
  mbti: 'INFJ',
  enableSensors: true,
  enableHaptics: true,
  onboardingCompleted: true,
};

export const useUserProfile = () => {
  const [profile, setProfileState] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(PROFILE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return DEFAULT_PROFILE;
  });

  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    setProfileState((prev) => {
      const next = { ...prev, ...updates };
      try {
        localStorage.setItem(PROFILE_KEY, JSON.stringify(next));
      } catch {
        // quota
      }
      return next;
    });
  }, []);

  return {
    profile,
    updateProfile,
  };
};

export default useUserProfile;
