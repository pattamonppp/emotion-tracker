import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { audioService } from '../../../services/audioService';
import { MoocaMascot } from '../../../components/MoocaMascot';
import { useSky } from '../../../components/DynamicSkyEngine';
import { MarshmallowButton } from '../../../design-system/MarshmallowButton';
import { Wind, Heart, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { getTranslation } from '../../../locales';
import { BREATHING_CONFIG } from '../constants';
import styles from './styles.module.scss';

export interface SomaticBreathingPacerProps {
  onComplete: () => void;
  lang: 'th' | 'en';
  pattern?: 'box' | 'relax478';
}

type BreathPattern = 'box' | 'relax478';
type PhaseType = 'inhale' | 'hold1' | 'exhale' | 'hold2';

const ORB_SIZE = 220;
const SVG_R = (ORB_SIZE - 20) / 2;
const CIRCUMFERENCE = 2 * Math.PI * SVG_R;

export const SomaticBreathingPacer: React.FC<SomaticBreathingPacerProps> = ({
  onComplete,
  lang,
  pattern = 'box',
}) => {
  const t = getTranslation(lang);
  const strings = t.phases.phase2.breathingPacer;
  const { activePeriod } = useSky();
  const [isStarted, setIsStarted] = useState(false);
  const [phase, setPhase] = useState<PhaseType>('inhale');
  const [phaseProgress, setPhaseProgress] = useState(0);
  const [phaseSecondsLeft, setPhaseSecondsLeft] = useState(4);
  const [cycleCount, setCycleCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [bpmEstimate, setBpmEstimate] = useState(105);

  const isNight = activePeriod === 'night';
  const isSunset = activePeriod === 'sunset';
  const isDawn = activePeriod === 'dawn';

  const getPhaseDuration = (pat: BreathPattern, ph: PhaseType): number => {
    if (pat === 'box') return BREATHING_CONFIG.BOX_PATTERN.inhale;
    switch (ph) {
      case 'inhale': return BREATHING_CONFIG.PATTERN_478.inhale;
      case 'hold1': return BREATHING_CONFIG.PATTERN_478.hold;
      case 'exhale': return BREATHING_CONFIG.PATTERN_478.exhale;
      case 'hold2': return 1;
    }
  };

  const advancePhase = () => {
    if (phase === 'inhale') {
      setPhase('hold1');
    } else if (phase === 'hold1') {
      setPhase('exhale');
      setBpmEstimate((prev) => Math.max(74, prev - Math.floor(Math.random() * 4 + 4)));
    } else if (phase === 'exhale') {
      if (pattern === 'box') {
        setPhase('hold2');
      } else {
        completeCycle();
      }
    } else if (phase === 'hold2') {
      completeCycle();
    }
  };

  const completeCycle = () => {
    const nextCycle = cycleCount + 1;
    setCycleCount(nextCycle);

    if (nextCycle >= 3) {
      setIsFinished(true);
      audioService.triggerHaptic('success');
      audioService.playChimeShockwave();
    } else {
      setPhase('inhale');
    }
  };

  useEffect(() => {
    if (!isStarted || isFinished) return;

    const currentDuration = getPhaseDuration(pattern, phase);
    setPhaseSecondsLeft(currentDuration);

    const stepInterval = 100;
    let elapsedMs = 0;

    audioService.triggerHaptic(phase === 'inhale' ? 'medium' : 'light');

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

  const getPhaseInstruction = () => {
    if (!isStarted) return strings.startPrompt;
    switch (phase) {
      case 'inhale': return strings.phaseInhale;
      case 'hold1': return strings.phaseHold;
      case 'exhale': return strings.phaseExhale;
      case 'hold2': return strings.phaseHoldEmpty;
    }
  };

  const strokeDashoffset = CIRCUMFERENCE - (CIRCUMFERENCE * phaseProgress) / 100;

  const currentDuration = getPhaseDuration(pattern, phase);

  const orbScale = !isStarted
    ? 1
    : phase === 'inhale' || phase === 'hold1'
    ? 1.32
    : 1.0;

  const auraOpacity = !isStarted
    ? 0.4
    : phase === 'inhale'
    ? 0.85
    : phase === 'hold1'
    ? 0.7
    : phase === 'exhale'
    ? 0.35
    : 0.3;

  return (
    <div className={styles.container}>
      {/* 1. Mascot View (Height: 145px) */}
      <div className={styles.mascotWrapper}>
        <MoocaMascot
          mood={isFinished ? 'celebrating' : !isStarted ? 'happy' : phase === 'inhale' ? 'happy' : 'comforting'}
          size="sm"
          speakingBubble={
            isFinished
              ? strings.bubbleDone
              : !isStarted
              ? pattern === 'box'
                ? strings.bubbleBox
                : strings.bubble478
              : strings.caption
          }
        />
      </div>

      {/* 2. Interactive Pacing Breathing Orb */}
      <div className={styles.orbSection}>
        {/* Soft Radiating Ambient Aura */}
        <div
          className={classNames(styles.ambientAura, {
            [styles.auraFinished]: isFinished,
            [styles.auraExhale]: phase === 'exhale',
          })}
          style={{
            transform: `scale(${orbScale * 1.15})`,
            opacity: auraOpacity,
            transition: `transform ${currentDuration}s cubic-bezier(0.45, 0.05, 0.55, 0.95), opacity ${currentDuration}s ease`,
          }}
        />

        {/* Pacing Circle Body */}
        <button
          type="button"
          disabled={isStarted}
          onClick={() => {
            if (!isStarted) {
              audioService.triggerHaptic('medium');
              setIsStarted(true);
            }
          }}
          className={classNames(styles.orbBody, {
            [styles.orbFinished]: isFinished,
          })}
          style={{
            transform: `scale(${orbScale})`,
            transition: `transform ${currentDuration}s cubic-bezier(0.45, 0.05, 0.55, 0.95)`,
          }}
        >
          {/* SVG Progress Ring */}
          <svg width={ORB_SIZE} height={ORB_SIZE} className={styles.svgRing}>
            <circle
              cx={ORB_SIZE / 2}
              cy={ORB_SIZE / 2}
              r={SVG_R}
              stroke="rgba(0, 196, 179, 0.16)"
              strokeWidth={5}
              fill="transparent"
            />
            <circle
              cx={ORB_SIZE / 2}
              cy={ORB_SIZE / 2}
              r={SVG_R}
              stroke="#00C4B3"
              strokeWidth={6}
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={isStarted ? strokeDashoffset : 0}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>

          {/* Central Counter Display */}
          <div className={styles.orbContent}>
            {!isStarted ? (
              <div className={styles.startOrbContainer}>
                <Wind size={36} color="#00C4B3" strokeWidth={2.4} />
                <span className={styles.startOrbTitle}>
                  {pattern === 'box' ? strings.badgeBox : strings.badge478}
                </span>
                <span className={styles.startOrbSub}>
                  {strings.startPrompt}
                </span>
              </div>
            ) : isFinished ? (
              <div className={styles.finishedContent}>
                <CheckCircle2 size={40} color="#10B981" strokeWidth={2.4} />
                <span className={styles.finishedTitle}>
                  {strings.bubbleDone}
                </span>
              </div>
            ) : (
              <>
                <span className={styles.secondsText}>{phaseSecondsLeft}s</span>
                <span className={styles.phaseLabelText}>
                  {phase === 'inhale'
                    ? strings.inhalePrompt
                    : phase === 'hold1' || phase === 'hold2'
                    ? strings.holdPrompt
                    : strings.exhalePrompt}
                </span>
                <span className={styles.cycleCounterText}>
                  {strings.cycleCount.replace('{current}', String(cycleCount + 1)).replace('{total}', '3')}
                </span>
              </>
            )}
          </div>
        </button>
      </div>

      {/* 3. Bottom Guidance & Action Button */}
      <div className={styles.bottomSection}>
        <span className={classNames(styles.organicInstructionText, { [styles.textNight]: isNight })}>
          {isFinished ? strings.caption : getPhaseInstruction()}
        </span>

        <div className={styles.pulseIndicatorRow}>
          <Heart size={13} color="#00C4B3" fill="#00C4B3" />
          <span className={classNames(styles.pulseIndicatorText, { [styles.textNight]: isNight })}>
            {strings.bpmEstimate.replace('{bpm}', String(bpmEstimate))}
          </span>
        </div>

        {isFinished ? (
          <div className={styles.actionBtnWrapper}>
            <MarshmallowButton
              variant="primary"
              size="md"
              onPress={onComplete}
              icon={<ArrowRight size={16} color="#FFFFFF" />}
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
