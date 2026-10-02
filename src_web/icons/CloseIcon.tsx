import React from 'react';
import { X } from 'lucide-react';
import type { IconProps } from './types';

export const CloseIcon: React.FC<IconProps> = (props) => {
  return <X {...props} />;
};

export default CloseIcon;
