import React from 'react';
import { Volume2 } from 'lucide-react';
import type { IconProps } from '../types';

export const VolumeIcon: React.FC<IconProps> = (props) => {
  return <Volume2 {...props} />;
};

export default VolumeIcon;
