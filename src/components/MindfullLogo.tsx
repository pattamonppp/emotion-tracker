import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface MindfullLogoProps {
  variant?: 'color' | 'white' | 'dark';
  size?: 'sm' | 'md' | 'lg';
}

export const MindfullLogo: React.FC<MindfullLogoProps> = ({
  variant = 'color',
  size = 'md',
}) => {
  const textColor = variant === 'white' ? '#FFFFFF' : '#00C4B3';
  const heartColor = variant === 'white' ? '#FFFFFF' : '#1F77DF';
  const smileColor = variant === 'white' ? '#FFFFFF' : '#1F77DF';

  const fontSize = size === 'sm' ? 16 : size === 'lg' ? 24 : 19;
  const heartSize = size === 'sm' ? 8 : size === 'lg' ? 12 : 10;
  const smileWidth = size === 'sm' ? 14 : size === 'lg' ? 20 : 16;
  const smileHeight = size === 'sm' ? 6 : size === 'lg' ? 9 : 8;

  return (
    <View style={styles.container}>
      <Text style={[styles.letter, { color: textColor, fontSize }]}>m</Text>

      {/* 'i' with cute heart dot */}
      <View style={styles.iWrapper}>
        <Svg
          width={heartSize}
          height={heartSize}
          viewBox="0 0 16 16"
          style={styles.heart}
        >
          <Path
            d="M8 14s-6-3.8-6-7.5A3.5 3.5 0 0 1 8 3.8a3.5 3.5 0 0 1 6 2.7C14 10.2 8 14 8 14z"
            fill={heartColor}
          />
        </Svg>
        <Text style={[styles.letter, { color: textColor, fontSize }]}>i</Text>
      </View>

      <Text style={[styles.letter, { color: textColor, fontSize }]}>ndf</Text>

      {/* 'u' with smiling curve */}
      <View style={styles.uWrapper}>
        <Text style={[styles.letter, { color: textColor, fontSize }]}>u</Text>
        <Svg
          width={smileWidth}
          height={smileHeight}
          viewBox="0 0 24 12"
          style={styles.smile}
        >
          <Path
            d="M 3 2 Q 12 11 21 2"
            fill="none"
            stroke={smileColor}
            strokeWidth={3}
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
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  iWrapper: {
    alignItems: 'center',
    position: 'relative',
  },
  heart: {
    position: 'absolute',
    top: -4,
  },
  uWrapper: {
    alignItems: 'center',
    position: 'relative',
  },
  smile: {
    position: 'absolute',
    bottom: -3,
  },
});
