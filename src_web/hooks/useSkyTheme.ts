import { useMemo } from 'react';
import { SKY, useSky } from '../components/DynamicSkyEngine';
import { DESIGN_TOKENS } from '../design-system/tokens';
import type { SkyTimePeriod } from '../types';

export interface SkyThemeTokens {
  period: SkyTimePeriod;

  // Somatic Breathing & Orb
  ringTrack: string;
  ringProgress: string;
  orbBorder: string;
  secondsColor: string;
  phaseLabelColor: string;
  cycleCounterColor: string;
  instructionColor: string;
  pulseColor: string;
  heartColor: string;

  // Kinetic Shaker & Victory Sip counters & progress
  countColor: string;
  labelColor: string;
  hintColor: string;
  progressTrack: string;
  progressFill: readonly [string, string];
  progressFillColor: string;
  progressFillBar: string;
  fluidColors: readonly [string, string, ...string[]];

  // Badges & Actions
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  badgeTextColor: string;
  badgeIconColor: string;

  // Audio Matrix Sanctuary
  cardBg: string;
  cardBorder: string;
  scriptTitle: string;
  scriptText: string;
  waveColor: string;
  hintText: string;

  // Somatic Absorption Glow & Rings
  glowCore: string;
  glowMid: string;
  glowOuter: string;
  outerBorder: string;
  middleBorder: string;
  innerBorder: string;
  circleBg: string;
  starColor: string;
  textColor: string;
  captionColor: string;
  dots: string | string[];
}

