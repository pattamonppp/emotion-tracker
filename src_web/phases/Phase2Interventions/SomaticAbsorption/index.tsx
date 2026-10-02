import React, { useState, useEffect, useRef } from 'react';
import cn from 'classnames';
import { audioService } from '../../../services/audioService';
import { Button } from '../../../components/Button';
import { MoocaMascot } from '../../../components/MoocaMascot';
import { Sparkles, Flame, Volume2, Shield } from 'lucide-react';
import { SparklesIcon, WindIcon, FlameIcon } from '../../../icons';
import { useLanguage } from '../../../hooks';
import { SOMATIC_CONFIG } from './constants';
import type { SomaticAbsorptionProps, Particle, PointerPos } from './types';
import { createAuraParticles } from '../../../utils';
import styles from './styles.module.scss';

export const SomaticAbsorption: React.FC<SomaticAbsorptionProps> = ({
  onComplete,
  lang: propLang,
}) => {
  const { lang: hookLang, t } = useLanguage();
  const lang = propLang || hookLang;
  const strings = t.phases.phase2.somaticAbsorption;

  const [rubProgress, setRubProgress] = useState(0); // 0 to 100
  const [isRubbing, setIsRubbing] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [handTemp, setHandTemp] = useState<number>(SOMATIC_CONFIG.START_TEMP);
  const [rubSpeed, setRubSpeed] = useState(0);
  const [pointersCount, setPointersCount] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const pointerPositionsRef = useRef<Map<number, PointerPos>>(new Map());
  const lastPosRef = useRef<PointerPos | null>(null);
  const soundThrottleRef = useRef(0);
  const animFrameRef = useRef<number | null>(null);

  // Whisper blessing audio
  const playBlessingVoice = () => {
    audioService.playVoiceSanctuary(strings.blessingVoice, lang, 0.84);
  };

  // Initialize Canvas Particle Field
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = SOMATIC_CONFIG.CANVAS_WIDTH);
    const height = (canvas.height = SOMATIC_CONFIG.CANVAS_HEIGHT);
    const centerX = width / 2;
    const centerY = height / 2;

    particlesRef.current = createAuraParticles({
      centerX,
      centerY,
      total: SOMATIC_CONFIG.TOTAL_PARTICLES,
      colors: SOMATIC_CONFIG.PARTICLE_COLORS,
    });

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particlesRef.current.forEach((p) => {
        if (!p.absorbed) {
          // Slow drift or orbital pull
          p.x += p.vx;
          p.y += p.vy;

          // Gentle bounds bounce
          if (p.x < 10 || p.x > width - 10) p.vx *= -1;
          if (p.y < 10 || p.y > height - 10) p.vy *= -1;

          // Draw shimmering particle
          ctx.save();
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha;
          ctx.shadowBlur = 8;
          ctx.shadowColor = p.color;
          ctx.fill();
          ctx.restore();
        }
      });

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // Multi-Touch and Mouse Drag tracking
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    pointerPositionsRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    setPointersCount(pointerPositionsRef.current.size);
    setIsRubbing(true);
    lastPosRef.current = { x: e.clientX, y: e.clientY };

    audioService.triggerHaptic([30, 40]);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!pointerPositionsRef.current.has(e.pointerId)) return;

    const currentX = e.clientX;
    const currentY = e.clientY;
    const lastPos = lastPosRef.current;

    if (lastPos) {
      const dx = currentX - lastPos.x;
      const dy = currentY - lastPos.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > SOMATIC_CONFIG.MIN_RUB_SPEED_THRESHOLD) {
        setRubSpeed(distance);

        // Advance progress based on distance rubbed
        const isDualThumb = pointerPositionsRef.current.size >= 2;
        const progressIncrement = (distance * 0.15) * (isDualThumb ? 1.6 : 1.0);

        setRubProgress((prev) => {
          const next = Math.min(100, prev + progressIncrement);
          if (next >= 100 && !isFinished) {
            handleComplete();
          }
          return next;
        });

        // Simulate physiological hand warming
        setHandTemp((prev) => {
          if (prev < SOMATIC_CONFIG.TARGET_TEMP) {
            return Math.min(SOMATIC_CONFIG.TARGET_TEMP, prev + (distance * 0.008));
          }
          return prev;
        });

        // Play gentle tactile feedback throttle
        const now = Date.now();
        if (now - soundThrottleRef.current > 120) {
          audioService.triggerHaptic([20, 30]);
          soundThrottleRef.current = now;
        }

        // Absorb nearest particles toward pointer
        absorbParticlesNear(e.clientX, e.clientY);
      }
    }

    lastPosRef.current = { x: currentX, y: currentY };
    pointerPositionsRef.current.set(e.pointerId, { x: currentX, y: currentY });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    pointerPositionsRef.current.delete(e.pointerId);
    setPointersCount(pointerPositionsRef.current.size);

    if (pointerPositionsRef.current.size === 0) {
      setIsRubbing(false);
      lastPosRef.current = null;
    }
  };

  // Particle convergence effect on rubbing
  const absorbParticlesNear = (screenX: number, screenY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const localX = screenX - rect.left;
    const localY = screenY - rect.top;

    particlesRef.current.forEach((p) => {
      const dx = localX - p.x;
      const dy = localY - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 45) {
        p.vx += (dx / dist) * 2;
        p.vy += (dy / dist) * 2;
        p.alpha = Math.max(0.1, p.alpha - 0.05);
      }
    });
  };

  const handleComplete = () => {
    setIsFinished(true);
    audioService.playChimeShockwave();
    setTimeout(() => {
      onComplete();
    }, SOMATIC_CONFIG.COMPLETION_DELAY_MS);
  };

  return (
    <div className={styles.container}>
      {/* Top Protocol Status with Cozy Pill */}
      <div className={styles.statusPill}>
        <div className={styles.tempIndicator}>
          <Flame className="w-4 h-4 animate-pulse text-[#F9A000]" />
          <span className="font-semibold text-slate-800">
            {strings.fingertipHeat}{' '}
            <span className={styles.tempValue}>{handTemp.toFixed(1)}°C</span>
          </span>
        </div>
        <span className={styles.tempStatus}>
          {pointersCount > 1 ? (
            <span className={styles.tempActive}>
              <SparklesIcon />
              <span>{strings.dualThumbActive}</span>
            </span>
          ) : handTemp < SOMATIC_CONFIG.TEMP_THRESHOLD ? (
            <span className={styles.tempCool}>
              <WindIcon />
              <span>{strings.coolNerves}</span>
            </span>
          ) : (
            <span className={styles.tempWarm}>
              <FlameIcon />
              <span>{strings.restoredWarmth}</span>
            </span>
          )}
        </span>
      </div>

      {/* Mooca Companion Guidance */}
      <div className={styles.mascotSection}>
        <MoocaMascot
          mood={isFinished ? 'celebrating' : 'praying'}
          size="xs"
          speakingBubble={
            isFinished
              ? strings.mascotDone
              : strings.mascotRubbing
          }
        />
      </div>

      {/* Somatic Ritual Instruction & Whisper Trigger */}
      <div className={styles.instructionSection}>
        <div className={styles.instructionHeader}>
          <span className={styles.ritualTitle}>
            <Shield />
            {strings.ritualTitle}
          </span>
          <button
            type="button"
            onClick={playBlessingVoice}
            className={styles.whisperBtn}
            title={strings.whisperTitle}
          >
            <Volume2 />
            <span>{strings.whisperBtn}</span>
          </button>
        </div>
        <p className={styles.instructionText}>
          {strings.instruction}
        </p>
      </div>

      {/* Interactive Friction Charging Zone */}
      <div className={styles.interactiveZone}>
        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className={styles.circleZone}
        >
          {/* Canvas Ember Layer */}
          <canvas ref={canvasRef} className={styles.canvas} />

          {/* Inner Rotating Sigil Ring */}
          <div
            className={cn(styles.sigilRing, { [styles.spinning]: isRubbing })}
          >
            <div className={styles.sigilCore}>
              <Sparkles className={isFinished ? styles.sigilIconFinished : styles.sigilIconActive} />
            </div>
          </div>

          {/* Central Instruction / Shockwave Message */}
          <div className={styles.centralMessage}>
            {isFinished ? (
              <div>
                <span className={styles.finishedHero}>
                  {strings.heroFinished}
                </span>
                <span className={styles.finishedSub}>
                  {strings.subFinished}
                </span>
              </div>
            ) : (
              <div className={styles.centralContent}>
                <div className={styles.progressSubtitle}>
                  {isRubbing ? strings.rubbingProgress : strings.idlePrompt}
                </div>
                <div className={styles.progressValue}>
                  {Math.round(rubProgress)}%
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Progress & Physiology Bar */}
      <div className={styles.progressBarContainer}>
        <div className={styles.progressBarTrack}>
          <div
            className={cn(styles.progressBarFill, { [styles.finished]: isFinished })}
            style={{ width: `${rubProgress}%` }}
          />
        </div>

        <p className={styles.captionText}>
          {strings.caption}
        </p>
      </div>

      {/* Manual Proceed button */}
      {isFinished && (
        <div className={styles.buttonContainer}>
          <Button
            variant="primary"
            colorTheme="turquoise"
            size="lg"
            fullWidth
            onClick={onComplete}
            label={strings.proceedBtn}
          />
        </div>
      )}
    </div>
  );
};

export default SomaticAbsorption;
export * from './constants';
export * from './types';
