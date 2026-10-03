import { ACTIVITY_TYPE, SkyTimePeriod, Language } from '../../../types';

export interface KineticShakerProps {
  onComplete: () => void;
  lang: Language;
  activityType?: typeof ACTIVITY_TYPE.SHAKE | typeof ACTIVITY_TYPE.JUMP;
  skyPeriod?: SkyTimePeriod;
}
