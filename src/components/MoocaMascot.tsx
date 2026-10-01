import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  Animated,
  Easing,
} from 'react-native';
import Svg, {
  Path,
  Circle,
  Ellipse,
  Rect,
  Line,
  G,
  Defs,
  LinearGradient,
  Stop,
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

const SWEET_MESSAGES = [
  'งื้อออ รักเธอนะ! ✨',
  'Mooca กอดแน่นๆ! 💕',
  'คนเก่งของ Mooca เก่งมากแล้วนะ 💖',
  'อยู่ข้างๆ เสมอนะ ไม่ทิ้งไปไหนหรอก 🌟',
  'สูดหายใจเข้าลึกๆ น้า มี Mooca ตรงนี้ 🍃',
  'เก่งที่สุดเลยยย พักใจแป๊บเดียวนะคะ 🧸',
];

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
  const [petMessage, setPetMessage] = useState<string | null>(null);

  // Animations
  const wiggleAnim = useRef(new Animated.Value(0)).current;
  const bounceAnim = useRef(new Animated.Value(1)).current;
  const sunnySpinAnim = useRef(new Animated.Value(0)).current;
  const heartFloatAnim = useRef(new Animated.Value(0)).current;
  const heartOpacityAnim = useRef(new Animated.Value(0)).current;

  // Sunny continuous cheerful rotation
  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(sunnySpinAnim, {
        toValue: 1,
        duration: 9000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    loop.start();
    return () => loop.stop();
  }, [sunnySpinAnim]);

  const getDimensions = () => {
    switch (size) {
      case 'xs': return { width: 54, height: 54 };
      case 'sm': return { width: 84, height: 84 };
      case 'lg': return { width: 154, height: 154 };
      case 'xl': return { width: 196, height: 196 };
      case 'md':
      default: return { width: 116, height: 116 };
    }
  };

  const { width, height } = getDimensions();

  const handlePetting = () => {
    if (!interactive) return;

    audioService.triggerHaptic('selection');
    setIsBlushing(true);

    // Pick a sweet random message
    const msg = SWEET_MESSAGES[Math.floor(Math.random() * SWEET_MESSAGES.length)];
    setPetMessage(msg);

    // Wiggle and squish animation
    Animated.sequence([
      Animated.parallel([
        Animated.timing(bounceAnim, {
          toValue: 0.92,
          duration: 90,
          useNativeDriver: true,
        }),
        Animated.timing(wiggleAnim, {
          toValue: -8,
          duration: 90,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.spring(bounceAnim, {
          toValue: 1.08,
          friction: 3,
          tension: 180,
          useNativeDriver: true,
        }),
        Animated.timing(wiggleAnim, {
          toValue: 8,
          duration: 100,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.spring(bounceAnim, {
          toValue: 1,
          friction: 4,
          tension: 160,
          useNativeDriver: true,
        }),
        Animated.spring(wiggleAnim, {
          toValue: 0,
          friction: 4,
          tension: 160,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Hearts floating up
    heartFloatAnim.setValue(0);
    heartOpacityAnim.setValue(1);
    Animated.parallel([
      Animated.timing(heartFloatAnim, {
        toValue: -32,
        duration: 950,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(heartOpacityAnim, {
        toValue: 0,
        duration: 950,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    if (onHug) onHug();

    setTimeout(() => {
      setIsBlushing(false);
      setPetMessage(null);
    }, 2800);
  };

  const sunnySpinInterpolation = sunnySpinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const wiggleInterpolation = wiggleAnim.interpolate({
    inputRange: [-8, 8],
    outputRange: ['-6deg', '6deg'],
  });

  const displayMessage = petMessage || speakingBubble;

  return (
    <View style={[styles.container, style]}>
      {/* Floating Hearts Animation upon Petting */}
      <Animated.View
        style={[
          styles.floatingHeartsContainer,
          {
            opacity: heartOpacityAnim,
            transform: [{ translateY: heartFloatAnim }],
          },
        ]}
        pointerEvents="none"
      >
        <Text style={styles.floatingHeartEmoji}>💕 ✨ 💖</Text>
      </Animated.View>

      {/* Sweet Cozy Speech Bubble */}
      {displayMessage ? (
        <View style={styles.bubbleContainer}>
          <Text style={styles.bubbleText}>{displayMessage}</Text>
          <View style={styles.bubbleTail} />
        </View>
      ) : null}

      {/* Interactive Mooca Mascot Container */}
      <TouchableOpacity
        activeOpacity={0.92}
        onPress={handlePetting}
        disabled={!interactive}
        style={{ width, height, alignItems: 'center', justifyContent: 'center' }}
      >
        <Animated.View
          style={{
            transform: [
              { scale: bounceAnim },
              { rotate: wiggleInterpolation },
            ],
          }}
        >
          <Svg width={width} height={height} viewBox="0 0 160 160">
            <Defs>
              <LinearGradient id="moocaRainbowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <Stop offset="0%" stopColor="#F26E6E" />
                <Stop offset="30%" stopColor="#FA8C3D" />
                <Stop offset="65%" stopColor="#7CC954" />
                <Stop offset="85%" stopColor="#00C4B3" />
                <Stop offset="100%" stopColor="#62A0E9" />
              </LinearGradient>
              <LinearGradient id="sunnyRayGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor="#FFD54F" />
                <Stop offset="100%" stopColor="#FFA726" />
              </LinearGradient>
            </Defs>

            {/* Soft Warm Halo underneath */}
            <Ellipse cx="80" cy="148" rx="44" ry="7" fill="rgba(0, 196, 179, 0.18)" />

            {/* Rainbow behind Mooca if celebrating */}
            {mood === 'celebrating' && (
              <Path
                d="M 28 72 A 52 52 0 0 1 132 72"
                stroke="url(#moocaRainbowGrad)"
                strokeWidth="8"
                fill="none"
                opacity={0.88}
                strokeLinecap="round"
              />
            )}

            {/* Cozy Warm Glow */}
            <Circle cx="80" cy="80" r="56" fill="rgba(230, 249, 247, 0.65)" />

            {/* Fluffy Cloud Body with Soft 3D Touch */}
            <Path
              d="M 44 112 C 20 112, 12 88, 24 70 C 16 46, 42 32, 60 40 C 70 20, 94 20, 104 40 C 122 32, 148 46, 140 70 C 152 88, 142 112, 118 112 Z"
              fill={mood === 'sad' ? '#E2E8F0' : '#FFFFFF'}
              stroke={mood === 'sad' ? '#94A3B8' : '#BEECE6'}
              strokeWidth="3.5"
              strokeLinejoin="round"
            />

            {/* Rosy Cheeks with Cute Heart Highlights */}
            <Circle
              cx="54"
              cy="83"
              r={isBlushing ? 8 : 6.5}
              fill="#FF8BA7"
              opacity={isBlushing ? 0.95 : 0.68}
            />
            {/* Left Cheek Heart Sparkle */}
            <Path
              d="M 54 81 C 52 79, 50 81, 52 83 L 54 85 L 56 83 C 58 81, 56 79, 54 81 Z"
              fill="#FFFFFF"
              opacity={0.9}
            />

            <Circle
              cx="106"
              cy="83"
              r={isBlushing ? 8 : 6.5}
              fill="#FF8BA7"
              opacity={isBlushing ? 0.95 : 0.68}
            />
            {/* Right Cheek Heart Sparkle */}
            <Path
              d="M 106 81 C 104 79, 102 81, 104 83 L 106 85 L 108 83 C 110 81, 108 79, 106 81 Z"
              fill="#FFFFFF"
              opacity={0.9}
            />

            {/* Sparkling Starry Anime Eyes */}
            {mood === 'praying' || mood === 'rubbing' || mood === 'comforting' ? (
              <G stroke="#004D40" strokeWidth="3.2" strokeLinecap="round" fill="none">
                <Path d="M 48 76 Q 58 67 68 76" />
                <Path d="M 92 76 Q 102 67 112 76" />
              </G>
            ) : mood === 'sleepy' ? (
              <G stroke="#004D40" strokeWidth="2.8" strokeLinecap="round" fill="none">
                <Path d="M 50 78 Q 58 83 66 78" />
                <Path d="M 94 78 Q 102 83 110 78" />
              </G>
            ) : mood === 'sad' ? (
              <G>
                <Circle cx="58" cy="74" r="3.8" fill="#334155" />
                <Circle cx="102" cy="74" r="3.8" fill="#334155" />
                <Path d="M 64 82 Q 62 89 65 92 Q 68 89 66 82 Z" fill="#60A5FA" />
              </G>
            ) : (
              <G>
                {/* Big Sparkling Pupils */}
                <Circle cx="58" cy="74" r="5" fill="#004D40" />
                <Circle cx="102" cy="74" r="5" fill="#004D40" />
                {/* Primary Reflection Sparkle */}
                <Circle cx="56.5" cy="72" r="2.2" fill="#FFFFFF" />
                <Circle cx="100.5" cy="72" r="2.2" fill="#FFFFFF" />
                {/* Secondary Star Twinkle */}
                <Circle cx="60" cy="76" r="1.1" fill="#FFFFFF" />
                <Circle cx="104" cy="76" r="1.1" fill="#FFFFFF" />
              </G>
            )}

            {/* Cute Happy Mouth */}
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
            ) : mood === 'celebrating' || mood === 'happy' || isBlushing ? (
              <G>
                <Path
                  d="M 72 81 Q 80 94 88 81 Z"
                  fill="#FF8080"
                  stroke="#004D40"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                />
              </G>
            ) : (
              <Path
                d="M 73 81 Q 80 89 87 81"
                stroke="#004D40"
                strokeWidth="2.8"
                strokeLinecap="round"
                fill="none"
              />
            )}

            {/* Warm Knitted Orange Scarf with Texture */}
            <G>
              <Rect
                x="44"
                y="97"
                width="72"
                height="16"
                rx="8"
                fill="#FA8C3D"
                stroke="#D97706"
                strokeWidth="1.8"
              />
              {/* Cozy Knit Stitches */}
              <Line x1="56" y1="97" x2="56" y2="113" stroke="#FFF0E6" strokeWidth="2" strokeDasharray="3,2" />
              <Line x1="68" y1="97" x2="68" y2="113" stroke="#FFF0E6" strokeWidth="2" strokeDasharray="3,2" />
              <Line x1="80" y1="97" x2="80" y2="113" stroke="#FFF0E6" strokeWidth="2" strokeDasharray="3,2" />
              <Line x1="92" y1="97" x2="92" y2="113" stroke="#FFF0E6" strokeWidth="2" strokeDasharray="3,2" />
              <Line x1="104" y1="97" x2="104" y2="113" stroke="#FFF0E6" strokeWidth="2" strokeDasharray="3,2" />

              {/* Draped Scarf Tail with Soft Fringe */}
              <Rect
                x="90"
                y="107"
                width="16"
                height="22"
                rx="6"
                fill="#FA8C3D"
                stroke="#D97706"
                strokeWidth="1.8"
              />
              <Line x1="94" y1="125" x2="94" y2="130" stroke="#D97706" strokeWidth="2" strokeLinecap="round" />
              <Line x1="98" y1="125" x2="98" y2="130" stroke="#D97706" strokeWidth="2" strokeLinecap="round" />
              <Line x1="102" y1="125" x2="102" y2="130" stroke="#D97706" strokeWidth="2" strokeLinecap="round" />
            </G>
          </Svg>
        </Animated.View>
      </TouchableOpacity>

      {/* Cheerful Mini Sunshine Companion: Sunny */}
      {showSunny && (
        <Animated.View
          style={[
            styles.sunnyContainer,
            {
              transform: [{ rotate: sunnySpinInterpolation }],
            },
          ]}
        >
          <Svg width={30} height={30} viewBox="0 0 36 36">
            {/* Spinning Rays */}
            <G stroke="#FFA726" strokeWidth="2.5" strokeLinecap="round">
              <Line x1="18" y1="2" x2="18" y2="7" />
              <Line x1="18" y1="29" x2="18" y2="34" />
              <Line x1="2" y1="18" x2="7" y2="18" />
              <Line x1="29" y1="18" x2="34" y2="18" />
              <Line x1="6.7" y1="6.7" x2="10.2" y2="10.2" />
              <Line x1="25.8" y1="25.8" x2="29.3" y2="29.3" />
              <Line x1="6.7" y1="29.3" x2="10.2" y2="25.8" />
              <Line x1="25.8" y1="10.2" x2="29.3" y2="6.7" />
            </G>
            {/* Sunny Smiling Face Body */}
            <Circle cx="18" cy="18" r="9" fill="#FFCA28" stroke="#F57C00" strokeWidth="1.2" />
            <Circle cx="15.5" cy="16.5" r="1.2" fill="#4E342E" />
            <Circle cx="20.5" cy="16.5" r="1.2" fill="#4E342E" />
            <Circle cx="13.5" cy="18" r="1.8" fill="#FF8A80" opacity={0.75} />
            <Circle cx="22.5" cy="18" r="1.8" fill="#FF8A80" opacity={0.75} />
            <Path d="M 15.5 19.5 Q 18 22 20.5 19.5" stroke="#4E342E" strokeWidth="1.2" fill="none" strokeLinecap="round" />
          </Svg>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  bubbleContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 6,
    maxWidth: 240,
    borderWidth: 1.5,
    borderColor: '#00C4B3',
    shadowColor: '#004D40',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    alignItems: 'center',
  },
  bubbleText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#004D40',
    textAlign: 'center',
    lineHeight: 18,
  },
  bubbleTail: {
    position: 'absolute',
    bottom: -7,
    width: 0,
    height: 0,
    borderLeftWidth: 7,
    borderRightWidth: 7,
    borderTopWidth: 7,
    borderStyle: 'solid',
    backgroundColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#00C4B3',
  },
  floatingHeartsContainer: {
    position: 'absolute',
    top: -10,
    zIndex: 99,
  },
  floatingHeartEmoji: {
    fontSize: 16,
    fontWeight: '800',
  },
  sunnyContainer: {
    position: 'absolute',
    top: 2,
    right: 8,
    zIndex: 10,
  },
});
