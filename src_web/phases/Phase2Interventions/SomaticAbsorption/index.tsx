import React, { useState, useRef, useEffect, useMemo } from 'react';
import classNames from 'classnames';
import { audioService } from '../../../services/audioService';
import { useSky } from '../../../components/DynamicSkyEngine';
import { MoocaMascot } from '../../../components/MoocaMascot';
import { MarshmallowButton } from '../../../design-system/MarshmallowButton';
import { Star, Sun, Hand, Sparkles, Check, X, Volume2 } from 'lucide-react';
import { DESIGN_TOKENS } from '../../../design-system/tokens';
import { getTranslation } from '../../../locales';
import { SOMATIC_CONFIG } from './constants';
import type { SomaticAbsorptionProps } from './types';
import styles from './styles.module.scss';

const CIRCLE_SIZE = 260;

export const SomaticAbsorption: React.FC<SomaticAbsorptionProps> = ({
  onComplete,
  lang = 'th',
  skyPeriod: propSkyPeriod,
}) => {
  const t = getTranslation(lang);
  const strings = t.phases.phase2.somaticAbsorption;
  const { activePeriod } = useSky();
  const skyPeriod = propSkyPeriod || activePeriod || 'day';

  const [rubProgress, setRubProgress] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isRubbing, setIsRubbing] = useState(false);
  const [touchCount, setTouchCount] = useState(0);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [starRotation, setStarRotation] = useState(0);

  const lastHapticTick = useRef(0);
  const lastPos = useRef<{ x: number; y: number } | null>(null);

  // Palettes tailored to each sky period (feathered radial auras)
  const theme = useMemo(() => {
    switch (skyPeriod) {
      case 'dawn':
        return {
          glowCore: '#FFFBEB',
          glowMid: '#FDE68A',
          glowOuter: '#FED7AA',
          outerBorder: 'rgba(245, 158, 11, 0.45)',
          middleBorder: 'rgba(251, 191, 36, 0.58)',
          innerBorder: 'rgba(254, 215, 170, 0.5)',
          circleBg: 'rgba(255, 255, 255, 0.78)',
          starColor: 'rgba(245, 158, 11, 0.45)',
          textColor: '#78350F',
          badgeBg: '#FFFBEB',
          badgeBorder: '#FDE68A',
          badgeText: '#B45309',
          badgeIconColor: '#F59E0B',
          progressFill: '#F59E0B',
          progressTrack: 'rgba(245, 158, 11, 0.18)',
          captionColor: '#78350F',
          dots: ['#FBBF24', '#F59E0B', '#34D399', '#FA8C3D'],
        };
      case 'sunset':
        return {
          glowCore: '#FFFBEB',
          glowMid: '#FDE68A',
          glowOuter: '#FBCFE8',
          outerBorder: 'rgba(251, 146, 60, 0.45)',
          middleBorder: 'rgba(251, 191, 36, 0.65)',
          innerBorder: 'rgba(251, 213, 26, 0.85)',
          circleBg: 'rgba(255, 255, 255, 0.8)',
          starColor: 'rgba(251, 113, 133, 0.45)',
          textColor: '#a81642',
          badgeBg: '#fff2f3',
          badgeBorder: '#FECDD3',
          badgeText: '#BE123C',
          badgeIconColor: '#F43F5E',
          progressFill: '#E11D48',
          progressTrack: 'rgba(255, 190, 212, 0.45)',
          captionColor: '#ffffff',
          dots: ['#FB7185', '#FBBF24', '#F43F5E', '#00C4B3'],
        };
      case 'night':
        return {
          glowCore: '#F0F9FF',
          glowMid: '#BAE6FD',
          glowOuter: '#38BDF8',
          outerBorder: 'rgba(56, 189, 248, 0.45)',
          middleBorder: 'rgba(125, 211, 252, 0.62)',
          innerBorder: 'rgba(186, 230, 253, 0.45)',
          circleBg: 'rgba(15, 23, 42, 0.55)',
          starColor: 'rgba(56, 189, 248, 0.45)',
          textColor: '#F8FAFC',
          badgeBg: 'rgba(30, 41, 59, 0.95)',
          badgeBorder: 'rgba(56, 189, 248, 0.48)',
          badgeText: '#E0F2FE',
          badgeIconColor: '#38BDF8',
          progressFill: '#38BDF8',
          progressTrack: 'rgba(56, 189, 248, 0.22)',
          captionColor: '#E0F2FE',
          dots: ['#38BDF8', '#67E8F9', '#00C4B3', '#93C5FD'],
        };
      case 'day':
      default:
        return {
          glowCore: '#F0FDFA',
          glowMid: '#CCFBF1',
          glowOuter: '#E0F2FE',
          outerBorder: 'rgba(0, 196, 179, 0.45)',
          middleBorder: 'rgba(20, 184, 166, 0.58)',
          innerBorder: 'rgba(94, 234, 212, 0.45)',
          circleBg: 'rgba(255, 255, 255, 0.82)',
          starColor: DESIGN_TOKENS.color.brand.turquoise.primary,
          textColor: DESIGN_TOKENS.color.brand.turquoise.text,
          badgeBg: DESIGN_TOKENS.color.brand.turquoise.light,
          badgeBorder: DESIGN_TOKENS.color.brand.turquoise.primary,
          badgeText: DESIGN_TOKENS.color.brand.turquoise.text,
          badgeIconColor: DESIGN_TOKENS.color.brand.turquoise.primary,
          progressFill: DESIGN_TOKENS.color.brand.turquoise.primary,
          progressTrack: 'rgba(0, 196, 179, 0.2)',
          captionColor: DESIGN_TOKENS.color.brand.turquoise.text,
          dots: ['#00C4B3', '#10B981', '#F59E0B', '#38BDF8'],
        };
    }
  }, [skyPeriod]);

  // Pre-generate calm, symmetrical stardust embers
  const celestialParticles = useMemo(() => {
    const list = [];
    const count = 16;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * 2 * Math.PI;
      const radius = CIRCLE_SIZE * 0.38 + ((i % 3) - 1) * 14;
      list.push({
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        size: 3 + (i % 3) * 1.5,
        colorIndex: i % 4,
        opacity: 0.55 + (i % 3) * 0.15,
      });
    }
    return list;
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isFinished) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsRubbing(true);
    setTouchCount((prev) => prev + 1);
    lastPos.current = { x: e.clientX, y: e.clientY };
    audioService.triggerHaptic('light');
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isRubbing || isFinished || !lastPos.current) return;

    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    const dist = Math.hypot(dx, dy);

    if (dist >= 14) {
      setStarRotation((prev) => (prev + dist * 0.4) % 360);

      const now = Date.now();
      if (now - lastHapticTick.current > 140) {
        audioService.triggerHaptic('light');
        audioService.playFrictionTick(0.6);
        lastHapticTick.current = now;
      }

      setRubProgress((prev) => {
        const next = Math.min(100, prev + dist * 0.22);
        if (next >= 100 && !isFinished) {
          setIsFinished(true);
          audioService.triggerHaptic('success');
          audioService.playChimeShockwave();
        }
        return next;
      });

      lastPos.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handlePointerUp = () => {
    setIsRubbing(false);
    setTouchCount(0);
    lastPos.current = null;
  };

  const playBlessingVoice = () => {
    audioService.playVoiceSanctuary(strings.blessingVoice, lang, 0.84);
  };

  return (
    <div className={styles.container}>
      {/* 1. Mascot Guidance View */}
      <div className={styles.mascotWrapper}>
        <MoocaMascot
          mood={isFinished ? 'celebrating' : 'comforting'}
          size="sm"
          speakingBubble={isFinished ? strings.mascotDone : strings.mascotRubbing}
        />
      </div>

      {/* 2. Instruction Badge with Info Tip Button */}
      <button
        type="button"
        onClick={() => {
          audioService.triggerHaptic('selection');
          setIsGuideOpen(true);
        }}
        className={styles.instructionPill}
        style={{
          backgroundColor: theme.badgeBg,
          borderColor: theme.badgeBorder,
        }}
      >
        <span className={styles.pillIconBadge}>
          {isFinished ? (
            <Check size={13} color="#FFFFFF" strokeWidth={2.8} />
          ) : (
            <Sparkles size={13} color={theme.badgeIconColor} strokeWidth={2.4} />
          )}
        </span>

        <span className={styles.instructionText} style={{ color: theme.badgeText }}>
          {isFinished ? strings.heroFinished : strings.instruction}
        </span>

        <span className={styles.helpIconSlot}>
          <Hand size={12} color={theme.badgeIconColor} />
        </span>
      </button>

      {/* 3. Hero Centerpiece: Celestial Sigil Circle */}
      <div className={styles.circleContainer}>
        {/* Soft Ambient Sun Aura SVG */}
        <div className={styles.sunAuraSvgWrapper}>
          <svg
            width={CIRCLE_SIZE + 96}
            height={CIRCLE_SIZE + 96}
            viewBox={`0 0 ${CIRCLE_SIZE + 96} ${CIRCLE_SIZE + 96}`}
            className={styles.auraSvg}
          >
            <defs>
              <radialGradient id="sigilSunAuraWeb" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={theme.glowCore} stopOpacity="0.45" />
                <stop offset="42%" stopColor={theme.glowMid} stopOpacity="0.22" />
                <stop offset="72%" stopColor={theme.glowOuter} stopOpacity="0.08" />
                <stop offset="100%" stopColor={theme.glowOuter} stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle
              cx={(CIRCLE_SIZE + 96) / 2}
              cy={(CIRCLE_SIZE + 96) / 2}
              r={(CIRCLE_SIZE + 96) / 2}
              fill="url(#sigilSunAuraWeb)"
            />
          </svg>
        </div>

        {/* Outer Circle (Touch / Pointer zone) */}
        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className={classNames(styles.outerCircle, {
            [styles.rubbingActive]: isRubbing,
          })}
          style={{
            width: CIRCLE_SIZE,
            height: CIRCLE_SIZE,
            borderRadius: CIRCLE_SIZE / 2,
            borderColor: theme.outerBorder,
            backgroundColor: theme.circleBg,
          }}
        >
          {/* Middle Dashed Ring */}
          <div
            className={styles.middleCircle}
            style={{
              width: CIRCLE_SIZE * 0.76,
              height: CIRCLE_SIZE * 0.76,
              borderRadius: (CIRCLE_SIZE * 0.76) / 2,
              borderColor: theme.middleBorder,
            }}
          />

          {/* Inner Solid Ring */}
          <div
            className={styles.innerCircle}
            style={{
              width: CIRCLE_SIZE * 0.52,
              height: CIRCLE_SIZE * 0.52,
              borderRadius: (CIRCLE_SIZE * 0.52) / 2,
              borderColor: theme.innerBorder,
            }}
          />

          {/* Constellation Stardust Embers */}
          {celestialParticles.map((p, idx) => (
            <div
              key={idx}
              className={styles.particle}
              style={{
                left: CIRCLE_SIZE / 2 + p.x - p.size / 2,
                top: CIRCLE_SIZE / 2 + p.y - p.size / 2,
                width: p.size,
                height: p.size,
                borderRadius: p.size / 2,
                backgroundColor: theme.dots[p.colorIndex],
                opacity: p.opacity,
                boxShadow: `0 0 4px ${theme.dots[p.colorIndex]}`,
              }}
            />
          ))}

          {/* Center Content: Sun for day, Sparkles for sunset, Star for night */}
          <div className={styles.centerContent}>
            <div
              className={styles.starBackground}
              style={{ transform: `rotate(${starRotation}deg)` }}
            >
              {skyPeriod === 'day' ? (
                <Sun size={76} color={theme.starColor} strokeWidth={1.8} />
              ) : skyPeriod === 'sunset' ? (
                <Sparkles size={74} color={theme.starColor} strokeWidth={1.8} />
              ) : (
                <Star size={76} color={theme.starColor} strokeWidth={1.8} />
              )}
            </div>

            <span className={styles.percentNumber} style={{ color: theme.textColor }}>
              {Math.round(rubProgress)}%
            </span>
          </div>
        </div>
      </div>

      {/* 4. Bottom Progress Bar OR Proceed Button */}
      {isFinished ? (
        <div className={styles.actionSection}>
          <MarshmallowButton
            variant="primary"
            size="lg"
            onPress={onComplete}
            icon={<Check size={18} color="#FFFFFF" strokeWidth={2.4} />}
            title={strings.proceedBtn}
          />
        </div>
      ) : (
        <div className={styles.bottomSection}>
          <div
            className={styles.progressBarTrack}
            style={{ backgroundColor: theme.progressTrack }}
          >
            <div
              className={styles.progressBarFill}
              style={{
                width: `${rubProgress}%`,
                backgroundColor: theme.progressFill,
              }}
            />
          </div>

          <p className={styles.bottomCaption} style={{ color: theme.captionColor }}>
            {strings.caption}
          </p>
        </div>
      )}

      {/* 5. Educational Coaching Modal */}
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
              <Hand size={32} color="#00C4B3" strokeWidth={2.4} />
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

export default SomaticAbsorption;
