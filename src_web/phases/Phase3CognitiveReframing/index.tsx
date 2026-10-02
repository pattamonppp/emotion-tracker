import React, { useState } from 'react';
import cn from 'classnames';
import { GoalType } from '../../types';
import { REFRAMING_INSIGHTS } from '../../data/matrixData';
import { audioService } from '../../services/audioService';
import { Button } from '../../components/Button';
import { MoocaMascot } from '../../components/MoocaMascot';
import { getTranslation } from '../../locales';
import {
  ArrowRight,
  Dna,
  Footprints,
  Sparkles,
  Heart,
  Check,
} from 'lucide-react';
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
  const strings = getTranslation(lang).phases.phase3;
  const [isActionCommitted, setIsActionCommitted] = useState(false);
  const insight = REFRAMING_INSIGHTS[goal];

  const handleCommitAction = () => {
    setIsActionCommitted(true);
    audioService.triggerHaptic([30, 45]);
    audioService.playJarDrop();
  };

  return (
    <div className={styles.container}>
      {/* Mooca Mascot & Heading */}
      <div className={styles.headerSection}>
        <MoocaMascot
          mood={isActionCommitted ? 'celebrating' : 'comforting'}
          size="sm"
          speakingBubble={
            isActionCommitted ? strings.bubbleCommitted : strings.bubbleDefault
          }
        />

        <div className={styles.phaseBadge}>
          <Sparkles />
          <span>
            {strings.badge}
          </span>
        </div>

        <h2 className={styles.heading}>
          {strings.heading}
        </h2>
      </div>

      {/* Main Content Area: Cute Cozy Cards */}
      <div className={styles.contentArea}>
        {/* 1. Contextual Behavioral Reflection Card */}
        <div className={styles.reflectionCard}>
          <div className={styles.cardAccentBar} />

          <div className={styles.cardHeaderRow}>
            <Heart />
            <span>{strings.reflectionLabel}</span>
          </div>

          <p className={styles.reflectionText}>
            {lang === 'th' ? insight.reflectionTh : insight.reflectionEn}
          </p>

          <div className={styles.biologyFactRow}>
            <Dna />
            <span>{lang === 'th' ? insight.biologyFactTh : insight.biologyFactEn}</span>
          </div>
        </div>

        {/* 2. The 1 Micro-Action Next Step */}
        <div className={styles.microActionCard}>
          <div className={styles.microActionHeader}>
            <div className={styles.actionBadgeLeft}>
              <Footprints />
              <span>{strings.microActionLabel}</span>
            </div>
            <span className={styles.immediatePill}>
              {strings.immediate}
            </span>
          </div>

          <div
            onClick={handleCommitAction}
            className={cn(styles.commitButtonBox, {
              [styles.committed]: isActionCommitted,
            })}
          >
            <div className={styles.commitContentRow}>
              <ArrowRight />
              <span className={styles.commitActionText}>
                {lang === 'th' ? insight.microActionTh : insight.microActionEn}
              </span>
            </div>

            <div
              className={cn(styles.checkIndicator, {
                [styles.active]: isActionCommitted,
              })}
            >
              {isActionCommitted ? <Check /> : <span className={styles.tapHint}>{strings.tap}</span>}
            </div>
          </div>

          <p className={styles.microActionHint}>
            <Heart />
            <span>
              {strings.actionHint}
            </span>
          </p>
        </div>
      </div>

      {/* Footer Proceed Button - Only after committed */}
      {isActionCommitted && (
        <div className={styles.footerArea}>
          <Button
            variant="primary"
            colorTheme="turquoise"
            size="lg"
            fullWidth
            onClick={onProceed}
            trailingIcon={<ArrowRight className="w-4 h-4" />}
            label={strings.nextPhase}
          />
        </div>
      )}
    </div>
  );
};

export default Phase3CognitiveReframing;
