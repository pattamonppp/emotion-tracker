import React, { useState, useRef, useCallback } from 'react';
import { EmotionTag, EmotionTagId } from '../types';
import { EMOTION_TAGS } from '../data/matrixData';
import { audioService } from '../services/audioService';
import { Button } from '../design-system/Button';
import { GlassEmotionJar } from './GlassEmotionJar';
import {
  MapPin,
  Activity,
  ArrowRight,
  GripHorizontal,
  Check
} from 'lucide-react';

interface Phase1EmotionJarProps {
  currentLocation: string;
  heartRate: number;
  selectedEmotions: EmotionTagId[];
  onSelectEmotions: (ids: EmotionTagId[]) => void;
  onProceed: () => void;
  onOpenPulseSensor?: () => void;
  onOpenStory?: () => void;
  lang: 'th' | 'en';
}

export const Phase1EmotionJar: React.FC<Phase1EmotionJarProps> = ({
  currentLocation,
  heartRate,
  selectedEmotions,
  onSelectEmotions,
  onProceed,
  onOpenPulseSensor,
  onOpenStory,
  lang,
}) => {
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

  const handleDropIntoJar = useCallback((tagId: EmotionTagId) => {
    audioService.playJarDrop();
    audioService.triggerHaptic([30, 45]);
    setRecentDropEffect(true);
    setTimeout(() => setRecentDropEffect(false), 800);

    if (selectedEmotions.includes(tagId)) {
      return;
    }

    if (selectedEmotions.length >= 2) {
      onSelectEmotions([selectedEmotions[1], tagId]);
    } else {
      onSelectEmotions([...selectedEmotions, tagId]);
    }
  }, [selectedEmotions, onSelectEmotions]);

  const handleRemoveFromJar = useCallback((tagId: EmotionTagId) => {
    audioService.triggerHaptic([20]);
    onSelectEmotions(selectedEmotions.filter((id) => id !== tagId));
  }, [selectedEmotions, onSelectEmotions]);

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
      return lang === 'th'
        ? 'ลากความกังวลมาฝากไว้ในโหลของ Mooca ได้เลยนะ'
        : 'Drag any worries into my jar to rest';
    }
    if (selectedEmotions.length === 1) {
      return lang === 'th'
        ? 'Mooca เก็บไว้ให้แล้ว มีอีกไหม หรือพร้อมเริ่มเลย?'
        : 'Safe in the jar! Add 1 more or tap begin';
    }
    return lang === 'th'
      ? 'พร้อมแล้วนะ! Mooca จะพาไปรีเซ็ตใจให้โล่งสบาย'
      : 'Ready! Let’s restore your calm together';
  };

  const activeDraggingTag = EMOTION_TAGS.find((t) => t.id === activeDraggingTagId);

  return (
    <div className="flex flex-col h-full justify-between pb-2 px-3 pt-1.5 animate-in fade-in duration-300 relative select-none overflow-hidden">

      {/* 1. TOP CONTEXT STRIP: Unboxed quiet metadata */}
      <div className="flex items-center justify-between text-xs px-1 shrink-0">
        <div className="flex items-center gap-1.5 text-slate-600">
          <MapPin className="w-3.5 h-3.5 text-[#00C4B3]" />
          <span className="font-semibold text-[11px] text-slate-700 tracking-tight">
            {currentLocation}
          </span>
        </div>

        <button
          onClick={onOpenPulseSensor}
          className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white border border-slate-200 hover:border-[#00C4B3]/40 text-slate-700 transition-all cursor-pointer shadow-2xs active:scale-95"
          title={lang === 'th' ? 'แตะเพื่อวัดชีพจร' : 'Tap to scan pulse'}
        >
          <Activity className="w-3 h-3 text-[#F26E6E] animate-heart-pulse" />
          <span className="font-mono text-[11px] font-bold tabular-nums">
            {heartRate} <span className="text-[9px] font-normal text-slate-400">bpm</span>
          </span>
        </button>
      </div>

      {/* 2. CENTERED HERO HEADLINE & MOOCA SPEECH BADGE (No squished columns!) */}
      <div className="text-center mt-1 px-2 shrink-0">
        <h1 className="text-base sm:text-lg font-extrabold text-[#004D40] tracking-tight leading-tight">
          {lang === 'th' ? 'ฝากความรู้สึกไว้ในโหลแก้ว' : 'Leave Your Feelings in the Jar'}
        </h1>
        <p className="text-[11px] text-slate-500 font-medium mt-0.5 max-w-xs mx-auto leading-normal">
          {lang === 'th'
            ? 'ลากก้อนความกังวลหย่อนลงในโหลแก้ว เพื่อเริ่มรีเซ็ตใจ'
            : 'Drag or tap your worries into the sanctuary jar'}
        </p>

        {/* Cozy Mooca Speech Banner */}
        <div className="inline-flex items-center gap-1.5 mt-1.5 px-3 py-0.5 rounded-full bg-[#E6F9F7] border border-[#00C4B3]/30 shadow-2xs">
          <span className="text-xs">🐑</span>
          <span className="text-[10px] font-bold text-[#004D40]">
            {getMoocaSpeech()}
          </span>
        </div>
      </div>

      {/* 3. HERO CENTERPIECE: REALISTIC SVG APOTHECARY GLASS JAR */}
      <div className="flex-1 flex flex-col items-center justify-center relative my-0.5">
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
      <div className="flex flex-col gap-1 shrink-0">
        <div className="flex items-center justify-between px-1">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
            {lang === 'th' ? 'ลากหรือแตะเพื่อใส่ลงโหล' : 'Drag or tap to drop'}
          </span>
          <span className="text-[10px] text-[#00C4B3] font-bold">
            {selectedEmotions.length}/2
          </span>
        </div>

        {/* Emotion Chips Grid */}
        <div className="flex flex-wrap justify-center gap-1.5">
          {EMOTION_TAGS.map((tag) => {
            const isSelected = selectedEmotions.includes(tag.id);
            const isBeingDragged = activeDraggingTagId === tag.id;

            return (
              <div
                key={tag.id}
                onPointerDown={(e) => handlePointerDown(tag.id, e)}
                className={`relative px-2.5 py-1.5 rounded-xl text-xs font-semibold cursor-grab active:cursor-grabbing transition-all duration-150 flex items-center gap-1.5 select-none border touch-none ${isBeingDragged
                  ? 'opacity-30 scale-95 border-dashed border-[#00C4B3]'
                  : isSelected
                    ? 'bg-[#E6F9F7] text-[#004D40] border-[#00C4B3] shadow-xs'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-2xs hover:border-[#00C4B3]/40'
                  }`}
              >
                <GripHorizontal className="w-3 h-3 text-slate-300 shrink-0" />

                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0 shadow-2xs"
                  style={{
                    backgroundColor: tag.color,
                    boxShadow: isSelected ? `0 0 6px ${tag.color}` : undefined,
                  }}
                />

                <span className="font-bold text-[11px] truncate">
                  {lang === 'th' ? tag.labelTh : tag.labelEn}
                </span>

                {isSelected ? (
                  <span className="w-3.5 h-3.5 rounded-full bg-[#00C4B3] text-white flex items-center justify-center shrink-0">
                    <Check className="w-2 h-2 stroke-[3]" />
                  </span>
                ) : (
                  <span className="text-[9px] text-slate-300 font-black shrink-0">
                    ＋
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. ACTIVE DRAGGING FLOATING GHOST PORTAL */}
      {activeDraggingTagId && dragPointerPos && activeDraggingTag && (
        <div
          className="fixed pointer-events-none z-50 transform -translate-x-1/2 -translate-y-1/2"
          style={{
            left: `${dragPointerPos.x}px`,
            top: `${dragPointerPos.y}px`,
          }}
        >
          <div
            className={`px-3 py-1.5 rounded-xl bg-white border-2 shadow-2xl flex items-center gap-2 scale-105 rotate-1 transition-all ${isOverJar
              ? 'border-[#00C4B3] ring-4 ring-[#00C4B3]/30 shadow-[#00C4B3]/40'
              : 'border-slate-300'
              }`}
          >
            <span
              className="w-2.5 h-2.5 rounded-full shadow-xs"
              style={{
                backgroundColor: activeDraggingTag.color,
                boxShadow: `0 0 8px ${activeDraggingTag.color}`,
              }}
            />
            <span className="font-bold text-xs text-slate-900">
              {lang === 'th' ? activeDraggingTag.labelTh : activeDraggingTag.labelEn}
            </span>
            {isOverJar && (
              <span className="text-[10px] font-bold text-[#00C4B3] ml-1">
                ↓ {lang === 'th' ? 'ปล่อยลงโหล' : 'Drop'}
              </span>
            )}
          </div>
        </div>
      )}

      {/* 6. BOTTOM ACTION SECTION DOCKED PROMINENTLY */}
      <div className="pt-1.5 border-t border-slate-100 space-y-1.5 mt-1 shrink-0">
        {/* Tailored Path Preview Banner */}
        {recommended && (
          <div className="px-2.5 py-1 rounded-xl bg-[#E6F9F7] border border-[#00C4B3]/30 flex items-center justify-between text-xs animate-in fade-in">
            <div className="flex items-center gap-1.5 truncate">
              <span className="w-4 h-4 rounded-full bg-[#00C4B3] text-white flex items-center justify-center font-black text-[9px] shrink-0">
                {recommended}
              </span>
              <span className="text-[10px] font-bold text-[#004D40] truncate">
                {recommended === 'A' && (lang === 'th' ? 'ถูซับพลังใจ (Somatic Absorption)' : 'Somatic Absorption')}
                {recommended === 'B' && (lang === 'th' ? 'จิบน้ำชัยชนะ (The Victory Sip)' : 'The Victory Sip')}
                {recommended === 'C' && (lang === 'th' ? 'สะบัดทิ้งพลังลบ (Kinetic Shaker)' : 'Kinetic Shaker')}
                {recommended === 'D' && (lang === 'th' ? 'เสียงคลื่นสมอง (Audio Sanctuary)' : 'Audio Sanctuary')}
              </span>
            </div>
            <span className="text-[10px] font-mono text-[#004D40] font-bold shrink-0 ml-1">
              65s
            </span>
          </div>
        )}

        {/* Primary CTA Button */}
        <Button
          variant="primary"
          colorTheme="turquoise"
          size="lg"
          fullWidth
          isDisabled={selectedEmotions.length === 0}
          onClick={onProceed}
          trailingIcon={<ArrowRight className="w-4 h-4" />}
          label={
            selectedEmotions.length === 0
              ? (lang === 'th' ? 'ลากความรู้สึก 1-2 อย่างลงโหลก่อนนะ' : 'Drag 1-2 emotions into jar')
              : (lang === 'th' ? 'เริ่มรีเซ็ตใจ 65 วินาที ทันที' : 'Begin 65s Somatic Reset')
          }
        />
      </div>

    </div>
  );
};
