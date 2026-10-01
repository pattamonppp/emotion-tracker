import { Platform, TextStyle } from 'react-native';

export const colors = {
  primary: '#00C4B3',
  primaryDark: '#004D40',
  primaryLight: '#E6F9F7',
  primaryMuted: '#B3EDE8',
  
  secondary: '#FA8C3D', // Warm accent
  secondaryLight: '#FFF4EB',
  
  accentPink: '#F26E6E',
  accentPinkLight: '#FEECEC',
  
  accentBlue: '#3B82F6',
  accentBlueLight: '#EFF6FF',
  
  bgLight: '#FFFDF9',
  cardBg: '#FFFFFF',
  
  textPrimary: '#0F172A',
  textSecondary: '#475569',
  textMuted: '#94A3B8',
  
  borderSubtle: '#E2E8F0',
  borderTeal: 'rgba(0, 196, 179, 0.25)',
  
  success: '#10B981',
  warning: '#F59E0B',
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
