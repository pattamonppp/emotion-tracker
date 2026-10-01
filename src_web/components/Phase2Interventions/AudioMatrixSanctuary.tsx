import React, { useState, useEffect, useRef } from 'react';
import { MBTIType } from '../../types';
import { MBTI_SANCTUARY_SCRIPTS, getMBTIArchetype } from '../../data/matrixData';
import { audioService } from '../../services/audioService';
import { Button } from '../../design-system/Button';
import { MoocaMascot } from '../MoocaMascot';
import { Headphones, Volume2, Waves, Radio, Activity, Sparkles, Check } from 'lucide-react';

interface AudioMatrixSanctuaryProps {
  mbti: MBTIType;
  onComplete: () => void;
  lang: 'th' | 'en';
}

type BrainwaveMode = 'alpha' | 'theta' | 'delta' | 'gamma';

export const AudioMatrixSanctuary: React.FC<AudioMatrixSanctuaryProps> = ({
  mbti,
  onComplete,
  lang,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [soundMode, setSoundMode] = useState<'alpha' | 'brown' | 'both'>('both');
  const [brainwave, setBrainwave] = useState<BrainwaveMode>('alpha');
  const [secondsRemaining, setSecondsRemaining] = useState(45);
  const [isDone, setIsDone] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const archetype = getMBTIArchetype(mbti);
  const voiceScript = MBTI_SANCTUARY_SCRIPTS[archetype][lang];

  // Visualizer Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = 240);
    const height = (canvas.height = 90);
    let step = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      step += 0.04;

      const bars = 26;
      const barWidth = 4;
      const gap = (width - bars * barWidth) / (bars - 1);

      for (let i = 0; i < bars; i++) {
        const amp = isPlaying
          ? Math.sin(step + i * 0.25) * 22 + Math.cos(step * 0.8 + i * 0.15) * 12 + 30
          : 6;

        const x = i * (barWidth + gap);
        const y = (height - amp) / 2;

        const grad = ctx.createLinearGradient(0, y, 0, y + amp);
        grad.addColorStop(0, '#00C4B3');
        grad.addColorStop(1, '#62A0E9');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, amp, 3);
        ctx.fill();
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying]);

  useEffect(() => {
    startAudio();

    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsDone(true);
          audioService.playChimeShockwave();
          return 0;
        }
        if (prev % 3 === 0) {
          audioService.triggerHaptic(18);
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
      audioService.stopNeuralEntrainment();
    };
  }, []);

  const startAudio = () => {
    audioService.startNeuralEntrainment(soundMode);
    audioService.playVoiceSanctuary(voiceScript, lang, 0.86);
    setIsPlaying(true);
  };

  const replayVoice = () => {
    audioService.playVoiceSanctuary(voiceScript, lang, 0.86);
  };

  return (
    <div className="flex flex-col h-full justify-between items-center text-center p-3 select-none animate-in fade-in duration-300">
      
      {/* Top Protocol Spec */}
      <div className="w-full flex items-center justify-between text-xs px-2.5 py-1.5 bg-white/90 shadow-sm rounded-[16px] border border-slate-200">
        <div className="flex items-center gap-1.5 text-[#009688]">
          <Headphones className="w-4 h-4 text-[#00C4B3]" />
          <span className="font-semibold text-slate-800">
            {lang === 'th' ? 'คลื่นเสียงสงบใจ' : 'Neural Audio Matrix'}
          </span>
        </div>
        <span className="font-mono text-[11px] text-[#009688] bg-[#DBF0EE] px-2 py-0.5 rounded-full font-bold border border-[#00C4B3]/30">
          MBTI: {mbti}
        </span>
      </div>

      {/* Mooca Mascot in Headphones */}
      <div className="flex flex-col items-center mt-1">
        <MoocaMascot
          mood={isDone ? 'celebrating' : 'listening'}
          size="xs"
          speakingBubble={
            isDone
              ? (lang === 'th' ? 'ใจสงบลงแล้วใช่ไหมจ๊ะ? ไปก้าวต่อไปด้วยกันนะ!' : 'Your mind is peacefully focused!')
              : (lang === 'th' ? 'หลับตาลงนะ Mooca จะเปิดเสียงสบายๆ กล่อมใจเธอเอง' : 'Close your eyes, Mooca is here with you')
          }
        />

        <h3 className="text-base font-bold text-slate-800 tracking-tight flex items-center justify-center gap-1.5 mt-0.5">
          <Sparkles className="w-4 h-4 text-[#00C4B3]" />
          {lang === 'th' ? 'คลื่นเสียงปรับสมดุล & เสียงนำใจ' : 'Neural Entrainment & Sanctuary'}
        </h3>
        <p className="text-xs text-slate-600 max-w-xs mt-0.5 leading-snug">
          {lang === 'th'
            ? '“สวมหูฟังหรือแนบมือถือใกล้ใบหู ปล่อยให้คลื่น Alpha 10Hz นำสติเข้าสู่ความสงบ”'
            : '"Listen with headphones or close to ear. 10Hz Alpha waves induce calm focus."'}
        </p>
      </div>

      {/* Live Frequency Spectrum Visualizer */}
      <div className="my-1 p-2.5 rounded-[16px] bg-white border border-slate-200 shadow-sm flex flex-col items-center">
        <canvas
          ref={canvasRef}
          className="w-56 h-12"
        />
        <div className="flex items-center justify-between w-full mt-1.5 text-[10px] text-slate-500 font-mono font-medium">
          <span className="text-[#009688] font-bold">10 Hz Binaural Alpha</span>
          <span className="font-bold text-slate-700">{secondsRemaining}s remaining</span>
          <span className="text-[#1F77DF]">Brown Noise 320Hz</span>
        </div>
      </div>

      {/* Pre-Generated Voice Sanctuary Transcript Card */}
      <div className="w-full max-w-xs bg-white p-3 rounded-[16px] border border-slate-200 text-left space-y-1 shadow-sm">
        <div className="flex items-center justify-between text-[11px] text-slate-500">
          <span className="flex items-center gap-1 font-bold text-[#009688]">
            <Volume2 className="w-3.5 h-3.5 text-[#00C4B3]" />
            {lang === 'th' ? 'เสียงปลอบประโลมจาก Mooca:' : 'Mooca Voice Sanctuary:'}
          </span>
          <button
            onClick={replayVoice}
            className="text-[10px] font-semibold text-[#00C4B3] hover:underline cursor-pointer"
          >
            {lang === 'th' ? 'ฟังซ้ำ ↺' : 'Replay ↺'}
          </button>
        </div>
        <p className="text-xs text-slate-700 leading-relaxed italic border-l-2 border-[#00C4B3] pl-2.5">
          "{voiceScript}"
        </p>
      </div>

      {/* Brainwave selector & Thumb Zone Action */}
      <div className="w-full max-w-xs space-y-2">
        <div className="grid grid-cols-4 gap-1 text-[10px]">
          {(['alpha', 'theta', 'delta', 'gamma'] as BrainwaveMode[]).map((bw) => (
            <button
              key={bw}
              onClick={() => {
                setBrainwave(bw);
                audioService.triggerHaptic(15);
              }}
              className={`py-1 rounded-[10px] font-mono capitalize transition-all border ${
                brainwave === bw
                  ? 'bg-[#00C4B3] text-white font-bold border-[#00C4B3] shadow-2xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {bw === 'alpha' ? 'α 10Hz' : bw === 'theta' ? 'θ 6Hz' : bw === 'delta' ? 'δ 2Hz' : 'γ 40Hz'}
            </button>
          ))}
        </div>

        <Button
          variant="primary"
          colorTheme="turquoise"
          size="lg"
          fullWidth
          onClick={onComplete}
          label={
            isDone
              ? (lang === 'th' ? 'เข้าสู่หน้าสะท้อนความคิด' : 'Proceed to Reframing Page')
              : (lang === 'th' ? 'รู้สึกสงบแล้ว พร้อมก้าวต่อไป' : 'I Feel Grounded & Focused')
          }
        />
      </div>

    </div>
  );
};
