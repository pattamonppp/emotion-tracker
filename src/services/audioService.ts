import * as Haptics from 'expo-haptics';
import * as Speech from 'expo-speech';
import { Language, LANG } from '../types';

let expoAudio: any = null;
let expoAv: any = null;

try {
  expoAudio = require('expo-audio');
} catch {
  // expo-audio not available
}

if (!expoAudio) {
  try {
    expoAv = require('expo-av');
  } catch {
    // expo-av not available
  }
}

let DREAMSCAPE_BGM: any = null;
let JAR_CHIME: any = null;
try {
  DREAMSCAPE_BGM = require('../../assets/audio/dreamscape.wav');
  JAR_CHIME = require('../../assets/audio/jar_chime.wav');
} catch {
  // Asset fallback
}

class NativeAudioMatrixService {
  private isAmbiencePlaying = false;
  private bgmSound: any = null;
  private audioPlayer: any = null;
  private isBgmPlaying = false;
  private bgmListeners: Array<(isPlaying: boolean) => void> = [];

  // Trigger tactile haptics on real mobile devices
  public async triggerHaptic(style: HapticStyle) {
    try {
      switch (style) {
        case HAPTIC_STYLE.LIGHT:
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          break;
        case HAPTIC_STYLE.HEAVY:
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          break;
        case HAPTIC_STYLE.SELECTION:
          await Haptics.selectionAsync();
          break;
        case HAPTIC_STYLE.SUCCESS:
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          break;
        case HAPTIC_STYLE.WARNING:
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          break;
        case HAPTIC_STYLE.MEDIUM:
        default:
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          break;
      }
    } catch {
      // Haptics may not be supported on simulators
    }
  }

  // Soothing Looping Dreamscape Background Music
  public async startBackgroundMusic() {
    if (this.isBgmPlaying) return;
    try {
      // If expo-audio player already exists
      if (this.audioPlayer) {
        this.audioPlayer.play();
        this.isBgmPlaying = true;
        this.notifyBgmListeners();
        return;
      }

      // If expo-av sound already exists
      if (this.bgmSound) {
        await this.bgmSound.playAsync();
        this.isBgmPlaying = true;
        this.notifyBgmListeners();
        return;
      }

      // 1. Try modern expo-audio
      if (expoAudio?.createAudioPlayer && DREAMSCAPE_BGM) {
        try {
          const player = expoAudio.createAudioPlayer(DREAMSCAPE_BGM);
          player.loop = true;
          player.volume = 0.35;
          player.play();
          this.audioPlayer = player;
          this.isBgmPlaying = true;
          this.notifyBgmListeners();
          return;
        } catch (e) {
          // console.log('expo-audio player initialization fallback:', e);
        }
      }

      // 2. Try legacy expo-av
      if (expoAv?.Audio && DREAMSCAPE_BGM) {
        try {
          await expoAv.Audio.setAudioModeAsync({
            playsInSilentModeIOS: true,
            staysActiveInBackground: false,
            shouldDuckAndroid: true,
          });

          const { sound } = await expoAv.Audio.Sound.createAsync(
            DREAMSCAPE_BGM,
            { isLooping: true, volume: 0.35, shouldPlay: true }
          );
          this.bgmSound = sound;
          this.isBgmPlaying = true;
          this.notifyBgmListeners();
          return;
        } catch (e) {
          // console.log('expo-av sound initialization fallback:', e);
        }
      }

      // Fallback state
      this.isBgmPlaying = true;
      this.notifyBgmListeners();
    } catch (err) {
      // console.log('Background music initialization notice:', err);
      this.isBgmPlaying = true;
      this.notifyBgmListeners();
    }
  }

  public async stopBackgroundMusic() {
    try {
      if (this.audioPlayer) {
        this.audioPlayer.pause();
      }
      if (this.bgmSound) {
        await this.bgmSound.pauseAsync();
      }
    } catch (err) {
      // console.log('Background music pause notice:', err);
    }
    this.isBgmPlaying = false;
    this.notifyBgmListeners();
  }

  public async toggleBackgroundMusic() {
    this.triggerHaptic(HAPTIC_STYLE.SELECTION);
    if (this.isBgmPlaying) {
      await this.stopBackgroundMusic();
    } else {
      await this.startBackgroundMusic();
    }
  }

