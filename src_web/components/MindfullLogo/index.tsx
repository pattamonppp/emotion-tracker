import React from 'react';
import styles from './styles.module.scss';

export interface MindfullLogoProps {
  variant?: 'color' | 'white' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const MindfullLogo: React.FC<MindfullLogoProps> = ({
  variant = 'color',
  size = 'md',
  className = '',
}) => {
  const getSizeClass = () => {
    switch (size) {
      case 'sm': return styles.sizeSm;
      case 'lg': return styles.sizeLg;
      case 'md':
      default: return styles.sizeMd;
    }
  };

  const textColor = variant === 'white' ? '#FFFFFF' : '#00C4B3';
  const heartColor = variant === 'white' ? '#FFFFFF' : '#1F77DF';
  const smileColor = variant === 'white' ? '#FFFFFF' : '#1F77DF';

  return (
    <div className={`${styles.logo} ${getSizeClass()} ${className}`}>
      <span style={{ color: textColor }}>m</span>
      
      {/* 'i' with cute heart dot */}
      <span className={styles.letterIWrapper}>
        <svg 
          viewBox="0 0 16 16" 
          className={styles.heartDot}
          fill={heartColor}
        >
          <path d="M8 14s-6-3.8-6-7.5A3.5 3.5 0 0 1 8 3.8a3.5 3.5 0 0 1 6 2.7C14 10.2 8 14 8 14z" />
        </svg>
        <span style={{ color: textColor }}>i</span>
      </span>

      <span style={{ color: textColor }}>ndf</span>

      {/* 'u' with smiling face */}
      <span className={styles.letterUWrapper}>
        <span style={{ color: textColor }}>u</span>
        <svg 
          viewBox="0 0 24 12" 
          className={styles.smileCurve}
          fill="none" 
          stroke={smileColor} 
          strokeWidth="2.5" 
          strokeLinecap="round"
        >
          <path d="M 3 2 Q 12 11 21 2" />
        </svg>
      </span>

      <span style={{ color: textColor }}>ll</span>
    </div>
  );
};

export default MindfullLogo;
