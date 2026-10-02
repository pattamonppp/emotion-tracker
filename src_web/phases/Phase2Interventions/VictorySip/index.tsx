import React, { useState, useEffect, useRef } from 'react';
import { audioService } from '../../../services/audioService';
import { Button } from '../../../components/Button';
import { MoocaMascot } from '../../../components/MoocaMascot';
import { DevActivityControl } from '../../../components/DevActivityControl';
import { GlassWater, Activity, Sparkles } from 'lucide-react';
import { CheckIcon, GlassWaterIcon } from '../../../icons';
import { SIP_CONFIG, type BreathPhase } from './constants';
import { getTranslation } from '../../../locales';
import { renderVictorySipFluid } from '../../../utils';
import styles from './styles.module.scss';

export interface VictorySipProps {
  onComplete: () => void;
  lang: 'th' | 'en';
}

export const VictorySip: React.FC<VictorySipProps> = ({
  onComplete,
  lang,
}) => {
  const strings = getTranslation(lang).phases.phase2.victorySip;
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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = SIP_CONFIG.CANVAS_WIDTH);
    const height = (canvas.height = SIP_CONFIG.CANVAS_HEIGHT);

    const render = () => {
      waveOffsetRef.current = renderVictorySipFluid({
        ctx,
        width,
        height,
        liquidLevel,
        tiltAngle,
        tiltMaxDeg: SIP_CONFIG.TILT_MAX_DEG,
        isDrinking,
        waveOffset: waveOffsetRef.current,
      });

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
            {strings.vagalManeuver}
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
              ? strings.bubbleDone
              : strings.bubbleDrinking
          }
        />

        <h3 className={styles.guidanceTitle}>
          <Sparkles />
          {strings.title}
        </h3>
        <p className={styles.guidanceDesc}>
          {strings.desc}
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
                  <span>{strings.calmSignal}</span>
                </span>
                <span className={styles.completionSub}>
                  {strings.pulseRelaxed.replace('{bpm}', String(currentBpm))}
                </span>
              </div>
            ) : isDrinking ? (
              <div className={styles.drinkingCard}>
                {breathPhase === 'inhale' && strings.inhalePrompt}
                {breathPhase === 'swallow' && (
                  <span className={styles.swallowPrompt}>
                    <GlassWaterIcon />
                    <span>{strings.swallowPrompt}</span>
                  </span>
                )}
                {breathPhase === 'exhale' && strings.exhalePrompt}
              </div>
            ) : (
              <div className={styles.sipCounterBadge}>
                {sipCount} / {SIP_CONFIG.TOTAL_SIPS} {strings.sipUnit}
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
              {strings.tiltLabel}
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
              ? strings.sipCompleteBtn
              : strings.sipActionBtn
                  .replace('{current}', String(sipCount + 1))
                  .replace('{total}', String(SIP_CONFIG.TOTAL_SIPS))
          }
        />

        {sipCount >= SIP_CONFIG.TOTAL_SIPS && (
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

      <DevActivityControl onComplete={onComplete} />
    </div>
  );
};

export default VictorySip;
