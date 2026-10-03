import { ACTIVITY_TYPE, SkyTimePeriod } from '../../../types';

export interface KineticShakerProps {
  onComplete: () => void;
  lang: 'th' | 'en';
  activityType?: typeof ACTIVITY_TYPE.SHAKE | typeof ACTIVITY_TYPE.JUMP;
  skyPeriod?: SkyTimePeriod;
}
