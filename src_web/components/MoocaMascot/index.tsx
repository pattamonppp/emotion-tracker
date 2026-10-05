import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Heart, Sparkles } from 'lucide-react';

import happyMoocaUrl from '../../../assets/mooca/Mooca=Happy Mooca with Sunny, Size=L.png';
import huggingSunnyUrl from '../../../assets/mooca/Mooca=Mooca hugging sunny, Size=L.svg';
import thanksMoocaUrl from '../../../assets/mooca/Mooca=Mooca Thanks!, Size=L.svg';
import phoneMoocaUrl from '../../../assets/mooca/Mooca=Mooca using phone, Size=L.png';
import sadMoocaUrl from '../../../assets/mooca/Mooca=Sad Mooca, Size=L.svg';
import walletEnoughUrl from '../../../assets/mooca/Mooca=Mooca Wallet (enough), Size=L.svg';
import walletNotEnoughUrl from '../../../assets/mooca/Mooca=Mooca Wallet (not enough), Size=L.svg';

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
  WALLET_ENOUGH: 'wallet_enough',
  WALLET_NOT_ENOUGH: 'wallet_not_enough',
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

const getMascotAssetUrl = (mood: MoocaMood): string => {
  switch (mood) {
    case MOOCA_MOOD.HUGGING:
    case MOOCA_MOOD.COMFORTING:
    case MOOCA_MOOD.RUBBING:
      return huggingSunnyUrl;
    case MOOCA_MOOD.PRAYING:
      return thanksMoocaUrl;
    case MOOCA_MOOD.SAD:
      return sadMoocaUrl;
    case MOOCA_MOOD.WALLET_ENOUGH:
      return walletEnoughUrl;
    case MOOCA_MOOD.WALLET_NOT_ENOUGH:
      return walletNotEnoughUrl;
    case MOOCA_MOOD.LISTENING:
    case MOOCA_MOOD.SLEEPY:
      return phoneMoocaUrl;
    case MOOCA_MOOD.HAPPY:
    case MOOCA_MOOD.CELEBRATING:
    case MOOCA_MOOD.DRINKING:
    case MOOCA_MOOD.SHAKING:
    default:
      return happyMoocaUrl;
  }
};

export const MoocaMascot: React.FC<MoocaMascotProps> = ({
  mood = 'happy',
  size = 'md',
  showSunny = true,
  speakingBubble,
  interactive = true,
  onHug,
}) => {
  const [petMessage, setPetMessage] = useState<string | null>(null);
  const [isPetting, setIsPetting] = useState(false);

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

    setIsPetting(true);

    const msg =
      SWEET_MESSAGES[Math.floor(Math.random() * SWEET_MESSAGES.length)];

    setPetMessage(msg);

    onHug?.();

    timeoutRef.current = setTimeout(() => {
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
          aria-label="Mooca Mascot"
        >
          <img
            src={getMascotAssetUrl(mood)}
            alt={`Mooca (${mood})`}
            className={styles.mascotImg}
            draggable={false}
          />
        </button>
      </div>
    </div>
  );
};