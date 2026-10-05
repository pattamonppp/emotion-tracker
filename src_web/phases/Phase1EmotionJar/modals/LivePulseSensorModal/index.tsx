import React, { useState, useEffect, useRef } from 'react';
import cn from 'classnames';
import { audioService } from '../../../../services/audioService';
import { Button, BUTTON_THEME } from '../../../../components/Button';
import { Activity, X, Heart } from 'lucide-react';
import { LeafIcon, ZapIcon } from '../../../../icons';
import { getTranslation } from '../../../../locales';
import { Language } from '../../../../types';
import styles from './styles.module.scss';
import MarshmallowButton, { MARSHMALLOW_SIZE, MARSHMALLOW_VARIANT } from '@/components/MarshmallowButton';
import { renderBilingual } from '@/components/BilingualText';

export interface LivePulseSensorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBpm: number;
  onUpdateBpm: (bpm: number) => void;
  lang: Language;
}

export const LivePulseSensorModal: React.FC<LivePulseSensorModalProps> = ({
  isOpen,
  onClose,
  currentBpm,
  onUpdateBpm,
  lang,
}) => {
  const t = getTranslation(lang);
  const strings = t.modals.pulseSensor;
  const [isFingerOnSensor, setIsFingerOnSensor] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [measuredBpm, setMeasuredBpm] = useState(currentBpm);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Live PPG Pulse Waveform Canvas
  useEffect(() => {
    if (!isOpen) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = 300);
    const height = (canvas.height = 100);
    let offset = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Grid lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 25) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 20) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw ECG / PPG Waveform
      ctx.strokeStyle = isFingerOnSensor ? '#00C4B3' : '#64748B';
      ctx.lineWidth = 2.5;
      ctx.beginPath();

      offset += isFingerOnSensor ? 2.8 : 0.8;

      for (let x = 0; x < width; x++) {
        const t = (x + offset) % 120;
        let y = height / 2;

        if (isFingerOnSensor) {
          if (t > 40 && t < 48) {
            y -= 38;
          } else if (t >= 48 && t < 55) {
            y += 12;
          } else if (t >= 55 && t < 65) {
            y -= 8;
          }
        } else {
          y += Math.sin((x + offset) * 0.05) * 3;
        }

        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      ctx.stroke();

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isOpen, isFingerOnSensor]);

  // Scan progress calculation
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isFingerOnSensor && scanProgress < 100) {
      interval = setInterval(() => {
        setScanProgress((prev) => {
          const next = prev + 5;
          if (next % 20 === 0) {
            audioService.triggerHaptic(15);
          }
          if (next >= 100) {
            const calculatedBpm = Math.floor(76 + Math.random() * 8);
            setMeasuredBpm(calculatedBpm);
            onUpdateBpm(calculatedBpm);
            audioService.playPulseComplete();
          }
          return next;
        });
      }, 120);
    }
    return () => clearInterval(interval);
  }, [isFingerOnSensor, scanProgress, onUpdateBpm]);

  if (!isOpen) return null;

  return (
    <div className={styles.backdrop}>
      <div className={styles.modalCard}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.activityIconBox}>
              <Activity />
            </div>
            <div className={styles.headerTextCol}>
              <h3 className={styles.headerTitle}>
                {renderBilingual(strings.liveCalibrationTitle)}
              </h3>
              <p className={styles.headerSubtitle}>
                {renderBilingual(strings.headerSubtitle)}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className={styles.closeBtn}
          >
            <X />
          </button>
        </div>

        {/* Tactile Finger Touchpad Sensor */}
        <div className={styles.touchpadZone}>
          <div
            onPointerDown={() => setIsFingerOnSensor(true)}
            onPointerUp={() => setIsFingerOnSensor(false)}
            onPointerCancel={() => setIsFingerOnSensor(false)}
            className={cn(styles.touchpadPad, {
              [styles.sensing]: isFingerOnSensor,
            })}
          >
            <Heart className={isFingerOnSensor ? styles.sensingSvg : undefined} />
            <span className={styles.touchpadProgress}>
              {isFingerOnSensor
                ? `${scanProgress}%`
                : renderBilingual(strings.holdFinger)}
            </span>
          </div>
          <span className={styles.touchpadInstruction}>
            {renderBilingual(strings.touchInstruction)}
          </span>
        </div>

        {/* Measured Metrics */}
        <div className={styles.metricsGrid}>
          <div className={styles.metricBox}>
            <span className={styles.metricBoxLabel}>
              {renderBilingual(strings.heartRate)}
            </span>
            <div className={styles.metricBoxValue}>
              {measuredBpm}
              <span className={styles.metricBoxUnit}> bpm</span>
            </div>
          </div>

          <div className={styles.metricDivider} />

          <div className={styles.metricBox}>
            <span className={styles.metricBoxLabel}>
              {renderBilingual(strings.autonomicState)}
            </span>
            <div className={styles.stateBoxValue}>
              {measuredBpm < 85 ? (
                <div className={styles.stateTagParasympathetic}>
                  <LeafIcon />
                  <span className={styles.stateTagParasympatheticText}>
                    {renderBilingual(strings.parasympathetic)}
                  </span>
                </div>
              ) : (
                <div className={styles.stateTagSympathetic}>
                  <ZapIcon />
                  <span className={styles.stateTagSympatheticText}>
                    {renderBilingual(strings.sympathetic)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={styles.footerArea}>
          <MarshmallowButton
            variant={MARSHMALLOW_VARIANT.PRIMARY}
            size={MARSHMALLOW_SIZE.MD}
            title={strings.confirmBtn}
            onPress={onClose}
          />
        </div>
      </div>
    </div>
  );
};

export default LivePulseSensorModal;
