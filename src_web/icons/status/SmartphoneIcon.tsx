import React from 'react';
import { Smartphone } from 'lucide-react';
import type { IconProps } from '../types';

export const SmartphoneIcon: React.FC<IconProps> = (props) => {
  return <Smartphone {...props} />;
};

export default SmartphoneIcon;
