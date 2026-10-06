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
import { audioService, HAPTIC_STYLE } from '../../services/audioService';
import Svg, { Path, Circle, Ellipse, Defs, RadialGradient as SvgRadialGradient, Stop } from 'react-native-svg';
import { MARSHMALLOW_SIZE, MARSHMALLOW_VARIANT, MarshmallowButton } from '../../design-system/MarshmallowButton';
import { MOOCA_MOOD, MoocaMascot } from '../../components/MoocaMascot';
import { useSkyTheme } from '../../hooks/useSkyTheme';
import { Heart, Check, GlassWater, Sparkles, X, HelpCircle } from 'lucide-react-native';
import { colors, radii, shadows, typography } from '../../design-system/tokens';
import { getTranslation } from '../../locales';
import { renderBilingualNodes } from '../../components/BilingualText';
import { VictorySipProps } from './types';

export const VictorySip: React.FC<VictorySipProps> = ({
  onComplete,
  lang,
}) => {
  const t = getTranslation(lang);
  const strings = t.phases.phase2.victorySip;
  const skyTheme = useSkyTheme();
  const [sipCount, setSipCount] = useState(0); // 0 to 3
  const [isFinished, setIsFinished] = useState(false);
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
    audioService.triggerHaptic(HAPTIC_STYLE.MEDIUM);

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
      audioService.triggerHaptic(HAPTIC_STYLE.SUCCESS);
      audioService.playChimeShockwave();
    }
  };



  const liquidHeightInterpolated = liquidAnim.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 134],
  });

  return (
    <View style={styles.container}>
      {/* 1. Mascot View - Standardized Height across all screens */}
      <View style={styles.mascotWrapper}>
        <MoocaMascot
          mood={isFinished ? MOOCA_MOOD.CELEBRATING : MOOCA_MOOD.DRINKING}
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
          audioService.triggerHaptic(HAPTIC_STYLE.SELECTION);
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
          <Sparkles size={14} color={skyTheme.badgeIconColor} strokeWidth={2.4} />
        ) : isTiltingToDrink ? (
          <Sparkles size={14} color={skyTheme.badgeIconColor} strokeWidth={2.4} />
        ) : (
          <GlassWater size={14} color={skyTheme.badgeIconColor} strokeWidth={2.4} />
        )}
        <Text style={[styles.instructionPillText, { color: skyTheme.badgeTextColor }]}>
          {renderBilingualNodes(
            isFinished
              ? strings.sipProgressDone
              : isTiltingToDrink
                ? strings.tiltActive
                : strings.tiltReady,
            typography.fontPromptMedium,
            typography.fontGotham
          )}
        </Text>
        <HelpCircle size={13} color={skyTheme.badgeIconColor} strokeWidth={2} />
      </TouchableOpacity>

      {/* 3. Hero Centerpiece: Fantasy Crystal Potion Tumbler */}
      <View style={styles.cupContainer}>
        {/* Soft Ambient Radiating Halo behind the tumbler (feathered, zero hard edges) */}
        <View style={styles.cupAuraHalo} pointerEvents="none">
          <Svg width={200} height={200}>
            <Defs>
              <SvgRadialGradient
                id="cupAuraGrad"
                cx="50%"
                cy="50%"
                rx="50%"
                ry="50%"
                fx="50%"
                fy="50%"
              >
                <Stop offset="0%" stopColor="#00C4B3" stopOpacity={0.58} />
                <Stop offset="42%" stopColor="#00C4B3" stopOpacity={0.32} />
                <Stop offset="65%" stopColor="#00C4B3" stopOpacity={0.12} />
                <Stop offset="85%" stopColor="#00C4B3" stopOpacity={0} />
                <Stop offset="100%" stopColor="#00C4B3" stopOpacity={0} />
              </SvgRadialGradient>
            </Defs>
            <Circle cx={100} cy={100} r={95} fill="url(#cupAuraGrad)" />
          </Svg>
        </View>

        {/* Straw Top Star Topper */}
        <View style={styles.strawStarTopper}>
          <Sparkles size={14} color="#F9A000" fill="#F8E4B3" />
        </View>

        {/* Iridescent Striped Straw */}
        <View style={styles.straw}>
          <View style={[styles.strawStripe, { backgroundColor: '#EF7773' }]} />
          <View style={[styles.strawStripe, { backgroundColor: '#B3EDE8' }]} />
          <View style={[styles.strawStripe, { backgroundColor: '#F9A000' }]} />
          <View style={[styles.strawStripe, { backgroundColor: '#B3EDE8' }]} />
          <View style={[styles.strawStripe, { backgroundColor: '#EF7773' }]} />
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
          {/* Glass Highlights */}
          <View style={styles.glassReflection} />
          <View style={styles.glassReflectionSecondary} />

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
              colors={['#80E2D9', '#4DD6CA', '#00C4B3']}
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
            {/* Pearl 1: Cute happy face */}
            <View style={[styles.pearl, { left: 14, bottom: 8 }]}>
              <Svg width={22} height={22} viewBox="0 0 22 22">
                <Circle cx="15.5" cy="5.5" r="1.2" fill="rgba(255, 255, 255, 0.65)" />
                <Circle cx="7" cy="9.5" r="1.4" fill="#B3EDE8" />
                <Circle cx="15" cy="9.5" r="1.4" fill="#B3EDE8" />
                <Ellipse cx="5.5" cy="12.5" rx="1.3" ry="0.8" fill="#FFA5A5" opacity={0.9} />
                <Ellipse cx="16.5" cy="12.5" rx="1.3" ry="0.8" fill="#FFA5A5" opacity={0.9} />
                <Path d="M 9 12 Q 11 14.5 13 12" stroke="#B3EDE8" strokeWidth={1.1} strokeLinecap="round" fill="none" />
              </Svg>
            </View>
            {/* Pearl 2: Sparkle open face */}
            <View style={[styles.pearl, { left: 40, bottom: 12 }]}>
              <Svg width={22} height={22} viewBox="0 0 22 22">
                <Circle cx="15.5" cy="5.5" r="1.2" fill="rgba(255, 255, 255, 0.65)" />
                <Circle cx="7" cy="9" r="1.6" fill="#B3EDE8" />
                <Circle cx="6.5" cy="8.4" r="0.6" fill="#FFFFFF" />
                <Circle cx="15" cy="9" r="1.6" fill="#B3EDE8" />
                <Circle cx="14.5" cy="8.4" r="0.6" fill="#FFFFFF" />
                <Ellipse cx="5.5" cy="12.2" rx="1.3" ry="0.8" fill="#FFA5A5" opacity={0.9} />
                <Ellipse cx="16.5" cy="12.2" rx="1.3" ry="0.8" fill="#FFA5A5" opacity={0.9} />
                <Path d="M 9.2 12 Q 11 14.8 12.8 12 Z" fill="#FFA5A5" stroke="#B3EDE8" strokeWidth={0.8} />
              </Svg>
            </View>
            {/* Pearl 3: Winking playful face */}
            <View style={[styles.pearl, { right: 14, bottom: 8 }]}>
              <Svg width={22} height={22} viewBox="0 0 22 22">
                <Circle cx="15.5" cy="5.5" r="1.2" fill="rgba(255, 255, 255, 0.65)" />
                <Circle cx="7" cy="9.5" r="1.4" fill="#B3EDE8" />
                <Circle cx="6.5" cy="9" r="0.5" fill="#FFFFFF" />
                <Path d="M 13.5 10 Q 15 8.2 16.5 10" stroke="#B3EDE8" strokeWidth={1.2} strokeLinecap="round" fill="none" />
                <Ellipse cx="5.5" cy="12.5" rx="1.3" ry="0.8" fill="#FFA5A5" opacity={0.9} />
                <Ellipse cx="16.5" cy="12.5" rx="1.3" ry="0.8" fill="#FFA5A5" opacity={0.9} />
                <Path d="M 9.5 12 Q 11 14 12.5 12" stroke="#B3EDE8" strokeWidth={1.1} strokeLinecap="round" fill="none" />
              </Svg>
            </View>
            {/* Floating Bubble 4 */}
            <View style={[styles.floatingBubble, { left: 24, bottom: 38 }]}>
              <Sparkles size={11} color="#F9A000" fill="#F8E4B3" />
            </View>
            {/* Floating Bubble 5 */}
            <View style={[styles.floatingBubble, { right: 26, bottom: 44 }]}>
              <Heart size={10} color="#EF7773" fill="#EF7773" />
            </View>
          </Animated.View>

          {/* Cup Front Kawaii Smiling Face */}
          <View style={styles.cupFaceContainer}>
            <Svg width={54} height={32} viewBox="0 0 54 32">
              {/* Rosy Blushing Cheeks */}
              <Ellipse
                cx="10"
                cy="20"
                rx="4.5"
                ry="2.6"
                fill={isTiltingToDrink ? '#FF787D' : '#FFA4A4'}
                opacity={isTiltingToDrink ? 0.95 : 0.85}
              />
              <Ellipse
                cx="44"
                cy="20"
                rx="4.5"
                ry="2.6"
                fill={isTiltingToDrink ? '#FF787D' : '#FFA4A4'}
                opacity={isTiltingToDrink ? 0.95 : 0.85}
              />

              {isTiltingToDrink ? (
                <>
                  {/* Happy Curved Sips Eyes */}
                  <Path d="M 10 13 Q 15 7 20 13" stroke="#164E48" strokeWidth={2.4} strokeLinecap="round" fill="none" />
                  <Path d="M 34 13 Q 39 7 44 13" stroke="#164E48" strokeWidth={2.4} strokeLinecap="round" fill="none" />
                  {/* Cute Sipping Mouth */}
                  <Ellipse cx="27" cy="18" rx="3.4" ry="4" fill="#164E48" />
                  <Ellipse cx="27" cy="18.5" rx="1.8" ry="2.2" fill="#FF8585" />
                </>
              ) : (
                <>
                  {/* Shiny Big Kawaii Eyes with Sparkle Glints */}
                  <Circle cx="15" cy="13" r="4.8" fill="#164E48" />
                  <Circle cx="13.5" cy="11.2" r="1.8" fill="#FFFFFF" />
                  <Circle cx="16.6" cy="14.8" r="0.9" fill="#FFFFFF" />

                  <Circle cx="39" cy="13" r="4.8" fill="#164E48" />
                  <Circle cx="37.5" cy="11.2" r="1.8" fill="#FFFFFF" />
                  <Circle cx="40.6" cy="14.8" r="0.9" fill="#FFFFFF" />

                  {/* Sweet Happy Open Mouth */}
                  <Path
                    d="M 23 17 Q 27 23 31 17 Z"
                    fill="#FF8585"
                    stroke="#164E48"
                    strokeWidth={1.8}
                    strokeLinejoin="round"
                  />
                </>
              )}
            </Svg>
          </View>
        </Animated.View>

        {/* 3. Organic Sip Count Section with Interactive Tilt Guidance Gauge */}
        <View style={styles.organicCountSection}>
          <Text style={[styles.organicCountNumber, { color: skyTheme.countColor }]}>
            {sipCount}/3
          </Text>
          <Text style={[styles.organicCountLabel, { color: skyTheme.labelColor }]}>
            {renderBilingualNodes(
              isFinished
                ? strings.sipProgressDone
                : isTiltingToDrink
                  ? strings.sipProgressSipping
                  : strings.sipProgressIdle,
              typography.fontPromptSemiBold,
              typography.fontGothamBold
            )}
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
            variant={MARSHMALLOW_VARIANT.PRIMARY}
            size={MARSHMALLOW_SIZE.MD}
            onPress={onComplete}
            icon={<Check size={16} color="#FFFFFF" strokeWidth={2.4} />}
            title={strings.proceedBtn}
          />
        ) : (
          <Text style={[styles.organicSensorHint, { color: skyTheme.hintColor }]}>
            {renderBilingualNodes(
              isTiltingToDrink
                ? strings.sippingHold
                : readyForNextSip.current
                  ? strings.tiltPhoneHint
                  : strings.lowerPhoneHint,
              typography.fontPromptMedium,
              typography.fontGotham
            )}
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
            <View style={styles.guideContainer}>
            <TouchableOpacity
              onPress={() => setIsGuideOpen(false)}
              style={styles.modalCloseBtn}
            >
              <X size={18} color="#79ADA9" />
            </TouchableOpacity>

            <View style={styles.guideIconWrapper}>
              <GlassWater size={28} color={colors.primary} strokeWidth={2.4} />
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
    fontFamily: typography.fontPromptMedium,
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
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
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
    borderColor: '#B3EDE8',
    zIndex: 3,
  },
  cupBody: {
    width: 98,
    height: 126,
    backgroundColor: 'rgba(226, 250, 248, 0.72)',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
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
  glassReflectionSecondary: {
    position: 'absolute',
    right: 6,
    top: 12,
    width: 3,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
    borderRadius: 1.5,
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
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#204541',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#38B2A3',
    ...shadows.card,
    overflow: 'hidden',
  },
  floatingBubble: {
    position: 'absolute',
  },
  cupFaceContainer: {
    position: 'absolute',
    top: 36,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 4,
    pointerEvents: 'none',
  },
  organicCountSection: {
    alignItems: 'center',
    marginTop: 14,
    gap: 4,
  },
  organicCountNumber: {
    fontFamily: typography.fontGothamBold,
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
    paddingHorizontal: 20,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 0,
    overflow: 'hidden',
    alignItems: 'center',
    position: 'relative',
    width: '100%',
    maxWidth: 360,
    ...shadows.card,
  },
  guideContainer: {
    padding: 16,
    width: '100%',
    alignItems: 'center',
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
