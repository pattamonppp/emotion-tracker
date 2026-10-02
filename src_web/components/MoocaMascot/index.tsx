import React, { useState } from 'react';
import { audioService } from '../../services/audioService';
import { HeartIcon } from '../../icons';
import styles from './styles.module.scss';

export type MoocaMood = 
  | 'happy' 
  | 'comforting' 
  | 'hugging'
  | 'praying' 
  | 'rubbing'
  | 'drinking' 
  | 'shaking'
  | 'listening' 
  | 'celebrating' 
  | 'sleepy'
  | 'sad';

export interface MoocaMascotProps {
  mood?: MoocaMood;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showSunny?: boolean;
  speakingBubble?: string;
  interactive?: boolean;
  onHug?: () => void;
}

export const MoocaMascot: React.FC<MoocaMascotProps> = ({
  mood = 'happy',
  size = 'md',
  className = '',
  showSunny = true,
  speakingBubble,
  interactive = true,
  onHug,
}) => {
  const [isBlushing, setIsBlushing] = useState(false);
  const [tapHeartEffect, setTapHeartEffect] = useState(false);

  const getDimensions = () => {
    switch (size) {
      case 'xs': return { width: 52, height: 52 };
      case 'sm': return { width: 76, height: 76 };
      case 'lg': return { width: 148, height: 148 };
      case 'xl': return { width: 190, height: 190 };
      case 'md':
      default: return { width: 108, height: 108 };
    }
  };

  const { width, height } = getDimensions();

  // Cozy cloud body color
  const cloudFill = mood === 'sad' ? '#E2E8F0' : '#FFFFFF';
  const cloudStroke = mood === 'sad' ? '#94A3B8' : '#D1F2EE';

  const handleMascotTap = () => {
    if (!interactive) return;
    setIsBlushing(true);
    setTapHeartEffect(true);
    audioService.triggerHaptic([25, 40]);
    audioService.playJarDrop();
    if (onHug) onHug();

    setTimeout(() => {
      setTapHeartEffect(false);
    }, 1200);

    setTimeout(() => {
      setIsBlushing(false);
    }, 2500);
  };

  return (
    <div className={`${styles.container} ${className}`}>
      {/* Cute Floating Hearts on Tap */}
      {tapHeartEffect && (
        <div className={styles.tapHeartEffect}>
          <span className={styles.tapHeartIcon}>
            <HeartIcon className="w-5 h-5 text-rose-500 fill-rose-400" />
          </span>
          <span className={styles.tapHeartBadge}>
            ~Mooca loves you!~
          </span>
        </div>
      )}

      {/* Speaking Bubble from Mooca with Cozy Styled Cloud Tail */}
      {speakingBubble && (
        <div className={styles.speakingBubble}>
          <span>{speakingBubble}</span>
          {/* Cute bubble tail */}
          <div className={styles.speakingBubbleTail} />
        </div>
      )}

      {/* Mooca Mascot Vector Art */}
      <div 
        onClick={handleMascotTap}
        style={{ width, height }} 
        className={`${styles.vectorWrapper} ${interactive ? styles.interactive : ''}`}
        title={interactive ? 'แตะ Mooca เพื่อรับกอดอบอุ่น!' : undefined}
      >
        <svg
          viewBox="0 0 160 160"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={styles.svgRoot}
        >
          {/* Soft Cozy Tinted Shadow underneath */}
          <ellipse cx="80" cy="148" rx="42" ry="7" fill="rgba(0, 196, 179, 0.16)" />

          {/* MOOCA Character Body */}
          <g className="animate-bounce" style={{ animationDuration: '3.6s' }}>
            
            {/* Rainbow behind Mooca if celebrating */}
            {mood === 'celebrating' && (
              <path
                d="M 32 70 A 48 48 0 0 1 128 70"
                stroke="url(#moocaRainbowGrad)"
                strokeWidth="8"
                fill="none"
                opacity="0.85"
                strokeLinecap="round"
              />
            )}

            {/* Cozy Warm Glow Halo */}
            <circle cx="80" cy="80" r="54" fill="rgba(230, 249, 247, 0.6)" className="animate-pulse" style={{ animationDuration: '4s' }} />

            {/* Fluffy Cloud Body */}
            <path
              d="M 44 112 
                 C 22 112, 14 90, 26 72 
                 C 18 48, 42 34, 60 42 
                 C 70 22, 94 22, 104 42 
                 C 122 34, 146 48, 138 72 
                 C 150 90, 140 112, 118 112 
                 Z"
              fill={cloudFill}
              stroke={cloudStroke}
              strokeWidth="4"
              strokeLinejoin="round"
            />

            {/* Rosy Cheeks (Blushing when happy or tapped) */}
            <circle cx="54" cy="83" r={isBlushing ? 7 : 5.5} fill="#FFAAA6" opacity={isBlushing ? 0.95 : 0.65} className="transition-all duration-300" />
            <circle cx="106" cy="83" r={isBlushing ? 7 : 5.5} fill="#FFAAA6" opacity={isBlushing ? 0.95 : 0.65} className="transition-all duration-300" />

            {/* Mooca's Eyes */}
            {mood === 'praying' || mood === 'rubbing' || mood === 'comforting' ? (
              // Sweet smiling happy-closed eyes (^_^)
              <g stroke="#004D40" strokeWidth="3" strokeLinecap="round" fill="none">
                <path d="M 50 75 Q 58 68 66 75" />
                <path d="M 94 75 Q 102 68 110 75" />
              </g>
            ) : mood === 'sleepy' ? (
              // Sleepy calm resting curved eyes
              <g stroke="#004D40" strokeWidth="2.8" strokeLinecap="round" fill="none">
                <path d="M 52 76 Q 58 80 64 76" />
                <path d="M 96 76 Q 102 80 108 76" />
              </g>
            ) : mood === 'sad' ? (
              // Sad droopy eyes with blue droplet
              <g>
                <circle cx="58" cy="74" r="3.5" fill="#334155" />
                <circle cx="102" cy="74" r="3.5" fill="#334155" />
                <path d="M 64 82 Q 62 88 65 91 Q 68 88 66 82 Z" fill="#60A5FA" />
              </g>
            ) : (
              // Happy sparkling eyes with cute catchlight
              <g>
                <circle cx="58" cy="74" r="4.2" fill="#004D40" />
                <circle cx="102" cy="74" r="4.2" fill="#004D40" />
                <circle cx="59.5" cy="72.5" r="1.5" fill="#FFFFFF" />
                <circle cx="103.5" cy="72.5" r="1.5" fill="#FFFFFF" />
                <circle cx="56.5" cy="75.5" r="0.8" fill="#FFFFFF" />
                <circle cx="100.5" cy="75.5" r="0.8" fill="#FFFFFF" />
              </g>
            )}

            {/* Mooca's Cute Mouth */}
            {mood === 'sad' ? (
              <path
                d="M 76 86 Q 80 82 84 86"
                stroke="#004D40"
                strokeWidth="2.6"
                strokeLinecap="round"
                fill="none"
              />
            ) : mood === 'drinking' ? (
              // Cute 'O' mouth for sipping
              <ellipse cx="80" cy="85" rx="3.5" ry="4.5" fill="#004D40" />
            ) : mood === 'celebrating' || mood === 'happy' ? (
              // Big happy open smile with tongue
              <g>
                <path
                  d="M 73 82 Q 80 92 87 82 Z"
                  fill="#FF8A80"
                  stroke="#004D40"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                />
              </g>
            ) : (
              // Sweet gentle smile
              <path
                d="M 74 81 Q 80 88 86 81"
                stroke="#004D40"
                strokeWidth="2.8"
                strokeLinecap="round"
                fill="none"
              />
            )}

            {/* Cozy Warm Knit Scarf around Mooca's neck */}
            <g>
              <rect
                x="44"
                y="98"
                width="72"
                height="15"
                rx="7.5"
                fill="#FA8C3D"
                stroke="#D97706"
                strokeWidth="2"
              />
              {/* Scarf knit stripes */}
              <line x1="56" y1="98" x2="56" y2="113" stroke="#FFFFFF" strokeWidth="2" opacity="0.75" />
              <line x1="68" y1="98" x2="68" y2="113" stroke="#FFFFFF" strokeWidth="2" opacity="0.75" />
              <line x1="80" y1="98" x2="80" y2="113" stroke="#FFFFFF" strokeWidth="2" opacity="0.75" />
              <line x1="92" y1="98" x2="92" y2="113" stroke="#FFFFFF" strokeWidth="2" opacity="0.75" />

              {/* Scarf tail */}
              <rect
                x="90"
                y="108"
                width="15"
                height="24"
                rx="4"
                fill="#FA8C3D"
                stroke="#D97706"
                strokeWidth="2"
              />
              {/* Scarf fringes */}
              <line x1="93" y1="132" x2="93" y2="136" stroke="#D97706" strokeWidth="2" />
              <line x1="97.5" y1="132" x2="97.5" y2="136" stroke="#D97706" strokeWidth="2" />
              <line x1="102" y1="132" x2="102" y2="136" stroke="#D97706" strokeWidth="2" />
            </g>

            {/* Mooca's Little Paws & Legs */}
            <rect x="62" y="118" width="12" height="18" rx="6" fill={cloudFill} stroke={cloudStroke} strokeWidth="3.5" />
            <rect x="86" y="118" width="12" height="18" rx="6" fill={cloudFill} stroke={cloudStroke} strokeWidth="3.5" />

            {/* Dynamic Mood Accessories */}
            {mood === 'hugging' && (
              // Holding a soft glowing heart cushion
              <g className="animate-pulse">
                <path
                  d="M 80 102 
                     C 72 90, 60 96, 66 108 
                     C 72 120, 80 126, 80 126 
                     C 80 126, 88 120, 94 108 
                     C 100 96, 88 90, 80 102 Z"
                  fill="#F26E6E"
                  stroke="#E11D48"
                  strokeWidth="2"
                />
                <circle cx="73" cy="98" r="1.5" fill="#FFFFFF" opacity="0.7" />
              </g>
            )}

            {mood === 'rubbing' && (
              // Golden Sigil Sparkles between paws
              <g className="animate-spin" style={{ transformOrigin: '80px 105px', animationDuration: '4s' }}>
                <circle cx="80" cy="105" r="7" fill="#FDE047" opacity="0.9" />
                <path d="M 80 94 L 80 116 M 69 105 L 91 105" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
              </g>
            )}

            {mood === 'listening' && (
              // Cute Turquoise Headphones
              <g>
                <path
                  d="M 32 70 C 32 26, 128 26, 128 70"
                  stroke="#00C4B3"
                  strokeWidth="5.5"
                  fill="none"
                  strokeLinecap="round"
                />
                <rect x="24" y="60" width="14" height="24" rx="7" fill="#00C4B3" stroke="#004D40" strokeWidth="1.5" />
                <rect x="122" y="60" width="14" height="24" rx="7" fill="#00C4B3" stroke="#004D40" strokeWidth="1.5" />
                {/* Cute music notes */}
                <path d="M 136 50 Q 140 45 144 50 L 144 42" stroke="#00C4B3" strokeWidth="2" fill="none" />
              </g>
            )}

            {mood === 'drinking' && (
              // Cute Victory Drinking Cup with Straw
              <g>
                <path d="M 72 88 L 76 70" stroke="#F26E6E" strokeWidth="3" strokeLinecap="round" />
                <polygon points="68,90 92,90 88,114 72,114" fill="#00C4B3" stroke="#004D40" strokeWidth="1.8" />
                <rect x="66" y="88" width="28" height="4" rx="2" fill="#FFFFFF" stroke="#004D40" strokeWidth="1.5" />
                <circle cx="80" cy="102" r="3" fill="#E6F9F7" opacity="0.6" />
              </g>
            )}

            {mood === 'shaking' && (
              // Energy sparkles around paws
              <g stroke="#FA8C3D" strokeWidth="2.5" strokeLinecap="round">
                <line x1="30" y1="88" x2="22" y2="82" />
                <line x1="28" y1="98" x2="18" y2="98" />
                <line x1="130" y1="88" x2="138" y2="82" />
                <line x1="132" y1="98" x2="142" y2="98" />
              </g>
            )}

            {mood === 'sleepy' && (
              // Sweet nightcap with little pom-pom
              <g>
                <path d="M 52 45 Q 70 12 110 30 Q 100 50 68 46 Z" fill="#62A0E9" stroke="#1F77DF" strokeWidth="2" />
                <circle cx="112" cy="30" r="5" fill="#FFFFFF" stroke="#62A0E9" strokeWidth="1.5" />
                <text x="122" y="44" fill="#62A0E9" fontSize="12" fontWeight="bold">zZ</text>
              </g>
            )}

            {/* Paws */}
            <ellipse cx="44" cy="95" rx="7.5" ry="6.5" fill={cloudFill} stroke={cloudStroke} strokeWidth="3" />
            <ellipse cx="116" cy="95" rx="7.5" ry="6.5" fill={cloudFill} stroke={cloudStroke} strokeWidth="3" />
          </g>

          {/* SUNNY: Mooca's loyal mini sun buddy */}
          {showSunny && (
            <g className="animate-pulse" style={{ animationDuration: '2.8s' }}>
              <circle cx="128" cy="46" r="15" fill="#FDE047" stroke="#F59E0B" strokeWidth="2" />
              {/* Sun Face */}
              <circle cx="123" cy="44" r="1.8" fill="#78350F" />
              <circle cx="133" cy="44" r="1.8" fill="#78350F" />
              <path d="M 125 49 Q 128 53 131 49" stroke="#78350F" strokeWidth="1.5" strokeLinecap="round" fill="none" />
              <circle cx="120" cy="47" r="1.8" fill="#F87171" opacity="0.7" />
              <circle cx="136" cy="47" r="1.8" fill="#F87171" opacity="0.7" />
            </g>
          )}

          {/* Defs */}
          <defs>
            <linearGradient id="moocaRainbowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#F26E6E" />
              <stop offset="30%" stopColor="#FA8C3D" />
              <stop offset="65%" stopColor="#7CC954" />
              <stop offset="85%" stopColor="#00C4B3" />
              <stop offset="100%" stopColor="#62A0E9" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
};

export default MoocaMascot;
