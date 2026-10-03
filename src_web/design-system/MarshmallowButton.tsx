import React, { useState } from 'react';
import classNames from 'classnames';
import { audioService } from '../services/audioService';
import styles from './MarshmallowButton.module.scss';

export interface MarshmallowButtonProps {
  onPress?: () => void;
  onClick?: () => void;
  title?: string;
  children?: React.ReactNode;
  variant?:
  | 'primary'
  | 'secondary'
  | 'softCream'
  | 'outline'
  | 'ghost'
  | 'mint'
  | 'pink';
  size?: 'sm' | 'md' | 'lg';
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
  variant = 'primary',
  size = 'md',
  style,
  textStyle,
  className,
  disabled = false,
  icon,
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const handleClick = (
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault();

    if (disabled) {
      return;
    }

    // Execute the actual action first.
    // Haptic/audio feedback should never prevent the action.
    onPress?.();
    onClick?.();

    // Haptic feedback is optional and must not break button actions.
    try {
      audioService.triggerHaptic('selection');
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
      audioService.triggerHaptic('light');
    } catch {
      // Ignore haptic errors in web environments.
    }
  };

  const handlePointerUp = () => {
    setIsPressed(false);
  };

  const variantClass =
    styles[`variant_${variant}`] || styles.variant_primary;

  const sizeClass =
    styles[`size_${size}`] || styles.size_md;

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
        {icon}

        {title ? (
          <span
            className={styles.text}
            style={textStyle}
          >
            {title}
          </span>
        ) : null}

        {children}
      </button>
    </div>
  );
};

export default MarshmallowButton;
