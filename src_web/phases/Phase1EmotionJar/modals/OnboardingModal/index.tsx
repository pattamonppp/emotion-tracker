import React, { useState } from 'react';
import { UserProfile, GoalType, MBTIType } from '../../../../types';
import { Button } from '../../../../components/Button';
import { MoocaMascot } from '../../../../components/MoocaMascot';
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
} from 'lucide-react';
import styles from './styles.module.scss';

export interface OnboardingModalProps {
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
    <div className={styles.backdrop}>
      <div className={styles.modalCard}>
        {/* Header with Mooca Welcome */}
        <div className={styles.header}>
          <div className={styles.headerInfo}>
            <MoocaMascot mood="happy" size="xs" showSunny={false} />
            <div>
              <h2 className={styles.headerTitle}>
                {profile.language === 'th' ? 'เพื่อนคู่ใจ Mooca ยินดีที่ได้รู้จัก!' : 'Mooca is Happy to Meet You!'}
              </h2>
              <p className={styles.headerSubtitle}>
                {profile.language === 'th' ? 'ปรับแต่งการดูแลใจให้เหมาะกับเธอที่สุด' : 'Calibrating your personal reset profile'}
              </p>
            </div>
          </div>
          {onClose && (
            <button onClick={onClose} className={styles.skipBtn} type="button">
              {profile.language === 'th' ? 'ข้าม' : 'Skip'}
            </button>
          )}
        </div>

        {/* Step Indicator */}
        <div className={styles.stepIndicator}>
          <div className={`${styles.stepBar} ${step >= 1 ? styles.active : ''}`} />
          <div className={`${styles.stepBar} ${step >= 2 ? styles.active : ''}`} />
        </div>

