import React, { useState, useRef, useCallback } from 'react';
import cn from 'classnames';
import { EmotionTagId } from '../../types';
import { EMOTION_TAGS } from '../../data/matrixData';
import { audioService } from '../../services/audioService';
import { Button } from '../../components/Button';
import { GlassEmotionJar } from './components/GlassEmotionJar';
import {
  MapPinIcon,
  ActivityIcon,
  ArrowRightIcon,
  GripHorizontalIcon,
  CheckIcon,
  HeartIcon,
} from '../../icons';
import { useLanguage } from '../../hooks';
import { getTagLabel } from '../../locales';
import { MAX_EMOTIONS } from './constants';
import styles from './styles.module.scss';

export interface Phase1EmotionJarProps {
  currentLocation: string;
  heartRate: number;
  selectedEmotions: EmotionTagId[];
  onSelectEmotions: (ids: EmotionTagId[]) => void;
  onProceed: () => void;
  onOpenPulseSensor?: () => void;
  onOpenStory?: () => void;
  lang?: 'th' | 'en';
}

export const Phase1EmotionJar: React.FC<Phase1EmotionJarProps> = ({
  currentLocation,
  heartRate,
  selectedEmotions,
  onSelectEmotions,
  onProceed,
  onOpenPulseSensor,
}) => {
  const { t, lang } = useLanguage();
  const strings = t.phases.phase1;
  const jarRef = useRef<HTMLDivElement | null>(null);

  // Dragging states
  const [activeDraggingTagId, setActiveDraggingTagId] = useState<EmotionTagId | null>(null);
  const [dragPointerPos, setDragPointerPos] = useState<{ x: number; y: number } | null>(null);
  const [isOverJar, setIsOverJar] = useState(false);
  const [recentDropEffect, setRecentDropEffect] = useState(false);

  // Tracking refs
  const dragStartPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);

  // Check if coordinates overlap the Jar
  const checkIsOverJar = useCallback((clientX: number, clientY: number) => {
    if (!jarRef.current) return false;
    const rect = jarRef.current.getBoundingClientRect();
    const padding = 20;
    return (
      clientX >= rect.left - padding &&
      clientX <= rect.right + padding &&
      clientY >= rect.top - padding &&
      clientY <= rect.bottom + padding
    );
  }, []);

  const handleDropIntoJar = useCallback(
    (tagId: EmotionTagId) => {
      audioService.playJarDrop();
      audioService.triggerHaptic([30, 45]);
      setRecentDropEffect(true);
      setTimeout(() => setRecentDropEffect(false), 800);

      if (selectedEmotions.includes(tagId)) {
        return;
      }

      if (selectedEmotions.length >= MAX_EMOTIONS) {
        onSelectEmotions([...selectedEmotions.slice(1), tagId]);
      } else {
        onSelectEmotions([...selectedEmotions, tagId]);
      }
    },
    [selectedEmotions, onSelectEmotions]
  );

  const handleRemoveFromJar = useCallback(
    (tagId: EmotionTagId) => {
      audioService.triggerHaptic([20]);
      onSelectEmotions(selectedEmotions.filter((id) => id !== tagId));
    },
    [selectedEmotions, onSelectEmotions]
  );

  const handleClearAll = useCallback(() => {
    audioService.triggerHaptic([20, 20]);
    onSelectEmotions([]);
  }, [onSelectEmotions]);

  // Pointer drag event handlers
  const handlePointerDown = (tagId: EmotionTagId, e: React.PointerEvent) => {
    dragStartPosRef.current = { x: e.clientX, y: e.clientY };
    isDraggingRef.current = false;
    setActiveDraggingTagId(tagId);
    setDragPointerPos({ x: e.clientX, y: e.clientY });

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const dx = moveEvent.clientX - dragStartPosRef.current.x;
      const dy = moveEvent.clientY - dragStartPosRef.current.y;
      if (Math.hypot(dx, dy) > 8) {
        isDraggingRef.current = true;
      }
      setDragPointerPos({ x: moveEvent.clientX, y: moveEvent.clientY });
      setIsOverJar(checkIsOverJar(moveEvent.clientX, moveEvent.clientY));
    };

    const handlePointerUp = (upEvent: PointerEvent) => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);

      const over = checkIsOverJar(upEvent.clientX, upEvent.clientY);
      if (isDraggingRef.current) {
        if (over) {
          handleDropIntoJar(tagId);
        }
      } else {
        // Direct tap: toggle in or out of jar
        if (selectedEmotions.includes(tagId)) {
          handleRemoveFromJar(tagId);
        } else {
          handleDropIntoJar(tagId);
        }
      }

      setActiveDraggingTagId(null);
      setDragPointerPos(null);
      setIsOverJar(false);
      isDraggingRef.current = false;
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  const getRecommendedIntervention = () => {
    if (selectedEmotions.length === 0) return null;
    const firstTag = EMOTION_TAGS.find((t) => t.id === selectedEmotions[0]);
    return firstTag?.recommendedOption || 'A';
  };

  const recommended = getRecommendedIntervention();

  const getMoocaSpeech = () => {
    if (selectedEmotions.length === 0) {
      return strings.moocaSpeech.empty;
    }
    if (selectedEmotions.length === 1) {
      return strings.moocaSpeech.hasOne;
    }
    return strings.moocaSpeech.full;
  };

  const activeDraggingTag = EMOTION_TAGS.find((t) => t.id === activeDraggingTagId);

  return (
    <div className={styles.container}>
      {/* 1. TOP CONTEXT STRIP */}
      <div className={styles.topStrip}>
        <div className={styles.locationBadge}>
          <MapPinIcon />
          <span className={styles.locationText}>{currentLocation}</span>
        </div>

        <button
          type="button"
          onClick={onOpenPulseSensor}
          className={styles.pulseBtn}
          title={strings.tapToScanPulse}
        >
          <ActivityIcon />
          <span className={styles.pulseValue}>
            {heartRate} <span className={styles.pulseUnit}>bpm</span>
          </span>
        </button>
      </div>

      {/* 2. HERO HEADLINE & MOOCA SPEECH BADGE */}
      <div className={styles.heroSection}>
        <h1 className={styles.title}>{strings.heroTitle}</h1>
        <p className={styles.subtitle}>{strings.heroSubtitle}</p>

        <div className={styles.moocaSpeechPill}>
          <span className={styles.moocaEmoji}>
            <HeartIcon />
          </span>
          <span className={styles.moocaSpeechText}>{getMoocaSpeech()}</span>
        </div>
      </div>

      {/* 3. HERO CENTERPIECE: REALISTIC GLASS JAR */}
      <div className={styles.jarCenterpiece}>
        <GlassEmotionJar
          jarRef={jarRef}
          selectedEmotions={selectedEmotions}
          onRemoveEmotion={handleRemoveFromJar}
          onClearAll={handleClearAll}
          isOverJar={isOverJar}
          isDraggingAny={activeDraggingTagId !== null}
          recentDropEffect={recentDropEffect}
          lang={lang}
        />
      </div>

      {/* 4. TACTILE DRAGGABLE EMOTION CAPSULES TRAY */}
      <div className={styles.traySection}>
        <div className={styles.trayHeader}>
          <span className={styles.trayInstruction}>{strings.dragHint}</span>
          <span className={styles.trayCounter}>{selectedEmotions.length}/{MAX_EMOTIONS}</span>
        </div>

        <div className={styles.chipsGrid}>
          {EMOTION_TAGS.map((tag) => {
            const isSelected = selectedEmotions.includes(tag.id);
            const isBeingDragged = activeDraggingTagId === tag.id;

            return (
              <div
                key={tag.id}
                onPointerDown={(e) => handlePointerDown(tag.id, e)}
                className={cn(styles.chip, {
                  [styles.selected]: isSelected,
                  [styles.beingDragged]: isBeingDragged,
                })}
              >
                <GripHorizontalIcon className={styles.gripIcon} />

                <span
                  className={styles.colorDot}
                  style={{
                    backgroundColor: tag.color,
                    boxShadow: isSelected ? `0 0 6px ${tag.color}` : undefined,
                  }}
                />

                <span className={styles.chipLabel}>
                  {getTagLabel(tag, lang)}
                </span>

                {isSelected ? (
                  <span className={styles.checkCircle}>
                    <CheckIcon />
                  </span>
                ) : (
                  <span className={styles.plusIcon}>+</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. ACTIVE DRAGGING FLOATING GHOST PORTAL */}
      {activeDraggingTagId && dragPointerPos && activeDraggingTag && (
        <div
          className={styles.dragPortal}
          style={{
            left: `${dragPointerPos.x}px`,
            top: `${dragPointerPos.y}px`,
          }}
        >
          <div
            className={cn(styles.dragGhost, {
              [styles.overJar]: isOverJar,
            })}
          >
            <span
              className={styles.colorDot}
              style={{
                backgroundColor: activeDraggingTag.color,
                boxShadow: `0 0 8px ${activeDraggingTag.color}`,
              }}
            />
            <span className={styles.dragGhostText}>
              {getTagLabel(activeDraggingTag, lang)}
            </span>
            {isOverJar && (
              <span className={styles.dropHint}>
                {strings.dropHint}
              </span>
            )}
          </div>
        </div>
      )}

      {/* 6. BOTTOM ACTION SECTION */}
      <div className={styles.bottomActionSection}>
        {recommended && (
          <div className={styles.previewBanner}>
            <div className={styles.previewLeft}>
              <span className={styles.previewOptionBadge}>{recommended}</span>
              <span className={styles.previewOptionName}>
                {recommended === 'A' && strings.previewA}
                {recommended === 'B' && strings.previewB}
                {recommended === 'C' && strings.previewC}
                {recommended === 'D' && strings.previewD}
              </span>
            </div>
            <span className={styles.previewDuration}>65s</span>
          </div>
        )}

        <Button
          variant="primary"
          colorTheme="turquoise"
          size="lg"
          fullWidth
          isDisabled={selectedEmotions.length === 0}
          onClick={onProceed}
          trailingIcon={<ArrowRightIcon className={styles.btnArrowIcon} />}
          label={
            selectedEmotions.length === 0
              ? strings.emptyButtonPrompt
              : strings.activeButtonPrompt
          }
        />
      </div>
    </div>
  );
};

export default Phase1EmotionJar;
export * from './modals/LivePulseSensorModal';
export * from './modals/MoocaStoryModal';
export * from './modals/OnboardingModal';
export * from './components/GlassEmotionJar';
