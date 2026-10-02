import React from 'react';
import { Radio } from 'lucide-react';
import type { IconProps } from './types';

export const RadioIcon: React.FC<IconProps> = (props) => {
  return <Radio {...props} />;
};

export default RadioIcon;
