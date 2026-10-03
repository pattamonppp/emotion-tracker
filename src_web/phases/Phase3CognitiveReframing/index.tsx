import React, { useState } from 'react';
import classNames from 'classnames';
import { GoalType, LANG, Language } from '../../types';
import { REFRAMING_INSIGHTS } from '../../data/matrixData';
import { audioService, HAPTIC_STYLE } from '../../services/audioService';
import { MARSHMALLOW_SIZE, MARSHMALLOW_VARIANT, MarshmallowButton } from '../../design-system/MarshmallowButton';
import { MOOCA_MOOD, MoocaMascot } from '../../components/MoocaMascot';
import {
  Heart,
  Dna,
  ArrowRight,
  Sparkles,
  HeartHandshake,
  Sprout,
} from 'lucide-react';
import { getTranslation } from '../../locales';

import styles from './styles.module.scss';

export interface Phase3CognitiveReframingProps {
  goal: GoalType;
  onProceed: () => void;
  lang: Language;
}

export const Phase3CognitiveReframing: React.FC<
  Phase3CognitiveReframingProps
> = ({ goal, onProceed, lang }) => {
  const [isActionCommitted, setIsActionCommitted] =
    useState(false);

  const insight = REFRAMING_INSIGHTS[goal];

  const t = getTranslation(lang);
  const p3 = t.phases.phase3;

  const handleCommitAction = () => {
    setIsActionCommitted(true);

    audioService.triggerHaptic(HAPTIC_STYLE.SUCCESS);
    audioService.playJarDrop();
  };

  return (
    <div className={styles.screenWrapper}>
      <div className={styles.scrollView}>
        <div className={styles.container}>
          {/* Mascot */}
          <div className={styles.mascotWrapper}>
            <MoocaMascot
              mood={
                isActionCommitted
                  ? MOOCA_MOOD.CELEBRATING
                  : MOOCA_MOOD.COMFORTING
              }
              size="sm"
              speakingBubble={
                isActionCommitted
                  ? p3.bubbleSealed
                  : p3.bubbleRead
              }
            />
          </div>

          {/* Phase badge */}
          <div className={styles.phaseBadge}>
            <Sparkles
              size={12}
              color="#00C4B3"
            />

            <span className={styles.phaseBadgeText}>
              {p3.letterBadge}
            </span>
          </div>

          {/* Letter */}
          <div className={styles.letterWrapper}>
            <div className={styles.washiTapeLeft}>
              <div className={styles.washiTapePattern} />
            </div>

            <div className={styles.washiTapeRight}>
              <div className={styles.washiTapePattern} />
            </div>

            <div className={styles.letterPaper}>
              <div className={styles.letterStamp}>
                <Heart
                  size={11}
                  color="#EF7773"
                  fill="#FAD6D5"
                />

                <span className={styles.letterStampText}>
                  MOOCA
                </span>
              </div>

              <div className={styles.letterHeader}>
                <Heart
                  size={14}
                  color="#EF7773"
                />

                <span className={styles.letterGreeting}>
                  {p3.letterBadge}
                </span>
              </div>

              <p className={styles.letterBody}>
                {lang === LANG.TH
                  ? insight.reflectionTh
                  : insight.reflectionEn}
              </p>

              <div className={styles.biologyNote}>
                <Dna
                  size={15}
                  color="#355956"
                  className={styles.biologyIcon}
                />

                <p className={styles.biologyText}>
                  {lang === LANG.TH
                    ? insight.biologyFactTh
                    : insight.biologyFactEn}
                </p>
              </div>
            </div>
          </div>

          {/* Promise card */}
          <div className={styles.promiseCard}>
            <div className={styles.promiseHeaderRow}>
              <div className={styles.promiseHeaderContent}>
                <HeartHandshake
                  size={16}
                  color="#00C4B3"
                  strokeWidth={2.4}
                />

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
              className={classNames(
                styles.commitBox,
                {
                  [styles.commitBoxActive]:
                    isActionCommitted,
                },
              )}
            >
              <div className={styles.commitContent}>
                <div className={styles.commitIconWrapper}>
                  <Sprout
                    size={20}
                    color="#00C4B3"
                    strokeWidth={2.4}
                  />
                </div>

                <span
                  className={classNames(
                    styles.commitActionText,
                    {
                      [styles.commitActionTextActive]:
                        isActionCommitted,
                    },
                  )}
                >
                  {lang === LANG.TH
                    ? insight.microActionTh
                    : insight.microActionEn}
                </span>
              </div>

              {isActionCommitted ? (
                <div className={styles.mintSealStamp}>
                  <div className={styles.mintSealInner}>
                    <Heart
                      size={16}
                      color="#FFFFFF"
                      fill="#FFFFFF"
                    />

                    <span className={styles.mintSealText}>
                      {p3.promisedStamp}
                    </span>
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
              {isActionCommitted
                ? p3.sealedHint
                : p3.unsealedHint}
            </p>
          </div>
        </div>
      </div>

      {isActionCommitted && (
        <div className={styles.bottomBar}>
          <MarshmallowButton
            variant={MARSHMALLOW_VARIANT.PRIMARY}
            size={MARSHMALLOW_SIZE.LG}
            onPress={onProceed}
            icon={
              <ArrowRight
                size={18}
                color="#FFFFFF"
              />
            }
            title={p3.measureBtn}
          />
        </div>
      )}
    </div>
  );
};

export default Phase3CognitiveReframing;