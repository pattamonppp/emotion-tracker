import React from 'react';
import { Sliders } from 'lucide-react';
import type { IconProps } from './types';

export const SlidersIcon: React.FC<IconProps> = (props) => {
  return <Sliders {...props} />;
};

export default SlidersIcon;
