import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  View
} from 'react-native';
import { colors, radii, shadows } from './tokens';
import { audioService, HAPTIC_STYLE } from '../services/audioService';

export const BUTTON_VARIANT = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  OUTLINE: 'outline',
  GHOST: 'ghost',
  AMBER: 'amber',
} as const;

export const BUTTON_SIZE = {
  SM: 'sm',
  MD: 'md',
  LG: 'lg',
} as const;

export type ButtonVariant = typeof BUTTON_VARIANT[keyof typeof BUTTON_VARIANT];
export type ButtonSize = typeof BUTTON_SIZE[keyof typeof BUTTON_SIZE];

interface ButtonProps {
  children: React.ReactNode;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onPress,
  variant = BUTTON_VARIANT.PRIMARY,
  size = BUTTON_SIZE.MD,
  fullWidth = false,
  disabled = false,
  loading = false,
  icon,
  style,
}) => {
  const handlePress = () => {
    if (disabled || loading) return;
    audioService.triggerHaptic(HAPTIC_STYLE.SELECTION);
    onPress();
  };

  const getContainerStyle = (): ViewStyle[] => {
    const list: ViewStyle[] = [styles.base];

    // Size
    if (size === BUTTON_SIZE.SM) list.push(styles.sizeSm);
    else if (size === BUTTON_SIZE.LG) list.push(styles.sizeLg);
    else list.push(styles.sizeMd);

    // Variant
    switch (variant) {
      case BUTTON_VARIANT.SECONDARY:
        list.push(styles.secondary);
        break;
      case BUTTON_VARIANT.OUTLINE:
        list.push(styles.outline);
        break;
      case BUTTON_VARIANT.GHOST:
        list.push(styles.ghost);
        break;
      case BUTTON_VARIANT.AMBER:
        list.push(styles.amber);
        break;
      case BUTTON_VARIANT.PRIMARY:
      default:
        list.push(styles.primary);
        break;
    }

    if (fullWidth) list.push(styles.fullWidth);
    if (disabled) list.push(styles.disabled);
    if (style) list.push(style);

    return list;
  };

  const getTextStyle = (): TextStyle[] => {
    const list: TextStyle[] = [styles.text];

    if (size === BUTTON_SIZE.SM) list.push(styles.textSm);
    else if (size === BUTTON_SIZE.LG) list.push(styles.textLg);
    else list.push(styles.textMd);

    switch (variant) {
      case BUTTON_VARIANT.SECONDARY:
        list.push(styles.textSecondary);
        break;
      case BUTTON_VARIANT.OUTLINE:
      case BUTTON_VARIANT.GHOST:
        list.push(styles.textOutline);
        break;
      case BUTTON_VARIANT.AMBER:
      case BUTTON_VARIANT.PRIMARY:
      default:
        list.push(styles.textPrimary);
        break;
    }

    if (disabled) list.push(styles.textDisabled);

    return list;
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={handlePress}
      disabled={disabled || loading}
      style={getContainerStyle()}
    >
      {loading ? (
        <ActivityIndicator color={variant === BUTTON_VARIANT.OUTLINE || variant === BUTTON_VARIANT.GHOST ? colors.primary : '#FFFFFF'} />
      ) : (
        <View style={styles.contentRow}>
          {icon && <View style={styles.iconWrapper}>{icon}</View>}
          <Text style={getTextStyle()}>{children}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: radii.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapper: {
    marginRight: 6,
  },
  sizeSm: {
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  sizeMd: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  sizeLg: {
    paddingVertical: 15,
    paddingHorizontal: 28,
  },
  fullWidth: {
    width: '100%',
  },
  primary: {
    backgroundColor: colors.primary,
    ...shadows.tealGlow,
  },
  secondary: {
    backgroundColor: colors.primaryLight,
    borderWidth: 1.5,
    borderColor: colors.borderTeal,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  amber: {
    backgroundColor: colors.secondary,
  },
  disabled: {
    opacity: 0.5,
    shadowOpacity: 0,
    elevation: 0,
  },
  text: {
    fontWeight: '700',
    textAlign: 'center',
  },
  textSm: {
    fontSize: 13,
  },
  textMd: {
    fontSize: 15,
  },
  textLg: {
    fontSize: 17,
  },
  textPrimary: {
    color: '#FFFFFF',
  },
  textSecondary: {
    color: colors.primaryDark,
  },
  textOutline: {
    color: colors.primaryDark,
  },
  textDisabled: {
    color: colors.textMuted,
  },
});
