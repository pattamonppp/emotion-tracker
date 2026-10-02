import React from 'react';
import { Mic } from 'lucide-react';
import type { IconProps } from '../types';

export const MicIcon: React.FC<IconProps> = (props) => {
  return <Mic {...props} />;
};

export default MicIcon;
