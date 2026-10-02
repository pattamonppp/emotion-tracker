export type { Particle } from '../../../utils';

export interface SomaticAbsorptionProps {
  onComplete: () => void;
  lang?: 'th' | 'en';
}

export interface PointerPos {
  x: number;
  y: number;
}

export type SomaticTempState = 'cold' | 'active' | 'warm';
