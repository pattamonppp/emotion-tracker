export interface VictorySipProps {
  onComplete: () => void;
  lang: 'th' | 'en';
  skyPeriod?: 'dawn' | 'day' | 'sunset' | 'night';
}
