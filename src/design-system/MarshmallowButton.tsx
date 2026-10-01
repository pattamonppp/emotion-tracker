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
import { audioService } from '../services/audioService';
import { colors, radii, shadows } from './tokens';

export interface MarshmallowButtonProps {
  onPress: () => void;
  title?: string;
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'softCream' | 'outline' | 'ghost' | 'mint' | 'pink';
  size?: 'sm' | 'md' | 'lg';
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export const MarshmallowButton: React.FC<MarshmallowButtonProps> = ({
  onPress,
  title,
  children,
  variant = 'primary',
  size = 'md',
  style,
  textStyle,
  disabled = false,
  icon,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const translateYAnim = useRef(new Animated.Value(0)).current;

  const handlePressIn = () => {
    if (disabled) return;
    audioService.triggerHaptic('light');
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
      case 'secondary':
        return {
          btn: {
            backgroundColor: colors.secondary,
            borderBottomColor: '#D97328',
          },
          text: {
            color: '#FFFFFF',
          },
        };
      case 'softCream':
        return {
          btn: {
            backgroundColor: '#FFFDF9',
            borderWidth: 1.5,
            borderColor: '#FFE2D1',
            borderBottomColor: '#F5C6A8',
          },
          text: {
            color: colors.primaryDark,
          },
        };
      case 'mint':
        return {
          btn: {
            backgroundColor: '#E6F9F7',
            borderWidth: 1.5,
            borderColor: '#A7ECE4',
            borderBottomColor: '#6BD4C7',
          },
          text: {
            color: colors.primaryDark,
          },
        };
      case 'pink':
        return {
          btn: {
            backgroundColor: '#FFF0F0',
            borderWidth: 1.5,
            borderColor: '#FFD1D1',
            borderBottomColor: '#FFAEAE',
          },
          text: {
            color: '#D44343',
          },
        };
      case 'outline':
        return {
          btn: {
            backgroundColor: '#FFFFFF',
            borderWidth: 2,
            borderColor: colors.primary,
            borderBottomColor: '#009688',
          },
          text: {
            color: colors.primary,
          },
        };
      case 'ghost':
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
      case 'primary':
      default:
        return {
          btn: {
            backgroundColor: colors.primary,
            borderBottomColor: '#009F91',
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
            borderRadius: radii.md,
            borderBottomWidth: variant === 'ghost' ? 0 : 2.5,
          },
          text: {
            fontSize: 12,
            fontWeight: '600',
          },
        };
      case 'lg':
        return {
          btn: {
            paddingVertical: 14,
            paddingHorizontal: 28,
            borderRadius: radii.xl,
            borderBottomWidth: variant === 'ghost' ? 0 : 4,
          },
          text: {
            fontSize: 16,
            fontWeight: '700',
          },
        };
      case 'md':
      default:
        return {
          btn: {
            paddingVertical: 11,
            paddingHorizontal: 20,
            borderRadius: radii.lg,
            borderBottomWidth: variant === 'ghost' ? 0 : 3.5,
          },
          text: {
            fontSize: 14,
            fontWeight: '700',
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
            audioService.triggerHaptic('selection');
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
