export const SIP_CONFIG = {
  TOTAL_SIPS: 3,
  CANVAS_WIDTH: 200,
  CANVAS_HEIGHT: 260,
  TILT_MAX_DEG: 45,
  INACTIVITY_TIMEOUT_MS: 2200,
  COMPLETION_DELAY_MS: 2500,
} as const;

export type BreathPhase = 'ready' | 'inhale' | 'swallow' | 'exhale';
