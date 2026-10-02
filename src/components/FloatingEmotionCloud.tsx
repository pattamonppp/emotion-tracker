import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  PanResponder,
  Animated,
  Easing,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { EmotionTag } from '../types';
import { audioService } from '../services/audioService';
import {
  Check,
  Activity,
  HelpCircle,
  Anchor,
  Snowflake,
  BatteryLow,
  Sparkles,
  ArrowDown,
} from 'lucide-react-native';
import { colors, radii, shadows, typography } from '../design-system/tokens';

export const getEmotionIcon = (tagId: string, color: string, size = 18) => {
  switch (tagId) {
    case 'shaking':
      return <Activity size={size} color={color} strokeWidth={2.4} />;
    case 'forgetting':
      return <HelpCircle size={size} color={color} strokeWidth={2.4} />;
    case 'pressure':
      return <Anchor size={size} color={color} strokeWidth={2.4} />;
    case 'freeze':
      return <Snowflake size={size} color={color} strokeWidth={2.4} />;
    case 'burnout':
      return <BatteryLow size={size} color={color} strokeWidth={2.4} />;
    default:
      return <Sparkles size={size} color={color} strokeWidth={2.4} />;
  }
};

interface FloatingEmotionCloudProps {
  tag: EmotionTag;
  index: number;
  isSelected: boolean;
  onToggle: (id: EmotionTag['id']) => void;
  onDropIntoJar?: (id: EmotionTag['id']) => void;
  lang: 'th' | 'en';
}

