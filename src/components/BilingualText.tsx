import React from 'react';
import { Text, TextProps } from 'react-native';
import { typography } from '../design-system/tokens';

export interface BilingualTextProps extends TextProps {
  children?: React.ReactNode;
  fontPrompt?: string;
  fontGotham?: string;
}

export const renderBilingualNodes = (
  text: string,
  fontPrompt: string = typography.fontPromptRegular,
  fontGotham: string = typography.fontGothamBook
): React.ReactNode => {
  if (!text) return text;
  const hasEnglish = /[a-zA-Z0-9]/.test(text);
  const hasThai = /[\u0E00-\u0E7F]/.test(text);

  if (hasEnglish && hasThai) {
    const parts = text.split(/([a-zA-Z0-9.,!?'"#%&+-]+)/g);
    return parts.map((part, index) => {
      if (!part) return null;
      const isEng = /[a-zA-Z0-9]/.test(part);
      return (
        <Text
          key={index}
          style={{
            fontFamily: isEng ? fontGotham : fontPrompt,
          }}
        >
          {part}
        </Text>
      );
    });
  }

  if (hasEnglish && !hasThai) {
    return <Text style={{ fontFamily: fontGotham }}>{text}</Text>;
  }

  return <Text style={{ fontFamily: fontPrompt }}>{text}</Text>;
};

export const BilingualText: React.FC<BilingualTextProps> = ({
  children,
  style,
  fontPrompt = typography.fontPromptBold,
  fontGotham = typography.fontGothamBold,
  ...rest
}) => {
  if (typeof children === 'string') {
    return (
      <Text style={style} {...rest}>
        {renderBilingualNodes(children, fontPrompt, fontGotham)}
      </Text>
    );
  }

  return (
    <Text style={style} {...rest}>
      {children}
    </Text>
  );
};

export default BilingualText;
