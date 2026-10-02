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
      {/* Mini Fluffy Scalloped Cloud Bumps on Top */}
      <View style={styles.cloudScallopsTop} pointerEvents="none">
        <View
          style={[
            styles.scallopPuffLeft,
            {
              backgroundColor: isSelected ? '#F0FDFA' : '#FFFFFF',
              borderColor: isSelected ? tag.color : '#E2E8F0',
            },
          ]}
        />
        <View
          style={[
            styles.scallopPuffCenter,
            {
              backgroundColor: isSelected ? '#F0FDFA' : '#FFFFFF',
              borderColor: isSelected ? tag.color : '#E2E8F0',
            },
          ]}
        />
        <View
          style={[
            styles.scallopPuffRight,
            {
              backgroundColor: isSelected ? '#F0FDFA' : '#FFFFFF',
              borderColor: isSelected ? tag.color : '#E2E8F0',
            },
          ]}
        />
      </View>

      {/* Compact Fluffy Cloud Body */}
      <LinearGradient
        colors={
          isSelected
            ? ['#FFFFFF', '#F0FDFA', '#CCFBF1']
            : ['#FFFFFF', '#FFFDF9', '#F8FAFC']
        }
        style={[
          styles.cloudBody,
          {
            borderColor: isSelected ? tag.color : 'rgba(0, 0, 0, 0.08)',
            borderBottomColor: isSelected ? tag.color : '#CBD5E1',
          },
        ]}
      >
        {/* Left Icon Bubble */}
        <View
          style={[
            styles.iconBubble,
            {
              backgroundColor: tag.color + '1A',
            },
          ]}
        >
          {getEmotionIcon(tag.id, tag.color, 15)}
        </View>

        {/* Short Punchy Emotion Word (No Description) */}
        <Text
          style={[
            styles.cloudTitle,
            { color: isSelected ? colors.primaryDark : colors.textPrimary },
          ]}
        >
          {lang === 'th' ? tag.labelTh : tag.labelEn}
        </Text>

        {/* Action Status: Checked Badge if in jar, or Down Arrow if ready to drop */}
        {isSelected ? (
          <View style={[styles.checkBadge, { backgroundColor: tag.color }]}>
            <Check size={10} color="#FFFFFF" strokeWidth={3} />
          </View>
        ) : (
          <View style={styles.downArrowPill}>
            <ArrowDown size={11} color={tag.color} strokeWidth={2.5} />
          </View>
        )}
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cloudWrapper: {
    marginVertical: 4,
    marginHorizontal: 3,
    position: 'relative',
    shadowColor: '#00C4B3',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 5,
    elevation: 3,
  },
  cloudScallopsTop: {
    position: 'absolute',
    top: -8,
    left: 12,
    right: 12,
    height: 16,
    flexDirection: 'row',
    zIndex: 1,
  },
  scallopPuffLeft: {
    position: 'absolute',
    left: 8,
    top: 3,
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.2,
    borderBottomWidth: 0,
  },
  scallopPuffCenter: {
    position: 'absolute',
    left: 22,
    top: -3,
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1.2,
    borderBottomWidth: 0,
  },
  scallopPuffRight: {
    position: 'absolute',
    left: 42,
    top: 4,
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.2,
    borderBottomWidth: 0,
  },
  cloudBody: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: radii.full,
    borderWidth: 1.3,
    borderBottomWidth: 2.8,
    gap: 6,
    zIndex: 2,
    backgroundColor: '#FFFFFF',
  },
  iconBubble: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cloudTitle: {
    fontFamily: typography.fontPromptSemiBold,
    fontSize: 12,
  },
  checkBadge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  downArrowPill: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
