import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { colors, typography } from '../design-system/tokens';

interface MindfullLogoProps {
  variant?: 'color' | 'white' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  fontSize?: number;
}

export const MindfullLogo: React.FC<MindfullLogoProps> = ({
  variant = 'color',
  size = 'sm',
  fontSize: customFontSize,
}) => {
  const textColor = variant === 'white' ? colors.white : colors.primary;
  const heartColor = variant === 'white' ? colors.white : colors.accentBlue;
  const smileColor = variant === 'white' ? colors.white : colors.accentBlue;

  const fontSize = customFontSize ?? (size === 'sm' ? 24 : size === 'lg' ? 34 : 28);
  const ratio = fontSize / 24;
  const heartSize = 11 * ratio;
  const heartTop = -1.2 * ratio;
  const smileyWidth = 22 * ratio;
  const smileyHeight = 17.5 * ratio;

  return (
    <View style={styles.container}>
      <Text style={[styles.letter, { color: textColor, fontSize }]}>m</Text>

      {/* 'i' with cute heart dot */}
      <View style={styles.iWrapper}>
        <Svg
          width={heartSize}
          height={heartSize}
          viewBox="0 0 16 16"
          style={[styles.heart, { top: heartTop }]}
        >
          <Path
            d="M 8 13.5 C 7.5 13 2 9.2 2 5.5 C 2 3.5 3.5 2 5.5 2 C 6.8 2 7.5 2.7 8 3.4 C 8.5 2.7 9.2 2 10.5 2 C 12.5 2 14 3.5 14 5.5 C 14 9.2 8.5 13 8 13.5 Z"
            fill={heartColor}
          />
        </Svg>
        <Text style={[styles.letter, { color: textColor, fontSize }]}>ı</Text>
      </View>

      <Text style={[styles.letter, { color: textColor, fontSize }]}>ndf</Text>

      {/* Smiley face replacing 'u' */}
      <View style={[styles.smileyWrapper, { width: smileyWidth, height: smileyHeight }]}>
        <Svg
          width={smileyWidth}
          height={smileyHeight}
          viewBox="0 0 20 16"
        >
          <Circle cx="5" cy="4.5" r="2" fill={smileColor} />
          <Circle cx="15" cy="4.5" r="2" fill={smileColor} />
          <Path
            d="M 5 9.5 Q 10 15 15 9.5"
            fill="none"
            stroke={smileColor}
            strokeWidth={2.4}
            strokeLinecap="round"
          />
        </Svg>
      </View>

      <Text style={[styles.letter, { color: textColor, fontSize }]}>ll</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  letter: {
    fontFamily: typography.fontPromptBold,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  iWrapper: {
    alignItems: 'center',
    position: 'relative',
  },
  heart: {
    position: 'absolute',
  },
  smileyWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 1,
  },
});
