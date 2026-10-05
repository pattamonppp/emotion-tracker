import React, { useRef } from 'react';
import {
  Animated,
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  StyleProp,
} from 'react-native';
import { audioService, HAPTIC_STYLE } from '../services/audioService';
import { colors, radii, shadows, typography } from './tokens';

export const MARSHMALLOW_VARIANT = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  SOFT_CREAM: 'softCream',
  OUTLINE: 'outline',
  GHOST: 'ghost',
  MINT: 'mint',
  PINK: 'pink',
} as const;

export type MarshmallowVariant = typeof MARSHMALLOW_VARIANT[keyof typeof MARSHMALLOW_VARIANT];

export const MARSHMALLOW_SIZE = {
  SM: 'sm',
  MD: 'md',
  LG: 'lg',
} as const;

export type MarshmallowSize = typeof MARSHMALLOW_SIZE[keyof typeof MARSHMALLOW_SIZE];

export interface MarshmallowButtonProps {
  onPress: () => void;
  title?: string;
  children?: React.ReactNode;
  variant?: MarshmallowVariant;
  size?: MarshmallowSize;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export const MarshmallowButton: React.FC<MarshmallowButtonProps> = ({
  onPress,
  title,
  children,
  variant = MARSHMALLOW_VARIANT.PRIMARY,
  size = MARSHMALLOW_SIZE.MD,
  style,
  textStyle,
  disabled = false,
  icon,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const translateYAnim = useRef(new Animated.Value(0)).current;

  const handlePressIn = () => {
    if (disabled) return;
    audioService.triggerHaptic(HAPTIC_STYLE.LIGHT);
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0.96,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(translateYAnim, {
        toValue: 2.5,
        duration: 80,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    if (disabled) return;
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 160,
        useNativeDriver: true,
      }),
      Animated.spring(translateYAnim, {
        toValue: 0,
        friction: 4,
        tension: 160,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const getVariantStyles = (): { btn: ViewStyle; text: TextStyle } => {
    switch (variant) {
      case MARSHMALLOW_VARIANT.SECONDARY:
        return {
          btn: {
            backgroundColor: colors.secondary, // #FF8F4B (Sunshade 500)
          },
          text: {
            color: '#FFFFFF',
          },
        };
      case MARSHMALLOW_VARIANT.SOFT_CREAM:
        return {
          btn: {
            backgroundColor: '#FFF2E9', // Sunshade 50
            borderWidth: 1.5,
            borderColor: '#FFDDC9', // Sunshade 100
          },
          text: {
            color: colors.primaryDark,
          },
        };
      case MARSHMALLOW_VARIANT.MINT:
        return {
          btn: {
            backgroundColor: '#E0F8F6', // Turquoise 50
            borderWidth: 1.5,
            borderColor: '#B3EDE8', // Turquoise 100
          },
          text: {
            color: colors.primaryDark,
          },
        };
      case MARSHMALLOW_VARIANT.PINK:
        return {
          btn: {
            backgroundColor: '#FDEFEE', // Flamingo 50
            borderWidth: 1.5,
            borderColor: '#FAD6D5', // Flamingo 100
          },
          text: {
            color: '#EF7773', // Flamingo 500
          },
        };
      case MARSHMALLOW_VARIANT.OUTLINE:
        return {
          btn: {
            backgroundColor: '#FFFFFF',
            borderWidth: 2,
            borderColor: colors.primary,
          },
          text: {
            color: colors.primary,
          },
        };
      case MARSHMALLOW_VARIANT.GHOST:
        return {
          btn: {
            backgroundColor: 'transparent',
            borderBottomWidth: 0,
            elevation: 0,
            shadowOpacity: 0,
          },
          text: {
            color: colors.primaryDark,
          },
        };
      case MARSHMALLOW_VARIANT.PRIMARY:
      default:
        return {
          btn: {
            backgroundColor: colors.primary, // #00C4B3
          },
          text: {
            color: '#FFFFFF',
          },
        };
    }
  };

  const getSizeStyles = (): { btn: ViewStyle; text: TextStyle } => {
    switch (size) {
      case 'sm':
        return {
          btn: {
            paddingVertical: 7,
            paddingHorizontal: 14,
            borderRadius: radii.full,
          },
          text: {
            fontSize: 12,
            lineHeight: 14.4,
            fontFamily: typography.fontPromptSemiBold,
          },
        };
      case 'lg':
        return {
          btn: {
            paddingVertical: 14,
            paddingHorizontal: 28,
            borderRadius: radii.full,
          },
          text: {
            fontSize: 16,
            lineHeight: 19.2,
            fontFamily: typography.fontPromptBold,
          },
        };
      case 'md':
      default:
        return {
          btn: {
            paddingVertical: 11,
            paddingHorizontal: 20,
            borderRadius: radii.full,
          },
          text: {
            fontSize: 14,
            lineHeight: 16.8,
            fontFamily: typography.fontPromptBold,
          },
        };
    }
  };

  const vStyles = getVariantStyles();
  const sStyles = getSizeStyles();

  return (
    <Animated.View
      style={[
        {
          transform: [{ scale: scaleAnim }, { translateY: translateYAnim }],
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={() => {
          if (!disabled) {
            audioService.triggerHaptic(HAPTIC_STYLE.SELECTION);
            onPress();
          }
        }}
        disabled={disabled}
        style={[
          styles.base,
          sStyles.btn,
          vStyles.btn,
          disabled && styles.disabled,
          style,
        ]}
      >
        {icon ? icon : null}
        {title ? (
          <Text style={[styles.text, sStyles.text, vStyles.text, textStyle]}>
            {title}
          </Text>
        ) : null}
        {children}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    ...shadows.soft,
  },
  text: {
    textAlign: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
});
