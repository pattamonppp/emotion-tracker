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

import type { SkyTimePeriod, SkyMode } from '../types';
export type { SkyTimePeriod, SkyMode };

export const SKY_THEMES = {
  dawn: {
    id: 'dawn' as const,
    nameTh: 'ยามรุ่งอรุณ',
    nameEn: 'Dawn',
    timeRange: '05:00 - 09:00',
    gradients: ['#FFEBE5', '#FED7AA', '#FDE68A', '#E0F2FE', '#F0FDFA'] as const,
    cssGradient: 'linear-gradient(180deg, #FFEBE5 0%, #FED7AA 25%, #FDE68A 50%, #E0F2FE 75%, #F0FDFA 100%)',
    ambientCore: '#FED7AA',
    ambientMid: '#FDE68A',
    ambientOuter: '#FFEBE5',
    dreamOrb1: 'rgba(254, 215, 170, 0.35)',
    dreamOrb2: 'rgba(253, 230, 138, 0.32)',
    cardBg: 'rgba(255, 255, 255, 0.92)',
    cardBorder: '#FDE68A',
    badgeBg: '#FFFBEB',
    badgeBorder: '#FDE68A',
    badgeText: '#B45309',
    textColor: '#78350F',
    accentColor: '#B45309',
    pulseColor: '#92400E',
    heartColor: '#B45309',
    cloud: {
      fill: '#FFF7ED',
      shadow: '#FED7AA',
      opacity: 0.85,
    },
  },
  day: {
    id: 'day' as const,
    nameTh: 'กลางวัน',
    nameEn: 'Day',
    timeRange: '09:00 - 17:00',
    gradients: ['#BAE6FD', '#CFFAFE', '#E0F2FE', '#F0FDFA', '#FFFBEB'] as const,
    cssGradient: 'linear-gradient(180deg, #BAE6FD 0%, #CFFAFE 25%, #E0F2FE 50%, #F0FDFA 75%, #FFFBEB 100%)',
    ambientCore: '#BAE6FD',
    ambientMid: '#E0F2FE',
    ambientOuter: '#CFFAFE',
    dreamOrb1: 'rgba(186, 230, 253, 0.38)',
    dreamOrb2: 'rgba(204, 251, 241, 0.38)',
    cardBg: 'rgba(255, 255, 255, 0.95)',
    cardBorder: '#99F6E4',
    badgeBg: '#E6F9F7',
    badgeBorder: 'rgba(0, 196, 179, 0.25)',
    badgeText: '#004D40',
    textColor: '#004D40',
    accentColor: '#00C4B3',
    pulseColor: '#64748B',
    heartColor: '#00C4B3',
    cloud: {
      fill: '#FFFFFF',
      shadow: '#E0F2FE',
      opacity: 0.92,
    },
  },
  sunset: {
    id: 'sunset' as const,
    nameTh: 'ยามเย็น',
    nameEn: 'Sunset',
    timeRange: '17:00 - 19:00',
    gradients: ['#BAE6FD', '#FEF08A', '#FDE68A', '#FBCFE8', '#F472B6', '#FB7185', '#FDA4AF'] as const,
    cssGradient: 'linear-gradient(180deg, #BAE6FD 0%, #FEF08A 20%, #FBCFE8 45%, #F472B6 70%, #FB7185 100%)',
    ambientCore: '#F472B6',
    ambientMid: '#FB7185',
    ambientOuter: '#FDA4AF',
    dreamOrb1: 'rgba(244, 114, 182, 0.28)',
    dreamOrb2: 'rgba(232, 121, 249, 0.25)',
    cardBg: 'rgba(255, 255, 255, 0.90)',
    cardBorder: '#FECDD3',
    badgeBg: '#FFF1F2',
    badgeBorder: '#FECDD3',
    badgeText: '#BE123C',
    textColor: '#881337',
    accentColor: '#E11D48',
    pulseColor: '#FFFFFF',
    heartColor: '#FFFFFF',
    cloud: {
      fill: '#FFF1F2',
      shadow: '#F472B6',
      opacity: 0.82,
    },
  },
  night: {
    id: 'night' as const,
    nameTh: 'กลางคืน',
    nameEn: 'Night',
    timeRange: '19:00 - 05:00',
    gradients: ['#090D16', '#1E1B4B', '#1E293B', '#0F172A'] as const,
    cssGradient: 'linear-gradient(180deg, #090D16 0%, #1E1B4B 35%, #1E293B 70%, #0F172A 100%)',
    ambientCore: '#1E1B4B',
    ambientMid: '#1E293B',
    ambientOuter: '#0F172A',
    dreamOrb1: 'rgba(99, 102, 241, 0.22)',
    dreamOrb2: 'rgba(56, 189, 248, 0.18)',
    cardBg: 'rgba(30, 41, 59, 0.92)',
    cardBorder: 'rgba(56, 189, 248, 0.4)',
    badgeBg: 'rgba(15, 23, 42, 0.85)',
    badgeBorder: 'rgba(56, 189, 248, 0.4)',
    badgeText: '#7DD3FC',
    textColor: '#F8FAFC',
    accentColor: '#38BDF8',
    pulseColor: '#CBD5E1',
    heartColor: '#F87171',
    cloud: {
      fill: '#1E293B',
      shadow: '#0F172A',
      opacity: 0.42,
    },
  },
} as const;

export const getPeriodFromHour = (hour: number): SkyTimePeriod => {
  if (hour >= 5 && hour < 9) return 'dawn';
  if (hour >= 9 && hour < 17) return 'day';
  if (hour >= 17 && hour < 19) return 'sunset';
  return 'night';
};

export const getSkyTheme = (period: SkyTimePeriod) => {
  return SKY_THEMES[period] || SKY_THEMES.day;
};
