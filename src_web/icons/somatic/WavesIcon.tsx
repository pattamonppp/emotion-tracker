import React from 'react';
import { Waves } from 'lucide-react';
import type { IconProps } from '../types';

export const WavesIcon: React.FC<IconProps> = (props) => {
  return <Waves {...props} />;
};

export default WavesIcon;
