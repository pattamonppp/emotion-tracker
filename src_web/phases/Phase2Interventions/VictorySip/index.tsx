import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { audioService } from '../../../services/audioService';
import { MarshmallowButton } from '../../../design-system/MarshmallowButton';
import { MoocaMascot } from '../../../components/MoocaMascot';
import { useSky } from '../../../components/DynamicSkyEngine';
import { Check, GlassWater, ArrowRight, X, Sparkles, Heart, HelpCircle } from 'lucide-react';
import { getTranslation } from '../../../locales';
import type { VictorySipProps } from './types';
import styles from './styles.module.scss';
import { useSkyTheme } from '@/hooks/useSkyTheme';

export const VictorySip: React.FC<VictorySipProps> = ({
  onComplete,
  lang,
}) => {
  const t = getTranslation(lang);
  const strings = t.phases.phase2.victorySip;
  const { activePeriod } = useSky();
  const [sipCount, setSipCount] = useState(0); // 0 to 3
  const [isFinished, setIsFinished] = useState(false);
  const [isTiltingToDrink, setIsTiltingToDrink] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(true);

  const readyForNextSip = useRef(true);
  const tiltTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const skyTheme = useSkyTheme();

  const triggerSip = () => {
    const nextSip = sipCount + 1;
    setSipCount(nextSip);
    audioService.playLiquidSip(nextSip);
    audioService.triggerHaptic('medium');

    if (nextSip >= 3) {
      setIsFinished(true);
      audioService.triggerHaptic('success');
      audioService.playChimeShockwave();
    }
  };

  const handleCupPress = () => {
    if (isFinished || isTiltingToDrink) return;

    setIsTiltingToDrink(true);
    audioService.triggerHaptic('medium');

    tiltTimer.current = setTimeout(() => {
      triggerSip();
      setIsTiltingToDrink(false);
      tiltTimer.current = null;
    }, 1200);
  };

  useEffect(() => {
    return () => {
      if (tiltTimer.current) clearTimeout(tiltTimer.current);
    };
  }, []);

  const liquidHeightPercent = Math.max(0, 100 - sipCount * 33.34);

  return (
    <div className={styles.container}>
      {/* 1. Mascot View - Standardized Height */}
      <div className={styles.mascotWrapper}>
        <MoocaMascot
          mood={isFinished ? 'celebrating' : 'drinking'}
          size="sm"
          speakingBubble={isFinished ? strings.bubbleDone : strings.bubbleDrinking}
        />
      </div>

      {/* 2. Instruction Badge & Sip Indicator with Info Tip */}
      <button
        type="button"
        onClick={() => {
          audioService.triggerHaptic('selection');
          setIsGuideOpen(true);
        }}
        className={styles.instructionPill}
        style={{
          backgroundColor: skyTheme.badgeBg,
          borderColor: skyTheme.badgeBorder,
        }}
      >
        {isFinished ? (
          <Sparkles size={14} color={skyTheme.badgeIconColor} strokeWidth={2.4} />
        ) : isTiltingToDrink ? (
          <Sparkles size={14} color={skyTheme.badgeIconColor} strokeWidth={2.4} />
        ) : (
          <GlassWater size={14} color={skyTheme.badgeIconColor} strokeWidth={2.4} />
        )}

        <span className={styles.instructionPillText} style={{ color: skyTheme.badgeTextColor }}>
          {isFinished
            ? strings.sipProgressDone
            : isTiltingToDrink
              ? strings.tiltActive
              : strings.tiltReady}
        </span>

        <HelpCircle size={13} color={skyTheme.badgeIconColor} strokeWidth={2} />
      </button>

      {/* 3. Hero Centerpiece: Fantasy Crystal Potion Tumbler */}
      <div className={styles.cupContainer} onClick={handleCupPress} title={strings.tiltPhoneHint}>
        {/* Soft Ambient Radiating Halo behind the tumbler */}
        <div className={styles.cupAuraHalo} />

        {/* Straw Top Star Topper */}
        <div className={styles.strawStarTopper}>
          <Sparkles size={14} color="#F9A000" fill="#F8E4B3" />
        </div>

        {/* Iridescent Striped Straw */}
        <div className={styles.straw}>
          <div className={styles.strawStripe} style={{ backgroundColor: '#EF7773' }} />
          <div className={styles.strawStripe} style={{ backgroundColor: '#B3EDE8' }} />
          <div className={styles.strawStripe} style={{ backgroundColor: '#F9A000' }} />
          <div className={styles.strawStripe} style={{ backgroundColor: '#B3EDE8' }} />
          <div className={styles.strawStripe} style={{ backgroundColor: '#EF7773' }} />
        </div>

        {/* Cup Dome Rim */}
        <div className={styles.cupDome} />

        {/* Crystal Potion Cup Glass Body with physical tilt animation */}
        <div
          className={classNames(styles.cupBody, {
            [styles.cupBodyTilting]: isTiltingToDrink,
          })}
        >
          {/* Glass Highlight */}
          <div className={styles.glassReflection} />

          {/* Realistic Gravity-Aligned Liquid Fluid */}
          <div
            className={classNames(styles.liquidContainer, {
              [styles.liquidTilting]: isTiltingToDrink,
            })}
            style={{ height: `${liquidHeightPercent}%` }}
          >
            <div className={styles.liquidGradient}>
              <div className={styles.liquidWaveTop} />
            </div>
          </div>

          {/* Smiling Boba Pearls inside Cup */}
          <div className={styles.pearlsContainer}>
            {/* Pearl 1 */}
            <div className={styles.pearl} style={{ left: 14, bottom: 8 }}>
              <span className={styles.pearlFace}>•‿•</span>
            </div>
            {/* Pearl 2 */}
            <div className={styles.pearl} style={{ left: 40, bottom: 12 }}>
              <span className={styles.pearlFace}>◕‿◕</span>
            </div>
            {/* Pearl 3 */}
            <div className={styles.pearl} style={{ right: 14, bottom: 8 }}>
              <span className={styles.pearlFace}>^‿^</span>
            </div>
            {/* Floating Bubble 4 */}
            <div className={styles.floatingBubble} style={{ left: 24, bottom: 38 }}>
              <Sparkles size={11} color="#F9A000" fill="#F8E4B3" />
            </div>
            {/* Floating Bubble 5 */}
            <div className={styles.floatingBubble} style={{ right: 26, bottom: 44 }}>
              <Heart size={10} color="#EF7773" fill="#EF7773" />
            </div>
          </div>

          {/* Cup Front Smiling Face */}
          <div className={styles.cupFaceContainer}>
            <span className={styles.cupEyes}>{isTiltingToDrink ? '˘   ³' : '◕   ◕'}</span>
            <span className={styles.cupMouth}>‿</span>
          </div>
        </div>

        {/* 3. Organic Sip Count Section with Interactive Tilt Guidance Gauge */}
        <div className={styles.organicCountSection}>
          <span className={styles.organicCountNumber} style={{ color: skyTheme.countColor }}>
            {sipCount}/3
          </span>
          <span className={styles.organicCountLabel} style={{ color: skyTheme.labelColor }}>
            {isFinished
              ? strings.sipProgressDone
              : isTiltingToDrink
                ? strings.sipProgressSipping
                : strings.sipProgressIdle}
          </span>

          {/* Slim glowing 4.5px progress line */}
          <div
            className={styles.organicProgressTrack}
            style={{ backgroundColor: skyTheme.progressTrack }}
          >
            <div
              className={styles.organicProgressFill}
              style={{
                width: `${(sipCount / 3) * 100}%`,
                background: skyTheme.progressFill,
              }}
            />
          </div>
        </div>
      </div>

      {/* 4. Action / Sensor Status Section */}
      <div className={styles.actionSection}>
        {isFinished ? (
          <MarshmallowButton
            variant="primary"
            size="md"
            onPress={onComplete}
            icon={<ArrowRight size={16} color="#FFFFFF" />}
            title={strings.proceedBtn}
          />
        ) : (
          <span className={styles.organicSensorHint} style={{ color: skyTheme.hintColor }}>
            {isTiltingToDrink
              ? strings.sippingHold
              : strings.tiltPhoneHint}
          </span>
        )}
      </div>

      {/* 5. Instruction Modal */}
      {isGuideOpen && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalCard}>
            <button
              type="button"
              onClick={() => setIsGuideOpen(false)}
              className={styles.modalCloseBtn}
            >
              <X size={18} color="#64748B" />
            </button>

            <div className={styles.guideIconWrapper}>
              <GlassWater size={32} color="#00C4B3" strokeWidth={2.4} />
            </div>

            <h3 className={styles.guideTitle}>{strings.guideTitle}</h3>

            <div className={styles.guideStepsBox}>
              <div className={styles.guideStepRow}>
                <div className={styles.stepNumBadge}>
                  <span className={styles.stepNumText}>1</span>
                </div>
                <span className={styles.guideStepText}>{strings.guideStep1Desc}</span>
              </div>

              <div className={styles.guideStepRow}>
                <div className={styles.stepNumBadge}>
                  <span className={styles.stepNumText}>2</span>
                </div>
                <span className={styles.guideStepText}>{strings.guideStep2Desc}</span>
              </div>

              <div className={styles.guideStepRow}>
                <div className={styles.stepNumBadge}>
                  <span className={styles.stepNumText}>3</span>
                </div>
                <span className={styles.guideStepText}>{strings.guideStep3Desc}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                audioService.triggerHaptic('success');
                setIsGuideOpen(false);
              }}
              className={styles.guideConfirmBtn}
            >
              <Check size={16} color="#FFFFFF" strokeWidth={2.6} />
              <span className={styles.guideConfirmText}>{strings.guideConfirm}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VictorySip;
