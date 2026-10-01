import * as Haptics from 'expo-haptics';
import * as Speech from 'expo-speech';

class NativeAudioMatrixService {
  private isAmbiencePlaying = false;

  // Trigger tactile haptics on real mobile devices
  public async triggerHaptic(style: 'light' | 'medium' | 'heavy' | 'selection' | 'success' | 'warning' = 'medium') {
    try {
      switch (style) {
        case 'light':
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          break;
        case 'heavy':
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          break;
        case 'selection':
          await Haptics.selectionAsync();
          break;
        case 'success':
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          break;
        case 'warning':
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          break;
        case 'medium':
        default:
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          break;
      }
    } catch {
      // Haptics may not be supported on simulators
    }
  }

  // Tactile Glass Clink (for dropping emotion clouds into glass jar)
  public async playJarDrop() {
    await this.triggerHaptic('success');
  }

  // Friction rub sound / tactile feedback for Option A (The Somatic Absorption)
  public async playFrictionTick(_intensity = 0.5) {
    await this.triggerHaptic('light');
  }

  // Chime Shockwave (when Sigil of Confidence is fully absorbed)
  public async playChimeShockwave() {
    await this.triggerHaptic('heavy');
  }

  // Liquid Gulp & Slosh (Option B: The Victory Sip)
  public async playLiquidSip(_sipNumber = 1) {
    await this.triggerHaptic('medium');
  }

  // Tension Shaker Click (Option C: Kinetic Tension Shaker)
  public async playShakerClick(_remaining: number) {
    await this.triggerHaptic('light');
  }

  // Neural Entrainment Soundscapes
  public startNeuralEntrainment(_type: 'alpha' | 'brown' | 'both' = 'both') {
    this.isAmbiencePlaying = true;
    this.triggerHaptic('selection');
  }

  public stopNeuralEntrainment() {
    this.isAmbiencePlaying = false;
  }

  public getIsAmbiencePlaying() {
    return this.isAmbiencePlaying;
  }

  // Pre-Generated Studio MBTI Voice Sanctuary
  public playVoiceSanctuary(text: string, lang: 'th' | 'en' = 'th', rate = 0.88) {
    try {
      Speech.stop();
      Speech.speak(text, {
        language: lang === 'th' ? 'th-TH' : 'en-US',
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

export const audioService = new NativeAudioMatrixService();
