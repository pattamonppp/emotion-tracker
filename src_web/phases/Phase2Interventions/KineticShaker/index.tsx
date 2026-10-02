import React, { useState, useEffect, useRef } from 'react';
import cn from 'classnames';
import { audioService } from '../../../services/audioService';
import { Button } from '../../../components/Button';
import { MoocaMascot } from '../../../components/MoocaMascot';
import { Zap, CheckCircle2, Sparkles } from 'lucide-react';
import { CheckIcon } from '../../../icons';
import {
  KINETIC_MODE,
  type KineticMode,
  KINETIC_CYCLES,
  SENSOR_CONFIG,
} from './constants';
import styles from './styles.module.scss';

export interface KineticShakerProps {
  onComplete: () => void;
  lang: 'th' | 'en';
}

export const KineticShaker: React.FC<KineticShakerProps> = ({
  onComplete,
  lang,
}) => {
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
          <Zap />
          <span className={styles.modeBadgeText}>
            {lang === 'th' ? 'สะบัดทิ้งพลังลบ' : 'Somatic Discharge'}
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
            {lang === 'th' ? 'สะบัดข้อมือ' : 'Arm Shake'}
          </button>
          <button
            type="button"
            onClick={() => setMode(KINETIC_MODE.BOUNCE)}
            className={cn(styles.modeBtn, {
              [styles.active]: mode === KINETIC_MODE.BOUNCE,
            })}
          >
            {lang === 'th' ? 'กระโดดเบาๆ' : 'Bounce'}
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
              ? lang === 'th'
                ? 'เย้! พลังลบกระจายหายหมดแล้ว สบายตัวขึ้นเยอะเลย!'
                : 'All discharged! Feeling light!'
              : mode === KINETIC_MODE.SHAKE
                ? lang === 'th'
                  ? 'สะบัดข้อมือไปพร้อม Mooca เลย! สะบัด สะบัด สะบัด!'
                  : 'Shake away bad vibes with Mooca!'
                : lang === 'th'
                  ? 'กระโดดดึ๋ง ๆ เบา ๆ เติมออกซิเจนให้สมองสดใสนะ!'
                  : 'Bounce lightly to recharge brain oxygen!'
          }
        />

        <h3 className={styles.guidanceTitle}>
          <Sparkles />
          {mode === KINETIC_MODE.SHAKE
            ? lang === 'th'
              ? 'สะบัดทิ้งพลังลบ (Kinetic Shaker)'
              : 'Kinetic Tension Shaker'
            : lang === 'th'
              ? 'กระโดดรีเซ็ตสติ (Micro-Bounce)'
              : 'Oxygenation Micro-Bounce'}
        </h3>
        <p className={styles.guidanceDesc}>
          {mode === KINETIC_MODE.SHAKE
            ? lang === 'th'
              ? '“กำมือถือให้มั่นแล้วสะบัดข้อมือเร็ว ๆ 15 ครั้ง เพื่อคลายกล้ามเนื้อที่เกร็งค้าง”'
              : '"Grip device securely and shake wrists firmly 15 times to discharge stored tension."'
            : lang === 'th'
              ? '“แนบมือถือกับอก แล้วกระโดดหย็อง ๆ 10 ครั้ง เพื่อสูบฉีดออกซิเจนกลับสู่สมอง”'
              : '"Hold device against chest and bounce lightly 10 times to boost prefrontal oxygen."'}
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
              <CheckCircle2 className={styles.checkmarkIcon} />
            ) : (
              <>
                <span className={styles.counterNumber}>{currentRemaining}</span>
                <span className={styles.counterLabel}>
                  {lang === 'th' ? 'รอบที่เหลือ' : 'Cycles Left'}
                </span>
              </>
            )}
          </div>

          <div className={styles.counterSubtext}>
            {isFinished ? (
              <span className="inline-flex items-center gap-1 text-emerald-600">
                <CheckIcon className="w-3.5 h-3.5" />
                <span>{lang === 'th' ? 'ปลดปล่อยความตึงเครียดหมดแล้ว' : 'Somatic Tension Released'}</span>
              </span>
            ) : (
              lang === 'th' ? 'สะบัดหรือกดปุ่มด้านล่างได้เลย' : 'Shake device or tap button'
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
          leadingIcon={<Zap className="w-4 h-4" />}
          label={
            isFinished
              ? lang === 'th'
                ? 'ปลดปล่อยพลังลบสำเร็จ'
                : 'Discharge Complete'
              : mode === KINETIC_MODE.SHAKE
                ? lang === 'th'
                  ? `สะบัดข้อมือ! (${shakesLeft} ครั้ง)`
                  : `Tap / Shake Wrist (${shakesLeft} left)`
                : lang === 'th'
                  ? `กระโดดเบาๆ! (${bouncesLeft} ครั้ง)`
                  : `Tap / Micro-Bounce (${bouncesLeft} left)`
          }
        />

        {isFinished && (
          <Button
            variant="secondary"
            colorTheme="turquoise"
            size="md"
            fullWidth
            onClick={onComplete}
            label={lang === 'th' ? 'เข้าสู่หน้าสะท้อนความคิด' : 'Proceed to Insight'}
          />
        )}
      </div>
    </div>
  );
};

export default KineticShaker;
