import React, { useState } from 'react';
import { ShiftFeedback, EmotionTagId } from '../types';
import { EMOTION_TAGS } from '../data/matrixData';
import { audioService } from '../services/audioService';
import { Button } from '../design-system/Button';
import { MoocaMascot } from './MoocaMascot';
import { 
  Activity, 
  TrendingDown, 
  CheckCircle2, 
  Smile, 
  ShieldCheck, 
  RotateCcw,
  Sparkles,
  Heart
} from 'lucide-react';

interface Phase4FeedbackProps {
  preHeartRate: number;
  selectedEmotions: EmotionTagId[];
  onFinishReset: (feedback: ShiftFeedback) => void;
  onRestart: () => void;
  lang: 'th' | 'en';
}

export const Phase4Feedback: React.FC<Phase4FeedbackProps> = ({
  preHeartRate,
  selectedEmotions,
  onFinishReset,
  onRestart,
  lang,
}) => {
  const [selectedShift, setSelectedShift] = useState<'empowered' | 'grounded' | 'same' | null>(null);
  const [postHeartRate] = useState(() => Math.max(72, preHeartRate - Math.floor(Math.random() * 8 + 18)));

  const handleSelectShift = (shift: 'empowered' | 'grounded' | 'same') => {
    setSelectedShift(shift);
    audioService.triggerHaptic([40, 60]);
    audioService.playJarDrop();
  };

  const handleFinish = () => {
    if (!selectedShift) return;
    onFinishReset({
      shiftResult: selectedShift,
      preHeartRate,
      postHeartRate,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });
  };

  const hrDelta = preHeartRate - postHeartRate;
  const primaryEmotion = EMOTION_TAGS.find((e) => e.id === selectedEmotions[0]);

  return (
    <div className="flex flex-col h-full justify-between pb-3 px-4 pt-1 animate-in fade-in duration-300">
      
      {/* Mooca Mascot & Heading */}
      <div className="flex flex-col items-center mt-1">
        <MoocaMascot
          mood={selectedShift === 'empowered' ? 'celebrating' : selectedShift === 'grounded' ? 'hugging' : 'happy'}
          size="sm"
          speakingBubble={
            selectedShift === 'empowered'
              ? (lang === 'th' ? 'สุดยอดเลย! Mooca ส่งใจให้เต็มร้อย พร้อมลุยแล้ว!' : 'Empowered! Mooca is cheering for you!')
              : selectedShift === 'grounded'
              ? (lang === 'th' ? 'ใจนิ่งสงบแล้ว ดีใจด้วยนะคนเก่ง!' : 'Calm and steady, wonderful!')
              : (lang === 'th' ? 'ตอนนี้รู้สึกอย่างไรบ้างแล้วจ๊ะ? บอก Mooca ได้เลยนะ' : 'How does your heart feel now?')
          }
        />

        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#E6F9F7] border border-[#00C4B3]/35 text-[#004D40] text-[11px] font-extrabold mt-1 mb-0.5 shadow-2xs">
          <ShieldCheck className="w-3.5 h-3.5 text-[#00C4B3]" />
          <span>{lang === 'th' ? 'Phase 4: วัดผลลัพธ์ใจ (1:45 - 2:00)' : 'Phase 4: Closed-Loop Shift'}</span>
        </div>
        
        <h2 className="text-base font-extrabold text-[#004D40] tracking-tight">
          {lang === 'th' ? 'ตอนนี้รู้สึกอย่างไรเมื่อเทียบกับตอนเริ่ม?' : 'How Do You Feel Right Now?'}
        </h2>
      </div>

      {/* Main Single-Tap Scale Area */}
      <div className="space-y-2.5 my-1 flex-1 flex flex-col justify-center">
        
        {/* The 3 Single-Tap Options */}
        <div className="space-y-2">
          {/* Option 1: Empowered */}
          <button
            type="button"
            onClick={() => handleSelectShift('empowered')}
            className={`w-full p-3 rounded-[20px] border-2 text-left flex items-center justify-between transition-all duration-150 shadow-xs cursor-pointer active:scale-98 ${
              selectedShift === 'empowered'
                ? 'bg-[#00C4B3] text-white font-bold border-[#00C4B3] shadow-md shadow-[#00C4B3]/30 scale-[1.01]'
                : 'bg-white border-slate-200 hover:border-[#00C4B3]'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚡</span>
              <div>
                <div className={`text-xs font-bold ${selectedShift === 'empowered' ? 'text-white' : 'text-[#004D40]'}`}>
                  {lang === 'th' ? 'พร้อมลุย / มั่นใจขึ้น' : 'Empowered & Confident'}
                </div>
                <div className={`text-[10px] ${selectedShift === 'empowered' ? 'text-teal-50' : 'text-slate-500'}`}>
                  {lang === 'th' ? 'อะดรีนาลีนเปลี่ยนเป็นสมาธิอันเฉียบคม' : 'Adrenaline converted to peak focus'}
                </div>
              </div>
            </div>
            {selectedShift === 'empowered' && <CheckCircle2 className="w-5 h-5 text-white" />}
          </button>

          {/* Option 2: Grounded */}
          <button
            type="button"
            onClick={() => handleSelectShift('grounded')}
            className={`w-full p-3 rounded-[20px] border-2 text-left flex items-center justify-between transition-all duration-150 shadow-xs cursor-pointer active:scale-98 ${
              selectedShift === 'grounded'
                ? 'bg-[#00C4B3] text-white font-bold border-[#00C4B3] shadow-md shadow-[#00C4B3]/30 scale-[1.01]'
                : 'bg-white border-slate-200 hover:border-[#00C4B3]'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">🌿</span>
              <div>
                <div className={`text-xs font-bold ${selectedShift === 'grounded' ? 'text-white' : 'text-[#004D40]'}`}>
                  {lang === 'th' ? 'นิ่งขึ้น มีสติ สงบลง' : 'Grounded & Calmer'}
                </div>
                <div className={`text-[10px] ${selectedShift === 'grounded' ? 'text-teal-50' : 'text-slate-500'}`}>
                  {lang === 'th' ? 'ระบบประสาทผ่อนคลาย ชีพจรคืนสมดุล' : 'Parasympathetic restoration'}
                </div>
              </div>
            </div>
            {selectedShift === 'grounded' && <CheckCircle2 className="w-5 h-5 text-white" />}
          </button>

          {/* Option 3: Same */}
          <button
            type="button"
            onClick={() => handleSelectShift('same')}
            className={`w-full p-2.5 rounded-[20px] border-2 text-left flex items-center justify-between transition-all duration-150 cursor-pointer active:scale-98 ${
              selectedShift === 'same'
                ? 'bg-slate-200 border-slate-400 text-slate-800 font-bold'
                : 'bg-white/80 border-slate-200 text-slate-600 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className="text-xl">⚖️</span>
              <div>
                <div className="text-xs font-semibold text-slate-800">
                  {lang === 'th' ? 'ยังกังวลอยู่บ้าง' : 'Still Somewhat Anxious'}
                </div>
                <div className="text-[10px] text-slate-400">
                  {lang === 'th' ? 'ไม่เป็นไรนะ ทำซ้ำกับ Mooca อีกรอบได้' : 'Can run another quick loop with Mooca'}
                </div>
              </div>
            </div>
            {selectedShift === 'same' && <CheckCircle2 className="w-4 h-4 text-slate-700" />}
          </button>
        </div>

        {/* Real-time Delta Display Card */}
        <div className="p-3.5 rounded-[22px] bg-white border border-[#00C4B3]/30 shadow-xs text-left">
          <div className="flex items-center justify-between text-xs text-slate-600 mb-2">
            <span className="font-extrabold text-[#004D40] flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-[#00C4B3]" />
              {lang === 'th' ? 'ชีพจรลดลงอย่างสงบ:' : 'Objective Bio-Delta Feedback:'}
            </span>
            <span className="text-[#004D40] font-mono font-black flex items-center gap-0.5 bg-[#E6F9F7] px-2 py-0.5 rounded-full border border-[#00C4B3]/30">
              <TrendingDown className="w-3.5 h-3.5 text-[#00C4B3]" /> -{hrDelta} bpm
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-center text-xs">
            <div className="p-2.5 rounded-[16px] bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-bold">
                {lang === 'th' ? 'ก่อนเริ่ม' : 'Pre-Reset'}
              </span>
              <div className="text-[#F26E6E] font-mono font-black text-base mt-0.5">
                {preHeartRate} <span className="text-[10px]">bpm</span>
              </div>
              <div className="text-[10px] text-slate-500 truncate mt-0.5 font-medium">
                {primaryEmotion ? (lang === 'th' ? primaryEmotion.labelTh : primaryEmotion.labelEn) : 'High Alert'}
              </div>
            </div>

            <div className="p-2.5 rounded-[16px] bg-[#E6F9F7] border border-[#00C4B3]/40">
              <span className="text-[10px] text-[#004D40] uppercase tracking-wider block font-bold">
                {lang === 'th' ? 'ปัจจุบัน' : 'Post-Reset'}
              </span>
              <div className="text-[#004D40] font-mono font-black text-base mt-0.5">
                {postHeartRate} <span className="text-[10px]">bpm</span>
              </div>
              <div className="text-[10px] text-[#004D40] truncate mt-0.5 font-bold">
                {selectedShift === 'empowered'
                  ? (lang === 'th' ? 'มั่นใจสูงสุด' : 'Peak Ready')
                  : (lang === 'th' ? 'นิ่ง & มีสติ' : 'Restored Calm')}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Clean Exit & Action in Natural Thumb Zone */}
      <div className="pt-2 border-t border-slate-100 space-y-2">
        <Button
          variant="primary"
          colorTheme="turquoise"
          size="lg"
          fullWidth
          isDisabled={!selectedShift}
          onClick={handleFinish}
          label={
            lang === 'th'
              ? 'เสร็จสิ้น 120s — รับเหรียญตรา Mooca'
              : 'Complete 120s — Receive Mooca Badge'
          }
        />

        <div className="flex justify-center">
          <Button
            variant="ghost"
            colorTheme="blue"
            size="sm"
            onClick={onRestart}
            leadingIcon={<RotateCcw className="w-3.5 h-3.5" />}
            label={lang === 'th' ? 'รีเซ็ตอีก 1 รอบกับ Mooca' : 'Restart Reset Cycle'}
          />
        </div>
      </div>

    </div>
  );
};
