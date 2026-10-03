import { Language, SkyTimePeriod } from '../../../types';

export interface VictorySipProps {
  onComplete: () => void;
  lang: Language;
  skyPeriod?: SkyTimePeriod;
}
