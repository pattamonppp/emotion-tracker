import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { Wind, Heart, CheckCircle2, Check } from 'lucide-react';

import { audioService, HAPTIC_STYLE } from '../../../services/audioService';
import { MOOCA_MOOD, MoocaMascot } from '../../../components/MoocaMascot';
import { MARSHMALLOW_SIZE, MARSHMALLOW_VARIANT, MarshmallowButton } from '../../../design-system/MarshmallowButton';
import { getTranslation } from '../../../locales';
import { BREATHING_CONFIG } from '../constants';
import { useSkyTheme } from '../../../hooks/useSkyTheme';
import { Language } from '../../../types';

import styles from './styles.module.scss';
import { DESIGN_TOKENS } from '@/design-system/tokens';
import { renderBilingual } from '@/components/BilingualText';

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

export interface SomaticBreathingPacerProps {
  onComplete: () => void;
  lang: Language;
  pattern?: BreathPattern;
}

const ORB_SIZE = 220;
const SVG_R = (ORB_SIZE - 20) / 2;
const CIRCUMFERENCE = 2 * Math.PI * SVG_R;

export const SomaticBreathingPacer: React.FC<
  SomaticBreathingPacerProps
> = ({ onComplete, lang, pattern = BREATH_PATTERN.BOX }) => {
  const t = getTranslation(lang);
  const strings = t.phases.phase2.breathingPacer;
  const skyTheme = useSkyTheme();

  const [isStarted, setIsStarted] = useState(false);
  const [phase, setPhase] = useState<PhaseType>(BREATH_PHASE.INHALE);
  const [phaseProgress, setPhaseProgress] = useState(0);
  const [phaseSecondsLeft, setPhaseSecondsLeft] = useState(4);
  const [cycleCount, setCycleCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [bpmEstimate, setBpmEstimate] = useState(105);

  const getPhaseDuration = (
    pat: BreathPattern,
    ph: PhaseType,
  ): number => {
    if (pat === BREATH_PATTERN.BOX) {
      return BREATHING_CONFIG.BOX_PATTERN.inhale;
    }

    switch (ph) {
      case BREATH_PHASE.INHALE:
        return BREATHING_CONFIG.PATTERN_478.inhale;
      case BREATH_PHASE.HOLD1:
        return BREATHING_CONFIG.PATTERN_478.hold;
      case BREATH_PHASE.EXHALE:
        return BREATHING_CONFIG.PATTERN_478.exhale;
      case BREATH_PHASE.HOLD2:
        return 1;
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
      setPhaseProgress(0);
    }
  };

  const advancePhase = () => {
    if (phase === BREATH_PHASE.INHALE) {
      setPhase(BREATH_PHASE.HOLD1);
    } else if (phase === BREATH_PHASE.HOLD1) {
      setPhase(BREATH_PHASE.EXHALE);
      setBpmEstimate((prev) =>
        Math.max(74, prev - Math.floor(Math.random() * 4 + 4)),
      );
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

  useEffect(() => {
    if (!isStarted || isFinished) {
      return;
    }

    const currentDuration = getPhaseDuration(pattern, phase);

    setPhaseSecondsLeft(currentDuration);
    setPhaseProgress(0);

    const stepInterval = 100;
    let elapsedMs = 0;

    audioService.triggerHaptic(
      phase === BREATH_PHASE.INHALE ? HAPTIC_STYLE.MEDIUM : HAPTIC_STYLE.LIGHT,
    );

    const timer = setInterval(() => {
      elapsedMs += stepInterval;

      const progressRatio = Math.min(
        1,
        elapsedMs / (currentDuration * 1000),
      );

      setPhaseProgress(progressRatio * 100);

      setPhaseSecondsLeft(
        Math.max(
          1,
          Math.ceil(currentDuration - elapsedMs / 1000),
        ),
      );

      if (elapsedMs >= currentDuration * 1000) {
        clearInterval(timer);
        advancePhase();
      }
    }, stepInterval);

    return () => clearInterval(timer);
  }, [phase, pattern, isStarted, isFinished]);

  const getPhaseInstruction = () => {
    if (!isStarted) {
      return strings.startPrompt;
    }

    switch (phase) {
      case BREATH_PHASE.INHALE:
        return strings.phaseInhale;
      case BREATH_PHASE.HOLD1:
        return strings.phaseHold;
      case BREATH_PHASE.EXHALE:
        return strings.phaseExhale;
      case BREATH_PHASE.HOLD2:
        return strings.phaseHoldEmpty;
    }
  };

  const currentDuration = getPhaseDuration(pattern, phase);

  const orbScale = !isStarted
    ? 1
    : phase === BREATH_PHASE.INHALE || phase === BREATH_PHASE.HOLD1
      ? 1.32
      : 1;

  const auraOpacity = !isStarted
    ? 0.4
    : phase === BREATH_PHASE.INHALE
      ? 0.85
      : phase === BREATH_PHASE.HOLD1
        ? 0.7
        : phase === BREATH_PHASE.EXHALE
          ? 0.35
          : 0.3;

  const strokeDashoffset =
    CIRCUMFERENCE -
    (CIRCUMFERENCE * phaseProgress) / 100;

  const orbBorderColor = isFinished
    ? '#10B981'
    : !isStarted
      ? skyTheme.orbBorder
      : phase === BREATH_PHASE.EXHALE
        ? DESIGN_TOKENS.color.brand.turquoise.primary
        : skyTheme.ringProgress;

  const progressColor = isStarted
    ? phase === BREATH_PHASE.EXHALE
      ? DESIGN_TOKENS.color.brand.turquoise.primary
      : skyTheme.ringProgress
    : skyTheme.ringProgress;

  return (
    <div className={styles.container}>
      {/* 1. Mascot */}
      <div className={styles.mascotWrapper}>
        <MoocaMascot
          mood={
            isFinished
              ? MOOCA_MOOD.CELEBRATING
              : !isStarted
                ? MOOCA_MOOD.HAPPY
                : phase === BREATH_PHASE.INHALE
                  ? MOOCA_MOOD.HAPPY
                  : MOOCA_MOOD.COMFORTING
          }
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
      </div>

      {/* 2. Breathing Orb */}
      <div className={styles.orbSection}>
        <div
          className={classNames(styles.ambientAura, {
            [styles.auraFinished]: isFinished,
            [styles.auraExhale]: phase === BREATH_PHASE.EXHALE,
          })}
          style={{
            width: ORB_SIZE * 1.15,
            height: ORB_SIZE * 1.15,
            transform: `scale(${orbScale})`,
            opacity: auraOpacity,
            transition: `
              transform ${currentDuration}s cubic-bezier(
                0.45, 0.05, 0.55, 0.95
              ),
              opacity ${currentDuration}s ease
            `,
          }}
        />

        <button
          type="button"
          disabled={isStarted}
          onClick={() => {
            if (!isStarted) {
              audioService.triggerHaptic(HAPTIC_STYLE.MEDIUM);
              setIsStarted(true);
            }
          }}
          className={classNames(styles.orbBody, {
            [styles.orbFinished]: isFinished,
          })}
          style={{
            width: ORB_SIZE,
            height: ORB_SIZE,
            borderRadius: '50%',
            borderColor: orbBorderColor as string,
            transform: `scale(${orbScale})`,
            transition: `
      transform ${currentDuration}s cubic-bezier(
        0.45, 0.05, 0.55, 0.95
      ),
      border-color 220ms ease
    `,
          }}
        >
          <svg
            width={ORB_SIZE}
            height={ORB_SIZE}
            viewBox={`0 0 ${ORB_SIZE} ${ORB_SIZE}`}
            className={styles.svgRing}
          >
            <circle
              cx={ORB_SIZE / 2}
              cy={ORB_SIZE / 2}
              r={SVG_R}
              stroke={skyTheme.ringTrack}
              strokeWidth={5}
              fill="none"
            />

            <circle
              cx={ORB_SIZE / 2}
              cy={ORB_SIZE / 2}
              r={SVG_R}
              stroke={progressColor as string}
              strokeWidth={6}
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={
                isStarted ? strokeDashoffset : 0
              }
              strokeLinecap="round"
              fill="none"
              className={styles.progressRing}
            />
          </svg>

          <div className={styles.orbContent}>
            {!isStarted ? (
              <div className={styles.startOrbContainer}>
                <Wind
                  size={36}
                  color={skyTheme.orbBorder}
                  strokeWidth={2.4}
                />

                <span
                  className={styles.startOrbTitle}
                  style={{ color: skyTheme.secondsColor }}
                >
                  {renderBilingual(
                    pattern === BREATH_PATTERN.BOX
                      ? strings.badgeBox
                      : strings.badge478
                  )}
                </span>

                <span
                  className={styles.startOrbSub}
                  style={{ color: skyTheme.cycleCounterColor }}
                >
                  {renderBilingual(strings.startPrompt)}
                </span>
              </div>
            ) : isFinished ? (
              <div className={styles.finishedContent}>
                <CheckCircle2
                  size={40}
                  color="#10B981"
                  strokeWidth={2.4}
                />

                <span className={styles.finishedTitle}>
                  {strings.bubbleDone}
                </span>
              </div>
            ) : (
              <>
                <span
                  className={styles.secondsText}
                  style={{ color: skyTheme.secondsColor }}
                >
                  {phaseSecondsLeft}s
                </span>

                <span
                  className={styles.phaseLabelText}
                  style={{ color: skyTheme.phaseLabelColor }}
                >
                  {phase === BREATH_PHASE.INHALE
                    ? strings.inhalePrompt
                    : phase === BREATH_PHASE.HOLD1 || phase === BREATH_PHASE.HOLD2
                      ? strings.holdPrompt
                      : strings.exhalePrompt}
                </span>

                <span
                  className={styles.cycleCounterText}
                  style={{ color: skyTheme.cycleCounterColor }}
                >
                  {strings.cycleCount
                    .replace('{current}', String(cycleCount + 1))
                    .replace('{total}', '3')}
                </span>
              </>
            )}
          </div>
        </button>
      </div>

      {/* 3. Guidance */}
      <div className={styles.bottomSection}>
        <span
          className={styles.organicInstructionText}
          style={{
            color: skyTheme.instructionColor,
          }}
        >
          {isFinished
            ? strings.caption
            : getPhaseInstruction()}
        </span>

        <div className={styles.pulseIndicatorRow}>
          <Heart
            size={13}
            color={skyTheme.heartColor}
            fill={skyTheme.heartColor}
          />

          <span
            className={styles.pulseIndicatorText}
            style={{
              color: skyTheme.pulseColor,
            }}
          >
            {strings.bpmEstimate.replace(
              '{bpm}',
              String(bpmEstimate),
            )}
          </span>
        </div>

        {isFinished ? (
          <div className={styles.actionBtnWrapper}>
            <MarshmallowButton
              variant={MARSHMALLOW_VARIANT.PRIMARY}
              size={MARSHMALLOW_SIZE.MD}
              onPress={onComplete}
              icon={
                <Check
                  size={18}
                  color="#FFFFFF"
                  strokeWidth={2.4}
                />
              }
              title={strings.proceedBtn}
            />
          </div>
        ) : (
          <div className={styles.actionBtnPlaceholder} />
        )}
      </div>
    </div>
  );
};

export default SomaticBreathingPacer;