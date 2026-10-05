import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Heart, Sparkles } from 'lucide-react';

import { audioService, HAPTIC_STYLE } from '../../services/audioService';
import styles from './styles.module.scss';

export const MOOCA_MOOD = {
  HAPPY: 'happy',
  COMFORTING: 'comforting',
  HUGGING: 'hugging',
  PRAYING: 'praying',
  RUBBING: 'rubbing',
  DRINKING: 'drinking',
  SHAKING: 'shaking',
  LISTENING: 'listening',
  CELEBRATING: 'celebrating',
  SLEEPY: 'sleepy',
  SAD: 'sad',
} as const;

export type MoocaMood = typeof MOOCA_MOOD[keyof typeof MOOCA_MOOD];

interface MoocaMascotProps {
  mood?: MoocaMood;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showSunny?: boolean;
  speakingBubble?: string;
  interactive?: boolean;
  onHug?: () => void;
}

const SWEET_MESSAGES = [
  'งื้อออ รักเธอนะ!',
  'Mooca กอดแน่น ๆ เลย!',
  'คนเก่งของ Mooca เก่งมากแล้วนะ',
  'อยู่ข้าง ๆ เสมอนะ ไม่ทิ้งไปไหนหรอก',
  'สูดหายใจเข้าลึก ๆ น้า มี Mooca ตรงนี้',
  'เก่งที่สุดเลยยย พักใจแป๊บเดียวนะคะ',
];

const SIZE_MAP = {
  xs: 54,
  sm: 84,
  md: 116,
  lg: 154,
  xl: 196,
} as const;

