export const KINETIC_MODE = {
  SHAKE: 'shake',
  BOUNCE: 'bounce',
} as const;

export type KineticMode = (typeof KINETIC_MODE)[keyof typeof KINETIC_MODE];

export const KINETIC_CYCLES = {
  [KINETIC_MODE.SHAKE]: 15,
  [KINETIC_MODE.BOUNCE]: 10,
} as const;

export const SENSOR_CONFIG = {
  ACCELEROMETER_THRESHOLD: 22,
  DEBOUNCE_DELAY_MS: 240,
  SHAKE_PULSE_DURATION_MS: 120,
  COMPLETION_TRANSITION_MS: 2800,
} as const;
