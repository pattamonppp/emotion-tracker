import React, { useState, useEffect, useMemo } from 'react';
import classNames from 'classnames';
import { audioService } from '../../../services/audioService';
import { MarshmallowButton } from '../../../design-system/MarshmallowButton';
import { MoocaMascot } from '../../../components/MoocaMascot';
import { useSky } from '../../../components/DynamicSkyEngine';
import { Zap, Activity, ArrowRight, Sparkles, Star, CheckCircle2 } from 'lucide-react';
import { DESIGN_TOKENS } from '../../../design-system/tokens';
import { getTranslation } from '../../../locales';
import { KINETIC_SHAKER_CONFIG } from './constants';
import type { KineticShakerProps } from './types';
import styles from './styles.module.scss';

export const KineticShaker: React.FC<KineticShakerProps> = ({
  onComplete,
  lang,
  activityType = 'shake',
}) => {
  const t = getTranslation(lang);
  const strings = t.phases.phase2.kineticShaker;
  const { activePeriod } = useSky();
  const [mode, setMode] = useState<'shake' | 'bounce'>(activityType === 'jump' ? 'bounce' : 'shake');
  const [shakesLeft, setShakesLeft] = useState<number>(KINETIC_SHAKER_CONFIG.REQUIRED_SHAKES);
  const [bouncesLeft, setBouncesLeft] = useState<number>(KINETIC_SHAKER_CONFIG.REQUIRED_JUMPS);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [isShakingAnim, setIsShakingAnim] = useState<boolean>(false);

  useEffect(() => {
    setMode(activityType === 'jump' ? 'bounce' : 'shake');
  }, [activityType]);

  const currentCount = mode === 'shake' ? shakesLeft : bouncesLeft;
  const maxCount = mode === 'shake' ? KINETIC_SHAKER_CONFIG.REQUIRED_SHAKES : KINETIC_SHAKER_CONFIG.REQUIRED_JUMPS;
  const progressPercent = Math.round(((maxCount - currentCount) / maxCount) * 100);
  const fluidHeightPercent = isFinished ? 0 : Math.round((currentCount / maxCount) * 100);

  const skyTheme = useMemo(() => {
    switch (activePeriod) {
      case 'sunset':
        return {
          countColor: '#ffffff',
          labelColor: '#fffafb',
          hintColor: '#5f0019',
          progressTrack: 'rgba(255, 255, 255, 0.45)',
          progressFill: 'linear-gradient(90deg, #ffa8bb, #fff6b4)',
        };
      case 'night':
        return {
          countColor: '#F8FAFC',
          labelColor: '#E2E8F0',
          hintColor: '#94A3B8',
          progressTrack: 'rgba(255, 255, 255, 0.25)',
          progressFill: 'linear-gradient(90deg, #38BDF8, #818CF8)',
        };
      case 'dawn':
        return {
          countColor: '#78350F',
          labelColor: '#92400E',
          hintColor: '#B45309',
          progressTrack: 'rgba(255, 255, 255, 0.65)',
          progressFill: 'linear-gradient(90deg, #F59E0B, #FBBF24)',
        };
      case 'day':
      default:
        return {
          countColor: DESIGN_TOKENS.color.brand.turquoise.text,
          labelColor: DESIGN_TOKENS.color.brand.turquoise.text,
          hintColor: DESIGN_TOKENS.color.gray.muted,
          progressTrack: 'rgba(0, 196, 179, 0.15)',
          progressFill: 'linear-gradient(90deg, #00C4B3, #38BDF8)',
        };
    }
  }, [activePeriod]);

  const handleFlaskInteraction = () => {
    if (isFinished) return;

    setIsShakingAnim(true);
    setTimeout(() => setIsShakingAnim(false), 240);

    if (mode === 'shake') {
      const remaining = Math.max(0, shakesLeft - 1);
      setShakesLeft(remaining);
      audioService.playShakerClick(remaining);

      if (remaining === 0) {
        setIsFinished(true);
        audioService.triggerHaptic('success');
        audioService.playChimeShockwave();
      }
    } else {
      const remaining = Math.max(0, bouncesLeft - 1);
      setBouncesLeft(remaining);
      audioService.playShakerClick(remaining);

      if (remaining === 0) {
        setIsFinished(true);
        audioService.triggerHaptic('success');
        audioService.playChimeShockwave();
      }
    }
  };

  return (
    <div className={styles.container}>
      {/* 1. Mascot View - Standardized Height */}
      <div
        className={classNames(styles.mascotWrapper, {
          [styles.isShaking]: isShakingAnim && mode === 'shake',
          [styles.isBouncing]: isShakingAnim && mode === 'bounce',
        })}
      >
        <MoocaMascot
          mood={isFinished ? 'celebrating' : 'shaking'}
          size="sm"
          speakingBubble={
            isFinished
              ? mode === 'shake'
                ? strings.bubbleDone
                : strings.bubbleDoneBounce
              : mode === 'shake'
                ? strings.bubbleShake
                : strings.bubbleBounce
          }
        />
      </div>

      {/* 2. Hero Centerpiece: Centered Fantasy Apothecary Tension Vial */}
      <div className={styles.centerStage}>
        {/* Soft Ambient Radiating Halo behind the centered vial */}
        <div className={styles.capsuleAuraHalo} />

        <div
          onClick={handleFlaskInteraction}
          className={classNames(styles.flaskWrapper, {
            [styles.flaskShaking]: isShakingAnim,
          })}
          title={mode === 'shake' ? strings.captionShake : strings.captionBounce}
        >
          {/* Top Wooden Cork Cap with Golden Star Seal */}
          <div className={styles.capsuleCorkTop}>
            <Star size={10} color="#FEF08A" fill="#FDE047" />
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
              style={{ height: `${fluidHeightPercent}%` }}
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
                <Star size={24} color="#F59E0B" fill="#FDE047" />
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
              : mode === 'shake'
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
            icon={<CheckCircle2 size={16} color="#FFFFFF" />}
            title={strings.proceedBtn}
          />
        ) : (
          <span className={styles.organicSensorHint} style={{ color: skyTheme.hintColor }}>
            {mode === 'shake' ? strings.descShake : strings.descBounce}
          </span>
        )}
      </div>
    </div>
  );
};

export default KineticShaker;
