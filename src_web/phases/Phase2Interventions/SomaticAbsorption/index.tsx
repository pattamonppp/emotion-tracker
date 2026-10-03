import React, { useEffect, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';
import {
  Check,
  Hand,
  HelpCircle,
  Star,
  Sun,
  Sparkles,
  X,
} from 'lucide-react';

import { audioService } from '../../../services/audioService';
import { MoocaMascot } from '../../../components/MoocaMascot';
import { MarshmallowButton } from '../../../design-system/MarshmallowButton';
import { DESIGN_TOKENS } from '../../../design-system/tokens';
import { getTranslation } from '../../../locales';

import type { SomaticAbsorptionProps } from './types';
import styles from './styles.module.scss';
import { useSkyTheme } from '@/hooks/useSkyTheme';

const MAX_CIRCLE_SIZE = 268;
const CIRCLE_WIDTH_RATIO = 0.72;

const getCircleSize = () =>
  Math.min(window.innerWidth * CIRCLE_WIDTH_RATIO, MAX_CIRCLE_SIZE);

export const SomaticAbsorption: React.FC<SomaticAbsorptionProps> = ({
  onComplete,
  lang = 'th',
  skyPeriod: propSkyPeriod,
}) => {
  const t = getTranslation(lang);
  const strings = t.phases.phase2.somaticAbsorption;
  const theme = useSkyTheme();
  const skyPeriod = propSkyPeriod || theme.period;

  const [circleSize, setCircleSize] = useState(getCircleSize);
  const [rubProgress, setRubProgress] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isRubbing, setIsRubbing] = useState(false);
  const [touchCount, setTouchCount] = useState(0);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  const lastHapticTick = useRef(0);

  const pointers = useRef<
    Map<number, { x: number; y: number }>
  >(new Map());

  useEffect(() => {
    const handleResize = () => {
      setCircleSize(getCircleSize());
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    return () => {
      pointers.current.clear();
    };
  }, []);


  const advanceProgress = (amount: number) => {
    if (isFinished) {
      return;
    }

    setRubProgress((previous) => {
      const next = Math.min(100, previous + amount);

      const now = Date.now();

      if (now - lastHapticTick.current > 140) {
        lastHapticTick.current = now;
        audioService.playFrictionTick(next / 100);
      }

      if (next >= 100) {
        setIsFinished(true);
        audioService.triggerHaptic('success');
        audioService.playChimeShockwave();
      }

      return next;
    });
  };

  const handlePointerDown = (
    event: React.PointerEvent<HTMLDivElement>
  ) => {
    const rect = event.currentTarget.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    pointers.current.set(event.pointerId, {
      x,
      y,
    });

    const isMouse = event.pointerType === 'mouse';
    const touches = isMouse ? 1 : pointers.current.size;

    setIsRubbing(true);
    setTouchCount(touches);

    // Desktop mouse: allow normal dragging.
    // Touch devices: require 2 fingers, matching the React Native behavior.
    if (isMouse || touches >= 2) {
      advanceProgress(0.35);
    }
  };

  const handlePointerMove = (
    event: React.PointerEvent<HTMLDivElement>
  ) => {
    const previous = pointers.current.get(event.pointerId);

    if (!previous) {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const dx = x - previous.x;
    const dy = y - previous.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    pointers.current.set(event.pointerId, {
      x,
      y,
    });

    const isMouse = event.pointerType === 'mouse';
    const touches = isMouse ? 1 : pointers.current.size;

    setTouchCount(touches);

    if (distance > 4 && (isMouse || touches >= 2)) {
      advanceProgress(0.32);
    }
  };

  const handlePointerEnd = (
    event: React.PointerEvent<HTMLDivElement>
  ) => {
    pointers.current.delete(event.pointerId);

    const isMouse = event.pointerType === 'mouse';

    if (isMouse) {
      setTouchCount(0);
      setIsRubbing(false);
      return;
    }

    const touches = pointers.current.size;

    setTouchCount(touches);
    setIsRubbing(touches > 0);
  };

  const celestialParticles = useMemo(() => {
    const seedAngles = [
      0.18,
      0.42,
      0.68,
      0.94,
      1.22,
      1.48,
      1.74,
      2.02,
      2.28,
      2.54,
      2.82,
      3.08,
      3.34,
      3.62,
      3.88,
      4.14,
      4.42,
      4.68,
      4.94,
      5.22,
      5.48,
      5.74,
      6.02,
      6.24,
      0.55,
      1.35,
      2.15,
      2.95,
      3.75,
      4.55,
      5.35,
      6.15,
    ];

    const radii = [
      48,
      86,
      62,
      104,
      54,
      92,
      70,
      108,
      44,
      82,
      66,
      102,
      50,
      88,
      74,
      112,
      46,
      84,
      58,
      98,
      52,
      90,
      68,
      106,
      76,
      56,
      84,
      64,
      80,
      58,
      86,
      66,
    ];

    return seedAngles.map((angle, index) => ({
      x: Math.cos(angle) * radii[index],
      y: Math.sin(angle) * radii[index],
      size:
        index % 4 === 0
          ? 4.5
          : index % 3 === 0
            ? 3.5
            : 2.5,
      color: theme.dots[index % 4],
      opacity: 0.6 + ((index * 7) % 35) / 100,
    }));
  }, [theme.dots]);

  const percent = Math.round(rubProgress);

  return (
    <div className={styles.container}>
      <div className={styles.mascotWrapper}>
        <MoocaMascot
          mood={
            isFinished
              ? 'celebrating'
              : isRubbing
                ? 'rubbing'
                : 'comforting'
          }
          size="sm"
          speakingBubble={
            isFinished
              ? strings.mascotDone
              : isRubbing
                ? strings.mascotRubbing
                : strings.mascotIdle
          }
        />
      </div>

      <button
        type="button"
        className={styles.instructionPill}
        style={{
          backgroundColor: theme.badgeBg,
          borderColor: theme.badgeBorder,
        }}
        onClick={() => {
          audioService.triggerHaptic('selection');
          setIsGuideOpen(true);
        }}
      >
        {touchCount >= 2 ? (
          <Sparkles
            size={14}
            color="#10B981"
            strokeWidth={2.4}
          />
        ) : (
          <Hand
            size={14}
            color={theme.badgeIconColor}
            strokeWidth={2.4}
          />
        )}

        <span
          className={styles.instructionPillText}
          style={{
            color: theme.badgeText,
          }}
        >
          {touchCount >= 2
            ? strings.fingerActive2
            : touchCount === 1
              ? strings.fingerWarning1
              : strings.fingerPrompt}
        </span>

        <HelpCircle
          size={13}
          color={theme.badgeIconColor}
          strokeWidth={2}
        />
      </button>

      <div className={styles.wheelSection}>
        <div
          className={classNames(styles.sigilAuraHalo, {
            [styles.rubbing]: isRubbing,
          })}
          style={{
            width: circleSize + 96,
            height: circleSize + 96,
            background: `radial-gradient(
              circle,
              ${theme.glowCore} 0%,
              ${theme.glowMid} 42%,
              ${theme.glowOuter} 72%,
              transparent 100%
            )`,
          }}
        />

        <div
          className={classNames(styles.outerCircle, {
            [styles.rubbing]: isRubbing,
            [styles.finished]: isFinished,
          })}
          style={{
            width: circleSize,
            height: circleSize,
            borderRadius: circleSize / 2,
            borderColor: theme.outerBorder,
            backgroundColor: theme.circleBg,
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerEnd}
          onPointerCancel={handlePointerEnd}
        >
          <div
            className={styles.middleCircle}
            style={{
              width: circleSize * 0.76,
              height: circleSize * 0.76,
              borderRadius: (circleSize * 0.76) / 2,
              borderColor: theme.middleBorder,
            }}
          />

          <div
            className={styles.innerCircle}
            style={{
              width: circleSize * 0.52,
              height: circleSize * 0.52,
              borderRadius: (circleSize * 0.52) / 2,
              borderColor: theme.innerBorder,
            }}
          />

          {celestialParticles.map((particle, index) => (
            <span
              key={index}
              className={styles.particle}
              style={{
                left:
                  circleSize / 2 +
                  particle.x -
                  particle.size / 2,
                top:
                  circleSize / 2 +
                  particle.y -
                  particle.size / 2,
                width: particle.size,
                height: particle.size,
                borderRadius: particle.size / 2,
                backgroundColor: particle.color as string,
                opacity: particle.opacity,
                boxShadow: `0 0 3px ${particle.color}`,
              }}
            />
          ))}

          <div className={styles.centerContent}>
            <div className={styles.starBackground}>
              {skyPeriod === 'day' ? (
                <Sun
                  size={76}
                  color={theme.starColor}
                  strokeWidth={2}
                />
              ) : skyPeriod === 'sunset' ? (
                <Sparkles
                  size={74}
                  color={theme.starColor}
                  strokeWidth={2}
                />
              ) : (
                <Star
                  size={76}
                  color={theme.starColor}
                  strokeWidth={2}
                />
              )}
            </div>

            <span
              className={styles.percentNumber}
              style={{
                color: theme.textColor,
              }}
            >
              {percent}%
            </span>
          </div>
        </div>
      </div>

      {isFinished ? (
        <div className={styles.actionSection}>
          <MarshmallowButton
            variant="primary"
            size="lg"
            onClick={onComplete}
            icon={
              <Check
                size={18}
                color="#FFFFFF"
                strokeWidth={2.4}
              />
            }
            title={strings.proceedBtn}
          />
        </div>
      ) : (
        <div className={styles.bottomSection}>
          <div
            className={styles.progressBarTrack}
            style={{
              backgroundColor: theme.progressTrack,
            }}
          >
            <div
              className={styles.progressBarFill}
              style={{
                width: `${rubProgress}%`,
                backgroundColor: theme.progressFill,
              }}
            />
          </div>

          <span
            className={styles.bottomCaption}
            style={{
              color: theme.captionColor,
            }}
          >
            {strings.caption}
          </span>
        </div>
      )}

      {isGuideOpen && (
        <div
          className={styles.modalBackdrop}
          onClick={() => setIsGuideOpen(false)}
        >
          <div
            className={styles.modalCard}
            role="dialog"
            aria-modal="true"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className={styles.modalCloseBtn}
              onClick={() => setIsGuideOpen(false)}
            >
              <X
                size={18}
                color="#64748B"
              />
            </button>

            <div className={styles.guideIconWrapper}>
              <Hand
                size={32}
                color={
                  DESIGN_TOKENS.color.brand.turquoise.primary
                }
                strokeWidth={2.4}
              />
            </div>

            <h2 className={styles.guideTitle}>
              {strings.guideTitle}
            </h2>

            <div className={styles.guideStepsBox}>
              <div className={styles.guideStepRow}>
                <div className={styles.stepNumBadge}>
                  <span className={styles.stepNumText}>
                    1
                  </span>
                </div>

                <span className={styles.guideStepText}>
                  {strings.guideStep1Desc}
                </span>
              </div>

              <div className={styles.guideStepRow}>
                <div className={styles.stepNumBadge}>
                  <span className={styles.stepNumText}>
                    2
                  </span>
                </div>

                <span className={styles.guideStepText}>
                  {strings.guideStep2Desc}
                </span>
              </div>

              <div className={styles.guideStepRow}>
                <div className={styles.stepNumBadge}>
                  <span className={styles.stepNumText}>
                    3
                  </span>
                </div>

                <span className={styles.guideStepText}>
                  {strings.guideStep3Desc}
                </span>
              </div>
            </div>

            <button
              type="button"
              className={styles.guideConfirmBtn}
              onClick={() => {
                audioService.triggerHaptic('success');
                setIsGuideOpen(false);
              }}
            >
              <Check
                size={16}
                color="#FFFFFF"
                strokeWidth={2.6}
              />

              <span className={styles.guideConfirmText}>
                {strings.guideConfirm}
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};