import React from 'react';
import styles from './styles.module.scss';

export interface MindfullLogoProps {
  variant?: 'color' | 'white' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  fontSize?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const MindfullLogo: React.FC<MindfullLogoProps> = ({
  variant = 'color',
  size = 'sm',
  fontSize: customFontSize,
  className = '',
  style,
}) => {
  const getSizeClass = () => {
    switch (size) {
      case 'lg': return styles.sizeLg;
      case 'md': return styles.sizeMd;
      case 'sm':
      default: return styles.sizeSm;
    }
  };

  const textColor = variant === 'white' ? '#FFFFFF' : '#00C4B3';
  const heartColor = variant === 'white' ? '#FFFFFF' : '#1F77DF';
  const smileColor = variant === 'white' ? '#FFFFFF' : '#1F77DF';

  const inlineStyles: React.CSSProperties = {
    ...style,
    ...(customFontSize ? { fontSize: `${customFontSize}px` } : {}),
  };

  return (
    <div className={`${styles.logo} ${getSizeClass()} ${className}`} style={inlineStyles}>
      <span style={{ color: textColor }}>m</span>

      {/* 'i' with cute heart dot */}
      <span className={styles.letterIWrapper}>
        <svg
          viewBox="0 0 16 16"
          className={styles.heartDot}
          fill={heartColor}
        >
          <path d="M 8 13.5 C 7.5 13 2 9.2 2 5.5 C 2 3.5 3.5 2 5.5 2 C 6.8 2 7.5 2.7 8 3.4 C 8.5 2.7 9.2 2 10.5 2 C 12.5 2 14 3.5 14 5.5 C 14 9.2 8.5 13 8 13.5 Z" />
        </svg>
        <span style={{ color: textColor }}>ı</span>
      </span>

      <span style={{ color: textColor }}>ndf</span>

      {/* 'u' replaced by cute smiling face */}
      <span className={styles.smileyWrapper}>
        <svg
          viewBox="0 0 20 16"
          className={styles.smileyIcon}
          fill="none"
        >
          <circle cx="5" cy="4.5" r="2" fill={smileColor} />
          <circle cx="15" cy="4.5" r="2" fill={smileColor} />
          <path
            d="M 5 9.5 Q 10 15 15 9.5"
            stroke={smileColor}
            strokeWidth="2.4"
            strokeLinecap="round"
          />
        </svg>
      </span>

      <span style={{ color: textColor }}>ll</span>
    </div>
  );
};

export default MindfullLogo;
