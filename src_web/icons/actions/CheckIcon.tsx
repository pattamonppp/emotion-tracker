import React from 'react';
import { Check } from 'lucide-react';
import type { IconProps } from '../types';

export const CheckIcon: React.FC<IconProps> = (props) => {
  return <Check {...props} />;
};

export default CheckIcon;
