import type { ButtonHTMLAttributes, ReactNode } from 'react';
import cn from 'classnames';
import { BUTTON_VARIANT, type ButtonVariant, type ButtonSize } from './constants';
import styles from './styles.module.scss';

export { BUTTON_VARIANT, type ButtonVariant, type ButtonSize } from './constants';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  iconEnd?: ReactNode;
}

export function Button({
  variant = BUTTON_VARIANT.PRIMARY,
  size = 'md',
  icon,
  iconEnd,
  children,
  className,
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(styles.button, styles[variant], styles[size], className)}
      {...rest}
    >
      {icon}
      {children}
      {iconEnd}
    </button>
  );
}
