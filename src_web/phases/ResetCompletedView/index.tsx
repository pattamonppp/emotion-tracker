import React from 'react';
import { ShiftFeedback, UserProfile } from '../../types';
import { Button } from '../../components/Button';
import { MoocaMascot } from '../../components/MoocaMascot';
import {
  Sparkles,
  RotateCcw,
  Layers,
  CheckCircle,
  Sliders,
  Share2,
} from 'lucide-react';
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

  return (
    <div className={styles.container}>
      {/* Top Badge */}
      <div className={styles.topBadge}>
        <CheckCircle />
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
                <Sparkles />
                {lang === 'th' ? 'ผลลัพธ์การลดความตึงเครียด' : 'Bio-Shift Result'}
              </span>
              <span className={styles.deltaBpmPill}>
                -{bpmDrop} bpm
              </span>
            </div>

            <div className={styles.deltaStateRow}>
              <span className={styles.stateLabel}>{lang === 'th' ? 'สภาวะจิตใจ:' : 'State:'}</span>
              <span className={styles.stateValue}>
                {feedback.shiftResult === 'empowered'
                  ? (lang === 'th' ? '⚡ มั่นใจ / พร้อมลุย' : '⚡ Empowered')
                  : feedback.shiftResult === 'grounded'
                    ? (lang === 'th' ? '🌿 นิ่ง มีสติ' : '🌿 Grounded')
                    : (lang === 'th' ? '⚖️ คืนสมดุล' : '⚖️ Stabilized')}
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
            <span className={styles.medalIcon}>🎖️</span>
            <div>
              <div className={styles.badgeTitle}>
                {lang === 'th' ? 'เหรียญตรา Mooca Best Friend' : 'Mooca Best Friend Badge'}
              </div>
              <div className={styles.badgeSubtitle}>
                {lang === 'th' ? 'เพื่อนแท้ที่จะอยู่เคียงข้างเธอตลอดไป' : 'Always by your side'}
              </div>
            </div>
          </div>
          <span className={styles.badgeChevron}>แตะดู ❯</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className={styles.actionFooter}>
        <Button
          variant="primary"
          colorTheme="turquoise"
          size="lg"
          fullWidth
          onClick={onRestart}
          leadingIcon={<RotateCcw className="w-4 h-4" />}
          label={lang === 'th' ? 'เริ่มเซสชันใหม่กับ Mooca' : 'Start Another Session with Mooca'}
        />

        <div className={styles.secondaryBtnGrid}>
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

export default ResetCompletedView;
export * from './modals/ResetHistoryModal';