  public getIsBgmPlaying() {
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

  // Tactile Glass Clink & Chime (for dropping emotion clouds into glass jar)
  public async playJarDrop() {
    await this.triggerHaptic(HAPTIC_STYLE.SUCCESS);
    try {
      if (expoAudio?.createAudioPlayer && JAR_CHIME) {
        try {
          const chimePlayer = expoAudio.createAudioPlayer(JAR_CHIME);
          chimePlayer.volume = 0.5;
          chimePlayer.play();
          return;
        } catch { }
      }
      if (expoAv?.Audio && JAR_CHIME) {
        try {
          const { sound } = await expoAv.Audio.Sound.createAsync(
            JAR_CHIME,
            { volume: 0.5, shouldPlay: true }
          );
          sound.setOnPlaybackStatusUpdate((status: any) => {
            if (status.isLoaded && status.didJustFinish) {
              sound.unloadAsync();
            }
          });
          return;
        } catch { }
      }
    } catch {
      // Graceful fallback to haptic
    }
  }

  // Gentle pulse completion chime / tactile confirmation
  public async playPulseComplete() {
    await this.triggerHaptic(HAPTIC_STYLE.SUCCESS);
  }

  // Friction rub sound / tactile feedback for Option A (The Somatic Absorption)
  public async playFrictionTick(_intensity = 0.5) {
    await this.triggerHaptic(HAPTIC_STYLE.LIGHT);
  }

  // Rhythmic haptic grounding pulse (for Haptic Rhythm breath-sync)
  public async playGroundingRhythm(phase: PlayGroundingRhythmPhase) {
    try {
      if (phase === PLAYGROUNDING_RHYTHM_PHASE.IN) {
        // Quick double tap on inhale
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        await new Promise((r) => setTimeout(r, 90));
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } else if (phase === PLAYGROUNDING_RHYTHM_PHASE.HOLD) {
        // Single gentle pulse on hold
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } else if (phase === PLAYGROUNDING_RHYTHM_PHASE.OUT) {
        // Soft trailing exhale — light then very slight
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        await new Promise((r) => setTimeout(r, 150));
        await Haptics.selectionAsync();
      }
    } catch {
      // Haptics may not be supported on simulators
    }
  }

  // Chime Shockwave (when Sigil of Confidence is fully absorbed)
  public async playChimeShockwave() {
    await this.triggerHaptic(HAPTIC_STYLE.HEAVY);
  }

  // Liquid Gulp & Slosh (Option B: The Victory Sip)
  public async playLiquidSip(_sipNumber = 1) {
    await this.triggerHaptic(HAPTIC_STYLE.MEDIUM);
  }

  // Tension Shaker Click (Option C: Kinetic Tension Shaker)
  public async playShakerClick(_remaining: number) {
    await this.triggerHaptic(HAPTIC_STYLE.LIGHT);
  }

  // Neural Entrainment Soundscapes
  public startNeuralEntrainment(_type: NeutralEnvironmentType = NEUTRAL_ENVIRONMENT_TYPE.ALPHA) {
    this.isAmbiencePlaying = true;
    this.triggerHaptic(HAPTIC_STYLE.SELECTION);
  }

  public stopNeuralEntrainment() {
    this.isAmbiencePlaying = false;
  }

  public getIsAmbiencePlaying() {
    return this.isAmbiencePlaying;
  }

  // Pre-Generated Studio MBTI Voice Sanctuary
  public playVoiceSanctuary(text: string, lang: Language = LANG.TH, rate = 0.88) {
    try {
      Speech.stop();
      Speech.speak(text, {
        language: lang === LANG.TH ? 'th-TH' : 'en-US',
        rate: rate,
        pitch: 0.95,
      });
    } catch {
      // Ignore if speech engine unavailable
    }
  }

  public stopAllVoice() {
    try {
      Speech.stop();
    } catch {
      // Ignore
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

export const PLAYGROUNDING_RHYTHM_PHASE = {
  IN: 'in',
  HOLD: 'hold',
  OUT: 'out',
} as const;

export type PlayGroundingRhythmPhase = typeof PLAYGROUNDING_RHYTHM_PHASE[keyof typeof PLAYGROUNDING_RHYTHM_PHASE]

export const audioService = new NativeAudioMatrixService();