export const MoocaMascot: React.FC<MoocaMascotProps> = ({
  mood = 'happy',
  size = 'md',
  showSunny = true,
  speakingBubble,
  interactive = true,
  onHug,
}) => {
  const [isBlushing, setIsBlushing] = useState(false);
  const [petMessage, setPetMessage] = useState<string | null>(null);
  const [isPetting, setIsPetting] = useState(false);

  const sunnyRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dimension = SIZE_MAP[size];
  const displayMessage = petMessage || speakingBubble;

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handlePetting = () => {
    if (!interactive) return;

    audioService.triggerHaptic(HAPTIC_STYLE.SELECTION);

    setIsBlushing(true);
    setIsPetting(true);

    const msg =
      SWEET_MESSAGES[Math.floor(Math.random() * SWEET_MESSAGES.length)];

    setPetMessage(msg);

    onHug?.();

    timeoutRef.current = setTimeout(() => {
      setIsBlushing(false);
      setPetMessage(null);
      setIsPetting(false);
    }, 2800);
  };

  return (
    <div className={styles.container}>
      {/* Floating Hearts */}
      {isPetting && (
        <div className={styles.floatingHeartsContainer} aria-hidden="true">
          <div className={styles.floatingHearts}>
            <Heart
              className={styles.floatingHeart}
              size={16}
              fill="#EC4899"
              strokeWidth={0}
            />
            <Sparkles
              className={styles.floatingSparkle}
              size={18}
              fill="#FDE047"
              strokeWidth={0}
            />
            <Heart
              className={styles.floatingHeartLarge}
              size={20}
              fill="#F43F5E"
              strokeWidth={0}
            />
          </div>
        </div>
      )}

      <div className={styles.mascotAnchor}>
        {/* Speech Bubble */}
        <div
          className={classNames(
            styles.bubblePositioner,
            !displayMessage && styles.bubblePositionerHidden,
          )}
          aria-hidden={!displayMessage}
        >
          {displayMessage && (
            <div className={styles.bubbleContainer}>
              <span className={styles.bubbleText}>
                {displayMessage}
              </span>
              <div className={styles.bubbleTail} />
            </div>
          )}
        </div>

        {/* Interactive Mooca */}
        <button
          type="button"
          className={classNames(
            styles.vectorWrapper,
            interactive && styles.interactive,
            isPetting && styles.petting,
          )}
          style={{
            width: dimension,
            height: dimension,
          }}
          onClick={handlePetting}
          disabled={!interactive}
        >
          <svg
            className={styles.svgRoot}
            width={dimension}
            height={dimension}
            viewBox="0 0 160 160"
            aria-hidden="true"
          >
            <defs>
              <linearGradient
                id="moocaRainbowGrad"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#EC4899" />
                <stop offset="30%" stopColor="#34D399" />
                <stop offset="65%" stopColor="#FB7185" />
                <stop offset="85%" stopColor="#00C4B3" />
                <stop offset="100%" stopColor="#4A90E2" />
              </linearGradient>

              <linearGradient
                id="sunnyRayGrad"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#FFD54F" />
                <stop offset="100%" stopColor="#FFA726" />
              </linearGradient>
            </defs>

            {/* Soft Warm Halo */}
            <ellipse
              cx="80"
              cy="148"
              rx="44"
              ry="7"
              fill="rgba(0, 196, 179, 0.18)"
            />

            {/* Rainbow */}
            {mood === MOOCA_MOOD.CELEBRATING && (
              <path
                d="M 28 72 A 52 52 0 0 1 132 72"
                stroke="url(#moocaRainbowGrad)"
                strokeWidth="8"
                fill="none"
                opacity="0.88"
                strokeLinecap="round"
              />
            )}

            {/* Cozy Warm Glow */}
            <circle
              cx="80"
              cy="80"
              r="56"
              fill="rgba(230, 249, 247, 0.65)"
            />

            {/* Cloud Body */}
            <path
              d="M 44 112 C 20 112, 12 88, 24 70 C 16 46, 42 32, 60 40 C 70 20, 94 20, 104 40 C 122 32, 148 46, 140 70 C 152 88, 142 112, 118 112 Z"
              fill={mood === MOOCA_MOOD.SAD ? '#E2E8F0' : '#FFFFFF'}
              stroke={mood === MOOCA_MOOD.SAD ? '#94A3B8' : '#BEECE6'}
              strokeWidth="3.5"
              strokeLinejoin="round"
            />

            {/* Left Cheek */}
            <circle
              cx="54"
              cy="83"
              r={isBlushing ? 8 : 6.5}
              fill="#FF8BA7"
              opacity={isBlushing ? 0.95 : 0.68}
            />

            <path
              d="M 54 81 C 52 79, 50 81, 52 83 L 54 85 L 56 83 C 58 81, 56 79, 54 81 Z"
              fill="#FFFFFF"
              opacity="0.9"
            />

            {/* Right Cheek */}
            <circle
              cx="106"
              cy="83"
              r={isBlushing ? 8 : 6.5}
              fill="#FF8BA7"
              opacity={isBlushing ? 0.95 : 0.68}
            />

            <path
              d="M 106 81 C 104 79, 102 81, 104 83 L 106 85 L 108 83 C 110 81, 108 79, 106 81 Z"
              fill="#FFFFFF"
              opacity="0.9"
            />

            {/* Eyes */}
            {mood === MOOCA_MOOD.PRAYING ||
              mood === MOOCA_MOOD.RUBBING ||
              mood === MOOCA_MOOD.COMFORTING ? (
              <g
                stroke="#006B63"
                strokeWidth="3.2"
                strokeLinecap="round"
                fill="none"
              >
                <path d="M 48 76 Q 58 67 68 76" />
                <path d="M 92 76 Q 102 67 112 76" />
              </g>
            ) : mood === MOOCA_MOOD.SLEEPY ? (
              <g
                stroke="#006B63"
                strokeWidth="2.8"
                strokeLinecap="round"
                fill="none"
              >
                <path d="M 50 78 Q 58 83 66 78" />
                <path d="M 94 78 Q 102 83 110 78" />
              </g>
            ) : mood === MOOCA_MOOD.SAD ? (
              <g>
                <circle cx="58" cy="74" r="3.8" fill="#334155" />
                <circle cx="102" cy="74" r="3.8" fill="#334155" />

                <path
                  d="M 64 82 Q 62 89 65 92 Q 68 89 66 82 Z"
                  fill="#60A5FA"
                />
              </g>
            ) : (
              <g>
                <circle cx="58" cy="74" r="5" fill="#006B63" />
                <circle cx="102" cy="74" r="5" fill="#006B63" />

                <circle cx="56.5" cy="72" r="2.2" fill="#FFFFFF" />
                <circle cx="100.5" cy="72" r="2.2" fill="#FFFFFF" />

                <circle cx="60" cy="76" r="1.1" fill="#FFFFFF" />
                <circle cx="104" cy="76" r="1.1" fill="#FFFFFF" />
              </g>
            )}

            {/* Mouth */}
            {mood === MOOCA_MOOD.SAD ? (
              <path
                d="M 76 86 Q 80 82 84 86"
                stroke="#006B63"
                strokeWidth="2.6"
                strokeLinecap="round"
                fill="none"
              />
            ) : mood === MOOCA_MOOD.DRINKING ? (
              <ellipse
                cx="80"
                cy="85"
                rx="3.5"
                ry="4.5"
                fill="#006B63"
              />
            ) : mood === MOOCA_MOOD.CELEBRATING ||
              mood === MOOCA_MOOD.HAPPY ||
              isBlushing ? (
              <path
                d="M 72 81 Q 80 94 88 81 Z"
                fill="#FF8080"
                stroke="#006B63"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
            ) : (
              <path
                d="M 73 81 Q 80 89 87 81"
                stroke="#006B63"
                strokeWidth="2.8"
                strokeLinecap="round"
                fill="none"
              />
            )}

            {/* Scarf */}
            <g>
              <rect
                x="44"
                y="97"
                width="72"
                height="16"
                rx="8"
                fill="#FA8C3D"
                stroke="#D97706"
                strokeWidth="1.8"
              />

              {[56, 68, 80, 92, 104].map((x) => (
                <line
                  key={x}
                  x1={x}
                  y1="97"
                  x2={x}
                  y2="113"
                  stroke="#FFF0E6"
                  strokeWidth="2"
                  strokeDasharray="3,2"
                />
              ))}

              <rect
                x="90"
                y="107"
                width="16"
                height="22"
                rx="6"
                fill="#FA8C3D"
                stroke="#D97706"
                strokeWidth="1.8"
              />

              {[94, 98, 102].map((x) => (
                <line
                  key={x}
                  x1={x}
                  y1="125"
                  x2={x}
                  y2="130"
                  stroke="#D97706"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              ))}
            </g>
          </svg>

          {/* Sunny */}
          {showSunny && (
            <div
              ref={sunnyRef}
              className={styles.sunnyContainer}
              aria-hidden="true"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 36 36"
              >
                <g
                  stroke="#FFA726"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                >
                  <line x1="18" y1="2" x2="18" y2="7" />
                  <line x1="18" y1="29" x2="18" y2="34" />
                  <line x1="2" y1="18" x2="7" y2="18" />
                  <line x1="29" y1="18" x2="34" y2="18" />
                  <line x1="6.7" y1="6.7" x2="10.2" y2="10.2" />
                  <line x1="25.8" y1="25.8" x2="29.3" y2="29.3" />
                  <line x1="6.7" y1="29.3" x2="10.2" y2="25.8" />
                  <line x1="25.8" y1="10.2" x2="29.3" y2="6.7" />
                </g>

                <circle
                  cx="18"
                  cy="18"
                  r="9"
                  fill="#FFCA28"
                  stroke="#F57C00"
                  strokeWidth="1.2"
                />

                <circle cx="15.5" cy="16.5" r="1.2" fill="#4E342E" />
                <circle cx="20.5" cy="16.5" r="1.2" fill="#4E342E" />

                <circle
                  cx="13.5"
                  cy="18"
                  r="1.8"
                  fill="#FF8A80"
                  opacity="0.75"
                />

                <circle
                  cx="22.5"
                  cy="18"
                  r="1.8"
                  fill="#FF8A80"
                  opacity="0.75"
                />

                <path
                  d="M 15.5 19.5 Q 18 22 20.5 19.5"
                  stroke="#4E342E"
                  strokeWidth="1.2"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          )}
        </button>
      </div>
    </div>
  );
};