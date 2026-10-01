import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import Svg, {
  Path,
  Circle,
  Ellipse,
  Rect,
  Line,
  Polygon,
  G,
  Defs,
  LinearGradient,
  Stop,
  Text as SvgText,
} from 'react-native-svg';
import { audioService } from '../services/audioService';

export type MoocaMood =
  | 'happy'
  | 'comforting'
  | 'hugging'
  | 'praying'
  | 'rubbing'
  | 'drinking'
  | 'shaking'
  | 'listening'
  | 'celebrating'
  | 'sleepy'
  | 'sad';

interface MoocaMascotProps {
  mood?: MoocaMood;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showSunny?: boolean;
  speakingBubble?: string;
  interactive?: boolean;
  onHug?: () => void;
  style?: ViewStyle;
}

export const MoocaMascot: React.FC<MoocaMascotProps> = ({
  mood = 'happy',
  size = 'md',
  showSunny = true,
  speakingBubble,
  interactive = true,
  onHug,
  style,
}) => {
  const [isBlushing, setIsBlushing] = useState(false);
  const [tapHeartEffect, setTapHeartEffect] = useState(false);

  const getDimensions = () => {
    switch (size) {
      case 'xs': return { width: 52, height: 52 };
      case 'sm': return { width: 76, height: 76 };
      case 'lg': return { width: 148, height: 148 };
      case 'xl': return { width: 190, height: 190 };
      case 'md':
      default: return { width: 108, height: 108 };
    }
  };

  const { width, height } = getDimensions();

  const cloudFill = mood === 'sad' ? '#E2E8F0' : '#FFFFFF';
  const cloudStroke = mood === 'sad' ? '#94A3B8' : '#D1F2EE';

  const handleMascotTap = () => {
    if (!interactive) return;
    setIsBlushing(true);
    setTapHeartEffect(true);
    audioService.triggerHaptic('success');
    audioService.playJarDrop();
    if (onHug) onHug();

    setTimeout(() => {
      setTapHeartEffect(false);
    }, 1200);

    setTimeout(() => {
      setIsBlushing(false);
    }, 2500);
  };

  return (
    <View style={[styles.container, style]}>
      {/* Cute Floating Hearts on Tap */}
      {tapHeartEffect && (
        <View style={styles.heartBanner}>
          <Text style={styles.heartIcon}>💖</Text>
          <Text style={styles.heartText}>~Mooca loves you!~</Text>
        </View>
      )}

      {/* Speaking Bubble from Mooca */}
      {speakingBubble ? (
        <View style={styles.bubbleContainer}>
          <Text style={styles.bubbleText}>{speakingBubble}</Text>
          <View style={styles.bubbleTail} />
        </View>
      ) : null}

      {/* Mooca Mascot Vector Art */}
      <TouchableOpacity
        activeOpacity={0.88}
        onPress={handleMascotTap}
        disabled={!interactive}
        style={{ width, height, alignItems: 'center', justifyContent: 'center' }}
      >
        <Svg
          width={width}
          height={height}
          viewBox="0 0 160 160"
        >
          {/* Defs */}
          <Defs>
            <LinearGradient id="moocaRainbowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <Stop offset="0%" stopColor="#F26E6E" />
              <Stop offset="30%" stopColor="#FA8C3D" />
              <Stop offset="65%" stopColor="#7CC954" />
              <Stop offset="85%" stopColor="#00C4B3" />
              <Stop offset="100%" stopColor="#62A0E9" />
            </LinearGradient>
          </Defs>

          {/* Soft Cozy Tinted Shadow underneath */}
          <Ellipse cx="80" cy="148" rx="42" ry="7" fill="rgba(0, 196, 179, 0.16)" />

          {/* MOOCA Character Body */}
          <G>
            {/* Rainbow behind Mooca if celebrating */}
            {mood === 'celebrating' && (
              <Path
                d="M 32 70 A 48 48 0 0 1 128 70"
                stroke="url(#moocaRainbowGrad)"
                strokeWidth="8"
                fill="none"
                opacity={0.85}
                strokeLinecap="round"
              />
            )}

            {/* Cozy Warm Glow Halo */}
            <Circle cx="80" cy="80" r="54" fill="rgba(230, 249, 247, 0.6)" />

            {/* Fluffy Cloud Body */}
            <Path
              d="M 44 112 C 22 112, 14 90, 26 72 C 18 48, 42 34, 60 42 C 70 22, 94 22, 104 42 C 122 34, 146 48, 138 72 C 150 90, 140 112, 118 112 Z"
              fill={cloudFill}
              stroke={cloudStroke}
              strokeWidth="4"
              strokeLinejoin="round"
            />

            {/* Rosy Cheeks */}
            <Circle
              cx="54"
              cy="83"
              r={isBlushing ? 7 : 5.5}
              fill="#FFAAA6"
              opacity={isBlushing ? 0.95 : 0.65}
            />
            <Circle
              cx="106"
              cy="83"
              r={isBlushing ? 7 : 5.5}
              fill="#FFAAA6"
              opacity={isBlushing ? 0.95 : 0.65}
            />

            {/* Eyes */}
            {mood === 'praying' || mood === 'rubbing' || mood === 'comforting' ? (
              <G stroke="#004D40" strokeWidth="3" strokeLinecap="round" fill="none">
                <Path d="M 50 75 Q 58 68 66 75" />
                <Path d="M 94 75 Q 102 68 110 75" />
              </G>
            ) : mood === 'sleepy' ? (
              <G stroke="#004D40" strokeWidth="2.8" strokeLinecap="round" fill="none">
                <Path d="M 52 76 Q 58 80 64 76" />
                <Path d="M 96 76 Q 102 80 108 76" />
              </G>
            ) : mood === 'sad' ? (
              <G>
                <Circle cx="58" cy="74" r="3.5" fill="#334155" />
                <Circle cx="102" cy="74" r="3.5" fill="#334155" />
                <Path d="M 64 82 Q 62 88 65 91 Q 68 88 66 82 Z" fill="#60A5FA" />
              </G>
            ) : (
              <G>
                <Circle cx="58" cy="74" r="4.2" fill="#004D40" />
                <Circle cx="102" cy="74" r="4.2" fill="#004D40" />
                <Circle cx="59.5" cy="72.5" r="1.5" fill="#FFFFFF" />
                <Circle cx="103.5" cy="72.5" r="1.5" fill="#FFFFFF" />
                <Circle cx="56.5" cy="75.5" r="0.8" fill="#FFFFFF" />
                <Circle cx="100.5" cy="75.5" r="0.8" fill="#FFFFFF" />
              </G>
            )}

            {/* Cute Mouth */}
            {mood === 'sad' ? (
              <Path
                d="M 76 86 Q 80 82 84 86"
                stroke="#004D40"
                strokeWidth="2.6"
                strokeLinecap="round"
                fill="none"
              />
            ) : mood === 'drinking' ? (
              <Ellipse cx="80" cy="85" rx="3.5" ry="4.5" fill="#004D40" />
            ) : mood === 'celebrating' || mood === 'happy' ? (
              <G>
                <Path
                  d="M 73 82 Q 80 92 87 82 Z"
                  fill="#FF8A80"
                  stroke="#004D40"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                />
              </G>
            ) : (
              <Path
                d="M 74 81 Q 80 88 86 81"
                stroke="#004D40"
                strokeWidth="2.8"
                strokeLinecap="round"
                fill="none"
              />
            )}

            {/* Cozy Warm Knit Scarf */}
            <G>
              <Rect
                x="44"
                y="98"
                width="72"
                height="15"
                rx="7.5"
                fill="#FA8C3D"
                stroke="#D97706"
                strokeWidth="2"
              />
              <Line x1="56" y1="98" x2="56" y2="113" stroke="#FFFFFF" strokeWidth="2" opacity={0.75} />
              <Line x1="68" y1="98" x2="68" y2="113" stroke="#FFFFFF" strokeWidth="2" opacity={0.75} />
              <Line x1="80" y1="98" x2="80" y2="113" stroke="#FFFFFF" strokeWidth="2" opacity={0.75} />
              <Line x1="92" y1="98" x2="92" y2="113" stroke="#FFFFFF" strokeWidth="2" opacity={0.75} />

              <Rect
                x="90"
                y="108"
                width="15"
                height="24"
                rx="4"
                fill="#FA8C3D"
                stroke="#D97706"
                strokeWidth="2"
              />
              <Line x1="93" y1="132" x2="93" y2="136" stroke="#D97706" strokeWidth="2" />
              <Line x1="97.5" y1="132" x2="97.5" y2="136" stroke="#D97706" strokeWidth="2" />
              <Line x1="102" y1="132" x2="102" y2="136" stroke="#D97706" strokeWidth="2" />
            </G>

            {/* Paws & Legs */}
            <Rect x="62" y="118" width="12" height="18" rx="6" fill={cloudFill} stroke={cloudStroke} strokeWidth="3.5" />
            <Rect x="86" y="118" width="12" height="18" rx="6" fill={cloudFill} stroke={cloudStroke} strokeWidth="3.5" />

            {/* Mood Accessories */}
            {mood === 'hugging' && (
              <G>
                <Path
                  d="M 80 102 C 72 90, 60 96, 66 108 C 72 120, 80 126, 80 126 C 80 126, 88 120, 94 108 C 100 96, 88 90, 80 102 Z"
                  fill="#F26E6E"
                  stroke="#E11D48"
                  strokeWidth="2"
                />
                <Circle cx="73" cy="98" r="1.5" fill="#FFFFFF" opacity={0.7} />
              </G>
            )}

            {mood === 'rubbing' && (
              <G>
                <Circle cx="80" cy="105" r="7" fill="#FDE047" opacity={0.9} />
                <Path d="M 80 94 L 80 116 M 69 105 L 91 105" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
              </G>
            )}

            {mood === 'listening' && (
              <G>
                <Path
                  d="M 32 70 C 32 26, 128 26, 128 70"
                  stroke="#00C4B3"
                  strokeWidth="5.5"
                  fill="none"
                  strokeLinecap="round"
                />
                <Rect x="24" y="60" width="14" height="24" rx="7" fill="#00C4B3" stroke="#004D40" strokeWidth="1.5" />
                <Rect x="122" y="60" width="14" height="24" rx="7" fill="#00C4B3" stroke="#004D40" strokeWidth="1.5" />
                <Path d="M 136 50 Q 140 45 144 50 L 144 42" stroke="#00C4B3" strokeWidth="2" fill="none" />
              </G>
            )}

            {mood === 'drinking' && (
              <G>
                <Path d="M 72 88 L 76 70" stroke="#F26E6E" strokeWidth="3" strokeLinecap="round" />
                <Polygon points="68,90 92,90 88,114 72,114" fill="#00C4B3" stroke="#004D40" strokeWidth="1.8" />
                <Rect x="66" y="88" width="28" height="4" rx="2" fill="#FFFFFF" stroke="#004D40" strokeWidth="1.5" />
                <Circle cx="80" cy="102" r="3" fill="#E6F9F7" opacity={0.6} />
              </G>
            )}

            {mood === 'shaking' && (
              <G stroke="#FA8C3D" strokeWidth="2.5" strokeLinecap="round">
                <Line x1="30" y1="88" x2="22" y2="82" />
                <Line x1="28" y1="98" x2="18" y2="98" />
                <Line x1="130" y1="88" x2="138" y2="82" />
                <Line x1="132" y1="98" x2="142" y2="98" />
              </G>
            )}

            {mood === 'sleepy' && (
              <G>
                <Path d="M 52 45 Q 70 12 110 30 Q 100 50 68 46 Z" fill="#62A0E9" stroke="#1F77DF" strokeWidth="2" />
                <Circle cx="112" cy="30" r="5" fill="#FFFFFF" stroke="#62A0E9" strokeWidth="1.5" />
                <SvgText x="122" y="44" fill="#62A0E9" fontSize="12" fontWeight="bold">zZ</SvgText>
              </G>
            )}

            {/* Paws */}
            <Ellipse cx="44" cy="95" rx="7.5" ry="6.5" fill={cloudFill} stroke={cloudStroke} strokeWidth="3" />
            <Ellipse cx="116" cy="95" rx="7.5" ry="6.5" fill={cloudFill} stroke={cloudStroke} strokeWidth="3" />
          </G>

          {/* SUNNY buddy */}
          {showSunny && (
            <G>
              <Circle cx="128" cy="46" r="15" fill="#FDE047" stroke="#F59E0B" strokeWidth="2" />
              <Circle cx="123" cy="44" r="1.8" fill="#78350F" />
              <Circle cx="133" cy="44" r="1.8" fill="#78350F" />
              <Path d="M 125 49 Q 128 53 131 49" stroke="#78350F" strokeWidth="1.5" strokeLinecap="round" fill="none" />
              <Circle cx="120" cy="47" r="1.8" fill="#F87171" opacity={0.7} />
              <Circle cx="136" cy="47" r="1.8" fill="#F87171" opacity={0.7} />
            </G>
          )}
        </Svg>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  heartBanner: {
    position: 'absolute',
    top: -24,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 196, 179, 0.3)',
    elevation: 3,
    shadowColor: '#00C4B3',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    zIndex: 10,
  },
  heartIcon: {
    marginRight: 4,
    fontSize: 14,
  },
  heartText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#00C4B3',
  },
  bubbleContainer: {
    marginBottom: 8,
    maxWidth: 240,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: 'rgba(0, 196, 179, 0.35)',
    shadowColor: '#00C4B3',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 2,
    alignItems: 'center',
    position: 'relative',
  },
  bubbleText: {
    fontSize: 12,
    color: '#004D40',
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 16,
  },
  bubbleTail: {
    position: 'absolute',
    bottom: -5,
    width: 10,
    height: 10,
    backgroundColor: '#FFFFFF',
    transform: [{ rotate: '45deg' }],
    borderRightWidth: 1.5,
    borderBottomWidth: 1.5,
    borderColor: 'rgba(0, 196, 179, 0.35)',
  },
});
