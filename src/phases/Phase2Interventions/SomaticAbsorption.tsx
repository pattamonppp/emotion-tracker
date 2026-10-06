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
import { LinearGradient } from 'expo-linear-gradient';
import { audioService, HAPTIC_STYLE } from '../../services/audioService';
import { useSkyTheme } from '../../hooks/useSkyTheme';
import { MOOCA_MOOD, MoocaMascot } from '../../components/MoocaMascot';
import { MARSHMALLOW_SIZE, MARSHMALLOW_VARIANT, MarshmallowButton } from '../../design-system/MarshmallowButton';
import Svg, { Defs, RadialGradient as SvgRadialGradient, Stop, Circle as SvgCircle } from 'react-native-svg';
import { Star, Sun, Hand, Sparkles, HelpCircle, Check, X } from 'lucide-react-native';
import { typography, radii, shadows, colors } from '../../design-system/tokens';
import { getTranslation } from '../../locales';
import { renderBilingualNodes } from '../../components/BilingualText';
import { Language, SKY, SkyTimePeriod } from '../../types';

interface SomaticAbsorptionProps {
  onComplete: () => void;
  lang: Language;
  skyPeriod?: SkyTimePeriod;
}

const { width: SCREEN_W } = Dimensions.get('window');
const CIRCLE_SIZE = Math.min(SCREEN_W * 0.72, 268);

const getSigilAuraTheme = (period: SkyTimePeriod) => {
  switch (period) {
    case SKY.SUNSET:
      return {
        core: '#FFFFFF',
        coreOpacity: 0.45,
        mid: '#FED6D5',
        midOpacity: 0.20,
        outer: '#EF7773',
        outerOpacity: 0.16,
      };
    case SKY.NIGHT:
      return {
        core: '#8FBBEF',
        coreOpacity: 0.50,
        mid: '#1F77DF',
        midOpacity: 0.30,
        outer: '#0A47CA',
        outerOpacity: 0.14,
      };
    case SKY.DAWN:
      return {
        core: '#FCF4E0',
        coreOpacity: 0.68,
        mid: '#F4D280',
        midOpacity: 0.40,
        outer: '#F9A000',
        outerOpacity: 0.18,
      };
    case SKY.DAY:
    default:
      return {
        core: '#00C4B3',
        coreOpacity: 0.58,
        mid: '#62A0E9',
        midOpacity: 0.34,
        outer: '#00C4B3',
        outerOpacity: 0.16,
      };
  }
};

