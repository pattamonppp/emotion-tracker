import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import {
  Check,
  Activity,
  CircleDashed,
  Anchor,
  Snowflake,
  BatteryLow,
  Wind,
  Brain,
  CloudRain,
  Shuffle,
  Sparkles,
  ArrowDown,
  PenLine,
  Plus,
  Heart,
} from 'lucide-react';

import { EMOTION_TAG_ID, EmotionTag, Language } from '../../../../types';
import { audioService, HAPTIC_STYLE } from '../../../../services/audioService';
import { getTranslation, getTagLabel } from '../../../../locales';

import styles from './styles.module.scss';

export const getEmotionIcon = (
  tagId: string,
  color: string,
  size = 18,
) => {
  const props = {
    size,
    color,
    strokeWidth: 2.4,
  };

  if (tagId.startsWith(EMOTION_TAG_ID.CUSTOM)) {
    return <Heart {...props} />;
  }

  switch (tagId) {
    case EMOTION_TAG_ID.SHAKING:
      return <Activity {...props} />;
    case EMOTION_TAG_ID.FORGETTING:
      return <CircleDashed {...props} />;
    case EMOTION_TAG_ID.PRESSURE:
      return <Anchor {...props} />;
    case EMOTION_TAG_ID.FREEZE:
      return <Snowflake {...props} />;
    case EMOTION_TAG_ID.BURNOUT:
      return <BatteryLow {...props} />;
    case EMOTION_TAG_ID.ANXIOUS:
      return <Wind {...props} />;
    case EMOTION_TAG_ID.OVERTHINKING:
      return <Brain {...props} />;
    case EMOTION_TAG_ID.LONELY:
      return <CloudRain {...props} />;
    case EMOTION_TAG_ID.CONFUSED:
      return <Shuffle {...props} />;
    case EMOTION_TAG_ID.CUSTOM:
      return <Heart {...props} />;
    default:
      return <Sparkles {...props} />;
  }
};

interface FloatingEmotionCloudProps {
  tag: EmotionTag;
  index: number;
  isSelected: boolean;
  onToggle: (id: EmotionTag['id']) => void;
  onDropIntoJar?: (id: EmotionTag['id']) => void;
  lang: Language;
  isJarFull?: boolean;
  customText?: string;
  onEditCustom?: () => void;
  isAddButton?: boolean;
  jarRef?: React.RefObject<HTMLDivElement | null>;
}

const FLOAT_CONFIGS = [
  { duration: 2800, amplitude: -4.5, delay: 0 },
  { duration: 3400, amplitude: -6, delay: 250 },
  { duration: 2900, amplitude: -5, delay: 500 },
  { duration: 3800, amplitude: -6.5, delay: 150 },
  { duration: 3100, amplitude: -5, delay: 350 },
];

export const FloatingEmotionCloud: React.FC<
  FloatingEmotionCloudProps
