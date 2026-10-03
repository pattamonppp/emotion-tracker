import React, { useEffect, useRef, useState } from 'react';
import {
  Sparkles,
  Headphones,
  Play,
  Pause,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';

import { MBTIType } from '../../../types';
import {
  MBTI_SANCTUARY_SCRIPTS,
  getMBTIArchetype,
} from '../../../data/matrixData';
import { audioService } from '../../../services/audioService';
import { MarshmallowButton } from '../../../design-system/MarshmallowButton';
import { MoocaMascot } from '../../../components/MoocaMascot';
import { useSky } from '../../../components/DynamicSkyEngine';
import { getTranslation } from '../../../locales';

import styles from './styles.module.scss';

export interface AudioMatrixSanctuaryProps {
  mbti?: MBTIType;
  onComplete: () => void;
  lang: 'th' | 'en';
}

const WAVE_HEIGHTS = [26, 48, 22, 64, 40, 58, 30, 52, 36, 20];

const WAVE_LOW = [
  0.25,
  0.73,
  0.49,
  0.61,
  0.73,
  0.85,
  0.37,
  0.61,
  0.49,
  0.73,
];

const WAVE_HIGH = [
  0.98,
  0.74,
  0.66,
  0.74,
  0.82,
  0.90,
  0.74,
  0.66,
  0.90,
  0.82,
];

const WAVE_DURATION = [
  380,
  500,
  620,
  740,
  860,
  380,
  500,
  620,
  740,
  860,
];

const baseShadow =
  '0 2px 8px rgba(15, 23, 42, 0.08), 0 1px 3px rgba(15, 23, 42, 0.06)';

export const AudioMatrixSanctuary: React.FC<
  AudioMatrixSanctuaryProps
> = ({ mbti = 'INFP', onComplete, lang }) => {
  const t = getTranslation(lang);
  const strings = t.phases.phase2.audioMatrix;

  const { activePeriod } = useSky();

  const [isPlaying, setIsPlaying] = useState(true);
  const [countdown, setCountdown] = useState(25);

  const archetype = getMBTIArchetype(mbti);
  const script = MBTI_SANCTUARY_SCRIPTS[archetype];

  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    const start = performance.now();

    const tick = () => {
      const elapsed = performance.now() - start;

      /*
       * Keeps React Native-style timing alive without
       * changing the actual visual values in the DOM.
       */
      void elapsed;

      animationRef.current =
        requestAnimationFrame(tick);
    };

    animationRef.current =
      requestAnimationFrame(tick);

    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying]);

  useEffect(() => {
    audioService.startNeuralEntrainment('both');

    const text = script[lang];

    audioService.playVoiceSanctuary(
      text,
      lang,
      0.86,
    );

    setIsPlaying(true);

    const timer = window.setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          window.clearInterval(timer);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => {
      window.clearInterval(timer);
      audioService.stopAllVoice();
    };
  }, [mbti, lang]);

  const togglePlayback = () => {
    if (isPlaying) {
      audioService.stopAllVoice();
      audioService.triggerHaptic('selection');
      setIsPlaying(false);
      return;
    }

    audioService.triggerHaptic('medium');
    audioService.startNeuralEntrainment('both');

    const text = script[lang];

    audioService.playVoiceSanctuary(
      text,
      lang,
      0.86,
    );

    setIsPlaying(true);
  };

  const handleReplay = () => {
    audioService.stopAllVoice();
    audioService.triggerHaptic('medium');
    audioService.startNeuralEntrainment('both');

    const text = script[lang];

    audioService.playVoiceSanctuary(
      text,
      lang,
      0.86,
    );

    setCountdown(25);
    setIsPlaying(true);
  };

  const getSkyColors = () => {
    switch (activePeriod) {
      case 'sunset':
        return {
          cardBg: 'rgba(255, 255, 255, 0.90)',
          cardBorder: '#FAD6D5',
          badgeBg: '#FDEFEE',
          badgeBorder: '#FAD6D5',
          badgeText: '#E44743',
          scriptTitle: '#E85A56',
          scriptText: '#EB6460',
          waveColor: '#EF7773',
          hintText: '#FFFFFF',
        };

      case 'night':
        return {
          cardBg: 'rgba(38, 49, 60, 0.92)',
          cardBorder: 'rgba(143, 187, 239, 0.4)',
          badgeBg: 'rgba(0, 0, 0, 0.85)',
          badgeBorder: 'rgba(143, 187, 239, 0.4)',
          badgeText: '#8FBBEF',
          scriptTitle: '#62A0E9',
          scriptText: '#FFFFFF',
          waveColor: '#1F77DF',
          hintText: '#79ADA9',
        };

      case 'dawn':
        return {
          cardBg: 'rgba(255, 255, 255, 0.92)',
          cardBorder: '#F8E4B3',
          badgeBg: '#FCF4E0',
          badgeBorder: '#F8E4B3',
          badgeText: '#D97800',
          scriptTitle: '#DF8900',
          scriptText: '#E39200',
          waveColor: '#F9A000',
          hintText: '#D97800',
        };

      default:
        return {
          cardBg: 'rgba(255, 255, 255, 0.92)',
          cardBorder: '#B3EDE8',
          badgeBg: '#E0F8F6',
          badgeBorder: '#B3EDE8',
          badgeText: '#009688',
          scriptTitle: '#009688',
          scriptText: '#355956',
          waveColor: '#00C4B3',
          hintText: '#79ADA9',
        };
    }
  };

  const skyTheme = getSkyColors();

  return (
    <div className={styles.container}>
      <div className={styles.mascotWrapper}>
        <MoocaMascot
          mood={
            countdown === 0
              ? 'celebrating'
              : 'listening'
          }
          size="sm"
          speakingBubble={
            countdown === 0
              ? strings.bubbleDone
              : strings.bubblePlaying
          }
        />
      </div>

      <div
        className={styles.mbtiBadge}
        style={{
          backgroundColor: skyTheme.badgeBg,
          borderColor: skyTheme.badgeBorder,
          boxShadow: baseShadow,
        }}
      >
        <Headphones
          size={13}
          color={skyTheme.badgeText}
        />

        <span
          className={styles.mbtiBadgeText}
          style={{
            color: skyTheme.badgeText,
          }}
        >
          {strings.binauralAlpha}
        </span>
      </div>

      <div className={styles.centerStage}>
        <div className={styles.waveformContainer}>
          {WAVE_HEIGHTS.map((height, index) => (
            <div
              key={index}
              className={
                isPlaying
                  ? styles.wavePill
                  : styles.wavePillPaused
              }
              style={{
                height,
                backgroundColor: skyTheme.waveColor,

                /*
                 * These are the exact RN low/high values
                 * translated into a CSS animation.
                 */
                ['--wave-low' as string]:
                  WAVE_LOW[index],
                ['--wave-high' as string]:
                  WAVE_HIGH[index],
                ['--wave-duration' as string]:
                  `${WAVE_DURATION[index]}ms`,
              }}
            />
          ))}
        </div>

        <div className={styles.controlsRow}>
          <button
            type="button"
            className={styles.playPauseBtn}
            onClick={togglePlayback}
            aria-label={
              isPlaying ? 'Pause' : 'Play'
            }
          >
            {isPlaying ? (
              <Pause
                size={18}
                color="#FFFFFF"
                fill="#FFFFFF"
              />
            ) : (
              <Play
                size={18}
                color="#FFFFFF"
                fill="#FFFFFF"
                style={{
                  marginLeft: 2,
                }}
              />
            )}
          </button>

          <button
            type="button"
            className={styles.replayBtn}
            onClick={handleReplay}
            aria-label="Replay"
            style={{
              backgroundColor: skyTheme.cardBg,
              borderColor: skyTheme.cardBorder,
            }}
          >
            <RotateCcw
              size={18}
              color={skyTheme.scriptTitle}
            />
          </button>
        </div>

        <span
          className={styles.audioStatusHint}
          style={{
            color: skyTheme.hintText,
          }}
        >
          {isPlaying
            ? strings.playingHint
            : strings.tapResumeHint}
        </span>
      </div>

      <div
        className={styles.scriptCard}
        style={{
          backgroundColor: skyTheme.cardBg,
          borderColor: skyTheme.cardBorder,
          boxShadow: baseShadow,
        }}
      >
        <div className={styles.scriptHeader}>
          <Sparkles
            size={14}
            color={skyTheme.scriptTitle}
          />

          <span
            className={styles.scriptCategory}
            style={{
              color: skyTheme.scriptTitle,
            }}
          >
            {strings.voiceLabel}
          </span>
        </div>

        <p
          className={styles.scriptText}
          style={{
            color: skyTheme.scriptText,
          }}
        >
          "
          {lang === 'th'
            ? script.th
            : script.en}
          "
        </p>
      </div>

      <div className={styles.actionSection}>
        {countdown > 0 ? (
          <span
            className={styles.organicSensorHint}
            style={{
              color: skyTheme.hintText,
            }}
          >
            {strings.alphaTherapy.replace(
              '{countdown}',
              String(countdown),
            )}
          </span>
        ) : (
          <MarshmallowButton
            variant="primary"
            size="md"
            onPress={() => {
              audioService.stopAllVoice();
              onComplete();
            }}
            icon={
              <ArrowRight
                size={16}
                color="#FFFFFF"
              />
            }
            title={strings.proceed}
          />
        )}
      </div>
    </div>
  );
};

export default AudioMatrixSanctuary;