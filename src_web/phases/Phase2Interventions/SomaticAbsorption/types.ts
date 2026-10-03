import { Language, SkyTimePeriod } from '../../../types';

export type { Particle } from '../../../utils';

export interface SomaticAbsorptionProps {
  onComplete: () => void;
  lang?: Language;
  skyPeriod?: SkyTimePeriod;
}

export interface PointerPos {
  x: number;
  y: number;
}

export type SomaticTempState = 'cold' | 'active' | 'warm';
