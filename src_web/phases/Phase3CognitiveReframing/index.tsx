import React, { useState } from 'react';
import classNames from 'classnames';
import { GoalType } from '../../types';
import { REFRAMING_INSIGHTS } from '../../data/matrixData';
import { audioService } from '../../services/audioService';
import { MarshmallowButton } from '../../design-system/MarshmallowButton';
import { MoocaMascot } from '../../components/MoocaMascot';
import { Heart, Dna, ArrowRight, Sparkles, HeartHandshake, Sprout } from 'lucide-react';
import { getTranslation } from '../../locales';
import { PHASE3_CONFIG } from '../../constants';
import styles from './styles.module.scss';

export interface Phase3CognitiveReframingProps {
  goal: GoalType;
  onProceed: () => void;
  lang: 'th' | 'en';
}

export const Phase3CognitiveReframing: React.FC<Phase3CognitiveReframingProps> = ({
  goal,
  onProceed,
  lang,
}) => {
  const [isActionCommitted, setIsActionCommitted] = useState(false);
  const insight = REFRAMING_INSIGHTS[goal];
  const t = getTranslation(lang);
  const p3 = t.phases.phase3;

  const handleCommitAction = () => {
    setIsActionCommitted(true);
    audioService.triggerHaptic('success');
    audioService.playJarDrop();
  };

  return (
    <div className={styles.screenWrapper}>
      <div className={styles.scrollView}>
        <div className={styles.container}>
          {/* 1. Mascot View with Dedicated Bubble Clearance (Height: 145) */}
          <div className={styles.mascotWrapper}>
            <MoocaMascot
              mood={isActionCommitted ? 'celebrating' : 'comforting'}
              size="sm"
              speakingBubble={
                isActionCommitted
                  ? p3.bubbleSealed
                  : p3.bubbleRead
              }
            />
          </div>

          <div className={styles.phaseBadge}>
            <Sparkles size={12} color="#00C4B3" />
            <span className={styles.phaseBadgeText}>
              {p3.letterBadge}
            </span>
          </div>

          {/* Washi-Tape Letter Card */}
          <div className={styles.letterWrapper}>
            {/* Pastel Washi Tape - Top Left */}
            <div className={styles.washiTapeLeft}>
              <div className={styles.washiTapePattern} />
            </div>

            {/* Pastel Washi Tape - Top Right */}
            <div className={styles.washiTapeRight}>
              <div className={styles.washiTapePattern} />
            </div>

            {/* Cozy Cream Letter Paper */}
            <div className={styles.letterPaper}>
              {/* Cute Decorative Stamp in Corner */}
              <div className={styles.letterStamp}>
                <Heart size={11} color="#EC4899" fill="#FCE7F3" />
                <span className={styles.letterStampText}>MOOCA</span>
              </div>

              <div className={styles.letterHeader}>
                <Heart size={14} color="#F43F5E" />
                <span className={styles.letterGreeting}>
                  {p3.letterBadge}
                </span>
              </div>

              {/* Emotional Reframing Message */}
              <p className={styles.letterBody}>
                {lang === 'th' ? insight.reflectionTh : insight.reflectionEn}
              </p>

              {/* Biological Reassurance Note */}
              <div className={styles.biologyNote}>
                <Dna size={15} color="#004D40" className="mt-0.5 shrink-0" />
                <p className={styles.biologyText}>
                  {lang === 'th' ? insight.biologyFactTh : insight.biologyFactEn}
                </p>
              </div>
            </div>
          </div>

          {/* Pinky-Promise Action Box */}
          <div className={styles.promiseCard}>
            <div className={styles.promiseHeaderRow}>
              <div className="flex items-center gap-1.5">
                <HeartHandshake size={16} color="#00C4B3" strokeWidth={2.4} />
                <span className={styles.promiseTitle}>
                  {p3.promiseBox}
                </span>
              </div>
              <div className={styles.promiseBadge}>
                <span className={styles.promiseBadgeText}>
                  {p3.microStepBadge}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCommitAction}
              className={classNames(styles.commitBox, {
                [styles.commitBoxActive]: isActionCommitted,
              })}
            >
              <div className={styles.commitContent}>
                <div className="mr-2 shrink-0">
                  <Sprout size={20} color="#00C4B3" strokeWidth={2.4} />
                </div>
                <span
                  className={classNames(styles.commitActionText, {
                    [styles.commitActionTextActive]: isActionCommitted,
                  })}
                >
                  {lang === 'th' ? insight.microActionTh : insight.microActionEn}
                </span>
              </div>

              {/* Mint Wax Seal Heart Stamp */}
              {isActionCommitted ? (
                <div className={styles.mintSealStamp}>
                  <div className={styles.mintSealInner}>
                    <Heart size={16} color="#FFFFFF" fill="#FFFFFF" />
                    <span className={styles.mintSealText}>{p3.promisedStamp}</span>
                  </div>
                </div>
              ) : (
                <div className={styles.stampPlaceholder}>
                  <span className={styles.stampPrompt}>
                    {p3.stampPrompt}
                  </span>
                </div>
              )}
            </button>

            <p className={styles.commitHint}>
              {isActionCommitted ? p3.sealedHint : p3.unsealedHint}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Pinned Proceed Button - Only after stamped! */}
      {isActionCommitted && (
        <div className={styles.bottomBar}>
          <MarshmallowButton
            variant="primary"
            size="lg"
            onPress={onProceed}
            icon={<ArrowRight size={18} color="#FFFFFF" />}
            title={p3.measureBtn}
          />
        </div>
      )}
    </div>
  );
};

export default Phase3CognitiveReframing;
