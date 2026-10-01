/**
 * mindfull / Ooca Design Tokens System
 * Source of truth for brand colors, geometry, elevation, and typography.
 * Featuring Mooca: Your best friend who will always be by your side!
 */

export const DESIGN_TOKENS = {
  color: {
    brand: {
      turquoise: {
        primary: '#00C4B3',
        light: '#33D0C2',  // Turquoise-2
        pale: '#E6F9F7',   // Turquoise-3
        text: '#004D40',   // Deep text contrast
      },
    },
    accent: {
      blue: {
        500: '#1F77DF', // Blue 500
        300: '#62A0E9', // Blue 300
        200: '#8FBBEF', // Blue 200
        100: '#C7DDF7', // Blue 100
        50: '#E4EFFB',  // Blue 50
      },
      orange: {
        marigo1: '#F9A000',
        marigo2: '#F8E4B3',
      },
    },
    feedback: {
      error: '#F26E6E',       // Flamingo
      errorLight: '#FAD6D5',
      warning: '#FA8C3D',     // Sunshade
      warningLight: '#FFDDC9',
      success: '#7CC954',     // Guava
      successLight: '#DCF3D1',
    },
    gray: {
      black: '#000000',
      darkText: '#1E293B',
      muted: '#64748B',
      border: '#E2E8F0',
      surface: '#F8FAFC',
      white: '#FFFFFF',
    },
  },
  geometry: {
    borderRadius: {
      controls: '50%',
      avatars: '12px',
      actionablesSm: '8px',
      actionablesLg: '24px',
      containers: '0px',
    },
  },
  elevation: {
    level1: '0 1px 2px 0 rgba(0, 196, 179, 0.08)',
    level2: '0 2px 4px -1px rgba(0, 196, 179, 0.08), 0 1px 2px -1px rgba(0, 196, 179, 0.08)',
    level3: '0 4px 6px -1px rgba(0, 196, 179, 0.08), 0 2px 4px -2px rgba(0, 196, 179, 0.08)',
    level4: '0 8px 10px -2px rgba(0, 196, 179, 0.12), 0 4px 6px -3px rgba(0, 196, 179, 0.08)',
    level5: '0 12px 16px -4px rgba(0, 196, 179, 0.12), 0 6px 8px -3px rgba(0, 196, 179, 0.08)',
    level6: '0 16px 24px -4px rgba(0, 196, 179, 0.12), 0 8px 10px -4px rgba(0, 196, 179, 0.08)',
    level7: '0 20px 28px -6px rgba(0, 196, 179, 0.16), 0 10px 14px -5px rgba(0, 196, 179, 0.12)',
    level8: '0 25px 50px -12px rgba(0, 196, 179, 0.16)',
  },
  mascot: {
    name: 'Mooca',
    story: 'Your best friend who will always be by your side',
    companion: 'Sunny',
  },
};
