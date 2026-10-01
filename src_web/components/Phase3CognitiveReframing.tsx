import React, { useState } from 'react';
import { GoalType } from '../types';
import { REFRAMING_INSIGHTS } from '../data/matrixData';
import { audioService } from '../services/audioService';
import { Button } from '../design-system/Button';
import { MoocaMascot } from './MoocaMascot';
import { 
  Lightbulb, 
  ArrowRight, 
  CheckCircle, 
  Dna, 
  Footprints, 
  Sparkles,
  Heart,
  ShieldCheck,
  Check
} from 'lucide-react';

interface Phase3CognitiveReframingProps {
  goal: GoalType;
  onProceed: () => void;
  lang: 'th' | 'en';
}

export const Phase3CognitiveReframing: React.FC<Phase3CognitiveReframingProps> = ({
  goal,
  onProceed,
  lang,
}) => {
  const [isActionCommitted, setIsActionCommitted] = useState(false);
  const insight = REFRAMING_INSIGHTS[goal];

  const handleCommitAction = () => {
    setIsActionCommitted(true);
    audioService.triggerHaptic([30, 45]);
    audioService.playJarDrop();
  };

  return (
    <div className="flex flex-col h-full justify-between pb-3 px-4 pt-1 animate-in fade-in duration-300">
      
      {/* Mooca Mascot & Heading */}
      <div className="flex flex-col items-center mt-1">
        <MoocaMascot
          mood={isActionCommitted ? 'celebrating' : 'comforting'}
          size="sm"
          speakingBubble={
            isActionCommitted
              ? (lang === 'th' ? 'สัญญากันแล้วนะ! Mooca จะคอยเชียร์อยู่ข้างๆ เสมอ!' : 'Pinky promise! Mooca is right beside you!')
              : (lang === 'th'
                  ? 'รู้ไหม? อาการตื่นเต้นนี้ ไม่ใช่ความกลัวนะ แต่คือร่างกายกำลังช่วยเธออยู่!'
                  : 'Physical surges are your body priming peak focus, not fear!')
          }
        />

        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#E6F9F7] border border-[#00C4B3]/35 text-[#004D40] text-[11px] font-extrabold mt-1 mb-0.5 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-[#00C4B3]" />
          <span>{lang === 'th' ? 'จดหมายสะท้อนใจจาก Mooca (1:20 - 1:45)' : 'Phase 3: Cognitive Insight'}</span>
        </div>
        
        <h2 className="text-base font-extrabold text-[#004D40] tracking-tight">
          {lang === 'th' ? 'ความจริงทางชีววิทยาที่ Mooca อยากบอก' : 'Biological Insight & 1 Action'}
        </h2>
      </div>

      {/* Main Content Area: Cute Cozy Cards */}
      <div className="space-y-2.5 my-1 flex-1 overflow-y-auto">
        
        {/* 1. Contextual Behavioral Reflection Card */}
        <div className="p-3.5 rounded-[22px] bg-white border border-[#00C4B3]/30 shadow-xs text-left relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-[#00C4B3]" />
          
          <div className="flex items-center gap-1.5 mb-1.5 text-xs font-bold text-[#004D40] uppercase tracking-wide">
            <Heart className="w-3.5 h-3.5 text-[#F26E6E] fill-[#F26E6E]" />
            <span>{lang === 'th' ? 'ข้อความคลายใจจากเพื่อน Mooca' : 'Behavioral Reflection'}</span>
          </div>

          <p className="text-xs font-bold text-slate-800 leading-relaxed">
            {lang === 'th' ? insight.reflectionTh : insight.reflectionEn}
          </p>

          <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-start gap-2 text-[11px] text-[#004D40] font-medium bg-[#E6F9F7]/60 p-2 rounded-[12px]">
            <Dna className="w-4 h-4 text-[#1F77DF] shrink-0 mt-0.5" />
            <span>{lang === 'th' ? insight.biologyFactTh : insight.biologyFactEn}</span>
          </div>
        </div>

        {/* 2. The 1 Micro-Action Next Step */}
        <div className="p-3.5 rounded-[22px] bg-gradient-to-br from-white to-[#FFFDF9] border-2 border-[#FA8C3D]/40 shadow-xs text-left">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#FA8C3D] uppercase tracking-wide">
              <Footprints className="w-4 h-4 text-[#FA8C3D]" />
              <span>{lang === 'th' ? '1 ก้าวถัดไปที่ทำได้ทันที' : 'The 1 Micro-Action'}</span>
            </div>
            <span className="text-[10px] font-bold text-[#004D40] bg-[#E6F9F7] px-2 py-0.5 rounded-full border border-[#00C4B3]/30">
              {lang === 'th' ? 'ทำทันที' : 'Immediate'}
            </span>
          </div>

          <div
            onClick={handleCommitAction}
            className={`p-3 rounded-[16px] border-2 cursor-pointer transition-all duration-200 flex items-center justify-between active:scale-98 ${
              isActionCommitted
                ? 'bg-[#E6F9F7] border-[#00C4B3] text-[#004D40] shadow-sm'
                : 'bg-white border-slate-200 text-slate-800 hover:border-[#00C4B3]'
            }`}
          >
            <div className="flex items-center gap-2 flex-1 pr-2">
              <span className="text-xl">👉</span>
              <span className="text-xs font-bold leading-snug">
                {lang === 'th' ? insight.microActionTh : insight.microActionEn}
              </span>
            </div>
            
            <div
              className={`w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                isActionCommitted ? 'border-[#00C4B3] bg-[#00C4B3] text-white shadow-xs' : 'border-slate-300 bg-slate-50'
              }`}
            >
              {isActionCommitted ? <Check className="w-4 h-4 stroke-[3]" /> : <span className="text-[10px] text-slate-400">แตะ</span>}
            </div>
          </div>

          <p className="text-[10px] text-slate-500 mt-2 font-medium flex items-center gap-1">
            <Heart className="w-3 h-3 text-[#F26E6E] inline" />
            <span>
              {lang === 'th'
                ? 'แตะที่กล่องเพื่อสัญญากับ Mooca แล้วเตรียมก้าวไปลุยนะ'
                : 'Tap to commit this micro-action with Mooca.'}
            </span>
          </p>
        </div>

      </div>

      {/* Footer Proceed Button */}
      <div className="pt-2 border-t border-slate-100">
        <Button
          variant="primary"
          colorTheme="turquoise"
          size="lg"
          fullWidth
          onClick={onProceed}
          trailingIcon={<ArrowRight className="w-4 h-4" />}
          label={
            lang === 'th'
              ? 'วัดผลการเปลี่ยนแปลงอารมณ์ (Phase 4: Delta Check)'
              : 'Measure Emotional Shift (Phase 4)'
          }
        />
      </div>

    </div>
  );
};
