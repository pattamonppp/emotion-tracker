/**
 * mindfull / Ooca Design Tokens System
 * Source of truth for brand colors, geometry, elevation, and typography.
 * Featuring Mooca: Your best friend who will always be by your side!
 */

export const OOCA_TOKENS = {
  color: {
    brand: {
      turquoise: {
        primary: '#00C4B3',       // Turquoise 1 (main)
        light: '#B3EDE8',         // Turquoise 2
        pale: '#DBF0EE',          // Turquoise 3
        text: '#009688',          // Turquoise text
        contrast: '#009688',
        ringTrack: 'rgba(0, 196, 179, 0.16)',
        border: 'rgba(0, 196, 179, 0.25)',
      },
    },
    accent: {
      blue: {
        500: '#1F77DF', // Blue 1
        300: '#62A0E9', // Blue 2
        200: '#8FBBEF', // Blue 3
        100: '#C7DDF7', // Blue 4
        50: '#E4EFFB',  // Blue 5
        blue1: '#1F77DF',
        blue2: '#62A0E9',
        blue3: '#8FBBEF',
        blue4: '#C7DDF7',
        blue5: '#E4EFFB',
      },
      orange: {
        500: '#F9A000', // Marigo 1
        100: '#F8E4B3', // Marigo 2
        marigo1: '#F9A000',
        marigo2: '#F8E4B3',
      },
    },
    system: {
      error: {
        500: '#EF7773', // Flamingo 1
        100: '#FAD6D5', // Flamingo 2
        flamingo1: '#EF7773',
        flamingo2: '#FAD6D5',
      },
      warning: {
        500: '#FF8F4B', // Sunshade 1
        100: '#FFDDC9', // Sunshade 2
        sunshade1: '#FF8F4B',
        sunshade2: '#FFDDC9',
      },
      success: {
        500: '#8AD866', // Guava 1
        100: '#DCF3D1', // Guava 2
        guava1: '#8AD866',
        guava2: '#DCF3D1',
      },
    },
    feedback: {
      error: '#EF7773',
      errorLight: '#FAD6D5',
      warning: '#FF8F4B',
      warningLight: '#FFDDC9',
      success: '#8AD866',
      successLight: '#DCF3D1',
      emerald: '#8AD866',
    },
    gray: {
      black: '#000000',
      blackGray1: '#C4C4C4', // 400
      blackGray2: '#F1F1F1', // 200
      blackGray3: '#F6F6F6', // 100
      white: '#FFFFFF',
      darkText: '#26313c',
      muted: '#637b91',
      border: '#cdd8e1',
      surface: '#fbfbfb',
    },
    turquoiseGray: {
      1: '#355956',
      2: '#3F6866',
      3: '#528984',
      4: '#79ADA9',
      tg1: '#355956',
      tg2: '#3F6866',
      tg3: '#528984',
      tg4: '#79ADA9',
    },
    gradient: {
      background: '#DBF0EE',
      blackGradient: 'rgba(0, 0, 0, 0.9)',
      turquoiseGradient01: '#DBF0EE',
      turquoiseGradient02: ['#D7FFFC', '#E0FEFB'] as const,
    },
    palette: {
      turquoise: {
        50: '#E0F8F6',
        100: '#B3EDE8',
        200: '#80E2D9',
        300: '#4DD6CA',
        400: '#26CDBE',
        500: '#00C4B3',
        600: '#00BEAC',
        700: '#00B6A3',
        800: '#00AF9A',
        900: '#00A28B',
      },
      blue: {
        50: '#E4EFFB',
        100: '#C7DDF7',
        200: '#8FBBEF',
        300: '#62A0E9',
        400: '#418BE4',
        500: '#1F77DF',
        600: '#1B6FDB',
        700: '#1764D7',
        800: '#125AD2',
        900: '#0A47CA',
      },
      marigo: {
        50: '#FCF4E0',
        100: '#F8E4B3',
        200: '#F4D280',
        300: '#F0BF4D',
        400: '#ECB226',
        500: '#E9A400',
        600: '#E69C00',
        700: '#E39200',
        800: '#DF8900',
        900: '#D97800',
      },
      coolGray: {
        50: '#eaeff5',
        100: '#cdd8e1',
        200: '#b0bdca',
        300: '#91a3b4',
        400: '#7a8fa2',
        500: '#637b91',
        600: '#566d80',
        700: '#465969',
        800: '#374654',
        900: '#26313c',
      },
      neutralGray: {
        50: '#fbfbfb',
        100: '#f6f6f6',
        200: '#f1f1f1',
        300: '#e6e6e6',
        400: '#c4c4c4',
        500: '#a6a6a6',
        600: '#7c7c7c',
        700: '#686868',
        800: '#484848',
        900: '#272727',
      },
      flamingo: {
        50: '#FDEFEE',
        100: '#FAD6D5',
        200: '#F7BBB9',
        300: '#F4A09D',
        400: '#F18B88',
        500: '#EF7773',
        600: '#ED6F6B',
        700: '#EB6460',
        800: '#E85A56',
        900: '#E44743',
      },
      sunshade: {
        50: '#FFF2E9',
        100: '#FFDDC9',
        200: '#FFC7A5',
        300: '#FFB181',
        400: '#ffa066',
        500: '#FF8F4B',
        600: '#FF8744',
        700: '#FF7C3B',
        800: '#FF7233',
        900: '#FF6023',
      },
      guava: {
        50: '#F1FAED',
        100: '#DCF3D1',
        200: '#C5ECB3',
        300: '#ADE494',
        400: '#9CDE7D',
        500: '#8AD866',
        600: '#82D45E',
        700: '#77CE53',
        800: '#6DC849',
        900: '#5ABF38',
      },
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
} as const;

export const DESIGN_TOKENS = OOCA_TOKENS;

import type { SkyTimePeriod, SkyMode } from '../types';
export type { SkyTimePeriod, SkyMode };

export const SKY_THEMES = {
  dawn: {
    id: 'dawn' as const,
    nameTh: 'ยามรุ่งอรุณ',
    nameEn: 'Dawn',
    timeRange: '05:00 - 09:00',
    gradients: ['#FFF2E9', '#F8E4B3', '#F0BF4D', '#E4EFFB', '#E0F8F6'] as const,
    cssGradient: 'linear-gradient(180deg, #FFF2E9 0%, #F8E4B3 25%, #F0BF4D 50%, #E4EFFB 75%, #E0F8F6 100%)',
    ambientCore: '#F8E4B3',
    ambientMid: '#F0BF4D',
    ambientOuter: '#FFF2E9',
    dreamOrb1: 'rgba(248, 228, 179, 0.35)',
    dreamOrb2: 'rgba(240, 191, 77, 0.32)',
    cardBg: 'rgba(255, 255, 255, 0.95)',
    cardBorder: '#F0BF4D',
    badgeBg: '#FCF4E0',
    badgeBorder: '#F8E4B3',
    badgeText: '#D97800',
    textColor: '#D97800',
    accentColor: '#F9A000',
    pulseColor: '#DF8900',
    heartColor: '#F9A000',
    cloud: {
      fill: '#FCF4E0',
      shadow: '#F8E4B3',
      opacity: 0.85,
    },
  },
  day: {
    id: 'day' as const,
    nameTh: 'กลางวัน',
    nameEn: 'Day',
    timeRange: '09:00 - 17:00',
    gradients: ['#C7DDF7', '#B3EDE8', '#E4EFFB', '#DBF0EE', '#FFFFFF'] as const,
    cssGradient: 'linear-gradient(180deg, #C7DDF7 0%, #B3EDE8 25%, #E4EFFB 50%, #DBF0EE 75%, #FFFFFF 100%)',
    ambientCore: '#C7DDF7',
    ambientMid: '#E4EFFB',
    ambientOuter: '#B3EDE8',
    dreamOrb1: 'rgba(199, 221, 247, 0.38)',
    dreamOrb2: 'rgba(179, 237, 232, 0.38)',
    cardBg: 'rgba(255, 255, 255, 0.95)',
    cardBorder: '#B3EDE8',
    badgeBg: '#DBF0EE',
    badgeBorder: 'rgba(0, 196, 179, 0.25)',
    badgeText: '#009688',
    textColor: '#009688',
    accentColor: '#00C4B3',
    pulseColor: '#637b91',
    heartColor: '#00C4B3',
    cloud: {
      fill: '#FFFFFF',
      shadow: '#DBF0EE',
      opacity: 0.92,
    },
  },
  sunset: {
    id: 'sunset' as const,
    nameTh: 'ยามเย็น',
    nameEn: 'Sunset',
    timeRange: '17:00 - 19:00',
    gradients: ['#C7DDF7', '#F8E4B3', '#FAD6D5', '#F18B88', '#EF7773', '#FF8F4B'] as const,
    cssGradient: 'linear-gradient(180deg, #C7DDF7 0%, #F8E4B3 20%, #FAD6D5 45%, #F18B88 70%, #EF7773 100%)',
    ambientCore: '#F18B88',
    ambientMid: '#EF7773',
    ambientOuter: '#FAD6D5',
    dreamOrb1: 'rgba(241, 139, 136, 0.28)',
    dreamOrb2: 'rgba(239, 119, 115, 0.25)',
    cardBg: 'rgba(255, 255, 255, 0.90)',
    cardBorder: '#FAD6D5',
    badgeBg: '#FDEFEE',
    badgeBorder: '#FAD6D5',
    badgeText: '#E44743',
    textColor: '#E44743',
    accentColor: '#EF7773',
    pulseColor: '#FFFFFF',
    heartColor: '#FFFFFF',
    cloud: {
      fill: '#FDEFEE',
      shadow: '#F18B88',
      opacity: 0.82,
    },
  },
  night: {
    id: 'night' as const,
    nameTh: 'กลางคืน',
    nameEn: 'Night',
    timeRange: '19:00 - 05:00',
    gradients: ['#000000', '#26313c', '#272727', '#355956'] as const,
    cssGradient: 'linear-gradient(180deg, #000000 0%, #26313c 35%, #272727 70%, #355956 100%)',
    ambientCore: '#26313c',
    ambientMid: '#272727',
    ambientOuter: '#355956',
    dreamOrb1: 'rgba(31, 119, 223, 0.22)',
    dreamOrb2: 'rgba(98, 160, 233, 0.18)',
    cardBg: 'rgba(38, 49, 60, 0.92)',
    cardBorder: 'rgba(143, 187, 239, 0.4)',
    badgeBg: 'rgba(0, 0, 0, 0.85)',
    badgeBorder: 'rgba(143, 187, 239, 0.4)',
    badgeText: '#8FBBEF',
    textColor: '#F6F6F6',
    accentColor: '#62A0E9',
    pulseColor: '#cdd8e1',
    heartColor: '#EF7773',
    cloud: {
      fill: '#26313c',
      shadow: '#000000',
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
