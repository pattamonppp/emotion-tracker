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
          heartColor: '#FFFFFF',

          // Progress / badge
          countColor: '#FFFFFF',
          labelColor: '#FFFAFB',
          hintColor: '#5F0019',
          progressTrack: 'rgba(255, 255, 255, 0.45)',
          progressFillBar: 'linear-gradient(90deg, #FFA8BB, #FFF6B4)',
          badgeBg: 'rgba(255, 255, 255, 0.90)',
          badgeBorder: 'rgba(244, 114, 182, 0.40)',
          badgeTextColor: '#A81642',
          badgeIconColor: '#F43F5E',

          // Somatic Absorption
          glowCore: 'rgba(255, 251, 235, 0.45)',
          glowMid: 'rgba(253, 230, 138, 0.22)',
          glowOuter: 'rgba(254, 215, 170, 0.08)',
          outerBorder: 'rgba(244, 114, 182, 0.45)',
          middleBorder: 'rgba(255, 255, 255, 0.55)',
          innerBorder: 'rgba(255, 255, 255, 0.75)',
          circleBg: 'rgba(255, 255, 255, 0.18)',
          starColor: '#FFF6B4',
          textColor: '#FFFFFF',
          captionColor: '#FFF6B4',
          dots: '#FFFFFF',
          badgeText: '#A81642',
        };

      case 'night':
        return {
          ...oocaCIOrb,

          // Somatic Breathing
          instructionColor: '#E2E8F0',
          pulseColor: DESIGN_TOKENS.color.gray.muted,
          heartColor: '#EC4899',

          // Progress / badge
          countColor: '#F8FAFC',
          labelColor: '#E2E8F0',
          hintColor: '#94A3B8',
          progressTrack: 'rgba(255, 255, 255, 0.25)',
          progressFillBar: 'linear-gradient(90deg, #38BDF8, #818CF8)',
          badgeBg: 'rgba(15, 23, 42, 0.92)',
          badgeBorder: 'rgba(56, 189, 248, 0.40)',
          badgeTextColor: '#E0F2FE',
          badgeIconColor: '#38BDF8',

          // Somatic Absorption
          glowCore: 'rgba(56, 189, 248, 0.22)',
          glowMid: 'rgba(59, 130, 246, 0.12)',
          glowOuter: 'rgba(99, 102, 241, 0.06)',
          outerBorder: 'rgba(56, 189, 248, 0.35)',
          middleBorder: 'rgba(129, 140, 248, 0.30)',
          innerBorder: 'rgba(148, 163, 184, 0.25)',
          circleBg: 'rgba(15, 23, 42, 0.35)',
          starColor: '#BAE6FD',
          textColor: '#F8FAFC',
          captionColor: '#94A3B8',
          dots: '#38BDF8',
          badgeText: '#E0F2FE',
        };

      case 'dawn':
        return {
          ...oocaCIOrb,

          // Somatic Breathing
          instructionColor: '#92400E',
          pulseColor: '#92400E',
          heartColor: '#92400E',

          // Progress / badge
          countColor: '#78350F',
          labelColor: '#92400E',
          hintColor: '#B45309',
          progressTrack: 'rgba(255, 255, 255, 0.65)',
          progressFillBar: 'linear-gradient(90deg, #F59E0B, #FBBF24)',
          badgeBg: 'rgba(255, 255, 255, 0.90)',
          badgeBorder: 'rgba(245, 158, 11, 0.40)',
          badgeTextColor: '#92400E',
          badgeIconColor: '#F59E0B',

          // Somatic Absorption
          glowCore: 'rgba(255, 251, 235, 0.45)',
          glowMid: 'rgba(251, 191, 36, 0.20)',
          glowOuter: 'rgba(245, 158, 11, 0.08)',
          outerBorder: 'rgba(245, 158, 11, 0.40)',
          middleBorder: 'rgba(251, 191, 36, 0.45)',
          innerBorder: 'rgba(255, 255, 255, 0.65)',
          circleBg: 'rgba(255, 255, 255, 0.22)',
          starColor: '#FBBF24',
          textColor: '#78350F',
          captionColor: '#B45309',
          dots: '#F59E0B',
          badgeText: '#92400E',
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
            'linear-gradient(90deg, #00C4B3, #38BDF8)',
          badgeBg: 'rgba(255, 255, 255, 0.90)',
          badgeBorder: 'rgba(0, 196, 179, 0.35)',
          badgeTextColor:
            DESIGN_TOKENS.color.brand.turquoise.text,
          badgeIconColor:
            DESIGN_TOKENS.color.brand.turquoise.primary,

          // Somatic Absorption
          glowCore: 'rgba(0, 196, 179, 0.32)',
          glowMid: 'rgba(56, 189, 248, 0.16)',
          glowOuter: 'rgba(0, 196, 179, 0.06)',
          outerBorder: 'rgba(0, 196, 179, 0.35)',
          middleBorder: 'rgba(56, 189, 248, 0.30)',
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