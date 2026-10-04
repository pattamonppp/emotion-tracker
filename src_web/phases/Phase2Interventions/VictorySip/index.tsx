import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { audioService, HAPTIC_STYLE } from '../../../services/audioService';
import { MARSHMALLOW_SIZE, MARSHMALLOW_VARIANT, MarshmallowButton } from '../../../design-system/MarshmallowButton';
import { MOOCA_MOOD, MoocaMascot } from '../../../components/MoocaMascot';
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
  const [sipCount, setSipCount] = useState(0); // 0 to 3
  const [isFinished, setIsFinished] = useState(false);
  const [isTiltingToDrink, setIsTiltingToDrink] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(true);

  const tiltTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const skyTheme = useSkyTheme();

  const triggerSip = () => {
    const nextSip = sipCount + 1;
    setSipCount(nextSip);
    audioService.playLiquidSip(nextSip);
    audioService.triggerHaptic(HAPTIC_STYLE.MEDIUM);

    if (nextSip >= 3) {
      setIsFinished(true);
      audioService.triggerHaptic(HAPTIC_STYLE.SUCCESS);
      audioService.playChimeShockwave();
    }
  };

  const handleCupPress = () => {
    if (isFinished || isTiltingToDrink) return;

    setIsTiltingToDrink(true);
    audioService.triggerHaptic(HAPTIC_STYLE.MEDIUM);

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
          mood={isFinished ? MOOCA_MOOD.CELEBRATING : MOOCA_MOOD.DRINKING}
          size="sm"
          speakingBubble={isFinished ? strings.bubbleDone : strings.bubbleDrinking}
        />
      </div>

      {/* 2. Instruction Badge & Sip Indicator with Info Tip */}
      <button
        type="button"
        onClick={() => {
          audioService.triggerHaptic(HAPTIC_STYLE.SELECTION);
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
          <div className={styles.glassReflectionSecondary} />

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
            {/* Pearl 1: Cute happy face */}
            <div className={styles.pearl} style={{ left: 14, bottom: 8 }}>
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <circle cx="15.5" cy="5.5" r="1.2" fill="rgba(255, 255, 255, 0.65)" />
                <circle cx="7" cy="9.5" r="1.4" fill="#B3EDE8" />
                <circle cx="15" cy="9.5" r="1.4" fill="#B3EDE8" />
                <ellipse cx="5.5" cy="12.5" rx="1.3" ry="0.8" fill="#FFA5A5" opacity="0.9" />
                <ellipse cx="16.5" cy="12.5" rx="1.3" ry="0.8" fill="#FFA5A5" opacity="0.9" />
                <path d="M 9 12 Q 11 14.5 13 12" stroke="#B3EDE8" strokeWidth="1.1" strokeLinecap="round" />
              </svg>
            </div>
            {/* Pearl 2: Cheerful sparkle face */}
            <div className={styles.pearl} style={{ left: 40, bottom: 12 }}>
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <circle cx="15.5" cy="5.5" r="1.2" fill="rgba(255, 255, 255, 0.65)" />
                <circle cx="7" cy="9" r="1.6" fill="#B3EDE8" />
                <circle cx="6.5" cy="8.4" r="0.6" fill="#FFFFFF" />
                <circle cx="15" cy="9" r="1.6" fill="#B3EDE8" />
                <circle cx="14.5" cy="8.4" r="0.6" fill="#FFFFFF" />
                <ellipse cx="5.5" cy="12.2" rx="1.3" ry="0.8" fill="#FFA5A5" opacity="0.9" />
                <ellipse cx="16.5" cy="12.2" rx="1.3" ry="0.8" fill="#FFA5A5" opacity="0.9" />
                <path d="M 9.2 12 Q 11 14.8 12.8 12 Z" fill="#FFA5A5" stroke="#B3EDE8" strokeWidth="0.8" />
              </svg>
            </div>
            {/* Pearl 3: Winking playful face */}
            <div className={styles.pearl} style={{ right: 14, bottom: 8 }}>
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <circle cx="15.5" cy="5.5" r="1.2" fill="rgba(255, 255, 255, 0.65)" />
                <circle cx="7" cy="9.5" r="1.4" fill="#B3EDE8" />
                <circle cx="6.5" cy="9" r="0.5" fill="#FFFFFF" />
                <path d="M 13.5 10 Q 15 8.2 16.5 10" stroke="#B3EDE8" strokeWidth="1.2" strokeLinecap="round" />
                <ellipse cx="5.5" cy="12.5" rx="1.3" ry="0.8" fill="#FFA5A5" opacity="0.9" />
                <ellipse cx="16.5" cy="12.5" rx="1.3" ry="0.8" fill="#FFA5A5" opacity="0.9" />
                <path d="M 9.5 12 Q 11 14 12.5 12" stroke="#B3EDE8" strokeWidth="1.1" strokeLinecap="round" />
              </svg>
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

          {/* Cup Front Kawaii Smiling Face */}
          <div className={styles.cupFaceContainer}>
            <svg
              width="54"
              height="32"
              viewBox="0 0 54 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={styles.cupFaceSvg}
            >
              {/* Rosy Blushing Cheeks */}
              <ellipse
                cx="10"
                cy="20"
                rx="4.5"
                ry="2.6"
                fill={isTiltingToDrink ? '#FF787D' : '#FFA4A4'}
                opacity={isTiltingToDrink ? '0.95' : '0.85'}
              />
              <ellipse
                cx="44"
                cy="20"
                rx="4.5"
                ry="2.6"
                fill={isTiltingToDrink ? '#FF787D' : '#FFA4A4'}
                opacity={isTiltingToDrink ? '0.95' : '0.85'}
              />

              {isTiltingToDrink ? (
                <>
                  {/* Happy Curved Sips Eyes */}
                  <path d="M 10 13 Q 15 7 20 13" stroke="#164E48" strokeWidth="2.4" strokeLinecap="round" />
                  <path d="M 34 13 Q 39 7 44 13" stroke="#164E48" strokeWidth="2.4" strokeLinecap="round" />
                  {/* Cute Sipping Mouth */}
                  <ellipse cx="27" cy="18" rx="3.4" ry="4" fill="#164E48" />
                  <ellipse cx="27" cy="18.5" rx="1.8" ry="2.2" fill="#FF8585" />
                </>
              ) : (
                <>
                  {/* Shiny Big Kawaii Eyes with Sparkle Glints */}
                  <circle cx="15" cy="13" r="4.8" fill="#164E48" />
                  <circle cx="13.5" cy="11.2" r="1.8" fill="#FFFFFF" />
                  <circle cx="16.6" cy="14.8" r="0.9" fill="#FFFFFF" />

                  <circle cx="39" cy="13" r="4.8" fill="#164E48" />
                  <circle cx="37.5" cy="11.2" r="1.8" fill="#FFFFFF" />
                  <circle cx="40.6" cy="14.8" r="0.9" fill="#FFFFFF" />

                  {/* Sweet Happy Open Mouth */}
                  <path
                    d="M 23 17 Q 27 23 31 17 Z"
                    fill="#FF8585"
                    stroke="#164E48"
                    strokeWidth="1.8"
                    strokeLinejoin="round"
                  />
                </>
              )}
            </svg>
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
                background: skyTheme.progressFillBar,
              }}
            />
          </div>
        </div>
      </div>

      {/* 4. Action / Sensor Status Section */}
      <div className={styles.actionSection}>
        {isFinished ? (
          <MarshmallowButton
            variant={MARSHMALLOW_VARIANT.PRIMARY}
            size={MARSHMALLOW_SIZE.MD}
            onPress={onComplete}
            icon={<ArrowRight size={16} color="#FFFFFF" />}
            title={strings.proceedBtn}
          />
        ) : (
          <span className={styles.organicSensorHint} style={{ color: skyTheme.hintText }}>
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
                audioService.triggerHaptic(HAPTIC_STYLE.SUCCESS);
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
