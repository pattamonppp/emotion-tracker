export const GOAL = {
  EXAM: 'exam',
  WORK: 'work',
  STAGE: 'stage',
  BURNOUT: 'burnout',
} as const;

export type GoalType = typeof GOAL[keyof typeof GOAL];

export const MBTI = {
  INTJ: 'INTJ', INTP: 'INTP', ENTJ: 'ENTJ', ENTP: 'ENTP',
  INFJ: 'INFJ', INFP: 'INFP', ENFJ: 'ENFJ', ENFP: 'ENFP',
  ISTJ: 'ISTJ', ISFJ: 'ISFJ', ESTJ: 'ESTJ', ESFJ: 'ESFJ',
  ISTP: 'ISTP', ISFP: 'ISFP', ESTP: 'ESTP', ESFP: 'ESFP',
} as const;
export type MBTIType = typeof MBTI[keyof typeof MBTI];

export const LANG = {
  TH: 'th',
  EN: 'en',
} as const;
export type Language = typeof LANG[keyof typeof LANG];

export const EMOTION_TAG_ID = {
  SHAKING: 'shaking',
  FORGETTING: 'forgetting',
  PRESSURE: 'pressure',
  FREEZE: 'freeze',
  BURNOUT: 'burnout',
  ANXIOUS: 'anxious',
  OVERTHINKING: 'overthinking',
  LONELY: 'lonely',
  CONFUSED: 'confused',
  CUSTOM: 'custom',
} as const;

export type EmotionTagId =
  | typeof EMOTION_TAG_ID[keyof typeof EMOTION_TAG_ID]
  | (string & {});

export const INTERVENTION = {
  A: 'A',
  B: 'B',
  C: 'C',
  D: 'D',
  E: 'E',
  F: 'F',
  G: 'G',
} as const;

export type InterventionOption = typeof INTERVENTION[keyof typeof INTERVENTION];

export const ACTIVITY_TYPE = {
  SHAKE: 'shake',
  JUMP: 'jump',
  BOUNCE: 'bounce',
} as const;

export type ActivityType = typeof ACTIVITY_TYPE[keyof typeof ACTIVITY_TYPE];

export interface EmotionTag {
  id: EmotionTagId;
  labelTh: string;
  labelEn: string;
  emoji?: string;
  color: string;
  weightDescription: string;
  recommendedOption: InterventionOption;
}

export interface InterventionOptionMeta {
  option: InterventionOption;
  nameTh: string;
  nameEn: string;
  keywordsTh: readonly string[];
  keywordsEn: readonly string[];
  descriptionTh?: string;
  descriptionEn?: string;
}

export interface UserProfile {
  name: string;
  ageBracket: string;
  goal: GoalType;
  mbti: MBTIType;
  language: Language;
  permissions: {
    motion: boolean;
    haptics: boolean;
    heartRate: boolean;
  };
}

export const PHASE = {
  ONBOARDING: 'onboarding',
  PHASE1_JAR: 'phase1_jar',          // 0:00 - 0:15
  PHASE2_INTERVENTION: 'phase2_intervention', // 0:15 - 1:20
  PHASE3_REFRAMING: 'phase3_reframing',    // 1:20 - 1:45
  PHASE4_FEEDBACK: 'phase4_feedback',     // 1:45 - 2:00
  COMPLETED: 'completed',
} as const;

export type ResetPhase = typeof PHASE[keyof typeof PHASE];

export const SHIFT_RESULT = {
  EMPOWERED: 'empowered',
  GROUNDED: 'grounded',
  SAME: 'same',
} as const;

export type ShiftResultType = typeof SHIFT_RESULT[keyof typeof SHIFT_RESULT];

export interface ShiftFeedback {
  shiftResult: ShiftResultType;
  preHeartRate: number;
  postHeartRate: number;
  timestamp: string;
}

export const FEEDBACK_ACCURACY = {
  SPOT_ON: 'spot_on',
  HELPFUL: 'helpful',
  NEEDS_WORK: 'needs_work',
} as const;

export type FeedbackAccuracy = typeof FEEDBACK_ACCURACY[keyof typeof FEEDBACK_ACCURACY];

export const FEEDBACK_ACCURACY_THEME = {
  SPOT_ON: 'spotOn',
  HELPFUL: 'helpful',
  NEEDS_WORK: 'needsWork',
} as const;

export type FeedbackAccuracyTheme = typeof FEEDBACK_ACCURACY_THEME[keyof typeof FEEDBACK_ACCURACY_THEME];

export interface Feedback {
  id: string;
  timestamp: string;
  rating: number; // 1 to 5
  accuracy: FeedbackAccuracy;
  aspects: string[];
  comment?: string;
  context: {
    mbti: MBTIType;
    goal: GoalType;
    shiftResult: ShiftResultType;
    deltaBpm: number;
    intervention?: string;
  };
}

export const MOOD_STAMP = {
  EMPOWERED: 'empowered',
  GROUNDED: 'grounded',
  HUG: 'hug',
} as const;
export type MoodStampType = typeof MOOD_STAMP[keyof typeof MOOD_STAMP];

export interface CustomMessageItem {
  id: string;
  text: string;
}

export const SPEECH_ICON = {
  SPARKLES: 'sparkles',
  WIND: 'wind',
  HEART: 'heart',
  SHIELD: 'shield',
  SMILE: 'smile',
  CLOUD: 'cloud',
} as const;
export type SpeechIconType = typeof SPEECH_ICON[keyof typeof SPEECH_ICON];

export interface SpeechMessage {
  text: string;
  iconType: SpeechIconType;
}

export const SKY = {
  DAWN: 'dawn',
  DAY: 'day',
  SUNSET: 'sunset',
  NIGHT: 'night',
} as const;

export const AUTO_SKY = 'auto';

export const SKY_PERIOD = SKY; // backward compatibility
export type SkyTimePeriod = typeof SKY[keyof typeof SKY];
export type SkyMode = typeof AUTO_SKY | SkyTimePeriod;