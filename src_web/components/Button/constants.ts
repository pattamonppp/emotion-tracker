export const BUTTON_VARIANT = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  OUTLINE: 'outline',
  GHOST: 'ghost',
  LINK: 'link',
  ICON_ONLY: 'icon-only',
} as const;

export type ButtonVariant = (typeof BUTTON_VARIANT)[keyof typeof BUTTON_VARIANT];

export const BUTTON_THEME = {
  TURQUOISE: 'turquoise',
  BLUE: 'blue',
  RED: 'red',
  NEUTRAL: 'neutral',
} as const;

export type ButtonTheme = (typeof BUTTON_THEME)[keyof typeof BUTTON_THEME];

export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';
export type ButtonShape = 'pill' | 'rounded' | 'circle';
