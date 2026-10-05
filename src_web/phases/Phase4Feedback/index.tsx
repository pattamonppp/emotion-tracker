import React, { useState } from 'react';
import classNames from 'classnames';
import {
  EmotionTagId,
  ShiftFeedback,
  MoodStampType,
  MOOD_STAMP,
  SHIFT_RESULT,
  Language,
  SKY,
} from '../../types';
import { audioService, HAPTIC_STYLE } from '../../services/audioService';
import { MARSHMALLOW_SIZE, MARSHMALLOW_VARIANT, MarshmallowButton } from '../../design-system/MarshmallowButton';
import { MOOCA_MOOD, MoocaMascot } from '../../components/MoocaMascot';
import { useSky } from '../../components/DynamicSkyEngine';
import { Activity, Check, Plus, Minus, ArrowRight, Zap, Leaf, Heart } from 'lucide-react';
import { getTranslation } from '../../locales';
import { PHASE4_CONFIG } from '../../constants';
import styles from './styles.module.scss';

export interface Phase4FeedbackProps {
  preHeartRate: number;
  selectedEmotions: EmotionTagId[];
  onFinishReset: (feedback: ShiftFeedback) => void;
  onRestart: () => void;
  lang: Language;
}

export const Phase4Feedback: React.FC<Phase4FeedbackProps> = ({
  preHeartRate,
  onFinishReset,
  lang,
}) => {
  const { activePeriod } = useSky();
  const isNight = activePeriod === SKY.NIGHT;
  const t = getTranslation(lang);
  const p4 = t.phases.phase4;

  const [postHeartRate, setPostHeartRate] = useState(
    Math.max(PHASE4_CONFIG.minPostHeartRateFloor, preHeartRate - PHASE4_CONFIG.defaultBpmDrop)
  );
  const [shiftResult, setShiftResult] = useState<MoodStampType>(MOOD_STAMP.EMPOWERED);

  const bpmDrop = preHeartRate - postHeartRate;

  const handleSelectStamp = (stamp: MoodStampType) => {
    audioService.triggerHaptic(HAPTIC_STYLE.MEDIUM);
    audioService.playJarDrop();
    setShiftResult(stamp);
  };

  const handleFinish = () => {
    audioService.triggerHaptic(HAPTIC_STYLE.SUCCESS);
    audioService.playChimeShockwave();
    onFinishReset({
      shiftResult: shiftResult === MOOD_STAMP.HUG ? SHIFT_RESULT.SAME : shiftResult,
      preHeartRate,
      postHeartRate,
      timestamp: new Date().toISOString(),
    });
  };

  const getSpeakingBubble = () => {
    switch (shiftResult) {
      case MOOD_STAMP.HUG:
        return p4.bubbleHug;
      case MOOD_STAMP.EMPOWERED:
        return p4.bubbleEmpoweredReady;
      case MOOD_STAMP.GROUNDED:
      default:
        return p4.bubbleGroundedSteady;
    }
  };

  return (
    <div className={styles.screenWrapper}>
      <div className={styles.scrollContainer}>
        {/* Header & Mascot */}
        <div className={styles.mascotWrapper}>
          <MoocaMascot
            mood={shiftResult === MOOD_STAMP.HUG ? MOOCA_MOOD.HUGGING : MOOCA_MOOD.CELEBRATING}
            size="sm"
            speakingBubble={getSpeakingBubble()}
          />
        </div>

        <h2 className={classNames(styles.title, { [styles.titleNight]: isNight })}>
          {p4.deltaCheckTitle}
        </h2>

        {/* Heart Rate Delta Comparison Card */}
        <div className={classNames(styles.bpmCard, { [styles.bpmCardNight]: isNight })}>
          <div className={styles.bpmHeader}>
            <Activity size={15} color="#FA8C3D" />
            <span className={styles.bpmHeaderText}>{p4.bpmHeader}</span>
          </div>

          <div className={styles.bpmComparisonRow}>
            {/* Pre BPM */}
            <div className={styles.bpmCol}>
              <span className={styles.bpmColLabel}>{p4.bpmBefore}</span>
              <span className={styles.bpmPreValue}>{preHeartRate}</span>
              <span className={styles.bpmUnit}>BPM</span>
            </div>

            {/* Delta Badge */}
            <div className={styles.deltaBadge}>
              <span className={styles.deltaText}>
                {`${bpmDrop >= 0 ? `-${bpmDrop}` : `+${Math.abs(bpmDrop)}`} BPM`}
              </span>
            </div>

            {/* Post BPM with Stepper */}
            <div className={styles.bpmCol}>
              <span className={styles.bpmColLabel}>{p4.bpmNow}</span>
              <span className={styles.bpmPostValue}>{postHeartRate}</span>
              <div className={styles.stepperRow}>
                <button
                  type="button"
                  onClick={() => {
                    audioService.triggerHaptic(HAPTIC_STYLE.SELECTION);
                    setPostHeartRate((prev) => Math.max(PHASE4_CONFIG.minHeartRate, prev - 1));
                  }}
                  className={styles.stepperBtn}
                  title="Decrease BPM"
                >
                  <Minus size={11} color="#355956" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    audioService.triggerHaptic(HAPTIC_STYLE.SELECTION);
                    setPostHeartRate((prev) => Math.min(PHASE4_CONFIG.maxHeartRate, prev + 1));
                  }}
                  className={styles.stepperBtn}
                  title="Increase BPM"
                >
                  <Plus size={11} color="#355956" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Soft-Touch Mood Stamp Buttons Section */}
        <div className={styles.stampSection}>
          <div className={styles.stampsList}>
            {/* Stamp 1: Ready & Confident */}
            <button
              type="button"
              onClick={() => handleSelectStamp(MOOD_STAMP.EMPOWERED)}
              className={classNames(styles.stampBtn, {
                [styles.stampBtnActiveAmber]: shiftResult === MOOD_STAMP.EMPOWERED,
                [styles.stampBtnNight]: isNight,
              })}
            >
              <div className={styles.stampLeftRow}>
                <div
                  className={styles.stampSealIcon}
                  style={{ backgroundColor: '#FCF4E0', borderColor: '#F9A000' }}
                >
                  <Zap size={18} color="#D97800" fill="#D97800" />
                </div>
                <div className={styles.stampTextCol}>
                  <div className={styles.stampMainLabel}>{p4.empoweredTitle}</div>
                  <div className={styles.stampSubLabel}>{p4.empoweredSubAlt}</div>
                </div>
              </div>
              {shiftResult === MOOD_STAMP.EMPOWERED && (
                <div className={styles.stampPill} style={{ backgroundColor: '#F9A000' }}>
                  <Check size={12} color="#FFFFFF" strokeWidth={3} />
                  <span className={styles.stampPillText}>{p4.stampedBadge}</span>
                </div>
              )}
            </button>

            {/* Stamp 2: Calm & Grounded */}
            <button
              type="button"
              onClick={() => handleSelectStamp(MOOD_STAMP.GROUNDED)}
              className={classNames(styles.stampBtn, {
                [styles.stampBtnActiveTeal]: shiftResult === MOOD_STAMP.GROUNDED,
                [styles.stampBtnNight]: isNight,
              })}
            >
              <div className={styles.stampLeftRow}>
                <div
                  className={styles.stampSealIcon}
                  style={{ backgroundColor: '#E0F8F6', borderColor: '#00C4B3' }}
                >
                  <Leaf size={18} color="#00C4B3" fill="#00C4B3" />
                </div>
                <div className={styles.stampTextCol}>
                  <div className={styles.stampMainLabel}>{p4.groundedTitleShort}</div>
                  <div className={styles.stampSubLabel}>{p4.groundedSubAlt}</div>
                </div>
              </div>
              {shiftResult === MOOD_STAMP.GROUNDED && (
                <div className={styles.stampPill} style={{ backgroundColor: '#00C4B3' }}>
                  <Check size={12} color="#FFFFFF" strokeWidth={3} />
                  <span className={styles.stampPillText}>{p4.stampedBadge}</span>
                </div>
              )}
            </button>

            {/* Stamp 3: Need Extra Warm Hug */}
            <button
              type="button"
              onClick={() => handleSelectStamp(MOOD_STAMP.HUG)}
              className={classNames(styles.stampBtn, {
                [styles.stampBtnActivePink]: shiftResult === MOOD_STAMP.HUG,
                [styles.stampBtnNight]: isNight,
              })}
            >
              <div className={styles.stampLeftRow}>
                <div
                  className={styles.stampSealIcon}
                  style={{ backgroundColor: '#FDEFEE', borderColor: '#EF7773' }}
                >
                  <Heart size={18} color="#EF7773" fill="#EF7773" />
                </div>
                <div className={styles.stampTextCol}>
                  <div className={styles.stampMainLabel}>{p4.hugTitle}</div>
                  <div className={styles.stampSubLabel}>{p4.hugSub}</div>
                </div>
              </div>
              {shiftResult === MOOD_STAMP.HUG && (
                <div className={styles.stampPill} style={{ backgroundColor: '#EF7773' }}>
                  <Check size={12} color="#FFFFFF" strokeWidth={3} />
                  <span className={styles.stampPillText}>{p4.stampedBadge}</span>
                </div>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Pinned Bottom CTA Button */}
      <div className={styles.bottomBar}>
        <MarshmallowButton
          variant={MARSHMALLOW_VARIANT.PRIMARY}
          size={MARSHMALLOW_SIZE.MD}
          onPress={handleFinish}
          icon={<ArrowRight size={18} color="#FFFFFF" />}
          title={p4.claimPolaroid}
        />
      </div>
    </div>
  );
};

export default Phase4Feedback;
