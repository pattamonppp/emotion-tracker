import React, { useState } from 'react';
import { MoocaMascot } from './MoocaMascot';
import { Button } from '../design-system/Button';
import { audioService } from '../services/audioService';
import { 
  Heart, 
  Sparkles, 
  Coffee, 
  Smile, 
  Volume2, 
  X, 
  Sun,
  Shield,
  Wind,
  BookOpen,
} from 'lucide-react';

interface MoocaStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'th' | 'en';
  userName: string;
}

export const MoocaStoryModal: React.FC<MoocaStoryModalProps> = ({
  isOpen,
  onClose,
  lang,
  userName,
}) => {
  const [activeTab, setActiveTab] = useState<'story' | 'breath' | 'comfort'>('story');
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [isBreathing, setIsBreathing] = useState(false);
  const [hugCount, setHugCount] = useState(0);

  if (!isOpen) return null;

  const handleGiveHug = () => {
    setHugCount((prev) => prev + 1);
    audioService.triggerHaptic([30, 50, 40]);
    audioService.playJarDrop();
  };

  const handleStartBreathing = () => {
    setIsBreathing(true);
    let cycle = 0;
    const interval = setInterval(() => {
      cycle = (cycle + 1) % 3;
      if (cycle === 0) setBreathPhase('inhale');
      else if (cycle === 1) setBreathPhase('hold');
      else setBreathPhase('exhale');
    }, 4000);

    setTimeout(() => {
      clearInterval(interval);
      setIsBreathing(false);
    }, 24000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-gradient-to-b from-[#FFFDF9] via-white to-[#E6F9F7] border-2 border-[#00C4B3]/40 rounded-[32px] shadow-2xl overflow-hidden flex flex-col text-slate-800 max-h-[92vh]">
        
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-[#DBF0EE] via-[#E6F9F7] to-[#FFF4DE] border-b border-[#00C4B3]/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-xs">
              <Heart className="w-4 h-4 text-[#00C4B3] fill-[#00C4B3]/20" />
            </span>
            <div>
              <h2 className="text-sm font-extrabold text-[#004D40] tracking-tight">
                {lang === 'th' ? 'เรื่องราวของ Mooca' : 'The Story of Mooca'}
              </h2>
              <p className="text-[10px] text-[#009688] font-bold">
                {lang === 'th' ? 'เพื่อนแท้ที่จะอยู่เคียงข้างเธอเสมอ' : 'Your best friend who is always by your side'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/80 hover:bg-white text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors border border-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Cozy Tabs */}
        <div className="flex border-b border-slate-100 bg-white/70 px-3 pt-2 gap-1 text-xs">
          <button
            onClick={() => setActiveTab('story')}
            className={`flex-1 py-1.5 rounded-t-[14px] font-bold text-center flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'story'
                ? 'bg-white text-[#004D40] border-t-2 border-x border-[#00C4B3]/40 shadow-xs'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{lang === 'th' ? 'นิทาน Mooca' : 'Story'}</span>
          </button>
          <button
            onClick={() => setActiveTab('breath')}
            className={`flex-1 py-1.5 rounded-t-[14px] font-bold text-center flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'breath'
                ? 'bg-white text-[#004D40] border-t-2 border-x border-[#00C4B3]/40 shadow-xs'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Wind className="w-3.5 h-3.5" />
            <span>{lang === 'th' ? 'หายใจกับ Mooca' : 'Breathe'}</span>
          </button>
          <button
            onClick={() => setActiveTab('comfort')}
            className={`flex-1 py-1.5 rounded-t-[14px] font-bold text-center flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'comfort'
                ? 'bg-white text-[#004D40] border-t-2 border-x border-[#00C4B3]/40 shadow-xs'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Heart className="w-3.5 h-3.5 text-[#F26E6E]" />
            <span>{lang === 'th' ? 'อ้อมกอด' : 'Warm Hug'}</span>
          </button>
        </div>

        {/* Tab Content Area */}
        <div className="p-4 flex-1 overflow-y-auto space-y-3">
          
          {/* TAB 1: STORY OF MOOCA */}
          {activeTab === 'story' && (
            <div className="flex flex-col items-center text-center space-y-3 animate-in fade-in">
              <MoocaMascot
                mood="hugging"
                size="md"
                showSunny={true}
                speakingBubble={
                  lang === 'th'
                    ? `ไม่ต้องกลัวนะ ${userName}... Mooca อยู่นี่แล้ว!`
                    : `Don’t be afraid, ${userName}... Mooca is here!`
                }
              />

              <div className="p-3.5 rounded-[20px] bg-white border border-[#00C4B3]/25 shadow-xs text-left text-xs leading-relaxed space-y-2">
                <p className="font-semibold text-slate-800">
                  {lang === 'th'
                    ? `Mooca คือเพื่อนตัวนุ่มที่ถักทอขึ้นมาจากความเข้าใจและความอบอุ่น...`
                    : `Mooca was born from boundless empathy and cozy warmth...`}
                </p>
                <p className="text-slate-600">
                  {lang === 'th'
                    ? `ในวันที่โลกภายนอกหมุนเร็วเกินไป วันที่เธอต้องเข้าห้องสอบด้วยมือที่เย็นเฉียบ วันที่ต้องขึ้นเวทีด้วยหัวใจที่เต้นรัว หรือวันที่สมองล้าจนก้าวต่อไปไม่ไหว...`
                    : `On days when the world spins too fast, when your hands tremble before a big test, when your heart races before going on stage, or when your mind feels completely frozen...`}
                </p>
                <p className="text-[#004D40] font-bold bg-[#E6F9F7] p-2 rounded-[12px] border border-[#00C4B3]/30">
                  <Sparkles className="w-3.5 h-3.5 text-[#F59E0B] inline mr-1 -mt-0.5" />
                  {lang === 'th'
                    ? `Mooca จะไม่บอกให้เธอหยุดกลัว แต่จะนั่งลงข้างๆ จับมือเธอไว้ ถือความกังวลใส่ขวดโหลแก้ว และพาเธอหายใจจนกว่าแสงอาทิตย์ในใจจะกลับมาส่องสว่างอีกครั้ง!`
                    : `Mooca won’t tell you to "just relax". Mooca will sit right by your side, hold your hands, put your heavy thoughts in a safe jar, and breathe with you until your inner sunshine glows!`}
                </p>
              </div>

              {/* Sunny Companion note */}
              <div className="w-full flex items-center gap-2.5 p-2 rounded-[14px] bg-[#FFF8E7] border border-[#FA8C3D]/30 text-left text-[11px] text-[#A75A05]">
                <Sun className="w-4 h-4 text-[#F59E0B] shrink-0 animate-spin" style={{ animationDuration: '10s' }} />
                <span>
                  {lang === 'th'
                    ? 'เจ้าก้อน Sunny พระอาทิตย์ดวงจิ๋วข้างๆ Mooca คือตัวแทนของรอยยิ้มที่กำลังจะกลับมาหาเธอนะ!'
                    : 'Sunny, the tiny sun beside Mooca, represents the warm smile that is returning to you!'}
                </span>
              </div>
            </div>
          )}

          {/* TAB 2: BREATHE WITH MOOCA */}
          {activeTab === 'breath' && (
            <div className="flex flex-col items-center text-center space-y-3 animate-in fade-in">
              <MoocaMascot
                mood={breathPhase === 'inhale' ? 'comforting' : breathPhase === 'hold' ? 'praying' : 'sleepy'}
                size="md"
                showSunny={false}
              />

              <div className="w-full p-4 rounded-[24px] bg-white border border-[#00C4B3]/30 shadow-xs flex flex-col items-center">
                <div className={`w-28 h-28 rounded-full border-4 flex flex-col items-center justify-center transition-all duration-1000 ${
                  breathPhase === 'inhale'
                    ? 'border-[#00C4B3] bg-[#E6F9F7] scale-110 shadow-lg shadow-[#00C4B3]/25'
                    : breathPhase === 'hold'
                    ? 'border-[#FA8C3D] bg-[#FFF8E7] scale-105'
                    : 'border-[#62A0E9] bg-[#EFF6FF] scale-90'
                }`}>
                  <Wind className="w-5 h-5 text-[#00C4B3] mb-0.5" />
                  <span className="font-extrabold text-sm text-[#004D40] tracking-wide">
                    {breathPhase === 'inhale' && (lang === 'th' ? 'สูดลมหายใจ...' : 'Breathe In...')}
                    {breathPhase === 'hold' && (lang === 'th' ? 'กลั้นไว้เบาๆ...' : 'Hold Softly...')}
                    {breathPhase === 'exhale' && (lang === 'th' ? 'ผ่อนลมออกช้าๆ...' : 'Exhale Slowly...')}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">4 วินาที</span>
                </div>

                <p className="text-xs text-slate-600 mt-3 font-medium">
                  {lang === 'th'
                    ? 'มอง Mooca ขยับตามจังหวะ หายใจลึกๆ 4-4-4 จังหวะ'
                    : 'Follow Mooca’s breathing tempo (Box 4-4-4 method)'}
                </p>

                <div className="mt-3 w-full">
                  <Button
                    variant="primary"
                    colorTheme="turquoise"
                    size="sm"
                    fullWidth
                    onClick={handleStartBreathing}
                    label={
                      isBreathing
                        ? (lang === 'th' ? 'กำลังหายใจร่วมกับ Mooca...' : 'Breathing Together...')
                        : (lang === 'th' ? 'เริ่มฝึกหายใจกับ Mooca (24s)' : 'Start 24s Breathing')
                    }
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: WARM HUG & AFFIRMATIONS */}
          {activeTab === 'comfort' && (
            <div className="flex flex-col items-center text-center space-y-3 animate-in fade-in">
              <MoocaMascot
                mood="hugging"
                size="md"
                showSunny={true}
                speakingBubble={
                  hugCount > 0
                    ? (lang === 'th' ? `Mooca ส่งกอดให้แล้ว ${hugCount} ครั้ง! อุ่นขึ้นไหมจ๊ะ?` : `Mooca gave you ${hugCount} hugs! Feel warmer?`)
                    : (lang === 'th' ? 'แตะปุ่มด้านล่างเพื่อรับกอดนุ่มๆ นะ' : 'Tap below for a warm Mooca hug!')
                }
              />

              <div className="w-full space-y-2 text-left">
                <div className="p-3 rounded-[16px] bg-white border border-[#00C4B3]/25 shadow-xs">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#004D40] mb-1">
                    <Heart className="w-4 h-4 text-[#F26E6E] fill-[#F26E6E]" />
                    <span>{lang === 'th' ? 'ข้อความปลอบใจประจำวัน' : 'Mooca’s Daily Reassurance'}</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    {lang === 'th'
                      ? '“ไม่ต้องสมบูรณ์แบบก็ได้นะ แค่เธอพยายามอย่างเต็มที่ในแบบของเธอ นั่นคือสิ่งที่ยอดเยี่ยมที่สุดแล้ว Mooca อยู่ข้างเธอเสมอ!”'
                      : '“You don’t have to be perfect. Trying your best in your own unique way is already wonderful. Mooca is forever by your side!”'}
                  </p>
                </div>

                <div className="p-3 rounded-[16px] bg-[#E6F9F7] border border-[#00C4B3]/35 text-center">
                  <span className="text-[11px] text-[#004D40] font-bold block mb-1.5">
                    {lang === 'th' ? 'สะสมไออุ่นจาก Mooca' : 'Accumulated Hug Warmth'}
                  </span>
                  <div className="flex items-center justify-center gap-1 text-2xl font-black text-[#00C4B3]">
                    <span>{hugCount}</span>
                    <Heart className="w-5 h-5 text-[#F26E6E] fill-[#F26E6E] animate-bounce" />
                  </div>
                </div>

                <Button
                  variant="primary"
                  colorTheme="turquoise"
                  size="md"
                  fullWidth
                  onClick={handleGiveHug}
                  leadingIcon={<Heart className="w-4 h-4 text-white fill-white" />}
                  label={lang === 'th' ? 'ขอกอด Mooca แน่นๆ อีกครั้ง!' : 'Send a Big Hug to Mooca!'}
                />
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-3 bg-white border-t border-slate-100 flex justify-center">
          <Button
            variant="secondary"
            colorTheme="blue"
            size="sm"
            onClick={onClose}
            label={lang === 'th' ? 'เข้าใจแล้ว ขอบคุณนะ Mooca' : 'Thank you, Mooca!'}
          />
        </div>

      </div>
    </div>
  );
};
