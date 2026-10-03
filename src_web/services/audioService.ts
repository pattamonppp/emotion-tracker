/**
 * Zero-Latency Audio Matrix & Acoustic Engineering
 * Layer 1: Neural Entrainment Soundscapes (Binaural Beats Alpha 8-12Hz, Brownian Noise, Healing Drones)
 * Layer 2: Tactile Sensation & Audio Synthesis (Friction rubbing, Liquid pouring/gulping, Tension clacks, Chimes)
 * Layer 3: MBTI Voice Sanctuary (Curated pre-generated vocal soothing & affirmations in Thai/English)
 */

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
    style:
      | 'light'
      | 'medium'
      | 'heavy'
      | 'selection'
      | 'success'
      | 'warning'
      | number
      | number[] = 'medium',
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

      const patterns: Record<
        'light' | 'medium' | 'heavy' | 'selection' | 'success' | 'warning',
        number | number[]
      > = {
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

  // Tactile Glass Clink (for dropping emotion clouds into glass jar)
  public playJarDrop() {
    this.initContext();
    if (!this.ctx) return;
    // this.triggerHaptic([30, 20, 40]);

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(1760, now + 0.08);
    osc.frequency.exponentialRampToValueAtTime(440, now + 0.35);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.36);
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
  public startNeuralEntrainment(type: 'alpha' | 'brown' | 'both' = 'both') {
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
  public playVoiceSanctuary(text: string, lang: 'th' | 'en' = 'th', rate = 0.88) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === 'th' ? 'th-TH' : 'en-US';
      utterance.rate = rate; // slow, grounded pacing
      utterance.pitch = 0.95; // warm, resonant pitch
      window.speechSynthesis.speak(utterance);
    } catch {
      // ignore
    }
  }

  private isBgmPlaying = false;
  private bgmListeners: Array<(isPlaying: boolean) => void> = [];
  private bgmGain: GainNode | null = null;
  private bgmOscs: OscillatorNode[] = [];

  public startBackgroundMusic() {
    if (this.isBgmPlaying) return;
    this.initContext();
    if (!this.ctx) {
      this.isBgmPlaying = true;
      this.notifyBgmListeners();
      return;
    }

    try {
      const now = this.ctx.currentTime;
      this.bgmGain = this.ctx.createGain();
      this.bgmGain.gain.setValueAtTime(0.001, now);
      this.bgmGain.gain.linearRampToValueAtTime(0.08, now + 1.5);
      this.bgmGain.connect(this.ctx.destination);

      // Soothing warm ambient chords (Cmaj9: C3, G3, B3, D4, E4)
      const freqs = [130.81, 196.0, 246.94, 293.66, 329.63];
      this.bgmOscs = freqs.map((f, i) => {
        const osc = this.ctx!.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f + (i % 2 === 0 ? 0.3 : -0.3), now);
        osc.connect(this.bgmGain!);
        osc.start(now);
        return osc;
      });

      this.isBgmPlaying = true;
      this.notifyBgmListeners();
    } catch {
      this.isBgmPlaying = true;
      this.notifyBgmListeners();
    }
  }

  public stopBackgroundMusic() {
    if (!this.isBgmPlaying) return;
    if (this.ctx && this.bgmGain) {
      const now = this.ctx.currentTime;
      this.bgmGain.gain.linearRampToValueAtTime(0.001, now + 0.6);
      setTimeout(() => {
        this.bgmOscs.forEach((osc) => {
          try {
            osc.stop();
            osc.disconnect();
          } catch {
            // ignore
          }
        });
        this.bgmOscs = [];
      }, 700);
    }
    this.isBgmPlaying = false;
    this.notifyBgmListeners();
  }

  public toggleBackgroundMusic() {
    this.triggerHaptic('selection');
    if (this.isBgmPlaying) {
      this.stopBackgroundMusic();
    } else {
      this.startBackgroundMusic();
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

export const audioService = new AudioMatrixService();
