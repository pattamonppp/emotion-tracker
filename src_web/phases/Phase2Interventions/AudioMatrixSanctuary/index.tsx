import React, { useState, useEffect, useRef } from 'react';
import cn from 'classnames';
import { MBTIType } from '../../../types';
import { MBTI_SANCTUARY_SCRIPTS, getMBTIArchetype } from '../../../data/matrixData';
import { audioService } from '../../../services/audioService';
import { Button } from '../../../components/Button';
import { MoocaMascot } from '../../../components/MoocaMascot';
import { getTranslation } from '../../../locales';
import { Headphones, Volume2, Sparkles } from 'lucide-react';
import {
  AUDIO_SANCTUARY_CONFIG,
  type SoundMode,
  type BrainwaveMode,
} from './constants';
import styles from './styles.module.scss';

export interface AudioMatrixSanctuaryProps {
  mbti: MBTIType;
  onComplete: () => void;
  lang: 'th' | 'en';
}

export const AudioMatrixSanctuary: React.FC<AudioMatrixSanctuaryProps> = ({
  mbti,
  onComplete,
  lang,
}) => {
  const strings = getTranslation(lang).phases.phase2.audioMatrix;
  const [isPlaying, setIsPlaying] = useState(false);
  const [soundMode] = useState<SoundMode>('both');
  const [brainwave, setBrainwave] = useState<BrainwaveMode>('alpha');
  const [secondsRemaining, setSecondsRemaining] = useState<number>(
    AUDIO_SANCTUARY_CONFIG.TOTAL_DURATION_SEC
  );
  const [isDone, setIsDone] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const archetype = getMBTIArchetype(mbti);
  const voiceScript = MBTI_SANCTUARY_SCRIPTS[archetype][lang];

  // Visualizer Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = AUDIO_SANCTUARY_CONFIG.CANVAS_WIDTH);
    const height = (canvas.height = AUDIO_SANCTUARY_CONFIG.CANVAS_HEIGHT);
    let step = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      step += 0.04;

      const bars = AUDIO_SANCTUARY_CONFIG.SPECTRUM_BARS;
      const barWidth = 4;
      const gap = (width - bars * barWidth) / (bars - 1);

      for (let i = 0; i < bars; i++) {
        const amp = isPlaying
          ? Math.sin(step + i * 0.25) * 22 + Math.cos(step * 0.8 + i * 0.15) * 12 + 30
          : 6;

        const x = i * (barWidth + gap);
        const y = (height - amp) / 2;

        const grad = ctx.createLinearGradient(0, y, 0, y + amp);
        grad.addColorStop(0, '#00C4B3');
        grad.addColorStop(1, '#62A0E9');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, amp, 3);
        ctx.fill();
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying]);

  useEffect(() => {
    startAudio();

    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsDone(true);
          audioService.playChimeShockwave();
          return 0;
        }
        if (prev % AUDIO_SANCTUARY_CONFIG.HAPTIC_INTERVAL_SEC === 0) {
          audioService.triggerHaptic(18);
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
      audioService.stopNeuralEntrainment();
    };
  }, []);

  const startAudio = () => {
    audioService.startNeuralEntrainment(soundMode);
    audioService.playVoiceSanctuary(voiceScript, lang, 0.86);
    setIsPlaying(true);
  };

  const replayVoice = () => {
    audioService.playVoiceSanctuary(voiceScript, lang, 0.86);
  };

  return (
    <div className={styles.container}>
      {/* Top Protocol Spec */}
      <div className={styles.headerBar}>
        <div className={styles.headerLeft}>
          <Headphones />
          <span className={styles.headerTitle}>
            {strings.header}
          </span>
        </div>
        <span className={styles.mbtiBadge}>
          MBTI: {mbti}
        </span>
      </div>

      {/* Mooca Mascot in Headphones */}
      <div className={styles.guidanceSection}>
        <MoocaMascot
          mood={isDone ? 'celebrating' : 'listening'}
          size="xs"
          speakingBubble={
            isDone ? strings.bubbleDone : strings.bubblePlaying
          }
        />

        <h3 className={styles.guidanceTitle}>
          <Sparkles />
          {strings.title}
        </h3>
        <p className={styles.guidanceDesc}>
          {strings.description}
        </p>
      </div>

      {/* Live Frequency Spectrum Visualizer */}
      <div className={styles.visualizerCard}>
        <canvas ref={canvasRef} className={styles.canvas} />
        <div className={styles.visualizerMeta}>
          <span className={styles.alphaText}>10 Hz Binaural Alpha</span>
          <span className={styles.timerText}>{secondsRemaining}s remaining</span>
          <span className={styles.noiseText}>Brown Noise 320Hz</span>
        </div>
      </div>

      {/* Pre-Generated Voice Sanctuary Transcript Card */}
      <div className={styles.transcriptCard}>
        <div className={styles.transcriptHeader}>
          <span className={styles.transcriptLabel}>
            <Volume2 />
            {strings.voiceLabel}
          </span>
          <button
            type="button"
            onClick={replayVoice}
            className={styles.replayBtn}
          >
            {strings.replay}
          </button>
        </div>
        <p className={styles.transcriptBody}>
          "{voiceScript}"
        </p>
      </div>

      {/* Brainwave selector & Thumb Zone Action */}
      <div className={styles.actionZone}>
        <div className={styles.brainwaveGrid}>
          {(['alpha', 'theta', 'delta', 'gamma'] as BrainwaveMode[]).map((bw) => (
            <button
              key={bw}
              type="button"
              onClick={() => {
                setBrainwave(bw);
                audioService.triggerHaptic(15);
              }}
              className={cn(styles.brainwaveBtn, {
                [styles.active]: brainwave === bw,
              })}
            >
              {bw === 'alpha' ? 'α 10Hz' : bw === 'theta' ? 'θ 6Hz' : bw === 'delta' ? 'δ 2Hz' : 'γ 40Hz'}
            </button>
          ))}
        </div>

        <Button
          variant="primary"
          colorTheme="turquoise"
          size="lg"
          fullWidth
          onClick={onComplete}
          label={
            isDone ? strings.proceed : strings.ready
          }
        />
      </div>
    </div>
  );
};

export default AudioMatrixSanctuary;
