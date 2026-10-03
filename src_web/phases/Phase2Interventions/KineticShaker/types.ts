export interface KineticShakerProps {
  onComplete: () => void;
  lang: 'th' | 'en';
  activityType?: 'shake' | 'jump';
  skyPeriod?: 'dawn' | 'day' | 'sunset' | 'night';
}
