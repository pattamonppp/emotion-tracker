import React from 'react';
import { EmotionTagId } from '../../../../types';
import { EMOTION_TAGS } from '../../../../data/matrixData';
import { audioService } from '../../../../services/audioService';
import { Sparkles, X } from 'lucide-react';
import { CheckIcon } from '../../../../icons';
import styles from './styles.module.scss';

export interface GlassEmotionJarProps {
  selectedEmotions: EmotionTagId[];
  onRemoveEmotion: (id: EmotionTagId) => void;
  onClearAll?: () => void;
  isOverJar: boolean;
  isDraggingAny: boolean;
  recentDropEffect: boolean;
  lang: 'th' | 'en';
  jarRef: React.RefObject<HTMLDivElement | null>;
}

export const GlassEmotionJar: React.FC<GlassEmotionJarProps> = ({
  selectedEmotions,
  onRemoveEmotion,
  onClearAll,
  isOverJar,
  isDraggingAny,
  recentDropEffect,
  lang,
  jarRef,
}) => {
  const handleJarTap = () => {
    audioService.triggerHaptic([15]);
  };

  const firstTag = selectedEmotions.length > 0 
    ? EMOTION_TAGS.find((t) => t.id === selectedEmotions[0]) 
    : null;
  const jarAmbientColor = firstTag?.color || '#00C4B3';

  const glowModifierClass = isOverJar
    ? styles.isOverJar
    : selectedEmotions.length > 0
    ? styles.hasEmotions
    : isDraggingAny
    ? styles.isDraggingAny
    : '';

  return (
    <div
      ref={jarRef}
      onClick={handleJarTap}
      className={styles.container}
    >
      {/* 1. AMBIENT BACKLIGHT GLOW */}
      <div
        className={`${styles.ambientGlow} ${glowModifierClass}`}
        style={{
          backgroundColor: isOverJar
            ? '#00C4B3'
            : selectedEmotions.length > 0
            ? jarAmbientColor
            : '#B3EDE8',
        }}
      />

      {/* 2. REALISTIC APOTHECARY GLASS VESSEL WITH SVG HIGHLIGHTS */}
      <div className={styles.vesselWrapper}>
        {/* SVG Glass Bottle Silhouette & Reflections */}
        <svg
          viewBox="0 0 240 250"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={styles.svgBottle}
        >
          <defs>
            {/* Glass Wall Radial Ambient */}
            <linearGradient id="glassWallGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
              <stop offset="6%" stopColor="#E0F7F5" stopOpacity="0.45" />
              <stop offset="25%" stopColor="#FFFFFF" stopOpacity="0.15" />
              <stop offset="75%" stopColor="#FFFFFF" stopOpacity="0.10" />
              <stop offset="94%" stopColor="#E0F7F5" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.75" />
            </linearGradient>

            {/* Glass Left Specular Arc Reflection */}
            <linearGradient id="specularArc" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
              <stop offset="40%" stopColor="#FFFFFF" stopOpacity="0.40" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.05" />
            </linearGradient>

            {/* Wooden Lid Texture Gradient */}
            <linearGradient id="woodLidGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8D5B28" />
              <stop offset="20%" stopColor="#C48A49" />
              <stop offset="50%" stopColor="#DFAB6B" />
              <stop offset="80%" stopColor="#B37839" />
              <stop offset="100%" stopColor="#7E4C1C" />
            </linearGradient>

            {/* Lid Rim Highlight */}
            <linearGradient id="lidBevel" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFE0B2" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#5D350F" stopOpacity="0.9" />
            </linearGradient>

            {/* Liquid Floor Ambient */}
            <linearGradient id="liquidBottom" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={jarAmbientColor} stopOpacity="0" />
              <stop offset="100%" stopColor={jarAmbientColor} stopOpacity="0.25" />
            </linearGradient>
          </defs>

          {/* JAR SHADOW BASE */}
          <ellipse cx="120" cy="242" rx="76" ry="7" fill="rgba(0, 196, 179, 0.18)" filter="blur(3px)" />

          {/* GLASS BOTTLE BODY FILL */}
          <path
            d="M 86,48 
               C 86,64 54,74 44,98 
               C 38,112 36,132 36,160 
               L 36,212 
               C 36,234 56,242 120,242 
               C 184,242 204,234 204,212 
               L 204,160 
               C 204,132 202,112 196,98 
               C 186,74 154,64 154,48 
               Z"
            fill="url(#glassWallGrad)"
            stroke={isOverJar ? '#00C4B3' : 'rgba(255, 255, 255, 0.95)'}
            strokeWidth={isOverJar ? '2.5' : '1.8'}
          />

          {/* GLASS INNER DEPTH SHADE */}
          <path
            d="M 88,52 
               C 88,66 56,76 46,99 
               C 40,113 38,133 38,160 
               L 38,210 
               C 38,228 58,238 120,238 
               C 182,238 202,228 202,210 
               L 202,160 
               C 202,133 200,113 194,99 
               C 184,76 152,66 152,52 
               Z"
            fill={isOverJar ? 'rgba(0, 196, 179, 0.08)' : 'rgba(230, 249, 247, 0.25)'}
          />

          {/* INNER AMBIENT LIQUID GLOW AT BOTTOM */}
          {selectedEmotions.length > 0 && (
            <path
              d="M 38,175 
                 C 70,178 170,172 202,175 
                 L 202,210 
                 C 202,228 182,238 120,238 
                 C 58,238 38,228 38,210 
                 Z"
              fill="url(#liquidBottom)"
            />
          )}

          {/* HEAVY GLASS BOTTOM CONVEX REFRACTION */}
          <path
            d="M 44,222 
               C 70,228 170,228 196,222 
               C 190,236 160,240 120,240 
               C 80,240 50,236 44,222 Z"
            fill="rgba(255, 255, 255, 0.75)"
          />
          <path
            d="M 60,232 C 90,236 150,236 180,232"
            stroke="rgba(255, 255, 255, 0.9)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />

          {/* SPECULAR LIGHT HIGHLIGHTS ON GLASS */}
          <path
            d="M 44,115 
               C 42,130 42,195 44,215"
            stroke="url(#specularArc)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <path
            d="M 48,125 
               C 47,140 47,185 48,205"
            stroke="#FFFFFF"
            strokeWidth="1.2"
            strokeOpacity="0.8"
            strokeLinecap="round"
          />

          <path
            d="M 82,62 
               C 66,74 54,84 48,102"
            stroke="#FFFFFF"
            strokeWidth="2.5"
            strokeOpacity="0.85"
            strokeLinecap="round"
          />

          <path
            d="M 196,115 
               C 198,135 198,195 196,215"
            stroke="#FFFFFF"
            strokeWidth="1.5"
            strokeOpacity="0.45"
            strokeLinecap="round"
          />

          {/* GLASS NECK FLANGED RIM LIP */}
          <ellipse
            cx="120"
            cy="48"
            rx="36"
            ry="7"
            fill="rgba(255, 255, 255, 0.9)"
            stroke="#B3EDE8"
            strokeWidth="1.5"
          />
          <ellipse
            cx="120"
            cy="48"
            rx="30"
            ry="4.5"
            fill={isOverJar ? '#B3EDE8' : 'rgba(230, 249, 247, 0.6)'}
          />

          {/* DECORATIVE CORD & MOOCA CHARM ON NECK */}
          <path
            d="M 86,54 C 100,58 140,58 154,54"
            stroke="#A36829"
            strokeWidth="1.8"
            fill="none"
          />
          <line x1="146" y1="56" x2="148" y2="70" stroke="#A36829" strokeWidth="1.2" />
          <circle cx="148" cy="74" r="5" fill="#FFFFFF" stroke="#00C4B3" strokeWidth="1" />

          {/* WOODEN CORK STOPPER / LID (Lifts when hovering or dragging) */}
          <g
            className={styles.stopperGroup}
            style={{
              transform: isOverJar
                ? 'translate(0px, -22px) rotate(3deg)'
                : isDraggingAny
                ? 'translate(0px, -12px) rotate(1deg)'
                : 'translate(0px, 0px)',
            }}
          >
            <ellipse cx="120" cy="22" rx="14" ry="5" fill="url(#woodLidGrad)" stroke="#5D350F" strokeWidth="0.8" />
            <rect x="110" y="22" width="20" height="7" rx="3" fill="url(#woodLidGrad)" />
            
            <path
              d="M 78,36 
                 C 78,31 92,28 120,28 
                 C 148,28 162,31 162,36 
                 L 158,46 
                 C 158,50 144,52 120,52 
                 C 96,52 82,50 82,46 
                 Z"
              fill="url(#woodLidGrad)"
              stroke="#5D350F"
              strokeWidth="1"
            />
            <ellipse cx="120" cy="35" rx="41" ry="6.5" fill="url(#lidBevel)" opacity="0.4" />
            
            <ellipse cx="120" cy="42" rx="39" ry="5" fill="#00C4B3" opacity="0.85" />
            <circle cx="120" cy="43" r="1.5" fill="#FFFFFF" />
          </g>

          {/* LIGHT BEAM WHEN LID IS OPENED */}
          {isOverJar && (
            <path
              d="M 94,46 L 70,0 L 170,0 L 146,46 Z"
              fill="url(#specularArc)"
              opacity="0.3"
              filter="blur(4px)"
            />
          )}
        </svg>

        {/* 3. INTERACTIVE EMOTION CONTENTS INSIDE JAR */}
        <div className={styles.jarContents}>
          {/* EMPTY STATE */}
          {selectedEmotions.length === 0 ? (
            <div className={styles.emptyState}>
              <div
                className={`${styles.dropTargetRing} ${
                  isOverJar
                    ? styles.ringOver
                    : isDraggingAny
                    ? styles.ringDragging
                    : ''
                }`}
              >
                {isOverJar ? (
                  <Sparkles className="w-5 h-5 animate-spin text-white" />
                ) : (
                  <Sparkles className="w-4 h-4 text-[#00C4B3] animate-pulse" />
                )}
              </div>

              <h3 className={styles.emptyTitle}>
                {isOverJar
                  ? (lang === 'th' ? 'ปล่อยลงในโหลแก้ว' : 'Drop into Jar!')
                  : (lang === 'th' ? 'โหลแก้วว่างพร้อมรับฝาก' : 'Sanctuary Jar')}
              </h3>

              <p className={styles.emptySubtitle}>
                {isOverJar
                  ? (lang === 'th' ? 'ปล่อยนิ้วได้เลย' : 'Release now')
                  : (lang === 'th' ? 'ลากหรือแตะอารมณ์จากด้านล่าง' : 'Drag or tap emotions below')}
              </p>
            </div>
          ) : (
            /* FILLED STATE: Luminous floating emotion gems */
            <div className={styles.filledState}>
              {selectedEmotions.map((id, index) => {
                const tag = EMOTION_TAGS.find((t) => t.id === id);
                if (!tag) return null;
                return (
                  <div
                    key={id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveEmotion(id);
                    }}
                    className={styles.emotionPill}
                    style={{
                      animation: `moocaFloat 3s ease-in-out infinite ${index * 0.4}s`,
                    }}
                    title={lang === 'th' ? 'แตะเพื่อนำออกจากโหล' : 'Tap to remove'}
                  >
                    <div className={styles.emotionPillLeft}>
                      <span
                        className={styles.emotionDot}
                        style={{
                          backgroundColor: tag.color,
                          boxShadow: `0 0 6px ${tag.color}`,
                        }}
                      />
                      <span className={styles.emotionLabel}>
                        {lang === 'th' ? tag.labelTh : tag.labelEn}
                      </span>
                    </div>

                    <span className={styles.removeBtn}>
                      <X />
                    </span>
                  </div>
                );
              })}

              {/* Status count and clear button */}
              <div className={styles.statusBar}>
                <span className={styles.statusCount}>
                  <CheckIcon className="w-3 h-3 text-[#00C4B3]" />
                  <span>{selectedEmotions.length}/2</span>
                </span>

                {onClearAll && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onClearAll();
                    }}
                    className={styles.clearBtn}
                  >
                    {lang === 'th' ? 'เทออก' : 'Clear'}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GlassEmotionJar;
