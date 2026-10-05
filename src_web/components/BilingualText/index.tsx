import React from 'react';

export function renderBilingual(text: string | null | undefined): React.ReactNode {
  if (!text) return text;
  
  const hasEnglish = /[a-zA-Z0-9]/.test(text);
  const hasThai = /[\u0E00-\u0E7F]/.test(text);

  if (hasEnglish && hasThai) {
    const parts = text.split(/([a-zA-Z0-9.,!?'"#%&+-]+)/g);
    return (
      <>
        {parts.map((part, index) => {
          if (!part) return null;
          const isEng = /[a-zA-Z0-9]/.test(part);
          if (isEng) {
            return (
              <span
                key={index}
                style={{
                  fontFamily: "'Gotham Rounded', sans-serif",
                  fontWeight: 'inherit',
                }}
              >
                {part}
              </span>
            );
          }
          return <span key={index}>{part}</span>;
        })}
      </>
    );
  }

  if (hasEnglish && !hasThai) {
    return (
      <span
        style={{
          fontFamily: "'Gotham Rounded', sans-serif",
          fontWeight: 'inherit',
        }}
      >
        {text}
      </span>
    );
  }

  return (
    <span
      style={{
        fontFamily: "'Prompt', sans-serif",
        fontWeight: 'inherit',
      }}
    >
      {text}
    </span>
  );
}

export const BilingualText: React.FC<{
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}> = ({ children, className, style }) => {
  if (typeof children === 'string') {
    return (
      <span className={className} style={style}>
        {renderBilingual(children)}
      </span>
    );
  }
  return (
    <span className={className} style={style}>
      {children}
    </span>
  );
};

export default BilingualText;
