import { useMemo } from 'react';
import { useSky } from '../components/DynamicSkyEngine';
import { DESIGN_TOKENS } from '../design-system/tokens';

export const useSkyTheme = () => {
  const { activePeriod } = useSky();

  return useMemo(() => {
    const oocaCIOrb = {
      ringTrack: 'rgba(0, 196, 179, 0.16)',
      ringProgress: DESIGN_TOKENS.color.brand.turquoise.primary,
      orbBorder: DESIGN_TOKENS.color.brand.turquoise.primary,
      secondsColor: DESIGN_TOKENS.color.brand.turquoise.text,
      phaseLabelColor: DESIGN_TOKENS.color.brand.turquoise.text,
      cycleCounterColor: DESIGN_TOKENS.color.brand.turquoise.primary,
      progressFill: DESIGN_TOKENS.color.brand.turquoise.primary,
    };

    switch (activePeriod) {
      case 'sunset':
        return {
          ...oocaCIOrb,

          // Somatic Breathing
          instructionColor: '#FFFFFF',
          pulseColor: '#FFFFFF',
          heartColor: '#EF7773',

          // Progress / badge
          countColor: '#FFFFFF',
          labelColor: '#FDEFEE',
          hintColor: '#E44743',
          progressTrack: 'rgba(255, 255, 255, 0.45)',
          progressFillBar: 'linear-gradient(90deg, #EF7773, #FF8F4B)',
          badgeBg: 'rgba(255, 255, 255, 0.90)',
          badgeBorder: 'rgba(239, 119, 115, 0.40)',
          badgeTextColor: '#E44743',
          badgeIconColor: '#EF7773',

          // Somatic Absorption
          glowCore: 'rgba(255, 255, 255, 0.45)',
          glowMid: 'rgba(254, 214, 213, 0.22)',
          glowOuter: 'rgba(239, 119, 115, 0.08)',
          outerBorder: 'rgba(239, 119, 115, 0.45)',
          middleBorder: 'rgba(255, 255, 255, 0.55)',
          innerBorder: 'rgba(255, 255, 255, 0.75)',
          circleBg: 'rgba(255, 255, 255, 0.18)',
          starColor: '#FAD6D5',
          textColor: '#FFFFFF',
          captionColor: '#FAD6D5',
          dots: '#FFFFFF',
          badgeText: '#E44743',
        };

      case 'night':
        return {
          ...oocaCIOrb,

          // Somatic Breathing
          instructionColor: '#E4EFFB',
          pulseColor: DESIGN_TOKENS.color.gray.muted,
          heartColor: '#1F77DF',

          // Progress / badge
          countColor: '#FFFFFF',
          labelColor: '#E4EFFB',
          hintColor: '#79ADA9',
          progressTrack: 'rgba(255, 255, 255, 0.25)',
          progressFillBar: 'linear-gradient(90deg, #1F77DF, #62A0E9)',
          badgeBg: 'rgba(38, 49, 60, 0.92)',
          badgeBorder: 'rgba(143, 187, 239, 0.40)',
          badgeTextColor: '#E4EFFB',
          badgeIconColor: '#62A0E9',

          // Somatic Absorption
          glowCore: 'rgba(143, 187, 239, 0.22)',
          glowMid: 'rgba(31, 119, 223, 0.12)',
          glowOuter: 'rgba(10, 71, 202, 0.06)',
          outerBorder: 'rgba(143, 187, 239, 0.35)',
          middleBorder: 'rgba(98, 160, 233, 0.30)',
          innerBorder: 'rgba(199, 221, 247, 0.25)',
          circleBg: 'rgba(38, 49, 60, 0.35)',
          starColor: '#C7DDF7',
          textColor: '#FFFFFF',
          captionColor: '#79ADA9',
          dots: '#62A0E9',
          badgeText: '#E4EFFB',
        };

      case 'dawn':
        return {
          ...oocaCIOrb,

          // Somatic Breathing
          instructionColor: '#DF8900',
          pulseColor: '#DF8900',
          heartColor: '#F9A000',

          // Progress / badge
          countColor: '#D97800',
          labelColor: '#DF8900',
          hintColor: '#E39200',
          progressTrack: 'rgba(255, 255, 255, 0.65)',
          progressFillBar: 'linear-gradient(90deg, #F9A000, #F4D280)',
          badgeBg: 'rgba(255, 255, 255, 0.90)',
          badgeBorder: 'rgba(249, 160, 0, 0.40)',
          badgeTextColor: '#DF8900',
          badgeIconColor: '#F9A000',

          // Somatic Absorption
          glowCore: 'rgba(252, 244, 224, 0.45)',
          glowMid: 'rgba(244, 210, 128, 0.20)',
          glowOuter: 'rgba(249, 160, 0, 0.08)',
          outerBorder: 'rgba(249, 160, 0, 0.40)',
          middleBorder: 'rgba(240, 191, 77, 0.45)',
          innerBorder: 'rgba(255, 255, 255, 0.65)',
          circleBg: 'rgba(255, 255, 255, 0.22)',
          starColor: '#F4D280',
          textColor: '#D97800',
          captionColor: '#DF8900',
          dots: '#F9A000',
          badgeText: '#DF8900',
        };

      case 'day':
      default:
        return {
          ...oocaCIOrb,

          // Somatic Breathing
          instructionColor:
            DESIGN_TOKENS.color.brand.turquoise.text,
          pulseColor:
            DESIGN_TOKENS.color.gray.muted,
          heartColor:
            DESIGN_TOKENS.color.brand.turquoise.primary,

          // Progress / badge
          countColor:
            DESIGN_TOKENS.color.brand.turquoise.text,
          labelColor:
            DESIGN_TOKENS.color.brand.turquoise.text,
          hintColor:
            DESIGN_TOKENS.color.gray.muted,
          progressTrack: 'rgba(0, 196, 179, 0.15)',
          progressFillBar:
            'linear-gradient(90deg, #00C4B3, #62A0E9)',
          badgeBg: 'rgba(255, 255, 255, 0.90)',
          badgeBorder: 'rgba(0, 196, 179, 0.35)',
          badgeTextColor:
            DESIGN_TOKENS.color.brand.turquoise.text,
          badgeIconColor:
            DESIGN_TOKENS.color.brand.turquoise.primary,

          // Somatic Absorption
          glowCore: 'rgba(0, 196, 179, 0.32)',
          glowMid: 'rgba(98, 160, 233, 0.16)',
          glowOuter: 'rgba(0, 196, 179, 0.06)',
          outerBorder: 'rgba(0, 196, 179, 0.35)',
          middleBorder: 'rgba(98, 160, 233, 0.30)',
          innerBorder: 'rgba(0, 196, 179, 0.22)',
          circleBg: 'rgba(255, 255, 255, 0.20)',
          starColor:
            DESIGN_TOKENS.color.brand.turquoise.primary,
          textColor:
            DESIGN_TOKENS.color.brand.turquoise.text,
          captionColor:
            DESIGN_TOKENS.color.gray.muted,
          dots:
            DESIGN_TOKENS.color.brand.turquoise.primary,
          badgeText:
            DESIGN_TOKENS.color.brand.turquoise.text,
        };
    }
  }, [activePeriod]);
};