import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { MBTIType } from '../../../types';
import { MBTI_SANCTUARY_SCRIPTS, getMBTIArchetype } from '../../../data/matrixData';
import { audioService } from '../../../services/audioService';
import { MarshmallowButton } from '../../../design-system/MarshmallowButton';
import { MoocaMascot } from '../../../components/MoocaMascot';
import { useSky } from '../../../components/DynamicSkyEngine';
import { Sparkles, Headphones, Play, Pause, ArrowRight, RotateCcw } from 'lucide-react';
import { getTranslation } from '../../../locales';
import styles from './styles.module.scss';

export interface AudioMatrixSanctuaryProps {
  mbti?: MBTIType;
  onComplete: () => void;
  lang: 'th' | 'en';
}

export const AudioMatrixSanctuary: React.FC<AudioMatrixSanctuaryProps> = ({
  mbti = 'INFP',
  onComplete,
  lang,
}) => {
  const t = getTranslation(lang);
  const strings = t.phases.phase2.audioMatrix;
  const { activePeriod } = useSky();
  const [isPlaying, setIsPlaying] = useState(true);
  const [countdown, setCountdown] = useState(25);
  const archetype = getMBTIArchetype(mbti);
  const script = MBTI_SANCTUARY_SCRIPTS[archetype];

  // 10 equalizer bar scale levels
  const [waveScales, setWaveScales] = useState<number[]>([
    0.4, 0.7, 0.5, 0.9, 0.6, 0.85, 0.45, 0.8, 0.55, 0.35,
  ]);
  const animFrameRef = useRef<number | null>(null);

  // Undulating audio visualizer animation loop
  useEffect(() => {
    if (!isPlaying) {
      setWaveScales([0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2]);
      return;
    }

    let step = 0;
    const animateWaves = () => {
      step += 0.08;
      setWaveScales((prev) =>
        prev.map((_, i) => {
          const s = Math.sin(step + i * 0.6) * 0.35 + 0.6;
          return Math.max(0.2, Math.min(1.0, s));
        })
      );
      animFrameRef.current = requestAnimationFrame(animateWaves);
    };

    animFrameRef.current = requestAnimationFrame(animateWaves);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying]);

  // Audio start & countdown
  useEffect(() => {
    audioService.startNeuralEntrainment('both');
    const text = script[lang];
    audioService.playVoiceSanctuary(text, lang, 0.86);
    setIsPlaying(true);

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
      audioService.stopAllVoice();
    };
  }, [mbti, lang]);

  const togglePlayback = () => {
    if (isPlaying) {
      audioService.stopAllVoice();
      audioService.triggerHaptic('selection');
      setIsPlaying(false);
    } else {
      audioService.triggerHaptic('medium');
      audioService.startNeuralEntrainment('both');
      const text = script[lang];
      audioService.playVoiceSanctuary(text, lang, 0.86);
      setIsPlaying(true);
    }
  };

  const handleReplay = () => {
    audioService.stopAllVoice();
    audioService.triggerHaptic('medium');
    audioService.startNeuralEntrainment('both');
    const text = script[lang];
    audioService.playVoiceSanctuary(text, lang, 0.86);
    setCountdown(25);
    setIsPlaying(true);
  };

  const isNight = activePeriod === 'night';
  const isSunset = activePeriod === 'sunset';
  const isDawn = activePeriod === 'dawn';

  return (
    <div className={styles.container}>
      {/* 1. Mascot View - 145px Height */}
      <div className={styles.mascotWrapper}>
        <MoocaMascot
          mood={countdown === 0 ? 'celebrating' : 'listening'}
          size="sm"
          speakingBubble={
            countdown === 0 ? strings.bubbleDone : strings.bubblePlaying
          }
        />
      </div>

      {/* 2. MBTI Acoustic Profile Pill */}
      <div
        className={classNames(styles.mbtiBadge, {
          [styles.badgeNight]: isNight,
          [styles.badgeSunset]: isSunset,
          [styles.badgeDawn]: isDawn,
        })}
      >
        <Headphones size={13} />
        <span className={styles.mbtiBadgeText}>{strings.binauralAlpha}</span>
      </div>

      {/* 3. Center Stage: Moving Voice Wave Bars + Controls */}
      <div className={styles.centerStage}>
        <div className={styles.waveformContainer}>
          {waveScales.map((scale, idx) => {
            const baseHeights = [26, 48, 22, 64, 40, 58, 30, 52, 36, 20];
            return (
              <div
                key={idx}
                className={classNames(styles.wavePill, {
                  [styles.waveNight]: isNight,
                  [styles.waveSunset]: isSunset,
                  [styles.waveDawn]: isDawn,
                })}
                style={{
                  height: `${baseHeights[idx]}px`,
                  transform: `scaleY(${scale})`,
                }}
              />
            );
          })}
        </div>

        {/* Tactile Control Buttons Row */}
        <div className={styles.controlsRow}>
          <button
            type="button"
            onClick={togglePlayback}
            className={styles.playPauseBtn}
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause size={18} color="#FFFFFF" fill="#FFFFFF" />
            ) : (
              <Play size={18} color="#FFFFFF" fill="#FFFFFF" style={{ marginLeft: 2 }} />
            )}
          </button>

          <button
            type="button"
            onClick={handleReplay}
            className={classNames(styles.replayBtn, {
              [styles.btnNight]: isNight,
            })}
            title="Replay"
          >
            <RotateCcw size={18} color={isNight ? '#38BDF8' : '#00C4B3'} />
          </button>
        </div>

        <span
          className={classNames(styles.audioStatusHint, {
            [styles.hintNight]: isNight,
          })}
        >
          {isPlaying ? strings.playingHint : strings.tapResumeHint}
        </span>
      </div>

      {/* 4. Celestial Voice Affirmation Script Box */}
      <div
        className={classNames(styles.scriptCard, {
          [styles.cardNight]: isNight,
          [styles.cardSunset]: isSunset,
          [styles.cardDawn]: isDawn,
        })}
      >
        <div className={styles.scriptHeader}>
          <Sparkles size={14} />
          <span className={styles.scriptCategory}>{strings.voiceLabel}</span>
        </div>

        <p className={styles.scriptText}>
          "{lang === 'th' ? script.th : script.en}"
        </p>
      </div>

      {/* 5. Action Section */}
      <div className={styles.actionSection}>
        {countdown > 0 ? (
          <span
            className={classNames(styles.organicSensorHint, {
              [styles.hintNight]: isNight,
            })}
          >
            {strings.alphaTherapy.replace('{countdown}', String(countdown))}
          </span>
        ) : (
          <MarshmallowButton
            variant="primary"
            size="md"
            onPress={() => {
              audioService.stopAllVoice();
              onComplete();
            }}
            icon={<ArrowRight size={16} color="#FFFFFF" />}
            title={strings.proceed}
          />
        )}
      </div>
    </div>
  );
};

export default AudioMatrixSanctuary;
