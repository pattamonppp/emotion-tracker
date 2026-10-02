import React, { useState, useEffect, useRef } from 'react';
import cn from 'classnames';
import { audioService } from '../../../../services/audioService';
import { Button } from '../../../../components/Button';
import { Activity, X, Heart } from 'lucide-react';
import { LeafIcon, ZapIcon } from '../../../../icons';
import styles from './styles.module.scss';

export interface LivePulseSensorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBpm: number;
  onUpdateBpm: (bpm: number) => void;
  lang: 'th' | 'en';
}

export const LivePulseSensorModal: React.FC<LivePulseSensorModalProps> = ({
  isOpen,
  onClose,
  currentBpm,
  onUpdateBpm,
  lang,
}) => {
  const [isFingerOnSensor, setIsFingerOnSensor] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [measuredBpm, setMeasuredBpm] = useState(currentBpm);
  const [hrvMs, setHrvMs] = useState(48);

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
            setHrvMs(62 + Math.floor(Math.random() * 12));
            onUpdateBpm(calculatedBpm);
            audioService.playJarDrop();
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
                {lang === 'th' ? 'เซนเซอร์วัดชีพจรชีววิทยา' : 'Bio-Pulse Optical Sensor'}
              </h3>
              <p className={styles.headerSubtitle}>
                {lang === 'th' ? 'จำลอง Apple Health & PPG Sensor' : 'Simulating Live PPG & Apple Health'}
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

        {/* Live PPG Graph */}
        <div className={styles.graphCard}>
          <canvas ref={canvasRef} className={styles.canvas} />
          <div className={styles.graphMetaRow}>
            <span className={styles.ppgStatus}>
              <span
                className={cn(styles.statusDot, {
                  [styles.active]: isFingerOnSensor,
                })}
              />
              {isFingerOnSensor ? 'PPG OPTICAL ACTIVE' : 'TOUCH TO SENSE'}
            </span>
            <span>HRV: {hrvMs} ms (SDNN)</span>
          </div>
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
                : lang === 'th'
                  ? 'แตะค้างที่นี่'
                  : 'Hold Finger'}
            </span>
          </div>
          <span className={styles.touchpadInstruction}>
            {lang === 'th'
              ? 'วางนิ้วชี้แนบจุดเซนเซอร์ค้างไว้ 3 วินาที เพื่อจำลองการวัดชีพจรจริง'
              : 'Hold index finger over the pulse sensor pad for 3s to capture baseline.'}
          </span>
        </div>

        {/* Measured Metrics */}
        <div className={styles.metricsGrid}>
          <div className={styles.metricBox}>
            <span className={styles.metricBoxLabel}>Heart Rate</span>
            <div className={styles.metricBoxValue}>
              {measuredBpm} <span>bpm</span>
            </div>
          </div>
          <div className={styles.metricBox}>
            <span className={styles.metricBoxLabel}>Autonomic State</span>
            <div className={styles.stateBoxValue}>
              {measuredBpm < 85 ? (
                <span className="inline-flex items-center gap-1 text-emerald-600">
                  <LeafIcon className="w-3.5 h-3.5" />
                  <span>Parasympathetic</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-amber-600">
                  <ZapIcon className="w-3.5 h-3.5" />
                  <span>High Sympathetic</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={styles.footerArea}>
          <Button
            variant="primary"
            colorTheme="turquoise"
            size="md"
            fullWidth
            onClick={onClose}
            label={lang === 'th' ? 'ยืนยันค่าชีพจร & กลับสู่ระบบ' : 'Confirm Pulse & Return'}
          />
        </div>
      </div>
    </div>
  );
};

export default LivePulseSensorModal;
