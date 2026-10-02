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
  IconProps,
} from '../../../../icons';

export interface FeedbackAspect {
  id: string;
  labelTh: string;
  labelEn: string;
  Icon: React.FC<IconProps>;
}

export const FEEDBACK_ASPECTS: FeedbackAspect[] = [
  { id: 'audio_binaural', labelTh: 'คลื่นเสียงบำบัดตรงจุด', labelEn: 'Binaural Audio', Icon: HeadphonesIcon },
  { id: 'cognitive_reframe', labelTh: 'คำพูดรีเฟรมความคิดโดนใจ', labelEn: 'Cognitive Reframing', Icon: MessageHeartIcon },
  { id: 'haptic_kinetics', labelTh: 'แรงสั่นและกิจกรรมสลัดมือ', labelEn: 'Haptic & Movement', Icon: ActivityIcon },
  { id: 'sip_pacing', labelTh: 'จังหวะการจิบน้ำผ่อนคลาย', labelEn: 'Sip Breathing Rhythm', Icon: GlassWaterIcon },
  { id: 'mbti_matching', labelTh: 'เข้าใจลักษณะนิสัย', labelEn: 'Personality Resonance', Icon: HeartIcon },
];

export interface AccuracyOption {
  id: 'spot_on' | 'helpful' | 'needs_work';
  labelTh: string;
  labelEn: string;
  Icon: React.FC<IconProps>;
}

export const ACCURACY_OPTIONS: AccuracyOption[] = [
  { id: 'spot_on', labelTh: 'ตรงใจมาก', labelEn: 'Spot On', Icon: TargetIcon },
  { id: 'helpful', labelTh: 'ช่วยได้ดี', labelEn: 'Helpful', Icon: LightbulbIcon },
  { id: 'needs_work', labelTh: 'ยังไม่ค่อยตรงจุด', labelEn: 'Needs Work', Icon: RotateCcwIcon },
];
