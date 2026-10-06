import React, { useRef } from 'react';
import {
  Animated,
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  ViewStyle,
  TextStyle,
  StyleProp,
} from 'react-native';
import { audioService, HAPTIC_STYLE } from '../services/audioService';
import { renderBilingualNodes } from '../components/BilingualText';
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
            backgroundColor: disabled ? colors.secondaryLight : colors.secondary, // #FFDDC9 vs #FF8F4B
            borderWidth: 1.5,
            borderColor: 'transparent',
          },
          text: {
            color: disabled ? '#F6F6F6' : '#FFFFFF',
          },
        };
      case MARSHMALLOW_VARIANT.SOFT_CREAM:
        return {
          btn: {
            backgroundColor: disabled ? '#FFF8F3' : '#FFF2E9', // Sunshade 50
            borderWidth: 1.5,
            borderColor: disabled ? '#FFEFE6' : '#FFDDC9', // Sunshade 100
          },
          text: {
            color: disabled ? colors.primaryLight2 : colors.primaryDark,
          },
        };
      case MARSHMALLOW_VARIANT.MINT:
        return {
          btn: {
            backgroundColor: disabled ? '#F2FCFA' : '#E0F8F6', // Turquoise 50
            borderWidth: 1.5,
            borderColor: disabled ? '#DDF6F3' : '#B3EDE8', // Turquoise 100
          },
          text: {
            color: disabled ? colors.primaryLight2 : colors.primaryDark,
          },
        };
      case MARSHMALLOW_VARIANT.PINK:
        return {
          btn: {
            backgroundColor: disabled ? '#FEF7F7' : '#FDEFEE', // Flamingo 50
            borderWidth: 1.5,
            borderColor: disabled ? '#FDE8E7' : '#FAD6D5', // Flamingo 100
          },
          text: {
            color: disabled ? colors.accentPinkLight : '#EF7773', // Flamingo 500
          },
        };
      case MARSHMALLOW_VARIANT.OUTLINE:
        return {
          btn: {
            backgroundColor: '#FFFFFF',
            borderWidth: 1.5,
            borderColor: disabled ? colors.primaryLight2 : colors.primary,
          },
          text: {
            color: disabled ? colors.primaryLight2 : colors.primary,
          },
        };
      case MARSHMALLOW_VARIANT.GHOST:
        return {
          btn: {
            backgroundColor: 'transparent',
            borderWidth: 1.5,
            borderColor: 'transparent',
            borderBottomWidth: 0,
            elevation: 0,
            shadowOpacity: 0,
          },
          text: {
            color: disabled ? colors.primaryLight2 : colors.primaryDark,
          },
        };
      case MARSHMALLOW_VARIANT.PRIMARY:
      default:
        return {
          btn: {
            backgroundColor: disabled ? colors.primaryLight2 : colors.primary, // #B3EDE8 vs #00C4B3
            borderWidth: 1.5,
            borderColor: 'transparent',
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
            height: 36,
            minHeight: 36,
            paddingHorizontal: 14,
            borderRadius: radii.full,
          },
          text: {
            fontSize: 12,
            fontFamily: typography.fontPromptSemiBold,
          },
        };
      case 'lg':
        return {
          btn: {
            height: 54,
            minHeight: 54,
            paddingHorizontal: 28,
            borderRadius: radii.full,
          },
          text: {
            fontSize: 16,
            fontFamily: typography.fontPromptBold,
          },
        };
      case 'md':
      default:
        return {
          btn: {
            height: 40,
            minHeight: 40,
            paddingHorizontal: 20,
            borderRadius: radii.full,
          },
          text: {
            fontSize: 13,
            fontFamily: typography.fontPromptMedium,
          },
        };
    }
  };

  const getIconSize = (): number => {
    switch (size) {
      case 'sm':
        return 14;
      case 'lg':
        return 20;
      case 'md':
      default:
        return 16;
    }
  };

  const getIconWrapperSize = (): { width: number; height: number } => {
    switch (size) {
      case 'sm':
        return { width: 16, height: 16 };
      case 'lg':
        return { width: 24, height: 24 };
      case 'md':
      default:
        return { width: 18, height: 18 };
    }
  };

  const vStyles = getVariantStyles();
  const sStyles = getSizeStyles();

  const flattenedStyle = StyleSheet.flatten(style) || {};
  const wrapperStyle: ViewStyle = {};
  if (flattenedStyle.flex !== undefined) wrapperStyle.flex = flattenedStyle.flex;
  if (flattenedStyle.flexGrow !== undefined) wrapperStyle.flexGrow = flattenedStyle.flexGrow;
  if (flattenedStyle.flexShrink !== undefined) wrapperStyle.flexShrink = flattenedStyle.flexShrink;
  if (flattenedStyle.width !== undefined) wrapperStyle.width = flattenedStyle.width;
  if (flattenedStyle.alignSelf !== undefined) wrapperStyle.alignSelf = flattenedStyle.alignSelf;
  if (flattenedStyle.margin !== undefined) wrapperStyle.margin = flattenedStyle.margin;
  if (flattenedStyle.marginHorizontal !== undefined) wrapperStyle.marginHorizontal = flattenedStyle.marginHorizontal;
  if (flattenedStyle.marginVertical !== undefined) wrapperStyle.marginVertical = flattenedStyle.marginVertical;
  if (flattenedStyle.marginLeft !== undefined) wrapperStyle.marginLeft = flattenedStyle.marginLeft;
  if (flattenedStyle.marginRight !== undefined) wrapperStyle.marginRight = flattenedStyle.marginRight;
  if (flattenedStyle.marginTop !== undefined) wrapperStyle.marginTop = flattenedStyle.marginTop;
  if (flattenedStyle.marginBottom !== undefined) wrapperStyle.marginBottom = flattenedStyle.marginBottom;

  return (
    <Animated.View
      style={[
        wrapperStyle,
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
          { width: '100%' },
          disabled && styles.disabled,
          style,
        ]}
      >
        {icon ? (
          <View style={[styles.iconWrapper, getIconWrapperSize()]}>
            {React.isValidElement(icon)
              ? React.cloneElement(icon as React.ReactElement<any>, {
                  size: getIconSize(),
                })
              : icon}
          </View>
        ) : null}
        {title ? (
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={[styles.text, sStyles.text, vStyles.text, textStyle]}
          >
            {renderBilingualNodes(
              title,
              sStyles.text.fontFamily,
              size === 'lg' ? typography.fontGothamBold : typography.fontGotham
            )}
          </Text>
        ) : null}
        {typeof children === 'string' ? (
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={[styles.text, sStyles.text, vStyles.text, textStyle]}
          >
            {renderBilingualNodes(
              children,
              sStyles.text.fontFamily,
              size === 'lg' ? typography.fontGothamBold : typography.fontGotham
            )}
          </Text>
        ) : (
          children
        )}
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
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  text: {
    textAlign: 'center',
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
  disabled: {
    elevation: 0,
    shadowOpacity: 0,
  },
});