export const SomaticAbsorption: React.FC<SomaticAbsorptionProps> = ({
  onComplete,
  lang,
  skyPeriod: propSkyPeriod,
}) => {
  const t = getTranslation(lang);
  const strings = t.phases.phase2.somaticAbsorption;
  const theme = useSkyTheme(propSkyPeriod);
  const skyPeriod = propSkyPeriod || theme.period;
  const sigilAura = useMemo(() => getSigilAuraTheme(skyPeriod), [skyPeriod]);
  const haloCanvasSize = CIRCLE_SIZE + 140;



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
        audioService.triggerHaptic(HAPTIC_STYLE.SUCCESS);
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
          mood={isFinished ? MOOCA_MOOD.CELEBRATING : isRubbing ? MOOCA_MOOD.RUBBING : MOOCA_MOOD.COMFORTING}
          size="sm"
          speakingBubble={
            isFinished
              ? strings.mascotDone
              : isRubbing
                ? strings.mascotRubbing
                : strings.mascotIdle
          }
        />
      </View>

      {/* 2. Instruction Badge & Multi-touch Indicator with Info Tip */}
      <TouchableOpacity
        onPress={() => {
          audioService.triggerHaptic(HAPTIC_STYLE.SELECTION);
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
          {renderBilingualNodes(
            touchCount >= 2
              ? strings.fingerActive2
              : touchCount === 1
                ? strings.fingerWarning1
                : strings.fingerPrompt,
            typography.fontPromptMedium,
            typography.fontGotham
          )}
        </Text>
        <HelpCircle size={13} color={theme.badgeIconColor} strokeWidth={2} />
      </TouchableOpacity>

      {/* 3. Pure Ethereal Concentric Grounding Wheel */}
      <View style={styles.wheelSection}>
        {/* Soft Sun-like Diffused Radial Glow Aura (Feathered seamlessly to 0% opacity, no cut edge lines) */}
        <Animated.View
          style={[
            styles.sigilAuraHalo,
            {
              width: haloCanvasSize,
              height: haloCanvasSize,
              transform: [{ scale: pulseAnim }],
            },
          ]}
          pointerEvents="none"
        >
          <Svg width={haloCanvasSize} height={haloCanvasSize}>
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
                <Stop offset="0%" stopColor={sigilAura.core} stopOpacity={sigilAura.coreOpacity} />
                <Stop offset="38%" stopColor={sigilAura.mid} stopOpacity={sigilAura.midOpacity} />
                <Stop offset="68%" stopColor={sigilAura.outer} stopOpacity={sigilAura.outerOpacity} />
                <Stop offset="88%" stopColor={sigilAura.outer} stopOpacity={0} />
                <Stop offset="100%" stopColor={sigilAura.outer} stopOpacity={0} />
              </SvgRadialGradient>
            </Defs>
            <SvgCircle
              cx={haloCanvasSize / 2}
              cy={haloCanvasSize / 2}
              r={haloCanvasSize / 2}
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
              {skyPeriod === SKY.DAY ? (
                <Sun size={76} color={theme.starColor} strokeWidth={2} />
              ) : skyPeriod === SKY.SUNSET ? (
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
            variant={MARSHMALLOW_VARIANT.PRIMARY}
            size={MARSHMALLOW_SIZE.MD}
            onPress={onComplete}
            icon={<Check size={16} color="#FFFFFF" strokeWidth={2.4} />}
            title={strings.proceedBtn}
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
                  overflow: 'hidden',
                },
              ]}
            >
              <LinearGradient
                colors={theme.progressFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={StyleSheet.absoluteFill}
              />
            </Animated.View>
          </View>

          <Text style={[styles.bottomCaption, { color: theme.captionColor }]}>
            {renderBilingualNodes(strings.caption, typography.fontPromptRegular, typography.fontGotham)}
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
              <X size={18} color="#79ADA9" />
            </TouchableOpacity>

            <View style={styles.guideIconWrapper}>
              <Hand size={28} color={colors.primary} strokeWidth={2.4} />
            </View>

            <Text style={styles.guideTitle}>
              {renderBilingualNodes(strings.guideTitle, typography.fontPromptBold, typography.fontGothamBold)}
            </Text>

            <View style={styles.guideStepsBox}>
              <View style={styles.guideStepRow}>
                <View style={styles.stepNumBadge}>
                  <Text style={styles.stepNumText}>1</Text>
                </View>
                <Text style={styles.guideStepText}>
                  {renderBilingualNodes(strings.guideStep1Desc, typography.fontPromptRegular, typography.fontGothamBook)}
                </Text>
              </View>

              <View style={styles.guideStepRow}>
                <View style={styles.stepNumBadge}>
                  <Text style={styles.stepNumText}>2</Text>
                </View>
                <Text style={styles.guideStepText}>
                  {renderBilingualNodes(strings.guideStep2Desc, typography.fontPromptRegular, typography.fontGothamBook)}
                </Text>
              </View>

              <View style={styles.guideStepRow}>
                <View style={styles.stepNumBadge}>
                  <Text style={styles.stepNumText}>3</Text>
                </View>
                <Text style={styles.guideStepText}>
                  {renderBilingualNodes(strings.guideStep3Desc, typography.fontPromptRegular, typography.fontGothamBook)}
                </Text>
              </View>
            </View>

            <MarshmallowButton
              variant={MARSHMALLOW_VARIANT.PRIMARY}
              size={MARSHMALLOW_SIZE.MD}
              title={strings.guideConfirm}
              icon={<Check size={16} color="#FFFFFF" strokeWidth={2.6} />}
              onPress={() => {
                audioService.triggerHaptic(HAPTIC_STYLE.SUCCESS);
                setIsGuideOpen(false);
              }}
              style={{ width: '100%' }}
            />
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
    paddingTop: 12,
    paddingBottom: 8,
    paddingHorizontal: 16,
  },
  mascotSection: {
    overflow: 'visible',
    height: 145,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 4,
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
    fontFamily: typography.fontPromptMedium,
    fontSize: 11,
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
    opacity: 0.35,
  },
  percentNumber: {
    fontFamily: typography.fontGothamBold,
    fontSize: 34,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  actionSection: {
    width: '100%',
    maxWidth: 360,
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
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    position: 'relative',
    ...shadows.card,
  },
  modalCloseBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 6,
    zIndex: 10,
  },
  guideIconWrapper: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E0F8F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#B3EDE8',
  },
  guideTitle: {
    fontFamily: typography.fontPromptBold,
    fontSize: 16,
    color: colors.primaryDark,
    textAlign: 'center',
    marginBottom: 16,
  },
  guideStepsBox: {
    width: '100%',
    backgroundColor: '#fbfbfb',
    borderRadius: 16,
    padding: 14,
    gap: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#f1f1f1',
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
    fontFamily: typography.fontGothamBold,
    fontSize: 11,
    fontWeight: '700',
    color: colors.white,
  },
  guideStepText: {
    flex: 1,
    fontFamily: typography.fontPromptRegular,
    fontSize: 12.5,
    color: colors.textSecondary,
    lineHeight: 18,
  },
});
