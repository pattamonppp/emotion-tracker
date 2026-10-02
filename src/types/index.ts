export type GoalType = 'exam' | 'work' | 'stage' | 'burnout';

export type MBTIType = 
  | 'INTJ' | 'INTP' | 'ENTJ' | 'ENTP'
  | 'INFJ' | 'INFP' | 'ENFJ' | 'ENFP'
  | 'ISTJ' | 'ISFJ' | 'ESTJ' | 'ESFJ'
  | 'ISTP' | 'ISFP' | 'ESTP' | 'ESFP';

export type EmotionTagId = 
  | 'shaking' 
  | 'forgetting' 
  | 'pressure' 
  | 'freeze' 
  | 'burnout'
  | 'anxious'
  | 'overthinking'
  | 'lonely'
  | 'confused'
  | 'custom'
  | (string & {});

export interface EmotionTag {
  id: EmotionTagId;
  labelTh: string;
  labelEn: string;
  emoji: string;
  color: string;
  weightDescription: string;
  recommendedOption: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';
}

export type InterventionOption = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';

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
  language: 'th' | 'en';
  permissions: {
    motion: boolean;
    haptics: boolean;
    heartRate: boolean;
  };
}

export type ResetPhase = 
  | 'onboarding'
  | 'phase1_jar'         // 0:00 - 0:15
  | 'phase2_intervention'// 0:15 - 1:20
  | 'phase3_reframing'   // 1:20 - 1:45
  | 'phase4_feedback'    // 1:45 - 2:00
  | 'completed';

export interface ShiftFeedback {
  shiftResult: 'empowered' | 'grounded' | 'same';
  preHeartRate: number;
  postHeartRate: number;
  timestamp: string;
}

export type MoodStampType = 'empowered' | 'grounded' | 'hug';

export interface CustomMessageItem {
  id: string;
  text: string;
}

export interface SpeechMessage {
  text: string;
  iconType: 'sparkles' | 'wind' | 'heart' | 'shield' | 'smile' | 'cloud';
}

export type SkyTimePeriod = 'dawn' | 'day' | 'sunset' | 'night';
export type SkyMode = 'auto' | SkyTimePeriod;

export const SKY_PERIOD = {
  DAWN: 'dawn',
  DAY: 'day',
  SUNSET: 'sunset',
  NIGHT: 'night',
} as const;
