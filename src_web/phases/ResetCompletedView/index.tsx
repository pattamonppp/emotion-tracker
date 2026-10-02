import React, { useState } from 'react';
import { ShiftFeedback, UserProfile } from '../../types';
import { Button } from '../../components/Button';
import { MoocaMascot } from '../../components/MoocaMascot';
import { getTranslation } from '../../locales';
import { AiFeedbackModal } from './modals/AiFeedbackModal';
import {
  SparklesIcon,
  RotateCcwIcon,
  CheckCircleIcon,
  ShareIcon,
  MessageHeartIcon,
  HistoryIcon,
  MedalIcon,
  ZapIcon,
  LeafIcon,
  ScaleIcon,
  ChevronRightIcon,
} from '../../icons';
import styles from './styles.module.scss';

export interface ResetCompletedViewProps {
  profile: UserProfile;
  feedback: ShiftFeedback | null;
  onRestart: () => void;
  onOpenProfile: () => void;
  onOpenHistory?: () => void;
  onOpenStory?: () => void;
}

export const ResetCompletedView: React.FC<ResetCompletedViewProps> = ({
  profile,
  feedback,
  onRestart,
  onOpenProfile,
  onOpenHistory,
  onOpenStory,
}) => {
  const lang = profile.language;
  const strings = getTranslation(lang).phases.completed;
  const bpmDrop = feedback ? feedback.preHeartRate - feedback.postHeartRate : 22;
  const [isAiFeedbackOpen, setIsAiFeedbackOpen] = useState(false);

  const handleShareKeepsake = () => {
    const shareText = strings.shareTextTemplate.replace('{name}', profile.name).replace('{bpm}', String(bpmDrop));
    if (navigator.share) {
      navigator.share({
        title: strings.shareTitle,
        text: shareText,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareText);
      alert(strings.copiedAlert);
    }
  };

  const renderStateValue = () => {
    if (!feedback) return null;
    switch (feedback.shiftResult) {
      case 'empowered':
        return (
          <span className={styles.stateValueEmpowered}>
            <ZapIcon />
            <span>{strings.stateEmpowered}</span>
          </span>
        );
      case 'grounded':
        return (
          <span className={styles.stateValueGrounded}>
            <LeafIcon />
            <span>{strings.stateGrounded}</span>
          </span>
        );
      default:
        return (
          <span className={styles.stateValueSame}>
            <ScaleIcon />
            <span>{strings.stateStabilized}</span>
          </span>
        );
    }
  };

  return (
    <div className={styles.container}>
      {/* Top Badge */}
      <div className={styles.topBadge}>
        <CheckCircleIcon />
        <span>
          {strings.badge}
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
              strings.mascotBubble.replace('{name}', profile.name)
            }
          />
        </div>

        <div>
          <h2 className={styles.heroHeading}>
            {strings.readyTitle.replace('{name}', profile.name)}
          </h2>
          <p className={styles.heroSubtitle}>
            {strings.readySubtitle}
          </p>
        </div>

        {/* Delta Summary Card */}
        {feedback && (
          <div className={styles.deltaCard}>
            <div className={styles.deltaHeader}>
              <span className={styles.deltaTitle}>
                <SparklesIcon />
                {strings.bioShiftTitle}
              </span>
              <span className={styles.deltaBpmPill}>
                -{bpmDrop} bpm
              </span>
            </div>

            <div className={styles.deltaStateRow}>
              <span className={styles.stateLabel}>{strings.stateLabel}</span>
              <span className={styles.stateValue}>
                {renderStateValue()}
              </span>
            </div>

            <div className={styles.timestampRow}>
              <span>{strings.timestampLabel}</span>
              <span className={styles.timestampValue}>{feedback.timestamp}</span>
            </div>
          </div>
        )}

        {/* Friendship Badge Card */}
        <div onClick={onOpenStory} className={styles.badgeCard}>
          <div className={styles.badgeLeft}>
            <span className={styles.medalIcon}>
              <MedalIcon />
            </span>
            <div>
              <div className={styles.badgeTitle}>
                {strings.medalTitle}
              </div>
              <div className={styles.badgeSubtitle}>
                {strings.medalSubtitle}
              </div>
            </div>
          </div>
          <span className={styles.badgeChevron}>
            <span>{strings.viewDetails}</span>
            <ChevronRightIcon />
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
          leadingIcon={<MessageHeartIcon />}
          label={strings.feedbackButton}
        />

        {/* 2. ปุ่มแชร์ */}
        <Button
          variant="secondary"
          colorTheme="blue"
          size="md"
          fullWidth
          onClick={handleShareKeepsake}
          leadingIcon={<ShareIcon />}
          label={strings.shareButton}
        />

        {/* 3. ปุ่มเริ่มรีเซ็ตครั้งใหม่ */}
        <Button
          variant="primary"
          colorTheme="turquoise"
          size="lg"
          fullWidth
          onClick={onRestart}
          leadingIcon={<RotateCcwIcon />}
          label={strings.restartButton}
        />

        {/* 4. Secondary actions */}
        <div className={styles.secondaryBtnGrid}>
          {onOpenHistory && (
            <Button
              variant="outline"
              colorTheme="turquoise"
              size="sm"
              onClick={onOpenHistory}
              leadingIcon={<HistoryIcon />}
              label={strings.historyBtn}
            />
          )}

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
