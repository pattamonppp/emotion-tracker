export const AUDIO_SANCTUARY_CONFIG = {
  ALPHA_FREQUENCY_HZ: 10,
  BINAURAL_BASE_HZ: 216,
  TARGET_DURATION_SEC: 65,
  TOTAL_DURATION_SEC: 65,
  CANVAS_WIDTH: 240,
  CANVAS_HEIGHT: 90,
  SPECTRUM_BARS: 26,
  HAPTIC_INTERVAL_SEC: 3,
} as const;

export type SoundMode = 'alpha' | 'brown' | 'both';
export type BrainwaveMode = 'alpha' | 'theta' | 'delta' | 'gamma';
