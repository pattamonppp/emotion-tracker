import React, { useState } from 'react';
import { ShiftFeedback, UserProfile } from '../../types';
import { Button } from '../../components/Button';
import { MoocaMascot } from '../../components/MoocaMascot';
import { AiFeedbackModal } from './modals/AiFeedbackModal';
import {
  SparklesIcon,
  RotateCcwIcon,
  LayersIcon,
  CheckCircleIcon,
  ShareIcon,
  MessageHeartIcon,
  HistoryIcon,
  MedalIcon,
  ZapIcon,
  LeafIcon,
  ScaleIcon,
  ArrowRightIcon,
} from '../../icons';
import styles from './styles.module.scss';

export interface ResetCompletedViewProps {
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
  const [isAiFeedbackOpen, setIsAiFeedbackOpen] = useState(false);

  const handleShareKeepsake = () => {
    const shareText = `${profile.name} ลดความตึงเครียดได้ ${bpmDrop} BPM ด้วย 120s Reset กับ Mooca!`;
    if (navigator.share) {
      navigator.share({
        title: 'Mooca 120s Somatic Reset',
        text: shareText,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareText);
      alert(lang === 'th' ? 'คัดลอกข้อความสำหรับแชร์แล้ว!' : 'Copied share text to clipboard!');
    }
  };

  const renderStateValue = () => {
    if (!feedback) return null;
    switch (feedback.shiftResult) {
      case 'empowered':
        return (
          <span className="inline-flex items-center gap-1 text-amber-600 font-semibold">
            <ZapIcon className="w-3.5 h-3.5" />
            <span>{lang === 'th' ? 'มั่นใจ / พร้อมลุย' : 'Empowered'}</span>
          </span>
        );
      case 'grounded':
        return (
          <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
            <LeafIcon className="w-3.5 h-3.5" />
            <span>{lang === 'th' ? 'นิ่ง มีสติ' : 'Grounded'}</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-teal-600 font-semibold">
            <ScaleIcon className="w-3.5 h-3.5" />
            <span>{lang === 'th' ? 'คืนสมดุล' : 'Stabilized'}</span>
          </span>
        );
    }
  };

  return (
    <div className={styles.container}>
      {/* Top Badge */}
      <div className={styles.topBadge}>
        <CheckCircleIcon className="w-4 h-4 text-teal-600" />
        <span>
          {lang === 'th' ? 'รีเซ็ตใจ 120 วินาที กับ Mooca สำเร็จ' : '120s Reset Completed with Mooca'}
        </span>
      </div>

      {/* Hero Affirmation with Celebrating Mooca Mascot */}
      <div className={styles.heroSection}>
        <div className={styles.mascotWrapper}>
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
          <h2 className={styles.heroHeading}>
            {lang === 'th' ? `เธอพร้อมแล้วนะ ${profile.name}!` : `You are Ready, ${profile.name}!`}
          </h2>
          <p className={styles.heroSubtitle}>
            {lang === 'th'
              ? 'ระบบประสาทของเธอคืนสู่สมดุลแล้ว ไม่ว่าจะเจอเรื่องอะไร Mooca จะคอยเป็นกำลังใจอยู่ข้าง ๆ เสมอนะ!'
              : 'Your equilibrium is fully restored. Step forward boldly, Mooca is right beside you.'}
          </p>
        </div>

        {/* Delta Summary Card */}
        {feedback && (
          <div className={styles.deltaCard}>
            <div className={styles.deltaHeader}>
              <span className={styles.deltaTitle}>
                <SparklesIcon className="w-4 h-4 text-teal-500" />
                {lang === 'th' ? 'ผลลัพธ์การลดความตึงเครียด' : 'Bio-Shift Result'}
              </span>
              <span className={styles.deltaBpmPill}>
                -{bpmDrop} bpm
              </span>
            </div>

            <div className={styles.deltaStateRow}>
              <span className={styles.stateLabel}>{lang === 'th' ? 'สภาวะจิตใจ:' : 'State:'}</span>
              <span className={styles.stateValue}>
                {renderStateValue()}
              </span>
            </div>

            <div className={styles.timestampRow}>
              <span>{lang === 'th' ? 'บันทึกเวลา:' : 'Timestamp:'}</span>
              <span className={styles.timestampValue}>{feedback.timestamp}</span>
            </div>
          </div>
        )}

        {/* Friendship Badge Card */}
        <div onClick={onOpenStory} className={styles.badgeCard}>
          <div className={styles.badgeLeft}>
            <span className={styles.medalIcon}>
              <MedalIcon className="w-5 h-5 text-amber-500" />
            </span>
            <div>
              <div className={styles.badgeTitle}>
                {lang === 'th' ? 'เหรียญตรา Mooca Best Friend' : 'Mooca Best Friend Badge'}
              </div>
              <div className={styles.badgeSubtitle}>
                {lang === 'th' ? 'เพื่อนแท้ที่จะอยู่เคียงข้างเธอตลอดไป' : 'Always by your side'}
              </div>
            </div>
          </div>
          <span className={styles.badgeChevron}>
            <span>{lang === 'th' ? 'แตะดู' : 'View'}</span>
            <ArrowRightIcon className="w-3.5 h-3.5 inline ml-1" />
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className={styles.actionFooter}>
        {/* 1. ปุ่ม Feedback เป็นปุ่มแรกเหนือแชร์ */}
        <Button
          variant="secondary"
          colorTheme="turquoise"
          size="md"
          fullWidth
          onClick={() => setIsAiFeedbackOpen(true)}
          leadingIcon={<MessageHeartIcon className="w-4 h-4" />}
          label={lang === 'th' ? 'บอกความรู้สึกถึง Mooca' : 'Feedback to Mooca'}
        />

        {/* 2. ปุ่มแชร์ */}
        <Button
          variant="secondary"
          colorTheme="blue"
          size="md"
          fullWidth
          onClick={handleShareKeepsake}
          leadingIcon={<ShareIcon className="w-4 h-4" />}
          label={lang === 'th' ? 'แชร์การ์ดความกล้าหาญ' : 'Share Polaroid Keepsake'}
        />

        {/* 3. ปุ่มเริ่มรีเซ็ตครั้งใหม่ */}
        <Button
          variant="primary"
          colorTheme="turquoise"
          size="lg"
          fullWidth
          onClick={onRestart}
          leadingIcon={<RotateCcwIcon className="w-4 h-4" />}
          label={lang === 'th' ? 'เริ่มรีเซ็ตครั้งใหม่' : 'Start New Session'}
        />

        {/* 4. Secondary actions */}
        <div className={styles.secondaryBtnGrid}>
          {onOpenHistory && (
            <Button
              variant="outline"
              colorTheme="turquoise"
              size="sm"
              onClick={onOpenHistory}
              leadingIcon={<HistoryIcon className="w-3.5 h-3.5" />}
              label={lang === 'th' ? 'ประวัติรีเซ็ต' : 'Reset History'}
            />
          )}

          <Button
            variant="outline"
            colorTheme="blue"
            size="sm"
            onClick={onOpenDesignSystem}
            leadingIcon={<LayersIcon className="w-3.5 h-3.5" />}
            label={lang === 'th' ? 'Design Tokens' : 'Tokens & UI'}
          />
        </div>
      </div>

      {/* Feedback Modal */}
      <AiFeedbackModal
        isOpen={isAiFeedbackOpen}
        onClose={() => setIsAiFeedbackOpen(false)}
        profile={profile}
        feedback={feedback}
        lang={lang}
      />
    </div>
  );
};

export default ResetCompletedView;
export * from './modals/ResetHistoryModal';
export * from './modals/AiFeedbackModal';
