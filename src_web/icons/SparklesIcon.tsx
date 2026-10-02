import React from 'react';
import { Sparkles } from 'lucide-react';
import type { IconProps } from './types';

export const SparklesIcon: React.FC<IconProps> = (props) => {
  return <Sparkles {...props} />;
};

export default SparklesIcon;
