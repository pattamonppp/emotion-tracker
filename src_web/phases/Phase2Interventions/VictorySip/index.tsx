import React, { useState, useEffect, useRef } from 'react';
import { audioService } from '../../../services/audioService';
import { Button } from '../../../components/Button';
import { MoocaMascot } from '../../../components/MoocaMascot';
import { GlassWater, Activity, Sparkles } from 'lucide-react';
import { CheckIcon, GlassWaterIcon } from '../../../icons';
import { SIP_CONFIG, type BreathPhase } from './constants';
import styles from './styles.module.scss';

export interface VictorySipProps {
  onComplete: () => void;
  lang: 'th' | 'en';
}

export const VictorySip: React.FC<VictorySipProps> = ({
  onComplete,
  lang,
}) => {
  const [liquidLevel, setLiquidLevel] = useState(100);
  const [tiltAngle, setTiltAngle] = useState(0);
  const [sipCount, setSipCount] = useState(0);
  const [isDrinking, setIsDrinking] = useState(false);
  const [hasGyroscope, setHasGyroscope] = useState(false);
  const [currentBpm, setCurrentBpm] = useState(105);
  const [breathPhase, setBreathPhase] = useState<BreathPhase>('ready');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const waveOffsetRef = useRef(0);
  const animFrameRef = useRef<number | null>(null);

  // Real-time Canvas Fluid dynamics
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = SIP_CONFIG.CANVAS_WIDTH);
    const height = (canvas.height = SIP_CONFIG.CANVAS_HEIGHT);

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      waveOffsetRef.current += 0.05;

      const fillH = (height * liquidLevel) / 100;
      const surfaceY = height - fillH;

      if (fillH > 2) {
        ctx.save();

        // Clip rounded glass bottom
        ctx.beginPath();
        ctx.moveTo(10, 0);
        ctx.lineTo(width - 10, 0);
        ctx.lineTo(width - 10, height - 30);
        ctx.quadraticCurveTo(width - 10, height - 5, width - 35, height - 5);
        ctx.lineTo(35, height - 5);
        ctx.quadraticCurveTo(10, height - 5, 10, height - 30);
        ctx.closePath();
        ctx.clip();

        // Create Golden Turquoise Gradient
        const grad = ctx.createLinearGradient(0, surfaceY, 0, height);
        grad.addColorStop(0, '#00C4B3');
        grad.addColorStop(0.5, '#33D0C2');
        grad.addColorStop(1, '#1E3A8A');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(0, height);

        // Wave surface with dynamic tilt
        const tiltOffset = (tiltAngle / SIP_CONFIG.TILT_MAX_DEG) * 20;
        ctx.lineTo(0, surfaceY - tiltOffset);

        for (let x = 0; x <= width; x += 10) {
          const wave = Math.sin(x * 0.04 + waveOffsetRef.current) * (isDrinking ? 6 : 2.5);
          const tiltedY = surfaceY - tiltOffset + (tiltOffset * 2 * x) / width + wave;
          ctx.lineTo(x, tiltedY);
        }

        ctx.lineTo(width, height);
        ctx.closePath();
        ctx.fill();

        // Surface foam line
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Carbonation bubbles
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        for (let b = 0; b < 6; b++) {
          const bx = 25 + ((b * 32 + waveOffsetRef.current * 20) % (width - 50));
          const by = height - 15 - ((b * 45 + waveOffsetRef.current * 30) % Math.max(20, fillH - 10));
          ctx.beginPath();
          ctx.arc(bx, by, 1.5 + (b % 2), 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [liquidLevel, tiltAngle, isDrinking]);

  // Orientation listener for phone hardware
  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.beta !== null && e.beta !== undefined) {
        setHasGyroscope(true);
        const mappedAngle = Math.min(
          SIP_CONFIG.TILT_MAX_DEG,
          Math.max(-SIP_CONFIG.TILT_MAX_DEG, e.gamma || 0)
        );
        setTiltAngle(mappedAngle);

        if (e.beta > 55 && !isDrinking && sipCount < SIP_CONFIG.TOTAL_SIPS) {
          triggerSipAction();
        }
      }
    };

    window.addEventListener('deviceorientation', handleOrientation);
    return () => window.removeEventListener('deviceorientation', handleOrientation);
  }, [sipCount, isDrinking]);

  const triggerSipAction = () => {
    if (isDrinking || sipCount >= SIP_CONFIG.TOTAL_SIPS) return;

    setIsDrinking(true);
    const nextSips = sipCount + 1;
    setSipCount(nextSips);
    audioService.playLiquidSip(nextSips);

    // Vagal breathing cycle simulation
    setBreathPhase('inhale');
    setTimeout(() => {
      setBreathPhase('swallow');
      // Drain liquid
      const nextLevel = Math.max(0, 100 - nextSips * 33.3);
      setLiquidLevel(nextLevel);
      // Drop heart rate
      setCurrentBpm((prev) => Math.max(78, prev - 8));
    }, 600);

    setTimeout(() => {
      setBreathPhase('exhale');
    }, 1200);

    setTimeout(() => {
      setIsDrinking(false);
      setBreathPhase('ready');
      if (nextSips >= SIP_CONFIG.TOTAL_SIPS) {
        audioService.playChimeShockwave();
        setTimeout(() => {
          onComplete();
        }, SIP_CONFIG.COMPLETION_DELAY_MS);
      }
    }, SIP_CONFIG.INACTIVITY_TIMEOUT_MS);
  };

  return (
    <div className={styles.container}>
      {/* Top Banner: Vagal Maneuver & Live Pulse Reduction */}
      <div className={styles.topBanner}>
        <div className={styles.bannerTitle}>
          <GlassWater />
          <span className={styles.bannerText}>
            {lang === 'th' ? 'กระตุ้น Vagus Nerve' : 'Vagal Maneuver'}
          </span>
        </div>

        {/* Live dropping pulse metric */}
        <div className={styles.pulseBadge}>
          <Activity />
          <span className={styles.pulseText}>{currentBpm} bpm</span>
        </div>
      </div>

      {/* Mooca Mascot Drinking Companion */}
      <div className={styles.guidanceSection}>
        <MoocaMascot
          mood={sipCount >= SIP_CONFIG.TOTAL_SIPS ? 'celebrating' : 'drinking'}
          size="xs"
          speakingBubble={
            sipCount >= SIP_CONFIG.TOTAL_SIPS
              ? lang === 'th'
                ? 'ชื่นใจไหมจ๊ะ? หัวใจเต้นช้าลงและสงบแล้วนะ!'
                : 'Refreshed! Heart rate is calm now!'
              : lang === 'th'
                ? 'จิบน้ำกับ Mooca ช้า ๆ 3 อึกนะ หายใจเข้าแล้วกลืนนะ'
                : 'Take 3 victory sips with Mooca!'
          }
        />

        <h3 className={styles.guidanceTitle}>
          <Sparkles />
          {lang === 'th' ? 'ดื่มน้ำชัยชนะ' : 'The Victory Sip'}
        </h3>
        <p className={styles.guidanceDesc}>
          {lang === 'th'
            ? '“ยกมือถือขึ้นจรดริมฝีปากและเอียงขึ้น หรือกดปุ่มจิบน้ำช้า ๆ 3 อึก เพื่อกระตุ้นประสาทสงบ”'
            : '"Tilt phone toward lips or tap button to take 3 slow sips. Swallowing slows pulse."'}
        </p>
      </div>

      {/* Central Glass with 2D Canvas Fluid Dynamics */}
      <div className={styles.glassZone}>
        <div className={styles.ambientGlow} />

        <div className={styles.glassContainer}>
          <canvas ref={canvasRef} className={styles.canvas} />

          <div className={styles.glassHighlightLeft} />
          <div className={styles.glassHighlightRight} />

          {/* Vagus Breathing Phase Prompt */}
          <div className={styles.promptOverlay}>
            {sipCount >= SIP_CONFIG.TOTAL_SIPS ? (
              <div className={styles.completionCard}>
                <span className={styles.completionMain}>
                  <CheckIcon className="w-4 h-4 inline mr-1 text-teal-600" />
                  <span>{lang === 'th' ? 'ร่างกายได้รับสัญญาณสงบแล้ว' : 'Vagus Signal Transmitted'}</span>
                </span>
                <span className={styles.completionSub}>
                  {lang === 'th'
                    ? `ชีพจรผ่อนคลายเหลือ ${currentBpm} bpm`
                    : `Pulse normalized to ${currentBpm} bpm`}
                </span>
              </div>
            ) : isDrinking ? (
              <div className={styles.drinkingCard}>
                {breathPhase === 'inhale' && (lang === 'th' ? 'สูดหายใจเข้าลึก...' : 'Deep Inhale...')}
                {breathPhase === 'swallow' && (
                  <span className={styles.swallowPrompt}>
                    <GlassWaterIcon />
                    <span>{lang === 'th' ? 'กลืนน้ำช้า ๆ 1 อึก' : 'Swallow Slow Sip'}</span>
                  </span>
                )}
                {breathPhase === 'exhale' && (lang === 'th' ? 'ผ่อนลมหายใจออกยาว...' : 'Slow Exhale...')}
              </div>
            ) : (
              <div className={styles.sipCounterBadge}>
                {sipCount} / {SIP_CONFIG.TOTAL_SIPS} {lang === 'th' ? 'อึก' : 'Sips'}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Controls & Tilt Angle Simulation */}
      <div className={styles.actionZone}>
        {!hasGyroscope && (
          <div className={styles.tiltControlBar}>
            <span className={styles.tiltLabel}>
              {lang === 'th' ? 'องศาการเอียงแก้ว:' : 'Liquid Tilt Angle:'}
            </span>
            <input
              type="range"
              min="-35"
              max="35"
              value={tiltAngle}
              onChange={(e) => setTiltAngle(Number(e.target.value))}
              className={styles.tiltSlider}
            />
          </div>
        )}

        <Button
          variant="primary"
          colorTheme="turquoise"
          size="lg"
          fullWidth
          isDisabled={isDrinking || sipCount >= SIP_CONFIG.TOTAL_SIPS}
          isLoading={isDrinking}
          onClick={triggerSipAction}
          leadingIcon={<GlassWater className="w-4 h-4" />}
          label={
            sipCount >= SIP_CONFIG.TOTAL_SIPS
              ? lang === 'th'
                ? 'ดื่มครบ 3 อึก — สบายใจขึ้นแล้ว'
                : 'Victory Sip Complete'
              : lang === 'th'
                ? `จิบน้ำชัยชนะ อึกที่ ${sipCount + 1} / 3`
                : `Take Victory Sip ${sipCount + 1} of 3`
          }
        />

        {sipCount >= SIP_CONFIG.TOTAL_SIPS && (
          <Button
            variant="secondary"
            colorTheme="turquoise"
            size="md"
            fullWidth
            onClick={onComplete}
            label={lang === 'th' ? 'เข้าสู่หน้าสะท้อนความคิด' : 'Proceed to Reframing'}
          />
        )}
      </div>
    </div>
  );
};

export default VictorySip;