export const useSkyTheme = (periodOverride?: SkyTimePeriod): SkyThemeTokens => {
  const { activePeriod: contextPeriod } = useSky();
  const activePeriod = periodOverride || contextPeriod || SKY.DAY;

  return useMemo(() => {
    const oocaCIOrb = {
      ringTrack: 'rgba(0, 196, 179, 0.16)',
      ringProgress: DESIGN_TOKENS.color.brand.turquoise.primary,
      orbBorder: DESIGN_TOKENS.color.brand.turquoise.primary,
      secondsColor: DESIGN_TOKENS.color.brand.turquoise.text,
      phaseLabelColor: DESIGN_TOKENS.color.brand.turquoise.text,
      cycleCounterColor: DESIGN_TOKENS.color.brand.turquoise.primary,
    };

    switch (activePeriod) {
      case SKY.SUNSET:
        return {
          period: SKY.SUNSET,
          ...oocaCIOrb,

          // Somatic Breathing
          instructionColor: '#FFFFFF',
          pulseColor: '#FFFFFF',
          heartColor: '#FFFFFF',

          // Progress / counters
          countColor: '#FFFFFF',
          labelColor: '#FDEFEE',
          hintColor: '#E44743',
          progressTrack: 'rgba(255, 255, 255, 0.45)',
          progressFill: ['#ffc9c7ff', '#ffdbc4ff'] as const,
          progressFillColor: '#EF7773',
          progressFillBar: 'linear-gradient(90deg, #ffc9c7ff, #ffdbc4ff)',
          fluidColors: ['#00C4B3', '#EF7773', '#FF8F4B'] as const,

          // Badges
          badgeBg: '#FDEFEE',
          badgeBorder: '#FAD6D5',
          badgeText: '#E44743',
          badgeTextColor: '#E44743',
          badgeIconColor: '#EF7773',

          // Audio Matrix
          cardBg: 'rgba(255, 255, 255, 0.90)',
          cardBorder: '#FAD6D5',
          scriptTitle: '#E85A56',
          scriptText: '#EB6460',
          waveColor: '#E44743',
          hintText: '#FFFFFF',

          // Somatic Absorption
          glowCore: 'rgba(255, 255, 255, 0.45)',
          glowMid: 'rgba(254, 214, 213, 0.2)',
          glowOuter: 'rgba(239, 119, 115, 0.16)',
          outerBorder: 'rgba(239, 119, 115, 0.45)',
          middleBorder: 'rgba(255, 255, 255, 0.55)',
          innerBorder: 'rgba(255, 255, 255, 0.75)',
          circleBg: 'rgba(255, 255, 255, 0.09)',
          starColor: '#fff0f0ff',
          textColor: '#FFFFFF',
          captionColor: '#FAD6D5',
          dots: ['#EF7773', '#FF8F4B', '#E44743', '#00C4B3'],
        };

      case SKY.NIGHT:
        return {
          period: SKY.NIGHT,
          ...oocaCIOrb,

          // Somatic Breathing
          instructionColor: '#E4EFFB',
          pulseColor: DESIGN_TOKENS.color.turquoiseGray[4],
          heartColor: '#1F77DF',

          // Progress / counters
          countColor: '#FFFFFF',
          labelColor: '#E4EFFB',
          hintColor: '#79ADA9',
          progressTrack: 'rgba(255, 255, 255, 0.25)',
          progressFill: ['#1F77DF', '#62A0E9'] as const,
          progressFillColor: '#1F77DF',
          progressFillBar: 'linear-gradient(90deg, #1F77DF, #62A0E9)',
          fluidColors: ['#00C4B3', '#1F77DF', '#62A0E9'] as const,

          // Badges
          badgeBg: 'rgba(38, 49, 60, 0.92)',
          badgeBorder: 'rgba(143, 187, 239, 0.40)',
          badgeText: '#8FBBEF',
          badgeTextColor: '#8FBBEF',
          badgeIconColor: '#62A0E9',

          // Audio Matrix
          cardBg: 'rgba(38, 49, 60, 0.92)',
          cardBorder: 'rgba(143, 187, 239, 0.40)',
          scriptTitle: '#62A0E9',
          scriptText: '#FFFFFF',
          waveColor: '#1F77DF',
          hintText: '#79ADA9',

          // Somatic Absorption
          glowCore: 'rgba(143, 187, 239, 0.45)',
          glowMid: 'rgba(31, 119, 223, 0.26)',
          glowOuter: 'rgba(10, 71, 202, 0.12)',
          outerBorder: 'rgba(143, 187, 239, 0.35)',
          middleBorder: 'rgba(98, 160, 233, 0.30)',
          innerBorder: 'rgba(199, 221, 247, 0.25)',
          circleBg: 'rgba(38, 49, 60, 0.35)',
          starColor: '#C7DDF7',
          textColor: '#FFFFFF',
          captionColor: '#79ADA9',
          dots: ['#1F77DF', '#62A0E9', '#00C4B3', '#8FBBEF'],
        };

      case SKY.DAWN:
        return {
          period: SKY.DAWN,
          ...oocaCIOrb,

          // Somatic Breathing
          instructionColor: '#DF8900',
          pulseColor: '#DF8900',
          heartColor: '#F9A000',

          // Progress / counters
          countColor: '#D97800',
          labelColor: '#DF8900',
          hintColor: '#E39200',
          progressTrack: 'rgba(255, 255, 255, 0.65)',
          progressFill: ['#F9A000', '#F8E4B3'] as const,
          progressFillColor: '#F9A000',
          progressFillBar: 'linear-gradient(90deg, #F9A000, #F4D280)',
          fluidColors: ['#00C4B3', '#F9A000', '#F8E4B3'] as const,

          // Badges
          badgeBg: '#FCF4E0',
          badgeBorder: '#F8E4B3',
          badgeText: '#D97800',
          badgeTextColor: '#DF8900',
          badgeIconColor: '#F9A000',

          // Audio Matrix
          cardBg: 'rgba(255, 255, 255, 0.92)',
          cardBorder: '#F8E4B3',
          scriptTitle: '#DF8900',
          scriptText: '#E39200',
          waveColor: '#DF8900',
          hintText: '#D97800',

          // Somatic Absorption
          glowCore: 'rgba(255, 248, 224, 0.65)',
          glowMid: 'rgba(244, 210, 128, 0.5)',
          glowOuter: 'rgba(249, 160, 0, 0.16)',
          outerBorder: 'rgba(249, 160, 0, 0.40)',
          middleBorder: 'rgba(240, 191, 77, 0.45)',
          innerBorder: 'rgba(255, 255, 255, 0.65)',
          circleBg: 'rgba(255, 255, 255, 0.22)',
          starColor: '#F4D280',
          textColor: '#D97800',
          captionColor: '#DF8900',
          dots: ['#F9A000', '#F0BF4D', '#8AD866', '#FF8F4B'],
        };

      case SKY.DAY:
      default:
        return {
          period: SKY.DAY,
          ...oocaCIOrb,

          // Somatic Breathing
          instructionColor: DESIGN_TOKENS.color.brand.turquoise.text,
          pulseColor: DESIGN_TOKENS.color.turquoiseGray[4],
          heartColor: DESIGN_TOKENS.color.brand.turquoise.primary,

          // Progress / counters
          countColor: DESIGN_TOKENS.color.brand.turquoise.text,
          labelColor: DESIGN_TOKENS.color.brand.turquoise.text,
          hintColor: DESIGN_TOKENS.color.turquoiseGray[4],
          progressTrack: 'rgba(0, 196, 179, 0.16)',
          progressFill: [
            DESIGN_TOKENS.color.brand.turquoise.primary,
            DESIGN_TOKENS.color.accent.blue[300],
          ] as const,
          progressFillColor: DESIGN_TOKENS.color.brand.turquoise.primary,
          progressFillBar: 'linear-gradient(90deg, #00C4B3, #62A0E9)',
          fluidColors: ['#00C4B3', '#62A0E9', '#B3EDE8'] as const,

          // Badges
          badgeBg: '#E0F8F6',
          badgeBorder: '#B3EDE8',
          badgeText: DESIGN_TOKENS.color.brand.turquoise.text,
          badgeTextColor: DESIGN_TOKENS.color.brand.turquoise.text,
          badgeIconColor: DESIGN_TOKENS.color.brand.turquoise.primary,

          // Audio Matrix
          cardBg: 'rgba(255, 255, 255, 0.92)',
          cardBorder: '#B3EDE8',
          scriptTitle: DESIGN_TOKENS.color.brand.turquoise.text,
          scriptText: DESIGN_TOKENS.color.turquoiseGray[1],
          waveColor: DESIGN_TOKENS.color.brand.turquoise.primary,
          hintText: DESIGN_TOKENS.color.turquoiseGray[4],

          // Somatic Absorption
          glowCore: 'rgba(0, 196, 179, 0.55)',
          glowMid: 'rgba(98, 160, 233, 0.32)',
          glowOuter: 'rgba(0, 196, 179, 0.14)',
          outerBorder: 'rgba(0, 196, 179, 0.35)',
          middleBorder: 'rgba(98, 160, 233, 0.30)',
          innerBorder: 'rgba(0, 196, 179, 0.22)',
          circleBg: 'rgba(255, 255, 255, 0.20)',
          starColor: DESIGN_TOKENS.color.brand.turquoise.primary,
          textColor: DESIGN_TOKENS.color.brand.turquoise.text,
          captionColor: DESIGN_TOKENS.color.turquoiseGray[4],
          dots: ['#00C4B3', '#62A0E9', '#8AD866', '#FF8F4B'],
        };
    }
  }, [activePeriod]);
};