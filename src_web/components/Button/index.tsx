import React from 'react';
import cn from 'classnames';
import { Loader2 } from 'lucide-react';
import {
  BUTTON_VARIANT,
  BUTTON_THEME,
  type ButtonVariant,
  type ButtonTheme,
  type ButtonSize,
  type ButtonShape,
} from './constants';
import styles from './styles.module.scss';

export {
  BUTTON_VARIANT,
  BUTTON_THEME,
  type ButtonVariant,
  type ButtonTheme,
  type ButtonSize,
  type ButtonShape,
} from './constants';

export type ButtonColorTheme = ButtonTheme;
export type ButtonRadius = '8px' | '24px' | 'circle';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  theme?: ButtonTheme;
  colorTheme?: ButtonTheme; // Backward compatibility
  size?: ButtonSize;
  shape?: ButtonShape;
  radius?: '8px' | '24px' | 'circle'; // Backward compatibility
  isLoading?: boolean;
  isDisabled?: boolean;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  icon?: React.ReactNode;
  iconEnd?: React.ReactNode;
  loadingIndicator?: React.ReactNode;
  label?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = BUTTON_VARIANT.PRIMARY,
    theme,
    colorTheme = BUTTON_THEME.TURQUOISE,
    size = 'md',
    shape,
    radius,
    isLoading = false,
    isDisabled = false,
    leadingIcon,
    trailingIcon,
    icon,
    iconEnd,
    loadingIndicator,
    label,
    fullWidth = false,
    children,
    className,
    disabled,
    type = 'button',
    ...rest
  },
  ref,
) {
  const activeTheme = theme ?? colorTheme;

  // Resolve shape
  let resolvedShape: ButtonShape = shape ?? 'pill';
  if (radius === '8px') resolvedShape = 'rounded';
  if (radius === 'circle' || variant === BUTTON_VARIANT.ICON_ONLY) resolvedShape = 'circle';

  const effectivelyDisabled = isDisabled || disabled || isLoading;
  const startIcon = leadingIcon ?? icon;
  const endIcon = trailingIcon ?? iconEnd;
  const content = label ?? children;

  const variantClass = variant === BUTTON_VARIANT.ICON_ONLY ? styles.iconOnly : styles[variant];

  return (
    <button
      ref={ref}
      type={type}
      disabled={effectivelyDisabled}
      aria-busy={isLoading}
      className={cn(
        styles.button,
        styles[activeTheme],
        variantClass,
        styles[size],
        styles[resolvedShape],
        {
          [styles.fullWidth]: fullWidth,
          [styles.loading]: isLoading,
          [styles.disabled]: effectivelyDisabled,
        },
        className,
      )}
      {...rest}
    >
      {isLoading ? (
        <>
          {loadingIndicator || <Loader2 className={cn(styles.spinner, 'w-4 h-4')} />}
          {variant !== BUTTON_VARIANT.ICON_ONLY && content && (
            <span>{content}</span>
          )}
        </>
      ) : (
        <>
          {startIcon}
          {variant !== BUTTON_VARIANT.ICON_ONLY && content && (
            <span>{content}</span>
          )}
          {endIcon}
        </>
      )}
    </button>
  );
});

export default Button;
