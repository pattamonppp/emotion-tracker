import { MBTIType, SkyTimePeriod, ACTIVITY_TYPE } from '../../types';
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
  activityType?: typeof ACTIVITY_TYPE.SHAKE | typeof ACTIVITY_TYPE.JUMP;
}

export interface AudioMatrixSanctuaryProps extends BaseInterventionProps {
  mbti?: MBTIType;
}

export interface SomaticBreathingPacerProps extends BaseInterventionProps {
  pattern?: 'box' | 'relax478';
}

export type BreathingPhase = 'inhale' | 'hold' | 'exhale' | 'holdEmpty';

export interface CelestialParticle {
  x: number;
  y: number;
  size: number;
  colorIndex: number;
  opacity: number;
}
