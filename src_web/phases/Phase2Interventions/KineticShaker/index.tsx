import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import classNames from 'classnames';
import { audioService, HAPTIC_STYLE } from '../../../services/audioService';
import { MARSHMALLOW_SIZE, MARSHMALLOW_VARIANT, MarshmallowButton } from '../../../design-system/MarshmallowButton';
import { MOOCA_MOOD, MoocaMascot } from '../../../components/MoocaMascot';
import { Sparkles, Star, CheckCircle2, Check, X } from 'lucide-react';
import { renderBilingual } from '@/components/BilingualText';
import { getTranslation } from '../../../locales';
import { ACTIVITY_TYPE } from '../../../types';
import { KINETIC_SHAKER_CONFIG } from './constants';
import type { KineticShakerProps } from './types';
import styles from './styles.module.scss';
import { useSkyTheme } from '@/hooks/useSkyTheme';

export const KineticShaker: React.FC<KineticShakerProps> = ({
  onComplete,
  lang,
  activityType = ACTIVITY_TYPE.SHAKE,
}) => {
  const t = getTranslation(lang);
  const strings = t.phases.phase2.kineticShaker;
  const [mode, setMode] = useState<typeof ACTIVITY_TYPE.SHAKE | typeof ACTIVITY_TYPE.BOUNCE>(
    activityType === ACTIVITY_TYPE.JUMP ? ACTIVITY_TYPE.BOUNCE : ACTIVITY_TYPE.SHAKE
  );
  const [shakesLeft, setShakesLeft] = useState<number>(KINETIC_SHAKER_CONFIG.REQUIRED_SHAKES);
  const [bouncesLeft, setBouncesLeft] = useState<number>(KINETIC_SHAKER_CONFIG.REQUIRED_JUMPS);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [isShakingAnim, setIsShakingAnim] = useState<boolean>(false);
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(true);

  useEffect(() => {
    setMode(activityType === ACTIVITY_TYPE.JUMP ? ACTIVITY_TYPE.BOUNCE : ACTIVITY_TYPE.SHAKE);
  }, [activityType]);

  const currentCount = mode === ACTIVITY_TYPE.SHAKE ? shakesLeft : bouncesLeft;
  const maxCount = mode === ACTIVITY_TYPE.SHAKE ? KINETIC_SHAKER_CONFIG.REQUIRED_SHAKES : KINETIC_SHAKER_CONFIG.REQUIRED_JUMPS;
  const progressPercent = Math.round(((maxCount - currentCount) / maxCount) * 100);
  const fluidHeightPercent = isFinished ? 0 : Math.round((currentCount / maxCount) * 100);

  const skyTheme = useSkyTheme();

  const getFluidGradient = () => {
    if (isFinished) {
      return 'linear-gradient(180deg, #8AD866 0%, #00C4B3 100%)';
    }
    return `linear-gradient(180deg, ${skyTheme.fluidColors.join(', ')})`;
  };

  const handleFlaskInteraction = () => {
    if (isFinished) return;

    setIsShakingAnim(true);
    setTimeout(() => setIsShakingAnim(false), 240);

    if (mode === ACTIVITY_TYPE.SHAKE) {
      const remaining = Math.max(0, shakesLeft - 1);
      setShakesLeft(remaining);
      audioService.playShakerClick(remaining);

      if (remaining === 0) {
        setIsFinished(true);
        audioService.triggerHaptic(HAPTIC_STYLE.SUCCESS);
        audioService.playChimeShockwave();
      }
    } else {
      const remaining = Math.max(0, bouncesLeft - 1);
      setBouncesLeft(remaining);
      audioService.playShakerClick(remaining);

      if (remaining === 0) {
        setIsFinished(true);
        audioService.triggerHaptic(HAPTIC_STYLE.SUCCESS);
        audioService.playChimeShockwave();
      }
    }
  };

  return (
    <div className={styles.container}>
      {/* 1. Mascot View - Standardized Height */}
      <div
        className={classNames(styles.mascotWrapper, {
          [styles.isShaking]: isShakingAnim && mode === ACTIVITY_TYPE.SHAKE,
          [styles.isBouncing]: isShakingAnim && mode === ACTIVITY_TYPE.BOUNCE,
        })}
      >
        <MoocaMascot
          mood={isFinished ? MOOCA_MOOD.CELEBRATING : MOOCA_MOOD.SHAKING}
          size="sm"
          speakingBubble={
            isFinished
              ? mode === ACTIVITY_TYPE.SHAKE
                ? strings.bubbleDone
                : strings.bubbleDoneBounce
              : mode === ACTIVITY_TYPE.SHAKE
                ? strings.bubbleShake
                : strings.bubbleBounce
          }
        />
      </div>

      {/* Guide Instruction Pill */}
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
        <Sparkles size={14} color={skyTheme.badgeIconColor} />
        <span
          className={styles.instructionPillText}
          style={{ color: skyTheme.badgeTextColor }}
        >
          {renderBilingual(strings.guideTitle)}
        </span>
      </button>

      {/* 2. Hero Centerpiece: Centered Fantasy Apothecary Tension Vial */}
      <div className={styles.centerStage}>
        {/* Soft Ambient Radiating Halo behind the centered vial */}
        <div className={styles.capsuleAuraHalo} />

        <div
          onClick={handleFlaskInteraction}
          className={classNames(styles.flaskWrapper, {
            [styles.flaskShaking]: isShakingAnim,
          })}
          title={mode === ACTIVITY_TYPE.SHAKE ? strings.captionShake : strings.captionBounce}
        >
          {/* Top Wooden Cork Cap with Golden Star Seal */}
          <div className={styles.capsuleCorkTop}>
            <Star size={10} color="#F8E4B3" fill="#F9A000" />
          </div>

          <div className={styles.flaskBody}>
            {/* Specular Highlight Curved Streak */}
            <div className={styles.capsuleGlassReflection} />

            {/* Ancient Alchemical Scale Ticks */}
            <div className={styles.capsuleTicks}>
              <div className={styles.capsuleTickLine} style={{ top: '25%' }} />
              <div className={styles.capsuleTickLine} style={{ top: '50%' }} />
              <div className={styles.capsuleTickLine} style={{ top: '75%' }} />
            </div>

            {/* Liquid Fill */}
            <div
              className={styles.fluidFill}
              style={{
                height: `${fluidHeightPercent}%`,
                background: getFluidGradient(),
              }}
            />

            {/* Bubbling Energy Particles */}
            {!isFinished && (
              <>
                <div className={styles.energyBubble} style={{ bottom: 10, left: 24, width: 8, height: 8 }} />
                <div className={styles.energyBubble} style={{ bottom: 20, right: 30, width: 12, height: 12, animationDelay: '0.5s' }} />
                <div className={styles.energyBubble} style={{ bottom: 14, left: 55, width: 10, height: 10, animationDelay: '1.0s' }} />
              </>
            )}

            {/* Floating Magical Starlight Sparkles Inside Potion */}
            <div className={styles.fluidStarParticle1}>
              <Sparkles size={11} color="rgba(255,255,255,0.9)" />
            </div>
            <div className={styles.fluidStarParticle2}>
              <Star size={9} color="rgba(255,255,255,0.85)" fill="#FFFFFF" />
            </div>

            {/* Center Star Emblem */}
            <div className={styles.capsuleCenterIcon}>
              {isFinished ? (
                <Star size={24} color="#F9A000" fill="#F8E4B3" />
              ) : (
                <Sparkles size={20} color="rgba(255,255,255,0.95)" />
              )}
            </div>
          </div>
        </div>

        {/* 3. Organic Count Display (NO block, NO badge!) */}
        <div className={styles.organicCountSection}>
          <span className={styles.organicCountNumber} style={{ color: skyTheme.countColor }}>
            {isFinished ? 0 : currentCount}
          </span>
          <span className={styles.organicCountLabel} style={{ color: skyTheme.labelColor }}>
            {isFinished
              ? strings.released
              : mode === ACTIVITY_TYPE.SHAKE
                ? `${currentCount} ${strings.shakesLeft}`
                : `${currentCount} ${strings.bouncesLeft}`}
          </span>

          {/* Slim glowing 4px progress line */}
          <div
            className={styles.organicProgressTrack}
            style={{ backgroundColor: skyTheme.progressTrack }}
          >
            <div
              className={styles.organicProgressFill}
              style={{
                width: `${progressPercent}%`,
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
            icon={<Check size={16} color="#FFFFFF" strokeWidth={2.4} />}
            title={strings.proceedBtn}
          />
        ) : (
          <span className={styles.organicSensorHint} style={{ color: skyTheme.hintColor }}>
            {mode === ACTIVITY_TYPE.SHAKE ? strings.descShake : strings.descBounce}
          </span>
        )}
      </div>

      {/* 5. Instruction Modal */}
      {isGuideOpen && createPortal(
        <div className={styles.modalBackdrop}>
          <div className={styles.modalCard}>
            <div className={styles.guideContainer}>
              <button
                type="button"
                onClick={() => setIsGuideOpen(false)}
                className={styles.modalCloseBtn}
              >
                <X size={18} color="#637b91" />
              </button>

              <div className={styles.guideIconWrapper}>
                <Sparkles size={28} color="#00C4B3" strokeWidth={2.4} />
              </div>

              <h3 className={styles.guideTitle}>{renderBilingual(strings.guideTitle)}</h3>

              <div className={styles.guideStepsBox}>
                <div className={styles.guideStepRow}>
                  <div className={styles.stepNumBadge}>
                    <span className={styles.stepNumText}>1</span>
                  </div>
                  <span className={styles.guideStepText}>{renderBilingual(strings.guideStep1Desc)}</span>
                </div>

                <div className={styles.guideStepRow}>
                  <div className={styles.stepNumBadge}>
                    <span className={styles.stepNumText}>2</span>
                  </div>
                  <span className={styles.guideStepText}>{renderBilingual(strings.guideStep2Desc)}</span>
                </div>
              </div>

              <MarshmallowButton
                variant={MARSHMALLOW_VARIANT.PRIMARY}
                size={MARSHMALLOW_SIZE.MD}
                title={strings.guideConfirm}
                icon={<Check size={16} color="#FFFFFF" strokeWidth={2.6} />}
                onPress={() => {
                  audioService.triggerHaptic(HAPTIC_STYLE.SUCCESS);
                  setIsGuideOpen(false);
                }}
                style={{ width: '100%' }}
              />
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default KineticShaker;
