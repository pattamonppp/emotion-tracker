/**
 * Zero-Latency Audio Matrix & Acoustic Engineering
 * Layer 1: Neural Entrainment Soundscapes (Binaural Beats Alpha 8-12Hz, Brownian Noise, Healing Drones)
 * Layer 2: Tactile Sensation & Audio Synthesis (Friction rubbing, Liquid pouring/gulping, Tension clacks, Chimes)
 * Layer 3: MBTI Voice Sanctuary (Curated pre-generated vocal soothing & affirmations in Thai/English)
 */

import { LANG, Language } from "@/types";
import dreamscapeUrl from '../../assets/audio/dreamscape.wav';

class AudioMatrixService {
  private ctx: AudioContext | null = null;
  private binauralLeft: OscillatorNode | null = null;
  private binauralRight: OscillatorNode | null = null;
  private binauralGain: GainNode | null = null;
  private brownNoiseNode: AudioNode | null = null;
  private brownNoiseGain: GainNode | null = null;
  private isAmbiencePlaying = false;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }


  // Trigger tactile feedback on supported mobile browsers.
  public async triggerHaptic(
    style: HapticStyle | number | number[] = HAPTIC_STYLE.MEDIUM,
  ): Promise<void> {
    try {
      if (
        typeof window === 'undefined' ||
        !('vibrate' in navigator)
      ) {
        return;
      }

      if (typeof style === 'number' || Array.isArray(style)) {
        navigator.vibrate(style);
        return;
      }

      const patterns: Record<HapticStyle, number | number[]> = {
        light: 10,
        medium: 20,
        heavy: 35,

        // Short single pulse for selection/tap.
        selection: 8,

        // Short double pulse.
        success: [15, 30, 15],

        // Slightly stronger double pulse.
        warning: [25, 40, 25],
      };

      navigator.vibrate(patterns[style]);
    } catch {
      // Vibration may not be supported or permitted.
    }
  }

  private jarDropIndex = 0;

  // Gentle Crystal-Glass Chime & Warm Waterdrop (for dropping emotion clouds into glass jar)
  public playJarDrop(index?: number) {
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const noteIdx = typeof index === 'number' ? index % 3 : this.jarDropIndex++ % 3;

    // Soothing pentatonic notes: C6 (1046.5Hz), E6 (1318.5Hz), G6 (1568Hz)
    const basePitches = [1046.5, 1318.51, 1567.98];
    const dropPitches = [523.25, 659.25, 783.99];
    const chimeFreq = basePitches[noteIdx];
    const dropFreq = dropPitches[noteIdx];

    // Master filter to keep sound warm and rounded (no harsh digital edges)
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2600, now);

    // 1. Crystal Glass Chime Layer (delicate bell fundamental)
    const oscChime = this.ctx.createOscillator();
    const gainChime = this.ctx.createGain();
    oscChime.type = 'sine';
    oscChime.frequency.setValueAtTime(chimeFreq, now);

    gainChime.gain.setValueAtTime(0.001, now);
    gainChime.gain.linearRampToValueAtTime(0.09, now + 0.014);
    gainChime.gain.exponentialRampToValueAtTime(0.0001, now + 0.65);

    oscChime.connect(gainChime);
    gainChime.connect(filter);

    // 2. Glass Harmonic Overtone (Fifth)
    const oscFifth = this.ctx.createOscillator();
    const gainFifth = this.ctx.createGain();
    oscFifth.type = 'sine';
    oscFifth.frequency.setValueAtTime(chimeFreq * 1.5, now);

    gainFifth.gain.setValueAtTime(0.001, now);
    gainFifth.gain.linearRampToValueAtTime(0.022, now + 0.012);
    gainFifth.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);

    oscFifth.connect(gainFifth);
    gainFifth.connect(filter);

    // 3. Warm Droplet Body (soft subtle scoop into jar)
    const oscDrop = this.ctx.createOscillator();
    const gainDrop = this.ctx.createGain();
    oscDrop.type = 'sine';
    oscDrop.frequency.setValueAtTime(dropFreq * 1.15, now);
    oscDrop.frequency.exponentialRampToValueAtTime(dropFreq, now + 0.12);

    gainDrop.gain.setValueAtTime(0.001, now);
    gainDrop.gain.linearRampToValueAtTime(0.065, now + 0.012);
    gainDrop.gain.exponentialRampToValueAtTime(0.0001, now + 0.32);

    oscDrop.connect(gainDrop);
    gainDrop.connect(filter);

    filter.connect(this.ctx.destination);

    oscChime.start(now);
    oscFifth.start(now);
    oscDrop.start(now);

    oscChime.stop(now + 0.7);
    oscFifth.stop(now + 0.45);
    oscDrop.stop(now + 0.35);
  }

  // Friction rub sound for Option A (The Somatic Absorption)
  public playFrictionTick(intensity = 0.5) {
    this.initContext();
    if (!this.ctx) return;
    // this.triggerHaptic(Math.round(8 + intensity * 20));

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(140 + intensity * 180, now);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(400 + intensity * 600, now);
    filter.Q.setValueAtTime(3, now);

    gain.gain.setValueAtTime(0.08 * intensity, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.07);
  }

  // Chime Shockwave (when Sigil of Confidence is fully absorbed)
  public playChimeShockwave() {
    this.initContext();
    if (!this.ctx) return;
    // this.triggerHaptic([60, 40, 80, 50, 100]);

    const freqs = [528, 660, 792, 1056]; // 528Hz Solfeggio "Transformation & Miracles"
    freqs.forEach((freq, idx) => {
      if (!this.ctx) return;
      const now = this.ctx.currentTime + idx * 0.04;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.25 / (idx + 1), now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.5);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 2.6);
    });
  }

  // Gentle warm harmonic chime for completing pulse calibration
  public playPulseComplete() {
    this.initContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const freqs = [528, 660, 792]; // Peaceful warm triad
    freqs.forEach((freq, idx) => {
      if (!this.ctx) return;
      const t = now + idx * 0.07;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.12 / (idx + 1), t + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 1.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 1.25);
    });
  }

  // Liquid Gulp & Slosh (Option B: The Victory Sip)
  public playLiquidSip(sipNumber = 1) {
    this.initContext();
    if (!this.ctx) return;
    // this.triggerHaptic([40, 60, 50]);

    const now = this.ctx.currentTime;
    // Water drop & swallow resonance
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    const baseFreq = 300 - sipNumber * 30;
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.8, now + 0.12);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.8, now + 0.35);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.36);
  }

  // Tension Shaker Click (Option C: Kinetic Tension Shaker)
  public playShakerClick(remaining: number) {
    this.initContext();
    if (!this.ctx) return;
    // this.triggerHaptic(25);

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(200 + (15 - remaining) * 35, now);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.06);
  }

  // Start Alpha Wave Binaural Beat (10 Hz beat frequency: 200 Hz Left, 210 Hz Right)
  public startNeuralEntrainment(type: NeutralEnvironmentType = NEUTRAL_ENVIRONMENT_TYPE.BOTH) {
    this.initContext();
    if (!this.ctx || this.isAmbiencePlaying) return;

    this.isAmbiencePlaying = true;
    const now = this.ctx.currentTime;

    // 1. Binaural Beats (Alpha Wave 10Hz)
    const baseFreq = 216; // A 432Hz octave down
    const beatFreq = 10;  // 10 Hz Alpha Calm Focus

    const merger = this.ctx.createChannelMerger(2);
    this.binauralGain = this.ctx.createGain();
    this.binauralGain.gain.setValueAtTime(0.001, now);
    this.binauralGain.gain.linearRampToValueAtTime(0.12, now + 2); // soft fade in

    // Left channel (216 Hz)
    this.binauralLeft = this.ctx.createOscillator();
    this.binauralLeft.type = 'sine';
    this.binauralLeft.frequency.setValueAtTime(baseFreq, now);

    // Right channel (226 Hz -> 10Hz Alpha differential)
    this.binauralRight = this.ctx.createOscillator();
    this.binauralRight.type = 'sine';
    this.binauralRight.frequency.setValueAtTime(baseFreq + beatFreq, now);

    this.binauralLeft.connect(merger, 0, 0);
    this.binauralRight.connect(merger, 0, 1);
    merger.connect(this.binauralGain);
    this.binauralGain.connect(this.ctx.destination);

    this.binauralLeft.start(now);
    this.binauralRight.start(now);

    // 2. Brownian Noise (Warm deep pink/brown noise)
    if (type === 'brown' || type === 'both') {
      const bufferSize = this.ctx.sampleRate * 2;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5; // boost gain
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      // Lowpass filter to ensure soothing sub-bass calm
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, now);

      this.brownNoiseGain = this.ctx.createGain();
      this.brownNoiseGain.gain.setValueAtTime(0.001, now);
      this.brownNoiseGain.gain.linearRampToValueAtTime(0.15, now + 2);

      whiteNoise.connect(filter);
      filter.connect(this.brownNoiseGain);
      this.brownNoiseGain.connect(this.ctx.destination);

      whiteNoise.start(now);
      this.brownNoiseNode = whiteNoise;
    }
  }

  // Stop ambient sounds smoothly
  public stopNeuralEntrainment() {
    if (!this.ctx || !this.isAmbiencePlaying) return;
    const now = this.ctx.currentTime;

    if (this.binauralGain) {
      this.binauralGain.gain.linearRampToValueAtTime(0.001, now + 0.8);
      setTimeout(() => {
        try {
          this.binauralLeft?.stop();
          this.binauralRight?.stop();
          this.binauralLeft?.disconnect();
          this.binauralRight?.disconnect();
        } catch {
          // ignore
        }
      }, 900);
    }

    if (this.brownNoiseGain) {
      this.brownNoiseGain.gain.linearRampToValueAtTime(0.001, now + 0.8);
      setTimeout(() => {
        try {
          (this.brownNoiseNode as AudioBufferSourceNode)?.stop();
          this.brownNoiseNode?.disconnect();
        } catch {
          // ignore
        }
      }, 900);
    }

    this.isAmbiencePlaying = false;
  }

  // Pre-Generated Studio MBTI Voice Sanctuary
  public playVoiceSanctuary(text: string, lang: Language = LANG.TH, rate = 0.88) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === LANG.TH ? 'th-TH' : 'en-US';
      utterance.rate = rate; // slow, grounded pacing
      utterance.pitch = 0.95; // warm, resonant pitch
      window.speechSynthesis.speak(utterance);
    } catch {
      // ignore
    }
  }

  private isBgmPlaying = false;
  private bgmListeners: Array<(isPlaying: boolean) => void> = [];
  private bgmAudio: HTMLAudioElement | null = null;
  private hasAddedAutoplayUnlock = false;

  private initBgmAudio() {
    if (!this.bgmAudio && typeof Audio !== 'undefined') {
      try {
        this.bgmAudio = new Audio(dreamscapeUrl);
        this.bgmAudio.loop = true;
        this.bgmAudio.volume = 0.35;
      } catch {
        // audio element fallback
      }
    }
  }

  private setupAutoplayUnlock() {
    if (this.hasAddedAutoplayUnlock || typeof window === 'undefined') return;
    this.hasAddedAutoplayUnlock = true;

    const unlock = () => {
      if (this.bgmAudio && this.isBgmPlaying && this.bgmAudio.paused) {
        this.bgmAudio.play().catch(() => {});
      }
      window.removeEventListener('click', unlock);
      window.removeEventListener('keydown', unlock);
      window.removeEventListener('touchstart', unlock);
    };

    window.addEventListener('click', unlock, { once: true });
    window.addEventListener('keydown', unlock, { once: true });
    window.addEventListener('touchstart', unlock, { once: true });
  }

  public startBackgroundMusic() {
    this.initBgmAudio();
    this.isBgmPlaying = true;
    this.notifyBgmListeners();

    if (this.bgmAudio) {
      this.bgmAudio.play().catch(() => {
        // Browser autoplay restriction; will unlock on first user gesture
        this.setupAutoplayUnlock();
      });
    }
  }

  public stopBackgroundMusic() {
    if (this.bgmAudio) {
      try {
        this.bgmAudio.pause();
      } catch {
        // ignore
      }
    }
    this.isBgmPlaying = false;
    this.notifyBgmListeners();
  }

  public toggleBackgroundMusic() {
    this.triggerHaptic(HAPTIC_STYLE.SELECTION);
    if (this.isBgmPlaying) {
      this.stopBackgroundMusic();
    } else {
      this.startBackgroundMusic();
      if (this.bgmAudio && this.bgmAudio.paused) {
        this.bgmAudio.play().catch(() => {});
      }
    }
  }

  public getIsBgmPlaying(): boolean {
    return this.isBgmPlaying;
  }

  public subscribeBgm(listener: (isPlaying: boolean) => void) {
    this.bgmListeners.push(listener);
    listener(this.isBgmPlaying);
    return () => {
      this.bgmListeners = this.bgmListeners.filter((l) => l !== listener);
    };
  }

  private notifyBgmListeners() {
    this.bgmListeners.forEach((l) => l(this.isBgmPlaying));
  }

  public stopAllVoice() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.stopNeuralEntrainment();
  }
}

export const HAPTIC_STYLE = {
  SELECTION: 'selection',
  LIGHT: 'light',
  MEDIUM: 'medium',
  HEAVY: 'heavy',
  SUCCESS: 'success',
  WARNING: 'warning',
} as const;

export type HapticStyle = typeof HAPTIC_STYLE[keyof typeof HAPTIC_STYLE];

export const NEUTRAL_ENVIRONMENT_TYPE = {
  ALPHA: 'alpha',
  BROWN: 'brown',
  BOTH: 'both',
} as const;

export type NeutralEnvironmentType = typeof NEUTRAL_ENVIRONMENT_TYPE[keyof typeof NEUTRAL_ENVIRONMENT_TYPE]

export const audioService = new AudioMatrixService();
