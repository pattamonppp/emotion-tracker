import { Dimensions } from 'react-native';

const { width: SCREEN_W } = Dimensions.get('window');

export const SOMATIC_CONFIG = {
  CIRCLE_SIZE: Math.min(SCREEN_W * 0.72, 268),
  REQUIRED_SWIRLS: 38,
  RUB_DISTANCE_STEP: 18,
  HAPTIC_THROTTLE_MS: 160,
  BASE_TEMP: 32.4,
  TARGET_TEMP: 36.8,
  TEMP_THRESHOLD: 35.0,
} as const;

export const VICTORY_SIP_CONFIG = {
  TOTAL_SIPS: 3,
  TILT_DRINK_THRESHOLD: 48,
  TILT_REST_THRESHOLD: 25,
  SIP_HOLD_TIME_MS: 1400,
  ANIMATION_DURATION_MS: 380,
} as const;

export const KINETIC_SHAKER_CONFIG = {
  REQUIRED_SHAKES: 15,
  REQUIRED_JUMPS: 10,
  SHAKE_THRESHOLD: 1.85,
  JUMP_THRESHOLD: 2.1,
  COOL_DOWN_MS: 220,
} as const;

export const BREATHING_CONFIG = {
  TOTAL_CYCLES: 4,
  BOX_PATTERN: {
    inhale: 4,
    hold: 4,
    exhale: 4,
    holdEmpty: 4,
  },
  PATTERN_478: {
    inhale: 4,
    hold: 7,
    exhale: 8,
    holdEmpty: 0,
  },
} as const;

export const AUDIO_SANCTUARY_CONFIG = {
  ALPHA_FREQUENCY_HZ: 10,
  BINAURAL_BASE_HZ: 216,
  TARGET_DURATION_SEC: 65,
} as const;

export { SKY_PERIOD } from '../../types';
