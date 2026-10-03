export const PHASE1_CONFIG = {
    maxSelectedEmotions: 3,
    maxCustomMessages: 3,
    customTextMaxLength: 35,
    jarSquishTiming: {
        pressDuration: 90,
        friction: 4,
        tension: 180,
    },
    speechCycle: {
        displayDurationMs: 4800,
        fadeOutDurationMs: 380,
        intervalMs: 900,
    },
} as const;