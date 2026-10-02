import React, { useState, useEffect, useRef } from 'react';
import { audioService } from '../services/audioService';
import { Button } from '../design-system/Button';
import { Activity, X, Heart, ShieldCheck, Zap, RefreshCw } from 'lucide-react';

interface LivePulseSensorModalProps {
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
  const [scanProgress, setScanProgress] = useState(0); // 0 to 100
  const [measuredBpm, setMeasuredBpm] = useState(currentBpm);
  const [hrvMs, setHrvMs] = useState(48);
  const [isScanComplete, setIsScanComplete] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Live PPG (Photoplethysmography) Pulse Waveform Canvas
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
          // Realistic dicrotic notch PPG wave
          if (t > 40 && t < 48) {
            y -= 38; // Systolic peak
          } else if (t >= 48 && t < 55) {
            y += 12; // Dicrotic notch valley
          } else if (t >= 55 && t < 65) {
            y -= 8; // Diastolic secondary wave
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
            setIsScanComplete(true);
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
  }, [isFingerOnSensor, scanProgress]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-5 flex flex-col text-slate-100 text-center relative overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-[12px] bg-[#F26E6E]/20 text-[#F26E6E] flex items-center justify-center">
              <Activity className="w-4 h-4 animate-heart-pulse" />
            </div>
            <div className="text-left">
              <h3 className="text-sm font-bold text-white">
                {lang === 'th' ? 'เซนเซอร์วัดชีพจรชีววิทยา' : 'Bio-Pulse Optical Sensor'}
              </h3>
              <p className="text-[10px] text-slate-400">
                {lang === 'th' ? 'จำลอง Apple Health & PPG Sensor' : 'Simulating Live PPG & Apple Health'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Live PPG Graph */}
        <div className="my-3 bg-slate-950 p-2 rounded-[12px] border border-slate-800">
          <canvas ref={canvasRef} className="w-full h-24" />
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mt-1 px-1">
            <span className="flex items-center gap-1 text-[#00C4B3]">
              <span className={`w-2 h-2 rounded-full ${isFingerOnSensor ? 'bg-[#00C4B3] animate-ping' : 'bg-slate-600'}`} />
              {isFingerOnSensor ? 'PPG OPTICAL ACTIVE' : 'TOUCH TO SENSE'}
            </span>
            <span>HRV: {hrvMs} ms (SDNN)</span>
          </div>
        </div>

        {/* Tactile Finger Touchpad Sensor */}
        <div className="my-2 flex flex-col items-center justify-center">
          <div
            onPointerDown={() => setIsFingerOnSensor(true)}
            onPointerUp={() => setIsFingerOnSensor(false)}
            onPointerCancel={() => setIsFingerOnSensor(false)}
            className={`w-24 h-24 rounded-full border-4 cursor-pointer flex flex-col items-center justify-center transition-all duration-200 select-none touch-none ${
              isFingerOnSensor
                ? 'border-[#F26E6E] bg-rose-950/40 shadow-xl shadow-rose-500/40 scale-105'
                : 'border-slate-700 bg-slate-800/80 hover:border-slate-500'
            }`}
          >
            <Heart className={`w-8 h-8 ${isFingerOnSensor ? 'text-[#F26E6E] animate-heart-pulse' : 'text-slate-400'}`} />
            <span className="text-[10px] font-bold text-white mt-1">
              {isFingerOnSensor
                ? `${scanProgress}%`
                : (lang === 'th' ? 'แตะค้างที่นี่' : 'Hold Finger')}
            </span>
          </div>
          <span className="text-[11px] text-slate-400 mt-2 max-w-[220px]">
            {lang === 'th'
              ? 'วางนิ้วชี้แนบจุดเซนเซอร์ค้างไว้ 3 วินาที เพื่อจำลองการวัดชีพจรจริง'
              : 'Hold index finger over the pulse sensor pad for 3s to capture baseline.'}
          </span>
        </div>

        {/* Measured Metrics */}
        <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
          <div className="p-2.5 rounded-[8px] bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Heart Rate</span>
            <div className="text-xl font-mono font-bold text-white mt-0.5">
              {measuredBpm} <span className="text-xs text-[#00C4B3]">bpm</span>
            </div>
          </div>
          <div className="p-2.5 rounded-[8px] bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Autonomic State</span>
            <div className="text-xs font-semibold text-[#00C4B3] mt-1 truncate">
              {measuredBpm < 85 ? '🌿 Parasympathetic' : '⚡ High Sympathetic'}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-slate-800">
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
