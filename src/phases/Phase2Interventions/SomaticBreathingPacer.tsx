import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { audioService, HAPTIC_STYLE } from '../../services/audioService';
import { MOOCA_MOOD, MoocaMascot } from '../../components/MoocaMascot';
import { useSkyTheme } from '../../hooks/useSkyTheme';
import { MARSHMALLOW_SIZE, MARSHMALLOW_VARIANT, MarshmallowButton } from '../../design-system/MarshmallowButton';
import { Wind, Heart, CheckCircle2, ArrowRight } from 'lucide-react-native';
import { colors, shadows, typography } from '../../design-system/tokens';
import { getTranslation } from '../../locales';
import { Language } from '../../types';

import { BREATHING_CONFIG } from './constants';

export const BREATH_PATTERN = {
  BOX: 'box',
  RELAX_478: 'relax478',
} as const;

export const BREATH_PHASE = {
  INHALE: 'inhale',
  HOLD1: 'hold1',
  EXHALE: 'exhale',
  HOLD2: 'hold2',
} as const;

export type BreathPattern = typeof BREATH_PATTERN[keyof typeof BREATH_PATTERN];
export type PhaseType = typeof BREATH_PHASE[keyof typeof BREATH_PHASE];

interface SomaticBreathingPacerProps {
  onComplete: () => void;
  lang: Language;
  pattern?: BreathPattern;
}

const { width: SCREEN_W } = Dimensions.get('window');
const ORB_SIZE = Math.min(SCREEN_W * 0.62, 220);
const SVG_R = (ORB_SIZE - 20) / 2;
const CIRCUMFERENCE = 2 * Math.PI * SVG_R;

