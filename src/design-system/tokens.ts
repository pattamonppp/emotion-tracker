import { Platform, TextStyle } from 'react-native';
import { OOCA_TOKENS } from '../../src_web/design-system/tokens';

export { OOCA_TOKENS };
export const DESIGN_TOKENS = OOCA_TOKENS;

export const colors = {
  primary: OOCA_TOKENS.color.brand.turquoise.primary, // #00C4B3
  primaryDark: OOCA_TOKENS.color.brand.turquoise.text, // #009688
  primaryLight: OOCA_TOKENS.color.brand.turquoise.pale, // #DBF0EE
  primaryPale: OOCA_TOKENS.color.brand.turquoise.pale, // #DBF0EE
  primaryLight2: OOCA_TOKENS.color.brand.turquoise.light, // #B3EDE8
  primaryMuted: OOCA_TOKENS.color.brand.turquoise.light, // #B3EDE8
  ringTrack: OOCA_TOKENS.color.brand.turquoise.ringTrack,
  
  secondary: OOCA_TOKENS.color.system.warning[500], // #FF8F4B
  secondaryLight: OOCA_TOKENS.color.system.warning[100], // #FFDDC9
  
  accentPink: OOCA_TOKENS.color.system.error[500], // #EF7773
  accentPinkLight: OOCA_TOKENS.color.system.error[100], // #FAD6D5
  
  accentOrange: OOCA_TOKENS.color.accent.orange[500], // #F9A000
  accentOrangeLight: OOCA_TOKENS.color.accent.orange[100], // #F8E4B3
  
  accentBlue: OOCA_TOKENS.color.accent.blue[500], // #1F77DF
  accentBlueLight: OOCA_TOKENS.color.accent.blue[50], // #E4EFFB
  
  bgLight: OOCA_TOKENS.color.gradient.background, // #DBF0EE
  cardBg: OOCA_TOKENS.color.gray.white,
  white: OOCA_TOKENS.color.gray.white,
  black: OOCA_TOKENS.color.gray.black,
  
  textPrimary: OOCA_TOKENS.color.gray.darkText, // #26313c
  textSecondary: OOCA_TOKENS.color.palette.coolGray[600], // #566d80
  textMuted: OOCA_TOKENS.color.gray.muted, // #637b91
  darkText: OOCA_TOKENS.color.gray.darkText,
  
  borderSubtle: OOCA_TOKENS.color.gray.border, // #cdd8e1
  borderTeal: OOCA_TOKENS.color.brand.turquoise.border,
  
  success: OOCA_TOKENS.color.system.success[500], // #8AD866
  guava: OOCA_TOKENS.color.system.success[500], // #8AD866
  warning: OOCA_TOKENS.color.system.warning[500], // #FF8F4B
  
  turquoiseGray1: OOCA_TOKENS.color.turquoiseGray[1], // #355956
  turquoiseGray2: OOCA_TOKENS.color.turquoiseGray[2], // #3F6866
  turquoiseGray3: OOCA_TOKENS.color.turquoiseGray[3], // #528984
  turquoiseGray4: OOCA_TOKENS.color.turquoiseGray[4], // #79ADA9
};

export const radii = {
  sm: 8,
  md: 12,
  lg: 18,
  xl: 24,
  full: 9999,
};

export const shadows = {
  soft: {
    shadowColor: '#355956',
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
    shadowColor: '#000000',
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
