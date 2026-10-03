import React, { useState, useEffect, useRef, useMemo } from 'react';
import classNames from 'classnames';
import { audioService } from '../../../services/audioService';
import { MarshmallowButton } from '../../../design-system/MarshmallowButton';
import { MoocaMascot } from '../../../components/MoocaMascot';
import { useSky } from '../../../components/DynamicSkyEngine';
import { Check, GlassWater, ArrowRight, X, Sparkles, Heart } from 'lucide-react';
import { DESIGN_TOKENS } from '../../../design-system/tokens';
import { getTranslation } from '../../../locales';
import type { VictorySipProps } from './types';
import styles from './styles.module.scss';

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

  const skyTheme = useMemo(() => {
    switch (activePeriod) {
      case 'sunset':
        return {
          countColor: '#ffffff',
          labelColor: '#fffafb',
          hintColor: '#5f0019',
          progressTrack: 'rgba(255, 255, 255, 0.45)',
          progressFill: 'linear-gradient(90deg, #ffa8bb, #fff6b4)',
          badgeBg: 'rgba(255, 255, 255, 0.90)',
          badgeBorder: 'rgba(244, 114, 182, 0.40)',
          badgeTextColor: '#a81642',
          badgeIconColor: '#F43F5E',
        };
      case 'night':
        return {
          countColor: '#F8FAFC',
          labelColor: '#E2E8F0',
          hintColor: '#94A3B8',
          progressTrack: 'rgba(255, 255, 255, 0.25)',
          progressFill: 'linear-gradient(90deg, #38BDF8, #818CF8)',
          badgeBg: 'rgba(15, 23, 42, 0.92)',
          badgeBorder: 'rgba(56, 189, 248, 0.40)',
          badgeTextColor: '#E0F2FE',
          badgeIconColor: '#38BDF8',
        };
      case 'dawn':
        return {
          countColor: '#78350F',
          labelColor: '#92400E',
          hintColor: '#B45309',
          progressTrack: 'rgba(255, 255, 255, 0.65)',
          progressFill: 'linear-gradient(90deg, #F59E0B, #FBBF24)',
          badgeBg: 'rgba(255, 255, 255, 0.90)',
          badgeBorder: 'rgba(245, 158, 11, 0.40)',
          badgeTextColor: '#92400E',
          badgeIconColor: '#F59E0B',
        };
      case 'day':
      default:
        return {
          countColor: DESIGN_TOKENS.color.brand.turquoise.text,
          labelColor: DESIGN_TOKENS.color.brand.turquoise.text,
          hintColor: DESIGN_TOKENS.color.gray.muted,
          progressTrack: 'rgba(0, 196, 179, 0.15)',
          progressFill: 'linear-gradient(90deg, #00C4B3, #38BDF8)',
          badgeBg: 'rgba(255, 255, 255, 0.90)',
          badgeBorder: 'rgba(0, 196, 179, 0.35)',
          badgeTextColor: DESIGN_TOKENS.color.brand.turquoise.text,
          badgeIconColor: DESIGN_TOKENS.color.brand.turquoise.primary,
        };
    }
  }, [activePeriod]);

  const triggerSip = () => {
    audioService.triggerHaptic('success');
    audioService.playLiquidSip();

    setSipCount((prev) => {
      const next = prev + 1;
      if (next >= 3) {
        setIsFinished(true);
        audioService.triggerHaptic('success');
        audioService.playChimeShockwave();
      }
      return next;
    });
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

  const liquidHeightPercent = Math.max(0, 100 - (sipCount / 3) * 100);

  return (
    <div className={styles.container}>
      {/* 1. Mascot Guidance */}
      <div className={styles.mascotWrapper}>
        <MoocaMascot
          mood={isFinished ? 'celebrating' : 'drinking'}
          size="sm"
          speakingBubble={isFinished ? strings.bubbleDone : strings.bubbleDrinking}
        />
      </div>

      {/* 2. Instruction Badge with Info Tip */}
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
        <span className={styles.pillIconBadge}>
          {isFinished ? (
            <Check size={13} color="#FFFFFF" strokeWidth={2.8} />
          ) : (
            <GlassWater size={13} color={skyTheme.badgeIconColor} strokeWidth={2.4} />
          )}
        </span>

        <span className={styles.instructionText} style={{ color: skyTheme.badgeTextColor }}>
          {isFinished ? strings.bubbleDone : strings.desc}
        </span>

        <span className={styles.helpIconSlot}>
          <Sparkles size={11} color={skyTheme.badgeIconColor} />
        </span>
      </button>

      {/* 3. Main Stage: Interactive Boba Victory Cup */}
      <div className={styles.mainStage}>
        <div
          onClick={handleCupPress}
          className={classNames(styles.cupWrapper, {
            [styles.isDrinking]: isTiltingToDrink,
          })}
          title={strings.tiltPhoneHint}
        >
          {/* Straw */}
          <div className={styles.strawWrapper} />

          {/* Cup Lid & Body */}
          <div className={styles.cupBody}>
            <div className={styles.cupLid} />

            {/* Liquid Fill */}
            <div
              className={styles.liquidFill}
              style={{ height: `${liquidHeightPercent}%` }}
            >
              {/* Glass Highlight Reflection */}
              <div className={styles.glassReflection} />

              {/* Smiling Boba Pearls inside Cup */}
              <div className={styles.bobaPearl} style={{ bottom: 8, left: 14 }}>
                <span className={styles.pearlFace}>•‿•</span>
              </div>
              <div className={styles.bobaPearl} style={{ bottom: 12, left: 40 }}>
                <span className={styles.pearlFace}>◕‿◕</span>
              </div>
              <div className={styles.bobaPearl} style={{ bottom: 8, right: 14 }}>
                <span className={styles.pearlFace}>^‿^</span>
              </div>
              <div className={styles.floatingBubble} style={{ bottom: 38, left: 24 }}>
                <Sparkles size={11} color="#FDE047" fill="#FDE047" />
              </div>
              <div className={styles.floatingBubble} style={{ bottom: 44, right: 26 }}>
                <Heart size={10} color="#F472B6" fill="#F472B6" />
              </div>
            </div>

            {/* Cup Front Smiling Face */}
            <div className={styles.cupFace}>
              <span className={styles.cupEyes}>{isTiltingToDrink ? '˘   ³' : '◕   ◕'}</span>
              <span className={styles.cupMouth}>‿</span>
            </div>
          </div>
        </div>

        {/* Sip Counter Progress */}
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
