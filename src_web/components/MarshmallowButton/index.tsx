import React, { useState } from 'react';
import classNames from 'classnames';
import { audioService, HAPTIC_STYLE } from '../../services/audioService';
import { renderBilingual } from '../BilingualText';
import styles from './MarshmallowButton.module.scss';

export const MARSHMALLOW_VARIANT = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  SOFT_CREAM: 'softCream',
  OUTLINE: 'outline',
  GHOST: 'ghost',
  MINT: 'mint',
  PINK: 'pink',
} as const;

export type MarshmallowVariant = typeof MARSHMALLOW_VARIANT[keyof typeof MARSHMALLOW_VARIANT];

export const MARSHMALLOW_SIZE = {
  SM: 'sm',
  MD: 'md',
  LG: 'lg',
} as const;

export type MarshmallowSize = typeof MARSHMALLOW_SIZE[keyof typeof MARSHMALLOW_SIZE];

export interface MarshmallowButtonProps {
  onPress?: () => void;
  onClick?: () => void;
  title?: string;
  children?: React.ReactNode;
  variant?: MarshmallowVariant;
  size?: MarshmallowSize;
  style?: React.CSSProperties;
  textStyle?: React.CSSProperties;
  className?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export const MarshmallowButton: React.FC<MarshmallowButtonProps> = ({
  onPress,
  onClick,
  title,
  children,
  variant = MARSHMALLOW_VARIANT.PRIMARY,
  size = MARSHMALLOW_SIZE.MD,
  style,
  textStyle,
  className,
  disabled = false,
  icon,
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (disabled) {
      return;
    }

    onPress?.();
    onClick?.();

    try {
      audioService.triggerHaptic(HAPTIC_STYLE.SELECTION);
    } catch {
      // Ignore haptic errors in web environments.
    }
  };

  const handlePointerDown = () => {
    if (disabled) {
      return;
    }

    setIsPressed(true);

    try {
      audioService.triggerHaptic(HAPTIC_STYLE.LIGHT);
    } catch {
      // Ignore haptic errors in web environments.
    }
  };

  const handlePointerUp = () => {
    setIsPressed(false);
  };

  const variantClass = styles[`variant_${variant}`] || styles.variant_primary;
  const sizeClass = styles[`size_${size}`] || styles.size_md;

  return (
    <div className={styles.buttonWrapper}>
      <button
        type="button"
        disabled={disabled}
        onClick={handleClick}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className={classNames(
          styles.button,
          variantClass,
          sizeClass,
          {
            [styles.isPressed]: isPressed,
          },
          className,
        )}
        style={style}
      >
        {React.isValidElement(icon)
          ? React.cloneElement(icon as React.ReactElement<any>, {
              color: 'currentColor',
            })
          : icon}

        {title ? (
          <span className={styles.text} style={textStyle}>
            {renderBilingual(title)}
          </span>
        ) : null}

        {typeof children === 'string' ? (
          <span className={styles.text} style={textStyle}>
            {renderBilingual(children)}
          </span>
        ) : (
          children
        )}
      </button>
    </div>
  );
};

export default MarshmallowButton;
