import React, { useState } from 'react';
import cn from 'classnames';
import { ShiftFeedback, EmotionTagId } from '../../types';
import { EMOTION_TAGS } from '../../data/matrixData';
import { audioService } from '../../services/audioService';
import { Button } from '../../components/Button';
import { MoocaMascot } from '../../components/MoocaMascot';
import { getTranslation, getTagLabel } from '../../locales';
import {
  Activity,
  TrendingDown,
  CheckCircle2,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';
import { ZapIcon, LeafIcon, ScaleIcon } from '../../icons';
import styles from './styles.module.scss';

export interface Phase4FeedbackProps {
  preHeartRate: number;
  selectedEmotions: EmotionTagId[];
  onFinishReset: (feedback: ShiftFeedback) => void;
  onRestart: () => void;
  lang: 'th' | 'en';
}

export const Phase4Feedback: React.FC<Phase4FeedbackProps> = ({
  preHeartRate,
  selectedEmotions,
  onFinishReset,
  onRestart,
  lang,
}) => {
  const strings = getTranslation(lang).phases.phase4;
  const [selectedShift, setSelectedShift] = useState<'empowered' | 'grounded' | 'same' | null>(null);
  const [postHeartRate] = useState(() => Math.max(72, preHeartRate - Math.floor(Math.random() * 8 + 18)));

  const handleSelectShift = (shift: 'empowered' | 'grounded' | 'same') => {
    setSelectedShift(shift);
    audioService.triggerHaptic([40, 60]);
    audioService.playJarDrop();
  };

  const handleFinish = () => {
    if (!selectedShift) return;
    onFinishReset({
      shiftResult: selectedShift,
      preHeartRate,
      postHeartRate,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });
  };

  const hrDelta = preHeartRate - postHeartRate;
  const primaryEmotion = EMOTION_TAGS.find((e) => e.id === selectedEmotions[0]);

  return (
    <div className={styles.container}>
      {/* Mooca Mascot & Heading */}
      <div className={styles.headerSection}>
        <MoocaMascot
          mood={selectedShift === 'empowered' ? 'celebrating' : selectedShift === 'grounded' ? 'hugging' : 'happy'}
          size="sm"
          speakingBubble={
            selectedShift === 'empowered'
              ? strings.bubbleEmpowered
              : selectedShift === 'grounded'
                ? strings.bubbleGrounded
                : strings.bubbleDefault
          }
        />

        <div className={styles.phaseBadge}>
          <ShieldCheck />
          <span>
            {strings.badge}
          </span>
        </div>

        <h2 className={styles.heading}>
          {strings.heading}
        </h2>
      </div>

      {/* Main Single-Tap Scale Area */}
      <div className={styles.mainContentArea}>
        {/* The 3 Single-Tap Options */}
        <div className={styles.optionsList}>
          {/* Option 1: Empowered */}
          <button
            type="button"
            onClick={() => handleSelectShift('empowered')}
            className={cn(styles.optionCard, {
              [styles.activeEmpowered]: selectedShift === 'empowered',
            })}
          >
            <div className={styles.optionLeftRow}>
              <span className={styles.optionEmoji}>
                <ZapIcon className="w-5 h-5 text-amber-500" />
              </span>
              <div>
                <div
                  className={cn(styles.optionTitle, {
                    [styles.selectedWhite]: selectedShift === 'empowered',
                  })}
                >
                  {strings.empoweredTitle}
                </div>
                <div
                  className={cn(styles.optionSubtitle, {
                    [styles.selectedLight]: selectedShift === 'empowered',
                  })}
                >
                  {strings.empoweredSub}
                </div>
              </div>
            </div>
            {selectedShift === 'empowered' && <CheckCircle2 className={styles.checkIcon} />}
          </button>

          {/* Option 2: Grounded */}
          <button
            type="button"
            onClick={() => handleSelectShift('grounded')}
            className={cn(styles.optionCard, {
              [styles.activeGrounded]: selectedShift === 'grounded',
            })}
          >
            <div className={styles.optionLeftRow}>
              <span className={styles.optionEmoji}>
                <LeafIcon className="w-5 h-5 text-emerald-500" />
              </span>
              <div>
                <div
                  className={cn(styles.optionTitle, {
                    [styles.selectedWhite]: selectedShift === 'grounded',
                  })}
                >
                  {strings.groundedTitle}
                </div>
                <div
                  className={cn(styles.optionSubtitle, {
                    [styles.selectedLight]: selectedShift === 'grounded',
                  })}
                >
                  {strings.groundedSub}
                </div>
              </div>
            </div>
            {selectedShift === 'grounded' && <CheckCircle2 className={styles.checkIcon} />}
          </button>

          {/* Option 3: Same */}
          <button
            type="button"
            onClick={() => handleSelectShift('same')}
            className={cn(styles.optionCard, {
              [styles.activeSame]: selectedShift === 'same',
            })}
          >
            <div className={styles.optionLeftRow}>
              <span className={styles.optionEmoji}>
                <ScaleIcon className="w-5 h-5 text-teal-600" />
              </span>
              <div>
                <div className={styles.optionTitle}>
                  {strings.sameTitle}
                </div>
                <div className={styles.optionSubtitle}>
                  {strings.sameSub}
                </div>
              </div>
            </div>
            {selectedShift === 'same' && <CheckCircle2 className={styles.checkIcon} style={{ color: '#475569' }} />}
          </button>
        </div>

        {/* Real-time Delta Display Card */}
        <div className={styles.deltaCard}>
          <div className={styles.deltaHeader}>
            <span className={styles.deltaLabel}>
              <Activity />
              {strings.bioDeltaLabel}
            </span>
            <span className={styles.deltaPill}>
              <TrendingDown /> -{hrDelta} bpm
            </span>
          </div>

          <div className={styles.deltaGrid}>
            <div className={styles.deltaPreCol}>
              <span className={styles.deltaColHeader}>
                {strings.preReset}
              </span>
              <div className={styles.deltaPreValue}>
                {preHeartRate} <span>bpm</span>
              </div>
              <div className={styles.deltaEmotionTag}>
                {primaryEmotion ? getTagLabel(primaryEmotion, lang) : strings.alertHigh}
              </div>
            </div>

            <div className={styles.deltaPostCol}>
              <span className={styles.deltaColHeader} style={{ color: '#004D40' }}>
                {strings.postReset}
              </span>
              <div className={styles.deltaPostValue}>
                {postHeartRate} <span>bpm</span>
              </div>
              <div className={styles.deltaShiftStatus}>
                {selectedShift === 'empowered' ? strings.peakReady : strings.restoredCalm}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className={styles.footerArea}>
        <Button
          variant="primary"
          colorTheme="turquoise"
          size="lg"
          fullWidth
          isDisabled={!selectedShift}
          onClick={handleFinish}
          label={
            selectedShift ? strings.completeSelected : strings.completePrompt
          }
        />

        <div className={styles.restartRow}>
          <Button
            variant="ghost"
            colorTheme="blue"
            size="sm"
            onClick={onRestart}
            leadingIcon={<RotateCcw className="w-3.5 h-3.5" />}
            label={strings.restartCycle}
          />
        </div>
      </div>
    </div>
  );
};

export default Phase4Feedback;
