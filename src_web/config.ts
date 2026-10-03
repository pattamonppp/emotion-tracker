import { INTERVENTION, PHASE } from "./types";

// Set to false before releasing. This is the only switch for developer-only behavior.
export const DEV_MODE = false;

type DevPhase = typeof PHASE[keyof typeof PHASE];
type DevActivity = typeof INTERVENTION[keyof typeof INTERVENTION];

// Used only when DEV_MODE is true. Change these values to open a specific flow directly.
export const DEV_START: { phase: DevPhase; activity: DevActivity } = {
  phase: PHASE.PHASE1_JAR,
  activity: INTERVENTION.A,
} as const;
