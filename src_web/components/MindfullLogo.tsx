import React from 'react';

interface MindfullLogoProps {
  variant?: 'color' | 'white' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const MindfullLogo: React.FC<MindfullLogoProps> = ({
  variant = 'color',
  size = 'md',
  className = '',
}) => {
  const getScale = () => {
    switch (size) {
      case 'sm': return 'h-6 text-sm';
      case 'lg': return 'h-10 text-2xl';
      case 'md':
      default: return 'h-7 text-lg';
    }
  };

  const textColor = variant === 'white' ? '#FFFFFF' : '#00C4B3';
  const heartColor = variant === 'white' ? '#FFFFFF' : '#1F77DF';
  const smileColor = variant === 'white' ? '#FFFFFF' : '#1F77DF';

  return (
    <div className={`inline-flex items-center select-none font-bold tracking-tight font-display ${getScale()} ${className}`}>
      <span style={{ color: textColor }}>m</span>
      
      {/* 'i' with cute heart dot */}
      <span className="relative inline-flex flex-col items-center">
        <svg 
          viewBox="0 0 16 16" 
          className="w-2.5 h-2.5 absolute -top-2.5" 
          fill={heartColor}
        >
          <path d="M8 14s-6-3.8-6-7.5A3.5 3.5 0 0 1 8 3.8a3.5 3.5 0 0 1 6 2.7C14 10.2 8 14 8 14z" />
        </svg>
        <span style={{ color: textColor }}>i</span>
      </span>

      <span style={{ color: textColor }}>ndf</span>

      {/* 'u' with smiling face */}
      <span className="relative inline-flex flex-col items-center">
        <span style={{ color: textColor }}>u</span>
        <svg 
          viewBox="0 0 24 12" 
          className="w-3.5 h-2 absolute -bottom-1"
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
