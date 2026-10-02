import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Accelerometer } from 'expo-sensors';
import { audioService } from '../../services/audioService';
import { MarshmallowButton } from '../../design-system/MarshmallowButton';
import { MoocaMascot } from '../MoocaMascot';
import { useSky } from '../DynamicSkyEngine';
import { Heart, Check, GlassWater, Sparkles, ArrowRight, X, HelpCircle } from 'lucide-react-native';
import { colors, radii, shadows, typography } from '../../design-system/tokens';
import { getTranslation } from '../../locales';
import { VictorySipProps } from './types';
import { VICTORY_SIP_CONFIG } from './constants';

export const VictorySip: React.FC<VictorySipProps> = ({
  onComplete,
  lang,
}) => {
  const t = getTranslation(lang);
  const strings = t.phases.phase2.victorySip;
  const { activePeriod } = useSky();
  const [sipCount, setSipCount] = useState(0); // 0 to 3
  const [isFinished, setIsFinished] = useState(false);
  const [tiltAngle, setTiltAngle] = useState(0);
  const [isTiltingToDrink, setIsTiltingToDrink] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(true); // Auto-show on mount

  // Smooth Animated Values
  const liquidAnim = useRef(new Animated.Value(100)).current; // 100% to 0%
  const cupTiltAnim = useRef(new Animated.Value(0)).current;
  const bobbingAnim = useRef(new Animated.Value(0)).current;
  const waveAnim = useRef(new Animated.Value(0)).current;

  // Real drinking physics state machine
  const readyForNextSip = useRef(true);
  const smoothedTilt = useRef(0);
  const tiltSide = useRef<'left' | 'right'>('left');
  const tiltHoldTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Boba bubble bobbing animation
  useEffect(() => {
    const bobLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(bobbingAnim, {
          toValue: -5,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(bobbingAnim, {
          toValue: 0,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    bobLoop.start();

    const waveLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(waveAnim, {
          toValue: 4,
          duration: 800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: false,
        }),
        Animated.timing(waveAnim, {
          toValue: -4,
          duration: 800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: false,
        }),
      ])
    );
    waveLoop.start();

    return () => {
      bobLoop.stop();
      waveLoop.stop();
    };
  }, [bobbingAnim, waveAnim]);

  // Real Accelerometer inclination angle detection with left & right tilt drinking physics
  useEffect(() => {
    let subscription: { remove: () => void } | null = null;
    try {
      Accelerometer.setUpdateInterval(60);
      subscription = Accelerometer.addListener(({ x, y, z }) => {
        // Physical pitch inclination angle when held in portrait:
        // y is vertical (-1 when upright), z is screen perpendicular (+1/-1)
        const rad = Math.atan2(z, -y);
        const rawDeg = Math.max(0, Math.min(90, Math.round(rad * (180 / Math.PI))));

        // Exponential moving average for smooth sensory response
        smoothedTilt.current = Math.round(smoothedTilt.current * 0.7 + rawDeg * 0.3);
        setTiltAngle(smoothedTilt.current);

        // Detect tilt direction: tilting left (x < -0.06) or right (x > 0.06)
        if (x < -0.06) {
          tiltSide.current = 'left';
        } else if (x > 0.06) {
          tiltSide.current = 'right';
        }

        // DELIBERATE DRINKING GESTURE:
        // Raising phone to mouth tilts it past 50°.
        if (smoothedTilt.current >= 50 && !isFinished) {
          if (readyForNextSip.current) {
            setIsTiltingToDrink(true);
            const targetCupAngle = tiltSide.current === 'right' ? 14 : -14;
            Animated.spring(cupTiltAnim, {
              toValue: targetCupAngle,
              friction: 6,
              tension: 40,
              isInteraction: false,
              useNativeDriver: false,
            }).start();

            if (!tiltHoldTimer.current) {
              tiltHoldTimer.current = setTimeout(() => {
                triggerSip();
                readyForNextSip.current = false; // Require user to lower phone before next sip!
                tiltHoldTimer.current = null;
              }, 1200);
            }
          }
        } else {
          // When lowered below 36° (returned to resting posture)
          if (smoothedTilt.current < 36) {
            readyForNextSip.current = true; // Unlocked for next sip!
          }
          setIsTiltingToDrink(false);
          Animated.spring(cupTiltAnim, {
            toValue: 0,
            friction: 7,
            tension: 50,
            isInteraction: false,
            useNativeDriver: false,
          }).start();

          if (tiltHoldTimer.current) {
            clearTimeout(tiltHoldTimer.current);
            tiltHoldTimer.current = null;
          }
        }
      });
    } catch {
      // Simulator fallback
    }

    return () => {
      subscription?.remove();
      if (tiltHoldTimer.current) clearTimeout(tiltHoldTimer.current);
    };
  }, [sipCount, isFinished]);

  const triggerSip = () => {
    if (isFinished) return;

    const nextSip = sipCount + 1;
    setSipCount(nextSip);
    audioService.playLiquidSip(nextSip);
    audioService.triggerHaptic('medium');

    // Smooth fluid drain animation downward
    const targetLevel = Math.max(0, 100 - nextSip * 33.34);
    Animated.timing(liquidAnim, {
      toValue: targetLevel,
      duration: 850,
      easing: Easing.inOut(Easing.cubic),
      useNativeDriver: false,
    }).start();

    if (nextSip >= 3) {
      setIsFinished(true);
      audioService.triggerHaptic('success');
      audioService.playChimeShockwave();
    }
  };

  // Harmonious sky-adaptive theme
  const getSkyColors = () => {
    switch (activePeriod) {
      case 'sunset':
        return {
          countColor: '#ffffffff',
          labelColor: '#fffafbff',
          hintColor: '#5f0019ff',
          progressTrack: 'rgba(255, 255, 255, 0.45)',
          progressFill: ['#ffa8bbff', '#fff6b4ff'] as const,
          badgeBg: 'rgba(255, 255, 255, 0.90)',
          badgeBorder: 'rgba(244, 114, 182, 0.45)',
          badgeTextColor: '#831843',
          badgeIconColor: '#F472B6',
        };
      case 'night':
        return {
          countColor: '#F8FAFC',
          labelColor: '#E2E8F0',
          hintColor: '#94A3B8',
          progressTrack: 'rgba(255, 255, 255, 0.25)',
          progressFill: ['#38BDF8', '#818CF8'] as const,
          badgeBg: 'rgba(15, 23, 42, 0.85)',
          badgeBorder: 'rgba(56, 189, 248, 0.35)',
          badgeTextColor: '#E2E8F0',
          badgeIconColor: '#38BDF8',
        };
      case 'dawn':
        return {
          countColor: '#78350F',
          labelColor: '#92400E',
          hintColor: '#B45309',
          progressTrack: 'rgba(255, 255, 255, 0.65)',
          progressFill: ['#F59E0B', '#FBBF24'] as const,
          badgeBg: 'rgba(255, 255, 255, 0.90)',
          badgeBorder: 'rgba(245, 158, 11, 0.40)',
          badgeTextColor: '#92400E',
          badgeIconColor: '#F59E0B',
        };
      default:
        return {
          countColor: colors.primaryDark,
          labelColor: colors.primaryDark,
          hintColor: colors.textMuted,
          progressTrack: colors.ringTrack,
          progressFill: [colors.primary, colors.accentBlue] as const,
          badgeBg: 'rgba(255, 255, 255, 0.90)',
          badgeBorder: colors.borderTeal,
          badgeTextColor: colors.primaryDark,
          badgeIconColor: colors.primary,
        };
    }
  };
  const skyTheme = getSkyColors();

  const liquidHeightInterpolated = liquidAnim.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 134],
  });

  return (
    <View style={styles.container}>
      {/* 1. Mascot View - Standardized Height across all screens */}
      <View style={styles.mascotWrapper}>
        <MoocaMascot
          mood={isFinished ? 'celebrating' : 'drinking'}
          size="sm"
          speakingBubble={
            isFinished
              ? strings.bubbleDone
              : strings.bubbleDrinking
          }
        />
      </View>

      {/* 2. Instruction Badge & Sip Indicator with Info Tip */}
      <TouchableOpacity
        onPress={() => {
          audioService.triggerHaptic('selection');
          setIsGuideOpen(true);
        }}
        activeOpacity={0.8}
        style={[
          styles.instructionPill,
          {
            backgroundColor: skyTheme.badgeBg,
            borderColor: skyTheme.badgeBorder,
          },
        ]}
      >
        {isFinished ? (
          <Sparkles size={14} color="#10B981" strokeWidth={2.4} />
        ) : isTiltingToDrink ? (
          <Sparkles size={14} color="#3B82F6" strokeWidth={2.4} />
        ) : (
          <GlassWater size={14} color={skyTheme.badgeIconColor} strokeWidth={2.4} />
        )}
        <Text style={[styles.instructionPillText, { color: skyTheme.badgeTextColor }]}>
          {isFinished
            ? strings.sipProgressDone
            : isTiltingToDrink
              ? strings.tiltActive
              : strings.tiltReady}
        </Text>
        <HelpCircle size={13} color={skyTheme.badgeIconColor} strokeWidth={2} />
      </TouchableOpacity>

      {/* 3. Hero Centerpiece: Fantasy Crystal Potion Tumbler */}
      <View style={styles.cupContainer}>
        {/* Soft Ambient Radiating Halo behind the tumbler */}
        <View style={styles.cupAuraHalo} pointerEvents="none" />

        {/* Straw Top Star Topper */}
        <View style={styles.strawStarTopper}>
          <Sparkles size={14} color="#F59E0B" fill="#FDE047" />
        </View>

        {/* Iridescent Striped Straw */}
        <View style={styles.straw}>
          <View style={[styles.strawStripe, { backgroundColor: '#F472B6' }]} />
          <View style={[styles.strawStripe, { backgroundColor: '#5EEAD4' }]} />
          <View style={[styles.strawStripe, { backgroundColor: '#FDE047' }]} />
          <View style={[styles.strawStripe, { backgroundColor: '#5EEAD4' }]} />
          <View style={[styles.strawStripe, { backgroundColor: '#F472B6' }]} />
        </View>

        {/* Cup Dome Rim */}
        <View style={styles.cupDome} />

        {/* Crystal Potion Cup Glass Body with physical tilt animation (Supports Left & Right) */}
        <Animated.View
          style={[
            styles.cupBody,
            {
              transform: [
                {
                  rotate: cupTiltAnim.interpolate({
                    inputRange: [-20, 0, 20],
                    outputRange: ['-16deg', '0deg', '16deg'],
                  }),
                },
              ],
            },
          ]}
        >
          {/* Glass Highlight */}
          <View style={styles.glassReflection} />

          {/* Realistic Gravity-Aligned Liquid Fluid */}
          <Animated.View
            style={[
              styles.liquidContainer,
              {
                height: liquidHeightInterpolated,
                transform: [
                  {
                    rotate: cupTiltAnim.interpolate({
                      inputRange: [-20, 0, 20],
                      outputRange: ['16deg', '0deg', '-16deg'],
                    }),
                  },
                ],
              },
            ]}
          >
            <LinearGradient
              colors={['#A7F3D0', '#5EEAD4', '#2DD4BF']}
              style={styles.liquidGradient}
            >
              <Animated.View
                style={[
                  styles.liquidWaveTop,
                  { transform: [{ translateX: waveAnim }] },
                ]}
              />
            </LinearGradient>
          </Animated.View>

          {/* Smiling Boba Pearls inside Cup */}
          <Animated.View
            style={[
              styles.pearlsContainer,
              { transform: [{ translateY: bobbingAnim }] },
            ]}
          >
            {/* Pearl 1 */}
            <View style={[styles.pearl, { left: 14, bottom: 8 }]}>
              <Text style={styles.pearlFace}>•‿•</Text>
            </View>
            {/* Pearl 2 */}
            <View style={[styles.pearl, { left: 40, bottom: 12 }]}>
              <Text style={styles.pearlFace}>◕‿◕</Text>
            </View>
            {/* Pearl 3 */}
            <View style={[styles.pearl, { right: 14, bottom: 8 }]}>
              <Text style={styles.pearlFace}>^‿^</Text>
            </View>
            {/* Floating Bubble 4 */}
            <View style={[styles.floatingBubble, { left: 24, bottom: 38 }]}>
              <Sparkles size={11} color="#FDE047" fill="#FDE047" />
            </View>
            {/* Floating Bubble 5 */}
            <View style={[styles.floatingBubble, { right: 26, bottom: 44 }]}>
              <Heart size={10} color="#F472B6" fill="#F472B6" />
            </View>
          </Animated.View>

          {/* Cup Front Smiling Face */}
          <View style={styles.cupFaceContainer}>
            <Text style={styles.cupEyes}>◕   ◕</Text>
            <Text style={styles.cupMouth}>‿</Text>
          </View>
        </Animated.View>

        {/* 3. Organic Sip Count Section with Interactive Tilt Guidance Gauge */}
        <View style={styles.organicCountSection}>
          <Text style={[styles.organicCountNumber, { color: skyTheme.countColor }]}>
            {sipCount}/3
          </Text>
          <Text style={[styles.organicCountLabel, { color: skyTheme.labelColor }]}>
            {isFinished
              ? strings.sipProgressDone
              : isTiltingToDrink
                ? strings.sipProgressSipping
                : strings.sipProgressIdle}
          </Text>

          {/* Slim glowing 4px progress line */}
          <View style={[styles.organicProgressTrack, { backgroundColor: skyTheme.progressTrack }]}>
            <LinearGradient
              colors={skyTheme.progressFill}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.organicProgressFill, { width: `${(sipCount / 3) * 100}%` }]}
            />
          </View>
        </View>
      </View>

      {/* 4. Action / Sensor Status Section - Preserved space, smaller button */}
      <View style={styles.actionSection}>
        {isFinished ? (
          <MarshmallowButton
            variant="primary"
            size="md"
            onPress={onComplete}
            icon={<ArrowRight size={16} color="#FFFFFF" />}
            title={strings.proceedBtn}
          />
        ) : (
          <Text style={[styles.organicSensorHint, { color: skyTheme.hintColor }]}>
            {isTiltingToDrink
              ? strings.sippingHold
              : readyForNextSip.current
                ? strings.tiltPhoneHint
                : strings.lowerPhoneHint}
          </Text>
        )}
      </View>

      {/* Instruction Modal — auto-shown on mount, explains sip gesture */}
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
              <GlassWater size={32} color={colors.primary} strokeWidth={2.4} />
            </View>

            <Text style={styles.guideTitle}>
              {strings.guideTitle}
            </Text>

            <View style={styles.guideStepsBox}>
              <View style={styles.guideStepRow}>
                <View style={styles.stepNumBadge}>
                  <Text style={styles.stepNumText}>1</Text>
                </View>
                <Text style={styles.guideStepText}>
                  {strings.guideStep1Desc}
                </Text>
              </View>

              <View style={styles.guideStepRow}>
                <View style={styles.stepNumBadge}>
                  <Text style={styles.stepNumText}>2</Text>
                </View>
                <Text style={styles.guideStepText}>
                  {strings.guideStep2Desc}
                </Text>
              </View>

              <View style={styles.guideStepRow}>
                <View style={styles.stepNumBadge}>
                  <Text style={styles.stepNumText}>3</Text>
                </View>
                <Text style={styles.guideStepText}>
                  {strings.guideStep3Desc}
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
                {strings.guideConfirm}
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
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mascotWrapper: {
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
    marginBottom: 4,
    ...shadows.soft,
  },
  instructionPillText: {
    fontFamily: typography.fontPromptBold,
    fontSize: 11,
    letterSpacing: 0.1,
  },
  cupContainer: {
    alignItems: 'center',
    position: 'relative',
    marginVertical: 4,
  },
  cupAuraHalo: {
    position: 'absolute',
    top: 20,
    width: 140,
    height: 160,
    borderRadius: 70,
    backgroundColor: 'rgba(94, 234, 212, 0.22)',
    shadowColor: '#2DD4BF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.45,
    shadowRadius: 28,
  },
  strawStarTopper: {
    marginBottom: -8,
    zIndex: 5,
    transform: [{ translateX: 6 }],
  },
  straw: {
    width: 14,
    height: 38,
    borderRadius: 7,
    overflow: 'hidden',
    marginBottom: -4,
    zIndex: 2,
    flexDirection: 'column',
    transform: [{ rotate: '12deg' }],
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.08)',
  },
  strawStripe: {
    flex: 1,
    width: '100%',
  },
  cupDome: {
    width: 104,
    height: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderWidth: 2,
    borderColor: '#BFEFEB',
    zIndex: 3,
  },
  cupBody: {
    width: 96,
    height: 124,
    backgroundColor: 'rgba(240, 253, 250, 0.65)',
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    borderWidth: 2.5,
    borderColor: colors.primary,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'flex-end',
    ...shadows.soft,
  },
  glassReflection: {
    position: 'absolute',
    left: 6,
    top: 8,
    width: 4,
    height: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 2,
    zIndex: 5,
  },
  liquidContainer: {
    position: 'absolute',
    bottom: -10,
    left: -22,
    width: 140,
    overflow: 'hidden',
  },
  liquidGradient: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  liquidWaveTop: {
    position: 'absolute',
    top: 0,
    left: -10,
    right: -10,
    height: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    borderRadius: 2.5,
  },
  pearlsContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 50,
  },
  pearl: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#0F766E',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#14B8A6',
    ...shadows.card,
  },
  pearlFace: {
    fontSize: 9,
    color: '#CCFBF1',
    fontWeight: 'bold',
  },
  floatingBubble: {
    position: 'absolute',
  },
  cupFaceContainer: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 4,
    pointerEvents: 'none',
  },
  cupEyes: {
    fontSize: 10,
    color: 'rgba(0, 77, 64, 0.65)',
    letterSpacing: 8,
    fontWeight: 'bold',
  },
  cupMouth: {
    fontSize: 10,
    color: 'rgba(0, 77, 64, 0.65)',
    marginTop: -4,
    fontWeight: 'bold',
  },
  organicCountSection: {
    alignItems: 'center',
    marginTop: 14,
    gap: 4,
  },
  organicCountNumber: {
    fontFamily: typography.fontPromptBold,
    fontSize: 32,
    lineHeight: 36,
  },
  organicCountLabel: {
    fontFamily: typography.fontPromptMedium,
    fontSize: 12,
  },
  organicProgressTrack: {
    width: 140,
    height: 4.5,
    borderRadius: 2.25,
    overflow: 'hidden',
    marginTop: 6,
  },
  organicProgressFill: {
    height: '100%',
    borderRadius: 2.25,
  },
  actionSection: {
    width: '100%',
    minHeight: 52, // Preserves space for proceed button
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 6,
  },
  organicSensorHint: {
    fontFamily: typography.fontPromptMedium,
    fontSize: 11,
    textAlign: 'center',
  },
  // ── Instruction Modal Styles ──────────────────────────────────────────────
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    position: 'relative',
    width: '100%',
    maxWidth: 360,
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
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: colors.borderTeal,
  },
  guideTitle: {
    fontFamily: typography.fontPromptBold,
    fontSize: 16,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 16,
  },
  guideStepsBox: {
    width: '100%',
    backgroundColor: colors.bgLight,
    borderRadius: radii.lg,
    padding: 14,
    gap: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  guideStepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  stepNumBadge: {
    width: 22,
    height: 22,
    borderRadius: radii.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  stepNumText: {
    fontFamily: typography.fontPromptBold,
    fontSize: 11,
    color: colors.white,
  },
  guideStepText: {
    flex: 1,
    fontFamily: typography.fontPromptRegular,
    fontSize: 12.5,
    color: colors.textSecondary,
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
    color: colors.white,
  },
});
