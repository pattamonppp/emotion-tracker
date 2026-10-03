import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Accelerometer } from 'expo-sensors';
import { audioService, HAPTIC_STYLE } from '../../services/audioService';
import { MARSHMALLOW_SIZE, MARSHMALLOW_VARIANT, MarshmallowButton } from '../../design-system/MarshmallowButton';
import { MOOCA_MOOD, MoocaMascot } from '../../components/MoocaMascot';
import { useSkyTheme } from '../../hooks/useSkyTheme';
import { CheckCircle2, Star, Sparkles } from 'lucide-react-native';
import { colors, typography } from '../../design-system/tokens';
import { getTranslation } from '../../locales';
import { ACTIVITY_TYPE } from '../../types';
import { KineticShakerProps } from './types';
import { KINETIC_SHAKER_CONFIG } from './constants';

export const KineticShaker: React.FC<KineticShakerProps> = ({
  onComplete,
  lang,
  activityType = ACTIVITY_TYPE.SHAKE,
}) => {
  const t = getTranslation(lang);
  const strings = t.phases.phase2.kineticShaker;
  const skyTheme = useSkyTheme();
  const [mode, setMode] = useState<typeof ACTIVITY_TYPE.SHAKE | typeof ACTIVITY_TYPE.BOUNCE>(
    activityType === ACTIVITY_TYPE.JUMP ? ACTIVITY_TYPE.BOUNCE : ACTIVITY_TYPE.SHAKE
  );
  const [shakesLeft, setShakesLeft] = useState<number>(KINETIC_SHAKER_CONFIG.REQUIRED_SHAKES);
  const [bouncesLeft, setBouncesLeft] = useState<number>(KINETIC_SHAKER_CONFIG.REQUIRED_JUMPS);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const lastShakeTime = useRef(0);
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const jumpAnim = useRef(new Animated.Value(0)).current;
  const starBurstAnim = useRef(new Animated.Value(0)).current;

  // Sync mode if activityType changes
  useEffect(() => {
    setMode(activityType === ACTIVITY_TYPE.JUMP ? ACTIVITY_TYPE.BOUNCE : ACTIVITY_TYPE.SHAKE);
  }, [activityType]);

  const triggerShakeVisual = () => {
    if (mode === ACTIVITY_TYPE.SHAKE) {
      // Lateral Shake wiggle
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 10, duration: 35, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -10, duration: 35, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 6, duration: 35, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 35, useNativeDriver: true }),
      ]).start();
    } else {
      // Vertical Jump bounce
      Animated.sequence([
        Animated.timing(jumpAnim, { toValue: -32, duration: 160, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        Animated.timing(jumpAnim, { toValue: 4, duration: 140, easing: Easing.in(Easing.quad), useNativeDriver: true }),
        Animated.timing(jumpAnim, { toValue: 0, duration: 80, useNativeDriver: true }),
      ]).start();
    }

    // Burst stars from shattered grumpy cloud
    starBurstAnim.setValue(0);
    Animated.timing(starBurstAnim, {
      toValue: 1,
      duration: 600,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  };

  // Accelerometer listener with distinct physics for Shake vs Jump
  useEffect(() => {
    let subscription: { remove: () => void } | null = null;
    try {
      Accelerometer.setUpdateInterval(80);
      subscription = Accelerometer.addListener(({ x, y, z }) => {
        const now = Date.now();
        if (mode === ACTIVITY_TYPE.SHAKE) {
          // Detect rapid lateral vibration / shake (horizontal plane)
          const lateral = Math.sqrt(x * x + z * z);
          const total = Math.sqrt(x * x + y * y + z * z);
          if ((lateral > 1.6 || total > 2.0) && now - lastShakeTime.current > 220) {
            lastShakeTime.current = now;
            handleCycle();
          }
        } else {
          // Detect vertical jump impact (Y-axis vertical impulse followed by heel landing)
          const verticalAbs = Math.abs(y);
          const total = Math.sqrt(x * x + y * y + z * z);
          if ((verticalAbs > 1.9 || total > 2.3) && now - lastShakeTime.current > 380) {
            lastShakeTime.current = now;
            handleCycle();
          }
        }
      });
    } catch {
      // Simulator fallback
    }

    return () => {
      subscription?.remove();
    };
  }, [shakesLeft, bouncesLeft, mode, isFinished]);

  const handleCycle = () => {
    if (isFinished) return;

    triggerShakeVisual();

    if (mode === ACTIVITY_TYPE.SHAKE) {
      const remaining = Math.max(0, shakesLeft - 1);
      setShakesLeft(remaining);
      audioService.playShakerClick(remaining);

      if (remaining === 0) {
        finishIntervention();
      }
    } else {
      const remaining = Math.max(0, bouncesLeft - 1);
      setBouncesLeft(remaining);
      audioService.playShakerClick(remaining);

      if (remaining === 0) {
        finishIntervention();
      }
    }
  };

  const finishIntervention = () => {
    setIsFinished(true);
    audioService.triggerHaptic(HAPTIC_STYLE.SUCCESS);
    audioService.playChimeShockwave();
    // No auto-advance: require user to tap proceed button
  };

  const currentCount = mode === ACTIVITY_TYPE.SHAKE ? shakesLeft : bouncesLeft;
  const maxCount = mode === ACTIVITY_TYPE.SHAKE ? 15 : 10;
  const progressPercent = Math.round(((maxCount - currentCount) / maxCount) * 100);
  const fluidHeightPercent = isFinished ? 0 : Math.round((currentCount / maxCount) * 100);

  // Dynamic fluid gradient: uses skyTheme or success on finish
  const getFluidColors = (): readonly [string, string, ...string[]] => {
    if (isFinished) {
      return [colors.success, colors.primary];
    }
    return skyTheme.fluidColors;
  };

  const starBurstScale = starBurstAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.6, 1.4],
  });

  const starBurstOpacity = starBurstAnim.interpolate({
    inputRange: [0, 0.2, 1],
    outputRange: [0, 1, 0],
  });

  return (
    <View style={styles.container}>
      {/* 1. Mascot View - Standardized 140px Height across all screens */}
      <Animated.View
        style={[
          styles.mascotWrapper,
          { transform: [{ translateX: shakeAnim }, { translateY: jumpAnim }] },
        ]}
      >
        <MoocaMascot
          mood={isFinished ? MOOCA_MOOD.CELEBRATING : MOOCA_MOOD.SHAKING}
          size="sm"
          speakingBubble={
            isFinished
              ? mode === ACTIVITY_TYPE.SHAKE
                ? strings.bubbleDone
                : strings.bubbleDoneBounce
              : mode === ACTIVITY_TYPE.SHAKE
                ? strings.bubbleShake
                : strings.bubbleBounce
          }
        />
      </Animated.View>

      {/* 2. Hero Centerpiece: Centered Fantasy Apothecary Tension Vial */}
      <View style={styles.centerStage}>
        {/* Soft Ambient Radiating Halo behind the centered vial */}
        <View style={styles.capsuleAuraHalo} pointerEvents="none" />

        {/* Star Burst Particles overlay on shake */}
        <Animated.View
          style={[
            styles.starBurstOverlay,
            {
              transform: [{ scale: starBurstScale }],
              opacity: starBurstOpacity,
            },
          ]}
          pointerEvents="none"
        >
          <View style={styles.burstStar1}><Star size={20} color="#F9A000" fill="#F8E4B3" /></View>
          <View style={styles.burstStar2}><Sparkles size={18} color="#F9A000" fill="#F8E4B3" /></View>
          <View style={styles.burstStar3}><Star size={24} color="#F9A000" fill="#F8E4B3" /></View>
          <View style={styles.burstStar4}><Sparkles size={16} color="#F9A000" fill="#F8E4B3" /></View>
        </Animated.View>

        {/* Centered Enchanted Apothecary Vial */}
        <Animated.View
          style={[
            styles.capsuleWrapper,
            { transform: [{ translateX: shakeAnim }, { translateY: jumpAnim }] },
          ]}
        >
          {/* Top Wooden / Runic Cork Cap with Golden Star Seal */}
          <View style={styles.capsuleCorkTop}>
            <Star size={10} color="#F8E4B3" fill="#F9A000" />
          </View>

          {/* Transparent Fantasy Glass Cylinder */}
          <View style={styles.capsuleGlass}>
            {/* Specular Highlight Curved Streak */}
            <View style={styles.capsuleGlassReflection} />

            {/* Ancient Alchemical Scale Ticks */}
            <View style={styles.capsuleTicks}>
              <View style={[styles.capsuleTickLine, { top: '25%' }]} />
              <View style={[styles.capsuleTickLine, { top: '50%' }]} />
              <View style={[styles.capsuleTickLine, { top: '75%' }]} />
            </View>

            {/* Glowing Discharging Celestial Fluid strictly decreasing with shake count */}
            <View style={styles.fluidContainer}>
              <LinearGradient
                colors={getFluidColors()}
                style={[styles.fluidFill, { height: `${fluidHeightPercent}%` }]}
              />
            </View>

            {/* Floating Magical Starlight Sparkles Inside Potion */}
            <View style={styles.fluidStarParticle1} pointerEvents="none">
              <Sparkles size={11} color="rgba(255,255,255,0.9)" />
            </View>
            <View style={styles.fluidStarParticle2} pointerEvents="none">
              <Star size={9} color="rgba(255,255,255,0.85)" fill="#FFFFFF" />
            </View>

            {/* Center Star Emblem */}
            <View style={styles.capsuleCenterIcon}>
              {isFinished ? (
                <Star size={24} color="#F9A000" fill="#F8E4B3" />
              ) : (
                <Sparkles size={20} color="rgba(255,255,255,0.95)" />
              )}
            </View>
          </View>

          {/* Bottom Cork Base */}
          <View style={styles.capsuleCorkBottom} />
        </Animated.View>

        {/* 3. Organic Count Display (NO block, NO badge!) */}
        <View style={styles.organicCountSection}>
          <Text style={[styles.organicCountNumber, { color: skyTheme.countColor }]}>
            {isFinished ? 0 : currentCount}
          </Text>
          <Text style={[styles.organicCountLabel, { color: skyTheme.labelColor }]}>
            {isFinished
              ? strings.released
              : mode === ACTIVITY_TYPE.SHAKE
                ? `${currentCount} ${strings.shakesLeft}`
                : `${currentCount} ${strings.bouncesLeft}`}
          </Text>

          {/* Slim glowing 4px progress line */}
          <View style={[styles.organicProgressTrack, { backgroundColor: skyTheme.progressTrack }]}>
            <LinearGradient
              colors={skyTheme.progressFill}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.organicProgressFill, { width: `${progressPercent}%` }]}
            />
          </View>
        </View>
      </View>

      {/* 4. Action / Sensor Status Section - Clean Organic Typography, No Block/Badge */}
      <View style={styles.actionSection}>
        {isFinished ? (
          <MarshmallowButton
            variant={MARSHMALLOW_VARIANT.PRIMARY}
            size={MARSHMALLOW_SIZE.MD}
            onPress={onComplete}
            icon={<CheckCircle2 size={16} color="#FFFFFF" />}
            title={strings.proceedBtn}
          />
        ) : (
          <Text style={[styles.organicSensorHint, { color: skyTheme.hintColor }]}>
            {mode === ACTIVITY_TYPE.SHAKE ? strings.captionShake : strings.captionBounce}
          </Text>
        )}
      </View>
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
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: 145,
    width: '100%',
    paddingBottom: 4,
  },
  centerStage: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    position: 'relative',
    gap: 12,
  },
  capsuleAuraHalo: {
    position: 'absolute',
    top: 10,
    width: 140,
    height: 180,
    borderRadius: 70,
    backgroundColor: 'rgba(0, 196, 179, 0.14)',
    shadowColor: '#00C4B3',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.45,
    shadowRadius: 28,
  },
  starBurstOverlay: {
    position: 'absolute',
    top: 20,
    width: 180,
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  burstStar1: { position: 'absolute', top: 10, left: 20, fontSize: 18 },
  burstStar2: { position: 'absolute', top: 25, right: 20, fontSize: 16 },
  burstStar3: { position: 'absolute', bottom: 30, left: 25, fontSize: 20 },
  burstStar4: { position: 'absolute', bottom: 15, right: 25, fontSize: 16 },
  capsuleWrapper: {
    alignItems: 'center',
    width: 90,
    zIndex: 2,
  },
  capsuleCorkTop: {
    width: 44,
    height: 18,
    backgroundColor: '#DF8900',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
    borderWidth: 1.5,
    borderColor: '#F9A000',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3,
    shadowColor: '#DF8900',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 2,
  },
  capsuleGlass: {
    width: 80,
    height: 172,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.82)',
    borderWidth: 2.5,
    borderColor: '#80E2D9',
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'flex-end',
    alignItems: 'center',
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 14,
    elevation: 4,
  },
  capsuleGlassReflection: {
    position: 'absolute',
    top: 10,
    left: 8,
    width: 6.5,
    bottom: 14,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.72)',
    zIndex: 6,
  },
  capsuleTicks: {
    position: 'absolute',
    right: 8,
    top: 0,
    bottom: 0,
    width: 10,
    zIndex: 5,
  },
  capsuleTickLine: {
    position: 'absolute',
    right: 0,
    width: 10,
    height: 2,
    borderRadius: 1,
    backgroundColor: '#8FBBEF',
  },
  fluidContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    justifyContent: 'flex-end',
  },
  fluidFill: {
    width: '100%',
    borderBottomLeftRadius: 38,
    borderBottomRightRadius: 38,
  },
  fluidStarParticle1: {
    position: 'absolute',
    bottom: 30,
    left: 18,
    zIndex: 4,
  },
  fluidStarParticle2: {
    position: 'absolute',
    bottom: 60,
    right: 18,
    zIndex: 4,
  },
  capsuleCenterIcon: {
    position: 'absolute',
    alignSelf: 'center',
    top: '42%',
    zIndex: 7,
  },
  capsuleCorkBottom: {
    width: 44,
    height: 12,
    backgroundColor: '#DF8900',
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    borderWidth: 1.5,
    borderColor: '#F9A000',
    marginTop: -3,
    zIndex: 3,
  },
  organicCountSection: {
    alignItems: 'center',
    gap: 3,
    marginTop: 4,
  },
  organicCountNumber: {
    fontFamily: typography.fontPromptExtraBold,
    fontSize: 36,
    color: colors.primaryDark,
    letterSpacing: -1,
  },
  organicCountLabel: {
    fontFamily: typography.fontPromptSemiBold,
    fontSize: 12.5,
    color: colors.primaryDark,
    textAlign: 'center',
  },
  organicProgressTrack: {
    width: 130,
    height: 4,
    backgroundColor: colors.ringTrack,
    borderRadius: 2,
    overflow: 'hidden',
    marginTop: 6,
  },
  organicProgressFill: {
    height: '100%',
    borderRadius: 2,
  },
  actionSection: {
    width: '100%',
    maxWidth: 340,
    minHeight: 52, // Preserves exact height for proceed button!
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 6,
  },
  organicSensorHint: {
    fontFamily: typography.fontPromptRegular,
    fontSize: 11.5,
    color: colors.primaryDark,
    opacity: 0.72,
    textAlign: 'center',
  },
});
