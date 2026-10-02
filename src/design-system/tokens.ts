import { Platform, TextStyle } from 'react-native';

export const OOCA_TOKENS = {
  color: {
    brand: {
      turquoise: {
        primary: '#00C4B3',
        light: '#33D0C2',
        pale: '#E6F9F7',
        text: '#004D40',
        ringTrack: 'rgba(0, 196, 179, 0.16)',
        border: 'rgba(0, 196, 179, 0.25)',
      },
    },
    accent: {
      blue: {
        500: '#1F77DF',
        300: '#62A0E9',
        200: '#8FBBEF',
        100: '#C7DDF7',
        50: '#E4EFFB',
      },
    },
    feedback: {
      error: '#F26E6E',
      warning: '#FA8C3D',
      success: '#7CC954',
      emerald: '#10B981',
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
      controls: 9999,
      avatars: 12,
      actionablesSm: 8,
      actionablesLg: 24,
      containers: 0,
    },
  },
} as const;

export const colors = {
  primary: OOCA_TOKENS.color.brand.turquoise.primary,
  primaryDark: OOCA_TOKENS.color.brand.turquoise.text,
  primaryLight: OOCA_TOKENS.color.brand.turquoise.pale,
  primaryPale: OOCA_TOKENS.color.brand.turquoise.pale,
  primaryLight2: OOCA_TOKENS.color.brand.turquoise.light,
  primaryMuted: '#B3EDE8',
  ringTrack: OOCA_TOKENS.color.brand.turquoise.ringTrack,
  
  secondary: OOCA_TOKENS.color.feedback.warning, // Warm accent Sunshade
  secondaryLight: '#FFF4EB',
  
  accentPink: OOCA_TOKENS.color.feedback.error, // Flamingo
  accentPinkLight: '#FEECEC',
  
  accentBlue: OOCA_TOKENS.color.accent.blue[500],
  accentBlueLight: OOCA_TOKENS.color.accent.blue[50],
  
  bgLight: '#FFFDF9',
  cardBg: OOCA_TOKENS.color.gray.white,
  white: OOCA_TOKENS.color.gray.white,
  
  textPrimary: OOCA_TOKENS.color.gray.darkText,
  textSecondary: '#475569',
  textMuted: OOCA_TOKENS.color.gray.muted,
  darkText: OOCA_TOKENS.color.gray.darkText,
  
  borderSubtle: OOCA_TOKENS.color.gray.border,
  borderTeal: OOCA_TOKENS.color.brand.turquoise.border,
  
  success: OOCA_TOKENS.color.feedback.emerald,
  guava: OOCA_TOKENS.color.feedback.success,
  warning: OOCA_TOKENS.color.feedback.warning,
};

export const radii = {
  sm: OOCA_TOKENS.geometry.borderRadius.actionablesSm, // 8
  md: OOCA_TOKENS.geometry.borderRadius.avatars, // 12
  lg: 18,
  xl: OOCA_TOKENS.geometry.borderRadius.actionablesLg, // 24
  full: OOCA_TOKENS.geometry.borderRadius.controls, // 9999
};

export const shadows = {
  soft: {
    shadowColor: '#004D40',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  tealGlow: {
    shadowColor: '#00C4B3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4,
  },
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
  },
};

export const typography = {
  // Direct font family asset names (expo-font / Google Fonts Prompt)
  fontPromptLight: 'Prompt_300Light',
  fontPromptRegular: 'Prompt_400Regular',
  fontPromptMedium: 'Prompt_500Medium',
  fontPromptSemiBold: 'Prompt_600SemiBold',
  fontPromptBold: 'Prompt_700Bold',
  fontPromptExtraBold: 'Prompt_800ExtraBold',
  fontDefault: 'Prompt_400Regular',

  // Safe style objects for StyleSheet.create
  // Note: On Android, fontWeight is stripped when using custom weighted font assets
  // to prevent Android's ReactFontManager from falling back to Roboto.
  light: {
    fontFamily: 'Prompt_300Light',
    ...(Platform.OS !== 'android' ? { fontWeight: '300' as const } : {}),
  } as TextStyle,
  regular: {
    fontFamily: 'Prompt_400Regular',
    ...(Platform.OS !== 'android' ? { fontWeight: '400' as const } : {}),
  } as TextStyle,
  medium: {
    fontFamily: 'Prompt_500Medium',
    ...(Platform.OS !== 'android' ? { fontWeight: '500' as const } : {}),
  } as TextStyle,
  semiBold: {
    fontFamily: 'Prompt_600SemiBold',
    ...(Platform.OS !== 'android' ? { fontWeight: '600' as const } : {}),
  } as TextStyle,
  bold: {
    fontFamily: 'Prompt_700Bold',
    ...(Platform.OS !== 'android' ? { fontWeight: '700' as const } : {}),
  } as TextStyle,
  extraBold: {
    fontFamily: 'Prompt_800ExtraBold',
    ...(Platform.OS !== 'android' ? { fontWeight: '800' as const } : {}),
  } as TextStyle,
};

export {
  SKY_THEMES,
  getPeriodFromHour,
  getSkyTheme,
} from '../../src_web/design-system/tokens';
export type {
  SkyTimePeriod,
  SkyMode,
} from '../types';
