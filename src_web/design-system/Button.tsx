import React from 'react';
import { Loader2 } from 'lucide-react';

export type ButtonVariant = 'primary' | 'secondary' | 'text' | 'icon-only';
export type ButtonColorTheme = 'turquoise' | 'blue' | 'red';
export type ButtonRadius = '8px' | '24px' | 'circle';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  colorTheme?: ButtonColorTheme;
  radius?: ButtonRadius;
  isLoading?: boolean;
  isDisabled?: boolean;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  loadingIndicator?: React.ReactNode;
  label?: React.ReactNode;
  lang?: 'en' | 'th';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  elevationLevel?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 0;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  colorTheme = 'turquoise',
  radius = '24px',
  isLoading = false,
  isDisabled = false,
  leadingIcon,
  trailingIcon,
  loadingIndicator,
  label,
  children,
  lang = 'th',
  size = 'md',
  fullWidth = false,
  elevationLevel,
  className = '',
  disabled,
  ...restProps
}) => {
  const effectivelyDisabled = isDisabled || disabled || isLoading;

  // Geometry from CI Shapes.png: 8px or 24px rounded rectangle, or 50% circle
  const getRadiusClass = () => {
    if (variant === 'icon-only' || radius === 'circle') return 'rounded-full';
    if (radius === '8px') return 'rounded-[8px]';
    return 'rounded-[24px]'; // 24px actionable standard from CI
  };

  // Size and Touch-target hitbox (Minimum 44px on mobile)
  const getSizeClass = () => {
    if (variant === 'icon-only') {
      switch (size) {
        case 'sm': return 'w-10 h-10 min-w-[40px] min-h-[40px] p-2';
        case 'lg': return 'w-14 h-14 min-w-[56px] min-h-[56px] p-3.5';
        case 'md':
        default: return 'w-12 h-12 min-w-[48px] min-h-[48px] p-3';
      }
    }

    switch (size) {
      case 'sm':
        return 'min-h-[40px] px-4 py-1.5 text-xs';
      case 'lg':
        return 'min-h-[52px] px-7 py-3 text-base';
      case 'md':
      default:
        return 'min-h-[46px] px-6 py-2.5 text-sm';
    }
  };

  // Color Theme & Variant Matrices exactly matching Button.png CI
  const getStyleClass = () => {
    // Disabled state
    if (effectivelyDisabled) {
      return 'opacity-40 cursor-not-allowed pointer-events-none bg-[#C4C4C4]/40 text-[#79ADA9] border border-[#C4C4C4]/50';
    }

    // 1. PRIMARY (solid) from Button.png
    if (variant === 'primary') {
      switch (colorTheme) {
        case 'turquoise':
          return 'bg-[#00C4B3] hover:bg-[#33D0C2] text-white font-semibold active:scale-[0.98] shadow-sm shadow-[#00C4B3]/25';
        case 'blue':
          return 'bg-[#1F77DF] hover:bg-[#62A0E9] text-white font-semibold active:scale-[0.98] shadow-sm shadow-[#1F77DF]/25';
        case 'red':
          return 'bg-[#F26E6E] hover:bg-[#E05252] text-white font-semibold active:scale-[0.98] shadow-sm shadow-[#F26E6E]/25';
      }
    }

    // 2. SECONDARY (outline) from Button.png
    if (variant === 'secondary') {
      switch (colorTheme) {
        case 'turquoise':
          return 'bg-white border-2 border-[#00C4B3] text-[#004D40] hover:bg-[#00C4B3]/10 active:scale-[0.98] shadow-sm';
        case 'blue':
          return 'bg-white border-2 border-[#1F77DF] text-[#1F77DF] hover:bg-[#1F77DF]/10 active:scale-[0.98] shadow-sm';
        case 'red':
          return 'bg-white border-2 border-[#F26E6E] text-[#F26E6E] hover:bg-[#F26E6E]/10 active:scale-[0.98] shadow-sm';
      }
    }

    // 3. TEXT (ghost) from Button.png
    if (variant === 'text') {
      switch (colorTheme) {
        case 'turquoise':
          return 'bg-transparent text-[#004D40] hover:bg-[#00C4B3]/10 active:bg-[#00C4B3]/20';
        case 'blue':
          return 'bg-transparent text-[#1F77DF] hover:bg-[#1F77DF]/10 active:bg-[#1F77DF]/20';
        case 'red':
          return 'bg-transparent text-[#F26E6E] hover:bg-[#F26E6E]/10 active:bg-[#F26E6E]/20';
      }
    }

    // 4. ICON-ONLY
    if (variant === 'icon-only') {
      switch (colorTheme) {
        case 'turquoise':
          return 'bg-[#E6F9F7] text-[#004D40] hover:bg-[#33D0C2]/30 active:scale-95 border border-[#00C4B3]/30';
        case 'blue':
          return 'bg-[#E4EFFB] text-[#1F77DF] hover:bg-[#C7DDF7] active:scale-95 border border-[#1F77DF]/30';
        case 'red':
          return 'bg-[#FAD6D5] text-[#F26E6E] hover:bg-[#FAD6D5]/80 active:scale-95 border border-[#F26E6E]/30';
      }
    }

    return '';
  };

  const getElevationClass = () => {
    if (!elevationLevel) return '';
    return `elevation-${elevationLevel}`;
  };

  const getLanguageClass = () => {
    if (lang === 'th') {
      return 'font-thai tracking-normal leading-normal';
    }
    return 'font-sans tracking-wide';
  };

  const defaultSpinner = (
    <Loader2 className="w-4 h-4 animate-spin shrink-0 text-current" />
  );

  const displayLabel = label ?? children;

  return (
    <button
      disabled={effectivelyDisabled}
      aria-busy={isLoading}
      className={`
        inline-flex items-center justify-center gap-2 font-medium transition-all duration-150 select-none
        ${getRadiusClass()}
        ${getSizeClass()}
        ${getStyleClass()}
        ${getElevationClass()}
        ${getLanguageClass()}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...restProps}
    >
      {/* Loading state indicator from Button.png */}
      {isLoading ? (
        <>
          {loadingIndicator || defaultSpinner}
          {variant !== 'icon-only' && displayLabel && (
            <span className="opacity-90">{displayLabel}</span>
          )}
        </>
      ) : (
        <>
          {leadingIcon && (
            <span className="shrink-0 flex items-center justify-center">
              {leadingIcon}
            </span>
          )}

          {variant !== 'icon-only' && displayLabel && (
            <span className="whitespace-nowrap truncate">{displayLabel}</span>
          )}

          {trailingIcon && (
            <span className="shrink-0 flex items-center justify-center">
              {trailingIcon}
            </span>
          )}
        </>
      )}
    </button>
  );
};
