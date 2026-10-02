import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  PanResponder,
  Animated,
  Easing,
  Dimensions,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { audioService } from '../../services/audioService';
import { useSky } from '../DynamicSkyEngine';
import { MoocaMascot } from '../MoocaMascot';
import { MarshmallowButton } from '../../design-system/MarshmallowButton';
import Svg, { Defs, RadialGradient as SvgRadialGradient, Stop, Circle as SvgCircle } from 'react-native-svg';
import { Star, Sun, Hand, Sparkles, HelpCircle, Check, X, ArrowRight } from 'lucide-react-native';
import { typography, radii, shadows, colors } from '../../design-system/tokens';

interface SomaticAbsorptionProps {
  onComplete: () => void;
  lang: 'th' | 'en';
  skyPeriod?: 'dawn' | 'day' | 'sunset' | 'night';
}

const { width: SCREEN_W } = Dimensions.get('window');
const CIRCLE_SIZE = Math.min(SCREEN_W * 0.72, 268);

export const SomaticAbsorption: React.FC<SomaticAbsorptionProps> = ({
  onComplete,
  lang,
  skyPeriod: propSkyPeriod,
}) => {
  const { activePeriod } = useSky();
  const skyPeriod = propSkyPeriod || activePeriod || 'day';

  const [rubProgress, setRubProgress] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isRubbing, setIsRubbing] = useState(false);
  const [touchCount, setTouchCount] = useState(0);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  // Animations
  const starRotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const completeScaleAnim = useRef(new Animated.Value(1)).current;

  const lastHapticTick = useRef(0);
  const lastPos = useRef({ x: 0, y: 0 });

  // Premium, luminous palettes tailored to each sky period (Sun-like feathered radial auras)
  const getTheme = () => {
    switch (skyPeriod) {
      case 'dawn':
        return {
          glowCore: '#FFFBEB',
          glowMid: '#FDE68A',
          glowOuter: '#FED7AA',
          outerBorder: 'rgba(245, 158, 11, 0.45)',
          middleBorder: 'rgba(251, 191, 36, 0.58)',
          innerBorder: 'rgba(254, 215, 170, 0.5)',
          circleBg: 'rgba(255, 255, 255, 0.78)',
          starColor: 'rgba(245, 158, 11, 0.32)',
          textColor: '#78350F',
          badgeBg: '#FFFBEB',
          badgeBorder: '#FDE68A',
          badgeText: '#B45309',
          badgeIconColor: '#F59E0B',
          progressFill: '#F59E0B',
          progressTrack: 'rgba(245, 158, 11, 0.18)',
          captionColor: '#78350F',
          dots: ['#FBBF24', '#F59E0B', '#34D399', '#FA8C3D'],
        };
      case 'sunset':
        // High-contrast deep berry text, radiant sun-like golden peach bloom, soft rose border
        return {
          glowCore: '#FFFBEB',
          glowMid: '#FDE68A',
          glowOuter: '#FBCFE8',
          outerBorder: 'rgba(251, 146, 60, 0.45)',
          middleBorder: 'rgba(251, 191, 36, 0.65)',
          innerBorder: 'rgba(251, 213, 26, 0.85)',
          circleBg: 'rgba(255, 255, 255, 0.8)',
          starColor: 'rgba(251, 113, 133, 0.25)',
          textColor: '#a81642ff',
          badgeBg: '#fff2f3ff',
          badgeBorder: '#FECDD3',
          badgeText: '#BE123C',
          badgeIconColor: '#F43F5E',
          progressFill: '#E11D48',
          progressTrack: 'rgba(255, 190, 212, 0.45)',
          captionColor: '#ffffffff',
          dots: ['#FB7185', '#FBBF24', '#F43F5E', '#00C4B3'],
        };
      case 'night':
        return {
          glowCore: '#F0F9FF',
          glowMid: '#BAE6FD',
          glowOuter: '#38BDF8',
          outerBorder: 'rgba(56, 189, 248, 0.45)',
          middleBorder: 'rgba(125, 211, 252, 0.62)',
          innerBorder: 'rgba(186, 230, 253, 0.45)',
          circleBg: 'rgba(15, 23, 42, 0.55)',
          starColor: 'rgba(56, 189, 248, 0.38)',
          textColor: '#F8FAFC',
          badgeBg: 'rgba(30, 41, 59, 0.95)',
          badgeBorder: 'rgba(56, 189, 248, 0.48)',
          badgeText: '#E0F2FE',
          badgeIconColor: '#38BDF8',
          progressFill: '#38BDF8',
          progressTrack: 'rgba(56, 189, 248, 0.22)',
          captionColor: '#E0F2FE',
          dots: ['#38BDF8', '#67E8F9', '#00C4B3', '#93C5FD'],
        };
      case 'day':
      default:
        return {
          glowCore: '#F0FDFA',
          glowMid: '#CCFBF1',
          glowOuter: '#E0F2FE',
          outerBorder: 'rgba(0, 196, 179, 0.45)',
          middleBorder: 'rgba(20, 184, 166, 0.58)',
          innerBorder: 'rgba(94, 234, 212, 0.45)',
          circleBg: 'rgba(255, 255, 255, 0.82)',
          starColor: 'rgba(0, 196, 179, 0.32)',
          textColor: '#004D40',
          badgeBg: '#F0FDFB',
          badgeBorder: '#99F6E4',
          badgeText: '#065F46',
          badgeIconColor: '#00C4B3',
          progressFill: '#00C4B3',
          progressTrack: 'rgba(0, 196, 179, 0.18)',
          captionColor: '#064E3B',
          dots: ['#00C4B3', '#10B981', '#FBBF24', '#38BDF8'],
        };
    }
  };

  const theme = getTheme();

  // Gentle star spin
  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(starRotateAnim, {
        toValue: 1,
        duration: 24000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    loop.start();
    return () => loop.stop();
  }, [starRotateAnim]);

  // Subtle breathing pulse when rubbing
  useEffect(() => {
    Animated.timing(pulseAnim, {
      toValue: isRubbing ? 1.03 : 1,
      duration: 220,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [isRubbing, pulseAnim]);

  const advanceProgress = (amount: number) => {
    if (isFinished) return;

    setRubProgress((prev) => {
      const next = Math.min(100, prev + amount);

      Animated.timing(progressAnim, {
        toValue: next / 100,
        duration: 160,
        easing: Easing.out(Easing.quad),
        useNativeDriver: false,
      }).start();

      const now = Date.now();
      if (now - lastHapticTick.current > 140) {
        lastHapticTick.current = now;
        audioService.playFrictionTick(next / 100);
      }

      if (next >= 100 && !isFinished) {
        setIsFinished(true);
        audioService.triggerHaptic('success');
        audioService.playChimeShockwave();
        Animated.sequence([
          Animated.timing(completeScaleAnim, { toValue: 1.12, duration: 240, useNativeDriver: true }),
          Animated.spring(completeScaleAnim, { toValue: 1, friction: 4, useNativeDriver: true }),
        ]).start();
      }

      return next;
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        setIsRubbing(true);
        const touches = evt.nativeEvent.touches ? evt.nativeEvent.touches.length : 1;
        setTouchCount(touches);
        const { locationX, locationY } = evt.nativeEvent;
        lastPos.current = { x: locationX, y: locationY };
        // Strictly require at least 2 fingers to advance progress
        if (touches >= 2) {
          advanceProgress(0.35);
        }
      },
      onPanResponderMove: (evt) => {
        const touches = evt.nativeEvent.touches ? evt.nativeEvent.touches.length : 1;
        setTouchCount(touches);
        const { locationX, locationY } = evt.nativeEvent;
        const dx = locationX - lastPos.current.x;
        const dy = locationY - lastPos.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 4) {
          lastPos.current = { x: locationX, y: locationY };
          // Strictly require at least 2 fingers to advance progress
          if (touches >= 2) {
            advanceProgress(0.32);
          }
        }
      },
      onPanResponderRelease: () => {
        setIsRubbing(false);
        setTouchCount(0);
      },
      onPanResponderTerminate: () => {
        setIsRubbing(false);
        setTouchCount(0);
      },
    })
  ).current;

  const starRotation = starRotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  // Constellation stardust field matching the prototype's concentric particle canvas
  const celestialParticles = useMemo(() => {
    const seedAngles = [
      0.18, 0.42, 0.68, 0.94, 1.22, 1.48, 1.74, 2.02,
      2.28, 2.54, 2.82, 3.08, 3.34, 3.62, 3.88, 4.14,
      4.42, 4.68, 4.94, 5.22, 5.48, 5.74, 6.02, 6.24,
      0.55, 1.35, 2.15, 2.95, 3.75, 4.55, 5.35, 6.15,
    ];
    const radii = [
      48, 86, 62, 104, 54, 92, 70, 108,
      44, 82, 66, 102, 50, 88, 74, 112,
      46, 84, 58, 98, 52, 90, 68, 106,
      76, 56, 84, 64, 80, 58, 86, 66,
    ];
    return seedAngles.map((a, i) => ({
      x: Math.cos(a) * radii[i],
      y: Math.sin(a) * radii[i],
      size: i % 4 === 0 ? 4.5 : i % 3 === 0 ? 3.5 : 2.5,
      colorIndex: i % 4,
      opacity: 0.6 + ((i * 7) % 35) / 100,
    }));
  }, []);

  return (
    <View style={styles.container}>
      {/* 1. Mooca Mascot - Positioned slightly lower for cozy spacing */}
      <View style={styles.mascotSection}>
        <MoocaMascot
          mood={isFinished ? 'celebrating' : isRubbing ? 'rubbing' : 'comforting'}
          size="sm"
          speakingBubble={
            isFinished
              ? lang === 'th'
                ? 'เก่งมากๆ เลยนะ! สัมผัสเป็นจังหวะช่วยให้ใจสงบลงแล้วใช่ไหม'
                : 'Wonderful job! Your mind and body are peaceful and safe now.'
              : isRubbing
                ? lang === 'th'
                  ? 'รู้สึกอุ่นขึ้นไหม... ค่อยๆ ดึงความรู้สึกกลับมาที่ปลายนิ้วนะคนเก่ง'
                  : 'Feeling the warmth? Gently anchoring your calm right here.'
                : lang === 'th'
                  ? 'วางสองนิ้วแล้วค่อยๆ ถูวนไปด้วยกันนะ Mooca อยู่ตรงนี้เสมอ'
                  : 'Place two fingers & gently swirl with me. I’m right here.'
          }
        />
      </View>

      {/* 2. Instruction Badge & Multi-touch Indicator with Info Tip */}
      <TouchableOpacity
        onPress={() => {
          audioService.triggerHaptic('selection');
          setIsGuideOpen(true);
        }}
        activeOpacity={0.8}
        style={[
          styles.instructionPill,
          {
            backgroundColor: theme.badgeBg,
            borderColor: theme.badgeBorder,
          },
        ]}
      >
        {touchCount >= 2 ? (
          <Sparkles size={14} color="#10B981" strokeWidth={2.4} />
        ) : (
          <Hand size={14} color={theme.badgeIconColor} strokeWidth={2.4} />
        )}
        <Text style={[styles.instructionPillText, { color: theme.badgeText }]}>
          {touchCount >= 2
            ? lang === 'th'
              ? 'ตรวจพบ 2 นิ้วแล้ว • ถูวนเป็นจังหวะ'
              : '2-Finger Rhythm Active'
            : touchCount === 1
              ? lang === 'th'
                ? 'ตรวจพบ 1 นิ้ว (กรุณาวาง 2 นิ้ว)'
                : '1 finger detected (Place 2 fingers)'
              : lang === 'th'
                ? 'วางสองนิ้วแล้วถูวน (แตะดูวิธี)'
                : 'Place 2 fingers & swirl (Tap guide)'}
        </Text>
        <HelpCircle size={13} color={theme.badgeIconColor} strokeWidth={2} />
      </TouchableOpacity>

      {/* 3. Pure Ethereal Concentric Grounding Wheel */}
      <View style={styles.wheelSection}>
        {/* Soft Sun-like Diffused Radial Glow Aura (Feathered seamlessly to 0% opacity) */}
        <Animated.View
          style={[
            styles.sigilAuraHalo,
            {
              width: CIRCLE_SIZE + 96,
              height: CIRCLE_SIZE + 96,
              transform: [{ scale: pulseAnim }],
            },
          ]}
          pointerEvents="none"
        >
          <Svg width={CIRCLE_SIZE + 96} height={CIRCLE_SIZE + 96}>
            <Defs>
              <SvgRadialGradient
                id="sigilSunAura"
                cx="50%"
                cy="50%"
                rx="50%"
                ry="50%"
                fx="50%"
                fy="50%"
              >
                <Stop offset="0%" stopColor={theme.glowCore} stopOpacity="0.45" />
                <Stop offset="42%" stopColor={theme.glowMid} stopOpacity="0.22" />
                <Stop offset="72%" stopColor={theme.glowOuter} stopOpacity="0.08" />
                <Stop offset="100%" stopColor={theme.glowOuter} stopOpacity="0" />
              </SvgRadialGradient>
            </Defs>
            <SvgCircle
              cx={(CIRCLE_SIZE + 96) / 2}
              cy={(CIRCLE_SIZE + 96) / 2}
              r={(CIRCLE_SIZE + 96) / 2}
              fill="url(#sigilSunAura)"
            />
          </Svg>
        </Animated.View>

        <Animated.View
          style={[
            styles.outerCircle,
            {
              width: CIRCLE_SIZE,
              height: CIRCLE_SIZE,
              borderRadius: CIRCLE_SIZE / 2,
              borderColor: theme.outerBorder,
              backgroundColor: theme.circleBg,
              transform: [{ scale: pulseAnim }, { scale: completeScaleAnim }],
            },
          ]}
          {...panResponder.panHandlers}
        >
          {/* Middle Dashed Ring */}
          <View
            style={[
              styles.middleCircle,
              {
                width: CIRCLE_SIZE * 0.76,
                height: CIRCLE_SIZE * 0.76,
                borderRadius: (CIRCLE_SIZE * 0.76) / 2,
                borderColor: theme.middleBorder,
              },
            ]}
          />

          {/* Inner Solid Ring */}
          <View
            style={[
              styles.innerCircle,
              {
                width: CIRCLE_SIZE * 0.52,
                height: CIRCLE_SIZE * 0.52,
                borderRadius: (CIRCLE_SIZE * 0.52) / 2,
                borderColor: theme.innerBorder,
              },
            ]}
          />

          {/* Prototype Constellation Stardust Embers */}
          {celestialParticles.map((p, idx) => (
            <View
              key={idx}
              style={[
                styles.particle,
                {
                  left: CIRCLE_SIZE / 2 + p.x - p.size / 2,
                  top: CIRCLE_SIZE / 2 + p.y - p.size / 2,
                  width: p.size,
                  height: p.size,
                  borderRadius: p.size / 2,
                  backgroundColor: theme.dots[p.colorIndex],
                  opacity: p.opacity,
                  shadowColor: theme.dots[p.colorIndex],
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 0.6,
                  shadowRadius: 3,
                },
              ]}
              pointerEvents="none"
            />
          ))}

          {/* Center Content: DAYTIME HAS NO STARS! Sun for day, Sparkles for sunset, Star for night */}
          <View style={styles.centerContent} pointerEvents="none">
            <Animated.View
              style={[
                styles.starBackground,
                { transform: [{ rotate: starRotation }] },
              ]}
            >
              {skyPeriod === 'day' ? (
                <Sun size={76} color={theme.starColor} strokeWidth={2} />
              ) : skyPeriod === 'sunset' ? (
                <Sparkles size={74} color={theme.starColor} strokeWidth={2} />
              ) : (
                <Star size={76} color={theme.starColor} strokeWidth={2} />
              )}
            </Animated.View>

            <Text style={[styles.percentNumber, { color: theme.textColor }]}>
              {Math.round(rubProgress)}%
            </Text>
          </View>
        </Animated.View>
      </View>

      {/* 4. Bottom Smooth Progress Bar OR Proceed Button */}
      {isFinished ? (
        <View style={styles.actionSection}>
          <MarshmallowButton
            variant="primary"
            size="lg"
            onPress={onComplete}
            icon={<Check size={18} color="#FFFFFF" strokeWidth={2.4} />}
            title={
              lang === 'th'
                ? 'เข้าสู่หน้าสะท้อนความคิด'
                : 'Proceed to Cognitive Reframing'
            }
          />
        </View>
      ) : (
        <View style={styles.bottomSection}>
          <View style={[styles.progressBarTrack, { backgroundColor: theme.progressTrack }]}>
            <Animated.View
              style={[
                styles.progressBarFill,
                {
                  width: progressWidth,
                  backgroundColor: theme.progressFill,
                },
              ]}
            />
          </View>

          <Text style={[styles.bottomCaption, { color: theme.captionColor }]}>
            {lang === 'th'
              ? 'การสัมผัสเป็นจังหวะส่งสัญญาณ Haptics กลับสู่ระบบประสาท หยุดภาวะตื่นตระหนก'
              : 'Rhythmic tactile touch sends haptics to the nervous system, halting acute panic'}
          </Text>
        </View>
      )}

      {/* 5. Educational Coaching Modal (Explains which fingers to use) */}
      <Modal
        visible={isGuideOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsGuideOpen(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <TouchableOpacity
              onPress={() => setIsGuideOpen(false)}
              style={styles.modalCloseBtn}
            >
              <X size={18} color="#64748B" />
            </TouchableOpacity>

            <View style={styles.guideIconWrapper}>
              <Hand size={32} color={colors.primary} strokeWidth={2.4} />
            </View>

            <Text style={styles.guideTitle}>
              {lang === 'th' ? 'วิธีใช้นิ้วสัมผัสเหนี่ยวสติ' : 'Tactile Grounding Finger Guide'}
            </Text>

            <View style={styles.guideStepsBox}>
              <View style={styles.guideStepRow}>
                <View style={styles.stepNumBadge}>
                  <Text style={styles.stepNumText}>1</Text>
                </View>
                <Text style={styles.guideStepText}>
                  {lang === 'th'
                    ? 'ใช้นิ้วหัวแม่มือทั้งสองข้าง หรือนิ้วชี้และนิ้วกลาง'
                    : 'Use both thumbs or your index & middle fingers'}
                </Text>
              </View>

              <View style={styles.guideStepRow}>
                <View style={styles.stepNumBadge}>
                  <Text style={styles.stepNumText}>2</Text>
                </View>
                <Text style={styles.guideStepText}>
                  {lang === 'th'
                    ? 'วางลงบนวงกลมแล้วถูวนเป็นจังหวะช้าๆ ต่อเนื่อง'
                    : 'Place them on the circle & swirl in steady circles'}
                </Text>
              </View>

              <View style={styles.guideStepRow}>
                <View style={styles.stepNumBadge}>
                  <Text style={styles.stepNumText}>3</Text>
                </View>
                <Text style={styles.guideStepText}>
                  {lang === 'th'
                    ? 'หน้าจอจะส่งแรงสั่น Haptics ดึงสติสู่ร่างกายทันที'
                    : 'The screen emits rhythmic haptics to restore body grounding'}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => {
                audioService.triggerHaptic('success');
                setIsGuideOpen(false);
              }}
              activeOpacity={0.85}
              style={styles.guideConfirmBtn}
            >
              <Check size={16} color="#FFFFFF" strokeWidth={2.6} />
              <Text style={styles.guideConfirmText}>
                {lang === 'th' ? 'เข้าใจแล้ว เริ่มถูวนเลย' : 'Got it, Let’s Swirl!'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  mascotSection: {
    overflow: 'visible',
    height: 140,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  instructionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: radii.full,
    borderWidth: 1.5,
    gap: 6,
    marginBottom: 6,
    ...shadows.soft,
  },
  instructionPillText: {
    fontFamily: typography.fontPromptBold,
    fontSize: 12,
  },
  wheelSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  sigilAuraHalo: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerCircle: {
    borderWidth: 2.2,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  middleCircle: {
    position: 'absolute',
    borderWidth: 2,
    borderStyle: 'dashed',
  },
  innerCircle: {
    position: 'absolute',
    borderWidth: 2,
  },
  particle: {
    position: 'absolute',
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 90,
    height: 90,
    position: 'relative',
  },
  starBackground: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  percentNumber: {
    fontFamily: typography.fontPromptExtraBold,
    fontSize: 34,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  actionSection: {
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
    paddingBottom: 6,
  },
  bottomSection: {
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
    paddingBottom: 4,
    gap: 10,
  },
  progressBarTrack: {
    width: '100%',
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 5,
  },
  bottomCaption: {
    fontFamily: typography.fontPromptMedium,
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 8,
    maxWidth: 295,
    alignSelf: 'center',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    position: 'relative',
    ...shadows.card,
  },
  modalCloseBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 6,
  },
  guideIconWrapper: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E6F9F7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#99F6E4',
  },
  guideTitle: {
    fontFamily: typography.fontPromptBold,
    fontSize: 16,
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 16,
  },
  guideStepsBox: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 14,
    gap: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  guideStepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  stepNumBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  stepNumText: {
    fontFamily: typography.fontPromptBold,
    fontSize: 11,
    color: '#FFFFFF',
  },
  guideStepText: {
    flex: 1,
    fontFamily: typography.fontPromptRegular,
    fontSize: 12.5,
    color: '#334155',
    lineHeight: 18,
  },
  guideConfirmBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: radii.full,
    gap: 8,
    width: '100%',
  },
  guideConfirmText: {
    fontFamily: typography.fontPromptBold,
    fontSize: 13.5,
    color: '#FFFFFF',
  },
});
