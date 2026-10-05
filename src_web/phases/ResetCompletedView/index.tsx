import React from 'react';
import classNames from 'classnames';
import { UserProfile, ShiftFeedback, SKY, LANG } from '../../types';
import { MARSHMALLOW_SIZE, MARSHMALLOW_VARIANT, MarshmallowButton } from '../../design-system/MarshmallowButton';
import { MoocaMascot } from '../../components/MoocaMascot';
import { useSky } from '../../components/DynamicSkyEngine';
import { audioService } from '../../services/audioService';
import {
  RotateCcw,
  History,
  Share2,
  Award,
  Sparkles,
  PartyPopper,
  Star,
  Heart,
  Leaf,
  MessageSquareHeart,
} from 'lucide-react';
import { getTranslation } from '../../locales';
import { renderBilingual } from '../../components/BilingualText';
import styles from './styles.module.scss';

export interface ResetCompletedViewProps {
  profile: UserProfile;
  feedback: ShiftFeedback | null;
  onRestart: () => void;
  onOpenProfile?: () => void;
  onOpenHistory: () => void;
  onOpenFeedback: () => void;
}

export const ResetCompletedView: React.FC<ResetCompletedViewProps> = ({
  profile,
  feedback,
  onRestart,
  onOpenHistory,
  onOpenFeedback,
}) => {
  const { activePeriod } = useSky();
  const isNight = activePeriod === SKY.NIGHT;

  const lang = profile.language;
  const t = getTranslation(lang);
  const c = t.phases.completed;

  const bpmDrop = feedback
    ? feedback.preHeartRate - feedback.postHeartRate
    : 18;

  const handleShareKeepsake = async () => {
    audioService.triggerHaptic('medium');

    const shareMessage = c.shareKeepsakeTemplate
      .replace('{name}', profile.name)
      .replace('{bpm}', String(bpmDrop));

    if (navigator.share) {
      try {
        await navigator.share({
          title: c.somaticResetComplete,
          text: shareMessage,
          url: window.location.href,
        });
      } catch {
        // User cancelled share.
      }
    } else {
      navigator.clipboard.writeText(shareMessage);
      alert(
        lang === LANG.TH
          ? 'คัดลอกข้อความแชร์แล้ว!'
          : 'Copied keepsake text!',
      );
    }
  };

  const currentDate = new Date().toLocaleDateString(
    lang === LANG.TH ? 'th-TH' : 'en-US',
    {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    },
  );

  return (
    <div className={styles.scrollWrapper}>
      <div className={styles.container}>
        {/* Top Completion Header Badge */}
        <div className={styles.topBadge}>
          <Award size={15} color="#D97706" />
          <span className={styles.topBadgeText}>
            {renderBilingual(c.somaticResetComplete)}
          </span>
        </div>

        <h2
          className={classNames(styles.headline, {
            [styles.headlineNight]: isNight,
          })}
        >
          {renderBilingual(c.congratsTitle.replace('{name}', profile.name))}
        </h2>

        {/* Polaroid Keepsake Card */}
        <div className={styles.polaroidFrame}>
          {/* Photo Viewport with Rainbow Celebration */}
          <div className={styles.photoViewport}>
            <div
              className={classNames(
                styles.sparkleItem,
                styles.sparkleTopLeft,
              )}
            >
              <Sparkles size={16} color="#F9A000" fill="#F8E4B3" />
            </div>

            <div
              className={classNames(
                styles.sparkleItem,
                styles.sparkleTopRight,
              )}
            >
              <PartyPopper size={16} color="#EF7773" />
            </div>

            <div
              className={classNames(
                styles.sparkleItem,
                styles.sparkleBottomLeft,
              )}
            >
              <Star size={15} color="#F9A000" fill="#F8E4B3" />
            </div>

            <div
              className={classNames(
                styles.sparkleItem,
                styles.sparkleBottomRight,
              )}
            >
              <Heart size={16} color="#EF7773" fill="#EF7773" />
            </div>

            {/* Rainbow Arc Badge */}
            <div className={styles.rainbowArcPill}>
              <Sparkles size={11} color="#DF8900" />
              <span className={styles.rainbowText}>
                {c.rainbowCelebration}
              </span>
            </div>

            {/* Mascot in Celebration Mode */}
            <div className={styles.mascotHolder}>
              <MoocaMascot
                mood="celebrating"
                size="md"
                showSunny={true}
                interactive={true}
              />
            </div>

            {/* Golden Badge */}
            <div className={styles.goldMedalContainer}>
              <div className={styles.goldMedal}>
                <Award size={14} color="#DF8900" />
                <span className={styles.goldMedalText}>
                  {c.goldMedalTitle}
                </span>
              </div>

              <div className={styles.ribbonTailLeft} />
              <div className={styles.ribbonTailRight} />
            </div>
          </div>

          {/* Polaroid Wide Bottom Chin */}
          <div className={styles.polaroidChin}>
            <div className={styles.handwrittenCaption}>
              {renderBilingual(c.caption)}
            </div>

            <div className={styles.chinFooterRow}>
              <span className={styles.chinDateText}>
                {renderBilingual(currentDate)}
              </span>

              <div className={styles.chinBpmDrop}>
                <Leaf
                  size={11}
                  color="#00C4B3"
                  style={{ marginRight: 2 }}
                />

                <span className={styles.chinBpmText}>
                  {renderBilingual(`-${bpmDrop} BPM`)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Metrics Mini Summary */}
        <div className={styles.metricsSummary}>
          <div className={styles.metricItem}>
            <span className={styles.metricLabel}>
              {renderBilingual(c.preLabel)}
            </span>

            <span className={styles.metricVal}>
              {renderBilingual(`${feedback?.preHeartRate || 105} BPM`)}
            </span>
          </div>

          <div className={styles.metricDivider} />

          <div className={styles.metricItem}>
            <span className={styles.metricLabel}>
              {renderBilingual(c.nowLabel)}
            </span>

            <span
              className={classNames(
                styles.metricVal,
                styles.metricValTeal,
              )}
            >
              {renderBilingual(`${feedback?.postHeartRate || 87} BPM`)}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className={styles.actionsContainer}>
          {/* Feedback Button */}
          <MarshmallowButton
            variant={MARSHMALLOW_VARIANT.MINT}
            size={MARSHMALLOW_SIZE.MD}
            onPress={onOpenFeedback}
            icon={
              <MessageSquareHeart
                size={18}
                color="currentColor"
              />
            }
            title={c.feedbackBtn}
          />

          {/* Share Keepsake Button */}
          <MarshmallowButton
            variant={MARSHMALLOW_VARIANT.SECONDARY}
            size={MARSHMALLOW_SIZE.MD}
            onPress={handleShareKeepsake}
            icon={
              <Share2
                size={16}
                color="currentColor"
              />
            }
            title={c.sharePolaroidBtn}
          />

          {/* Start New Session */}
          <MarshmallowButton
            variant={MARSHMALLOW_VARIANT.PRIMARY}
            size={MARSHMALLOW_SIZE.MD}
            onPress={onRestart}
            icon={
              <RotateCcw
                size={18}
                color="currentColor"
              />
            }
            title={c.restartSessionBtn}
          />

          {/* View History Button */}
          <MarshmallowButton
            variant={MARSHMALLOW_VARIANT.SOFT_CREAM}
            size={MARSHMALLOW_SIZE.MD}
            onPress={onOpenHistory}
            icon={
              <History
                size={16}
                color="currentColor"
              />
            }
            title={c.viewHistoryBtn}
          />
        </div>
      </div>
    </div>
  );
};

export default ResetCompletedView;

export * from './modals/ResetHistoryModal';
export * from './modals/AiFeedbackModal';