import React, { useState, useEffect } from 'react';
import { 
  Wifi, 
  Battery, 
  Layers, 
  Languages, 
  Sparkles,
  Maximize2,
  Minimize2,
  Heart,
  BookOpen
} from 'lucide-react';
import { UserProfile, ResetPhase } from '../types';
import { MindfullLogo } from './MindfullLogo';
import { MoocaMascot } from './MoocaMascot';

interface MobileFrameProps {
  children: React.ReactNode;
  profile: UserProfile;
  currentPhase: ResetPhase;
  phaseTime: number; // in seconds
  onOpenDesignSystem: () => void;
  onOpenProfile: () => void;
  onToggleLanguage: () => void;
  onOpenStory?: () => void;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({
  children,
  profile,
  currentPhase,
  phaseTime,
  onOpenDesignSystem,
  onOpenProfile,
  onToggleLanguage,
  onOpenStory,
}) => {
  const [isFramed, setIsFramed] = useState(true);
  const [timeString, setTimeString] = useState('08:24');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const getPhaseName = () => {
    if (profile.language === 'th') {
      switch (currentPhase) {
        case 'phase1_jar': return '1. โหลเก็บความกังวล';
        case 'phase2_intervention': return '2. กายกรรมรีเซ็ต';
        case 'phase3_reframing': return '3. ปลดล็อกความคิด';
        case 'phase4_feedback': return '4. วัดผลลัพธ์ใจ';
        case 'completed': return 'กอดใจสำเร็จ';
        default: return 'เริ่มรีเซ็ต';
      }
    } else {
      switch (currentPhase) {
        case 'phase1_jar': return '1. Emotion Jar';
        case 'phase2_intervention': return '2. Somatic Shift';
        case 'phase3_reframing': return '3. Cognitive Insight';
        case 'phase4_feedback': return '4. Bio Feedback';
        case 'completed': return 'Reset Complete';
        default: return 'Start Reset';
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E6F9F7] via-[#FFFDF9] to-[#E0F7F5] flex flex-col items-center justify-center p-0 sm:p-4 text-slate-800 font-sans selection:bg-[#00C4B3]/30">
      
      {/* Desktop External Helper Bar */}
      <div className="hidden sm:flex items-center justify-between w-full max-w-[420px] mb-2 px-3.5 py-1.5 rounded-[16px] bg-white/85 backdrop-blur-md border border-[#00C4B3]/25 text-xs shadow-xs">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#00C4B3] animate-pulse" />
          <span className="font-extrabold text-[#004D40] flex items-center gap-1">
            <span>Mooca & mindfull CI</span>
            <span className="text-[10px] text-[#FA8C3D] font-normal">♥ Best Friend Companion</span>
          </span>
        </div>

        <button
          onClick={() => setIsFramed(!isFramed)}
          className="flex items-center gap-1 px-2.5 py-1 rounded-[10px] bg-white hover:bg-[#E6F9F7] border border-slate-200 text-slate-600 transition-colors shadow-2xs cursor-pointer"
          title="Toggle mobile device frame"
        >
          {isFramed ? <Maximize2 className="w-3 h-3 text-[#00C4B3]" /> : <Minimize2 className="w-3 h-3 text-[#00C4B3]" />}
          <span className="text-[10px] font-bold">{isFramed ? 'Full View' : 'Device Frame'}</span>
        </button>
      </div>

      {/* Main Mobile Screen Shell */}
      <div
        className={`w-full transition-all duration-300 flex flex-col overflow-hidden bg-white relative ${
          isFramed
            ? 'sm:w-[390px] sm:h-[844px] sm:max-h-[94vh] sm:rounded-[48px] sm:border-[8px] sm:border-white sm:shadow-[0_20px_50px_rgba(0,196,179,0.25)] ring-1 ring-[#00C4B3]/20'
            : 'w-full min-h-screen max-w-lg'
        }`}
      >
        {/* Dynamic Island / Mobile Status Bar (Zero-pixel container from CI Shapes) */}
        <div className="h-11 px-6 flex items-center justify-between text-xs font-semibold text-slate-700 shrink-0 bg-white/95 select-none border-b border-slate-100">
          <span className="font-mono tracking-tight text-[13px] text-[#004D40] font-bold">{timeString}</span>

          {/* Dynamic Island Pill with countdown */}
          <div className="h-5 w-24 rounded-full bg-[#E6F9F7] border border-[#00C4B3]/35 flex items-center justify-center gap-1.5 px-2 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00C4B3] animate-ping" />
            <span className="text-[10px] font-mono text-[#004D40] font-extrabold">
              {formatSeconds(phaseTime)}
            </span>
          </div>

          <div className="flex items-center gap-2 text-slate-500">
            <Wifi className="w-3.5 h-3.5 text-[#00C4B3]" />
            <Battery className="w-4 h-4 text-slate-600" />
          </div>
        </div>

        {/* Top Bar Contract (1 row, 3 zones) */}
        <header className="h-13 px-4 flex items-center justify-between border-b border-[#00C4B3]/15 bg-white/95 backdrop-blur-md shrink-0">
          {/* Zone 1: Single text element wordmark -> Official mindfull Logo */}
          <div className="flex items-center gap-2">
            <MindfullLogo size="md" />
            <span className="text-[9px] font-mono font-bold text-[#004D40] bg-[#E6F9F7] px-1.5 py-0.5 rounded-[6px] border border-[#00C4B3]/30">
              120s
            </span>
          </div>

          {/* Zone 2: Step & Story trigger (clean, uncluttered) */}
          {onOpenStory && (
            <button
              onClick={onOpenStory}
              className="flex items-center gap-1 bg-[#E6F9F7] hover:bg-[#33D0C2]/20 border border-[#00C4B3]/30 px-2.5 py-1 rounded-full text-[#004D40] font-bold text-[10px] transition-all cursor-pointer shadow-2xs"
              title="เรื่องราวของ Mooca"
            >
              <span className="text-xs">🐑</span>
              <span>{profile.language === 'th' ? 'เพื่อน Mooca' : 'Mooca'}</span>
            </button>
          )}

          {/* Zone 3: Primary Actions (Language, Profile, Inspector) */}
          <div className="flex items-center gap-1.5">
            {/* Design Tokens Inspector Trigger */}
            <button
              onClick={onOpenDesignSystem}
              className="w-7 h-7 rounded-full bg-slate-50 hover:bg-[#E6F9F7] border border-slate-200 flex items-center justify-center text-[#00C4B3] transition-colors cursor-pointer"
              title="Design Tokens"
            >
              <Layers className="w-3 h-3" />
            </button>

            {/* Language Switch */}
            <button
              onClick={onToggleLanguage}
              className="h-7 px-2 rounded-full bg-slate-50 hover:bg-[#E6F9F7] border border-slate-200 text-[10px] font-bold text-slate-700 flex items-center gap-1 transition-colors cursor-pointer"
              title="Toggle TH / EN"
            >
              <Languages className="w-2.5 h-2.5 text-[#00C4B3]" />
              <span>{profile.language.toUpperCase()}</span>
            </button>

            {/* User Profile Avatar */}
            <button
              onClick={onOpenProfile}
              className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#00C4B3] to-[#62A0E9] flex items-center justify-center text-white font-extrabold text-xs shadow-2xs hover:scale-105 active:scale-95 transition-transform cursor-pointer"
              title="Profile & Calibration"
            >
              {profile.name.charAt(0).toUpperCase() || 'M'}
            </button>
          </div>
        </header>

        {/* Mobile Viewport Body with Cozy Gradient */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col relative mobile-viewport-container bg-gradient-to-b from-[#E6F9F7]/50 via-[#FFFDF9] to-[#F8FDFD]">
          {children}
        </main>

        {/* Mobile Safe Home Indicator Bar */}
        <div className="h-5 bg-white flex items-center justify-center shrink-0 border-t border-slate-50">
          <div className="w-32 h-1 rounded-full bg-slate-300" />
        </div>
      </div>

    </div>
  );
};