export const SomaticBreathingPacer: React.FC<SomaticBreathingPacerProps> = ({
  onComplete,
  lang,
  pattern = BREATH_PATTERN.BOX,
}) => {
  const t = getTranslation(lang);
  const strings = t.phases.phase2.breathingPacer;
  const skyColors = useSkyTheme();
  const [isStarted, setIsStarted] = useState(false);
  const [phase, setPhase] = useState<PhaseType>(BREATH_PHASE.INHALE);
  const [phaseProgress, setPhaseProgress] = useState(0); // 0 to 100
  const [phaseSecondsLeft, setPhaseSecondsLeft] = useState(4);
  const [cycleCount, setCycleCount] = useState(0); // 0 to 3
  const [isFinished, setIsFinished] = useState(false);
  const [bpmEstimate, setBpmEstimate] = useState(105);

  const orbScaleAnim = useRef(new Animated.Value(1)).current;
  const auraGlowAnim = useRef(new Animated.Value(0.4)).current;



  // Pattern durations in seconds
  const getPhaseDuration = (pat: BreathPattern, ph: PhaseType): number => {
    if (pat === BREATH_PATTERN.BOX) return BREATHING_CONFIG.BOX_PATTERN.inhale;
    switch (ph) {
      case BREATH_PHASE.INHALE: return BREATHING_CONFIG.PATTERN_478.inhale;
      case BREATH_PHASE.HOLD1: return BREATHING_CONFIG.PATTERN_478.hold;
      case BREATH_PHASE.EXHALE: return BREATHING_CONFIG.PATTERN_478.exhale;
      case BREATH_PHASE.HOLD2: return 1;
    }
  };

  // Animate orb scale based on phase
  useEffect(() => {
    if (!isStarted) {
      orbScaleAnim.setValue(1);
      auraGlowAnim.setValue(0.4);
      return;
    }

    const duration = getPhaseDuration(pattern, phase) * 1000;
    let targetScale = 1;
    let targetGlow = 0.4;

    if (phase === BREATH_PHASE.INHALE) {
      targetScale = 1.32;
      targetGlow = 0.85;
    } else if (phase === BREATH_PHASE.HOLD1) {
      targetScale = 1.32;
      targetGlow = 0.7;
    } else if (phase === BREATH_PHASE.EXHALE) {
      targetScale = 1.0;
      targetGlow = 0.35;
    } else {
      targetScale = 1.0;
      targetGlow = 0.3;
    }

    Animated.parallel([
      Animated.timing(orbScaleAnim, {
        toValue: targetScale,
        duration,
        easing: Easing.inOut(Easing.sin),
        useNativeDriver: true,
      }),
      Animated.timing(auraGlowAnim, {
        toValue: targetGlow,
        duration,
        easing: Easing.inOut(Easing.sin),
        useNativeDriver: true,
      }),
    ]).start();
  }, [phase, pattern, isStarted]);

  // Main breath clock - ONLY runs when isStarted is true
  useEffect(() => {
    if (!isStarted || isFinished) return;

    const currentDuration = getPhaseDuration(pattern, phase);
    setPhaseSecondsLeft(currentDuration);

    const stepInterval = 100;
    let elapsedMs = 0;

    // Trigger subtle haptic on phase shift
    audioService.triggerHaptic(phase === BREATH_PHASE.INHALE ? HAPTIC_STYLE.MEDIUM : HAPTIC_STYLE.LIGHT);

    const timer = setInterval(() => {
      elapsedMs += stepInterval;
      const progressRatio = Math.min(1, elapsedMs / (currentDuration * 1000));
      setPhaseProgress(progressRatio * 100);
      setPhaseSecondsLeft(Math.max(1, Math.ceil(currentDuration - elapsedMs / 1000)));

      if (elapsedMs >= currentDuration * 1000) {
        clearInterval(timer);
        advancePhase();
      }
    }, stepInterval);

    return () => clearInterval(timer);
  }, [phase, pattern, isStarted, isFinished]);

  const advancePhase = () => {
    if (phase === BREATH_PHASE.INHALE) {
      setPhase(BREATH_PHASE.HOLD1);
    } else if (phase === BREATH_PHASE.HOLD1) {
      setPhase(BREATH_PHASE.EXHALE);
      setBpmEstimate((prev) => Math.max(74, prev - Math.floor(Math.random() * 4 + 4)));
    } else if (phase === BREATH_PHASE.EXHALE) {
      if (pattern === BREATH_PATTERN.BOX) {
        setPhase(BREATH_PHASE.HOLD2);
      } else {
        completeCycle();
      }
    } else if (phase === BREATH_PHASE.HOLD2) {
      completeCycle();
    }
  };

  const completeCycle = () => {
    const nextCycle = cycleCount + 1;
    setCycleCount(nextCycle);

    if (nextCycle >= 3) {
      setIsFinished(true);
      audioService.triggerHaptic(HAPTIC_STYLE.SUCCESS);
      audioService.playChimeShockwave();
    } else {
      setPhase(BREATH_PHASE.INHALE);
    }
  };

  const getPhaseInstruction = () => {
    if (!isStarted) {
      return strings.startPrompt;
    }
    switch (phase) {
      case BREATH_PHASE.INHALE: return strings.phaseInhale;
      case BREATH_PHASE.HOLD1: return strings.phaseHold;
      case BREATH_PHASE.EXHALE: return strings.phaseExhale;
      case BREATH_PHASE.HOLD2: return strings.phaseHoldEmpty;
    }
  };

  const strokeDashoffset = CIRCUMFERENCE - (CIRCUMFERENCE * phaseProgress) / 100;

  return (
    <View style={styles.container}>
      {/* 1. Header & Mooca Mascot - Standardized height matching screens A-D */}
      <View style={styles.mascotWrapper}>
        <MoocaMascot
          mood={isFinished ? MOOCA_MOOD.CELEBRATING : !isStarted ? MOOCA_MOOD.HAPPY : phase === BREATH_PHASE.INHALE ? MOOCA_MOOD.HAPPY : MOOCA_MOOD.COMFORTING}
          size="sm"
          speakingBubble={
            isFinished
              ? strings.bubbleDone
              : !isStarted
                ? pattern === BREATH_PATTERN.BOX
                  ? strings.bubbleBox
                  : strings.bubble478
                : strings.caption
          }
        />
      </View>

      {/* 2. Interactive Pacing Breathing Orb */}
      <View style={styles.orbSection}>
        {/* Soft Ambient Radiating Aura */}
        <Animated.View
          style={[
            styles.ambientAura,
            {
              width: ORB_SIZE * 1.15,
              height: ORB_SIZE * 1.15,
              borderRadius: (ORB_SIZE * 1.15) / 2,
              backgroundColor: isFinished
                ? 'rgba(16, 185, 129, 0.25)'
                : phase === BREATH_PHASE.EXHALE
                  ? 'rgba(0, 203, 167, 0.32)'
                  : 'rgba(0, 203, 167, 0.20)',
              transform: [{ scale: orbScaleAnim }],
              opacity: auraGlowAnim,
            },
          ]}
          pointerEvents="none"
        />

        {/* Pacing Circle Body */}
        <TouchableOpacity
          activeOpacity={0.88}
          disabled={isStarted}
          onPress={() => {
            if (!isStarted) {
              audioService.triggerHaptic(HAPTIC_STYLE.MEDIUM);
              setIsStarted(true);
            }
          }}
        >
          <Animated.View
            style={[
              styles.orbBody,
              {
                width: ORB_SIZE,
                height: ORB_SIZE,
                borderRadius: ORB_SIZE / 2,
                borderColor: isFinished
                  ? '#10B981'
                  : !isStarted
                    ? skyColors.orbBorder
                    : phase === BREATH_PHASE.EXHALE
                      ? colors.primary
                      : skyColors.ringProgress,
                transform: [{ scale: orbScaleAnim }],
              },
            ]}
          >
            {/* SVG Progress Ring */}
            <Svg
              width={ORB_SIZE}
              height={ORB_SIZE}
              style={styles.svgRing}
            >
              <Circle
                cx={ORB_SIZE / 2}
                cy={ORB_SIZE / 2}
                r={SVG_R}
                stroke={skyColors.ringTrack}
                strokeWidth={5}
                fill="transparent"
              />
              <Circle
                cx={ORB_SIZE / 2}
                cy={ORB_SIZE / 2}
                r={SVG_R}
                stroke={isStarted ? (phase === BREATH_PHASE.EXHALE ? colors.primary : skyColors.ringProgress) : skyColors.ringProgress}
                strokeWidth={6}
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={isStarted ? strokeDashoffset : 0}
                strokeLinecap="round"
                fill="transparent"
              />
            </Svg>

            {/* Central Counter Display */}
            <View style={styles.orbContent}>
              {!isStarted ? (
                <View style={styles.startOrbContainer}>
                  <Wind size={36} color={skyColors.orbBorder} strokeWidth={2.4} />
                  <Text style={[styles.startOrbTitle, { color: skyColors.secondsColor }]}>
                    {pattern === BREATH_PATTERN.BOX ? strings.badgeBox : strings.badge478}
                  </Text>
                  <Text style={[styles.startOrbSub, { color: skyColors.cycleCounterColor }]}>
                    {strings.startPrompt}
                  </Text>
                </View>
              ) : isFinished ? (
                <View style={styles.finishedContent}>
                  <CheckCircle2 size={40} color="#10B981" strokeWidth={2.4} />
                  <Text style={styles.finishedTitle}>
                    {strings.bubbleDone}
                  </Text>
                </View>
              ) : (
                <>
                  <Text style={[styles.secondsText, { color: skyColors.secondsColor }]}>{phaseSecondsLeft}s</Text>
                  <Text style={[styles.phaseLabelText, { color: skyColors.phaseLabelColor }]}>
                    {phase === BREATH_PHASE.INHALE
                      ? strings.inhalePrompt
                      : phase === BREATH_PHASE.HOLD1 || phase === BREATH_PHASE.HOLD2
                        ? strings.holdPrompt
                        : strings.exhalePrompt}
                  </Text>
                  <Text style={[styles.cycleCounterText, { color: skyColors.cycleCounterColor }]}>
                    {strings.cycleCount.replace('{current}', String(cycleCount + 1)).replace('{total}', '3')}
                  </Text>
                </>
              )}
            </View>
          </Animated.View>
        </TouchableOpacity>
      </View>

      {/* 3. Bottom Guidance & Action Button (Minimalist, No nested badges) */}
      <View style={styles.bottomSection}>
        <Text style={[styles.organicInstructionText, { color: skyColors.instructionColor }]}>
          {isFinished
            ? strings.caption
            : getPhaseInstruction()}
        </Text>

        <View style={styles.pulseIndicatorRow}>
          <Heart size={13} color={skyColors.heartColor} fill={skyColors.heartColor} />
          <Text style={[styles.pulseIndicatorText, { color: skyColors.pulseColor }]}>
            {strings.bpmEstimate.replace('{bpm}', String(bpmEstimate))}
          </Text>
        </View>

        {isFinished ? (
          <View style={styles.actionBtnWrapper}>
            <MarshmallowButton
              variant={MARSHMALLOW_VARIANT.PRIMARY}
              size={MARSHMALLOW_SIZE.MD}
              onPress={onComplete}
              icon={<ArrowRight size={16} color="#FFFFFF" />}
              title={strings.proceedBtn}
            />
          </View>
        ) : (
          <View style={styles.actionBtnPlaceholder} />
        )}
      </View>
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
    paddingHorizontal: 20,
  },
  mascotWrapper: {
    overflow: 'visible',
    height: 145,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 4,
  },
  startOrbContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  startOrbTitle: {
    fontFamily: typography.fontPromptBold,
    fontSize: 15,
    color: colors.primaryDark,
    marginTop: 4,
  },
  startOrbSub: {
    fontFamily: typography.fontPromptSemiBold,
    fontSize: 11,
    color: colors.primary,
  },
  orbSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginVertical: 8,
  },
  ambientAura: {
    position: 'absolute',
  },
  orbBody: {
    backgroundColor: colors.white,
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    ...shadows.soft,
  },
  svgRing: {
    position: 'absolute',
    transform: [{ rotate: '-90deg' }],
  },
  orbContent: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
  },
  secondsText: {
    fontFamily: typography.fontGothamBold,
    fontSize: 38,
    color: colors.primaryDark,
    letterSpacing: -1,
  },
  phaseLabelText: {
    fontFamily: typography.fontPromptBold,
    fontSize: 12,
    color: colors.secondary,
    letterSpacing: 1,
    marginTop: -2,
  },
  cycleCounterText: {
    fontFamily: typography.fontPromptMedium,
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 4,
  },
  finishedContent: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  finishedTitle: {
    fontFamily: typography.fontPromptMedium,
    fontSize: 11,
    color: '#637B91',
    textAlign: 'center',
    lineHeight: 18,
    marginTop: 10,
  },
  bottomSection: {
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
    paddingBottom: 4,
    gap: 6,
  },
  organicInstructionText: {
    fontFamily: typography.fontPromptMedium,
    fontSize: 12,
    color: colors.primaryDark,
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 290,
  },
  pulseIndicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 3,
    marginTop: 6,
  },
  pulseIndicatorText: {
    fontFamily: typography.fontPromptRegular,
    fontSize: 11,
    color: colors.textMuted,
  },
  actionBtnWrapper: {
    width: '100%',
    height: 46,
    justifyContent: 'center',
    marginTop: 4,
  },
  actionBtnPlaceholder: {
    width: '100%',
    height: 46,
    marginTop: 4,
  },
});