        {/* Form Body */}
        <div className={styles.formBody}>
          {step === 1 ? (
            <>
              {/* Name & Age */}
              <div className={styles.fieldGroup}>
                <div>
                  <label className={styles.fieldLabel}>
                    {profile.language === 'th' ? 'ให้ Mooca เรียกเธอว่าอะไรดีจ้ะ?' : 'What should Mooca call you?'}
                  </label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    placeholder="e.g. Alex"
                    className={styles.textInput}
                  />
                </div>

                <div>
                  <label className={styles.fieldLabel}>
                    {profile.language === 'th' ? 'ช่วงอายุ / สถานะ' : 'Age Bracket'}
                  </label>
                  <div className={styles.ageGrid}>
                    {['15-18 (มัธยม)', '19-24 (มหาวิทยาลัย)', '25+ (คนทำงาน)'].map((age) => (
                      <button
                        key={age}
                        type="button"
                        onClick={() => setProfile({ ...profile, ageBracket: age })}
                        className={`${styles.ageBtn} ${profile.ageBracket === age ? styles.selected : ''}`}
                      >
                        {age}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Goal Selection */}
              <div>
                <label className={styles.fieldLabel}>
                  {profile.language === 'th' ? 'เป้าหมายหลักที่อยากให้ Mooca ช่วยดูแล' : 'Primary Challenge for Mooca'}
                </label>
                <div className={styles.goalsList}>
                  {GOALS.map((g) => {
                    const isSelected = profile.goal === g.id;
                    return (
                      <div
                        key={g.id}
                        onClick={() => setProfile({ ...profile, goal: g.id })}
                        className={`${styles.goalItem} ${isSelected ? styles.selected : ''}`}
                      >
                        <div className={styles.goalIconBox}>
                          {g.icon}
                        </div>
                        <div className={styles.goalContent}>
                          <div className={styles.goalTitleRow}>
                            <span>{profile.language === 'th' ? g.labelTh : g.labelEn}</span>
                            {isSelected && <Check className="w-4 h-4" />}
                          </div>
                          <p className={styles.goalDesc}>{g.descTh}</p>
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
                <div className={styles.mbtiHeader}>
                  <label className={styles.mbtiLabel}>
                    <Compass className="w-4 h-4" />
                    {profile.language === 'th' ? 'ประเภทบุคลิกภาพ' : 'MBTI Cognitive Profile'}
                  </label>
                  <span className={styles.mbtiHint}>
                    {profile.language === 'th' ? 'ปรับระดับคำปลอบของ Mooca' : 'Calibrates Mooca Voice'}
                  </span>
                </div>
                
                <div className={styles.mbtiGrid}>
                  {MBTI_OPTIONS.map((type) => {
                    const isSelected = profile.mbti === type;
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setProfile({ ...profile, mbti: type })}
                        className={`${styles.mbtiBtn} ${isSelected ? styles.selected : ''}`}
                      >
                        {type}
                      </button>
                    );
                  })}
                </div>
                <p className={styles.mbtiExplanation}>
                  {profile.mbti.startsWith('IN') || profile.mbti.startsWith('EN') 
                    ? '💡 Mooca จะปรับใช้คำพูดปลอบใจเชิงหลักการทางชีววิทยาและคุณค่าในตัวเธอ'
                    : '💡 Mooca จะปรับใช้คำพูดปลอบใจเชิงการลงมือทำจริงและความผ่อนคลาย'}
                </p>
              </div>

              {/* Hardware Sensors & Permissions */}
              <div className={styles.sensorSection}>
                <div className={styles.sensorHeader}>
                  <ShieldCheck className="w-4 h-4" />
                  <span>
                    {profile.language === 'th' ? 'การอนุญาตเซนเซอร์ & Bio-Data' : 'Hardware & Health Sensors'}
                  </span>
                </div>

                <div className={styles.sensorList}>
                  {/* Motion & Gyroscope */}
                  <div className={styles.sensorItem}>
                    <div className={styles.sensorLeft}>
                      <Smartphone className="w-4 h-4 text-[#00C4B3]" />
                      <div>
                        <div className={styles.sensorName}>Motion & Gyroscope</div>
                        <div className={styles.sensorDesc}>
                          {profile.language === 'th' ? 'สำหรับดื่มน้ำชัยชนะและสะบัดข้อมือ' : 'Liquid tilt physics & shake gestures'}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      aria-label="Toggle motion permission"
                      onClick={() => setProfile({
                        ...profile,
                        permissions: { ...profile.permissions, motion: !profile.permissions.motion }
                      })}
                      className={`${styles.toggleSwitch} ${profile.permissions.motion ? styles.active : ''}`}
                    >
                      <div className={`${styles.toggleThumb} ${profile.permissions.motion ? styles.active : ''}`} />
                    </button>
                  </div>

                  {/* Tactile Haptics */}
                  <div className={styles.sensorItem}>
                    <div className={styles.sensorLeft}>
                      <Sparkles className="w-4 h-4 text-[#F9A000]" />
                      <div>
                        <div className={styles.sensorName}>Dynamic Haptic Feedback</div>
                        <div className={styles.sensorDesc}>
                          {profile.language === 'th' ? 'แรงสั่นตอบสนองตามแรงถูรับพลังใจ' : 'Taptic engine friction & drop response'}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      aria-label="Toggle haptics permission"
                      onClick={() => setProfile({
                        ...profile,
                        permissions: { ...profile.permissions, haptics: !profile.permissions.haptics }
                      })}
                      className={`${styles.toggleSwitch} ${profile.permissions.haptics ? styles.active : ''}`}
                    >
                      <div className={`${styles.toggleThumb} ${profile.permissions.haptics ? styles.active : ''}`} />
                    </button>
                  </div>

                  {/* Real-time Heart Rate */}
                  <div className={styles.sensorItem}>
                    <div className={styles.sensorLeft}>
                      <Activity className="w-4 h-4 text-[#EF7773]" />
                      <div>
                        <div className={styles.sensorName}>Apple Health / Live Pulse</div>
                        <div className={styles.sensorDesc}>
                          {profile.language === 'th' ? 'วัดการลดลงของชีพจรก่อนและหลัง 120s' : 'Pre/Post Heart rate delta measurement'}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      aria-label="Toggle heart rate permission"
                      onClick={() => setProfile({
                        ...profile,
                        permissions: { ...profile.permissions, heartRate: !profile.permissions.heartRate }
                      })}
                      className={`${styles.toggleSwitch} ${profile.permissions.heartRate ? styles.active : ''}`}
                    >
                      <div className={`${styles.toggleThumb} ${profile.permissions.heartRate ? styles.active : ''}`} />
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer Actions */}
        <div className={styles.footer}>
          {step === 2 && (
            <Button
              variant="ghost"
              colorTheme="turquoise"
              size="sm"
              onClick={() => setStep(1)}
              label={profile.language === 'th' ? 'ย้อนกลับ' : 'Back'}
            />
          )}
          <div className={styles.footerRight}>
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

export default OnboardingModal;
