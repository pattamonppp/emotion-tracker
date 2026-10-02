import React, { useState, useEffect, useRef } from 'react';
import { audioService } from '../../services/audioService';
import { Button } from '../../design-system/Button';
import { MoocaMascot } from '../MoocaMascot';
import { GlassWater, Heart, Check, Activity, Wind, Sparkles } from 'lucide-react';

interface VictorySipProps {
  onComplete: () => void;
  lang: 'th' | 'en';
}

export const VictorySip: React.FC<VictorySipProps> = ({
  onComplete,
  lang,
}) => {
  const [liquidLevel, setLiquidLevel] = useState(100); // 100% full down to 0%
  const [tiltAngle, setTiltAngle] = useState(0); // -45 to 45 deg
  const [sipCount, setSipCount] = useState(0); // 0 to 3 sips
  const [isDrinking, setIsDrinking] = useState(false);
  const [hasGyroscope, setHasGyroscope] = useState(false);
  const [currentBpm, setCurrentBpm] = useState(105);
  const [breathPhase, setBreathPhase] = useState<'ready' | 'inhale' | 'swallow' | 'exhale'>('ready');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const waveOffsetRef = useRef(0);
  const animFrameRef = useRef<number | null>(null);

  // Real-time Canvas Fluid dynamics
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = 200);
    const height = (canvas.height = 260);

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

        // Wave surface with dynamic tilt tiltAngle
        const tiltOffset = (tiltAngle / 45) * 20;
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

  // Orientation listener for actual phone hardware
  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.beta !== null && e.beta !== undefined) {
        setHasGyroscope(true);
        const mappedAngle = Math.min(45, Math.max(-45, e.gamma || 0));
        setTiltAngle(mappedAngle);

        if (e.beta > 55 && !isDrinking && sipCount < 3) {
          triggerSipAction();
        }
      }
    };

    window.addEventListener('deviceorientation', handleOrientation);
    return () => window.removeEventListener('deviceorientation', handleOrientation);
  }, [sipCount, isDrinking]);

  const triggerSipAction = () => {
    if (isDrinking || sipCount >= 3) return;

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
      if (nextSips >= 3) {
        audioService.playChimeShockwave();
        setTimeout(() => {
          onComplete();
        }, 2500);
      }
    }, 2200);
  };

  return (
    <div className="flex flex-col h-full justify-between items-center text-center p-3 select-none animate-in fade-in duration-300">
      
      {/* Top Banner: Vagal Maneuver & Live Pulse Reduction */}
      <div className="w-full flex items-center justify-between text-xs px-3 py-1.5 bg-white/90 shadow-sm rounded-[16px] border border-slate-200">
        <div className="flex items-center gap-1.5 text-[#1F77DF]">
          <GlassWater className="w-4 h-4 text-[#1F77DF]" />
          <span className="font-semibold text-slate-800">
            {lang === 'th' ? 'กระตุ้น Vagus Nerve' : 'Vagal Maneuver'}
          </span>
        </div>

        {/* Live dropping pulse metric */}
        <div className="flex items-center gap-1.5 bg-[#EF7773]/10 border border-[#EF7773]/30 px-2.5 py-0.5 rounded-full text-[#EF7773]">
          <Activity className="w-3.5 h-3.5 animate-heart-pulse text-[#EF7773]" />
          <span className="font-mono font-bold text-xs">{currentBpm} bpm</span>
        </div>
      </div>

      {/* Mooca Mascot Drinking Companion */}
      <div className="flex flex-col items-center mt-1">
        <MoocaMascot
          mood={sipCount >= 3 ? 'celebrating' : 'drinking'}
          size="xs"
          speakingBubble={
            sipCount >= 3
              ? (lang === 'th' ? 'ชื่นใจไหมจ๊ะ? หัวใจเต้นช้าลงและสงบแล้วนะ!' : 'Refreshed! Heart rate is calm now!')
              : (lang === 'th' ? 'จิบน้ำกับ Mooca ช้าๆ 3 อึกนะ หายใจเข้าแล้วกลืนนะ' : 'Take 3 victory sips with Mooca!')
          }
        />

        <h3 className="text-base font-bold text-slate-800 tracking-tight flex items-center justify-center gap-1.5 mt-0.5">
          <Sparkles className="w-4 h-4 text-[#00C4B3]" />
          {lang === 'th' ? 'ดื่มน้ำชัยชนะ' : 'The Victory Sip'}
        </h3>
        <p className="text-xs text-slate-600 max-w-xs mt-0.5 leading-snug">
          {lang === 'th'
            ? '“ยกมือถือขึ้นจรดริมฝีปากและเอียงขึ้น หรือกดปุ่มจิบน้ำช้าๆ 3 อึก เพื่อกระตุ้นประสาทสงบ”'
            : '"Tilt phone toward lips or tap button to take 3 slow sips. Swallowing slows pulse."'}
        </p>
      </div>

      {/* Central Glass with 2D Canvas Fluid Dynamics */}
      <div className="relative my-1 flex flex-col items-center justify-center">
        {/* Ambient Glow */}
        <div className="absolute w-52 h-64 rounded-full bg-[#00C4B3]/15 blur-3xl pointer-events-none" />

        {/* Glass Container */}
        <div className="relative w-44 h-56 rounded-b-3xl border-4 border-slate-300 bg-white/70 backdrop-blur-md overflow-hidden flex flex-col justify-end shadow-lg">
          {/* Canvas Wave Surface */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
          />

          {/* Glass Highlights */}
          <div className="absolute top-2 left-2.5 w-1.5 h-44 rounded-full bg-white/40 blur-[1px] pointer-events-none" />
          <div className="absolute top-4 right-2.5 w-1 h-32 rounded-full bg-white/20 blur-[1px] pointer-events-none" />

          {/* Vagus Breathing Phase Prompt */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none p-3">
            {sipCount >= 3 ? (
              <div className="bg-white/95 px-4 py-2 rounded-[16px] border-2 border-[#00C4B3] shadow-md animate-in zoom-in duration-200">
                <span className="text-sm font-bold text-[#009688] block">
                  {lang === 'th' ? '✓ ร่างกายได้รับสัญญาณสงบแล้ว' : '✓ Vagus Signal Transmitted'}
                </span>
                <span className="text-[11px] font-semibold text-slate-600 mt-0.5 block">
                  {lang === 'th' ? `ชีพจรผ่อนคลายเหลือ ${currentBpm} bpm` : `Pulse normalized to ${currentBpm} bpm`}
                </span>
              </div>
            ) : isDrinking ? (
              <div className="bg-white/95 px-3.5 py-2 rounded-[16px] border-2 border-[#1F77DF] text-[#1F77DF] text-xs font-bold shadow-md animate-pulse">
                {breathPhase === 'inhale' && (lang === 'th' ? 'สูดหายใจเข้าลึก...' : 'Deep Inhale...')}
                {breathPhase === 'swallow' && (lang === 'th' ? '💧 กลืนน้ำช้าๆ 1 อึก' : '💧 Swallow Slow Sip')}
                {breathPhase === 'exhale' && (lang === 'th' ? 'ผ่อนลมหายใจออกยาว...' : 'Slow Exhale...')}
              </div>
            ) : (
              <div className="text-slate-800 font-mono font-bold text-xs bg-white/80 px-3 py-1 rounded-full shadow-sm border border-slate-200">
                {sipCount} / 3 {lang === 'th' ? 'อึก' : 'Sips'}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Controls & Tilt Angle Simulation */}
      <div className="w-full max-w-xs space-y-2">
        {!hasGyroscope && (
          <div className="bg-white px-3 py-1.5 rounded-[12px] border border-slate-200 flex items-center justify-between text-xs shadow-2xs">
            <span className="text-slate-500 text-[11px] font-medium">
              {lang === 'th' ? 'องศาการเอียงแก้ว:' : 'Liquid Tilt Angle:'}
            </span>
            <input
              type="range"
              min="-35"
              max="35"
              value={tiltAngle}
              onChange={(e) => setTiltAngle(Number(e.target.value))}
              className="w-28 accent-[#00C4B3]"
            />
          </div>
        )}

        <Button
          variant="primary"
          colorTheme="turquoise"
          size="lg"
          fullWidth
          isDisabled={isDrinking || sipCount >= 3}
          isLoading={isDrinking}
          onClick={triggerSipAction}
          leadingIcon={<GlassWater className="w-4 h-4" />}
          label={
            sipCount >= 3
              ? (lang === 'th' ? 'ดื่มครบ 3 อึก — สบายใจขึ้นแล้ว' : 'Victory Sip Complete')
              : (lang === 'th' ? `จิบน้ำชัยชนะ อึกที่ ${sipCount + 1} / 3` : `Take Victory Sip ${sipCount + 1} of 3`)
          }
        />

        {sipCount >= 3 && (
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
