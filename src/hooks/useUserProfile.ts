import { useState, useEffect, useCallback } from 'react';
import { UserProfile, LANG, GOAL, MBTI } from '../types';
import { storageService } from '../services/storageService';

export const DEFAULT_PROFILE: UserProfile = {
  name: 'Alex',
  ageBracket: '19-24 (มหาวิทยาลัย)',
  goal: GOAL.EXAM,
  mbti: MBTI.INTJ,
  language: LANG.TH,
  permissions: {
    motion: true,
    haptics: true,
    heartRate: true,
  },
};

export const useUserProfile = (initialProfile: UserProfile = DEFAULT_PROFILE) => {
  const [profile, setProfileState] = useState<UserProfile>(initialProfile);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    storageService.getProfile(initialProfile).then((saved) => {
      setProfileState(saved);
      setIsLoaded(true);
    });
  }, [initialProfile]);

  const setProfile = useCallback((newProfile: UserProfile) => {
    setProfileState(newProfile);
    storageService.saveProfile(newProfile);
  }, []);

  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    setProfileState((prev) => {
      const next = { ...prev, ...updates };
      storageService.saveProfile(next);
      return next;
    });
  }, []);

  return {
    profile,
    setProfile,
    updateProfile,
    isLoaded,
  };
};

export default useUserProfile;
