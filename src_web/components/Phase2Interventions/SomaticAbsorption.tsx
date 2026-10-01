import React, { useState, useEffect, useRef } from 'react';
import { audioService } from '../../services/audioService';
import { Button } from '../../design-system/Button';
import { MoocaMascot } from '../MoocaMascot';
import { Sparkles, Flame, CheckCircle, Volume2, Shield, Heart } from 'lucide-react';

interface SomaticAbsorptionProps {
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
          // Orbiting gentle sigil movement
          p.x += Math.cos(rot) * 0.3 + p.vx * 0.2;
          p.y += Math.sin(rot) * 0.3 + p.vy * 0.2;
        }

        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.94;
        p.vy *= 0.94;

        // Draw particle
        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.restore();
      });

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsRubbing(true);
    pointerPositionsRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    setPointersCount(pointerPositionsRef.current.size);
    lastPosRef.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);

    if (rubProgress < 8) {
      playBlessingVoice();
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isRubbing || isFinished) return;

    pointerPositionsRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (lastPosRef.current) {
      const dx = e.clientX - lastPosRef.current.x;
      const dy = e.clientY - lastPosRef.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > 2.5) {
        setRubSpeed(dist);
        // Multiplier bonus if user rubs with both thumbs
        const thumbBonus = pointerPositionsRef.current.size > 1 ? 1.6 : 1.0;

        setRubProgress((prev) => {
          const next = Math.min(100, prev + dist * 0.15 * thumbBonus);
          if (next >= 100 && !isFinished) {
            handleComplete();
          }
          return next;
        });

        // Warm up hand temperature steadily toward optimal 36.8°C
        setHandTemp((prev) => Math.min(36.8, prev + 0.06 * thumbBonus));

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
    <div className="flex flex-col h-full justify-between items-center text-center p-3 select-none animate-in fade-in duration-300">
      
      {/* Top Protocol Status with Cozy Pill */}
      <div className="w-full flex items-center justify-between text-xs px-3 py-1.5 bg-white/90 shadow-sm rounded-[16px] border border-slate-200">
        <div className="flex items-center gap-1.5 text-[#F9A000]">
          <Flame className="w-4 h-4 animate-pulse text-[#F9A000]" />
          <span className="font-semibold text-slate-800">
            {lang === 'th' ? 'ความอบอุ่นปลายนิ้ว: ' : 'Fingertip Heat: '}
            <span className="font-mono text-[#009688] font-bold">{handTemp.toFixed(1)}°C</span>
          </span>
        </div>
        <span className="text-[11px] font-medium text-slate-500">
          {pointersCount > 1 ? (
            <span className="text-[#009688] font-bold">
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
      <div className="flex flex-col items-center mt-1">
        <MoocaMascot
          mood={isFinished ? 'celebrating' : 'praying'}
          size="xs"
          speakingBubble={
            isFinished
              ? (lang === 'th' ? 'สุดยอดเลย! ความมั่นใจเต็มเปี่ยมแล้วนะ!' : "You've got this! Mooca is with you!")
              : (lang === 'th' ? 'ถูนิ้ววนให้อุ่นไปพร้อม Mooca นะจ๊ะ' : 'Rub thumbs together with Mooca!')
          }
        />
        
        <h3 className="text-base font-bold text-slate-800 tracking-tight flex items-center justify-center gap-1.5 mt-0.5">
          <Sparkles className="w-4 h-4 text-[#F9A000]" />
          {lang === 'th' ? 'ถูซับพลังใจ / ซับพรแห่งความมั่นใจ' : 'The Somatic Absorption'}
        </h3>
        <p className="text-xs text-slate-600 max-w-xs mt-0.5 leading-snug">
          {lang === 'th'
            ? '“วางนิ้วหัวแม่มือทั้งสองข้างลงไป แล้วถูวนให้ทั่วเพื่อซึมซับความมั่นใจเข้าสู่ร่างกาย”'
            : '"Place both thumbs on the Sigil and rub continuously to absorb confidence."'}
        </p>
      </div>

      {/* Interactive Sigil of Confidence (Golden Energy Sphere with Canvas Particles) */}
      <div className="relative my-2 flex items-center justify-center">
        {/* Radiating Shockwave Ring when finished */}
        {isFinished && (
          <div className="absolute inset-0 rounded-full border-4 border-[#00C4B3] animate-ping pointer-events-none" />
        )}

        {/* Ambient Thermal Glow */}
        <div
          className="absolute w-64 h-64 rounded-full blur-3xl transition-all duration-300 pointer-events-none"
          style={{
            backgroundColor: isFinished
              ? 'rgba(0, 196, 179, 0.45)'
              : `rgba(250, 140, 61, ${0.15 + (rubProgress / 100) * 0.45})`,
            transform: `scale(${1 + (rubProgress / 100) * 0.28})`,
          }}
        />

        {/* Interactive Rub Sphere */}
        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className={`relative w-56 h-56 rounded-full border-4 cursor-grab active:cursor-grabbing flex flex-col items-center justify-center shadow-xl transition-all duration-150 touch-none overflow-hidden ${
            isFinished
              ? 'border-[#00C4B3] bg-gradient-to-br from-[#DBF0EE] via-white to-[#D7FFFC] scale-105 shadow-[#00C4B3]/40'
              : isRubbing
              ? 'border-[#F9A000] bg-gradient-to-br from-amber-50 via-white to-amber-100/60 scale-102 shadow-[#F9A000]/30'
              : 'border-[#F9A000]/60 bg-gradient-to-br from-white via-[#F8FAFC] to-amber-50/50 shadow-sm'
          }`}
        >
          {/* Canvas Ember Layer */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
          />

          {/* Inner Rotating Sigil Ring */}
          <div
            className={`w-40 h-40 rounded-full border border-dashed border-amber-300/60 flex items-center justify-center transition-all ${
              isRubbing ? 'animate-spin' : ''
            }`}
            style={{ animationDuration: '6s' }}
          >
            <div className="w-28 h-28 rounded-full border border-amber-200/80 flex items-center justify-center bg-white/40">
              <Sparkles className={`w-10 h-10 ${isFinished ? 'text-[#00C4B3]' : 'text-[#F9A000]'} transition-colors`} />
            </div>
          </div>

          {/* Central Instruction / Shockwave Message */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none p-3 z-10">
            {isFinished ? (
              <div className="animate-in zoom-in-75 duration-300">
                <span className="text-2xl font-extrabold text-[#009688] tracking-wide block drop-shadow-xs">
                  {lang === 'th' ? 'เธอทำได้แน่นอน!' : "YOU'VE GOT THIS!"}
                </span>
                <span className="text-xs font-semibold text-[#004D40] mt-1 block">
                  {lang === 'th' ? 'Mooca มั่นใจในตัวเธอเสมอ' : 'Mooca is cheering for you!'}
                </span>
              </div>
            ) : (
              <div className="space-y-1">
                <div className="text-[11px] font-bold text-[#F9A000] uppercase tracking-wider">
                  {isRubbing
                    ? (lang === 'th' ? 'กำลังซับพลังใจ...' : 'Absorbing...')
                    : (lang === 'th' ? 'วางนิ้วแล้วถูวน' : 'Rub Circles Here')}
                </div>
                <div className="text-3xl font-mono font-extrabold text-slate-800">
                  {Math.round(rubProgress)}%
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Progress & Physiology Bar */}
      <div className="w-full max-w-xs space-y-2">
        <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden p-0.5 border border-slate-300/80">
          <div
            className={`h-full rounded-full transition-all duration-100 ${
              isFinished ? 'bg-[#00C4B3]' : 'bg-gradient-to-r from-[#F9A000] to-[#00C4B3]'
            }`}
            style={{ width: `${rubProgress}%` }}
          />
        </div>

        <p className="text-[11px] text-slate-500 font-medium">
          {lang === 'th'
            ? 'การถูนิ้วกระตุ้นเลือดลมสู่ปลายนิ้ว และช่วยให้ใจสงบนิ่งพร้อมสู้'
            : 'Friction warms cold extremities & creates symbolic tactile grounding'}
        </p>
      </div>

      {/* Manual Proceed button */}
      {isFinished && (
        <div className="w-full mt-2 animate-in fade-in">
          <Button
            variant="primary"
            colorTheme="turquoise"
            size="lg"
            fullWidth
            onClick={onComplete}
            label={lang === 'th' ? 'เข้าสู่หน้าสะท้อนความคิด (Next Step)' : 'Proceed to Cognitive Reframing'}
          />
        </div>
      )}
    </div>
  );
};
