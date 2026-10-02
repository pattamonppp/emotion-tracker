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
  CircleDashed,
  HelpCircle,
  Anchor,
  Snowflake,
  BatteryLow,
  Wind,
  Brain,
  CloudRain,
  Shuffle,
  Sparkles,
  ArrowDown,
  PenLine,
  Plus,
} from 'lucide-react-native';
import { colors, radii, shadows, typography } from '../design-system/tokens';

export const getEmotionIcon = (tagId: string, color: string, size = 18) => {
  switch (tagId) {
    case 'shaking':
      return <Activity size={size} color={color} strokeWidth={2.4} />;
    case 'forgetting':
      return <CircleDashed size={size} color={color} strokeWidth={2.4} />;
    case 'pressure':
      return <Anchor size={size} color={color} strokeWidth={2.4} />;
    case 'freeze':
      return <Snowflake size={size} color={color} strokeWidth={2.4} />;
    case 'burnout':
      return <BatteryLow size={size} color={color} strokeWidth={2.4} />;
    case 'anxious':
      return <Wind size={size} color={color} strokeWidth={2.4} />;
    case 'overthinking':
      return <Brain size={size} color={color} strokeWidth={2.4} />;
    case 'lonely':
      return <CloudRain size={size} color={color} strokeWidth={2.4} />;
    case 'confused':
      return <Shuffle size={size} color={color} strokeWidth={2.4} />;
    case 'custom':
      return <PenLine size={size} color={color} strokeWidth={2.4} />;
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
  isJarFull?: boolean;
  customText?: string;
  onEditCustom?: () => void;
  isAddButton?: boolean;
}

export const FloatingEmotionCloud: React.FC<FloatingEmotionCloudProps> = ({
  tag,
  index,
  isSelected,
  onToggle,
  onDropIntoJar,
  lang,
  isJarFull = false,
  customText,
  onEditCustom,
  isAddButton = false,
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
      { duration: 2800, amplitude: -4.5, delay: 0 },
      { duration: 3400, amplitude: -6, delay: 250 },
      { duration: 2900, amplitude: -5, delay: 500 },
      { duration: 3800, amplitude: -6.5, delay: 150 },
      { duration: 3100, amplitude: -5, delay: 350 },
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

  // If this is the "+ บอก Mooca..." button: pure TouchableOpacity with NO pan interference!
  if (isAddButton) {
    return (
      <Animated.View
        style={[
          styles.cloudWrapper,
          { transform: [{ translateY: floatAnim }] },
        ]}
      >
        <TouchableOpacity
          onPress={() => {
            audioService.triggerHaptic('selection');
            if (onEditCustom) onEditCustom();
          }}
          activeOpacity={0.75}
        >
          {/* Mini Fluffy Scalloped Cloud Bumps on Top */}
          <View style={styles.cloudScallopsTop} pointerEvents="none">
            <View style={[styles.scallopPuffLeft, { backgroundColor: '#FFF5F8', borderColor: '#F472B6' }]} />
            <View style={[styles.scallopPuffCenter, { backgroundColor: '#FFF5F8', borderColor: '#F472B6' }]} />
            <View style={[styles.scallopPuffRight, { backgroundColor: '#FFF5F8', borderColor: '#F472B6' }]} />
          </View>

          {/* Add Message Cloud Body with sweet dashed border */}
          <LinearGradient
            colors={['#FFFFFF', '#FDF2F8', '#FCE7F3']}
            style={[styles.cloudBody, styles.addCloudBody]}
          >
            <View style={[styles.iconBubble, { backgroundColor: '#EC489920' }]}>
              <Plus size={11} color="#EC4899" strokeWidth={2.8} />
            </View>
            <Text style={[styles.cloudTitle, { color: '#BE185D' }]} numberOfLines={1}>
              {lang === 'th' ? '+ บอก Mooca' : '+ Note to Mooca'}
            </Text>
            <View style={[styles.downArrowPill, { backgroundColor: '#EC489914' }]}>
              <PenLine size={8} color="#EC4899" strokeWidth={2.4} />
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  const handleFlyIntoJar = () => {
    audioService.triggerHaptic('success');
    audioService.playJarDrop();

    Animated.parallel([
      Animated.timing(panAnim.y, {
        toValue: 180,
        duration: 280,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.25,
        duration: 280,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 280,
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
        return Math.abs(gestureState.dx) > 3 || Math.abs(gestureState.dy) > 3;
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
        } else if (Math.abs(gestureState.dx) < 22 && Math.abs(gestureState.dy) < 22) {
          // Generous tap threshold for reliable fingertip detection
          handleTap();
        } else {
          // Snap back smoothly
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
      },
    })
  ).current;

  const handleTap = () => {
    audioService.triggerHaptic('medium');
    // Squish effect on tap
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.92,
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
          opacity: isJarFull && !isSelected ? 0.62 : opacityAnim,
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
            : tag.id === 'custom'
            ? ['#FFFFFF', '#FDF2F8', '#FCE7F3']
            : ['#FFFFFF', '#FFFDF9', '#F8FAFC']
        }
        style={[
          styles.cloudBody,
          {
            borderColor: isSelected ? tag.color : tag.id === 'custom' ? 'rgba(236, 72, 153, 0.4)' : 'rgba(0, 0, 0, 0.08)',
            borderBottomColor: isSelected ? tag.color : tag.id === 'custom' ? '#F472B6' : '#CBD5E1',
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
          {getEmotionIcon(tag.id, tag.color, 11)}
        </View>

        {/* Short Punchy Emotion Word (No Description) */}
        <Text
          style={[
            styles.cloudTitle,
            { color: isSelected ? colors.primaryDark : colors.textPrimary },
          ]}
          numberOfLines={1}
        >
          {tag.id === 'custom' && customText
            ? customText
            : lang === 'th' ? tag.labelTh : tag.labelEn}
        </Text>

        {/* Action Status: Checked Badge if in jar, or Edit Pen / Down Arrow */}
        {isSelected ? (
          <View style={[styles.checkBadge, { backgroundColor: tag.color }]}>
            <Check size={8} color="#FFFFFF" strokeWidth={3} />
          </View>
        ) : onEditCustom ? (
          <TouchableOpacity
            hitSlop={{ top: 8, bottom: 8, left: 6, right: 8 }}
            onPress={() => {
              audioService.triggerHaptic('selection');
              onEditCustom();
            }}
            style={[styles.downArrowPill, { backgroundColor: tag.color + '1A' }]}
          >
            <PenLine size={8} color={tag.color} strokeWidth={2.4} />
          </TouchableOpacity>
        ) : (
          <View style={styles.downArrowPill}>
            <ArrowDown size={8.5} color={tag.color} strokeWidth={2.4} />
          </View>
        )}
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cloudWrapper: {
    marginVertical: 1.5,
    marginHorizontal: 2,
    position: 'relative',
    shadowColor: '#00C4B3',
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  cloudScallopsTop: {
    position: 'absolute',
    top: -4,
    left: 6,
    right: 6,
    height: 8,
    flexDirection: 'row',
    zIndex: 1,
  },
  scallopPuffLeft: {
    position: 'absolute',
    left: 3,
    top: 1,
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderBottomWidth: 0,
  },
  scallopPuffCenter: {
    position: 'absolute',
    left: 11,
    top: -2.5,
    width: 13,
    height: 13,
    borderRadius: 6.5,
    borderWidth: 1,
    borderBottomWidth: 0,
  },
  scallopPuffRight: {
    position: 'absolute',
    left: 21,
    top: 1.5,
    width: 9,
    height: 9,
    borderRadius: 4.5,
    borderWidth: 1,
    borderBottomWidth: 0,
  },
  cloudBody: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 3.5,
    paddingHorizontal: 6.5,
    borderRadius: radii.full,
    borderWidth: 1.1,
    borderBottomWidth: 2,
    gap: 3.5,
    zIndex: 2,
    backgroundColor: '#FFFFFF',
  },
  iconBubble: {
    width: 17,
    height: 17,
    borderRadius: 8.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cloudTitle: {
    fontFamily: typography.fontPromptSemiBold,
    fontSize: 9.8,
  },
  checkBadge: {
    width: 13,
    height: 13,
    borderRadius: 6.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  downArrowPill: {
    width: 13,
    height: 13,
    borderRadius: 6.5,
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addCloudBody: {
    borderStyle: 'dashed',
    borderColor: '#F472B6',
    borderBottomColor: '#EC4899',
    backgroundColor: '#FFF5F8',
  },
});
