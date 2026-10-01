import React, { useState } from 'react';
import { UserProfile, GoalType, MBTIType } from '../types';
import { Button } from '../design-system/Button';
import { MoocaMascot } from './MoocaMascot';
import { 
  Sparkles, 
  Activity, 
  Compass, 
  Smartphone, 
  GraduationCap, 
  Briefcase, 
  Mic, 
  BatteryCharging,
  ShieldCheck,
  Check,
  Heart
} from 'lucide-react';

interface OnboardingModalProps {
  initialProfile: UserProfile;
  onSave: (profile: UserProfile) => void;
  isOpen: boolean;
  onClose?: () => void;
}

const MBTI_OPTIONS: MBTIType[] = [
  'INTJ', 'INTP', 'ENTJ', 'ENTP',
  'INFJ', 'INFP', 'ENFJ', 'ENFP',
  'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
  'ISTP', 'ISFP', 'ESTP', 'ESFP',
];

const GOALS: { id: GoalType; labelTh: string; labelEn: string; icon: React.ReactNode; descTh: string }[] = [
  {
    id: 'exam',
    labelTh: 'สอบ / แข่งขันวิชาการ',
    labelEn: 'Exam & Academic Stakes',
    icon: <GraduationCap className="w-5 h-5 text-[#00C4B3]" />,
    descTh: 'แก้ตื่นเต้นจนตัวสั่น มือเย็น กลัวลืมสิ่งที่อ่านมา',
  },
  {
    id: 'stage',
    labelTh: 'ขึ้นเวที / พรีเซนต์สำคัญ',
    labelEn: 'Stage & Presentation',
    icon: <Mic className="w-5 h-5 text-[#FA8C3D]" />,
    descTh: 'แก้ใจสั่น เสียงสั่น ปากแห้ง แพนิคสายตาคนดู',
  },
  {
    id: 'work',
    labelTh: 'ทำงาน / สมองช็อตตื้อตัน',
    labelEn: 'Deep Work & Freeze State',
    icon: <Briefcase className="w-5 h-5 text-[#1F77DF]" />,
    descTh: 'แก้สภาวะสมองช็อต ตื้อตัน คิดงานไม่ออก',
  },
  {
    id: 'burnout',
    labelTh: 'เหนื่อยล้าสะสม / รีเซ็ตสติ',
    labelEn: 'Chronic Drain & Burnout',
    icon: <BatteryCharging className="w-5 h-5 text-[#7CC954]" />,
    descTh: 'พักระบบประสาท 2 นาที คืนพลังงานให้สมอง',
  },
];

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  initialProfile,
  onSave,
  isOpen,
  onClose,
}) => {
  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  const [step, setStep] = useState<1 | 2>(1);

  if (!isOpen) return null;

  const handleNext = () => {
    if (step === 1) {
      setStep(2);
    } else {
      onSave(profile);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-[32px] shadow-2xl overflow-hidden flex flex-col text-slate-800 max-h-[92vh]">
        
        {/* Header with Mooca Welcome */}
        <div className="p-4 border-b border-[#00C4B3]/20 bg-[#E6F9F7] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MoocaMascot mood="happy" size="xs" showSunny={false} />
            <div>
              <h2 className="text-sm font-bold text-[#004D40] tracking-tight">
                {profile.language === 'th' ? 'เพื่อนคู่ใจ Mooca ยินดีที่ได้รู้จัก!' : 'Mooca is Happy to Meet You!'}
              </h2>
              <p className="text-[11px] text-[#004D40] font-semibold">
                {profile.language === 'th' ? 'ปรับแต่งการดูแลใจให้เหมาะกับเธอที่สุด' : 'Calibrating your personal reset profile'}
              </p>
            </div>
          </div>
          {onClose && (
            <button onClick={onClose} className="text-xs text-slate-400 hover:text-slate-700 px-2 py-1 font-medium">
              {profile.language === 'th' ? 'ข้าม' : 'Skip'}
            </button>
          )}
        </div>

        {/* Step Indicator */}
        <div className="flex px-5 pt-3 gap-2">
          <div className={`h-1 flex-1 rounded-full ${step >= 1 ? 'bg-[#00C4B3]' : 'bg-slate-200'}`} />
          <div className={`h-1 flex-1 rounded-full ${step >= 2 ? 'bg-[#00C4B3]' : 'bg-slate-200'}`} />
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          {step === 1 ? (
            <>
              {/* Name & Age */}
              <div className="space-y-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    {profile.language === 'th' ? 'ให้ Mooca เรียกเธอว่าอะไรดีจ้ะ?' : 'What should Mooca call you?'}
                  </label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    placeholder="e.g. Alex"
                    className="w-full bg-[#F8FAFC] border border-slate-200 rounded-[12px] px-3.5 py-2.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#00C4B3] focus:bg-white shadow-2xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    {profile.language === 'th' ? 'ช่วงอายุ / สถานะ' : 'Age Bracket'}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['15-18 (มัธยม)', '19-24 (มหาวิทยาลัย)', '25+ (คนทำงาน)'].map((age) => (
                      <button
                        key={age}
                        type="button"
                        onClick={() => setProfile({ ...profile, ageBracket: age })}
                        className={`p-2 rounded-[12px] border text-center transition-all ${
                          profile.ageBracket === age
                            ? 'bg-[#DBF0EE] border-[#00C4B3] text-[#004D40] font-bold shadow-2xs'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {age}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Goal Selection */}
              <div>
                <label className="block text-slate-700 font-bold mb-1.5">
                  {profile.language === 'th' ? 'เป้าหมายหลักที่อยากให้ Mooca ช่วยดูแล' : 'Primary Challenge for Mooca'}
                </label>
                <div className="space-y-2">
                  {GOALS.map((g) => {
                    const isSelected = profile.goal === g.id;
                    return (
                      <div
                        key={g.id}
                        onClick={() => setProfile({ ...profile, goal: g.id })}
                        className={`p-3 rounded-[16px] border-2 cursor-pointer transition-all flex items-start gap-3 shadow-2xs ${
                          isSelected
                            ? 'bg-[#DBF0EE]/50 border-[#00C4B3]'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="p-2 rounded-[10px] bg-slate-50 shrink-0">
                          {g.icon}
                        </div>
                        <div className="flex-1">
                          <div className="font-bold text-slate-800 flex items-center justify-between">
                            <span>{profile.language === 'th' ? g.labelTh : g.labelEn}</span>
                            {isSelected && <Check className="w-4 h-4 text-[#009688]" />}
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5 font-medium">{g.descTh}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Step 2: MBTI Cognitive Profile & Hardware Sensors */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-slate-700 font-bold flex items-center gap-1.5">
                    <Compass className="w-4 h-4 text-[#00C4B3]" />
                    {profile.language === 'th' ? 'ประเภทบุคลิกภาพ (MBTI)' : 'MBTI Cognitive Profile'}
                  </label>
                  <span className="text-[10px] text-slate-500 font-medium">
                    {profile.language === 'th' ? 'ปรับระดับคำปลอบของ Mooca' : 'Calibrates Mooca Voice'}
                  </span>
                </div>
                
                <div className="grid grid-cols-4 gap-1.5">
                  {MBTI_OPTIONS.map((type) => {
                    const isSelected = profile.mbti === type;
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setProfile({ ...profile, mbti: type })}
                        className={`py-2 rounded-[10px] font-mono text-center font-bold text-xs transition-all border ${
                          isSelected
                            ? 'bg-[#00C4B3] text-white border-[#00C4B3] shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {type}
                      </button>
                    );
                  })}
                </div>
                <p className="text-[10px] text-[#009688] mt-2 bg-[#DBF0EE]/60 p-2.5 rounded-[12px] border border-[#00C4B3]/30 font-medium">
                  {profile.mbti.startsWith('IN') || profile.mbti.startsWith('EN') 
                    ? '💡 Mooca จะปรับใช้คำพูดปลอบใจเชิงหลักการทางชีววิทยาและคุณค่าในตัวเธอ'
                    : '💡 Mooca จะปรับใช้คำพูดปลอบใจเชิงการลงมือทำจริงและความผ่อนคลาย'}
                </p>
              </div>

              {/* Hardware Sensors & Permissions */}
              <div className="pt-2 border-t border-slate-100 space-y-2.5">
                <div className="flex items-center gap-1.5 text-slate-700 font-bold">
                  <ShieldCheck className="w-4 h-4 text-[#8AD866]" />
                  <span>
                    {profile.language === 'th' ? 'การอนุญาตเซนเซอร์ & Bio-Data' : 'Hardware & Health Sensors'}
                  </span>
                </div>

                <div className="space-y-2">
                  {/* Motion & Gyroscope */}
                  <div className="flex items-center justify-between p-3 rounded-[12px] bg-white border border-slate-200 shadow-2xs">
                    <div className="flex items-center gap-2.5">
                      <Smartphone className="w-4 h-4 text-[#00C4B3]" />
                      <div>
                        <div className="font-bold text-slate-800">Motion & Gyroscope</div>
                        <div className="text-[10px] text-slate-500">
                          {profile.language === 'th' ? 'สำหรับดื่มน้ำชัยชนะและสะบัดข้อมือ' : 'Liquid tilt physics & shake gestures'}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setProfile({
                        ...profile,
                        permissions: { ...profile.permissions, motion: !profile.permissions.motion }
                      })}
                      className={`w-11 h-6 rounded-full transition-colors relative ${
                        profile.permissions.motion ? 'bg-[#00C4B3]' : 'bg-slate-300'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-white transition-transform shadow-xs ${
                        profile.permissions.motion ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>

                  {/* Tactile Haptics */}
                  <div className="flex items-center justify-between p-3 rounded-[12px] bg-white border border-slate-200 shadow-2xs">
                    <div className="flex items-center gap-2.5">
                      <Sparkles className="w-4 h-4 text-[#F9A000]" />
                      <div>
                        <div className="font-bold text-slate-800">Dynamic Haptic Feedback</div>
                        <div className="text-[10px] text-slate-500">
                          {profile.language === 'th' ? 'แรงสั่นตอบสนองตามแรงถูรับพลังใจ' : 'Taptic engine friction & drop response'}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setProfile({
                        ...profile,
                        permissions: { ...profile.permissions, haptics: !profile.permissions.haptics }
                      })}
                      className={`w-11 h-6 rounded-full transition-colors relative ${
                        profile.permissions.haptics ? 'bg-[#00C4B3]' : 'bg-slate-300'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-white transition-transform shadow-xs ${
                        profile.permissions.haptics ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>

                  {/* Real-time Heart Rate */}
                  <div className="flex items-center justify-between p-3 rounded-[12px] bg-white border border-slate-200 shadow-2xs">
                    <div className="flex items-center gap-2.5">
                      <Activity className="w-4 h-4 text-[#EF7773]" />
                      <div>
                        <div className="font-bold text-slate-800">Apple Health / Live Pulse</div>
                        <div className="text-[10px] text-slate-500">
                          {profile.language === 'th' ? 'วัดการลดลงของชีพจรก่อนและหลัง 120s' : 'Pre/Post Heart rate delta measurement'}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setProfile({
                        ...profile,
                        permissions: { ...profile.permissions, heartRate: !profile.permissions.heartRate }
                      })}
                      className={`w-11 h-6 rounded-full transition-colors relative ${
                        profile.permissions.heartRate ? 'bg-[#00C4B3]' : 'bg-slate-300'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-white transition-transform shadow-xs ${
                        profile.permissions.heartRate ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 bg-[#F8FAFC] flex items-center justify-between">
          {step === 2 && (
            <Button
              variant="text"
              colorTheme="turquoise"
              size="sm"
              onClick={() => setStep(1)}
              label={profile.language === 'th' ? 'ย้อนกลับ' : 'Back'}
            />
          )}
          <div className="ml-auto">
            <Button
              variant="primary"
              colorTheme="turquoise"
              size="md"
              onClick={handleNext}
              label={
                step === 1
                  ? (profile.language === 'th' ? 'ถัดไป: MBTI & เซนเซอร์' : 'Next: Sensors & MBTI')
                  : (profile.language === 'th' ? 'บันทึกและเริ่มรีเซ็ตกับ Mooca' : 'Activate with Mooca')
              }
            />
          </div>
        </div>

      </div>
    </div>
  );
};
