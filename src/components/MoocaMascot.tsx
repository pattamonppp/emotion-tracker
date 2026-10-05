import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  Animated,
  Easing,
  Image,
} from 'react-native';
import { SvgXml } from 'react-native-svg';
import { audioService, HAPTIC_STYLE } from '../services/audioService';
import { Heart, Sparkles } from 'lucide-react-native';
import { typography, colors, radii } from '../design-system/tokens';
import {
  SVG_MOOCA_THANKS_,
  SVG_MOOCA_WALLET__ENOUGH_,
  SVG_MOOCA_WALLET__NOT_ENOUGH_,
  SVG_MOOCA_HUGGING_SUNNY,
  SVG_SAD_MOOCA,
} from '../assets/moocaSvgData';

const MOOCA_HAPPY_PNG = require('../../assets/mooca/Mooca=Happy Mooca with Sunny, Size=L.png');
const MOOCA_PHONE_PNG = require('../../assets/mooca/Mooca=Mooca using phone, Size=L.png');

export const MOOCA_MOOD = {
  HAPPY: 'happy',
  COMFORTING: 'comforting',
  HUGGING: 'hugging',
  PRAYING: 'praying',
  RUBBING: 'rubbing',
  DRINKING: 'drinking',
  SHAKING: 'shaking',
  LISTENING: 'listening',
  CELEBRATING: 'celebrating',
  SLEEPY: 'sleepy',
  SAD: 'sad',
  WALLET_ENOUGH: 'wallet_enough',
  WALLET_NOT_ENOUGH: 'wallet_not_enough',
} as const;

export type MoocaMood = typeof MOOCA_MOOD[keyof typeof MOOCA_MOOD];

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
  'งื้อออ รักเธอนะ!',
  'Mooca กอดแน่น ๆ เลย!',
  'คนเก่งของ Mooca เก่งมากแล้วนะ',
  'อยู่ข้าง ๆ เสมอนะ ไม่ทิ้งไปไหนหรอก',
  'สูดหายใจเข้าลึก ๆ น้า มี Mooca ตรงนี้',
  'เก่งที่สุดเลยยย พักใจแป๊บเดียวนะคะ',
];

type MascotAsset =
  | { type: 'png'; source: any }
  | { type: 'svg'; xml: string };

const getMascotAsset = (mood: MoocaMood): MascotAsset => {
  switch (mood) {
    case MOOCA_MOOD.HUGGING:
    case MOOCA_MOOD.COMFORTING:
    case MOOCA_MOOD.RUBBING:
      return { type: 'svg', xml: SVG_MOOCA_HUGGING_SUNNY };
    case MOOCA_MOOD.PRAYING:
      return { type: 'svg', xml: SVG_MOOCA_THANKS_ };
    case MOOCA_MOOD.SAD:
      return { type: 'svg', xml: SVG_SAD_MOOCA };
    case MOOCA_MOOD.WALLET_ENOUGH:
      return { type: 'svg', xml: SVG_MOOCA_WALLET__ENOUGH_ };
    case MOOCA_MOOD.WALLET_NOT_ENOUGH:
      return { type: 'svg', xml: SVG_MOOCA_WALLET__NOT_ENOUGH_ };
    case MOOCA_MOOD.LISTENING:
    case MOOCA_MOOD.SLEEPY:
      return { type: 'png', source: MOOCA_PHONE_PNG };
    case MOOCA_MOOD.HAPPY:
    case MOOCA_MOOD.CELEBRATING:
    case MOOCA_MOOD.DRINKING:
    case MOOCA_MOOD.SHAKING:
    default:
      return { type: 'png', source: MOOCA_HAPPY_PNG };
  }
};

export const MoocaMascot: React.FC<MoocaMascotProps> = ({
  mood = 'happy',
  size = 'md',
  showSunny = true,
  speakingBubble,
  interactive = true,
  onHug,
  style,
}) => {
  const [petMessage, setPetMessage] = useState<string | null>(null);

  // Animations
  const wiggleAnim = useRef(new Animated.Value(0)).current;
  const bounceAnim = useRef(new Animated.Value(1)).current;
  const heartFloatAnim = useRef(new Animated.Value(0)).current;
  const heartOpacityAnim = useRef(new Animated.Value(0)).current;

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

    audioService.triggerHaptic(HAPTIC_STYLE.SELECTION);

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
      setPetMessage(null);
    }, 2800);
  };

  const wiggleInterpolation = wiggleAnim.interpolate({
    inputRange: [-8, 8],
    outputRange: ['-6deg', '6deg'],
  });

  const displayMessage = petMessage || speakingBubble;
  const asset = getMascotAsset(mood);

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
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Heart size={16} color="#EC4899" fill="#EC4899" />
          <Sparkles size={18} color="#FDE047" fill="#FDE047" />
          <Heart size={20} color="#F43F5E" fill="#F43F5E" />
        </View>
      </Animated.View>

      {/* Mooca + Bubble — bubble grows upward, Mooca stays at same Y always */}
      <View style={styles.mascotAnchor}>
        {/* Bubble outer positioner: absolute, centered directly above Mooca */}
        <View
          style={[
            styles.bubblePositioner,
            { left: (width - 320) / 2 },
            !displayMessage && styles.bubblePositionerHidden,
          ]}
          pointerEvents="none"
        >
          {displayMessage ? (
            <View style={styles.bubbleContainer}>
              <Text style={styles.bubbleText} textBreakStrategy="balanced">
                {displayMessage}
              </Text>
              <View style={styles.bubbleTail} />
            </View>
          ) : null}
        </View>

        {/* Interactive Mooca Mascot Container */}
        <TouchableOpacity
          activeOpacity={0.92}
          onPress={handlePetting}
          disabled={!interactive}
          style={{ width, height, alignItems: 'center', justifyContent: 'center', position: 'relative' }}
          accessibilityLabel={`Mooca Mascot ${mood}`}
          accessibilityRole="button"
        >
          <Animated.View
            style={{
              width,
              height,
              alignItems: 'center',
              justifyContent: 'center',
              transform: [
                { scale: bounceAnim },
                { rotate: wiggleInterpolation },
              ],
            }}
          >
            {asset.type === 'png' ? (
              <Image
                source={asset.source}
                style={{ width, height }}
                resizeMode="contain"
              />
            ) : (
              <SvgXml
                xml={asset.xml}
                width={width}
                height={height}
              />
            )}
          </Animated.View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  mascotAnchor: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  // Outer: absolute 320px wide positioner, horizontally centered over Mooca
  bubblePositioner: {
    position: 'absolute',
    bottom: '100%',
    width: 320,
    alignItems: 'center',
    marginBottom: 6,
    zIndex: 20,
  },
  bubblePositionerHidden: {
    // No content → collapses to 0 height naturally (no children rendered)
  },
  // Inner: fit-content bubble box with min/max width constraints
  bubbleContainer: {
    backgroundColor: colors.white,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radii.lg,
    minWidth: 100,
    maxWidth: 280,
    borderWidth: 1.2,
    borderColor: colors.primary,
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 2,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  bubbleText: {
    fontFamily: typography.fontPromptBold,
    fontSize: 11.5,
    color: colors.primaryDark,
    textAlign: 'center',
    lineHeight: 18,
  },
  bubbleTail: {
    position: 'absolute',
    bottom: -5,
    width: 0,
    height: 0,
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderTopWidth: 5,
    borderStyle: 'solid',
    backgroundColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: colors.primary,
  },
  floatingHeartsContainer: {
    position: 'absolute',
    top: -10,
    zIndex: 99,
  },
});