export const FloatingEmotionCloud: React.FC<FloatingEmotionCloudProps> = ({
  tag,
  index,
  isSelected,
  onToggle,
  onDropIntoJar,
  lang,
}) => {
  // Floating harmonic animations (animate-cloud-1 to 4)
  const floatAnim = useRef(new Animated.Value(0)).current;
  const panAnim = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;
  const isDragging = useRef(false);

  // Configure unique floating physics per cloud index
  useEffect(() => {
    const configs = [
      { duration: 2500, amplitude: -6, delay: 0 },
      { duration: 3200, amplitude: -9, delay: 250 },
      { duration: 2700, amplitude: -7, delay: 500 },
      { duration: 3600, amplitude: -10, delay: 150 },
      { duration: 2900, amplitude: -8, delay: 350 },
    ];
    const cfg = configs[index % configs.length];

    const timer = setTimeout(() => {
      const floatLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(floatAnim, {
            toValue: cfg.amplitude,
            duration: cfg.duration,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(floatAnim, {
            toValue: 0,
            duration: cfg.duration,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ])
      );
      floatLoop.start();
    }, cfg.delay);

    return () => clearTimeout(timer);
  }, [floatAnim, index]);

  const handleFlyIntoJar = () => {
    audioService.triggerHaptic('success');
    audioService.playJarDrop();

    Animated.parallel([
      Animated.timing(panAnim.y, {
        toValue: 240,
        duration: 360,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.25,
        duration: 360,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 360,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (onDropIntoJar) {
        onDropIntoJar(tag.id);
      } else {
        onToggle(tag.id);
      }
      // Reset position
      panAnim.setValue({ x: 0, y: 0 });
      scaleAnim.setValue(1);
      opacityAnim.setValue(1);
    });
  };

  // PanResponder for drag-and-drop into jar
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_evt, gestureState) => {
        return Math.abs(gestureState.dx) > 4 || Math.abs(gestureState.dy) > 4;
      },
      onPanResponderGrant: () => {
        isDragging.current = true;
        audioService.triggerHaptic('light');
        Animated.spring(scaleAnim, {
          toValue: 1.08,
          friction: 4,
          tension: 180,
          useNativeDriver: true,
        }).start();
      },
      onPanResponderMove: (_evt, gestureState) => {
        panAnim.setValue({ x: gestureState.dx, y: gestureState.dy });
      },
      onPanResponderRelease: (_evt, gestureState) => {
        isDragging.current = false;
        // If dragged DOWNWARD towards the apothecary jar below
        if (gestureState.dy > 45) {
          handleFlyIntoJar();
        } else {
          // If released without dragging far: treat as tap or spring back
          if (Math.abs(gestureState.dx) < 8 && Math.abs(gestureState.dy) < 8) {
            handleTap();
          } else {
            Animated.parallel([
              Animated.spring(panAnim, {
                toValue: { x: 0, y: 0 },
                friction: 5,
                tension: 160,
                useNativeDriver: true,
              }),
              Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 4,
                tension: 160,
                useNativeDriver: true,
              }),
            ]).start();
          }
        }
      },
    })
  ).current;

  const handleTap = () => {
    audioService.triggerHaptic('medium');
    // Squish effect on tap
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.94,
        duration: 70,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 180,
        useNativeDriver: true,
      }),
    ]).start();

    if (!isSelected) {
      handleFlyIntoJar();
    } else {
      onToggle(tag.id);
    }
  };

  return (
    <Animated.View
      style={[
        styles.cloudWrapper,
        {
          transform: [
            { translateX: panAnim.x },
            { translateY: Animated.add(panAnim.y, floatAnim) },
            { scale: scaleAnim },
          ],
          opacity: opacityAnim,
        },
      ]}
      {...panResponder.panHandlers}
    >
      {/* Fluffy Cloud Silhouette Scalloped Bumps */}
      <View style={styles.cloudScallopsTop} pointerEvents="none">
        {/* Left Scalloped Puff */}
        <View
          style={[
            styles.scallopPuffLeft,
            { backgroundColor: isSelected ? '#FFFFFF' : '#FFFDF9' },
          ]}
        />
        {/* Center High Scalloped Puff */}
        <View
          style={[
            styles.scallopPuffCenter,
            { backgroundColor: isSelected ? '#FFFFFF' : '#FFFDF9' },
          ]}
        />
        {/* Right Scalloped Puff */}
        <View
          style={[
            styles.scallopPuffRight,
            { backgroundColor: isSelected ? '#FFFFFF' : '#FFFDF9' },
          ]}
        />
      </View>

      {/* Main Fluffy Cloud Body */}
      <LinearGradient
        colors={
          isSelected
            ? ['#FFFFFF', '#F0FDFA', '#CCFBF1']
            : ['#FFFFFF', '#FFFDF9', '#F8FAFC']
        }
        style={[
          styles.cloudBody,
          {
            borderColor: isSelected ? tag.color : '#E2E8F0',
            borderBottomColor: isSelected ? tag.color : '#CBD5E1',
          },
        ]}
      >
        {/* Left Icon Bubble (NO EMOJI - ALWAYS PURE ICONS) */}
        <View
          style={[
            styles.emojiBubble,
            {
              backgroundColor: tag.color + '1A',
              borderColor: isSelected ? tag.color : 'rgba(0, 0, 0, 0.06)',
            },
          ]}
        >
          {getEmotionIcon(tag.id, tag.color, 20)}
        </View>

        {/* Emotion Details */}
        <View style={styles.textColumn}>
          <Text
            style={[
              styles.cloudTitle,
              { color: isSelected ? colors.primaryDark : colors.textPrimary },
            ]}
          >
            {lang === 'th' ? tag.labelTh : tag.labelEn}
          </Text>
          <Text style={styles.cloudSub}>{tag.weightDescription}</Text>
        </View>

        {/* Drag Hint & Check Indicator */}
        <View style={styles.actionCol}>
          {isSelected ? (
            <View style={[styles.checkBadge, { backgroundColor: tag.color }]}>
              <Check size={12} color="#FFFFFF" strokeWidth={3} />
            </View>
          ) : (
            <View style={styles.dragIndicator}>
              <ArrowDown size={10} color={colors.primaryDark} strokeWidth={2.4} />
              <Text style={styles.dragText}>
                {lang === 'th' ? 'ลากลงโหล' : 'Drag down'}
              </Text>
            </View>
          )}
        </View>
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cloudWrapper: {
    width: '100%',
    marginVertical: 5,
    position: 'relative',
    shadowColor: '#00C4B3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cloudScallopsTop: {
    position: 'absolute',
    top: -10,
    left: 24,
    right: 24,
    height: 24,
    flexDirection: 'row',
    zIndex: 1,
  },
  scallopPuffLeft: {
    position: 'absolute',
    left: 20,
    top: 4,
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    borderBottomWidth: 0,
    borderColor: '#E2E8F0',
  },
  scallopPuffCenter: {
    position: 'absolute',
    left: 44,
    top: -2,
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderBottomWidth: 0,
    borderColor: '#E2E8F0',
  },
  scallopPuffRight: {
    position: 'absolute',
    left: 80,
    top: 6,
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    borderBottomWidth: 0,
    borderColor: '#E2E8F0',
  },
  cloudBody: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 26,
    borderWidth: 1.5,
    borderBottomWidth: 3.5,
    gap: 12,
    zIndex: 2,
  },
  emojiBubble: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  emojiText: {
    fontSize: 22,
  },
  textColumn: {
    flex: 1,
  },
  cloudTitle: {
    fontFamily: typography.fontPromptBold,
    fontSize: 13,
    marginBottom: 2,
  },
  cloudSub: {
    fontFamily: typography.fontPromptRegular,
    fontSize: 10,
    color: colors.textMuted,
  },
  actionCol: {
    alignItems: 'flex-end',
  },
  checkBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dragIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 7,
    paddingVertical: 3.5,
    borderRadius: radii.full,
    gap: 3,
  },
  dragText: {
    fontFamily: typography.fontPromptBold,
    fontSize: 8.5,
    color: colors.primaryDark,
  },
});
