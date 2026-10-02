import { MBTIType, SkyTimePeriod } from '../../types';
import { Language } from '../../locales';

export interface BaseInterventionProps {
  onComplete: () => void;
  lang: Language;
}

export interface SomaticAbsorptionProps extends BaseInterventionProps {
  skyPeriod?: SkyTimePeriod;
}

export interface VictorySipProps extends BaseInterventionProps { }

export interface KineticShakerProps extends BaseInterventionProps {
  activityType?: 'shake' | 'jump';
}

export interface AudioMatrixSanctuaryProps extends BaseInterventionProps {
  mbti?: MBTIType;
}

export interface SomaticBreathingPacerProps extends BaseInterventionProps {
  pattern?: 'box' | '478';
}

export type BreathingPhase = 'inhale' | 'hold' | 'exhale' | 'holdEmpty';

export interface CelestialParticle {
  x: number;
  y: number;
  size: number;
  colorIndex: number;
  opacity: number;
}