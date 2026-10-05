import React from 'react';
import {
  HeadphonesIcon,
  MessageHeartIcon,
  ActivityIcon,
  GlassWaterIcon,
  HeartIcon,
  TargetIcon,
  LightbulbIcon,
  RotateCcwIcon,
  SparklesIcon,
  SmileIcon,
  ScaleIcon,
  WindIcon,
  IconProps,
} from '../../../../icons';
import { FEEDBACK_ACCURACY, FEEDBACK_ACCURACY_THEME, FeedbackAccuracy, FeedbackAccuracyTheme } from '@/types';

export interface FeedbackAspect {
  id: string;
  labelTh: string;
  labelEn: string;
  Icon: React.FC<IconProps>;
  colorTheme: 'mint' | 'peach' | 'violet' | 'sky' | 'rose';
}

export const FEEDBACK_ASPECTS: FeedbackAspect[] = [
  { id: 'audio_binaural', labelTh: 'คลื่นเสียงบำบัดตรงจุด', labelEn: 'Binaural Audio', Icon: HeadphonesIcon, colorTheme: 'mint' },
  { id: 'cognitive_reframe', labelTh: 'คำพูดรีเฟรมความคิดโดนใจ', labelEn: 'Cognitive Reframing', Icon: MessageHeartIcon, colorTheme: 'peach' },
  { id: 'haptic_kinetics', labelTh: 'แรงสั่นและกิจกรรมสะบัดมือ', labelEn: 'Haptic & Movement', Icon: ActivityIcon, colorTheme: 'violet' },
  { id: 'sip_pacing', labelTh: 'จังหวะการจิบน้ำผ่อนคลาย', labelEn: 'Sip Breathing Rhythm', Icon: GlassWaterIcon, colorTheme: 'sky' },
  { id: 'mbti_matching', labelTh: 'เข้าใจลักษณะนิสัย', labelEn: 'Personality Resonance', Icon: HeartIcon, colorTheme: 'rose' },
];

export interface AccuracyOption {
  id: FeedbackAccuracy;
  labelTh: string;
  labelEn: string;
  Icon: React.FC<IconProps>;
  colorTheme: FeedbackAccuracyTheme;
  color: string;
}

export const ACCURACY_OPTIONS: AccuracyOption[] = [
  { id: FEEDBACK_ACCURACY.SPOT_ON, labelTh: 'ตรงใจมาก', labelEn: 'Spot On', Icon: TargetIcon, colorTheme: FEEDBACK_ACCURACY_THEME.SPOT_ON, color: '#009688' },
  { id: FEEDBACK_ACCURACY.HELPFUL, labelTh: 'ช่วยได้ดี', labelEn: 'Helpful', Icon: LightbulbIcon, colorTheme: FEEDBACK_ACCURACY_THEME.HELPFUL, color: '#DF8900' },
  { id: FEEDBACK_ACCURACY.NEEDS_WORK, labelTh: 'ยังไม่ค่อยตรงจุด', labelEn: 'Needs Work', Icon: RotateCcwIcon, colorTheme: FEEDBACK_ACCURACY_THEME.NEEDS_WORK, color: '#EF7773' },
];

export interface RatingContextInfo {
  rating: number;
  labelTh: string;
  labelEn: string;
  Icon: React.FC<IconProps>;
  themeClass: string;
}

export const RATING_LEVELS: Record<number, RatingContextInfo> = {
  5: {
    rating: 5,
    labelTh: 'โล่ง สบายใจขึ้นมาก',
    labelEn: 'Deeply relaxed and relieved',
    Icon: SparklesIcon,
    themeClass: 'rating5',
  },
  4: {
    rating: 4,
    labelTh: 'ผ่อนคลายขึ้นดีมาก',
    labelEn: 'Noticeably calmer and better',
    Icon: SmileIcon,
    themeClass: 'rating4',
  },
  3: {
    rating: 3,
    labelTh: 'รู้สึกดีขึ้นปานกลาง',
    labelEn: 'Moderately refreshed',
    Icon: ScaleIcon,
    themeClass: 'rating3',
  },
  2: {
    rating: 2,
    labelTh: 'คลายลงเพียงเล็กน้อย',
    labelEn: 'Slightly better',
    Icon: WindIcon,
    themeClass: 'rating2',
  },
  1: {
    rating: 1,
    labelTh: 'ยังตึงเครียดอยู่',
    labelEn: 'Still holding tension',
    Icon: RotateCcwIcon,
    themeClass: 'rating1',
  },
};
