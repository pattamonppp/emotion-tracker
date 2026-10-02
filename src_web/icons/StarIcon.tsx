import React from 'react';
import { Star } from 'lucide-react';
import type { IconProps } from './types';

export const StarIcon: React.FC<IconProps> = (props) => {
  return <Star {...props} />;
};

export default StarIcon;
