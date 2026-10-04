import { MBTIType, GoalType, MBTI, GOAL } from '../types';

export const PHASE1_CONFIG = {
  maxSelectedEmotions: 3,
  maxCustomMessages: 3,
  customTextMaxLength: 35,
  jarSquishTiming: {
    pressDuration: 90,
    friction: 4,
    tension: 180,
  },
  speechCycle: {
    displayDurationMs: 4800,
    fadeOutDurationMs: 380,
    intervalMs: 900,
  },
} as const;

export const PHASE3_CONFIG = {
  springAnimation: {
    friction: 4,
    tension: 180,
  },
  stampScaleRange: [2.2, 1] as [number, number],
  stampRotation: '-8deg',
  mascotHeight: 145,
} as const;

export const PHASE4_CONFIG = {
  minHeartRate: 50,
  maxHeartRate: 160,
  defaultBpmDrop: 18,
  minPostHeartRateFloor: 65,
  mascotHeight: 145,
} as const;

export const MODAL_CONFIG = {
  pulseSensor: {
    scanIntervalMs: 250,
    scanProgressStep: 10,
    defaultHrvMs: 48,
    simulatedBpmBase: 95,
    simulatedBpmRange: 18,
    simulatedHrvBase: 42,
    simulatedHrvRange: 15,
  },
  customEmotion: {
    maxLength: 35,
    maxAllowedCustomInSky: 3,
  },
  mbtiOptions: Object.values(MBTI),
  goalTypes: Object.values(GOAL),
} as const;
