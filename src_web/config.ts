// Set to false before releasing. This is the only switch for developer-only behavior.
export const DEV_MODE = true;

type DevPhase = 'onboarding' | 'phase1_jar' | 'phase2_intervention' | 'phase3_reframing' | 'phase4_feedback' | 'completed';
type DevActivity = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';

// Used only when DEV_MODE is true. Change these values to open a specific flow directly.
export const DEV_START: { phase: DevPhase; activity: DevActivity } = {
  phase: 'phase2_intervention', // onboarding | phase1_jar | phase2_intervention | phase3_reframing | phase4_feedback | completed
  activity: 'A', // A=Absorption, B=VictorySip, C=Shake, D=Jump, E=BoxBreath, F=Relax478, G=AudioMatrix
} as const;
