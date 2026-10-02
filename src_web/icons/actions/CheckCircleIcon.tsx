import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import type { IconProps } from '../types';

export const CheckCircleIcon: React.FC<IconProps> = (props) => {
  return <CheckCircle2 {...props} />;
};

export default CheckCircleIcon;
