import React, { useState, useEffect, useRef } from 'react';
import cn from 'classnames';
import { audioService } from '../../../services/audioService';
import { Button } from '../../Button';
import { MoocaMascot } from '../../MoocaMascot';
import { Sparkles, Flame, Volume2, Shield } from 'lucide-react';
import styles from './styles.module.scss';

export interface SomaticAbsorptionProps {
  onComplete: () => void;
  lang: 'th' | 'en';
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
  absorbed: boolean;
}

export const SomaticAbsorption: React.FC<SomaticAbsorptionProps> = ({
  onComplete,
  lang,
}) => {
  const [rubProgress, setRubProgress] = useState(0); // 0 to 100
  const [isRubbing, setIsRubbing] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [handTemp, setHandTemp] = useState(28.4); // starts cold
  const [rubSpeed, setRubSpeed] = useState(0);
  const [pointersCount, setPointersCount] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const pointerPositionsRef = useRef<Map<number, { x: number; y: number }>>(new Map());
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);
  const soundThrottleRef = useRef(0);
  const animFrameRef = useRef<number | null>(null);

  // Whisper blessing audio
  const playBlessingVoice = () => {
    const text = lang === 'th'
      ? 'ความรู้และแรงพยายามทั้งหมดที่คุณสะสมมา กำลังอยู่ในมือคู่นี้แล้ว... รับพลังนี้ไว้ แล้วก้าวเข้าไปทำหน้าที่ของคุณ'
      : 'All the knowledge and preparation you have built are right here in your hands. Absorb this certainty, and step forward.';
    audioService.playVoiceSanctuary(text, lang, 0.84);
  };

  // Initialize Canvas Particle Field
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = 280);
    const height = (canvas.height = 280);
    const centerX = width / 2;
    const centerY = height / 2;

    // Generate initial constellation of golden confidence embers
    const particles: Particle[] = [];
    const colors = ['#FFE082', '#FFD54F', '#FFCA28', '#00C4B3', '#80CBC4'];
    for (let i = 0; i < 90; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 30 + Math.random() * 85;
      particles.push({
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        size: 1.5 + Math.random() * 2.5,
        alpha: 0.4 + Math.random() * 0.6,
        color: colors[Math.floor(Math.random() * colors.length)],
        absorbed: false,
      });
    }
    particlesRef.current = particles;

    let rot = 0;
    const render = () => {
      ctx.clearRect(0, 0, width, height);
      rot += 0.008;

      // Active pointers target
      const targets: { x: number; y: number }[] = [];
      const rect = canvas.getBoundingClientRect();
      pointerPositionsRef.current.forEach((pos) => {
        targets.push({
          x: pos.x - rect.left,
          y: pos.y - rect.top,
        });
      });

      // Update & Draw particles
      particlesRef.current.forEach((p) => {
        if (p.absorbed) return;

        // Attract toward active user touch points if rubbing
        if (targets.length > 0) {
          const nearest = targets[0];
          const dx = nearest.x - p.x;
          const dy = nearest.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            // Gravitational pull toward fingertips
            p.vx += (dx / dist) * 0.45;
            p.vy += (dy / dist) * 0.45;
            p.size = Math.max(1, p.size * 0.99);

            // If close to finger, mark absorbed and spawn flash
            if (dist < 18) {
              p.alpha -= 0.08;
              if (p.alpha <= 0) {
                p.absorbed = true;
              }
            }
          }
        } else {
          // Gentle ambient celestial swirl
          const dx = p.x - centerX;
          const dy = p.y - centerY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const currentAngle = Math.atan2(dy, dx);
          const nextAngle = currentAngle + 0.005;
          p.x = centerX + Math.cos(nextAngle) * dist + p.vx * 0.2;
          p.y = centerY + Math.sin(nextAngle) * dist + p.vy * 0.2;
        }

        p.x += p.vx;
        p.y += p.vy;

        // Damping
        p.vx *= 0.96;
        p.vy *= 0.96;

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // Multi-Touch Pointer Tracking for Somatic Friction
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    pointerPositionsRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    setPointersCount(pointerPositionsRef.current.size);
    setIsRubbing(true);
    lastPosRef.current = { x: e.clientX, y: e.clientY };

    // Initial warm haptic feedback
    if (navigator.vibrate) navigator.vibrate(15);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!pointerPositionsRef.current.has(e.pointerId)) return;
    pointerPositionsRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (lastPosRef.current) {
      const dx = e.clientX - lastPosRef.current.x;
      const dy = e.clientY - lastPosRef.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > 3) {
        setRubSpeed(distance);

        // Progress based on dual-touch multiplier
        const multiBonus = pointerPositionsRef.current.size > 1 ? 1.6 : 1.0;
        const progressIncrement = (distance * 0.14 * multiBonus);

        setRubProgress((prev) => {
          const next = Math.min(100, prev + progressIncrement);
          if (next >= 100 && !isFinished) {
            handleComplete();
          }
          return next;
        });

        // Physiology warming simulation (Cold 28.4°C -> Optimal 36.6°C)
        setHandTemp((prev) => Math.min(36.6, prev + 0.05 * multiBonus));

        // Audio & Haptic friction ticks (throttled)
        const now = Date.now();
        if (now - soundThrottleRef.current > 65) {
          soundThrottleRef.current = now;
          audioService.playFrictionTick(Math.min(1, rubProgress / 100 + 0.35));
        }
      }
    }
    lastPosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    pointerPositionsRef.current.delete(e.pointerId);
    setPointersCount(pointerPositionsRef.current.size);
    if (pointerPositionsRef.current.size === 0) {
      setIsRubbing(false);
      lastPosRef.current = null;
      setRubSpeed(0);
    }
  };

  const handleComplete = () => {
    setIsFinished(true);
    audioService.playChimeShockwave();
    setTimeout(() => {
      onComplete();
    }, 3500);
  };

  return (
    <div className={styles.container}>
      {/* Top Protocol Status with Cozy Pill */}
      <div className={styles.statusPill}>
        <div className={styles.tempIndicator}>
          <Flame className="w-4 h-4 animate-pulse text-[#F9A000]" />
          <span className="font-semibold text-slate-800">
            {lang === 'th' ? 'ความอบอุ่นปลายนิ้ว: ' : 'Fingertip Heat: '}
            <span className={styles.tempValue}>{handTemp.toFixed(1)}°C</span>
          </span>
        </div>
        <span className={styles.tempStatus}>
          {pointersCount > 1 ? (
            <span className={styles.tempActive}>
              {lang === 'th' ? '✨ ถูสองนิ้วหัวแม่มือ' : '✨ Dual-Thumb Active'}
            </span>
          ) : handTemp < 32 ? (
            lang === 'th' ? '❄️ มือเย็นตื่นเต้น' : '❄️ Cool Nerves'
          ) : (
            lang === 'th' ? '🔥 เลือดลมไหลเวียนอบอุ่น' : '🔥 Restored Warmth'
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
              ? (lang === 'th' ? 'เก่งมาก! พลังใจกลับมาเต็มเปี่ยมแล้ว' : 'Splendid! Confidence fully integrated!')
              : (lang === 'th' ? 'ถูนิ้ววนเป็นวงกลมบนวงแหวนนะ มือจะอุ่นขึ้น' : 'Rub circular strokes in the circle to warm your hands')
          }
        />
      </div>

      {/* Somatic Ritual Instruction & Whisper Trigger */}
      <div className="w-full max-w-xs space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-[#00C4B3]" />
            {lang === 'th' ? 'พิธีกรรมซับพลังเตรียมสู้' : 'Somatic Confidence Anchoring'}
          </span>
          <button
            type="button"
            onClick={playBlessingVoice}
            className="flex items-center gap-1 text-[11px] font-bold text-[#009688] hover:text-[#004D40] bg-[#E6F9F7] px-2 py-0.5 rounded-full border border-[#00C4B3]/30 transition-colors"
            title="ฟังเสียงให้กำลังใจ"
          >
            <Volume2 className="w-3 h-3 text-[#00C4B3]" />
            <span>{lang === 'th' ? 'ฟังพลังใจ' : 'Whisper'}</span>
          </button>
        </div>
        <p className="text-xs text-slate-600 font-medium">
          {lang === 'th'
            ? 'ใช้ปลายนิ้วหัวแม่มือถูวนเป็นวงกลมบนแท่นเรืองแสง ร่างกายจะดึงพลังความรู้เข้าสู่ตัวเอง'
            : 'Rub thumb circular strokes across the glowing core to warm cold palms and anchor calm.'}
        </p>
      </div>

      {/* Interactive Friction Charging Zone */}
      <div className="relative flex items-center justify-center my-auto">
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
              <Sparkles className={cn('w-10 h-10', isFinished ? 'text-[#00C4B3]' : 'text-[#F9A000]')} />
            </div>
          </div>

          {/* Central Instruction / Shockwave Message */}
          <div className={styles.centralMessage}>
            {isFinished ? (
              <div>
                <span className={styles.finishedHero}>
                  {lang === 'th' ? 'เธอทำได้แน่นอน!' : "YOU'VE GOT THIS!"}
                </span>
                <span className={styles.finishedSub}>
                  {lang === 'th' ? 'Mooca มั่นใจในตัวเธอเสมอ' : 'Mooca is cheering for you!'}
                </span>
              </div>
            ) : (
              <div className="space-y-1">
                <div className={styles.progressSubtitle}>
                  {isRubbing
                    ? (lang === 'th' ? 'กำลังซับพลังใจ...' : 'Absorbing...')
                    : (lang === 'th' ? 'วางนิ้วแล้วถูวน' : 'Rub Circles Here')}
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
          {lang === 'th'
            ? 'การถูนิ้วกระตุ้นเลือดลมสู่ปลายนิ้ว และช่วยให้ใจสงบนิ่งพร้อมสู้'
            : 'Friction warms cold extremities & creates symbolic tactile grounding'}
        </p>
      </div>

      {/* Manual Proceed button */}
      {isFinished && (
        <div className={styles.buttonContainer}>
          <Button
            variant="primary"
            theme="turquoise"
            shape="pill"
            size="lg"
            fullWidth
            onClick={onComplete}
          >
            {lang === 'th' ? 'เข้าสู่หน้าสะท้อนความคิด' : 'Proceed to Cognitive Reframing'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default SomaticAbsorption;
