import React from 'react';
import { ShiftFeedback, UserProfile } from '../types';
import { Button } from '../design-system/Button';
import { MoocaMascot } from './MoocaMascot';
import { 
  Sparkles, 
  RotateCcw, 
  Layers, 
  CheckCircle, 
  Heart, 
  Sliders, 
  Share2,
  Award,
  Sun
} from 'lucide-react';

interface ResetCompletedViewProps {
  profile: UserProfile;
  feedback: ShiftFeedback | null;
  onRestart: () => void;
  onOpenDesignSystem: () => void;
  onOpenProfile: () => void;
  onOpenHistory?: () => void;
  onOpenStory?: () => void;
}

export const ResetCompletedView: React.FC<ResetCompletedViewProps> = ({
  profile,
  feedback,
  onRestart,
  onOpenDesignSystem,
  onOpenProfile,
  onOpenHistory,
  onOpenStory,
}) => {
  const lang = profile.language;
  const bpmDrop = feedback ? feedback.preHeartRate - feedback.postHeartRate : 22;

  return (
    <div className="flex flex-col h-full justify-between items-center text-center p-4 select-none animate-in zoom-in-95 duration-300">
      
      {/* Top Badge */}
      <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#7CC954]/20 border border-[#7CC954]/40 text-[#004D40] text-xs font-extrabold shadow-2xs">
        <CheckCircle className="w-3.5 h-3.5 text-[#7CC954]" />
        <span>{lang === 'th' ? 'รีเซ็ตใจ 120 วินาที กับ Mooca สำเร็จ' : '120s Reset Completed with Mooca'}</span>
      </div>

      {/* Hero Affirmation with Celebrating Mooca Mascot */}
      <div className="my-auto space-y-3 max-w-xs">
        <div className="flex justify-center">
          <MoocaMascot
            mood="celebrating"
            size="md"
            showSunny={true}
            speakingBubble={
              lang === 'th'
                ? `เก่งมากเลยนะ ${profile.name}! Mooca ภูมิใจในตัวเธอเสมอ!`
                : `You did wonderful, ${profile.name}! Mooca is so proud of you!`
            }
          />
        </div>

        <div>
          <h2 className="text-xl font-black text-[#004D40] tracking-tight">
            {lang === 'th' ? `เธอพร้อมแล้วนะ ${profile.name}!` : `You are Ready, ${profile.name}!`}
          </h2>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed font-medium">
            {lang === 'th'
              ? 'ระบบประสาทของเธอคืนสู่สมดุลแล้ว ไม่ว่าจะเจอเรื่องอะไร Mooca จะคอยเป็นกำลังใจอยู่ข้างๆ เสมอนะ!'
              : 'Your equilibrium is fully restored. Step forward boldly, Mooca is right beside you.'}
          </p>
        </div>

        {/* Delta Summary Card */}
        {feedback && (
          <div className="p-3.5 rounded-[22px] bg-white border border-[#00C4B3]/35 shadow-xs text-left space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-700">
              <span className="font-extrabold text-[#004D40] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#00C4B3]" />
                {lang === 'th' ? 'ผลลัพธ์การลดความตึงเครียด' : 'Bio-Shift Result'}
              </span>
              <span className="text-[#004D40] font-mono font-black bg-[#E6F9F7] px-2 py-0.5 rounded-full border border-[#00C4B3]/30">
                -{bpmDrop} bpm
              </span>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1.5 border-t border-slate-100">
              <span className="font-medium">{lang === 'th' ? 'สภาวะจิตใจ:' : 'State:'}</span>
              <span className="text-[#004D40] font-extrabold capitalize">
                {feedback.shiftResult === 'empowered'
                  ? (lang === 'th' ? '⚡ มั่นใจ / พร้อมลุย' : '⚡ Empowered')
                  : feedback.shiftResult === 'grounded'
                  ? (lang === 'th' ? '🌿 นิ่ง มีสติ' : '🌿 Grounded')
                  : (lang === 'th' ? '⚖️ คืนสมดุล' : '⚖️ Stabilized')}
              </span>
            </div>
            
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>{lang === 'th' ? 'บันทึกเวลา:' : 'Timestamp:'}</span>
              <span className="font-mono text-slate-600 font-bold">{feedback.timestamp}</span>
            </div>
          </div>
        )}

        {/* Friendship Badge Card */}
        <div 
          onClick={onOpenStory}
          className="p-2.5 rounded-[18px] bg-gradient-to-r from-[#FFF8E7] via-white to-[#E6F9F7] border border-[#FA8C3D]/30 flex items-center justify-between cursor-pointer hover:shadow-xs transition-all active:scale-98"
        >
          <div className="flex items-center gap-2 text-left">
            <span className="text-xl">🎖️</span>
            <div>
              <div className="text-[11px] font-extrabold text-[#004D40]">
                {lang === 'th' ? 'เหรียญตรา Mooca Best Friend' : 'Mooca Best Friend Badge'}
              </div>
              <div className="text-[9px] text-[#FA8C3D] font-bold">
                {lang === 'th' ? 'เพื่อนแท้ที่จะอยู่เคียงข้างเธอตลอดไป' : 'Always by your side'}
              </div>
            </div>
          </div>
          <span className="text-xs text-[#00C4B3] font-bold">แตะดู ❯</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="w-full max-w-xs space-y-2">
        <Button
          variant="primary"
          colorTheme="turquoise"
          size="lg"
          fullWidth
          onClick={onRestart}
          leadingIcon={<RotateCcw className="w-4 h-4" />}
          label={lang === 'th' ? 'เริ่มเซสชันใหม่กับ Mooca' : 'Start Another Session with Mooca'}
        />

        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="secondary"
            colorTheme="blue"
            size="sm"
            onClick={onOpenDesignSystem}
            leadingIcon={<Layers className="w-3.5 h-3.5" />}
            label={lang === 'th' ? 'Design Tokens' : 'Tokens & UI'}
          />

          {onOpenHistory ? (
            <Button
              variant="secondary"
              colorTheme="turquoise"
              size="sm"
              onClick={onOpenHistory}
              leadingIcon={<Share2 className="w-3.5 h-3.5" />}
              label={lang === 'th' ? 'ประวัติรีเซ็ต' : 'Reset History'}
            />
          ) : (
            <Button
              variant="secondary"
              colorTheme="turquoise"
              size="sm"
              onClick={onOpenProfile}
              leadingIcon={<Sliders className="w-3.5 h-3.5" />}
              label={lang === 'th' ? 'โปรไฟล์' : 'Profile'}
            />
          )}
        </div>
      </div>

    </div>
  );
};
