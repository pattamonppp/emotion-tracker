import React, { useState, useEffect, useRef } from 'react';
import cn from 'classnames';
import { audioService } from '../../../services/audioService';
import { Button } from '../../../components/Button';
import { MoocaMascot } from '../../../components/MoocaMascot';
import {
  ZapIcon,
  CheckCircleIcon,
  SparklesIcon,
  CheckIcon,
} from '../../../icons';
import { useLanguage } from '../../../hooks';
import {
  KINETIC_MODE,
  type KineticMode,
  KINETIC_CYCLES,
  SENSOR_CONFIG,
} from './constants';
import styles from './styles.module.scss';

export interface KineticShakerProps {
  onComplete: () => void;
  lang?: 'th' | 'en';
}

export const KineticShaker: React.FC<KineticShakerProps> = ({
  onComplete,
}) => {
  const { t, lang } = useLanguage();
  const strings = t.phases.phase2.kineticShaker;
  const [mode, setMode] = useState<KineticMode>(KINETIC_MODE.SHAKE);
  const [shakesLeft, setShakesLeft] = useState<number>(KINETIC_CYCLES.shake);
  const [bouncesLeft, setBouncesLeft] = useState<number>(KINETIC_CYCLES.bounce);
  const [isShaking, setIsShaking] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const lastShakeTime = useRef(0);

  // Listen to accelerometer DeviceMotion if hardware permits
  useEffect(() => {
    const handleMotion = (e: DeviceMotionEvent) => {
      const acc = e.accelerationIncludingGravity;
      if (!acc) return;
      const totalAcc = Math.sqrt((acc.x || 0) ** 2 + (acc.y || 0) ** 2 + (acc.z || 0) ** 2);

      const now = Date.now();
      if (
        totalAcc > SENSOR_CONFIG.ACCELEROMETER_THRESHOLD &&
        now - lastShakeTime.current > SENSOR_CONFIG.DEBOUNCE_DELAY_MS
      ) {
        lastShakeTime.current = now;
        handleCycle();
      }
    };

    window.addEventListener('devicemotion', handleMotion);
    return () => window.removeEventListener('devicemotion', handleMotion);
  }, [shakesLeft, bouncesLeft, mode, isFinished]);

  const handleCycle = () => {
    if (isFinished) return;

    if (mode === KINETIC_MODE.SHAKE) {
      const remaining = Math.max(0, shakesLeft - 1);
      setShakesLeft(remaining);
      audioService.playShakerClick(remaining);
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), SENSOR_CONFIG.SHAKE_PULSE_DURATION_MS);

      if (remaining === 0) {
        finishIntervention();
      }
    } else {
      const remaining = Math.max(0, bouncesLeft - 1);
      setBouncesLeft(remaining);
      audioService.playShakerClick(remaining);
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), SENSOR_CONFIG.SHAKE_PULSE_DURATION_MS);

      if (remaining === 0) {
        finishIntervention();
      }
    }
  };

  const finishIntervention = () => {
    setIsFinished(true);
    audioService.playChimeShockwave();
    setTimeout(() => {
      onComplete();
    }, SENSOR_CONFIG.COMPLETION_TRANSITION_MS);
  };

  const totalCycles = mode === KINETIC_MODE.SHAKE ? KINETIC_CYCLES.shake : KINETIC_CYCLES.bounce;
  const currentRemaining = mode === KINETIC_MODE.SHAKE ? shakesLeft : bouncesLeft;
  const tensionPercentage = (currentRemaining / totalCycles) * 100;

  return (
    <div className={styles.container}>
      {/* Mode Switcher */}
      <div className={styles.modeSwitcher}>
        <div className={styles.modeBadge}>
          <ZapIcon />
          <span className={styles.modeBadgeText}>
            {strings.badge}
          </span>
        </div>

        <div className={styles.modeGroup}>
          <button
            type="button"
            onClick={() => setMode(KINETIC_MODE.SHAKE)}
            className={cn(styles.modeBtn, {
              [styles.active]: mode === KINETIC_MODE.SHAKE,
            })}
          >
            {strings.modeShake}
          </button>
          <button
            type="button"
            onClick={() => setMode(KINETIC_MODE.BOUNCE)}
            className={cn(styles.modeBtn, {
              [styles.active]: mode === KINETIC_MODE.BOUNCE,
            })}
          >
            {strings.modeBounce}
          </button>
        </div>
      </div>

      {/* Mooca Companion Guidance */}
      <div className={styles.guidanceSection}>
        <MoocaMascot
          mood={isFinished ? 'celebrating' : 'shaking'}
          size="xs"
          speakingBubble={
            isFinished
              ? strings.bubbleDone
              : mode === KINETIC_MODE.SHAKE
                ? strings.bubbleShake
                : strings.bubbleBounce
          }
        />

        <h3 className={styles.guidanceTitle}>
          <SparklesIcon />
          {mode === KINETIC_MODE.SHAKE
            ? strings.titleShake
            : strings.titleBounce}
        </h3>
        <p className={styles.guidanceDesc}>
          {mode === KINETIC_MODE.SHAKE
            ? strings.descShake
            : strings.descBounce}
        </p>
      </div>

      {/* Cozy Tension Gauge */}
      <div className={styles.gaugeZone}>
        {/* Tension Meter Tube */}
        <div className={styles.tensionMeterTube}>
          {/* Tension Fluid (Flamingo/Sunshade to Turquoise) */}
          <div
            className={styles.tensionFluid}
            style={{
              height: `${tensionPercentage}%`,
              background:
                tensionPercentage > 50
                  ? 'linear-gradient(180deg, #EF7773 0%, #FF8F4B 100%)'
                  : 'linear-gradient(180deg, #FF8F4B 0%, #00C4B3 100%)',
              boxShadow: '0 0 10px rgba(239, 119, 115, 0.3)',
            }}
          />

          {/* Scale Markings */}
          <div className={styles.scaleMarkings}>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className={styles.scaleMark} />
            ))}
          </div>
        </div>

        {/* Counter Display & Shake Feedback */}
        <div className={styles.counterCol}>
          <div
            className={cn(styles.counterCircle, {
              [styles.shaking]: isShaking,
              [styles.finished]: isFinished,
            })}
          >
            {isFinished ? (
              <CheckCircleIcon className={styles.checkmarkIcon} />
            ) : (
              <>
                <span className={styles.counterNumber}>{currentRemaining}</span>
                <span className={styles.counterLabel}>
                  {strings.cyclesLeft}
                </span>
              </>
            )}
          </div>

          <div className={styles.counterSubtext}>
            {isFinished ? (
              <span className={styles.finishedSubtext}>
                <CheckIcon />
                <span>{strings.released}</span>
              </span>
            ) : (
              strings.idleHint
            )}
          </div>
        </div>
      </div>

      {/* Action Trigger Button in Natural Thumb Zone */}
      <div className={styles.actionZone}>
        <Button
          variant="primary"
          colorTheme={isFinished ? 'turquoise' : 'red'}
          size="lg"
          fullWidth
          isDisabled={isFinished}
          onClick={handleCycle}
          leadingIcon={<ZapIcon />}
          label={
            isFinished
              ? strings.released
              : mode === KINETIC_MODE.SHAKE
                ? `${strings.modeShake} (${shakesLeft} ${strings.shakesLeft})`
                : `${strings.modeBounce} (${bouncesLeft} ${strings.bouncesLeft})`
          }
        />

        {isFinished && (
          <Button
            variant="secondary"
            colorTheme="turquoise"
            size="md"
            fullWidth
            onClick={onComplete}
            label={strings.proceedBtn}
          />
        )}
      </div>
    </div>
  );
};

export default KineticShaker;