> = ({
  tag,
  index,
  isSelected,
  onToggle,
  onDropIntoJar,
  lang,
  isJarFull = false,
  customText,
  onEditCustom,
  isAddButton = false,
  jarRef,
}) => {
    const isCustom =
      tag.id.startsWith(EMOTION_TAG_ID.CUSTOM) || Boolean(customText);

    const t = getTranslation(lang);
    const p1 = t.phases.phase1;

    const floatConfig =
      FLOAT_CONFIGS[index % FLOAT_CONFIGS.length];

    const [dragOffset, setDragOffset] = useState({
      x: 0,
      y: 0,
    });

    const [isDragging, setIsDragging] = useState(false);
    const [isFlying, setIsFlying] = useState(false);
    const [isPressed, setIsPressed] = useState(false);
    const [isOverJar, setIsOverJar] = useState(false);

    const pointerId = useRef<number | null>(null);

    const startPoint = useRef({
      x: 0,
      y: 0,
    });

    /*
     * The original RN version starts the floating animation
     * after a per-cloud delay.
     *
     * CSS handles the actual animation.
     */
    const [floatReady, setFloatReady] = useState(
      floatConfig.delay === 0,
    );

    useEffect(() => {
      if (floatConfig.delay === 0) {
        setFloatReady(true);
        return;
      }

      const timer = window.setTimeout(() => {
        setFloatReady(true);
      }, floatConfig.delay);

      return () => {
        window.clearTimeout(timer);
      };
    }, [floatConfig.delay]);

    const resetDrag = () => {
      setIsDragging(false);
      setIsOverJar(false);
      setDragOffset({
        x: 0,
        y: 0,
      });
    };

    const isPointerOverJar = (
      clientX: number,
      clientY: number,
    ) => {
      if (!jarRef?.current) {
        return false;
      }

      const rect = jarRef.current.getBoundingClientRect();

      const padding = 30;

      return (
        clientX >= rect.left - padding &&
        clientX <= rect.right + padding &&
        clientY >= rect.top - padding &&
        clientY <= rect.bottom + padding
      );
    };

    const handleFlyIntoJar = () => {
      if (isFlying) return;

      /*
       * Update selected state immediately.
       * This is important because the parent removes the
       * cloud from the sky once it becomes selected.
       */
      if (onDropIntoJar) {
        onDropIntoJar(tag.id);
      } else {
        onToggle(tag.id);
      }

      audioService.triggerHaptic(HAPTIC_STYLE.SUCCESS);
      audioService.playJarDrop();

      setIsFlying(true);
      setIsDragging(false);
      setIsOverJar(false);

      window.setTimeout(() => {
        setDragOffset({
          x: 0,
          y: 0,
        });

        setIsFlying(false);
      }, 280);
    };

    const handleTap = () => {
      audioService.triggerHaptic(HAPTIC_STYLE.MEDIUM);

      setIsPressed(true);

      window.setTimeout(() => {
        setIsPressed(false);
      }, 70);

      if (!isSelected) {
        handleFlyIntoJar();
      } else {
        onToggle(tag.id);
      }
    };

    const handlePointerDown = (
      event: React.PointerEvent<HTMLDivElement>,
    ) => {
      if (isFlying || (isJarFull && !isSelected)) return;

      pointerId.current = event.pointerId;

      startPoint.current = {
        x: event.clientX,
        y: event.clientY,
      };

      event.currentTarget.setPointerCapture(
        event.pointerId,
      );

      setIsDragging(true);

      audioService.triggerHaptic(HAPTIC_STYLE.LIGHT);
    };

    const handlePointerMove = (
      event: React.PointerEvent<HTMLDivElement>,
    ) => {
      if (
        !isDragging ||
        pointerId.current !== event.pointerId ||
        isFlying
      ) {
        return;
      }

      const dx =
        event.clientX - startPoint.current.x;

      const dy =
        event.clientY - startPoint.current.y;

      setDragOffset({
        x: dx,
        y: dy,
      });

      setIsOverJar(
        isPointerOverJar(
          event.clientX,
          event.clientY,
        ),
      );
    };

    const handlePointerUp = (
      event: React.PointerEvent<HTMLDivElement>,
    ) => {
      if (
        pointerId.current !== event.pointerId ||
        isFlying
      ) {
        return;
      }

      const dx =
        event.clientX - startPoint.current.x;

      const dy =
        event.clientY - startPoint.current.y;

      const droppedOnJar = isPointerOverJar(
        event.clientX,
        event.clientY,
      );

      const wasDragged =
        Math.abs(dx) >= 8 ||
        Math.abs(dy) >= 8;

      pointerId.current = null;

      try {
        event.currentTarget.releasePointerCapture(
          event.pointerId,
        );
      } catch {
        // Pointer capture may already have been released.
      }

      /*
       * Actual drag + drop into jar.
       */
      if (wasDragged && droppedOnJar) {
        handleFlyIntoJar();
        return;
      }

      /*
       * Normal tap.
       */
      if (
        Math.abs(dx) < 22 &&
        Math.abs(dy) < 22
      ) {
        resetDrag();
        handleTap();
        return;
      }

      /*
       * Dragged somewhere else.
       * Snap back.
       */
      resetDrag();
    };

    const handlePointerCancel = () => {
      pointerId.current = null;
      resetDrag();
    };

    /*
     * "บอก Mooca..." button
     *
     * This intentionally has NO pointer-drag handlers,
     * matching the original TouchableOpacity implementation.
     */
    if (isAddButton) {
      return (
        <div
          className={classNames(
            styles.cloudWrapper,
            styles.addCloudWrapper,
            {
              [styles.floatReady]: floatReady,
            },
          )}
          style={
            {
              '--float-duration': `${floatConfig.duration}ms`,
              '--float-delay': `${floatConfig.delay}ms`,
              '--float-amplitude': `${floatConfig.amplitude}px`,
            } as React.CSSProperties
          }
        >
          <button
            type="button"
            className={styles.addButton}
            onClick={() => {
              audioService.triggerHaptic(
                HAPTIC_STYLE.SELECTION,
              );

              onEditCustom?.();
            }}
          >
            <div
              className={styles.cloudScallopsTop}
              aria-hidden="true"
            >
              <div
                className={classNames(
                  styles.scallopPuff,
                  styles.scallopPuffLeft,
                )}
                style={{
                  backgroundColor: '#FFF5F8',
                  borderColor: '#F472B6',
                }}
              />

              <div
                className={classNames(
                  styles.scallopPuff,
                  styles.scallopPuffCenter,
                )}
                style={{
                  backgroundColor: '#FFF5F8',
                  borderColor: '#F472B6',
                }}
              />

              <div
                className={classNames(
                  styles.scallopPuff,
                  styles.scallopPuffRight,
                )}
                style={{
                  backgroundColor: '#FFF5F8',
                  borderColor: '#F472B6',
                }}
              />
            </div>

            <div
              className={classNames(
                styles.cloudBody,
                styles.addCloudBody,
              )}
            >
              <div
                className={styles.iconBubble}
                style={{
                  backgroundColor: '#EC489920',
                }}
              >
                <Plus
                  size={11}
                  color="#EC4899"
                  strokeWidth={2.8}
                />
              </div>

              <span
                className={styles.cloudTitle}
                style={{
                  color: '#BE185D',
                }}
              >
                {p1.tellMoocaBtn}
              </span>

              <div
                className={styles.downArrowPill}
                style={{
                  backgroundColor: '#EC489914',
                }}
              >
                <PenLine
                  size={8}
                  color="#EC4899"
                  strokeWidth={2.4}
                />
              </div>
            </div>
          </button>
        </div>
      );
    }

    const wrapperClassName = classNames(
      styles.cloudWrapper,
      {
        [styles.floatReady]: floatReady,
        [styles.isDragging]: isDragging,
        [styles.isPressed]: isPressed,
        [styles.isFlying]: isFlying,
        [styles.isJarFull]:
          isJarFull && !isSelected,
        [styles.isOverJar]: isOverJar,
      },
    );

    const cloudBodyClassName = classNames(
      styles.cloudBody,
      {
        [styles.customCloudBody]: isCustom,
      },
    );

    const gradient = isSelected
      ? 'linear-gradient(135deg, #FFFFFF 0%, #F0FDFA 55%, #CCFBF1 100%)'
      : isCustom
        ? 'linear-gradient(135deg, #FFFFFF 0%, #FDF2F8 55%, #FCE7F3 100%)'
        : 'linear-gradient(135deg, #FFFFFF 0%, #FFFDF9 55%, #F8FAFC 100%)';

    const borderColor = isSelected
      ? tag.color
      : isCustom
        ? 'rgba(236, 72, 153, 0.4)'
        : 'rgba(0, 0, 0, 0.08)';

    const borderBottomColor = isSelected
      ? tag.color
      : isCustom
        ? '#F472B6'
        : '#CBD5E1';

    return (
      <div
        className={wrapperClassName}
        style={
          {
            '--drag-x': `${dragOffset.x}px`,
            '--drag-y': `${dragOffset.y}px`,
            '--float-duration': `${floatConfig.duration}ms`,
            '--float-delay': `${floatConfig.delay}ms`,
            '--float-amplitude': `${floatConfig.amplitude}px`,
          } as React.CSSProperties
        }
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
      >
        <div
          className={styles.cloudScallopsTop}
          aria-hidden="true"
        >
          <div
            className={classNames(
              styles.scallopPuff,
              styles.scallopPuffLeft,
            )}
            style={{
              backgroundColor: isSelected
                ? '#F0FDFA'
                : '#FFFFFF',
              borderColor: isSelected
                ? tag.color
                : '#E2E8F0',
            }}
          />

          <div
            className={classNames(
              styles.scallopPuff,
              styles.scallopPuffCenter,
            )}
            style={{
              backgroundColor: isSelected
                ? '#F0FDFA'
                : '#FFFFFF',
              borderColor: isSelected
                ? tag.color
                : '#E2E8F0',
            }}
          />

          <div
            className={classNames(
              styles.scallopPuff,
              styles.scallopPuffRight,
            )}
            style={{
              backgroundColor: isSelected
                ? '#F0FDFA'
                : '#FFFFFF',
              borderColor: isSelected
                ? tag.color
                : '#E2E8F0',
            }}
          />
        </div>

        <div
          className={cloudBodyClassName}
          style={{
            background: gradient,
            borderColor,
            borderBottomColor,
          }}
        >
          <div
            className={styles.iconBubble}
            style={{
              backgroundColor:
                `${tag.color}1A`,
            }}
          >
            {getEmotionIcon(
              tag.id,
              tag.color,
              11,
            )}
          </div>

          <span
            className={classNames(
              styles.cloudTitle,
              {
                [styles.customCloudTitle]:
                  isCustom,
              },
            )}
            style={{
              color: isSelected
                ? '#004D40'
                : '#1E293B'
            }}
          >
            {isCustom && customText
              ? customText
              : getTagLabel(tag, lang)}
          </span>

          {isSelected ? (
            <div
              className={styles.checkBadge}
              style={{
                backgroundColor: tag.color,
              }}
            >
              <Check
                size={8}
                color="#FFFFFF"
                strokeWidth={3}
              />
            </div>
          ) : onEditCustom ? (
            <button
              type="button"
              className={styles.editButton}
              onPointerDown={(event) => {
                /*
                 * Prevent the parent cloud from
                 * starting a drag when editing.
                 */
                event.stopPropagation();
              }}
              onClick={(event) => {
                event.stopPropagation();

                audioService.triggerHaptic(
                  HAPTIC_STYLE.SELECTION,
                );

                onEditCustom();
              }}
            >
              <span
                className={styles.downArrowPill}
                style={{
                  backgroundColor:
                    `${tag.color}1A`,
                }}
              >
                <PenLine
                  size={8}
                  color={tag.color}
                  strokeWidth={2.4}
                />
              </span>
            </button>
          ) : (
            <div className={styles.downArrowPill}>
              <ArrowDown
                size={8.5}
                color={tag.color}
                strokeWidth={2.4}
              />
            </div>
          )}
        </div>
      </div>
    );
  };