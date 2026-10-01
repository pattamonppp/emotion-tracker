import React, { useState, useEffect, useRef } from 'react';
import { audioService } from '../../services/audioService';
import { Button } from '../../design-system/Button';
import { MoocaMascot } from '../MoocaMascot';
import { Zap, Activity, CheckCircle2, RotateCw, Sparkles } from 'lucide-react';

interface KineticShakerProps {
  onComplete: () => void;
  lang: 'th' | 'en';
}

export const KineticShaker: React.FC<KineticShakerProps> = ({
  onComplete,
  lang,
}) => {
  const [mode, setMode] = useState<'shake' | 'bounce'>('shake');
  const [shakesLeft, setShakesLeft] = useState(15);
  const [bouncesLeft, setBouncesLeft] = useState(10);
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
      if (totalAcc > 22 && now - lastShakeTime.current > 240) {
        lastShakeTime.current = now;
        handleCycle();
      }
    };

    window.addEventListener('devicemotion', handleMotion);
    return () => window.removeEventListener('devicemotion', handleMotion);
  }, [shakesLeft, bouncesLeft, mode, isFinished]);

  const handleCycle = () => {
    if (isFinished) return;

    if (mode === 'shake') {
      const remaining = Math.max(0, shakesLeft - 1);
      setShakesLeft(remaining);
      audioService.playShakerClick(remaining);
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 120);

      if (remaining === 0) {
        finishIntervention();
      }
    } else {
      const remaining = Math.max(0, bouncesLeft - 1);
      setBouncesLeft(remaining);
      audioService.playShakerClick(remaining);
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 120);

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
    }, 2800);
  };

  const totalCycles = mode === 'shake' ? 15 : 10;
  const currentRemaining = mode === 'shake' ? shakesLeft : bouncesLeft;
  const tensionPercentage = (currentRemaining / totalCycles) * 100;

  return (
    <div className="flex flex-col h-full justify-between items-center text-center p-3 select-none animate-in fade-in duration-300">
      
      {/* Mode Switcher */}
      <div className="w-full flex items-center justify-between text-xs px-3 py-1.5 bg-white/90 shadow-sm rounded-[16px] border border-slate-200">
        <div className="flex items-center gap-1.5 text-[#EF7773]">
          <Zap className="w-4 h-4 animate-bounce text-[#EF7773]" />
          <span className="font-semibold text-slate-800">
            {lang === 'th' ? 'สะบัดทิ้งพลังลบ' : 'Somatic Discharge'}
          </span>
        </div>

        <div className="flex gap-1">
          <button
            onClick={() => setMode('shake')}
            className={`px-3 py-1 rounded-[12px] text-xs font-semibold transition-all ${
              mode === 'shake' ? 'bg-[#00C4B3] text-white shadow-sm' : 'bg-slate-100 text-slate-600'
            }`}
          >
            {lang === 'th' ? 'สะบัดข้อมือ' : 'Arm Shake'}
          </button>
          <button
            onClick={() => setMode('bounce')}
            className={`px-3 py-1 rounded-[12px] text-xs font-semibold transition-all ${
              mode === 'bounce' ? 'bg-[#00C4B3] text-white shadow-sm' : 'bg-slate-100 text-slate-600'
            }`}
          >
            {lang === 'th' ? 'กระโดดเบาๆ' : 'Bounce'}
          </button>
        </div>
      </div>

      {/* Mooca Companion Guidance */}
      <div className="flex flex-col items-center mt-1">
        <MoocaMascot
          mood={isFinished ? 'celebrating' : 'shaking'}
          size="xs"
          speakingBubble={
            isFinished
              ? (lang === 'th' ? 'เย้! พลังลบกระจายหายหมดแล้ว สบายตัวขึ้นเยอะเลย!' : 'All discharged! Feeling light!')
              : mode === 'shake'
              ? (lang === 'th' ? 'สะบัดข้อมือไปพร้อม Mooca เลย! สะบัด สะบัด สะบัด!' : 'Shake away bad vibes with Mooca!')
              : (lang === 'th' ? 'กระโดดดึ๋งๆ เบาๆ เติมออกซิเจนให้สมองสดใสนะ!' : 'Bounce lightly to recharge brain oxygen!')
          }
        />

        <h3 className="text-base font-bold text-slate-800 tracking-tight flex items-center justify-center gap-1.5 mt-0.5">
          <Sparkles className="w-4 h-4 text-[#EF7773]" />
          {mode === 'shake'
            ? (lang === 'th' ? 'สะบัดทิ้งพลังลบ (Kinetic Shaker)' : 'Kinetic Tension Shaker')
            : (lang === 'th' ? 'กระโดดรีเซ็ตสติ (Micro-Bounce)' : 'Oxygenation Micro-Bounce')}
        </h3>
        <p className="text-xs text-slate-600 max-w-xs mt-0.5 leading-snug">
          {mode === 'shake'
            ? (lang === 'th'
                ? '“กำมือถือให้มั่นแล้วสะบัดข้อมือเร็วๆ 15 ครั้ง เพื่อคลายกล้ามเนื้อที่เกร็งค้าง”'
                : '"Grip device securely and shake wrists firmly 15 times to discharge stored tension."')
            : (lang === 'th'
                ? '“แนบมือถือกับอก แล้วกระโดดหย็องๆ 10 ครั้ง เพื่อสูบฉีดออกซิเจนกลับสู่สมอง”'
                : '"Hold device against chest and bounce lightly 10 times to boost prefrontal oxygen."')}
        </p>
      </div>

      {/* Cozy Tension Gauge */}
      <div className="relative my-1 flex items-center justify-center gap-6">
        {/* Tension Meter Tube */}
        <div className="relative w-12 h-52 rounded-full border-4 border-slate-300 bg-white/80 overflow-hidden flex flex-col justify-end p-1 shadow-md">
          {/* Tension Fluid (Red/Sunshade to Turquoise) */}
          <div
            className="w-full rounded-full transition-all duration-200"
            style={{
              height: `${tensionPercentage}%`,
              background: tensionPercentage > 50
                ? 'linear-gradient(180deg, #EF7773 0%, #FF8F4B 100%)'
                : 'linear-gradient(180deg, #FF8F4B 0%, #00C4B3 100%)',
              boxShadow: '0 0 10px rgba(239, 119, 115, 0.3)',
            }}
          />

          {/* Scale Markings */}
          <div className="absolute inset-0 flex flex-col justify-between py-4 pointer-events-none opacity-40">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="w-full h-0.5 bg-slate-400" />
            ))}
          </div>
        </div>

        {/* Counter Display & Shake Feedback */}
        <div className="flex flex-col items-center">
          <div
            className={`w-28 h-28 rounded-full border-4 flex flex-col items-center justify-center transition-all ${
              isShaking
                ? 'border-[#EF7773] bg-[#EF7773]/15 scale-110 shadow-lg shadow-rose-300'
                : isFinished
                ? 'border-[#00C4B3] bg-[#DBF0EE] shadow-md shadow-[#00C4B3]/30'
                : 'border-slate-300 bg-white shadow-sm'
            }`}
          >
            {isFinished ? (
              <CheckCircle2 className="w-12 h-12 text-[#009688] animate-in zoom-in" />
            ) : (
              <>
                <span className="text-3xl font-mono font-extrabold text-slate-800">
                  {currentRemaining}
                </span>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">
                  {lang === 'th' ? 'รอบที่เหลือ' : 'Cycles Left'}
                </span>
              </>
            )}
          </div>

          <div className="text-[11px] text-slate-500 mt-2 font-medium">
            {isFinished
              ? (lang === 'th' ? '✓ ปลดปล่อยความตึงเครียดหมดแล้ว' : '✓ Somatic Tension Released')
              : (lang === 'th' ? 'สะบัดหรือกดปุ่มด้านล่างได้เลย' : 'Shake device or tap button')}
          </div>
        </div>
      </div>

      {/* Action Trigger Button in Natural Thumb Zone */}
      <div className="w-full max-w-xs space-y-2">
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
              ? (lang === 'th' ? 'ปลดปล่อยพลังลบสำเร็จ' : 'Discharge Complete')
              : mode === 'shake'
              ? (lang === 'th' ? `สะบัดข้อมือ! (${shakesLeft} ครั้ง)` : `Tap / Shake Wrist (${shakesLeft} left)`)
              : (lang === 'th' ? `กระโดดเบาๆ! (${bouncesLeft} ครั้ง)` : `Tap / Micro-Bounce (${bouncesLeft} left)`)
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
