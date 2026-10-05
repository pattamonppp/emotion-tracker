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
  card: 16,
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

  // Gotham Rounded for English CI
  fontGothamLight: 'GothamRounded-Light',
  fontGothamBook: 'GothamRounded-Book',
  fontGotham: 'GothamRounded-Medium',
  fontGothamBold: 'GothamRounded-Bold',
  fontEn: 'GothamRounded-Bold',

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

  // Standardized Gotham Rounded / Prompt Typography Scale
  h1: {
    fontFamily: 'Prompt_700Bold',
    fontSize: 36,
    lineHeight: 40,
    letterSpacing: 0,
    ...(Platform.OS !== 'android' ? { fontWeight: '700' as const } : {}),
  } as TextStyle,
  h2: {
    fontFamily: 'Prompt_400Regular',
    fontSize: 36,
    lineHeight: 36,
    letterSpacing: 0,
    ...(Platform.OS !== 'android' ? { fontWeight: '400' as const } : {}),
  } as TextStyle,
  h3: {
    fontFamily: 'Prompt_500Medium',
    fontSize: 24,
    lineHeight: 30,
    letterSpacing: 0,
    ...(Platform.OS !== 'android' ? { fontWeight: '500' as const } : {}),
  } as TextStyle,
  h4: {
    fontFamily: 'Prompt_500Medium',
    fontSize: 20,
    lineHeight: 24,
    letterSpacing: 0,
    ...(Platform.OS !== 'android' ? { fontWeight: '500' as const } : {}),
  } as TextStyle,
  subheader1: {
    fontFamily: 'Prompt_500Medium',
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0,
    ...(Platform.OS !== 'android' ? { fontWeight: '500' as const } : {}),
  } as TextStyle,
  subheader2: {
    fontFamily: 'Prompt_300Light',
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0,
    ...(Platform.OS !== 'android' ? { fontWeight: '300' as const } : {}),
  } as TextStyle,
  title1: {
    fontFamily: 'Prompt_500Medium',
    fontSize: 20,
    lineHeight: 24,
    letterSpacing: 0,
    ...(Platform.OS !== 'android' ? { fontWeight: '500' as const } : {}),
  } as TextStyle,
  title2: {
    fontFamily: 'Prompt_500Medium',
    fontSize: 18,
    lineHeight: 22,
    letterSpacing: 0,
    ...(Platform.OS !== 'android' ? { fontWeight: '500' as const } : {}),
  } as TextStyle,
  title3: {
    fontFamily: 'Prompt_500Medium',
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: 0,
    ...(Platform.OS !== 'android' ? { fontWeight: '500' as const } : {}),
  } as TextStyle,
  body1: {
    fontFamily: 'Prompt_300Light',
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: 0,
    ...(Platform.OS !== 'android' ? { fontWeight: '300' as const } : {}),
  } as TextStyle,
  body2: {
    fontFamily: 'Prompt_500Medium',
    fontSize: 14,
    lineHeight: 24,
    letterSpacing: 0,
    ...(Platform.OS !== 'android' ? { fontWeight: '500' as const } : {}),
  } as TextStyle,
  body3: {
    fontFamily: 'Prompt_300Light',
    fontSize: 14,
    lineHeight: 24,
    letterSpacing: 0,
    ...(Platform.OS !== 'android' ? { fontWeight: '300' as const } : {}),
  } as TextStyle,
  body4: {
    fontFamily: 'Prompt_500Medium',
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0,
    ...(Platform.OS !== 'android' ? { fontWeight: '500' as const } : {}),
  } as TextStyle,
  body5: {
    fontFamily: 'Prompt_300Light',
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0,
    ...(Platform.OS !== 'android' ? { fontWeight: '300' as const } : {}),
  } as TextStyle,
  buttonLarge: {
    fontFamily: 'Prompt_500Medium',
    fontSize: 20,
    lineHeight: 24,
    letterSpacing: 0,
    ...(Platform.OS !== 'android' ? { fontWeight: '500' as const } : {}),
  } as TextStyle,
  buttonSmall: {
    fontFamily: 'Prompt_500Medium',
    fontSize: 16,
    lineHeight: 16,
    letterSpacing: 0,
    ...(Platform.OS !== 'android' ? { fontWeight: '500' as const } : {}),
  } as TextStyle,
  buttonUnderline1: {
    fontFamily: 'Prompt_300Light',
    fontSize: 16,
    lineHeight: 16,
    letterSpacing: 0,
    textDecorationLine: 'underline',
    ...(Platform.OS !== 'android' ? { fontWeight: '300' as const } : {}),
  } as TextStyle,
  buttonUnderline2: {
    fontFamily: 'Prompt_300Light',
    fontSize: 14,
    lineHeight: 14,
    letterSpacing: 0,
    textDecorationLine: 'underline',
    ...(Platform.OS !== 'android' ? { fontWeight: '300' as const } : {}),
  } as TextStyle,
  buttonUnderlineSmall: {
    fontFamily: 'Prompt_300Light',
    fontSize: 12,
    lineHeight: 12,
    letterSpacing: 0,
    textDecorationLine: 'underline',
    ...(Platform.OS !== 'android' ? { fontWeight: '300' as const } : {}),
  } as TextStyle,
  buttonUnderlineMini: {
    fontFamily: 'Prompt_500Medium',
    fontSize: 8,
    lineHeight: 10,
    letterSpacing: 0,
    textDecorationLine: 'underline',
    ...(Platform.OS !== 'android' ? { fontWeight: '500' as const } : {}),
  } as TextStyle,
  small: {
    fontFamily: 'Prompt_500Medium',
    fontSize: 9,
    lineHeight: 10,
    letterSpacing: 0,
    ...(Platform.OS !== 'android' ? { fontWeight: '500' as const } : {}),
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

export const modalInputStyles = {
  input: {
    backgroundColor: '#fbfbfb',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#cdd8e1',
    fontSize: 13,
    color: '#26313c',
    fontFamily: typography.fontPromptMedium,
  },
  inputFocused: {
    borderColor: '#00c4b3',
    backgroundColor: '#ffffff',
  },
  placeholderColor: '#637b91',
};
