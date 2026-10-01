import React from 'react';
import { ShiftFeedback, UserProfile } from '../types';
import { Button } from '../design-system/Button';
import { MoocaMascot } from './MoocaMascot';
import { Activity, X, Sparkles, TrendingDown, Share2, CheckCircle2, Award, Heart } from 'lucide-react';

interface ResetHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  history: ShiftFeedback[];
  lang: 'th' | 'en';
}

export const ResetHistoryModal: React.FC<ResetHistoryModalProps> = ({
  isOpen,
  onClose,
  profile,
  history,
  lang,
}) => {
  if (!isOpen) return null;

  const mockDefaultHistory: ShiftFeedback[] = [
    {
      shiftResult: 'empowered',
      preHeartRate: 106,
      postHeartRate: 82,
      timestamp: '08:15',
    },
    {
      shiftResult: 'grounded',
      preHeartRate: 102,
      postHeartRate: 80,
      timestamp: 'Yesterday',
    },
  ];

  const displayHistory = history.length > 0 ? history : mockDefaultHistory;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-gradient-to-b from-[#FFFDF9] via-white to-[#E6F9F7] border-2 border-[#00C4B3]/35 rounded-[32px] shadow-2xl p-5 flex flex-col text-slate-800 max-h-[88vh] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-[14px] bg-[#E6F9F7] text-[#004D40] border border-[#00C4B3]/30 flex items-center justify-center shadow-xs">
              <Award className="w-5 h-5 text-[#00C4B3]" />
            </div>
            <div className="text-left">
              <h3 className="text-sm font-extrabold text-[#004D40]">
                {lang === 'th' ? 'บันทึกการรีเซ็ตใจกับ Mooca' : 'Reset History & Bio-Delta'}
              </h3>
              <p className="text-[10px] text-slate-500 font-medium">
                {lang === 'th' ? 'บันทึกการฟื้นฟูระบบประสาท' : 'Somatic recovery logs'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable list */}
        <div className="flex-1 overflow-y-auto py-3 space-y-3 text-xs">
          
          {/* Shareable Calming Card */}
          <div className="p-4 rounded-[22px] bg-gradient-to-br from-[#E6F9F7] via-white to-[#FFF8E7] border-2 border-[#00C4B3]/35 shadow-xs text-left relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="font-extrabold text-sm text-[#004D40] tracking-wide flex items-center gap-1.5">
                <span>🐑</span>
                <span>MOOCA SANCTUARY CARD</span>
              </span>
              <span className="text-[10px] font-mono text-[#004D40] bg-white px-2 py-0.5 rounded-full border border-[#00C4B3]/40 font-bold shadow-2xs">
                MBTI: {profile.mbti}
              </span>
            </div>

            <p className="text-xs text-slate-700 mt-1 leading-relaxed font-semibold">
              {lang === 'th'
                ? `“${profile.name} ได้ฟื้นฟูสภาวะประสาท และพร้อมก้าวสู่ภารกิจตรงหน้าด้วยใจที่มั่นคง โดยมีเพื่อน Mooca เคียงข้างเสมอ”`
                : `“${profile.name} has re-centered their nervous equilibrium and stands ready for their arena with Mooca by their side.”`}
            </p>

            <div className="flex items-center justify-between pt-2.5 mt-2.5 border-t border-[#00C4B3]/20 text-[11px] text-slate-500">
              <span className="flex items-center gap-1 text-[#7CC954] font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" /> 120s Verified
              </span>
              <span className="text-[#004D40] font-bold">mindfull / Ooca</span>
            </div>
          </div>

          {/* Past Sessions List */}
          <div className="space-y-2 pt-1">
            <span className="text-[11px] font-extrabold text-[#004D40] uppercase tracking-wider block text-left">
              {lang === 'th' ? 'เซสชันที่ผ่านมา' : 'Previous Sessions'}
            </span>

            {displayHistory.map((item, idx) => {
              const delta = item.preHeartRate - item.postHeartRate;
              return (
                <div
                  key={idx}
                  className="p-3 rounded-[16px] bg-white border border-slate-200/90 shadow-2xs flex items-center justify-between text-left"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">
                      {item.shiftResult === 'empowered' ? '⚡' : item.shiftResult === 'grounded' ? '🌿' : '⚖️'}
                    </span>
                    <div>
                      <div className="font-bold text-slate-800 capitalize">
                        {item.shiftResult === 'empowered'
                          ? (lang === 'th' ? 'มั่นใจ / พร้อมลุย' : 'Empowered')
                          : item.shiftResult === 'grounded'
                          ? (lang === 'th' ? 'นิ่ง มีสติ' : 'Grounded')
                          : (lang === 'th' ? 'คืนสมดุล' : 'Stabilized')}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {item.timestamp} • {item.preHeartRate} bpm → {item.postHeartRate} bpm
                      </div>
                    </div>
                  </div>

                  <span className="text-[#004D40] font-mono font-black text-xs bg-[#E6F9F7] px-2 py-1 rounded-full border border-[#00C4B3]/30">
                    -{delta} bpm
                  </span>
                </div>
              );
            })}
          </div>

        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <Button
            variant="secondary"
            colorTheme="blue"
            size="sm"
            onClick={onClose}
            label={lang === 'th' ? 'ปิดหน้าต่าง' : 'Close'}
          />

          <Button
            variant="primary"
            colorTheme="turquoise"
            size="sm"
            leadingIcon={<Share2 className="w-3.5 h-3.5" />}
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: 'KINETIC VIBE with Mooca',
                  text: `${profile.name} completed a 120s somatic reset with Mooca!`,
                  url: window.location.href,
                }).catch(() => {});
              } else {
                navigator.clipboard.writeText(`${profile.name} completed a 120s reset with Mooca!`);
                alert(lang === 'th' ? 'คัดลอกข้อความแชร์แล้ว!' : 'Copied share text!');
              }
            }}
            label={lang === 'th' ? 'แชร์การฟื้นฟู' : 'Share Sanctuary'}
          />
        </div>

      </div>
    </div>
  );
};
